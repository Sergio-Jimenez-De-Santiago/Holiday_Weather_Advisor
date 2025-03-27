import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import { getYAxisLabel, prepareCityChartData, generateAnnotations, buildChartConfig } from "./utils/helperFuncsForLineChart";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, annotationPlugin);


export const LineChartComponent = ({ data, title, timeRangeMode, dataQueried, sharedYScale }) => {
    const yAxisLabel = getYAxisLabel(dataQueried);
    const cityData = prepareCityChartData(data, timeRangeMode, dataQueried)
    const annotations = generateAnnotations(data, cityData.labels, timeRangeMode)
    const configCity = buildChartConfig( cityData, title, yAxisLabel, sharedYScale, annotations )

    return <Line data={configCity.chartData} options={configCity.options} />;
};


export const LineChartComponentCombined = ({ data1, data2, title, timeRangeMode, 
        dataQueried, sharedYScale, displayedCity1, displayedCity2 }) => {

    const yAxisLabel = getYAxisLabel(dataQueried);
    const city1Data = prepareCityChartData(data1, timeRangeMode, dataQueried)
    const city2Data = prepareCityChartData(data2, timeRangeMode, dataQueried)
    const annotations = generateAnnotations(data1, city1Data.labels, timeRangeMode)

    const configCity1 = buildChartConfig(city1Data, "", yAxisLabel, sharedYScale, [], "1");
    const configCity2 = buildChartConfig(city2Data, "", yAxisLabel, sharedYScale, [], "2");

    const labels = city1Data.labels;
    const datasets = [
        {
            ...configCity1.chartData.datasets[0],
            label: `${yAxisLabel} (Max) - ${displayedCity1}`,
        },
        {
            ...configCity1.chartData.datasets[1],
            label: `${yAxisLabel} (Average) - ${displayedCity1}`,
        },
    ];
    if (city1Data.dataMin && city1Data.dataMin.length > 0) {
        datasets.push({
            ...configCity1.chartData.datasets[2],
            label: `${yAxisLabel} (Min) - ${displayedCity1}`,
        });
    }

    datasets.push({
        ...configCity2.chartData.datasets[0],
        label: `${yAxisLabel} (Max) - ${displayedCity2}`,
    });
    datasets.push({
        ...configCity2.chartData.datasets[1],
        label: `${yAxisLabel} (Average) - ${displayedCity2}`,
    });
    if (city2Data.dataMin && city2Data.dataMin.length > 0) {
        datasets.push({
            ...configCity2.chartData.datasets[2],
            label: `${yAxisLabel} (Min) - ${displayedCity2}`,
        });
    }

    const chartData = { labels, datasets };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                labels: {
                    boxWidth: 60,
                    boxHeight: 0,
                },
            },
            title: {
                display: true,
                text: title,
                font: { size: 22 },
            },
            annotation: {
                annotations: annotations,
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Time" },
            },
            y: {
                title: { display: true, text: yAxisLabel },
                max: sharedYScale.max === 0 ? 1 : Math.ceil(sharedYScale.max),
                min: Math.floor(sharedYScale.min),
            },
        },
    };

    return <Line data={chartData} options={options} />;
};
