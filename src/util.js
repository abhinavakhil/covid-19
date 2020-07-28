import React from "react";
import numeral from "numeral"; // for formatting number
import { Circle, Popup } from "react-leaflet";

//create this dictionary(obj) for case , recovered and for death all with differernt color
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

//for sorting right table data
export const sortData = (data) => {
  const sortedData = [...data]; // copying data to sorteddata array

  // sort is an es6 fn
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      /// sort data based upon the cases
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

// DRAW circles on the map with interactive tooltip
export const showDataonMap = (data, casesType = "cases") =>
  data.map((country) => (
    // draw a circle
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]} // country.countryInfo.lat since data is now country
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier // based upon cases
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.cases).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

// for giving  k ex + 125K in cases and total -this type of formatting
export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : ` `;
