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
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the average temperature is estimated to be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData1.length).toFixed(1)}
                            °C, with temperatures ranging from {" "}
                            {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C to {" "}
                            {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C. 
                            During your trip, the probability of experiencing temperatures above {highThreshold}°C is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData1.length).toFixed(1)}
                            %, and the probability of experiencing temperatures below {lowThreshold}°C is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the average temperature is estimated to be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.temperature), 0) / weatherData2.length).toFixed(1)}
                            °C, with temperatures ranging from {" "}
                            {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.max)))}°C to {" "}
                            {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.temperature.min)))}°C.
                            During your trip, the probability of experiencing temperatures above {highThreshold}°C is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.hotProbability), 0) / weatherData2.length).toFixed(1)}
                            %, and the probability of experiencing temperatures below {lowThreshold}°C is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.temperature.coldProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
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
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the total rainfall amount per day is estimated to be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData1.length).toFixed(1)}
                            mm on average, with values reaching up to {" "}
                            {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.rainfall.max)))}mm.
                            During your trip, the probability of experiencing a rainy day is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData1.length).toFixed(1)}
                            % and the probability of experiencing little to no rain is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the total rainfall amount per day is estimated to be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.rainfall), 0) / weatherData2.length).toFixed(1)}
                            mm on average, with values reaching up to {" "}
                            {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.rainfall.max)))}mm.
                            During your trip, the probability of experiencing a rainy day is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.rainyProbability), 0) / weatherData2.length).toFixed(1)}
                            % and the probability of experiencing little to no rain is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.rainfall.noRainProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
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
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity1}, the average wind speed is estimated to be around {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData1.length).toFixed(1)}
                            km/h, with wind speeds ranging from {" "}
                            {Math.max(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h to {" "}
                            {Math.min(...weatherData1.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h.
                            During your trip, the probability of experiencing a very windy day is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData1.length).toFixed(1)}
                            % and the probability of experiencing little to no wind is {" "}
                            {(weatherData1.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData1.length).toFixed(1)}%.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p style={{ width: "80%", fontSize: "15px" }}>
                            Over the selected date range in {displayedCity2}, the average wind speed is estimated to be around {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyAverages.windSpeed), 0) / weatherData2.length).toFixed(1)}
                            km/h, with wind speeds ranging from {" "}
                            {Math.max(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.max)))}km/h to {" "}
                            {Math.min(...weatherData2.map((day) => parseFloat(day.dailyMaxMins.windSpeed.min)))}km/h.
                            During your trip, the probability of experiencing a very windy day is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.windyProbability), 0) / weatherData2.length).toFixed(1)}
                            % and the probability of experiencing little to no wind is {" "}
                            {(weatherData2.reduce((sum, day) => sum + parseFloat(day.dailyMaxMins.windSpeed.noWindProbability), 0) / weatherData2.length).toFixed(1)}%.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};