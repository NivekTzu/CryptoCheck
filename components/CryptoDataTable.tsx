import React from "react";
import CryptoData from "./CryptoData"; // Assuming CryptoData interface is defined elsewhere
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  cryptoData: CryptoData[];
}

function formatMarketCap(marketCap: number): string {
  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;

  if (marketCap >= trillion) {
    return (marketCap / trillion).toFixed(1) + "tril";
  } else if (marketCap >= billion) {
    return (marketCap / billion).toFixed(1) + "bil";
  } else if (marketCap >= million) {
    return (marketCap / million).toFixed(1) + "mil";
  } else {
    return marketCap.toString();
  }
}

const CryptoDataTable = ({ cryptoData }: Props) => {
  return (
    <div>
      <Table className="mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className=""></TableHead>
            <TableHead className="">Symbol</TableHead>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Price</TableHead>
            <TableHead className="">Market Cap</TableHead>
            <TableHead className="">24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptoData.map((crypto, index) => (
            <TableRow key={index}>
              <TableCell>
                <img
                  src={crypto.icon}
                  alt={`${crypto.name} icon`}
                  className="w-8 h-8"
                />
              </TableCell>
              <TableCell>{crypto.symbol}</TableCell>
              <TableCell className="">{crypto.name}</TableCell>
              <TableCell className="text-xl font-bold">
                ${crypto.price}
              </TableCell>

              <TableCell className="">
                ${formatMarketCap(crypto.marketCap)}
              </TableCell>
              <TableCell
                className={
                  crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {crypto.change24h.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CryptoDataTable;
