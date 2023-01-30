import express, { Express, Request, response, Response } from "express";
import dotenv from "dotenv";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import {
  ConnectionCheckOutFailedEvent,
  Db,
  MongoClient,
  ObjectId,
} from "mongodb";
import {
  contracts,
  parseReceipt,
  completeQuestReceipt,
  updateEngageScoresAndCommunity,
  updateUserQuests,
  updateUserBadges,
  updateGroupEngageScore,
  updateGroupQuests,
  updateGroupBadges,
} from "./utils/utils";
import { ethers, providers, Wallet } from "ethers";
import { connect } from "http2";
// import { compileSolidityCode, findTopMatches ,buildTxPayload, getDiamondFacetsAndFunctions, getDiamondLogs, generateSelectorsData} from "./utils/utils";
// import { Providers } from "./utils/providers";
const cors = require("cors");
const fetch = require("node-fetch");
const nodeMailer = require("nodemailer");
const Validator = require("sns-payload-validator");

dotenv.config();
const corsOptions = {
  origin: "http://localhost:9000", // TODO : Add custom domain
  optionsSuccessStatus: 200,
};

const app: Express = express();
const port = process.env.PORT || 9000;

// parse JSON and others

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// log all requests and responses
morganBody(app, { logAllReqHeader: true, maxBodyLength: 5000 });

//connect to db

let cachedClient = null;
let cachedDb: any = null;

const connectToDb = async () => {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(process.env.DATABASE_URL!, {});

  const db = client.db("droppin");
  cachedDb = db;
  cachedClient = client;

  return db;
};
app.post("/create-group", async (req: Request, res: Response) => {
  const { transactionHash, link, logo, name, description, category, discord } =
    req.body;

  try {
    const db = await connectToDb();
    const parsedDiscord = JSON.parse(discord);
    const { id, creator } = await parseReceipt(
      transactionHash,
      "GroupCreated",
      contracts.core
    );
    const group = await db.collection("groups").findOne({ id: id.toString() });
    if (group) {
      res.status(400).end();
    } else {
      db.collection("groups").insertOne({
        name,
        link,
        logo,
        description,
        category,
        discord: parsedDiscord,
        id: id.toString(),
        creator: creator.toLowerCase(),
        totalMember: 0,
      });
      res.status(200).send({
        id: id.toString(),
        msg: "success",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.post("edit-group", async (req: Request, res: Response) => {
  const { id, link, logo, name, description, category, discord, address } =
    req.body;

  try {
    const db = await connectToDb();
    let parsedDiscord;
    if (discord) parsedDiscord = JSON.parse(discord);
    const group = await db.collection("groups").findOne({ id: id.toString() });
    if (group) {
      await db
        .collection("groups")
        .findOneAndUpdate(
          { id: id.toString() },
          { $set: { link, name, logo, description, category, discord } },
          { new: true }
        );
    } else {
      res.status(400).end();
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.post("/sign-up", async (req: Request, res: Response) => {
  const { address, name, username, description, discord, image } = req.body;

  try {
    const db = await connectToDb();
    const user = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    const userByAddr = await db.collection("users").findOne({
      address: address.toLowerCase(),
    });
    if (user || userByAddr) {
      res.status(400).send({
        msg: "username already exists",
      });
    } else {
      db.collection("users").insertOne({
        name,
        address: address.toLowerCase(),
        description,
        discord,
        username: username.toLowerCase(),
        image,
        badges: [],
        communitiesWithBadge: [],
        userQuests: [],
        engageScoresAndCommunity: [],
      });
      res.status(200).send({
        username,
        msg: "success",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.get("/check-login/:address", async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const db = await connectToDb();
    const user = await db.collection("users").findOne({
      address,
    });
    if (user) {
      res.status(200).send({
        msg: "success",
        isSignedUp: true,
        username: user.username,
      });
    } else {
      res.status(400).send({
        msg: "user is not registered",
        isSignedUp: false,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: e,
    });
  }
});

app.get(
  "/check-admin/:communityId/:username",
  async (req: Request, res: Response) => {
    const { communityId, username } = req.params;
    try {
      const db = await connectToDb();
      const user = await db.collection("users").findOne({
        username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
      });
      const community = await db
        .collection("groups")
        .findOne({ id: communityId.toString() });
      if (community.creator == user.address) {
        res.status(200).send({
          isAdmin: true,
        });
      } else {
        res.status(400).send({
          isAdmin: false,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        isAdmin: false,
        msg: e,
      });
    }
  }
);

app.post("/complete-quest", async (req: Request, res: Response) => {
  const { questId, username } = req.body;
  try {
    const db = await connectToDb();
    const quest = await db.collection("quests").findOne({ id: questId });
    const user = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    if (user && quest) {
      const receipt = await completeQuestReceipt(questId, user.address);
      // console.log(receipt)
      const { groupId, userAddr, engageScore } = await parseReceipt(
        receipt.transactionHash,
        "QuestComplete",
        contracts.core
      );
      await updateEngageScoresAndCommunity(
        db,
        groupId.toString(),
        userAddr,
        engageScore
      );
      await updateGroupEngageScore(db, groupId.toString(), engageScore);
      await updateUserQuests(db, questId, userAddr, "ACCEPTED", null);
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

app.post("/submit-quest", async (req: Request, res: Response) => {
  const { questId, username, userSubmission } = req.body;
  try {
    //collection submitted forms
    const db = await connectToDb();
    const quest = await db.collection("quests").findOne({ id: questId });
    const user = await db.collection("users").findOne({ username });
    if (quest && user) {
      await updateUserQuests(
        db,
        questId,
        user.address,
        "PENDING",
        userSubmission
      );
      res.status(200).send({
        msg: "updated quest submission",
      });
    } else {
      res.status(400).send({
        msg: "User or Quest id not found",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: e,
    });
  }
});

app.post("/create-quest", async (req: Request, res: Response) => {
  const { transactionHash, condition, detail, name } = req.body;

  try {
    const db = await connectToDb();
    const { questData, id } = await parseReceipt(
      transactionHash,
      "QuestCreated",
      contracts.core
    );
    const { engagePoints, groupId } = questData;
    const parsedCondition = JSON.parse(condition);
    const quest = await db.collection("quests").findOne({ id: id.toString() });
    if (quest) {
      res.status(500).send({
        msg: "FAIL : duplicated quest",
      });
    } else {
      await db.collection("quests").insertOne({
        id: id.toString(),
        condition: parsedCondition,
        engagePoints,
        groupId: groupId.toString(),
        name,
        detail,
      });
      await updateGroupQuests(db, groupId.toString(), id.toString());
      res.status(200).send({
        msg: "success",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.post("/create-badge", async (req: Request, res: Response) => {
  const { transactionHash, description, name } = req.body;

  try {
    const db = await connectToDb();
    const { badgeData, nftSymbol, nftInitBaseURI, id } = await parseReceipt(
      transactionHash,
      "BadgeCreated",
      contracts.badge
    );
    const { requiredQuests, engagePointsThreshold, badgePrice, NFT, groupId } =
      badgeData;

    const badge = await db.collection("badges").findOne({ id: id.toString() });
    if (badge) {
      res.status(500).send({
        msg: "FAIL : duplicated badge",
      });
    } else {
      await db.collection("badges").insertOne({
        id: id.toString(),
        address: NFT,
        description,
        requiredQuests: requiredQuests.map((item: any) => item.toString()),
        engagePointsThreshold,
        badgePrice,
        name,
        groupId: groupId.toString(),
      });
      await updateGroupBadges(db, groupId.toString(), id.toString());
      res.status(200).send({
        badgeId: id.toString(),
        groupId: groupId.toString(),
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.post("/complete-badge", async (req: Request, res: Response) => {
  const { transactionHash } = req.body;

  try {
    const db = await connectToDb();
    const { badgeData, userAddr, id } = await parseReceipt(
      transactionHash,
      "BadgeClaimed",
      contracts.badge
    );

    await updateUserBadges(db, userAddr, id.toString());
    res.status(200).send({
      msg: "sucessfully updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

app.get("/user/:username", async (req: Request, res: Response) => {
  let { username } = req.params;
  try {
    const db = await connectToDb();
    let resData = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    let communityBadges: any = {};
    let communitiesWithBadge = [];
    if (resData.badges) {
      resData.badges.forEach((item: any) => {
        communityBadges[item.groupId]
          ? communityBadges[item.groupId].push(item)
          : (communityBadges[item.groupId] = [item]);
      });
    }

    for (const [key, value] of Object.entries(communityBadges)) {
      const group = await db.collection("groups").findOne({ id: key });
      communitiesWithBadge.push({
        community: {
          id: key,
          address: "none",
          image: group.logo,
          name: group.name,
        },
        badges: value,
      });
    }
    resData["communitiesWithBadge"] = communitiesWithBadge;

    res.status(200).send({
      data: resData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({});
  }
});

app.get("/community/:communityId", async (req: Request, res: Response) => {
  const { communityId } = req.params;
  try {
    const db = await connectToDb();
    let resData = await db
      .collection("groups")
      .findOne({ id: communityId.toString() });
    const owner = await db
      .collection("users")
      .findOne({ address: resData.creator });
    resData["owner"] = {
      username: owner.username,
      address: resData.owner,
      image: owner.image,
      name: owner.name,
    };

    const defaultBadge = resData.defaultBadge;
    let members = [];
    if (defaultBadge) {
      members = await db.collection("users").find({}).toArray();
      console.log(members);
      members = members.filter((item: any) => {
        return item.badges.find((i: any) => {
          return i.id == defaultBadge.id;
        });
      });
    }
    resData["members"] = members;
    res.status(200).send({ data: resData });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.get(
  "/community/:communityId/pending/:username",
  async (req: Request, res: Response) => {
    const { communityId, username } = req.params;
    try {
      const db = await connectToDb();
      const user = await db.collection("users").findOne({
        username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
      });
      let pendingQuests = user.userQuests;
      pendingQuests = pendingQuests.filter((item: any) => {
        return item.groupId == communityId.toString();
      });
      let resData: any = [];
      pendingQuests.forEach((e: any) => {
        resData.push({
          quest: {
            id: e.id,
            name: e.name,
            description: e.detail,
            engageScore: e.engagePoints,
          },
          requestUser: {
            username: user.username,
            address: user.address,
            image: user.image,
            name: user.name,
          },
          requestAnswer: e.userSubmission,
        });
      });
      res.status(200).send({
        pendingQuests: resData,
      });
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  }
);
app.get(
  "/quest/:questId/user/:username",
  async (req: Request, res: Response) => {
    const { questId, username } = req.params;
    try {
      const db = await connectToDb();
      const user = await db.collection("users").findOne({
        username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
      });
      let quest = user.userQuests.find((item: any) => {
        return item.id == questId.toString();
      });
      if (quest) {
        let group = await db
          .collection("groups")
          .findOne({ id: quest.groupId });
        res.status(200).send({
          status: quest.status,
          community: {
            id: quest.groupId,
            address: group.link,
            image: group.logo,
            name: group.name,
          },
          quest : {
            id: questId,
            name: quest.name,
            engageScore: quest.engagePoints,
            description: quest.detail
          },
          userSubmission : quest.userSubmission
        });
      }else {
        res.status(400).send({
          msg : "NOT FOUND"
        })
      }
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

app.get("/quest/:questId", async (req: Request, res: Response) => {
  const {questId} = req.params;
  try{
    const db = await connectToDb();
    const quest = await db.collection("quests").findOne({id: questId});
    if(quest) {
      res.status(200).send({
        quest
      })
    }else {
      res.status(400).send({
        msg : "NOT FOUND"
      })
    }
  }catch(e){
    console.log(e);
    res.status(500).send();
  }
})

app.get("/badge/:badgeId", async (req: Request, res: Response) => {
  const {badgeId} = req.params;
  try{
    const db = await connectToDb();
    const badge = await db.collection("badges").findOne({id: badgeId});
    if(badge) {
      let requiredQuests: any = [];
      for(const questId of badge.requiredQuests){
        const quest = await db.collection("quests").findOne({id: questId});
        if(!quest) continue;
        requiredQuests.push(quest)
      }
      console.log(requiredQuests)
      res.status(200).send({
        ...badge,
        requiredQuests
      })
    }else {
      res.status(400).send({
        msg : "NOT FOUND"
      })
    }
  }catch(e){
    console.log(e);
    res.status(500).send();
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
