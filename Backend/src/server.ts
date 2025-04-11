import "dotenv/config";
import http from "http";
import nodemailer from "nodemailer";

//transporter
const transporter = nodemailer.createTransport({
  host: process.env.STMP_SERVER,
  port: parseInt(process.env.STMP_PORT || "587", 10),
  secure: process.env.STMP_SECURE === "true",
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASS,
  },
});

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {

    //cros
    res.setHeader("Access-Control-Allow-origin", "*");
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
            subjuct: "hello",
            text: message,
          };
          await transporter.sendMail(mailOptions);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "done", data: parseData }));
        } catch (error) {
          res.statusCode = 400;
          res.end(error);
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
