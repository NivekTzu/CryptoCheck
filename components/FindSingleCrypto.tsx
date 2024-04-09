"use client";
import React, { useState } from "react";

type Props = {
  symbol: string;
};

type CryptoData = {
  data: {
    base: string;
    currency: string;
    amount: string;
  };
};

const FindSingleCrypto: React.FC<Props> = ({ symbol }) => {
  const [price, setPrice] = useState<string>("Loading...");

  React.useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`
        );
        const data: CryptoData = await response.json();
        setPrice(
          `${data.data.base} is ${data.data.amount} ${data.data.currency}`
        );
      } catch (error) {
        console.error("Error fetching price:", error);
        setPrice("Error fetching price");
      }
    };

    fetchPrice();
  }, [symbol]);

  return <div>{price}</div>;
};

export default FindSingleCrypto;
