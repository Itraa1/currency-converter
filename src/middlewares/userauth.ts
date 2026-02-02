import { type Request, type Response } from "express";
import { createCookie } from "../controllers/cookie.js";
import { checkUserExist, getUser } from "../database/supabase_connection.js";

export async function checkUserAuth(
  req: Request,
  res: Response,
  next: Function,
): Promise<void | Response> {
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (userIdCookie) {
    if (!(await checkUserExist(userIdCookie))) {
      return res.status(400).json({ error: "User does not exist" });
    } else {
      req.user = await getUser(userIdCookie);
      next();
    }
  }

  if (!userIdCookie) {
    await createCookie(req, res);
    next();
  }
}
