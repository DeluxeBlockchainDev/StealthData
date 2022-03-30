import React from "react";
import {
  ClientConditionCssClasses,
  ClientConditionTitles
} from "../../ClientsUIHelpers";

export const ConditionColumnFormatter = (cellContent, row) => (
  <>
    <span
      className={`badge badge-${
        ClientConditionCssClasses[row.condition]
      } badge-dot`}
    ></span>
    &nbsp;
    <span
      className={`font-bold font-${
        ClientConditionCssClasses[row.condition]
      }`}
    >
      {ClientConditionTitles[row.condition]}
    </span>
  </>
);
