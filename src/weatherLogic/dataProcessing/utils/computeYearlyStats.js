import { calculateMax, calculateMin, calculateAverage, calculateSum, } from "./helperFuncsForDataProcessing";

export function computeYearlyStats(groupedData) {
    // In here, for each day, there is the min and max of each data point (temp, rain, wind) per year.
    // Once the computing is finished, each day has 15 entries per property (minTemp, maxTemp, etc), one per year.
    return Object.entries(groupedData).map(([date, dayData]) => {

        const yearlyStats = Object.entries(dayData.yearlyData).map(([year, data]) => {
            return {
                year,
                minTemperature: calculateMin(data.temperatures),
                maxTemperature: calculateMax(data.temperatures),
                minRainfall: calculateMin(data.rainfalls),
                maxRainfall: calculateMax(data.rainfalls),
                minWindSpeed: calculateMin(data.windSpeeds),
                maxWindSpeed: calculateMax(data.windSpeeds),
                avgWindSpeed: calculateAverage(data.windSpeeds),
                sumPrecipitation: calculateSum(data.rainfalls)
            };
        });

        return { date, yearlyStats };
    });
}
