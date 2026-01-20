import { createUser } from "./database/supabase-connection.js";

export async function createCookie(req: any, res: any) {
  
    res.cookie("userIdCookie", await createUser(), {
      httpOnly: true,
      sameSite: "strict", 
    });
}
