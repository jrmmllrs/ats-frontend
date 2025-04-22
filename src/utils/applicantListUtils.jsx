import applicantFilterStore from "../context/applicantFilterStore";
import positionStore from "../context/positionStore";
import { searchApplicant } from "./applicantDataUtils";

export const clearFilter = (setSelectedDate, setApplicantData, setDateFilterType, setDateFilter, setSearch, stages, setStages, setPositionFilter) => {
    setSelectedDate(null);
    setDateFilterType("month");
    setSearch("");
    setDateFilter("");
    searchApplicant("", setApplicantData, stages, setStages, setPositionFilter);
  };  