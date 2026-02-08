import { StaticImageData } from "next/image";

export type Price = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
}

export type CoinSearchItem = {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export type CoinById = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;

  image: {
    large: string;
  };

  description: {
    en: string;
  };

  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: {
      github: string[];
    };
  };

  genesis_date: string | null;
  hashing_algorithm: string | null;

  market_data: {
    current_price: {
      usd: number;
    };

    price_change_percentage_24h: number;

    ath: {
      usd: number;
    };

    atl: {
      usd: number;
    };

    ath_change_percentage: {
      usd: number;
    };

    market_cap: {
      usd: number;
    };

    fully_diluted_valuation: {
      usd: number;
    };

    total_volume: {
      usd: number;
    };

    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
};

