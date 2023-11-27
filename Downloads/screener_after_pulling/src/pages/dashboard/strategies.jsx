import {useState, useEffect, useRef} from 'react';
import { ENV_PROXY } from "@/configs/globalVariable";
import {getBacktestResults, getStrategies} from "@/utils/api"
import ButtonPrimary from "./common/button"
import {fetchStrategies} from "@/utils/api"
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import BacktestResults from './common/backtestResults'
import AIModal from './common/aiModal';


export function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getStrategies = async (pageNumber) => {
      try {
          const result = await fetchStrategies(pageNumber);
          setStrategies(result || []);
      } catch (error) {
          console.error("Error fetching strategy:", error);
      }
     };

    getStrategies();

  
  }, []);

  return (
    <section className="p-8">
        {/* Heading */}
        <div>
            <h2 className="text-2xl font-bold mb-6">My strategies</h2>
            <div className='mt-10 flex flex-col items-center justify-center space-y-4 cursor-pointer' style={strategies.length === 0 ? { minHeight: '200px' } : {}}>
                {strategies.length > 0 ? (
                    strategies.map((strategy, index) => (
                        <div onClick={() => navigate(`/dashboard/strategy?strategy_id=${strategy['strategy_id']}`)} key={index} className="bg-white rounded-lg flex justify-between items-center shadow border p-6 mb-4 w-full transition-transform transform hover:scale-105">
                            <div className="flex flex-col w-full">
                                <div className='flex flex-row justify-between items-center'>
                                    <span className="text-lg font-semibold">{strategy.name}</span>
                                </div>
                                <span className="text-sm text-gray-600 mt-2">{strategy.user_instruction}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                        <span className="text-gray-600 text-lg">You haven't created any strategy.</span>
                        <ButtonPrimary text={"Create strategy"} onClick={() => { navigate("/dashboard/strategy/create") }} />
                    </div>
                )}
            </div>
        </div>
    </section>
  );

}

export default Strategies;
