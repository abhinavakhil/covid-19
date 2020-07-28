import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
// import this as it is
import "leaflet/dist/leaflet.css";

import "./App.css";

function App() {
  // Here we are using react hooks
  //////// useState([]) is an empty array initially
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // this   lat: 34.80746, lng: -40.4796 is the center of pacific ocean
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  // zoom
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases"); // cases by default

  // we need to define this bcz we want all(worldwide data) to show up on load of our component
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  // STATE = How to write a variable in React

  // for fetching countries using api
  useEffect(() => {
    //the code inside will run once when this component(ex app.js) loads and not again (useEffect runs only once when that component loads)
    // Async -> send a request, wait for it, do someting with it
    const getCountriesData = async () => {
      // we can also use axios but for here use can use build in fetch
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          //here response.json which is in response is in data
          const countries = data.map((country) => ({
            name: country.country, // United States , India
            value: country.countryInfo.iso2, // USA , IND
          }));

          const sortedData = sortData(data);

          setTableData(sortedData);

          // for creating circles in map - pass map data based upon the countries
          setMapCountries(data);

          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  //but in this way - useEffect(() => {  },[countries]) // now it will run once component gets loaded and whenever the countries state will get updated i.e wheneevr countries change it will changee;

  const onCountryChange = async (event) => {
    // 1) get the country code on whenever that dropdown change or /// get the value of the velue you selected
    const countryCode = event.target.value; // ass value for dropdown is countrycode when fetching api
    console.log(countryCode);

    // 2)chnage countries in list (show thw clicked one)
    setCountry(countryCode);

    // 3) Now on clicking / selecting a particular country name we wnat to show (pass that ) data to infobox , map ,tables so fetch that first
    // https://disease.sh/v3/covid-19/all - for worldwide
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE] - for particular country based upon country code
    // so use if else to check if country set is worldwide fetch that data else based on country code
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json()) // turning response to json
      .then((data) => {
        //update country code
        setCountry(countryCode);
        // store full of country
        setCountryInfo(data); // and we will use this to display data

        // for map : so click of a particular country show the center of that country on map
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        //console.log("data.countryInfo", data.countryInfo);
        setMapZoom(4);
      });
  };

  // /console.log(countryInfo); to just check

  return (
    <div className="app">
      <div className="app__left">
        {/* container */}
        {/*  these are component -> ex header ,title infobox so we will create a component and reuse it ex for will use infobox 3 time */}
        {/* Header */}
        <div class="app__header">
          {/* Title + select input dropdown field */}
          <h1>COVID-19 TRACKER</h1>
          {/* FormControl is material ui elt . app__dropdown is bom syntax */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">opt2</MenuItem>
            <MenuItem value="worldwide">opt3</MenuItem>
            <MenuItem value="worldwide">opt4</MenuItem> */}
              {/* instead of this we want loop through all
             the countries and show a drop down list of the options */}
              {/* {countries.map((country) => (
              // for each country
              <MenuItem value={country}>{country}</MenuItem>
            ))} */}
              {/* but still doing like this will take lots of time so we gonna use api - https://disease.sh/v3/covid-19/countries */}
              {/* we will use useEggect for that - runs a piece of code based on a given condition */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                // for each country
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed // boolean also for showing for active deaths
            active={casesType === "cases"} // for showing the active infobox on click
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
          {/* infoBoxes title="Coronavirus cases"*/}
          {/* infoBoxes title="Coronavirus recoveries" */}
          {/* infoBoxes */}
        </div>

        {/*  Map */}
        <Map
          casesType={casesType} // so on clicking infobox with diff cases show diff colored circled in map as we already has casesType
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table of country  */}
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          {/* Graph */}
          {/* also changing graph based upon cases Type */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
