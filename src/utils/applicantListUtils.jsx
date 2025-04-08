import applicantFilterStore from "../context/applicantFilterStore";
import positionStore from "../context/positionStore";
import { searchApplicant } from "./applicantDataUtils";

export const clearFilter = (setSelectedDate, setApplicantData, setDateFilterType, setDateFilter, setSearch, status, dateFilterType, positionFilter) => {
    setSelectedDate(null);
    setDateFilterType("month");
    setSearch("");
    setDateFilter("");
    searchApplicant("", setApplicantData, positionFilter, status, dateFilterType, "Invalid date");
  };  