
import {useState, useEffect} from 'react';
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
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
import {getStockData, getStrategyResult, fetchIndexPerformance} from "@/utils/api"
import {formatStockData, generatePerformanceData} from "@/utils/utils"
import PerformanceChart from './common/performanceChart';
import Loader from "@/widgets/layout/loader";

function ListOfTrades({ trades }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="h-12 border-b border-gray-200">
            <th className="pl-2 text-left">Trade#</th>
            <th className="pl-2 text-left">Signal</th>
            <th className="pl-2 text-left">Date/Time</th>
            <th className="pl-2 text-left">Price</th>
            <th className="pl-2 text-left">Profit</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index} className="h-12 border-b border-gray-200">
              <td className="pl-2 text-left">{index + 1}</td>
              <td className="pl-2 text-left">
              <div className="flex flex-col space-y-4">
                <div className={trade.entry.signal === 'buy' ? 'text-green-600' : 'text-red-600'}>
                  {trade.entry.signal.toUpperCase()}
                </div>
                {trade.exit ? (
                  <div className={trade.exit.signal === 'sell' ? 'text-red-600' : 'text-green-600'}>
                    {trade.exit.signal.toUpperCase()}
                  </div>
                ) : (
                  <div className="text-gray-500">Open</div>
                )}
              </div>

              </td>
              <td className="pl-2 text-left">
                <div className="flex flex-col space-y-4">
                  <div>{new Date(trade.entry.date).toLocaleDateString()}</div>
                  {trade.exit ? (
                    <div>{new Date(trade.exit.date).toLocaleDateString()}</div>
                  ) : (
                    <div className="text-gray-500">--</div>
                  )}
                </div>
              </td>
              <td className="pl-2 text-left">
                <div className="flex flex-col space-y-4">
                  <div>{trade.entry.price.toFixed(2)}</div>
                  {trade.exit ? (
                    <div>{trade.exit.price.toFixed(2)}</div>
                  ) : (
                    <div className="text-gray-500">--</div>
                  )}
                </div>
              </td>
              <td className="pl-2 text-left">
                {trade.profit.toFixed(2)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOOLTIPS = {
  "Net profit": "Overall profit or loss from the strategy",
  "Total trades": "Total number of trades executed",
  "Percent profitable": "Ratio of profitable trades to total trades",
  "Avg win": "Average percentage gain for winning trades",
  "Avg loss": "Average percentage loss for losing trades"
};

function Overview({result}) {
  console.log("results", result);
  const net_profit = result.cummulative_returns[result.cummulative_returns.length - 1];
  
  return (
    <div className="w-full">
      <table className="w-full bg-white">
        <thead>
        <tr className="h-8">
  {Object.keys(TOOLTIPS).map((header, index) => (
    <th
      key={header}
      className="font-normal pl-1 text-left relative"
    >
      <div className="flex items-center space-x-1">
        <div>{header}</div>
        <div className="hover:cursor-pointer">
          <Tooltip content={TOOLTIPS[header]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3 w-3 text-blue-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </Tooltip>
        </div>
      </div>
    </th>
  ))}
</tr>

        </thead>
        <tbody>
          <tr className="h-8">
            <td className={`pl-1 text-left ${net_profit > 0?'text-[#04802E]':'text-[#D42620]'}`}>
              {result.cummulative_returns && (net_profit * 100).toFixed(2)} %
            </td>
            <td className="pl-1 text-left">
              {result.trades_count}
            </td>
            <td className={`pl-1 text-left ${result.win_rate > 0?'text-[#04802E]':'text-[#D42620]'}`}>
              {(result.win_rate).toFixed(2)} %
            </td>
            <td className={`pl-1 text-left ${result.avg_win > 0?'text-[#04802E]':'text-[#D42620]'}`}>
              {(result.avg_win * 100).toFixed(2)} %
            </td>
            <td className={`pl-1 text-left ${result.avg_loss > 0?'text-[#04802E]':'text-[#D42620]'}`}>
              {(result.avg_loss * 100).toFixed(2)} %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Properties({result}) {
  console.log("results", result);
  
  return (
    <div className="w-full">
      <table className="w-full bg-white">
        <thead>
          <tr className="h-8">
            <th className="font-normal pl-1 text-left">Start Date</th>
            <th className="font-normal pl-1 text-left">End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-8">
            <td className={`pl-1 text-left`}>
              {result.start_date}
            </td>
            <td className="pl-1 text-left">
            {result.end_date}
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  );
}

function StrategyAnalysis({result, indexesData}) {
  const [activeTab, setActiveTab] = useState('Overview');
  console.log("results --> ", result);
  const tabs = [
    {
      name: 'Overview',
      content: <Overview result={result} />
    },
    {
      name: 'Performance chart',
      content: <PerformanceChart data={generatePerformanceData(result.start_date, result.end_date, result.cummulative_returns)}
                references_data={indexesData}
                start_date={result.start_date}
                end_date={result.end_date}/>
    },
    {
      name: 'List of Trades',
      content: <ListOfTrades trades={result.trades} />
    },
    {
      name: 'Properties',
      content: <Properties result={result} />
    }
  ];

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab, index) => (
          <li key={index} className="mr-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.name);
              }}
              className={`inline-block p-4 border-b-2 ${
                activeTab === tab.name
                  ? 'text-[#F56630] border-[#F56630]'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              } rounded-t-lg`}
              aria-current={activeTab === tab.name ? 'page' : undefined}
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {tabs.map(
          (tab) =>
            activeTab === tab.name && <div key={tab.name}>{tab.content}</div>
        )}
      </div>
    </div>
  );
}

export function StockAnalysis() {
  const [data, setData] = useState({});
  const [stockData, setStockData] = useState([]);
  const [indexesData, setIndexesData] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true); // New state to manage loading

  const navigate = useNavigate();
  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const strategyId = queryParams.get('strategy_id');
      const ticker = queryParams.get('ticker');
      const fetchData = async () => {
        try {
          setLoading(true); // Set loading to true when fetching starts
          const result = await getStrategyResult(ticker, strategyId);
          setData(result);
          const stockResult = await getStockData({uid: result.uid});
          setStockData(formatStockData(stockResult));
          const indexesPerformance = await fetchIndexPerformance(result.uid, result.start_date, result.end_date);
          setIndexesData(indexesPerformance);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Set loading to false once fetching is complete
        }
      };
  
      fetchData();
  }, [location.search]);
  const lastSignal = data.signals && data.signals.length > 0 ? data.signals[data.signals.length - 1] : null;

  if (loading) {
    return (
        <div className="min-h-screen relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader />
          </div>
        </div>
      );
  }
  
  return (
    <section className="p-8 w-4/5 mr-8">
      {/* Heading */}
      <div className='flex flex-row items-center mb-5'>
        <h2 className="text-2xl font-bold">{data.strategy_info && data.strategy_info.name}</h2>
        {/* View Strategy Button */}
        <div
          text="view"
          className='cursor-pointer ml-5 mt-2 text-[#EB5017] hover:border-[#EB5017]'
          size='sm'
          onClick={() => navigate(`/dashboard/strategy?strategy_id=${data.strategy_info['_id']}`)}
        >
          View
        </div>
      </div>
      <h3 className="text-xl text-gray-500 mb-20">{data.ticker}</h3>

      <div className="grid grid-cols-3 gap-8"> 
        <div className="col-span-3">
          {lastSignal && (
          <div className="mb-4 text-red-700 rounded relative" role="alert">
            <span className="block sm:inline">
              Last Signal: {lastSignal.type} at {new Date(lastSignal.time * 1000).toLocaleString()}
            </span>
          </div>
        )}
          {data.trades && stockData && <TradingViewLightChart data={stockData} trades={data.trades}/>}
        </div>
      </div>
      <h3 className="text-lg font-bold mt-10">Backtesting Results</h3>
      <StrategyAnalysis result={data} indexesData={indexesData}/>
    </section>
  );
}

export default StockAnalysis;
