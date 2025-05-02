import { filterApplicants } from "../services/applicantService";

export const clearFilter = (setSelectedDate, setApplicantData, setDateFilterType, setDateFilter, setSearch, status, position) => {
  setSelectedDate(null);
  setDateFilterType("month");
  setSearch("");
  setDateFilter("");
  // searchApplicant("", setApplicantData, stages, setStages, setPositionFilter, setSelectedDate);
  filterApplicants(position, setApplicantData, status, "", "");
};  