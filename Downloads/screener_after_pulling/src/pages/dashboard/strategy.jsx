import {useState, useEffect, useRef} from 'react';
import { ENV_PROXY } from "@/configs/globalVariable";
import {getBacktestResults, getStrategies} from "@/utils/api"
import ButtonPrimary from "./common/button"
import {backtestStrategy, fetchStrategy, deleteStrategy} from "@/utils/api"
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import BacktestResults from './common/backtestResults'
import AIModal from './common/aiModal';
import { TrashIcon } from "@heroicons/react/24/solid"; // For outline trash icon
import { Alert } from "@material-tailwind/react";
import { fetchTypeaheadResults, getMarket } from '@/utils/api';
import Loader from '@/widgets/layout/loader';
import { NIFTY_50, SNP_500 } from '@/utils/constants';


function SearchBox({ selectedTickers, setSelectedTickers }) {
  console.log(selectedTickers)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef();
  const [displayCount, setDisplayCount] = useState(10); // Or however many items you want to initially display

  const handleTickerSelect = (ticker, uid) => {
    if (!selectedTickers[ticker]) { // Add only if the ticker is not already selected
      setSelectedTickers({ ...selectedTickers, [ticker]: uid });
    }
    setSearchTerm(""); // Clear the search term
    setSearchResults([]); // Clear typeahead results
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // If click was outside the dropdown, clear the search results
      setSearchResults([]);
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Stop event propagation to avoid reaching document click listener
    const ticker = e.currentTarget.dataset.ticker;
    const uid = e.currentTarget.dataset.uid;
    handleTickerSelect(ticker, uid); // Pass the ticker and UID values
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value; // Store the current value
    setSearchTerm(value); // Set the searchTerm state

    if (value.length > 2) {
      // Call fetchTypeaheadResults with the current value instead of searchTerm
      const results = await fetchTypeaheadResults(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleRemoveTicker = (tickerToRemove) => {
    const { [tickerToRemove]: _, ...rest } = selectedTickers;
    setSelectedTickers(rest);
  };

  return (
    <div className="relative mt-1 w-full">
      {/* Render chips for selected tickers */}
      <div className="flex flex-wrap">
        {Object.entries(selectedTickers).slice(0, displayCount).map(([ticker, uid], index) => (
          <div key={index} className="bg-[#FCB59A] text-white rounded-full px-2 m-1 flex items-center">
            {ticker}
            <span className="ml-2 cursor-pointer" onClick={() => handleRemoveTicker(ticker)}>×</span>
          </div>
        ))}
        {Object.keys(selectedTickers).length > displayCount && (
          <div className="text-blue-500 p-1 m-1">
            +{Object.keys(selectedTickers).length - displayCount} more
          </div>
        )}
      </div>
      <div className="relative"> {/* Additional div for positioning the icon */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded p-2.5 text-black w-full pl-12 border-[#FCB59A] border-[#FCB59A] focus:outline-none focus:border-[#FCB59A] focus:ring-1 focus:ring-[#FCB59A]"
          placeholder="Search for ticker"
        />
        {/* Search Icon */}
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
          {/* Replace with your actual search icon */}
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
        </span>
      </div>

      {searchResults && searchResults.length > 0 && (
        <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-20">
          {searchResults.map((ticker, index) => (
            <div
              key={index}
              data-ticker={ticker.ticker}
              data-uid={ticker.uid}
              onClick={handleDropdownClick}
              className="cursor-pointer p-2 hover:bg-gray-200 text-black"
            >
              {ticker.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export function Strategy() {
  const [strategy, setStrategy] = useState([]);
  const location = useLocation();
  const [selectedTickers, setSelectedTickers] = useState([]); // Change to an array to hold multiple tickers
  const [backtestResults, setBacktestResults] = useState([]);
  const [backTestSearchTerm, setBackTestSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const market = getMarket();
  
  const aiExplain = () => {
    setIsModalOpen(true);
  };

  const fetchBacktestResults = async (pageNumber) => {
    try {
        setFetching(true);
        const result = await getBacktestResults(strategy['strategy_id'], pageNumber, backTestSearchTerm);
        setBacktestResults(result);
        setFetching(false);
    } catch (error) {
        console.error("Error fetching strategy:", error);
        setFetching(false);
    }
   };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const strategy_id = queryParams.get('strategy_id');

    const fetchData = async () => {
        try {
            const result = await fetchStrategy(strategy_id);
            setStrategy(result);
        } catch (error) {
            console.error("Error fetching strategy:", error);
        }
    };

    fetchData();
    if (strategy && strategy['strategy_id']) {
      fetchBacktestResults(1);
    }
  
  }, [location.search, strategy['strategy_id'], backTestSearchTerm]);

  function backtestClick() {
    const valuesList = Object.values(selectedTickers);
    backtestStrategy(strategy['strategy_id'], valuesList);
    setSelectedTickers([]);
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 2000); // Hide after 1 second
  }

  async function removeStrategy(strategy_id) {
    const userConfirmed = window.confirm("Are you sure you want to delete this strategy?");
    
    if(!userConfirmed) return; // If user clicks "Cancel", do nothing

    try {
        const res = await deleteStrategy(strategy_id);
        navigate('/dashboard/strategies');
    } catch (error) {
        console.error("Error deleting strategy:", error);
    }
  }
  return (
    <section className="p-8">
      {/* Heading */}
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold mb-4">{strategy && strategy.name}</h2>
          {strategy && strategy.user_id && <div
            className='cursor-pointer ml-5 mt-2 text-[#eb1717] hover:text-[#C03D13] hover:border-[#EB5017] flex items-center'
            onClick={() => removeStrategy(strategy.strategy_id)}
        >
            <TrashIcon className='h-6 w-6 mr-1' />
        </div>}
        </div>
        <div className='w-2/3 bg-white p-5 shadow-md mt-10 rounded-lg'>
          {strategy.prompt}
          {strategy.stop_loss && <div className='font-medium italic'>Stop Loss - {strategy.stop_loss}%</div>}
          {strategy.target && <div className='font-medium italic'>Target - {strategy.target}%</div>}
      </div>

        {/* <div className='mt-6'>
          <ButtonPrimary size={"sm"} text='AI Assist' onClick={()=> {aiExplain()}}/>
        </div> */}
      </div>
      {strategy && isModalOpen && (
        <AIModal
          onClose={() => setIsModalOpen(false)}
          strategyId={strategy['strategy_id']}
        />
      )}
      {
        strategy && strategy.user_id &&
        <div className='mt-10 bg-white p-6 shadow-md rounded-md'>
          <h2 className="text-xl font-medium mb-2">Backtest your strategy</h2>

        <div className='w-2/3 flex flex-row '>
          <div className='flex-grow flex flex-row gap-10'>
          <div className='flex flex-grow flex-col'>
            <SearchBox selectedTickers={selectedTickers} setSelectedTickers={setSelectedTickers} />
            {
              market == 'india' && <div 
              className='cursor-pointer text-[#EB5017] hover:text-[#C03D13] hover:border-[#EB5017] underline'
              onClick={() => setSelectedTickers(NIFTY_50)}
            >
              Nifty 50
            </div>
            }

          </div>
            <div className='mt-auto'>
              <ButtonPrimary text='Backtest' onClick={()=> {backtestClick()}}/>
              <div className='opacity-0'>NIFTY_50</div>
            </div>
          </div>
        </div>
        </div>
      }
      {showInfo && (
        <div
          className="fixed bottom-4 right-4 text-gray-400 border rounded transition-opacity duration-1000 ease-in z-50"
        >
          <Alert variant="ghost" className='bg-black'>Backtesting in progress. Please refresh the page</Alert>
        </div>
      )}

      {
        backtestResults && <div className="mt-10">
          <BacktestResults stats={backtestResults.stats} total_pages={backtestResults.total_pages}
                            searchTerm={backTestSearchTerm}
                            setSearchTerm={setBackTestSearchTerm}
                            changePage={fetchBacktestResults}
                            fetching={fetching}
                            strategy_id={strategy['strategy_id']} />
        </div>
      }
    </section>
  );
}

export default Strategy;
