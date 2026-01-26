import { type Request, type Response } from "express";
import { createCookie } from "./cookie.js";

export async function checkUserAuth(req:Request,res:Response,next:Function) {
  const userIdCookie: string = req.cookies?.userIdCookie;
  if (!userIdCookie) {
    await createCookie(req, res);
  }
  next();
}