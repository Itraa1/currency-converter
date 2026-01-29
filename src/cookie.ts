import { PostgrestError } from "@supabase/supabase-js";
import { createUser } from "./database/supabase-connection.js";
import { type Request, type Response } from "express";

export async function createCookie(req: Request, res: Response) {
  const user = await createUser();
  if(user instanceof PostgrestError){
    return res.json(user);
  }
  if (user && user.user_id) {
    res.cookie("userIdCookie", user.user_id, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    req.user = user;
  }
}
