import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import { contracts, parseReceipt } from "./utils/utils";
// import { compileSolidityCode, findTopMatches ,buildTxPayload, getDiamondFacetsAndFunctions, getDiamondLogs, generateSelectorsData} from "./utils/utils";
// import { Providers } from "./utils/providers";
const cors = require("cors");
const fetch = require("node-fetch");
const nodeMailer = require("nodemailer");
const Validator = require("sns-payload-validator");

dotenv.config();
const corsOptions = {
  origin: "http://localhost:3000", // TODO : Add custom domain
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
        creator,
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

app.post("/sign-up", async (req: Request, res: Response) => {
  const { address, name, username, description, discord } = req.body;

  try {
    const db = await connectToDb();
    const parsedDiscord = JSON.parse(discord);
    const user = await db.collection("users").findOne({
      username: { $regex: new RegExp("^" + username.toLowerCase(), "i") },
    });
    if (user) {
      res.status(500).send({
        msg: "username already exists",
      });
    } else {
      db.collection("users").insertOne({
        name,
        address,
        description,
        discord: parsedDiscord,
        username: username.toLowerCase(),
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

app.post("/create-badge", async (req: Request, res: Response) => {
  const { transactionHash, description, name } = req.body;

  try {
    const db = await connectToDb();
    const { badgeData, nftSymbol, nftInitBaseURI, id } = await parseReceipt(
      transactionHash,
      "BadgeCreated",
      contracts.badge
    );
    const {
      requiredQuests,
      engagePointsThreshold,
      badgePrice,
      NFT,
      groupId,
    } = badgeData;

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
        groupId : groupId.toString()
      });
      res.status(200).send({
        badgeId : id.toString(),
        groupId : groupId.toString()
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.post("/create-quest", async (req: Request, res: Response) => {
  const { transactionHash, schemaHash, condition, detail, name} = req.body;

  try {
    const db = await connectToDb();
    const { questData, id } = await parseReceipt(
      transactionHash,
      "QuestCreated",
      contracts.core
    );
    const {
      engagePoints,
      groupId
    } = questData;
    const parsedCondition = JSON.parse(condition)
    const quest = await db.collection("quests").findOne({ id: id.toString() });
    if (quest) {
      res.status(500).send({
        msg: "FAIL : duplicated quest",
      });
    } else {
      db.collection("quests").insertOne({
        id: id.toString(),
        condition: parsedCondition,
        schemaHash,
        engagePoints,
        groupId : groupId.toString(),
        name,
        detail      
      });
      res.status(200).send({
        msg : "success"
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
