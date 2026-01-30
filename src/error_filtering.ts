import { getAllCurrencies } from "./database/supabase-connection.js";

export async function filteringTargetsErrors(targets:string){
    const targetsArray = targets.trim().split(",");
    const currencies = await getAllCurrencies();
    const filteredTargets = targetsArray.filter((target) => {
      if (currencies?.includes(target)) {
        return true;
      }
    });
  return filteredTargets;
}