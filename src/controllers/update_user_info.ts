import {type Request,type Response } from "express";
import { isCurrencyExist } from "../error_filtering.js";
import {updateUser} from "../database/supabase_connection.js";

export async function updateUserInfo(req:Request, res:Response) {
  try {
    const newBaseCurrency = req.body.base_currency;
    const newFavorites = req.body.favorites;

    if (!newBaseCurrency && !newFavorites) {
      return res.status(400).json({
        error: "Specify base_currency or favorites to update",
      });
    }

    if (newBaseCurrency && !(await isCurrencyExist(newBaseCurrency))) {
      return res.status(400).json({
        error: "The specified currency is not supported.",
      });
    }

    if (newFavorites && Array.isArray(newFavorites)) {
      for (const currency of newFavorites) {
        if (!(await isCurrencyExist(currency))) {
          return res.status(400).json({
            error: `Currency: "${currency}" incorrect`,
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}