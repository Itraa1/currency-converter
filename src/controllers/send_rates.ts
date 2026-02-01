import { type Request, type Response } from "express";
import { filteringTargetsErrors, isCurrencyExist } from "../error_filtering.js";
import {
  checkCacheRatesRequest,
  cachingRatesRequest,
} from "../database/supabase-connection.js";
import { getCurrencyExchange } from "../exchange_api.js";

export async function sendRates(req: Request, res: Response) {
  try {
    let base_currency: string = req.query.base as string;
    if (!base_currency) {
      base_currency = req.user?.base_currency as string;
    }

    if (base_currency && !(await isCurrencyExist(base_currency))) {
      return res
        .status(400)
        .json({ error: "Incorrect currency in base_currency" });
    }

    const targets = req.query.targets;
    let filteredTargets: string[] = [];
    if (targets && typeof targets === "string") {
      filteredTargets = await filteringTargetsErrors(targets);
    }

    if (filteredTargets.length < 1) {
      return res
        .status(400)
        .json({ error: "There is no suitable currency in targets" });
    }

    filteredTargets.sort();

    const cacheRatesQuery = await checkCacheRatesRequest(
      base_currency,
      filteredTargets,
    );
    if (cacheRatesQuery) {
      return res.json(cacheRatesQuery);
    }

    const apiResponseAllCurrencyExchange =
      await getCurrencyExchange(base_currency);
    const rates: Rates = {};
    if (apiResponseAllCurrencyExchange.result === "success") {
      for (let target of filteredTargets) {
        rates[target] = apiResponseAllCurrencyExchange.conversion_rates[target];
      }
    } else {
      return res
        .status(500)
        .json({ error: "Error retrieving data from a  API" });
    }

    cachingRatesRequest(base_currency, filteredTargets, rates);

    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
