import { getAllCurrencies } from "../database/supabase_connection.js";
import { type Request,type Response } from "express";

export async function sendAllCurrencies(req:Request,res: Response) {
  try {
    res.json({ currencies: await getAllCurrencies() });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
