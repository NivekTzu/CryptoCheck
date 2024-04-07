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
import { Plus, RefreshCcw } from "lucide-react";

const CryptoPriceList: React.FC = () => {
  const [currency, setCurrency] = useState<string>("");
  const [listName, setListName] = useState<string>("");
  const [prices, setPrices] = useState<{ currency: string; price: number }[]>(
    []
  );
  const [error, setError] = useState<string>("");
  const [uniqueListNames, setUniqueListNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchListNames = async () => {
      try {
        const response = await fetch("/api/getListNames");
        const data = await response.json();
        setUniqueListNames(data);
      } catch (error) {
        console.error("Error fetching list names:", error);
      }
    };

    fetchListNames();
  }, []);

  const fetchPrice = async () => {
    if (currency) {
      try {
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
          setError("");
        } else {
          setError(`Currency ${currency} not found.`);
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
    setCurrency("");
  };

  const clearListClick = async () => {
    setPrices([]);
    setListName("");
  };

  const handleFetchDataClick = async () => {
    try {
      const response = await fetch("/api/createList");
      const data = await response.json();
      const filteredData = data.filter(
        (item: { listname: string }) => item.listname === listName
      );
      if (filteredData.length === 0) {
        setError(`List with name "${listName}" not found. Please try again.`);
        setPrices([]);
      } else {
        setError("");
        updatePrices(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again.");
    }
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

      if (!uniqueListNames.includes(listName)) {
        setUniqueListNames((prevListNames) => [...prevListNames, listName]);
      }

      setListName(""); // Reset listName after saving
    } catch (error) {
      console.error("Error saving prices:", error);
    }
  };

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
        setPrices([]);
      } else {
        setError("");
        updatePrices(filteredData);
        setPrices(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again.");
    }
    setUniqueListNames(uniqueListNames);
  };

  const handleRemove = async (item: any) => {
    try {
      if (!item._id) {
        setPrices((prevMessage) =>
          prevMessage.filter((msg) => msg.currency !== item.currency)
        );
        return;
      }

      const response = await fetch(`/api/createList`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item._id),
      });

      if (response.ok) {
        setPrices((prevMessage) =>
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
      setPrices(updatedPrices);
      setError("");
    } catch (error) {
      console.error("Error updating prices:", error);
      setError("An error occurred while updating prices. Please try again.");
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
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          placeholder="Enter currency symbol (BTC)"
        />

        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleAddUpdateClick}
        >
          <Plus />
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleFetchDataClick}
        >
          <RefreshCcw />
        </Button>

        <Button
          onClick={handleSave}
          disabled={!listName || !prices.length}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Save List
        </Button>
      </div>

      {error && <div>{error}</div>}
      {prices.map((item, index) => (
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
          disabled={!listName || !prices.length}
        >
          Clear List
        </Button>
      </div>
    </>
  );
};

export default CryptoPriceList;
