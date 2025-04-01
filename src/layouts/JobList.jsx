import JobsTable from "../components/JobsTable";
import { FaGear } from "react-icons/fa6";

const JobList = () => {
    return (
        < div className="rounded-3xl bg-white p-4 mx-10 sm:p-6 border border-gray-light" >

            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between gap-2" >
                <h1 className="headline font-semibold text-gray-dark">Job List</h1>

                <div className="flex space-x-4 items-center">
                    <button
                        onClick={() => alert("jobs")}
                        className="rounded-md text-center items-center px-3  bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                    >
                        Jobs
                    </button>
                    <button
                        onClick={() => alert("Industry")}
                        className="rounded-md text-center items-center px-3  bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                    >
                        Industry
                    </button>
                    <button
                        onClick={() => alert("Setup")}
                        className="rounded-md text-center items-center px-3  bg-white border border-teal text-teal hover:bg-teal/20 cursor-pointer"
                    >
                        Setup
                    </button>
                    <button className="rounded-md bg-white text-teal hover:text-teal/70 cursor-pointer">
                        <FaGear className="h-5 w-5" />
                    </button>
                </div>

            </div>

            {/* Search Filter Section */}
            <div className="mb-4 flex flex-wrap items-center gap-2 bg-teal-600/10 p-2 rounded-lg" >
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full sm:w-1/2 md:w-1/4 p-2 body-regular focus:outline-teal border border-gray-300 rounded-md"
                />
            </div>

            {/* Jobs Table Section */}
            <div className="rounded-lg bg-white overflow-hidden" >
                <JobsTable />
            </div>
        </div >
    );
}

export default JobList;