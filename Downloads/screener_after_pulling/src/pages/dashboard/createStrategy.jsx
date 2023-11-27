import {useState, useEffect} from 'react';
import { ENV_PROXY } from "@/configs/globalVariable";
import {getStrategies} from "@/utils/api"
import ButtonPrimary from "./common/button"
import {createStrategy} from "@/utils/api"
import Loader from "@/widgets/layout/loader"
import { useNavigate } from 'react-router-dom';
import Suggestions from './common/suggestions';
import { Alert } from "@material-tailwind/react";
import { Mixpanel } from "@/utils/mixpanel";

function TextArea({ placeholder, value, onChange }) {
    return (
        <textarea 
            className="resize-none border shadow-md rounded-lg p-4 text-sm text-black  focus:outline-none focus:border-[#FCB59A] focus:ring-0 focus:ring-[#FCB59A] placeholder-gray-400 w-full h-16 md:h-32 lg:h-48" 
            // h-32 for mobile devices, md:h-48 for tablet, and lg:h-64 for desktop
            placeholder={placeholder || "Type here..."}
            value={value}
            onChange={onChange}
        />
    );
}


const items = [
    "Understanding your strategy",
    "Writing code",
    "Testing your strategy",
    "Generating..."
  ];
  

  function TransitionList() {
    const [visibleItems, setVisibleItems] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (visibleItems < items.length - 1) {
          setVisibleItems(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 1000); // Adjust the delay as needed
  
      return () => clearInterval(interval);
    }, [visibleItems]);
  
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div className={`transition-opacity duration-500 ${index < visibleItems ? 'opacity-0' : 'opacity-100'}`}>
              {/* Loader - Spinner SVG */}
              <Loader  size='small' />
            </div>
            <div className={`transition-opacity duration-500 ${index < visibleItems ? 'opacity-100' : 'opacity-0'}`}>
              {/* Icon - Checkmark SVG */}
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>{item}</div>
          </div>
        ))}
      </div>
    );
  }
  

export function CreateStrategy() {
    const [strategyInput, setStrategyInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added state to manage loading
    const navigate = useNavigate();
    const onCreateStrategy = async (input) => {
        if (loading) {
            return ;
        }
        try {
            setLoading(true); // Set loading to true when creating strategy
            const res = await createStrategy(input); // Assuming createStrategy is a promise
            console.log('res', res);
            if (res.code && res['_id']) {
                Mixpanel.track("Create strategy success", {strategy_id: res['_id']});
                navigate(`/dashboard/strategy?strategy_id=${res['_id']}`);
            } else if(res.detail) {
                Mixpanel.track("Create strategy error", {error: res.detail});
                setError(res.detail);
                setTimeout(() => setError(""), 2000); // Hide after 1 second
            }
        } catch (error) {
            console.error("Error creating strategy", error);
            Mixpanel.track("Create strategy api error", {error});
            setError("Error creating strategy. Maybe try changing the prompt?");
            setTimeout(() => setError(""), 2000); // Hide after 1 second
        } finally {
            setLoading(false); // Reset loading state after creation is complete or fails
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setStrategyInput(suggestion);
    };

    return (
        <section className="p-8 flex flex-col md:flex-row gap-8">
            <div className="w-2/3 flex-grow mr-10">
                {/* Heading */}
                
                <h2 className="text-2xl font-bold mb-4">Create your strategy</h2>
                <div>
                    <TextArea 
                    placeholder={"e.g buy if close price crosses below low of previous and rsi is below 30. short if current price crosses above the high of previous and rsi value is 70"}
                    value={strategyInput}
                    onChange={(e) => { setStrategyInput(e.target.value) }}
                    />
                    {loading && <TransitionList />}
                    <div className='mt-4'>
                     {!loading && <ButtonPrimary 
                            text={loading ? <Loader size='small' color='text-white'/> : 'Create strategy'}
                            onClick={() => { onCreateStrategy(strategyInput) }}
                            disabled={loading}
                        />
                     }
                    </div>
                </div>
                <div className="mt-24">
                    <h3 className="text-lg font-semibold mb-4 mt-10">Not sure where to start? Click on a prompt below</h3>
                    <div className="max-h-96 overflow-y-auto"> {/* Added max-h-64 and overflow-y-auto */}
                        <Suggestions handleSuggestionClick={handleSuggestionClick} />
                    </div>
                </div>
            </div>
    
            <div className="border-l-2 border-gray-200 w-1/3 flex-grow">
                <div className='bg-white p-8 shadow-md rounded-lg ml-10'>
                    <h2 className="text-2xl font-bold mb-6 flex justify-center items-center h-full">Getting Started</h2>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <span className="material-icons text-[#EB5017] mr-4 text-xl">description</span>
                            <div>
                                <h3 className="font-semibold">1. Describe Your Strategy</h3>
                                <p>Clearly detail in English the Entry, Exit, Stop Loss, and Target points for your strategy.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="material-icons text-[#EB5017] mr-4 text-xl">touch_app</span>
                            <div>
                                <h3 className="font-semibold">2. Implement Your Strategy</h3>
                                <p>Click on "Create strategy" to set your strategy in motion.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="material-icons text-[#EB5017] mr-4 text-xl">autorenew</span>
                            <div>
                                <h3 className="font-semibold">3. Backtest Against Stocks</h3>
                                <p>After creating, you'll be taken to the strategy page. Here, you can test your strategy against various stocks and see its effectiveness.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="material-icons text-[#EB5017] mr-4 text-xl">assessment</span>
                            <div>
                                <h3 className="font-semibold">4. Analyze and Refine</h3>
                                <p>Post backtesting, dive deep into the results. Understand what's working and what can be improved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


    
            {error && (
                <div
                className="fixed bottom-4 right-4 text-gray-400 border rounded transition-opacity duration-1000 ease-in z-50"
                >
                <Alert variant="ghost" className='bg-black'>{error}</Alert>
                </div>
            )}
        </section>
    );
    
}

export default CreateStrategy;
