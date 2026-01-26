import axios from "axios";

const exchangerate_api = axios;

async function getCurrenciesExchange(){
    const response = await exchangerate_api.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_KEY}/latest/USD`)
    console.log(response.data)
    return response.data
}

export async function getCurrencies(){
    const response = await exchangerate_api.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_KEY}/latest/USD`)
    //console.log(Object.keys(response.data.conversion_rates))
    return Object.keys(response.data.conversion_rates);
}

