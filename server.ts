import express, { Express, Request, Response } from "express";
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
} from "./utils/utils";
import { ethers, providers, Wallet } from "ethers";
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
        memberCount: 1,
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
    const parsedDiscord = JSON.parse(discord);
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
        discord: parsedDiscord,
        username: username.toLowerCase(),
        image,
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

app.get("/check-login", async (req: Request, res: Response) => {
  const { address } = req.body;
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

app.get("/check-admin", async (req: Request, res: Response) => {
  const { communityId, username } = req.body;
  try {
    const db = await connectToDb();
    const user = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    const community = await db
      .collections("groups")
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
    res.status(500).send({
      isAdmin: false,
      msg: e,
    });
  }
});

app.post("/complete-quest", async (req: Request, res: Response) => {
  const { questId, username } = req.body;
  try {
    const db = await connectToDb();
    const quest = await db
      .collection("quests")
      .findOne({ id: questId});
    const user = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    if (user && quest) {
      const receipt = await completeQuestReceipt(questId, user.address);
      const { groupId, userAddr, engageScore } = await parseReceipt(
        receipt.transactionHash,
        "QuestComplete",
        contracts.core
      );
      await updateEngageScoresAndCommunity(db, groupId, userAddr, engageScore);
      await updateUserQuests(db, questId, userAddr,"ACCEPTED",null)
    } else {
      res.status(400).send();
    }
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/submit-quest", async (req: Request, res: Response) => {
  // const { questId, username, userSubmission } = req.body;
  // try {
  //   //collection submitted forms
  //   const db = await connectToDb();
  //   console.log("done until here")

  //   const quest = await db
  //     .collection("quests")
  //     .findOne({ id: questId.toString() });
  //   const user = await db.collection("users").findOne({ username });
  //   if (quest && user) {
  //     await updateUserQuests(db, questId, user.address, "PENDING", userSubmission)
  //     res.status(200).send({
  //       msg: "updated quest submission",
  //     });
  //   } else {
  //     res.status(400).send({
  //       msg: "User or Quest id not found",
  //     });
  //   }
  // } catch (e) {
  //   res.status(500).send({
  //     msg: e,
  //   });
  // }
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
      db.collection("quests").insertOne({
        id: id.toString(),
        condition: parsedCondition,
        engagePoints,
        groupId: groupId.toString(),
        name,
        detail,
      });
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
      db.collection("badges").insertOne({
        id: id.toString(),
        address: NFT,
        description,
        requiredQuests: requiredQuests.map((item: any) => item.toString()),
        engagePointsThreshold,
        badgePrice,
        name,
        groupId: groupId.toString(),
      });
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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
