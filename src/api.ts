import express from "express";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./api-constants.js";
import { checkUserAuth } from "./userauth.js";
import { cacheGetCurrecnciesMiddleware } from "./cache.js";
import { getAllCurrencies, getUser } from "./database/supabase-connection.js";

const app = express();

app.use(cookieParser());

app.get(
  "/api/currencies",
  checkUserAuth,
  cacheGetCurrecnciesMiddleware,
  async (req: Request, res: Response) => {
    res.json({ currencies: await getAllCurrencies() });
  },
);

app.get("/api/rates", async (req, res) => {
  // await checkUserAuth(req,res);
  res.json(); //возвращает рейты для конкретной валюты; Параметры (в query запроса):
  // ● base - базовая валюта; если параметр base не указан - он должен браться из настроек юзера. Если это первый запрос вообще - то базовой валютой для юзера установить валюту USD
  // ● targets - массив валют через запятую (например targets=EUR,GBP,JPY)
});

app.get("/api/user", checkUserAuth, async (req, res) => {
  const userId = req.userIdCookie;
  if (userId) {
    res.json(await getUser(userId));
  }
  // await checkUserAuth(req,res);
  //возвращает настройки текущего пользователя (по куке user_id);
});

app.post("/api/user", async (req, res) => {
  // await checkUserAuth(req,res);
  //обновляет настройки пользователя (по куке user_id);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
