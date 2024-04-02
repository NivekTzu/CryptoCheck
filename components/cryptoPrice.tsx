"use client";
import { useState, useEffect } from "react";

function CryptoPrice() {
  const [currency, setCurrency] = useState<string>("ETH");
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (currency) {
      const fetchPrice = async () => {
        const res = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
        );
        const data = await res.json();
        setPrice(data.data.rates.USD);
      };

      fetchPrice();
    }
  }, [currency]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value.toUpperCase());
  };

  return (
    <div className="w-full mt-5 bg-gray-900 text-white p-4 rounded-md sm:border ">
      <label htmlFor="currencyInput" className="block text-lg mb-2">
        Enter Currency:
      </label>
      <input
        id="currencyInput"
        type="text"
        value={currency}
        onChange={handleChange}
        className="bg-gray-800 text-white rounded-md py-2 px-3 mb-4 w-full"
        placeholder="Enter currency"
      />
      {price && (
        <div className="text-lg">
          {currency} Price: ${price}
        </div>
      )}
    </div>
  );
}

export default CryptoPrice;
