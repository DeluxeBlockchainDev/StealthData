import React from "react";
import {
  ClientStatusCssClasses,
  ClientStatusTitles
} from "../../ClientsUIHelpers";

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      ClientStatusCssClasses[row.status]
    } label-inline`}
  >
    {ClientStatusTitles[row.status]}
  </span>
);
