import { type Request, type Response } from "express";
import { createCookie } from "./cookie.js";

export async function checkUserAuth(req:Request,res:Response,next:Function):Promise<void> {
  console.log("req.cookie",req.cookies);
   const userIdCookie: string = req.cookies?.userIdCookie;
   console.log(userIdCookie);
   req.userIdCookie = req.cookies?.userIdCookie
   if (!userIdCookie) {
      req.userIdCookie = await createCookie(req, res);
   }
  next();
}