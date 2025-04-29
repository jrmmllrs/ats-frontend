import { FiCalendar, FiRefreshCw } from "react-icons/fi";

const FilterControls = ({ year, setYear, month, setMonth, selectedPosition, setSelectedPosition, positionsFilter, fetchDashboardData }) => {
    const monthOptions = [
        { value: "", label: "All Months" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const yearValue = (new Date().getFullYear() - i).toString();
        return { value: yearValue, label: yearValue };
    });

    // consosle.log('pos',selectedPosition);
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
                <FiCalendar className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Year Select */}
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {yearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Month Select */}
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {monthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)} // Set the position ID
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!positionsFilter || positionsFilter.length === 0}
                >
                    <option value="">All Positions</option>
                    {positionsFilter && positionsFilter.length > 0 ? (
                        positionsFilter.map((position) => (
                            <option key={position._id} value={position.job_id}>
                                {position.title}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            Loading positions...
                        </option>
                    )}
                </select>

                

                {/* Reset Button */}
                <button
                    onClick={() => {
                        setYear(new Date().getFullYear().toString());
                        setMonth("");
                        setSelectedPosition("");
                        fetchDashboardData();
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1 transition-colors"
                >
                    <FiRefreshCw className="h-3.5 w-3.5" />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default FilterControls;