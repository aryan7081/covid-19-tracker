import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "Row",
  "Name",
  "Sub Sector",
  "Market Cap",
  "Close Price",
  "PE Ratio",
];

export default function StockTable() {
  const [stockData, setStockData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const total_pages = 1; // Replace this with your actual total pages value

  useEffect(() => {
    // Fetch data from the JSON file
    fetch("/stocks.json") // Assuming the JSON file is in the public directory
      .then((response) => response.json())
      .then((data) => setStockData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Call your changePage function if needed
    }
  };

  const handleNext = () => {
    if (currentPage < total_pages) {
      setCurrentPage(currentPage + 1);
      // Call your changePage function if needed
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= total_pages) {
      setCurrentPage(page);
      // Call your changePage function if needed
    }
  };

  const sortedStockData = [...stockData].sort((a, b) => {
    if (sortConfig.key) {
      const keyA = a[sortConfig.key];
      const keyB = b[sortConfig.key];
      if (keyA < keyB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (keyA > keyB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <Card className="h-full w-full rounded-l-none border-2">
      <CardBody className="overflow-scroll px-0 p-0">
        <table className="w-full min-w-max table-auto text-center">
          <thead className="sticky top-0 bg-white z-10" >
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th key={index} className="border-y p-4" >
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                    onClick={() => handleSort("Name")}
                  >
                    {head} &#x2193;
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody >
            {sortedStockData.map((stock, index) => {
              const isLast = index === sortedStockData.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50 text-center";

              return (
                <tr key={index} >
                  {/* Your table cell data */}
                  {/* Replace 'stocks' with 'stock' for each property */}
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {index + 1}
                      </Typography>
                    </div>
                  </td>

                  <td className={classes} onClick={() => handleSort("Name")}>
                    <div
                      className=""
                      onClick={() => handleSort("Name")}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold text-center"
                      >
                        {stock.Name}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div
                      className=""
                      
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {stock.SubSector}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {stock.MarketCap}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div
                      className=""
                      onClick={() => handleSort("Name")}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {stock.ClosePrice}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div
                      className=""
                      onClick={() => handleSort("Name")}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {stock.PERatio}
                      </Typography>
                    </div>
                  </td>
                  {/* Repeat the same pattern for other properties */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t p-4">
        {/* Your pagination buttons */}
        {/* Adjust the pagination buttons according to your needs */}
        <Button
          variant="outlined"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="border-[#F56630] text-[#F56630]"
        >
          Prev
        </Button>
        {/* ... Pagination buttons for page numbers */}
        {/* ... */}
        <Button
          variant="outlined"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === total_pages}
          className="border-[#F56630] text-[#F56630]"
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
