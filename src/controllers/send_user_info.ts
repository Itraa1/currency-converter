import { type Request, type Response } from "express";
import { getUser } from "../database/supabase_connection.js";

export async function sendUserInfo(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    if (userId) {
      res.json(await getUser(userId));
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
