import { createClient } from "@supabase/supabase-js";

// if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
const supabase = createClient(
  process.env.SUPABASE_URL ?? " ",
  process.env.SUPABASE_KEY ?? " ",
);

export async function createUser(): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .insert({ base_currency: "USD" })
    .select("user_id");
  if (data) {
    return data[0]?.user_id;
  }
  throw new Error("user creation error")
  
}


// }
