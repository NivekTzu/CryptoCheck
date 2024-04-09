"use client";
import React, { useState, useEffect } from "react";
import CryptoPriceList from "@/components/CryptoPriceList";
const CreateNewList: React.FC = () => {
  const [uniqueListNames, setUniqueListNames] = useState<string[]>([]);

  const fetchListNames = async () => {
    try {
      const response = await fetch("/api/getListNames");
      const data = await response.json();
      console.log(data);
      setUniqueListNames(data);
    } catch (error) {
      console.error("Error fetching list names:", error);
    }
  };

  useEffect(() => {
    fetchListNames();
  }, []);

  return (
    <CryptoPriceList
      uniqueListNames={uniqueListNames}
      fetchListNames={fetchListNames}
    />
  );
};

export default CreateNewList;
