import {useState, useEffect} from 'react';
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import StrategyCard from "./card"
import StatCard from "./statCard"

const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4, // Display three cards at a time
    },
    desktop: {
      breakpoint: { max: 3000, min: 1300 },
      items: 3, // Display three cards at a time
    },
    tablet: {
      breakpoint: { max: 1300, min:  464},
      items: 2, // Adjust as per your design
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, // Display one card at a time
    },
  };

  const CustomLeftArrow = ({ onClick, carouselState }) => {
    return (
      <button 
        onClick={onClick} 
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-r-md hover:bg-gray-800"
      >
        &#8249; {/* Left arrow symbol */}
      </button>
    );
  };
  
  const CustomRightArrow = ({ onClick, carouselState }) => {
    return (
      <button 
        onClick={onClick} 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-l-md hover:bg-gray-800"
      >
        &#8250; {/* Right arrow symbol */}
      </button>
    );
  };
  
  const CustomDot = ({ onClick, active, index, carouselState }) => {
    return (
      <button 
        onClick={onClick} 
        className={`mx-1 w-3 h-3 rounded-full ${active ? 'bg-gray-800' : 'bg-gray-400'}`}
      >
        {/* Empty content for the dot button */}
      </button>
    );
  };
  

export default function StrategiesList({strategiesMap}) {
    // Calculate the strategies to display
    const navigate = useNavigate();
    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10 max-w-[1000px] mx-auto">
          {Object.values(strategiesMap).map((strategy, index) => (
              <div key={index} className="relative col-span-full">
              
                  {/* Strategy Name */}
                  <div className='flex flex-row items-center'>
                    <div 
                        className="mb-2 text-[#EB5017] cursor-pointer font-regular text-xl  border-b border-[#EB5017]"
                        onClick={() => navigate(`/dashboard/strategy?strategy_id=${strategy.strategy_info.id}`)}
                    >
                        {strategy.strategy_info.name}
                    </div>
                </div>

                  {/* Carousel */}
                  <Carousel 
                      responsive={responsive} 
                      swipeable={true} 
                      draggable={false} 
                      arrows={true}
                      customLeftArrow={<CustomLeftArrow />}
                      customRightArrow={<CustomRightArrow />}
                      customDot={<CustomDot />}
                      additionalTransfrom={0}
                  >
                      {strategy.stats.map((stat, statIndex) => (
                          <div 
                              className="px-1 py-4" 
                              key={statIndex}
                              onClick={() => window.location.href=`/dashboard/analysis?strategy_id=${strategy.strategy_info.id}&ticker=${stat.ticker}`}
                              style={{ cursor: 'pointer', width: '290px' }}
                          >
                              <StatCard
                                  stockName={stat.ticker}
                                  cummulativeReturns={stat.cummulative_returns}
                                  startDate={stat.start_date}
                                  endDate={stat.end_date}
                                  stat={[
                                      { "name": "Win rate%", value: (stat.win_rate).toFixed(2) },
                                      { "name": "Avg win%", value: (stat.avg_win * 100).toFixed(2) },
                                      { "name": "Total Returns%", value: (stat.cummulative_returns[stat.cummulative_returns.length - 1] * 100).toFixed(2) }
                                  ]}
                              />
                          </div>
                      ))}
                  </Carousel>
              </div>
          ))}
      </div>
  );

}  
