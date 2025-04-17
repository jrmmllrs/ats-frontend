import getFilteredApplicants from "../services/getFilteredApplicants";
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

const createExcel = (data, fileName, returnBlob = false) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    if (returnBlob) {
        return dataBlob;
    } else {
        saveAs(dataBlob, `${fileName}.xlsx`);
        return null;
    }
};

const exportToExcel = async (dateFilter, dateFilterValue, position, status, returnBlob = false) => {
    try {
        console.log(position);
        console.log(status);

        const applicants = await getFilteredApplicants(dateFilter, dateFilterValue, position, status);
        console.log("applicants: ", applicants);
        console.log("type:", typeof (applicants));

        if (!applicants || applicants.length === 0) {
            alert('No data to export');
            return null;
        }

        if (returnBlob) {
            return createExcel(applicants, "exported-applicants", true);
        } else {
            createExcel(applicants, "exported-applicants");
            return true;
        }
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Failed to export data to Excel');
        return null;
    }
};

export default exportToExcel;