import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./api-constants.js";
import { checkUserAuth } from "./userauth.js";
import { cacheGetCurrecnciesMiddleware } from "./cache.js";
import { getAllCurrencies, getUser, updateUser,} from "./database/supabase-connection.js";
import { filteringTargetsErrors, isCurrencyExist } from "./error_filtering.js";
import { getCurrencyExchange } from "./exchange-api.js";

const app = express();

app.use(cookieParser(), express.json());

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
  let base_currency:string = req.query.base as string;
  if (!base_currency) {
    console.log(req.user?.base_currency);
    base_currency = req.user?.base_currency as string;
  }

  if(base_currency && !await isCurrencyExist(base_currency)){
    res.status(400).json({error: "inappropriate currency in base_currency"})
  }

  const targets = req.query.targets;
  let filteredTargets: string[] = [];
  if (targets && typeof targets === "string") {
    filteredTargets = await filteringTargetsErrors(targets);
  }

  if (filteredTargets.length < 1) {
    res.status(400).json({ error: "There is no suitable currency in targets" });
  }

  const apiResponse = await getCurrencyExchange(base_currency as string);
  const rates: Rates = {};
  if (apiResponse.result === "success") {
    for (let target of filteredTargets) {
      rates[target] = apiResponse.conversion_rates[target];
    }
  } else {
    res.status(500).json({ error: "Error retrieving data from a  API" });
  }

  res.json(rates); 
});

app.get("/api/user", checkUserAuth, async (req, res) => {
  const userId = req.user?.user_id;
  if (userId) {
    res.json(await getUser(userId));
  }

});

app.post("/api/user", checkUserAuth, async (req, res) => {
  try{
  const newBaseCurrency = req.body.base_currency;
  const newFavorites = req.body.favorites;

  if (!newBaseCurrency && !newFavorites) {
    return res.status(400).json({
      error: "Укажите base_currency или favorites для обновления",
    });
  }

  if (newBaseCurrency && !(await isCurrencyExist(newBaseCurrency))) {
    return res.status(400).json({
      error: "Указанная валюта не поддерживается",
    });
  }

  if (newFavorites && Array.isArray(newFavorites)) {
      for (const currency of newFavorites) {
        if (!await isCurrencyExist(currency)) {
          return res.status(400).json({ 
            error: `Валюта "${currency}" не поддерживается` 
          });
        }
      }
    }

  const updatedUser = await updateUser(
    req.user?.user_id,
    newBaseCurrency,
    newFavorites,
  );

  res.json(updatedUser);
} catch(error){
  res.status(500).json({error: "Server error"})
}
  
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
