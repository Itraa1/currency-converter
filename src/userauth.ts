import { type Request, type Response } from "express";
import { createCookie } from "./cookie.js";
import { checkUserExist, getUser } from "./database/supabase-connection.js";

export async function checkUserAuth(
  req: Request,
  res: Response,
  next: Function,
): Promise<void | Response> {
  // console.log("req.cookie",req.cookies);
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (userIdCookie) {
    if (!(await checkUserExist(userIdCookie))) {
      return res.json({ error: "User does not exist" });
    } else {

      req.user = await getUser(userIdCookie);
      next();
    }
  }

  //  console.log(userIdCookie);
  if (!userIdCookie) {
    await createCookie(req, res);
    next();
  }
}
