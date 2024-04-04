"use client";
import React, { useState } from "react";

function CryptoPrice() {
  const [currency, setCurrency] = useState<string>("");
  const [listName, setListName] = useState<string>("");
  const [prices, setPrices] = useState<{ currency: string; price: number }[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchPrice = async () => {
    if (currency) {
      const res = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
      );
      const data = await res.json();

      if (data.data && data.data.rates && data.data.rates.USD) {
        const existingIndex = prices.findIndex(
          (item) => item.currency === currency
        );
        if (existingIndex !== -1) {
          setPrices((prevPrices) => {
            const updatedPrices = [...prevPrices];
            updatedPrices[existingIndex] = {
              ...updatedPrices[existingIndex],
              price: data.data.rates.USD,
            };
            return updatedPrices;
          });
        } else {
          setPrices((prevPrices) => [
            ...prevPrices,
            { currency, price: data.data.rates.USD },
          ]);
        }
        setErrorMessage("");
      } else {
        setErrorMessage(`Currency ${currency} not found.`);
      }
    }
  };

  const handleClick = () => {
    fetchPrice();
    setCurrency("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value.toUpperCase());
  };

  const handleSave = async () => {
    try {
      const formattedPrices = prices.map((item) => ({
        listname: listName,
        currency: item.currency,
        price: item.price,
      }));

      const res = await fetch("/api/createList", {
        method: "POST",
        body: JSON.stringify(formattedPrices),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to save prices");
      }

      setPrices([]);
      setListName("");
    } catch (error) {
      console.error("Error saving prices:", error);
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white p-4 rounded-md sm:border ">
      <label htmlFor="listNameInput" className="block text-lg mb-2">
        List Name:
      </label>
      <input
        id="listNameInput"
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        className="bg-gray-800 text-white rounded-md py-2 px-3 mb-4 w-full"
        placeholder="Enter list name"
      />
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
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        ADD/UPDATE
      </button>
      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Save List
      </button>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {prices.map((result, index) => (
        <div key={index} className="text-lg">
          {result.currency} : ${result.price}
        </div>
      ))}
    </div>
  );
}

export default CryptoPrice;
