import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { getCurrencies } from "../exchange_api.js";
import { LRUCache } from "lru-cache";

const cacheOptions = {
  max: 1,
  ttl: 1000 * 60 * 60,
};

const cacheGetCurrecnciesDB = new LRUCache(cacheOptions);

const supabase = createClient(
  process.env.SUPABASE_URL ?? " ",
  process.env.SUPABASE_KEY ?? " ",
);

//User
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

  return data ? data[0] : error;
}

export async function checkUserExist(user_id: string): Promise<boolean> {
  const { data } = await supabase
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
    return cachedResponse;
  } else {
    const { data } = await supabase.from("currencies").select("code");

    if (data) {
      const currencyList: string[] = data.map((dataElement) => {
        return dataElement.code;
      });
      cacheGetCurrecnciesDB.set("currencies", currencyList);
      return currencyList;
    }
  }
}

//caching request in DB
export async function checkCacheRatesRequest(
  base_currency: string,
  targets: string[],
) {
  const { data } = await supabase
    .from("cache_rates_query")
    .select("response")
    .eq("request", base_currency.toString() + targets.toString())
    .gt("expires_at", new Date().toISOString())
    .single();

  return data ? JSON.parse(data.response) : null;
}

export async function cachingRatesRequest(
  base_currency: string,
  targets: string[],
  rates: Rates,
) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase.from("cache_rates_query").insert({
    request: base_currency.toString() + targets.toString(),
    response: JSON.stringify(rates),
    expires_at: expiresAt.toISOString(),
  });
}

//adding currencies to the database
async function insertCurrencies() {
  const currencies = await getCurrencies();

  currencies.forEach(async (currency) => {
    await supabase
      .from("currencies")
      .insert({ code: currency });
  });
}

await insertCurrencies();
