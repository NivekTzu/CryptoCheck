import React from "react";
import CryptoPriceList from "@/components/CryptoPriceList";
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
