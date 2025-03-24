export const rollingAverageMax = (values) => {
    const smoothed = [];
    for (let i = 0; i < values.length; i++) {
        if (values[i] === null || values[i] === undefined) {
            smoothed.push(null);
            continue;
        }
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - 1); j <= Math.min(values.length - 1, i + 1); j++) {
            if (values[j] !== null && values[j] !== undefined) {
                sum += values[j];
                count++;
            }
        }
        smoothed.push(count ? sum / count : null);
    }
    return smoothed;
};



export const getYAxisLabel = (dataQueried) => {
    switch (dataQueried) {
        case "temperature":
            return "Temperature (°C)";
        case "rainfall":
            return "Rainfall (mm)";
        case "windSpeed":
            return "Wind Speed (m/s)";
        default:
            return "";
    }
};


// Returns, for a single dataset, the labels, dataMax, dataMin and dataAvg
export const prepareCityChartData = (data, timeRangeMode, dataQueried) => {
    let labels = [];
    let dataMax = [];
    let dataMin = [];
    let dataAvg = [];

    if (timeRangeMode === 0) {
        labels = data.map((d) => d.date);
        if (dataQueried === "rainfall") {
            const rawMaxValues = data.map((d) => { return d.source === "historical" ? parseFloat(d.dailyMaxMins.rainfall.max) : null });
            dataMax = rollingAverageMax(rawMaxValues);
            dataAvg = data.map((d) => parseFloat(d.dailyAverages.rainfall));
        } else {
            dataMax = data.map((d) => parseFloat(d.dailyMaxMins[dataQueried].max));
            dataMin = data.map((d) => parseFloat(d.dailyMaxMins[dataQueried].min));
        }
        dataAvg = data.map((d) => parseFloat(d.dailyAverages[dataQueried]));
    } else if (timeRangeMode === 1) {
        labels = data.flatMap((d) => d.hourlyData.map((h) => `${d.date} ${h.hourString}`));
        if (dataQueried === "temperature") {
            dataMax = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.maxTemperature)));
            dataMin = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.minTemperature)));
            dataAvg = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.avgTemperature)));
        } else if (dataQueried === "rainfall") {
            dataMax = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.maxRainfall)));
            dataAvg = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.avgRainfall)));
        } else if (dataQueried === "windSpeed") {
            dataMax = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.maxWindSpeed)));
            dataMin = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.minWindSpeed)));
            dataAvg = data.flatMap((d) => d.hourlyData.map((h) => parseFloat(h.avgWindSpeed)));
        }
    } else if (timeRangeMode === 2) {
        labels = data.flatMap((d) => [
            `${d.date} - Nighttime`,
            `${d.date} - Morning`,
            `${d.date} - Afternoon`,
            `${d.date} - Evening`,
        ]);
        if (dataQueried === "temperature") {
            dataMax = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.maxTemperature),
                parseFloat(d.rangesData.morning.maxTemperature),
                parseFloat(d.rangesData.afternoon.maxTemperature),
                parseFloat(d.rangesData.evening.maxTemperature),
            ]);
            dataMin = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.minTemperature),
                parseFloat(d.rangesData.morning.minTemperature),
                parseFloat(d.rangesData.afternoon.minTemperature),
                parseFloat(d.rangesData.evening.minTemperature),
            ]);
            dataAvg = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.avgTemperature),
                parseFloat(d.rangesData.morning.avgTemperature),
                parseFloat(d.rangesData.afternoon.avgTemperature),
                parseFloat(d.rangesData.evening.avgTemperature),
            ]);
        } else if (dataQueried === "rainfall") {
            dataMax = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.maxRainfall),
                parseFloat(d.rangesData.morning.maxRainfall),
                parseFloat(d.rangesData.afternoon.maxRainfall),
                parseFloat(d.rangesData.evening.maxRainfall),
            ]);
            dataAvg = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.sumRainfall),
                parseFloat(d.rangesData.morning.sumRainfall),
                parseFloat(d.rangesData.afternoon.sumRainfall),
                parseFloat(d.rangesData.evening.sumRainfall),
            ]);
        } else if (dataQueried === "windSpeed") {
            dataMax = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.maxWindSpeed),
                parseFloat(d.rangesData.morning.maxWindSpeed),
                parseFloat(d.rangesData.afternoon.maxWindSpeed),
                parseFloat(d.rangesData.evening.maxWindSpeed),
            ]);
            dataMin = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.minWindSpeed),
                parseFloat(d.rangesData.morning.minWindSpeed),
                parseFloat(d.rangesData.afternoon.minWindSpeed),
                parseFloat(d.rangesData.evening.minWindSpeed),
            ]);
            dataAvg = data.flatMap((d) => [
                parseFloat(d.rangesData.nighttime.avgWindSpeed),
                parseFloat(d.rangesData.morning.avgWindSpeed),
                parseFloat(d.rangesData.afternoon.avgWindSpeed),
                parseFloat(d.rangesData.evening.avgWindSpeed),
            ]);
        }
    }
    return { labels, dataMax, dataMin, dataAvg };
};


// Build vertical line annotations based on the time mode
export const generateAnnotations = (data, labels, timeRangeMode) => {
    let annotations = [];
    if (timeRangeMode === 1) {
        // Add the line to the last hour of each day
        annotations = data.map((day) => {
            const lastHourLabel = `${day.date} 23:00`;
            return {
                type: "line",
                mode: "vertical",
                scaleID: "x",
                value: lastHourLabel,
                borderColor: "rgb(248, 145, 49)",
                borderWidth: 2,
            };
        });
    } else if (timeRangeMode === 2) {
        // Add the line between the "evening" of a day and the "early" of the next
        annotations = data.map((day) => {
            const eveningLabel = `${day.date} - Evening`;
            const eveningIndex = labels.indexOf(eveningLabel);
            const positionBetweenEveningAndNighttime = eveningIndex + 0.5;
            return {
                type: "line",
                mode: "vertical",
                scaleID: "x",
                value: positionBetweenEveningAndNighttime,
                borderColor: "rgb(248, 145, 49)",
                borderWidth: 2,
            };
        });
    }
    return annotations;
};


export const buildChartConfig = ({ labels, dataMax, dataMin, dataAvg }, title, yAxisLabel, sharedYScale, annotations, citySuffix = "") => {
    const colors =
        citySuffix === "1" ?
            {
                max: { border: "rgb(30, 58, 138)", background: "rgba(30, 58, 138, 0.4)" },
                avg: { border: "rgb(96, 165, 250)", background: "rgba(96, 165, 250, 0.4)" },
                min: { border: "rgb(10, 74, 158)", background: "rgba(10, 74, 158, 0.4)" },
            }
            : citySuffix === "2" ?
                {
                    max: { border: "rgb(161, 25, 25)", background: "rgba(161, 25, 25, 0.4)" },
                    avg: { border: "rgb(255, 84, 84)", background: "rgba(255, 84, 84, 0.4)" },
                    min: { border: "rgb(153, 27, 27)", background: "rgba(153, 27, 27, 0.4)" },
                }
                :
                {
                    max: { border: "rgb(255, 99, 99)", background: "rgba(255, 99, 99, 0.4)" },
                    avg: { border: "rgb(99, 255, 141)", background: "rgba(99, 255, 141, 0.4)" },
                    min: { border: "rgb(99, 141, 255)", background: "rgba(99, 141, 255, 0.4)" },
                };

    const datasets = [
        {
            label: `${yAxisLabel} (Max)${citySuffix}`,
            data: dataMax,
            borderColor: colors.max.border,
            backgroundColor: colors.max.background,
            tension: 0.4,
            borderDash: [3, 6],
        },
        {
            label: `${yAxisLabel} (Average)${citySuffix}`,
            data: dataAvg,
            borderColor: colors.avg.border,
            backgroundColor: colors.avg.background,
            tension: 0.4,
        },
    ];

    if (dataMin && dataMin.length > 0) {
        datasets.push({
            label: `${yAxisLabel} (Min)${citySuffix}`,
            data: dataMin,
            borderColor: colors.min.border,
            backgroundColor: colors.min.background,
            tension: 0.4,
            borderDash: [8, 6, 3, 6],
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

    return { chartData, options };
};