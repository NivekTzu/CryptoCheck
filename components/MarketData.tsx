"use client";
import React, { useEffect, useState } from "react";

interface MarketData {
  total_market_cap?: { usd: number };
  market_cap_percentage?: { btc: number };
  // Add more properties as needed
}

const MarketData: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData>({});

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/global");
        const data = await response.json();
        setMarketData(data.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, []);

  const formatMarketCap = (marketCap: number): string => {
    const trillion = 1e12;
    const formattedMarketCap =
      marketCap >= trillion
        ? (marketCap / trillion).toFixed(2) + " Trillion"
        : marketCap.toString();
    return formattedMarketCap;
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md border">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="flex-1">
          <p className="text-lg">
            Total Market Cap: $
            {formatMarketCap(marketData.total_market_cap?.usd || 0)}
          </p>
          <p className="text-lg">
            Bitcoin Dominance:{" "}
            {marketData.market_cap_percentage?.btc?.toFixed(2) || 0}%
          </p>
          {/* Add more market data here */}
        </div>
      </div>
    </div>
  );
};

export default MarketData;
