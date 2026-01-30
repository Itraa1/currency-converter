import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./api-constants.js";
import { checkUserAuth } from "./userauth.js";
import { cacheGetCurrecnciesMiddleware } from "./cache.js";
import { getAllCurrencies, getUser } from "./database/supabase-connection.js";
import { filteringTargetsErrors } from "./error_filtering.js";
import { getCurrencyExchange } from "./exchange-api.js";

const app = express();

app.use(cookieParser());

app.get(
  "/api/currencies",
  checkUserAuth,
  cacheGetCurrecnciesMiddleware,
  async (req: Request, res: Response) => {
    console.log("Основной метод");
    res.json({ currencies: await getAllCurrencies() });
  },
);

app.get("/api/rates", checkUserAuth, async (req, res) => {
  let base_currency = req.query.base;
  if (!base_currency) {
    console.log(req.user?.base_currency);
    base_currency = req.user?.base_currency;
  }

  const targets = req.query.targets;
  let filteredTargets: string[] = [];
  if (targets && typeof targets === "string") {
    filteredTargets = await filteringTargetsErrors(targets);
  }

  const apiResponse = await getCurrencyExchange(base_currency as string);
  const rates:Rates = {} ;
  if (apiResponse.result === "success") {
    for (let target of filteredTargets) {
      rates[target] = apiResponse.conversion_rates[target];
    }
  }

  console.log("base:", base_currency);
  console.log("targets:", targets);
  console.log("all query:", req.query);
  console.log("filteredTargets:", filteredTargets);
  console.log("rates",rates);
  //const targets :string = req.query.targets
  res.json(rates); //возвращает рейты для конкретной валюты; Параметры (в query запроса):
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
