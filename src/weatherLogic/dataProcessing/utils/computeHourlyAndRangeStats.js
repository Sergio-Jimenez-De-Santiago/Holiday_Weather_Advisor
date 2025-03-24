import {
    calculateWeightedAverage, calculateAverage, calculateSum, calculateTop7Average, 
    calculateSecondMin, calculateSecondMax, calculateThirdMax, calculateThirdMin, calculateMax, calculateMin
} from "./helperFuncsForDataProcessing";

// Choose proper max/min functions based on typeOfMaxMin
const selectMinMaxFunctions = (typeOfMaxMin) => {
    if (typeOfMaxMin === 1) {
        return { max: calculateSecondMax, min: calculateSecondMin };
    } else if (typeOfMaxMin === 2) {
        return { max: calculateThirdMax, min: calculateThirdMin };
    } else {
        return { max: calculateMax, min: calculateMin };
    }
};

// Compute stats for hourly data and group them by time ranges
export const computeHourlyAndRangeStats = (dayHourlyData, typeOfMaxMin) => {
    const hourlyData = [];
    const ranges = { nighttime: [], morning: [], afternoon: [], evening: [] };
    const minMaxFuncs = selectMinMaxFunctions(typeOfMaxMin);

    Object.entries(dayHourlyData).forEach(([hourString, data]) => {
        const hourInteger = parseInt(hourString.slice(0, 2), 10);

        const maxTemp = minMaxFuncs.max(data.temperatures);
        const minTemp = minMaxFuncs.min(data.temperatures);
        const maxWind = minMaxFuncs.max(data.windSpeeds);
        const minWind = minMaxFuncs.min(data.windSpeeds);

        // For rainfall, we use a different logic
        const maxRain = calculateTop7Average(data.rainfalls);
        const minRain = calculateSecondMin(data.rainfalls);
        const avgTemp = calculateWeightedAverage(data.temperatures, data.weights);
        const avgWind = calculateWeightedAverage(data.windSpeeds, data.weights);
        const avgRain = calculateWeightedAverage(data.rainfalls, data.weights);

        hourlyData.push({
            hourString,
            maxTemperature: maxTemp,
            minTemperature: minTemp,
            avgTemperature: avgTemp,
            maxWindSpeed: maxWind,
            minWindSpeed: minWind,
            avgWindSpeed: avgWind,
            maxRainfall: maxRain,
            minRainfall: minRain,
            avgRainfall: avgRain,
        });

        // Group hourly results into time ranges
        const rangeKey = hourInteger < 6 ? 'nighttime' : hourInteger < 12 ? 'morning' : hourInteger < 18 ? 'afternoon' : 'evening';
        ranges[rangeKey].push({ maxTemp, minTemp, maxWind, minWind, maxRain, minRain, avgTemp, avgWind, avgRain });
    });

    const computeRangeStats = (rangeData) => {
        const tempMax = minMaxFuncs.max(rangeData.map(r => r.maxTemp));
        const tempMin = minMaxFuncs.min(rangeData.map(r => r.minTemp));
        const windMax = minMaxFuncs.max(rangeData.map(r => r.maxWind));
        const windMin = minMaxFuncs.min(rangeData.map(r => r.minWind));
        const totalRainMax = calculateSum(rangeData.map(r => r.maxRain));
        const totalRainMin = calculateSum(rangeData.map(r => r.minRain));
        return {
            maxTemperature: tempMax,
            minTemperature: tempMin,
            maxWindSpeed: windMax,
            minWindSpeed: windMin,
            maxRainfall: totalRainMax,
            minRainfall: totalRainMin,
            avgTemperature: calculateAverage(rangeData.map(r => Number(r.avgTemp))),
            avgWindSpeed: calculateAverage(rangeData.map(r => Number(r.avgWind))),
            sumRainfall: calculateSum(rangeData.map(r => Number(r.avgRain)))
        };
    };

    return {
        hourlyData, rangesData: {
            nighttime: computeRangeStats(ranges.nighttime),
            morning: computeRangeStats(ranges.morning),
            afternoon: computeRangeStats(ranges.afternoon),
            evening: computeRangeStats(ranges.evening)
        }
    };
};