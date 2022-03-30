export const VisitorStatusCssClasses = ["danger", "success", "info", ""];
export const VisitorStatusTitles = ["Suspended", "Active", "Pending", ""];
export const VisitorTypeCssClasses = ["success", "primary", ""];
export const VisitorTypeTitles = ["Business", "Individual", ""];
export const VisitorConditionTitles = ["New", "Used"];
export const VisitorConditionCssClasses = ["success", "danger", ""];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "50", value: 50 },
];
const initDate = null;
// const startDate = new Date();
// const initDate = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
export const initialFilter = {
  filters: {
    startDate: initDate,
    endDate: initDate,
    searchText: "",
    leadPriority: "",
    crmMatchDate: "",
    pageUrl: "",
  },
  sortOrder: "-1", // asc||desc
  sortField: "lastVisitedAt",
  limit: 10,
  page: 1
};
