import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {getStrategies} from "@/utils/api"
import ButtonPrimary from "./common/button";
import StrategiesList from './common/strategiesList';
import Loader from '@/widgets/layout/loader';
import InfiniteScroll from 'react-infinite-scroll-component';

export function Data() {
  const [strategies, setStrategies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // initialized to 1
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchStrategies = async () => {
    const result = await getStrategies(currentPage); // fetch strategies for the current page
    const strategies = result.strategies
    console.log("result.strategies", result.strategies);
    setStrategies(strategies => ({...strategies, ...result.strategies}));
    setTotalPages(result.total_pages);
  };

  useEffect(() => {
    console.log('currentPage -> ', currentPage, totalPages)
    fetchStrategies();
  }, [currentPage]); // added currentPage to dependency array
  
  const paginate = () => {
    console.log('here')
    setCurrentPage(prevPage => prevPage + 1);
  }

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Explore Strategies</h2>
        <ButtonPrimary text={"Create strategy"} onClick={()=>{navigate(`/dashboard/strategy/create`)}} />
      </div>
      {(!strategies || strategies.length == 0) && (
      <div className="flex-grow flex items-center justify-center mt-50">
        <Loader />
      </div>
    )}
    {
      strategies && <div>
     <InfiniteScroll
      style={{ overflow: 'visible' }}
      dataLength={Object.values(strategies).length}
      next={()=>{console.log('here 1'); paginate()}}
      hasMore={currentPage < totalPages}
      loader={<Loader />}
    >
      <StrategiesList strategiesMap={strategies} />
    </InfiniteScroll>
      </div>
    }
    </section>
  );
}


export default Data;
