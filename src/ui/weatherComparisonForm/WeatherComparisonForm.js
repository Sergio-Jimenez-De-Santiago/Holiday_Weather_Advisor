import React from "react";

const WeatherComparisonForm = ({ onSubmit, setCity1, setCity2, city1, city2, setStartDate, setEndDate, startDate, endDate, setTimeRangeMode, timeRangeMode }) => {
    return (
        <form onSubmit={onSubmit}>
            <input 
                type="text" 
                name="city1" 
                placeholder="Enter first city" 
                value={city1}
                onChange={(e) => setCity1(e.target.value)}
                required 
            />
            <input 
                type="text" 
                name="city2" 
                placeholder="Enter second city" 
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                required 
            />
            <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} 
                required 
            />
            <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} 
                required 
            />
            
            <select 
                value={timeRangeMode} 
                onChange={(e) => setTimeRangeMode(Number(e.target.value))}
            >
                <option value={0}>Daily</option>
                <option value={1}>Hourly</option>
                <option value={2}>Time Range (00:00-06:00, 06:00-12:00, 12:00-18:00, 18:00-00:00)</option>
            </select>
            
            <button className='btn' type="submit">Compare Forecast</button>
        </form>
    );
};

export default WeatherComparisonForm;