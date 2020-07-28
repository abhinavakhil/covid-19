import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import numeral from "numeral";

//  we can copy these options from chart.js
/// options has done all the effect like 50k , 100k (you to docs and see from there)
const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    // this will allow us to see values on hover and also for that just install a package called numeral(it will helps us format a number in a certain way) - npm i numeral
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  // for all the data of last 20 days since pandemic
  // https://disease.sh/v3/covid-19/historical/all?lastdays=120

  // In chartjs Line graph should be in format x : value and y: value so we are modyfying that data
  // we can also put this in util
  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    // data[casesType].cases.forEach((date) => {
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    // always write write async code like this in useefect- i.e inside function
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          console.log("Line Graph", data);
          const chartData = buildChartData(data, "cases");
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {/*  line in chartjs uses data and options */}
      {/* data takes an obj */}
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,0.2)",
                borderColor: "#CC1034",
                //------ 2nd is data from state
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
