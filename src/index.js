const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

const { init: initDB, ActivationCode } = require("./db");
const ActivationCodeController = require("./activation-code");

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 首页 - wx
app.get("/wx", async (req, res) => {
  const wxOpenId = req.headers["x-wx-source"] || null;

  if (wxOpenId) {
    const code = ActivationCodeController.create(wxOpenId);
    const isValid = ActivationCodeController.validate(code);
    if (!isValid) {
      res.sendStatus(401);
    }
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  const wxOpenId = req.headers["x-wx-source"] || null;
  res.json({
    openId: wxOpenId,
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await ActivationCode.count();
  res.json({
    count: result,
  });
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
