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
    <div className="w-full bg-gray-900 text-white p-4 rounded-md sm:border">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="px-3"></TableHead>
            <TableHead className="px-3">Symbol</TableHead>
            <TableHead className="px-3">Name</TableHead>
            <TableHead className="px-3">Price</TableHead>
            <TableHead className="px-3">Market Cap</TableHead>
            <TableHead className="px-3">24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptoData.map((crypto, index) => (
            <TableRow key={index}>
              <TableCell className="hidden md:table-cell py-2">
                <img
                  src={crypto.icon}
                  alt={`${crypto.name} icon`}
                  className="w-8 h-8"
                />
              </TableCell>
              <TableCell className="px-3 py-2">{crypto.symbol}</TableCell>
              <TableCell className="px-3 py-2">{crypto.name}</TableCell>
              <TableCell className="px-3 py-2">${crypto.price}</TableCell>
              <TableCell className="px-3 py-2">
                ${formatMarketCap(crypto.marketCap)}
              </TableCell>
              <TableCell className="px-0 py-2">
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
