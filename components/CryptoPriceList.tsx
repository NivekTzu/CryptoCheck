"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

interface Props {
  uniqueListNames: string[];
  fetchListNames: () => Promise<void>;
}

const CryptoPriceList: React.FC<Props> = ({
  uniqueListNames,
  fetchListNames,
}) => {
  const [symbol, setSymbol] = useState<string>("");
  const [listName, setListName] = useState<string>("");
  const [coinData, setCoinData] = useState<
    { currency: string; price: number }[]
  >([]);
  const [error, setError] = useState<string>("");

  const handleListNameChange = async (selectedListName: string) => {
    setListName(selectedListName);

    try {
      const response = await fetch("/api/createList");
      const data = await response.json();
      const filteredData = data.filter(
        (item: { listname: string }) => item.listname === selectedListName
      );
      if (filteredData.length === 0) {
        setError(
          `List with name "${selectedListName}" not found. Please try again.`
        );
        setCoinData([]);
      } else {
        setError("");
        updatePrices(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again.");
    }

    // Call fetchListNames to update the list of names
    fetchListNames();
  };

  const fetchPrice = async () => {
    if (symbol) {
      try {
        const res = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${symbol}`
        );
        const data = await res.json();

        if (data.data && data.data.rates && data.data.rates.USD) {
          const existingIndex = coinData.findIndex(
            (item) => item.currency === symbol
          );
          if (existingIndex !== -1) {
            setCoinData((prevPrices) => {
              const updatedPrices = [...prevPrices];
              updatedPrices[existingIndex] = {
                ...updatedPrices[existingIndex],
                price: data.data.rates.USD,
              };
              return updatedPrices;
            });
          } else {
            setCoinData((prevPrices) => [
              ...prevPrices,
              { currency: symbol, price: data.data.rates.USD },
            ]);
          }
          setError("");
        } else {
          setError(`Currency ${symbol} not found.`);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
        setError(
          "An error occurred while fetching price data. Please try again."
        );
      }
    }
  };
  const handleAddUpdateClick = async () => {
    fetchPrice();
    setSymbol("");
  };

  const clearListClick = async () => {
    setCoinData([]);
    setListName("");
  };

  const handleSave = async () => {
    try {
      const formattedPrices = coinData.map((item) => ({
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
    } catch (error) {
      console.error("Error saving prices:", error);
    }
  };

  const updatePrices = async (data: any[]) => {
    try {
      const updatedPrices = await Promise.all(
        data.map(async (item) => {
          const response = await fetch(
            `https://api.coinbase.com/v2/exchange-rates?currency=${item.currency}`
          );
          const priceData = await response.json();
          return { ...item, price: priceData.data.rates.USD };
        })
      );
      setCoinData(updatedPrices);
      setError("");
    } catch (error) {
      console.error("Error updating prices:", error);
      setError("An error occurred while updating prices. Please try again.");
    }
  };

  const handleRemove = async (item: any) => {
    try {
      const response = await fetch(`/api/createList`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item._id),
      });

      if (response.ok) {
        setCoinData((prevMessage) =>
          prevMessage.filter((msg) => msg.currency !== item.currency)
        );
      } else {
        setError("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("An error occurred while removing item. Please try again.");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListName(event.target.value);
  };

  return (
    <>
      <div className="flex">
        <Input
          className="w-[250px]"
          id="currencyInput"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter currency symbol (BTC)"
        />

        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleAddUpdateClick}
        >
          ADD Coin
        </Button>
      </div>

      <div className="flex py-2">
        <Select
          key={listName}
          onValueChange={handleListNameChange}
          defaultValue={listName}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select List" />
          </SelectTrigger>
          <SelectContent>
            {uniqueListNames.map((name, index) => (
              <SelectItem key={index} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSave}
          disabled={!listName || !coinData.length}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Save List
        </Button>
      </div>

      <div className="flex mt-4  ">
        <Input
          className="w-[250px]"
          id="newListInput"
          type="text"
          value={listName}
          onChange={handleChange}
          placeholder="Enter List Name"
        />

        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={clearListClick}
          disabled={!listName || !coinData.length}
        >
          Clear List
        </Button>
      </div>

      {error && <div>{error}</div>}
      {coinData.map((item, index) => (
        <div className="flex justify-between py-1" key={index}>
          {item.currency} : ${item.price}
          <Button
            className="bg-red-500 hover:bg-red-700 text-white font-bold rounded"
            onClick={() => handleRemove(item)}
          >
            Delete
          </Button>
        </div>
      ))}
    </>
  );
};

export default CryptoPriceList;
