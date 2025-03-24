export function prepareYearlyDataArrays(yearlyMinMax) {
    const response = yearlyMinMax.map(day => {
        const { date, yearlyStats } = day;
        const minTemperatures = yearlyStats.map(s => s.minTemperature);
        const maxTemperatures = yearlyStats.map(s => s.maxTemperature);
        const minRainfalls = yearlyStats.map(s => s.minRainfall);
        const maxRainfalls = yearlyStats.map(s => s.maxRainfall);
        const minWindSpeeds = yearlyStats.map(s => s.minWindSpeed);
        const maxWindSpeeds = yearlyStats.map(s => s.maxWindSpeed);
        const avgWindSpeeds = yearlyStats.map(s => s.avgWindSpeed);
        const sumPrecipitations = yearlyStats.map(s => s.sumPrecipitation);

        return {
            date,
            minTemperatures,
            maxTemperatures,
            minRainfalls,
            maxRainfalls,
            minWindSpeeds,
            maxWindSpeeds,
            avgWindSpeeds,
            sumPrecipitations
        };
    });

    return response;
}
