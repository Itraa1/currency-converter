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

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
