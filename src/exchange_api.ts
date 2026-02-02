import axios from "axios";

const exchangerate_api = axios;

export async function getCurrencyExchange(currency: string) {
  const response = await exchangerate_api.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_KEY}/latest/${currency}`,
  );
  return response.data;
}

export async function getCurrencies() {
  const response = await exchangerate_api.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_KEY}/latest/USD`,
  );
  return Object.keys(response.data.conversion_rates);
}
