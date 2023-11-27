import { format } from "prettier";

export function formatStockData(data) {
    console.log('d-.', data[177], data[178], data[179], data.length)
    const formattedData = data
                  .map(value => {
                      return {
                        time: value.timestamp,
                        open: value.open,
                        high: value.high,
                        low: value.low,
                        close: value.close
                      }
                  })
                  .sort((a, b) => a.time - b.time);
    console.log("formattedData", formattedData)

    return formattedData
}

export function generatePerformanceData(start_date, end_date, values) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const data = [];
    for (let date = startDate, i = 0; date <= endDate; date.setDate(date.getDate() + 1), i++) {
      if (i < values.length) {
        data.push({
          time: date.toISOString().split('T')[0], // Extract the date part from the ISO string
          value: values[i]
        });
      }
    }
    
    return data;
  }
