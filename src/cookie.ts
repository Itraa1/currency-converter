import { PostgrestError } from "@supabase/supabase-js";
import { createUser } from "./database/supabase-connection.js";
import { type Request, type Response } from "express";

export async function createCookie(req: Request, res: Response) {
  const newUser = await createUser();
  if(newUser instanceof PostgrestError){
    return res.json(newUser);
  }
  if (newUser && newUser.user_id) {
    res.cookie("userIdCookie", newUser.user_id, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    req.user = newUser;
  }
}
