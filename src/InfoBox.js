// ye ek infobox me kya rahega wo hai
import React from "react";
import "./InfoBox.css";

import { Card, CardContent, Typography } from "@material-ui/core";

// {title, cases ,total} destructuring the props
// here ...props means spread any other props that come through ( so here we have onClick which we pssed in infobox in app.js)
function InfoBox({ title, cases, isRed, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`} // ie. if this is selected {active && "infoBox--selected"} also active is from props
    >
      <CardContent>
        {/* Title i.e coronavirus case */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* +120k Number of cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        {/* 1.2M total */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
