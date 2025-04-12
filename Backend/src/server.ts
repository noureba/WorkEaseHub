import "dotenv/config";
import http from "http";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Db, MongoClient } from "mongodb";

//conect to db
let db: Db | null = null;

const uri = process.env.DB_URI;
if (!uri) {
  throw new Error("DB_URI is not defined in the environment variables");
}
const mongoclient = new MongoClient(uri);

const conectDB = async () => {
  try {
    await mongoclient.connect();
    db = mongoclient.db("WorkEaseHub");
    console.log("Database connected successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      console.log(error.stack);
    } else {
      console.log("Unknown error", error);
    }
  }
};

conectDB();

//transporter
const transporter = nodemailer.createTransport({
  host: process.env.STMP_SERVER,
  port: 587,
  secure: false,
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
} as SMTPTransport.Options);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    //cros
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    //Get data and send mail
    if (req.url === "/api/send-email" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const parseData = JSON.parse(body);
          const { email, message } = parseData;

          const mailOptions = {
            from: email,
            to: process.env.STMP_ADMIN,
            subject: "hello",
            text: message,
          };
          await transporter.sendMail(mailOptions);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "done", data: parseData }));
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ Error: error.message }));
          } else {
            res.statusCode = 500;
            res.end("unknow error");
          }
        }
      });
    } else if (req.url === "/api/save-email" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const parseData = JSON.parse(body);
          const { email } = parseData;

          if (db) {
            const collection = db.collection("emails");
            await collection.insertOne({ email });
            if (!res.headersSent) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: true,
                  message: "Email saved!",
                })
              );
            }
          } else {
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  message: "Failed to connect to database",
                })
              );
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
          } else {
            console.log("Unkow error", error);
          }
        }
      });
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  }
);

//server start
server.listen(process.env.SERVER_PORT, () => {
  console.log("server is runing in:", process.env.SERVER_PORT);
});
