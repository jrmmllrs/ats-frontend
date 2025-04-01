import JobList from "../layouts/JobList";


const Jobs = () => {
    return (
        <div className="flex-col items-center justify-center">
            <section className="m-10 grid grid-cols-4 grid-rows-[7rem] gap-10">
                <div
                    onClick={() => alert("applicants")}
                    className="rounded-md grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center ">147</span>
                    <div className="text-sm text-gray-500 text-center">Applications</div>
                </div>
                <div
                    onClick={() => alert("industry")}
                    className="rounded-md grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center">4</span>
                    <div className="text-sm text-gray-500 text-center">Industries</div>
                </div>
                <div
                    onClick={() => alert("open")}
                    className="rounded-md grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center">5</span>
                    <div className="text-sm text-gray-500 text-center">Open Jobs</div>
                </div>
                <div
                    onClick={() => alert("close")}
                    className="rounded-md grid place-content-center cursor-pointer bg-white border border-gray-light"
                >
                    <span className="text-3xl text-center">7</span>
                    <div className="text-sm text-gray-500 text-center">Closed Jobs</div>
                </div>
            </section>
            <JobList />
        </div>
    );
};


export default Jobs;
