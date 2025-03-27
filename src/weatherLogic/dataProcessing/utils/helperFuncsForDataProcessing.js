export const calculateMax = (arr) => (arr.length ? Math.max(...arr) : null);

export const calculateSecondMax = (arr) => {
    if (arr.length < 2) return calculateMax(arr);
    const max = Math.max(...arr);
    const filteredArr = arr.filter(num => num !== max);
    // If all elements of arr are the same, return that number
    if (filteredArr.length === 0) return max;
    return Math.max(...filteredArr);
};

export const calculateThirdMax = (arr) => {
    if (arr.length < 3) return calculateSecondMax(arr);
    const max = Math.max(...arr);
    const filteredArr = arr.filter(num => num !== max);
    if (filteredArr.length === 0) return max;
    const secondMax = Math.max(...filteredArr);
    const filteredArr2 = filteredArr.filter(num => num !== secondMax);
    if (filteredArr2.length === 0) return secondMax;
    return Math.max(...filteredArr2);
};

export const calculateMin = (arr) => (arr.length ? Math.min(...arr) : null);

export const calculateSecondMin = (arr) => {
    if (arr.length < 2) return calculateMin(arr);
    const min = Math.min(...arr);
    const filteredArr = arr.filter(num => num !== min);
    // If all elements of arr are the same, return that number
    if (filteredArr.length === 0) return min;
    return Math.min(...filteredArr);
};

export const calculateThirdMin = (arr) => {
    if (arr.length < 3) return calculateSecondMin(arr);
    const min = Math.min(...arr);
    const filteredArr = arr.filter(num => num !== min);
    if (filteredArr.length === 0) return min;
    const secondMin = Math.min(...filteredArr);
    const filteredArr2 = filteredArr.filter(num => num !== secondMin);
    if (filteredArr2.length === 0) return secondMin;
    return Math.min(...filteredArr2);
};

export const calculateWeightedAverage = (values, weights) => {
    // Multiply each value by its corresponding weight and sum them up
    const sumOfWeightedValues = values.reduce((sum, value, index) => sum + (value * weights[index]), 0);
    const sumWeights = weights.reduce((sum, w) => sum + w, 0);
    return sumWeights > 0 ? (sumOfWeightedValues / sumWeights).toFixed(2) : "Error";
};

export const calculateAverage = (arr) => (arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(2);

export const calculateSum = (arr) => {
    const numericArr = arr.map(val => typeof val === 'string' ? parseFloat(val) : val);
    return numericArr.reduce((sum, val) => sum + val, 0).toFixed(2);
};

export const calculateTop7Average = (arr) => {
    if (arr.length === 0) return '0.00';
    const sorted = arr.slice().sort((a, b) => b - a);
    return calculateAverage(sorted.slice(0, 7));
};

// If hotOrCold === 1, we're calculating p of extreme heat, if === 0, extreme coldness
export const calculateTemperatureProbabilities = (values, hotOrCold, documents, error) => {
    const heatThreshold = error || !documents ? 27 : parseFloat(documents[0].highTemp);
    const coldTreshold = error || !documents ? 0 : parseFloat(documents[0].lowTemp);
    let overHeatCount = 0;
    let underColdCount = 0;
    
    if (hotOrCold){
        // If any of the min temperatures are over the heat threshold, then probability is 100%
        values.minTemperatures.map(value => { if (value > heatThreshold) overHeatCount = -1; });
        if (overHeatCount === -1) return 100;

        // If not, check the max values to calculate the probability
        values.maxTemperatures.map(value => value > heatThreshold ? overHeatCount++ : null );
        return 100 * overHeatCount / values.maxTemperatures.length;    
    } else{
        // If any of the max temperatures are under the heat threshold, then probability is 100%
        values.maxTemperatures.map(value => { if (value < coldTreshold) underColdCount = -1; });
        if (underColdCount === -1) return 100;

        // If not, check the min values to calculate the probability
        values.minTemperatures.map(value => value < coldTreshold ? underColdCount++ : null );
        return 100 * underColdCount / values.minTemperatures.length;    
    }
};

export const calculatePrecipitationProbabilities = (values, precipitation, documents, error) => {
    const rainyDay = error || !documents ? 3 : parseFloat(documents[0].rainy);
    const noRainDay = error || !documents ? 1.5 : parseFloat(documents[0].notRainy);
    
    if (precipitation){
        if(values.avgRainSum > rainyDay) return 95;
        if(values.maxRainSum > rainyDay) return 33;
    } else{
        if(values.avgRainSum < noRainDay) return 95;
    }
    return 0;
};

// If wind === 1, we're calculating p of windy day, if === 0, of no wind
export const calculateWindSpeedProbabilities = (values, wind, documents, error) => {
    const windyDay = error || !documents ? 25 : parseFloat(documents[0].windy);
    const noWindDay = error || !documents ? 8 : parseFloat(documents[0].notWindy);
    let windyDayCount = 0;
    let noWindDayCount = 0;
    
    if (wind){
        // If any of the min wind speeds are over the threshold, then probability is 100%
        values.minWindSpeeds.map(value => { if (value > windyDay) windyDayCount = -1; });
        if (windyDayCount === -1) return 100;

        // If not, check the max values to calculate the probability
        values.maxWindSpeeds.map(value => value > windyDay ? windyDayCount++ : null );
        return 100 * windyDayCount / values.maxWindSpeeds.length;    
    } else{
        // Check the avg values to calculate the probability of little to no wind
        values.avgWindSpeeds.map(value => value < noWindDay ? noWindDayCount++ : null );
        return 100 * noWindDayCount / values.avgWindSpeeds.length;    
    }
};