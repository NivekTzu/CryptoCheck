"use client";
import React, { useState, useEffect } from "react";

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

  const fetchData = async () => {
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
        setPrices(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data. Please try again.");
    }
  };

  const handleAddUpdateClick = async () => {
    fetchPrice();
    setCurrency("");
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

      setPrices([]);
      setListName("");

      if (!uniqueListNames.includes(listName)) {
        setUniqueListNames((prevListNames) => [...prevListNames, listName]);
      }
    } catch (error) {
      console.error("Error saving prices:", error);
    }
  };

  const handleListNameChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedListName = e.target.value;
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
      <div className="w-full bg-gray-900 text-white p-2 rounded-md border">
        <div className="">
          <input
            id="currencyInput"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            className="bg-gray-800 text-white rounded-md my-4 py-2 px-3 mb-4 w-1/3"
            placeholder="Enter currency"
          />

          <button
            onClick={handleAddUpdateClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-2 px-2 rounded ml-2"
          >
            ADD CURRENCY
          </button>
        </div>

        <select
          id="listDropdown"
          value={listName}
          onChange={handleListNameChange}
          className="bg-gray-800 text-white rounded-md py-2 px-3 mb-4 w-1/3"
        >
          <option value="">Select a list name</option>
          {uniqueListNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetchDataClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded ml-2"
        >
          Update Values
        </button>

        {error && <div className="text-red-500">{error}</div>}
        {prices.map((item, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <div className="text-lg">
              {item.currency} : ${item.price}
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => handleRemove(item)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-900 text-white p-2 rounded-md border">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-700 text-white font-bold ml-0 mr-2 py-2 px-2 rounded"
          disabled={!listName || !prices.length}
        >
          Save List
        </button>

        <input
          id="newListInput"
          type="text"
          value={listName}
          onChange={handleChange}
          className="bg-gray-800 text-white rounded-md mx-2 my-4 py-2 px-4 mb-4 w-1/3"
          placeholder="Enter List Name"
        />
      </div>
    </>
  );
};

export default CryptoPriceList;
