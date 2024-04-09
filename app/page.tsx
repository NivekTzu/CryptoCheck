"use client";
import React, { useState } from "react";
import MarketData from "@/components/MarketData";
import FindSingleCrypto from "@/components/FindSingleCrypto";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("BTC");

  const handleAddCoin = async () => {
    setSymbol(userInput);
    setUserInput("");
  };

  return (
    <>
      <div>
        <MarketData />
      </div>

      <p>Want to know the price of a particualr Crypto Currency?</p>

      <div className="flex items-center space-x-4 mt-4">
        <Input
          className="w-[250px]"
          id="currencyInput"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          placeholder="Enter currency symbol (BTC)"
        />

        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleAddCoin}
        >
          Check Price
        </Button>
      </div>
      <div className="flex mt-5">
        <FindSingleCrypto symbol={symbol} />
      </div>
    </>
  );
};

export default HomePage;
