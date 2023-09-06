import "./App.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Card from "./SummaryCard";
import { PieChart, Pie, Cell, LabelList, Tooltip } from 'recharts';
// Imports end

function App() {
// App component starts 
const baseUrl = "https://api.opencovid.ca";

const [activeLocation, setActiveLocation] = useState("AB");
const [lastUpdated, setlastUpdated] = useState("");
const [summaryData, setSummaryData] = useState({});

const pieData =[

  {name: "dose_1" , value: parseInt(summaryData["vaccine_administration_dose_1"], 10)},
  {name: "dose_2", value: parseInt(summaryData["vaccine_administration_dose_2"],10)},
  {name: "dose_3", value: parseInt(summaryData["vaccine_administration_dose_3"],10)},
  {name: "dose_4", value: parseInt(summaryData["vaccine_administration_dose_4"],10)}

]
const totalValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

const segmentColors = ['#0074D9', '#FF4136', '#2ECC40', '#FF851B'];

const calculatePercentage = (value, total) => {
  if (total === 0) {
    return '0%';
  }
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(2)}%`;
};

const totalValuePie = pieData.reduce((sum, entry) => sum + entry.value, 0);

const locationList = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const getVersion = async () => {
    const res = await fetch(`${baseUrl}/version`);
    const data = await res.json();
    setlastUpdated(data.timeseries);
};

const getSummaryData = async (location) => {
  if (activeLocation === "canada") {
      return;
  }
  let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
  let resData = await res.json();
  let summaryData = resData.data[0];
  let formattedData = {};

  Object.keys(summaryData).map(
    (key) => (formattedData[key] = summaryData[key].toLocaleString())
  );
  console.log(formattedData)
  setSummaryData(formattedData);
};

useEffect(() => {
  getSummaryData();
  getVersion();
}, [activeLocation]);

  return (
    <div className="App">
      <h1>COVID 19 Dashboard </h1>
      <div className="dashboard-container">
        <div className="dashboard-menu ">
            <Select
              options={locationList}
              onChange={(selectedOption) =>
                setActiveLocation(selectedOption.value)
              }
              defaultValue={locationList.filter(
                (options) => options.value === activeLocation
              )}
              className="dashboard-select"
            />
            <p className="update-date">
              Last Updated : {lastUpdated}
            </p>
          </div>
          <div className="dashboard-summary">
            <Card title="Total Cases" value={summaryData.cases} />

            <Card
              title="Total Tests"
              value={summaryData.tests_completed}
            />

            <Card title="Total Deaths" value={summaryData.deaths  } />

            <Card
              title="Total Vaccinated"
              value={summaryData.vaccine_administration_total_doses}
            />
          
   
        </div>

        <div className="dashboard-summary">
          <div class="summary-card">
            <h2>Vaccine Administration</h2>
              <PieChart width={400} height={350}>
                <Pie data={pieData} dataKey="value" outerRadius={100} fill="#FF4136" label >
                    {pieData.map((entry, index) => (
                    <Cell key={index} fill={segmentColors[index]}/>
                  ))}
                  <LabelList
                    dataKey={entry => calculatePercentage(entry, totalValuePie)}
                    position="inside"
                    fill="#000" // Color of the label text
                  />
                </Pie>
 
              </PieChart>

          </div>

          <div class="summary-card">
            <h2>Vaccine Administration</h2>
              <PieChart width={400} height={350}>
                <Pie data={pieData} dataKey="value" outerRadius={100} fill="#FF4136" label >
                    {pieData.map((entry, index) => (
                    <Cell key={index} fill={segmentColors[index]}/>
                  ))}
                  <LabelList
                    dataKey="name"
                    position="inside"
                    fill="#000" // Color of the label text
                    formatter={value => `${value}`}
                  />
                </Pie>
                <Tooltip formatter={value => `${value}`} />
              </PieChart>

          </div>
          
        </div>
      </div>
      
      
    </div>
    
  );
}

export default App;