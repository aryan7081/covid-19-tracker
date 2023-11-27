import {useState, useEffect, useRef} from 'react';
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import SearchBox from '@/widgets/layout/searchBox';
import {fetchTypeaheadResults} from '@/utils/api';
import Loader from '@/widgets/layout/loader';

const TABLE_HEAD = ["Ticker", "P/L", "Win rate", "Avg win", "Avg loss", "Total trades", ""];
 
export default function BacktestResults({strategy_id, stats, total_pages, changePage, searchTerm, setSearchTerm, fetching}) {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            changePage(currentPage - 1);
        }
    }

    const handleNext = () => {
        if (currentPage < total_pages) {
            setCurrentPage(currentPage + 1);
            changePage(currentPage + 1);
        }
    }

    const handlePageClick = (page) => {
        if (page >= 1 && page <= total_pages) {
            setCurrentPage(page);
            changePage(page);
        }
    }

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className='flex flex-row gap-2 justify-between items-center'>
          <div className='text-[#F56630] border-b-[2px] border-[#F56630] inline-block'>
              Backtest Results
          </div>
            <div className="relative"> {/* Additional div for positioning the icon */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e)=>{setSearchTerm(e.target.value)}}
                className="border rounded p-2 text-black w-full pl-12 border-[#FCB59A] focus:outline-none focus:border-[#FCB59A] focus:ring-[#FCB59A] focus:rounded" 
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
        </div>
      </CardHeader>

      {(fetching) && (
        <div className="flex-grow flex items-center justify-center mt-10">
          <Loader />
        </div>
      )}

      <CardBody className="overflow-scroll px-0">
        {
          !fetching && <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y p-4"
                >
                  <Typography
                    variant="small"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map(
              (
                {
                  _id,
                  ticker,
                  avg_win,
                  win_rate,
                  avg_loss,
                  last_df_row,
                  trades_count,
                  cummulative_returns
                },
                index,
              ) => {
                const isLast = index === stats.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {ticker}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {(cummulative_returns[cummulative_returns.length - 1] * 100).toFixed(2)}%
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {(win_rate)}%
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {(avg_win * 100).toFixed(2)}%
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                       {(avg_loss * 100).toFixed(2)}%
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {trades_count}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div
                        className="cursor-pointer text-[#EB5017] hover:text-[#C03D13] hover:border-[#EB5017]"
                        onClick={()=> {navigate(`/dashboard/analysis?strategy_id=${strategy_id}&ticker=${ticker}`)}}
                      >
                        View
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        }
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t  p-4">
            <Button variant="outlined" size="sm" onClick={handlePrevious} disabled={currentPage === 1}
                    className=' border-[#F56630] text-[#F56630]'>
                Prev
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(10, total_pages) }, (_, index) => index + 1).map(page => (
                    <IconButton
                        variant={page === currentPage ? "outlined" : "text"}
                        size="sm"
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className='text-[#F56630] border-[#F56630]'
                    >
                        {page}
                    </IconButton>
                ))}
                {total_pages > 10 && (
                    <Typography
                        variant="small"
                        color="border-[#F56630]"
                        className='font-normal cursor-default text-[#F56630] border-[#F56630]'
                    >
                        ...
                    </Typography>
                )}
                {total_pages > 10 && (
                    <IconButton
                        variant={total_pages === currentPage ? "outlined" : "text"}
                        size="sm"
                        color="border-[#F56630]"
                        onClick={() => handlePageClick(total_pages)}
                        className='text-[#F56630] border-[#F56630]'
                    >
                        {total_pages}
                    </IconButton>
                )}
            </div>
            <Button variant="outlined" size="sm" onClick={handleNext} disabled={currentPage === total_pages}
                className='text-[#F56630] border-[#F56630]'>
                Next
            </Button>
        </CardFooter>
    </Card>
  );
}