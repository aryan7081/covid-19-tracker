import {useState, useEffect} from 'react';
import React, { useRef } from 'react';
import { useLocation, Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { ENV_PROXY } from '@/configs/globalVariable';
import TradingViewLightChart from './common/tradingViewLightChart';

const getStrategyResult = async (ticker) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${ENV_PROXY}/v3/strategy/apply?ticker=AAPL&document_id=ba`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json()
}


export function Dashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const result = await getStrategyResult(selectedTicker);
              const formattedData = Object.entries(result)
                  .map(([date, value]) => ({
                      time: Date.parse(date) / 1000,
                      open: value.open,
                      high: value.high,
                      low: value.low,
                      close: value.close,
                      position: value.position,
                      cumulative_return_pct: value.cumulative_return_pct
                  }))
                  .sort((a, b) => a.time - b.time);
              setData(formattedData);
          } catch (error) {
              console.error("Error fetching strategy results:", error);
          }
      };

      if (selectedTicker) {
          fetchData();
      }
  }, [selectedTicker]);

  const handleSearchChange = async (e) => {
      setSearchTerm(e.target.value);
      if (searchTerm.length > 2) {
          const results = await fetchTypeaheadResults(searchTerm);
          setSearchResults(results);
      } else {
        setSearchResults([]);
      }
  };


  function countPositions(listOfDicts) {
    console.log('count', listOfDicts)
    let buyCount = 0;
    let sellCount = 0;

    for(let item of listOfDicts) {
        if(item.position === 'buy') {
            buyCount++;
        } else if(item.position === 'sell') {
            sellCount++;
        }
    }

    return buyCount + sellCount;
  }

  const handleTickerSelect = (ticker) => {
      setSelectedTicker(ticker);
      setSearchTerm(ticker);  // Update input with selected ticker
      setSearchResults([]);  // Clear typeahead results
  };
  console.log("searchResults", searchResults)
  return (
      <div className="w-full flex flex-col items-center mt-12 mb-8 gap-12">
          {/* Typeahead Input */}
          <div className="relative mb-8">
              <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border rounded p-2 text-black"
                  placeholder="Search for ticker"
              />
              {searchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-10"> {/* Add z-10 here */}
                          {searchResults.map((ticker, index) => (
                          <div
                              key={index}
                              onClick={() => handleTickerSelect(ticker['1. symbol'])}
                              className="cursor-pointer p-2 hover:bg-gray-200 text-black"
                          >
                              {ticker['2. name']}
                          </div>
                      ))}
                  </div>
              )}
          </div>

          <TradingViewLightChart data={data} />
          <div>
              cumulative returns
              <br></br>
              {data && data[data.length - 1] && data[data.length - 1].cumulative_return_pct * 100} %
              <br></br>
              Number of trades <br></br>
              {countPositions(data)}
          </div>
      </div>
  );
}

// Fetch typeahead results
async function fetchTypeaheadResults(query) {
  return temp.bestMatches ? temp.bestMatches.slice(0, 5) : [];
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENV_PROXY}/v3/ticker?query=${query}`, {method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }});
    const data = await response.json();
    return data;  // Modify according to your API's response structure
  } catch (error) {
      console.error("Error fetching typeahead results:", error);
      return [];
  }
}

export default Dashboard;
