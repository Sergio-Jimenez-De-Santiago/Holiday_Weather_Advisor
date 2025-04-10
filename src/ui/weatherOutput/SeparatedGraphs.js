import React, { useEffect } from "react";
import { LineChartComponent } from "../../weatherLogic/lineChart/LineChartComponent";
import { calcYScale } from "../../weatherLogic/dataProcessing/utils/weatherUtils";


export default function SeparatedGraphs({ preferencesUpdated, lowThreshold, highThreshold, weatherError, weatherData1, weatherData2, displayedCity1, displayedCity2, setWeatherData1, setWeatherData2, timeRangeMode }) {
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

    return (
        <div style={{ textAlign: "center", padding: "0px 20px 20px" }}>
            {weatherError && <p style={{ color: "red" }}>{weatherError}</p>} 

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponent
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
                        <LineChartComponent
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
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity1}, the average temperature is estimated to be around{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData1.length).toFixed(1)}
                                °C.
                            </li>
                            <li>
                                Temperatures range from{" "}
                                {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C to{" "}
                                {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C.
                            </li>
                            <li>
                                Probability of experiencing temperatures above {highThreshold}°C:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing temperatures below {lowThreshold}°C:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity2}, the average temperature is estimated to be around{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData2.length).toFixed(1)}
                                °C.
                            </li>
                            <li>
                                Temperatures range from{" "}
                                {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C to{" "}
                                {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C.
                            </li>
                            <li>
                                Probability of experiencing temperatures above {highThreshold}°C:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing temperatures below {lowThreshold}°C:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponent
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
                        <LineChartComponent
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
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity1}, the total rainfall per day is estimated to be around{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData1.length).toFixed(1)}
                                mm on average.
                            </li>
                            <li>
                                Rainfall can reach up to{" "}
                                {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.rainfall.max)))}mm.
                            </li>
                            <li>
                                Probability of experiencing a rainy day:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing little to no rain:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity2}, the total rainfall per day is estimated to be around{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData2.length).toFixed(1)}
                                mm on average.
                            </li>
                            <li>
                                Rainfall can reach up to{" "}
                                {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.rainfall.max)))}mm.
                            </li>
                            <li>
                                Probability of experiencing a rainy day:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing little to no rain:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {weatherData1 && weatherData2 && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                    <div style={{ width: "45%", height: "25em" }}>
                        <LineChartComponent
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
                        <LineChartComponent
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
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity1}, the average wind speed is estimated to be around{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData1.length).toFixed(1)}
                                km/h.
                            </li>
                            <li>
                                Wind speeds range from{" "}
                                {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h to{" "}
                                {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h.
                            </li>
                            <li>
                                Probability of experiencing a very windy day:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing little to no wind:{" "}
                                {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData1.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ul style={{ width: "80%", fontSize: "15px", listStyleType: "disc", textAlign: "left" }}>
                            <li>
                                Over the selected date range in {displayedCity2}, the average wind speed is estimated to be around{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData2.length).toFixed(1)}
                                km/h.
                            </li>
                            <li>
                                Wind speeds range from{" "}
                                {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h to{" "}
                                {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h.
                            </li>
                            <li>
                                Probability of experiencing a very windy day:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                            <li>
                                Probability of experiencing little to no wind:{" "}
                                {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData2.length).toFixed(1)}
                                %.
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};