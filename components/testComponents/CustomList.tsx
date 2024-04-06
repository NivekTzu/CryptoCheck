// pages/index.tsx
"use client";
import React, { useState } from "react";
const CustomList: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [listName, setListName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/createList");
      const data = await response.json();
      const filteredData = data.filter(
        (item: { listname: string }) => item.listname === listName
      );
      if (filteredData.length === 0) {
        setError(`List with name "${listName}" not found. Please try again.`);
        setList([]);
      } else {
        setError("");
        setList(filteredData);
        await updatePrices(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleClick = async () => {
    await fetchData();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListName(event.target.value);
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
      setList(updatedPrices);
      setError("");
    } catch (error) {
      console.error("Error updating prices:", error);
      setError("An error occurred while updating prices. Please try again.");
    }
  };

  const handleRemove = async (item: any) => {
    try {
      console.log("output in custom list", JSON.stringify({ id: item._id }));
      const response = await fetch(`/api/createList`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item._id), // Correct way to send id as the request body
      });

      if (response.ok) {
        setList((prevMessage) =>
          prevMessage.filter((msg) => msg._id !== item._id)
        );
      } else {
        setError("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("An error occurred while removing item. Please try again.");
    }
  };

  return (
    <div className="w-full bg-gray-900 text-white p-4 rounded-md border">
      <h1 className="text-2xl mb-4">Custom List</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={listName}
          onChange={handleChange}
          placeholder="Enter list name"
          className="bg-gray-800 text-white rounded-md py-2 px-3 w-full"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
          onClick={handleClick}
        >
          Fetch Data
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul>
        {list.map((item, index) => (
          <li
            key={index}
            className="border border-gray-600 rounded p-2 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="text-lg">Currency: {item.currency}</p>
              <p className="text-lg">Price: {item.price}</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => handleRemove(item)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomList;
