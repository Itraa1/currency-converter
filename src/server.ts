import express from "express";
import cookieParser from "cookie-parser";
import { checkUserAuth } from "./middlewares/userauth.js";
import {
  cacheGetCurrecnciesMiddleware,
  cacheGetRatesMiddleware,
} from "./middlewares/cache_middleware.js";
import { sendAllCurrencies } from "./controllers/send_all_currencies.js";
import { sendRates} from "./controllers/send_rates.js"
import {sendUserInfo} from "./controllers/send_user_info.js"
import {updateUserInfo} from "./controllers/update_user_info.js"

const PORT = 3000;
const app = express();

app.use(cookieParser(), express.json());

app.get(
  "/api/currencies",
  checkUserAuth,
  cacheGetCurrecnciesMiddleware,
  sendAllCurrencies,
);

app.get(
  "/api/rates",
  checkUserAuth,
  cacheGetRatesMiddleware,
  sendRates,
);

app.get("/api/user", checkUserAuth,sendUserInfo );

app.post("/api/user", checkUserAuth,updateUserInfo );

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
