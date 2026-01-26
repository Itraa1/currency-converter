import { createUser } from "./database/supabase-connection.js";
import { type Request, type Response } from "express";

export async function createCookie(req: Request, res: Response) {
  
    res.cookie("userIdCookie", await createUser(), {
      httpOnly: true,
      sameSite: "strict", 
    });
}
