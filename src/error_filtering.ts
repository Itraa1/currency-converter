import { getAllCurrencies } from "./database/supabase-connection.js";

export async function filteringTargetsErrors(
  targets: string,
): Promise<string[]> {
  const targetsArray = targets.trim().split(",");
  const currencies = await getAllCurrencies();
  let filteredTargets: string[] = [];
  if (Array.isArray(currencies)) {
    filteredTargets = targetsArray.filter((target) => {
      if (currencies?.includes(target)) {
        return true;
      }
    });
  }

  return filteredTargets;
}

export async function isCurrencyExist(currency: string): Promise<boolean> {
  const allCurrencies = await getAllCurrencies();
  if (Array.isArray(allCurrencies)) {
    if (allCurrencies.includes(currency)) {
      return true;
    }
  }
  return false;
}
