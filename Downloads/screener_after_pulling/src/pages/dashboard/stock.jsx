import {useState, useEffect} from 'react';
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
  Input
} from "@material-tailwind/react";
import TradingViewLightChart from './common/tradingViewLightChart';
import StrategyCard from "./common/card"
import { ENV_PROXY } from '@/configs/globalVariable';
import {getStrategiesForStock, getNews, getStockDetails, getStockData} from "@/utils/api"
import {formatStockData} from "@/utils/utils"
import getSymbolFromCurrency from 'currency-symbol-map';
import Loader from '@/widgets/layout/loader';
import StrategiesList from './common/strategiesList';


function Prices({data, currencySymbol}) {
  return (
      <div className="w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-3 mt-4">
              {/* Column 1 */}
              <div className="flex flex-col h-full space-y-[-17px]">
                  <p className="mb-4 text-xs text-[#575859] font-[500] text-left">
                      Low
                  </p>
                  <div className="font-[500] text-black text-left">
                      <p className="w-12 text-base w-14 absolute text-sm">
                          {currencySymbol}{data.low}
                      </p>
                  </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col h-full space-y-[-17px]">
                  <p className="mb-4 text-xs text-left text-[#575859] font-[500] text-left">
                      High
                  </p>
                  <div className="font-[500] text-black text-left">
                      <p className="w-12 text-base w-14 absolute text-sm">
                          {currencySymbol}{data.high}
                      </p>
                  </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col h-full space-y-[-17px]">
                  <p className="mb-4 text-xs text-left text-[#575859] font-[500] text-left">
                      Change
                  </p>
                  <p className={`w-15 text-base ${data.change > 0 ? "text-green-500" : "text-red-500"} font-semibold`}>
                      {(data.change * 100).toFixed(2)} %
                  </p>
              </div>
          </div>
      </div>
  )
}


function timeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  
  const elapsed = current - previous;
  
  if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
      return Math.round(elapsed / msPerYear) + ' years ago';
  }
}


function RecentNews({ news }) {
  return (
    <div className="shadow rounded-lg h-[400px] flex flex-col gap-5 p-2 overflow-y-auto bg-white">
    {(!news || news.length === 0) && (
      <div className="flex-grow flex items-center justify-center">
        <Loader />
      </div>
    )}
      {news?.results?.map((item, index) => (
        <a key={index} href={item.article_url} target="_blank" rel="noopener noreferrer" className="flex gap-3.5 items-start hover:bg-gray-100 p-2 rounded w-full">
          <div className="flex-shrink-0 flex items-start justify-center">
            <div className="bg-green-100 rounded-full w-10 h-10" />
          </div>
          <div className="relative flex flex-col items-start flex-grow min-h-[3rem] pr-10">
            <div className="flex flex-col items-start">
              <p className="text-xs">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 font-semibold">
                {item.publisher.name}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-start justify-center">
              <p className="text-[8px] text-gray-400 absolute top-1 right-1">
                {timeDifference(new Date(), new Date(item.published_utc))}
              </p>
          </div>
          </div>
        </a>
      ))}
    </div>
  );
}



function formatMarketCap(value, currencySymbol) {
  if (value < 1e6) {
    return `${currencySymbol}${value}`; // Less than a million
  } else if (value >= 1e6 && value < 1e9) {
    return `${currencySymbol}${(value / 1e6).toFixed(2)} M`; // Million
  } else if (value >= 1e9 && value < 1e12) {
    return `${currencySymbol}${(value / 1e9).toFixed(2)} B`; // Billion
  } else if (value >= 1e12) {
    return `${currencySymbol}${(value / 1e12).toFixed(2)} T`; // Trillion
  }
}

function Fundamentals({ currencySymbol, data }) {
  if (!data) {
    return (
      <div className="min-h-[300px] flex items-center justify-center"> {/* Adjust min-h-[300px] as per your need */}
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-row p-4 bg-white shadow rounded-md">
      
      {/* Column 1 */}
      <div className="flex flex-col w-1/2 pr-2 gap-1">
        <KeyValue label="Market cap" value={formatMarketCap(data.MarketCapitalization, currencySymbol)} />
        <KeyValue label="P/B ratio" value={data.PriceToBookRatio} />
        <KeyValue label="P/E ratio" value={data.TrailingPE} />
      </div>

      {/* Vertical Divider */}
      <div className="border-l-2 border-gray-300 mx-4"></div>

      {/* Column 2 */}
      <div className="flex flex-col w-1/2 pl-2 gap-1">
        <KeyValue label="Div yield" value={`${(data.DividendYield * 100).toFixed(2)} %`} />
        <KeyValue label="Book value" value={data.BookValue} />
        <KeyValue label="EPS" value={data.EPS} />
        <KeyValue label="EBITDA" value={formatMarketCap(data.EBITDA, currencySymbol)} />
      </div>

    </div>
  );
}

const KeyValue = ({ label, value }) => (
  <div className="flex mb-2">
    <div className="w-1/2 text-gray-600">{label}</div>
    <div className="w-1/2 text-gray-900">{value}</div>
  </div>
)


export function Stock() {
  const [data, setData] = useState([]);
  const [news, setNews] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Resetting states
    setData(null);
    setStrategies(null);
    setNews(null);
    setStockDetails(null);
    setCurrencySymbol(null);
    setLoading(true); // Assuming you want to show the loader again
    
    const queryParams = new URLSearchParams(location.search);
    const ticker = queryParams.get('ticker');
    const exchange = queryParams.get('exchange');
    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getStockData({ticker, exchange});
            setData(formatStockData(result));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching strategy results:", error);
        }
    };

      const fetchStrategies = async () => {
        const strategies = await getStrategiesForStock({tickers: [ticker]});
        console.log("strategies", strategies);
        setStrategies(strategies)
      };

      const fetchNews = async () => {
        const news = await getNews(ticker);
        console.log("news", news)
        setNews(news)
      };

      const fetchStockDetails = async () => {
        const details = await getStockDetails(ticker, exchange);
        setStockDetails(details);
        const currencySymbol = getSymbolFromCurrency(details.info.currency_name.toUpperCase()) || details.info.currency_name ;
        setCurrencySymbol(currencySymbol)
      };

      fetchData();
      fetchStrategies();
      //fetchNews();
      fetchStockDetails();

  }, [location.search]);

  if (loading) {
    return (
        <div className="min-h-screen relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader />
          </div>
        </div>
      );
  }
  console.log("stock details", stockDetails);
  return (
    <section className="p-8">
      {/* Heading */}
    {stockDetails &&
       <div>
         <h2 className="text-xl font-semibold">{stockDetails && stockDetails.info && stockDetails.info.name}</h2>
        <h3 className="text-lg text-gray-400 font-semibold">{stockDetails && stockDetails.info && stockDetails.info.ticker}</h3>
  
        <br></br>
        <h3 className="text-xl font-bold">{currencySymbol}{stockDetails.latest_prices && stockDetails.latest_prices.close}</h3>
       </div>
  
    }
      <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3">
             {stockDetails && !stockDetails.latest_prices && <Loader /> }

              { stockDetails && stockDetails.latest_prices && <Prices data={stockDetails.latest_prices} currencySymbol={currencySymbol}/> }
              <TradingViewLightChart data={data} />
          </div>
          {/* <div className="col-span-1">
          <div className="col-span-2">
              <h3 className="text-xl font-bold mt-10">Recent News</h3>
              {news && <RecentNews news={news} />}
          </div>
          </div> */}
      </div>
      <div>
      {strategies && strategies.stats && strategies.stats.length > 0 && <h3 className="text-xl font-bold mt-10">Explore strategies</h3>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {(!strategies || !strategies.stats) ? (
              <div className="col-span-1 md:col-span-3 flex items-center justify-center">
                  <Loader />
              </div>
          ) : (
              strategies.stats.map((strategy) => (
                  <StrategyCard
                      strategyName={strategy.strategy_info.name}
                      strategyId={strategy.strategy_info._id}
                      stockName={strategy.ticker}
                      stat={[
                          { "name": "Win rate %", value: (strategy.win_rate).toFixed(2) },
                          { "name": "Avg win %", value: (strategy.avg_win * 100).toFixed(2) },
                          { "name": "Returns %", value: (strategy.cummulative_returns[strategy.cummulative_returns.length - 1] * 100).toFixed(2) },
                      ]}
                  />
              ))
          )}
      </div>
      </div>
      {stockDetails && stockDetails.info && stockDetails.info.description && <div className='mt-20 w-2/3'>
        <h3 className="text-2xl font-bold mb-5">About the company</h3>
        {
          <div className="flex flex-row p-8 bg-white shadow rounded-md"> 
            {stockDetails && stockDetails.info && stockDetails.info.description}
          </div>
        }
      </div>}
      {stockDetails && stockDetails.stats && <div className='mt-20 w-2/3'>
        <h3 className="text-2xl font-bold mb-5">Fundamentals</h3>
        
        {<Fundamentals data={stockDetails.stats} currencySymbol={currencySymbol}/> }
      </div>}
    </section>
  );
}

export default Stock;
