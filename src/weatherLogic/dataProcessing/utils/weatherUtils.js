import { fetchHistoricalWeatherData, fetchForecastDataOpenMeteo } from "../../api/api";
import { calculateHistoricalDataMaxMinAndAveragesUpdatedRefactored } from "../dataProcessingRefactoring";


// Reset time to midnight for date-only calculations (not taking time into account)
export const resetToMidnight = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
};

// Fetch weather data for a city
// Determines how many days from today the start and end dates are.
// If the period overlaps with the forecast window (up to 14 days from now), it fetches forecast data.
// If the period extends beyond that it fetches historical data.
export const fetchCityWeather = async (geoData, start, end, currentDate, documents, error) => {
    const daysFromTodayStart = Math.round((start - currentDate) / (1000 * 60 * 60 * 24));
    const daysFromTodayEnd = Math.round((end - currentDate) / (1000 * 60 * 60 * 24));

    let forecastData = [];
    let historicalData = [];

    // Fetch forecast data for the overlap period (within the 14-day forecast window)
    if (daysFromTodayStart >= 0 && daysFromTodayEnd >= 0 && daysFromTodayStart <= daysFromTodayEnd) {
        const overlapStart = Math.max(0, daysFromTodayStart);
        const overlapEnd = Math.min(14, daysFromTodayEnd);
        if (overlapStart <= overlapEnd) {
            // API expects one extra day since current date is included
            const forecastRaw = await fetchForecastDataOpenMeteo(
                geoData.latitude,
                geoData.longitude,
                overlapEnd + 1
            );

            forecastData = calculateHistoricalDataMaxMinAndAveragesUpdatedRefactored(forecastRaw, true, documents, error);
            // Filter forecast data to include only days within [start, end]
            // Append the year to construct a valid date to then compare dates and keep only the ones the user inputted
            forecastData = forecastData.filter((day) => {
                const [month, dayNum] = day.date.split("-").map(Number);
                const dayDate = new Date(start.getFullYear(), month - 1, dayNum);
                return dayDate >= start && dayDate <= end;
            });
        }
    }

    // For days after the 14-day forecast period, fetch historical data
    if (daysFromTodayEnd > 14) {
        const historicalStart = new Date(currentDate);
        historicalStart.setDate(currentDate.getDate() + Math.max(15, daysFromTodayStart));
        const historicalStartStr = historicalStart.toLocaleDateString('en-CA');
        const historicalEndStr = end.toLocaleDateString('en-CA');

        const historicalRaw = await fetchHistoricalWeatherData(
            geoData.latitude,
            geoData.longitude,
            historicalStartStr,
            historicalEndStr
        );

        historicalData = calculateHistoricalDataMaxMinAndAveragesUpdatedRefactored(historicalRaw, false, documents, error, 1);
    }

    return [...forecastData, ...historicalData];
};

const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// Helper function to calculate the absolute max and min across both datasets to share a common y-axis
// distribution = 0 is max, distribution = 1 is min
export const calcYScale = (distribution, dataQueried, weatherData1, weatherData2, timeRangeMode) => {
    console.log(weatherData1, "hello")
    console.log(dataQueried)

    if (!weatherData1 || !weatherData2) return 0;

    if (timeRangeMode === 0) {
        const dataset1Values = weatherData1.map(d => parseFloat(distribution === 0 ? d.dailyMaxMins[dataQueried].max : distribution === 1 ? d.dailyMaxMins[dataQueried].min : d.dailyAverages[dataQueried]));
        const dataset2Values = weatherData2.map(d => parseFloat(distribution === 0 ? d.dailyMaxMins[dataQueried].max : distribution === 1 ? d.dailyMaxMins[dataQueried].min : d.dailyAverages[dataQueried]));
        return distribution === 0 ? Math.max(...dataset1Values, ...dataset2Values) : Math.min(...dataset1Values, ...dataset2Values);
    } else if (timeRangeMode === 1) {
        const placeholder = distribution === 0 ? "max" + capitalize(dataQueried) : distribution === 1 ? "min" + capitalize(dataQueried) : "avg" + capitalize(dataQueried);
        const dataset1Values = weatherData1.flatMap(d => d.hourlyData.map(h => parseFloat(h[placeholder])));
        const dataset2Values = weatherData2.flatMap(d => d.hourlyData.map(h => parseFloat(h[placeholder])));
        return distribution === 0 ? Math.max(...dataset1Values, ...dataset2Values) : Math.min(...dataset1Values, ...dataset2Values);
    } else if (timeRangeMode === 2) {
        const placeholder = distribution === 0 ? "max" + capitalize(dataQueried) : distribution === 1 ? "min" + capitalize(dataQueried) : "avg" + capitalize(dataQueried);
        const dataset1Values = weatherData1.flatMap(d => Object.values(d.rangesData).map(r => parseFloat(r[placeholder])));
        const dataset2Values = weatherData2.flatMap(d => Object.values(d.rangesData).map(r => parseFloat(r[placeholder])));
        return distribution === 0 ? Math.max(...dataset1Values, ...dataset2Values) : Math.min(...dataset1Values, ...dataset2Values);
    }
    return 0;
};
