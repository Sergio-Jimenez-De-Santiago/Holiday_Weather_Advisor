export const groupWeatherData = (weatherDataArray, weights) => {
    const groupedData = {};

    // Check there is an array, else, create it (this is for the forecast data case)
    if (!Array.isArray(weatherDataArray)) {
        weatherDataArray = [weatherDataArray];
    }

    weatherDataArray.forEach((data, i) => {
        const year = 2010 + i;
        const weight = year <= 2014 ? weights.early : year <= 2019 ? weights.mid : weights.recent;

        const { time, temperature_2m, rain, wind_speed_10m } = data.hourly;

        time.forEach((timestamp, index) => {
            const date = timestamp.slice(5, 10);
            const hourString = timestamp.slice(11, 16);
            const year = timestamp.slice(0, 4);

            // Create date entry if missing
            if (!groupedData[date]) {
                groupedData[date] = { hourlyData: {}, yearlyData: {} };
            }

            if (!groupedData[date].hourlyData[hourString]) {
                groupedData[date].hourlyData[hourString] = {
                    temperatures: [],
                    windSpeeds: [],
                    rainfalls: [],
                    weights: []
                };
            }
            if (!groupedData[date].yearlyData[year]) {
                groupedData[date].yearlyData[year] = {
                    temperatures: [],
                    windSpeeds: [],
                    rainfalls: [],
                    weights: []
                };
            }

            groupedData[date].hourlyData[hourString].temperatures.push(temperature_2m[index]);
            groupedData[date].hourlyData[hourString].windSpeeds.push(wind_speed_10m[index]);
            groupedData[date].hourlyData[hourString].rainfalls.push(rain[index]);
            groupedData[date].hourlyData[hourString].weights.push(weight);

            groupedData[date].yearlyData[year].temperatures.push(temperature_2m[index]);
            groupedData[date].yearlyData[year].windSpeeds.push(wind_speed_10m[index]);
            groupedData[date].yearlyData[year].rainfalls.push(rain[index]);
            groupedData[date].yearlyData[year].weights.push(weight);
        });
    });

    return groupedData;
}