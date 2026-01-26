import express from "express";
import { type Request, type Response } from "express";
import { PORT } from "./api-constants.js";
import { createCookie } from "./cookie.js";
import { cacheGetCurrecnciesMiddleware } from "./cache.js";
import { getAllCurrencies } from "./database/supabase-connection.js";

const app = express();

app.get("/api/currencies",cacheGetCurrecnciesMiddleware,
  async (req: Request, res: Response) => {
    const userIdCookie: string = req.cookies?.userIdCookie;
    if (userIdCookie) {
    } else {
      await createCookie(req, res);
    }

    res.json({ currencies: await getAllCurrencies() });
  },
);

app.get("/api/rates", async (req, res) => {
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (userIdCookie) {
  } else {
    await createCookie(req, res);
  }
  res.json(); //возвращает рейты для конкретной валюты; Параметры (в query запроса):
  // ● base - базовая валюта; если параметр base не указан - он должен браться из настроек юзера. Если это первый запрос вообще - то базовой валютой для юзера установить валюту USD
  // ● targets - массив валют через запятую (например targets=EUR,GBP,JPY)
});

app.get("api/user", async (req, res) => {
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (userIdCookie) {
  } else {
    await createCookie(req, res);
  }
  //возвращает настройки текущего пользователя (по куке user_id);
});

app.post("/api/user", async (req, res) => {
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (userIdCookie) {
  } else {
    await createCookie(req, res);
  }
  //обновляет настройки пользователя (по куке user_id);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
