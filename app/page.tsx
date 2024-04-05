import React from "react";
import CryptoPrice from "@/components/cryptoPrice";
import CustomList from "../components/CustomList";
import CryptoPriceList from "@/components/ui/CryptoPriceList";
import MarketData from "@/components/MarketData";

const HomePage = () => {
  return (
    <>
      <MarketData />
      <CryptoPriceList />
    </>
  );
};

export default HomePage;
