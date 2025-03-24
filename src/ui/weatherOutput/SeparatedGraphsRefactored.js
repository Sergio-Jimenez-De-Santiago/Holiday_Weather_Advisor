import React, { useState, useEffect } from "react";
import { fetchGeolocation } from "../../weatherLogic/api/api";
import WeatherComparisonForm from "../weatherComparisonForm/WeatherComparisonForm";
import { LineChartComponentMaxMinAndAverages } from "../../weatherLogic/lineChart/LineChartComponentRefactored";
import { resetToMidnight, fetchCityWeather, calcYScale } from "../../weatherLogic/dataProcessing/utils/weatherUtils";
import { rollingAverageMax } from "../../weatherLogic/lineChart/utils/helperFuncsForLineChart";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';


export default function SeparatedGraphs({ preferencesUpdated, noAccount=false }) {
    const { user } = useAuthContext()
    const queryUid = noAccount || !user ? "" : user.uid;
    console.log("wuery", queryUid)
    const { documents, error } = useCollection(
        'preferences',
        ["uid", "==", queryUid]
    )

    const effectiveDocuments = noAccount ? null : documents;
    const effectiveDocumentError = noAccount ? null : error;

    const [weatherData1, setWeatherData1] = useState(null);
    const [weatherData2, setWeatherData2] = useState(null);
    const [city1, setCity1] = useState("");
    const [city2, setCity2] = useState("");
    const [displayedCity1, setDisplayedCity1] = useState("");
    const [displayedCity2, setDisplayedCity2] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [weatherError, setWeatherError] = useState(null);
    const [timeRangeMode, setTimeRangeMode] = useState(0);

    const handleFetchData = async (e) => {
        e.preventDefault();
        setWeatherError(null);
        setWeatherData1(null);
        setWeatherData2(null);

        const currentDate = resetToMidnight(new Date());
        const start = resetToMidnight(new Date(startDate));
        const end = resetToMidnight(new Date(endDate));

        if (end < start) {
            setWeatherError("End date cannot be earlier than the start date.");
            return;
        }

        if (start < currentDate || end < currentDate) {
            setWeatherError("Selected dates must not be in the past");
            return;
        }

        try {
            // Fetch geolocation concurrently to speed up execution
            const [geoData1, geoData2] = await Promise.all([
                fetchGeolocation(city1),
                fetchGeolocation(city2),
            ]);

            // Set display cities based on returned names by the fetch (eg. chinaa --> chinaane)
            setDisplayedCity1(geoData1.name);
            setDisplayedCity2(geoData2.name);

            // Fetch weather data concurrently to speed up execution
            const [cityWeather1, cityWeather2] = await Promise.all([
                fetchCityWeather(geoData1, start, end, currentDate, effectiveDocuments, effectiveDocumentError),
                fetchCityWeather(geoData2, start, end, currentDate, effectiveDocuments, effectiveDocumentError),
            ]);

            setWeatherData1(cityWeather1);
            setWeatherData2(cityWeather2);
        } catch (err) {
            setWeatherError(err.message);
        }
    };

    // Debug
    useEffect(() => {
        if (weatherData1) console.log("weatherData1:", weatherData1);
        if (weatherData2) console.log("weatherData2:", weatherData2);
    }, [weatherData1, weatherData2]);

    // When user preferences are updated, clear the weather data
    useEffect(() => {
        setWeatherData1(null);
        setWeatherData2(null);
    }, [preferencesUpdated]);

    const lowThreshold = (effectiveDocuments && effectiveDocuments[0] && !effectiveDocumentError) ? effectiveDocuments[0].lowTemp : "0";
    const highThreshold = (effectiveDocuments && effectiveDocuments[0] && !effectiveDocumentError) ? effectiveDocuments[0].highTemp : "27";

    return (
        <div style={{ textAlign: "center", padding: "0px 20px 20px" }}>
            <h2>Separated Graphs</h2>
            <WeatherComparisonForm
                onSubmit={handleFetchData}
                setCity1={setCity1}
                setCity2={setCity2}
                city1={city1}
                city2={city2}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                startDate={startDate}
                endDate={endDate}
                setTimeRangeMode={setTimeRangeMode}
                timeRangeMode={timeRangeMode}
            />

            {weatherError && <p style={{ color: "red" }}>{weatherError}</p>} 

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData1}
                            title={`Temperature Data for ${displayedCity1}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"temperature"}
                            sharedYScale={{
                                max: calcYScale(0, "temperature", weatherData1, weatherData2, timeRangeMode), 
                                min: calcYScale(1, "temperature", weatherData1, weatherData2, timeRangeMode) 
                            }}
                        />
                    </div>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData2}
                            title={`Temperature Data for ${displayedCity2}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"temperature"}
                            sharedYScale={{
                                max: calcYScale(0, "temperature", weatherData1, weatherData2, timeRangeMode), 
                                min: calcYScale(1, "temperature", weatherData1, weatherData2, timeRangeMode) 
                            }}
                        />
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the average temperature will be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData1.length).toFixed(1)}
                            °C, with temperatures ranging from {" "}
                            {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C to {" "}
                            {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C.
                            Taking into consideration historical values, the probability of observing extreme temperatures of under {lowThreshold}°C during
                            your trip in the queried date range is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData1.length).toFixed(1)}
                            % and temperatures over {highThreshold}°C is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the average temperature will be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData2.length).toFixed(1)}
                            °C, with temperatures ranging from {" "}
                            {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C to {" "}
                            {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C.
                            Taking into consideration historical values, the probability of observing extreme temperatures of under {lowThreshold}°C during
                            your trip in the queried date range is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData2.length).toFixed(1)}
                            % and temperatures over {highThreshold}°C is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData1}
                            title={`Rainfall Data for ${displayedCity1}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"rainfall"}
                            sharedYScale={{ 
                                max: calcYScale(0, "rainfall", weatherData1, weatherData2, timeRangeMode), 
                                min: 0
                            }}                            
                        />
                    </div>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData2}
                            title={`Rainfall Data for ${displayedCity2}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"rainfall"}
                            sharedYScale={{ 
                                max: calcYScale(0, "rainfall", weatherData1, weatherData2, timeRangeMode), 
                                min: 0
                            }}  
                        />
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the total precipitation per day will be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData1.length).toFixed(1)}
                            mm, with historical values going up to {" "}
                            {((rollingAverageMax(weatherData1.map((d) => parseFloat(d.dailyMaxMins.rainfall.max)), 4)).reduce((sum, acc) => sum + acc, 0) / weatherData1.length).toFixed(1)}mm
                            per day on average.
                            Taking into consideration historical values, the probability of experiencing a rainy day during
                            your trip in the queried date range is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData1.length).toFixed(1)}
                            % and the probability of experiencing little to no rain is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the total precipitation per day will be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData2.length).toFixed(1)}
                            mm, with historical values going up to {" "}
                            {((rollingAverageMax(weatherData2.map((d) => parseFloat(d.dailyMaxMins.rainfall.max)), 4)).reduce((sum, acc) => sum + acc, 0) / weatherData2.length).toFixed(1)}mm
                            per day on average.
                            Taking into consideration historical values, the probability of experiencing a rainy day during
                            your trip in the queried date range is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData2.length).toFixed(1)}
                            % and the probability of experiencing little to no rain is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData1}
                            title={`Wind Speed Data for ${displayedCity1}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"windSpeed"}
                            sharedYScale={{ 
                                max: calcYScale(0, "windSpeed", weatherData1, weatherData2, timeRangeMode), 
                                min: calcYScale(1, "windSpeed", weatherData1, weatherData2, timeRangeMode) 
                            }}                        
                        />
                    </div>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponentMaxMinAndAverages
                            data={weatherData2}
                            title={`Wind Speed Data for ${displayedCity2}`}
                            timeRangeMode={timeRangeMode}
                            dataQueried={"windSpeed"}
                            sharedYScale={{ 
                                max: calcYScale(0, "windSpeed", weatherData1, weatherData2, timeRangeMode), 
                                min: calcYScale(1, "windSpeed", weatherData1, weatherData2, timeRangeMode) 
                            }}
                        />
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the average wind speed will be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData1.length).toFixed(1)}
                            km/h, with wind speeds ranging from {" "}
                            {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h to {" "}
                            {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h.
                            Taking into consideration historical values, the probability of experiencing a very windy day during
                            your trip in the queried date range is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData1.length).toFixed(1)}
                            % and the probability of experiencing little to no wind is of {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the average wind speed will be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData2.length).toFixed(1)}
                            km/h, with wind speeds ranging from {" "}
                            {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h to {" "}
                            {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h.
                            Taking into consideration historical values, the probability of experiencing a very windy day during
                            your trip in the queried date range is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData2.length).toFixed(1)}
                            % and the probability of experiencing little to no wind is of {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};