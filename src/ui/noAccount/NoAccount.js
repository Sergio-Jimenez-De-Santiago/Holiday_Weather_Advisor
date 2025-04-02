import styles from '../home/Home.module.css';
import CombinedGraph from '../weatherOutput/CombinedGraph';
import SeparatedGraphs from '../weatherOutput/SeparatedGraphs';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useState } from "react";
import { fetchGeolocation } from "../../weatherLogic/api/api";
import WeatherComparisonForm from "../weatherComparisonForm/WeatherComparisonForm";
import { resetToMidnight, fetchCityWeather } from "../../weatherLogic/dataProcessing/utils/weatherUtils";

export default function NoAcount({ graphMode }) {
    const { user } = useAuthContext()
    const noAccount = true;
    const queryUid = noAccount || !user ? "" : user.uid;
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

    const lowThreshold = (effectiveDocuments && effectiveDocuments[0] && !effectiveDocumentError) ? parseFloat(effectiveDocuments[0].lowTemp) : "0";
    const highThreshold = (effectiveDocuments && effectiveDocuments[0] && !effectiveDocumentError) ? parseFloat(effectiveDocuments[0].highTemp) : "27";



    return (
        <div className={styles.weatherForm} style={{ width: '94%', margin: '2% auto 2%' }}>
            {graphMode === "separated" ? (
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
                    <SeparatedGraphs 
                        lowThreshold={lowThreshold} 
                        highThreshold={highThreshold} 
                        weatherError={weatherError} 
                        weatherData1={weatherData1} 
                        weatherData2={weatherData2} 
                        displayedCity1={displayedCity1} 
                        displayedCity2={displayedCity2} 
                        setWeatherData1={setWeatherData1} 
                        setWeatherData2={setWeatherData2} 
                        timeRangeMode={timeRangeMode} 
                    />
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "0px 20px 20px" }}>
                    <h2>Combined Graphs</h2>
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
                    <CombinedGraph 
                        lowThreshold={lowThreshold} 
                        highThreshold={highThreshold} 
                        weatherError={weatherError} 
                        weatherData1={weatherData1} 
                        weatherData2={weatherData2} 
                        displayedCity1={displayedCity1} 
                        displayedCity2={displayedCity2} 
                        setWeatherData1={setWeatherData1} 
                        setWeatherData2={setWeatherData2} 
                        timeRangeMode={timeRangeMode} 
                    />
                </div>
            )}
        </div>
    )
}