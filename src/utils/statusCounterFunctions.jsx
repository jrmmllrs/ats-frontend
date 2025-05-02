import api from "../services/api";
import moment from "moment";
import { initialStages } from "./StagesData";
import { filterApplicants } from "../services/applicantService";

//Fetching all
export const fetchCounts = async (setStages, initialStages) => {
  const counts = await api.get(`/counter`);
  setStages(initialStages.map((stage) => ({
    ...stage,
    count: counts.data[stage.name],
    statuses: stage.statuses.map((status) => ({
      ...status,
      count: counts.data[status.name] || status.count,
    }))
  })))
};

//For filtering status counter
export const filterCounter = async (position, setStages, initialStages, setPositionFilter, selectedStatuses) => {
  setPositionFilter(position);
  setStages(initialStages);
  let counts = [{}]

  if (position != "All") {
    counts = await api.get(`/counter/?position=${position}`);
  }
  else {
    counts = await api.get(`/counter`);
  }

  setStages(initialStages.map((stage) => ({
    ...stage,
    count: counts.data[stage.name],
    statuses: stage.statuses.map((status) => ({
      ...status,
      count: counts.data[status.name] || status.count,
      selected: selectedStatuses.includes(status.value)
    }))
  })));
}

export const clearSelections = (stages, setStages, setSelectedStatuses, clearStatus, setStatus, setPositionFilter, setApplicantData, date, dateType, status) => {
  setStages(
    stages.map((stage) => ({
      ...stage,
      selected: false,
      statuses: stage.statuses.map((status) => ({
        ...status,
        selected: false,
      })),
    })),
  );
  setSelectedStatuses([]);
  clearStatus([]);
  setStatus([]);
  setPositionFilter("All");

  fetchCounts(setStages, initialStages);

  dateType === "month" ? date = moment(date).format("MMMM") : date = moment(date).format("YYYY");

  filterApplicants("All", setApplicantData, [], date, dateType);
};