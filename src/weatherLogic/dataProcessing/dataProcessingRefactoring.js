import {
    calculateWeightedAverage, calculateAverage, calculateSum, calculateTemperatureProbabilities, 
    calculateWindSpeedProbabilities, calculatePrecipitationProbabilities
} from "./utils/helperFuncsForDataProcessing";
import { groupWeatherData } from "./utils/RawToGroupedData";
import { computeYearlyStats } from "./utils/computeYearlyStats"
import { prepareYearlyDataArrays } from "./utils/prepareYearlyDataArrays"
import { computeHourlyAndRangeStats } from "./utils/computeHourlyAndRangeStats"

/*
0: Return daily max and min.
1: Return hourly max and min. 
2: Return time range max and min (00:00-08:00, 08:00-16:00, 16:00-00:00).
*/

// In here I'm trying to change the max and min so that, for example, the min value is
// the avg of min values across the 15teen years instead of the absolute min
// If typeOfMaxMin === 0, use max/min, if === 1, use secondMax/Min, if === 2, use thirdMax/Min
export const calculateHistoricalDataMaxMinAndAveragesUpdatedRefactored = (weatherDataArray, isItForecast, documents, error, typeOfMaxMin = 0) => {
    console.log("weatherDataArray", weatherDataArray)

    const weights = {
        early: 0.20,   // 2000-2014
        mid: 0.35,     // 2015-2019
        recent: 0.45   // 2020-2024
    };

    // Group raw data by date, hour, and year
    const groupedData = groupWeatherData(weatherDataArray, weights);
    console.log("groupedData", groupedData)

    // Compute yearly stats per day (per day 15 array elements, one per year, and inside each year the minTemp, maxTemp, etc)
    const yearlyMinMax = computeYearlyStats(groupedData)
    console.log("yearlyMinMax", yearlyMinMax)

    // Reorganise the data so that per day there is an array for maxTemps, minTemps, etc
    const yearlyDataArrays = prepareYearlyDataArrays(yearlyMinMax)
    console.log("yearlyDataArrays", yearlyDataArrays)

    // Return the final result after processing each day
    return Object.entries(groupedData).map(([date, dayData], index) => {
        const dailyMaxTemps = [];
        const dailyMinTemps = [];
        const dailyAvgTemps = [];
        const dailyMaxWinds = [];
        const dailyMinWinds = [];
        const dailyAvgWinds = [];
        const dailyMaxRains = [];
        const dailyMinRains = [];
        const dailyAvgRains = [];

        // Compute hourly and range statistics.
        const { hourlyData, rangesData } = computeHourlyAndRangeStats(dayData.hourlyData, typeOfMaxMin);

        // Group up daily values for later weighted averages
        hourlyData.forEach(({ maxTemperature, minTemperature, avgTemperature, maxWindSpeed, minWindSpeed, avgWindSpeed, maxRainfall, minRainfall, avgRainfall }) => {
            dailyMaxTemps.push(maxTemperature);
            dailyMinTemps.push(minTemperature);
            dailyAvgTemps.push(Number(avgTemperature));
            dailyMaxWinds.push(maxWindSpeed);
            dailyMinWinds.push(minWindSpeed);
            dailyAvgWinds.push(Number(avgWindSpeed));
            dailyMaxRains.push(maxRainfall);
            dailyMinRains.push(minRainfall);
            dailyAvgRains.push(Number(avgRainfall));
        });

        const yearlyDataPerDay = yearlyDataArrays[index];
        // If the size of the array per data (maxTemp, minTemp, etc) is one, then it means we're in the 
        // forecast case. In that case, the weights array is only of size 1 and value 1. Else, the array
        // contains the 15 weight values in order
        const weightsInOrderFor15Years = yearlyDataPerDay.maxTemperatures.length === 1 ? [1]
            : [0.2, 0.2, 0.2, 0.2, 0.2, 0.35, 0.35, 0.35, 0.35, 0.35, 0.45, 0.45, 0.45, 0.45, 0.45];

        return {
            date,
            dailyMaxMins: {
                temperature: {
                    max: calculateWeightedAverage(yearlyDataPerDay.maxTemperatures, weightsInOrderFor15Years),
                    min: calculateWeightedAverage(yearlyDataPerDay.minTemperatures, weightsInOrderFor15Years),
                    hotProbability: calculateTemperatureProbabilities(yearlyDataPerDay, true, documents, error),
                    coldProbability: calculateTemperatureProbabilities(yearlyDataPerDay, false, documents, error)
                },
                windSpeed: {
                    max: calculateWeightedAverage(yearlyDataPerDay.maxWindSpeeds, weightsInOrderFor15Years),
                    min: calculateWeightedAverage(yearlyDataPerDay.minWindSpeeds, weightsInOrderFor15Years),
                    windyProbability: calculateWindSpeedProbabilities(yearlyDataPerDay, true, documents, error),
                    noWindProbability: calculateWindSpeedProbabilities(yearlyDataPerDay, false, documents, error)
                },
                rainfall: {
                    max: calculateSum(dailyMaxRains),
                    rainyProbability: calculatePrecipitationProbabilities({
                        maxRainSum: calculateSum(dailyMaxRains),
                        avgRainSum: calculateSum(dailyAvgRains)
                    }, true, documents, error),
                    noRainProbability: calculatePrecipitationProbabilities({
                        maxRainSum: calculateSum(dailyMaxRains),
                        avgRainSum: calculateSum(dailyAvgRains)
                    }, false, documents, error)
                }
            },
            dailyAverages: {
                temperature: calculateAverage(dailyAvgTemps),
                windSpeed: calculateAverage(dailyAvgWinds),
                rainfall: calculateSum(dailyAvgRains)
            },
            hourlyData,
            rangesData,
            source: isItForecast ? "forecast" : "historical"
        };
    });
};