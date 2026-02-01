import { getAllCurrencies } from "../database/supabase-connection.js";
import { type Response } from "express";

export async function sendAllCurrencies(res: Response) {
  try {
    res.json({ currencies: await getAllCurrencies() });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
