import axios from "axios";

export async function getPrices () {
    try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false");
        return res.data;
    }
    catch (error) {
        console.error(error);
    }
}

export async function searchPrices (query: string) {
    try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);
        return res.data.coins;
    }
    catch (error) {
        console.error(error);
    }
}

export async function getCoinbyId (id: string) {
    try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        return res.data;
    }
    catch (error) {
        console.error(error)
    }
}

export async function getCoinMarketChart (id: string) {
    try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`);
        return res.data.prices;
    }
    catch (error) {
        console.error(error);
    }
}