import { createUser } from "./database/supabase-connection.js";
import { type Request, type Response } from "express";

export async function createCookie(req: Request, res: Response) {
    const userId = await createUser();
    res.cookie("userIdCookie", userId, {
      httpOnly: true,
      sameSite: "strict", 
      secure: false,
    });
    return userId;
}
