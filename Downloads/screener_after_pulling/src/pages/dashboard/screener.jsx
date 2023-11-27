import { DashboardNavbar } from "@/widgets/layout";
import React from "react";
import Filter from "./screener/filter";
import StockTable from "./screener/stockTable";

export function Screener() {
  return (
    <div className="bg-red h-screen">
      <div className="flex h-full p-3">
        <Filter />
        <StockTable />
      </div>
    </div>
  );
}

export default Screener;
