import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFileExport } from "react-icons/fa";
import AddApplicantDropdown from "../components/AddApplicantDropdown";
import ApplicantTable from "../components/ApplicantTable";
import ExportToPdf from "../utils/ExportToPdf";
import moment from "moment";
import applicantDataStore from "../context/applicantDataStore";
import { filterApplicants, searchApplicant } from "../utils/applicantDataUtils";
import positionStore from "../context/positionStore";
import applicantFilterStore from "../context/applicantFilterStore";
import { clearFilter } from "../utils/applicantListUtils";
import { useStages } from "../hooks/useStages";
import { fetchCounts } from "../utils/statusCounterFunctions";
import { initialStages } from "../utils/StagesData";
import useUserStore from "../context/userStore"; // Import the Zustand store

export default function ApplicantList({ onSelectApplicant, onAddApplicantClick }) {
  const { search, setSearch, status, setStatus, clearStatus, dateFilter, setDateFilter, dateFilterType, setDateFilterType, selectedDate, setSelectedDate } = applicantFilterStore();
  const [exportValue, setExportValue] = useState("");
  const { setApplicantData } = applicantDataStore();
  const { positionFilter, setPositionFilter } = positionStore();
  const { stages, setStages } = useStages();

  const [showPdfModal, setShowPdfModal] = useState(false);

  const { hasFeature } = useUserStore(); // Access the hasFeature function
  const canExportApplicant = hasFeature("Export Applicant"); // Check if the user has the "Export Applicant" feature
  const canAddApplicant = hasFeature("Add Applicant"); // Check if the user has the "Add Applicant" feature

  useEffect(() => {
    if (showPdfModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPdfModal]);

  const handlePdfExport = () => {
    let value = "";
    if (dateFilterType === "year" && selectedDate) {
      value = selectedDate.getFullYear().toString();
    } else if (dateFilterType === "month" && selectedDate) {
      value = moment(selectedDate).format("MMMM").toLowerCase();
    }
    setExportValue(value);
    setShowPdfModal(true);
  };

  return (
    <div className="relative mx-auto max-w-[1200px] rounded-3xl bg-white p-6 border border-gray-light">
      <div className="mb-4 flex items-center justify-between rounded-lg">
        <h1 className="headline text-gray-dark font-semibold md:mb-0">Applicant List</h1>
        <div className="center flex gap-2">
          {canExportApplicant && (
            <div className="relative inline-block text-left">
              <button
                className="flex items-center rounded-md bg-white border border-teal px-2 py-1 text-sm text-teal hover:bg-gray-light cursor-pointer"
                onClick={handlePdfExport}
              >
                <FaFileExport className="mr-2 h-4 w-4" /> Export
              </button>
            </div>
          )}
          {canAddApplicant && (
            <AddApplicantDropdown className="" onAddManually={onAddApplicantClick} />
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col items-center gap-2 rounded-lg bg-teal-600/10 p-2 md:flex-row">
        <div className="flex-initial w-full bg-white md:mb-0 md:w-1/3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              clearStatus([]);
              setSearch(e.target.value);
              searchApplicant(e.target.value, setApplicantData, stages, setStages, setPositionFilter, setSelectedDate);
              fetchCounts(setStages, initialStages);
            }}
            className="w-full body-regular rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto md:flex-row justify-end">
          <select
            value={dateFilterType}
            onChange={(e) => {
              setDateFilterType(e.target.value);
            }}
            className="flex body-regular rounded-md border border-gray-300 p-2 w-auto"
          >
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setDateFilter(date);
              setSearch("");
              const formattedDate =
                dateFilterType === "month"
                  ? moment(date).format("MMMM")
                  : moment(date).format("YYYY");
              filterApplicants(positionFilter, setApplicantData, status, formattedDate, dateFilterType);
            }}
            showMonthYearPicker={dateFilterType === "month"}
            showYearPicker={dateFilterType === "year"}
            dateFormat={dateFilterType === "month" ? "MM/yyyy" : "yyyy"}
            className="flex-auto body-regular rounded-md border border-gray-300 p-2 w-20"
            placeholderText={`${dateFilterType === "month" ? "MM/yyyy" : "yyyy"}`}
          />
          <button
            className="flex w-auto body-regular rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            onClick={() =>
              clearFilter(setSelectedDate, setApplicantData, setDateFilterType, setDateFilter, setSearch, status, positionFilter)
            }
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white" style={{ height: "", overflowY: "auto" }}>
        <ApplicantTable onSelectApplicant={onSelectApplicant} />
      </div>

      {showPdfModal && (
        <ExportToPdf
          dateFilter={dateFilterType}
          dateFilterValue={exportValue}
          position={positionFilter}
          status={status}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}