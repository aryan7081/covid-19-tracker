import {generatePerformanceData} from "@/utils/utils"
import PerformanceChart from './performanceChart';

export default function StatCard({stockName, cummulativeReturns, startDate, endDate, stat}) {
    return (
        <div className="relative p-4 shadow-lg rounded-md bg-white overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
                <p className="flex-grow font-semibold tracking-tighter text-lg sm:text-md text-[#101928]">
                    {stockName}
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
            </div>
            
            <div className="pb-4 mb-6">
                <PerformanceChart data={generatePerformanceData(startDate, endDate, cummulativeReturns)} size={"h-[100px]"}/>
            </div>
            
            {/* Divider */}
            <div className="border-b border-gray-200 my-2"></div>

            {/* Three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {stat.map((s, index) => (
                    <div key={index} className="flex flex-col h-full space-y-2">
                        <p className="text-xs text-left text-gray-500 truncate">
                            {s.name}
                        </p>
                        <p className={`text-base text-left font-semibold ${parseFloat(s.value) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
