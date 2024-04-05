"use client";
import React, { useEffect, useState } from "react";
import CryptoDataTable from "./CryptoDataTable";

type CryptoData = {
  name: string;
  price: number;
  marketCap: number;
  icon: string;
  change24h: number;
  symbol: string;
  total_volume: number;
};

const CryptoData: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  const fetchAndCacheData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const data = await response.json();
      const formattedData = data.map((crypto: any) => ({
        name: crypto.name,
        price: crypto.current_price,
        marketCap: crypto.market_cap,
        icon: crypto.image,
        change24h: crypto.price_change_percentage_24h,
        symbol: crypto.symbol,
        total_volume: crypto.total_volume,
      }));
      setCryptoData(formattedData);
      sessionStorage.setItem(
        "cryptoData",
        JSON.stringify({
          data: formattedData,
          timestamp: new Date().getTime(),
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const cachedData = sessionStorage.getItem("cryptoData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - parsedData.timestamp) / 1000; // in seconds
      if (timeDiff >= 120) {
        // 2 minutes
        fetchAndCacheData();
      } else {
        setCryptoData(parsedData.data);
      }
    } else {
      fetchAndCacheData();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchAndCacheData, 120000); // Fetch and cache data every 2 minutes
    return () => clearInterval(interval);
  }, []);

  return <CryptoDataTable cryptoData={cryptoData} />;
};

export default CryptoData;
