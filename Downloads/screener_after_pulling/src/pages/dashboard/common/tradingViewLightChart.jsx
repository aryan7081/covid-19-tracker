import React, { useRef } from 'react';
import {useState, useEffect} from 'react';
import { createChart } from 'lightweight-charts';


export default function TradingViewLightChart({ data, trades }) {
    console.log("data", data, trades)
    const chartContainerRef = useRef(null);
    let chart = null;
  
    if (!data) return <div></div>
    useEffect(() => {
        if (chartContainerRef.current) {
            const chartOptions = {
                layout: {
                    textColor: 'black',
                    background: {
                        type: 'solid',
                        color: '#F3F4F6' // Light gray background for clarity
                    },
                    fontFamily: 'Calibri', // You can use any preferred font-family
                    fontSize: 12
                },
                grid: {
                    vertLines: {
                        color: '#E0E3EA' // Light vertical grid lines
                    },
                    horzLines: {
                        color: '#E0E3EA' // Light horizontal grid lines
                    }
                },
                crosshair: {
                    mode: 1 // Use the crosshair to interact with your chart
                },
                priceScale: {
                    borderColor: 'rgba(197, 203, 206, 1)'
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 1)',
                    rightOffset: 12, // Increased right offset for better visualization
                    barSpacing: 15,  // Increasing this value can zoom in the chart
                    lockVisibleTimeRangeOnResize: true
                }
            };
  
            chart = createChart(chartContainerRef.current, chartOptions);
            
            // Candlestick series
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350'
            });
            candlestickSeries.setData(data);
  
            // Extract markers from the data
            // const markers = data
            //     .filter(item => item.position !== null) // assuming 0 means no trade_return
            //     .map(item => ({
            //         time: item.time,
            //         position: item.position === 'sell' ? 'inBar' : 'belowBar',
            //         color: item.position === 'buy' ? '#26a69a' : '#ef5350',
            //         shape: item.position == 'sell'? 'arrowDown' : 'arrowUp',
            //         size: 0.5
            //     }));
            // // Set markers on the candlestick series to denote trade_returns
            // candlestickSeries.setMarkers(markers);
            if (trades) {
                const markers = trades.flatMap((trade, index) => [
                    {
                        time: Date.parse(trade.entry.date) / 1000, // convert time to seconds if it's in milliseconds
                        position: trade.entry.signal == 'sell'?"aboveBar": 'belowBar',
                        color: "#26a69a", // green color for entry
                        shape: trade.entry.signal == 'sell'?"arrowDown": "arrowUp",
                        id: `entry${index}`
                    },
                    trade.exit && {
                        time: Date.parse(trade.exit.date) / 1000, // convert time to seconds if it's in milliseconds
                        position: trade.exit.signal == 'sell'?"aboveBar": 'belowBar',
                        color: "#ef5350", // red color for exit
                        shape: trade.exit.signal == 'sell'?"arrowDown": "arrowUp",
                        id: `exit${index}`
                    }
                ]).filter(Boolean); // filter out undefined markers in case trade.exit is undefined for open trades
    
                // Set markers on the candlestick series to denote trade_returns
                candlestickSeries.setMarkers(markers);
            }
  
            chart.timeScale().fitContent();
        }
  
        return () => {
            if (chart) {
                chart.remove();
                chart = null;
            }
        };
    }, [data]);
  
    return <div ref={chartContainerRef} className="h-[400px]"></div>;
  }
