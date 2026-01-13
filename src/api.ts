import express from "express";
import { PORT } from "./api-constants.js";
import { currencies } from "./data/currencies-example.js";

const app = express();

app.get("/api/currencies", (req, res) => {
    if(currencies){
  res.json({ currencies: currencies });
    }else{

    }
});

app.get("/api/rates", (req,res)=>{
    res.json();//возвращает рейты для конкретной валюты; Параметры (в query запроса):
                // ● base - базовая валюта; если параметр base не указан - он должен браться из настроек юзера. Если это первый запрос вообще - то базовой валютой для юзера установить валюту USD
                // ● targets - массив валют через запятую (например targets=EUR,GBP,JPY)
})

app.get("api/users", (req,res)=>{
    //возвращает настройки текущего пользователя (по куке user_id);
})

app.post("/api/user", (req,res) =>{
    //обновляет настройки пользователя (по куке user_id);
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
