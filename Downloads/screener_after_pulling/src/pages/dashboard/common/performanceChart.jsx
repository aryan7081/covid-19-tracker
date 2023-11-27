import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import {generatePerformanceData} from '@/utils/utils';

export default function PerformanceChart({ data, references_data, start_date, end_date, size }) {
  const chartContainerRef = useRef(null);
  let chart = null;
  let height = size || "h-[300px]"

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartOptions = {
        layout: {
          textColor: '#d9d9d9',
          
          fontFamily: 'Arial',
          fontSize: 12
        },
        crosshair: {
          mode: 1
        },
        rightPriceScale: {
          borderColor: '#2B2B43'
        },
        timeScale: {
          borderColor: '#2B2B43',
          rightOffset: 12
        }
      };

      chart = createChart(chartContainerRef.current, chartOptions);

      const lineSeries = chart.addLineSeries({
        color: '#4CAF50', // Line color
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: true,
        title: 'Strategy'
      });

      lineSeries.setData(data);

      if (references_data) {
        for (const [k, v] of Object.entries(references_data)) {
          const d = generatePerformanceData(start_date, end_date, v);
          console.log('d', d)
          const spySeries = chart.addLineSeries({
            color: 'red',
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: true,
            title: k  // Set the title to the label of the dataset
          });
          spySeries.setData(d);
        }
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

  return <div ref={chartContainerRef} className={height}></div>;
}
