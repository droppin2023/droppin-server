import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
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

// const connectToDb = async () => {
//   if (cachedDb) return cachedDb;

//   const client = await MongoClient.connect(process.env.DATABASE_URL!, {});

//   const db = client.db("droppin");
//   cachedDb = db;
//   cachedClient = client;

//   return db;
// };

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
