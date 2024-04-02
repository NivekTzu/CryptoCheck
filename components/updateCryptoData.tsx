"use client";
import { useState, useEffect } from "react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
}

const UpdateCrypto: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        const data: Coin[] = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Cryptocurrencies</h1>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id}>
            {coin.name} ({coin.symbol})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateCrypto;
