import React from "react";
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataonMap } from "./util";
// so destructuring center and zoom so instead of props.zoom or props.center we directly use zoom and center
function Map({ countries, casesType, center, zoom }) {
  /*  copy this simply

     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    */
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through all the countries and draw  circles on the screen , also circles are bigger if there is more case and smaller is less cases */}
        {showDataonMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
