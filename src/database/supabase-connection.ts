import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { getCurrencies } from "../exchange-api.js";
import { LRUCache } from "lru-cache";

const cacheOptions = {
  max: 1,
  ttl: 1000 * 60 * 60,
};

const cacheGetCurrecnciesDB = new LRUCache(cacheOptions);

// if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
const supabase = createClient(
  process.env.SUPABASE_URL ?? " ",
  process.env.SUPABASE_KEY ?? " ",
);

export async function createUser(): Promise<User | PostgrestError | null> {
  const { data, error } = await supabase
    .from("users")
    .insert({ base_currency: "USD" })
    .select()
    .single();
  if (data) {
    return data;
  }
  return error;
}

export async function getUser(user_id: string) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("user_id", user_id);

  //console.log(data);

  return data ? data[0] : error;
}

export async function checkUserExist(user_id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("user_id", user_id);

  return data ? true : false;
}

export async function updateUser(
  user_id?: string,
  newBaseCurrency?: string,
  newFavorites?: string[],
) {
  const { data, error } = await supabase
    .from("users")
    .update({
      base_currency: newBaseCurrency,
      favorites: newFavorites,
      updated_at: new Date().toISOString(),
    })
    .select()
    .eq("user_id", user_id)
    .single();

  return data ? data : error;
}

export async function getAllCurrencies() {
  const cachedResponse = cacheGetCurrecnciesDB.get("currencies");

  if (cachedResponse) {
    console.log("отправка кешированных данных");
    return cachedResponse;
  } else {
    const { data, error } = await supabase.from("currencies").select("code");

    if (data) {
      // console.log(data);
      const currencyList:string[] = data.map((dataElement) => {
        return dataElement.code;
      });
      //console.log(currencyList);
      console.log("кеширование");
      cacheGetCurrecnciesDB.set("currencies",currencyList);
      return currencyList;
    } else {
      console.log(error);
    }
  }
}

async function insertCurrencies() {
  const currencies = await getCurrencies();

  currencies.forEach(async (currency) => {
    console.log(currency);
    const { error } = await supabase
      .from("currencies")
      .insert({ code: currency });
    if (error) console.log(error);
  });
}

