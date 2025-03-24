export const fetchGeolocation = async (city) => {
    const geoLocationApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const response = await fetch(geoLocationApiUrl);
    const geolocationData = await response.json();
    if (!geolocationData.results || geolocationData.results.length === 0) throw new Error("City not found or something went wrong.");
    return geolocationData.results[0];
};

export const fetchForecastDataOpenMeteo = async (lat, lon, daysAhead) => {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,rain&forecast_days=${daysAhead}`;
    const response = await fetch(weatherApiUrl);
    if (!response.ok) throw new Error("Unable to fetch weather data.");
    return response.json();
};

export const fetchHistoricalWeatherData = async (lat, lon, startDate, endDate) => {
    // 2010 to 2024
    const years = Array.from({ length: 15 }, (_, i) => 2010 + i);
    let yearDiff = 0;
    if (startDate.slice(0, 4) != endDate.slice(0, 4)) {
        yearDiff = parseInt(endDate.slice(0, 4)) - parseInt(startDate.slice(0, 4));
    }

    const requests = years.map(year => {
        const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=${year}-${startDate.slice(5)}&end_date=${year + yearDiff}-${endDate.slice(5)}&hourly=temperature_2m,rain,wind_speed_10m`;
        return fetch(url).then((res) => res.json());
    });

    return Promise.all(requests);
};