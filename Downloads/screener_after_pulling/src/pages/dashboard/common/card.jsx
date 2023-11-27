import { useNavigate } from "react-router-dom"


export default function StrategyCard({strategyName, stockName, strategyId, stat}) {
    const navigate = useNavigate();
    return (
        <div className="relative p-4 cursor-pointer bg-white rounded shadow-md" onClick={()=>{navigate(`/dashboard/analysis?strategy_id=${strategyId}&ticker=${stockName}`)}}>
        <div className="w-full relative inline-flex flex-col items-start text-left mb-2">
            <div className="w-full md:w-[251px] gap-1.5 flex flex-col items-start">
                <p className="w-full md:w-[220px] font-semibold tracking-tighter text-lg leading-6 text-[#101928] truncate overflow-hidden">
                    {strategyName}
                </p>

                <p className="w-full md:w-[233px] font-medium leading-[1.45] text-sm text-[#667185]">
                    {stockName}
                </p>
            </div>
        </div>
       <div className="pb-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
       </div>
        {/* Divider */}
        <div className="border-b border-gray-200 my-2"></div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 mt-4 w-full">
            {/* Column 1 */}
            <div className="flex flex-col h-full space-y-[-17px]">
                <p className="h-9 w-30 text-xs text-left text-gray-500">
                    {stat[0].name}
                </p>
                <p className="h-7 w-12 text-base text-left text-gray-800 font-semibold">
                    {stat[0].value}
                </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col h-full space-y-[-17px]">
                <p className="h-9 w-30 text-xs text-left text-gray-500">
                    {stat[1].name}
                </p>
                <p className={`h-7 w-12 text-base text-left font-semibold ${parseFloat(stat[2].value) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat[1].value}
                </p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col h-full space-y-[-17px]">
                <p className="h-9 w-30 text-xs text-left text-gray-500">
                {stat[2].name}
            </p>
                <p className={`h-7 w-12 text-base text-left font-semibold ${parseFloat(stat[2].value) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat[2].value}
                </p>
            </div>
        </div>
    </div>
    )
}