import applicantFilterStore from "../context/applicantFilterStore";
import positionStore from "../context/positionStore";
import { searchApplicant } from "./applicantDataUtils";
import { filterApplicants } from "./applicantDataUtils";

export const clearFilter = (setSelectedDate, setApplicantData, setDateFilterType, setDateFilter, setSearch, status, position) => {
    setSelectedDate(null);
    setDateFilterType("month");
    setSearch("");
    setDateFilter("");
    // searchApplicant("", setApplicantData, stages, setStages, setPositionFilter, setSelectedDate);
    filterApplicants(position, setApplicantData, status, "", "");
  };  