import React, { useEffect, useState } from "react";
import getFilteredApplicants from "../services/filterApplicantsService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { FiDownload } from "react-icons/fi";
import exportToExcel from "../utils/exportToExcel";

const ExportToPdf = ({
  dateFilter,
  dateFilterValue,
  position,
  status,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isExcelExporting, setIsExcelExporting] = useState(false);

  useEffect(() => {
    const generatePdf = async () => {
      setIsExporting(true);
      try {
        const applicants = await getFilteredApplicants(
          dateFilter,
          dateFilterValue,
          position,
          status
        );

        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a2",
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Applicant Information Report", 20, 20);

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(
          "This report provides a summary of applicants filtered by the selected criteria.",
          20,
          30
        );

        // Table headers
        const headers = [
          "First Name",
          "Middle Name",
          "Last Name",
          "Gender",
          "Discovered At",
          "CV Link",
          "Date Applied",
          "Mobile 1",
          "Mobile 2",
          "Email 1",
          "Email 2",
          "Email 3",
          "Stage",
          "Status",
          "Title",
        ];

        // Table rows
        const data = applicants.map((row) => [
          row.first_name || "",
          row.middle_name || "N/A",
          row.last_name || "",
          row.gender || "N/A",
          row.applied_source || "N/A",
          row.cv_link || "N/A",
          row.date_created ? moment(row.date_created).format("YYYY-MM-DD") : "N/A",
          row.mobile_number_1 || "",
          row.mobile_number_2 || "N/A",
          row.email_1 || "",
          row.email_2 || "N/A",
          row.email_3 || "N/A",
          row.stage || "N/A",
          row.status || "N/A",
          row.title || "N/A",
        ]);

        autoTable(doc, {
          startY: 40,
          head: [headers],
          body: data,
          styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 1,
            overflow: "linebreak",
            valign: "middle",
          },
          headStyles: {
            fillColor: [13, 148, 136], // teal
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { left: 10, right: 10 },
          tableWidth: "auto",
        });

        const fileName = `applicant_list_${moment().format("YYYYMMDD")}.pdf`;
        setPdfFileName(fileName);
        setPdfDoc(doc);

        // Preview
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);
      } catch (error) {
        alert("Failed to generate PDF: " + error.message);
      } finally {
        setIsExporting(false);
      }
    };

    generatePdf();

    // Cleanup
    return () => {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    };
    // eslint-disable-next-line
  }, [dateFilter, dateFilterValue, position, status]);

  const handleDownload = () => {
    if (pdfDoc) {
      pdfDoc.save(pdfFileName);
    }
  };

  const handleExcelExport = async () => {
    setIsExcelExporting(true);
    try {
      let value = "";
      if (dateFilter === "year" && dateFilterValue) {
        value = dateFilterValue;
      } else if (dateFilter === "month" && dateFilterValue) {
        value = dateFilterValue;
      }
      const excelBlob = await exportToExcel(
        dateFilter,
        value,
        position,
        status,
        true // return blob
      );
      if (!excelBlob) throw new Error("Failed to generate Excel file");
      const url = URL.createObjectURL(excelBlob);
      const fileName = `applicant_list_${moment().format("YYYYMMDD")}.xlsx`;
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      alert("Failed to generate Excel file: " + error.message);
    } finally {
      setIsExcelExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ overflow: "hidden" }}
    >
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-5/6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light">
          <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {/* Preview */}
        <div className="flex-1 overflow-hidden p-4">
          {pdfPreviewUrl ? (
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-full border border-gray-light rounded"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">
                {isExporting ? "Generating PDF..." : "Loading preview..."}
              </p>
            </div>
          )}
        </div>
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-light flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleExcelExport}
            className="px-4 py-2 mr-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            disabled={isExcelExporting}
          >
            <FiDownload className="mr-2" />
            {isExcelExporting ? "Exporting..." : "Download Excel"}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-teal text-white rounded hover:bg-teal-dark flex items-center"
            disabled={isExporting}
          >
            <FiDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportToPdf;