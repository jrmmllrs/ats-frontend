import { Bar } from "react-chartjs-2"

// Custom colors for charts - teal palette
const COLORS = ["#004040", "#006060", "#008080", "#00a0a0", "#00bfbf", "#e0f7fa", "#e6ffff"]

const HiringFunnelChart = ({ data, loading }) => {
  // Prepare data for hiring funnel chart
  const hiringFunnelLabels = ["Applications", "Pre-Screening", "Interviews", "Job Offers", "Hired"]
  const chartData = {
    labels: hiringFunnelLabels,
    datasets: [
      {
        label: "Applicants",
        data: data
          ? [data.total_applications, data.pre_screening, data.interview_stage, data.job_offer_stage, data.hired]
          : [],
        backgroundColor: COLORS.map((color) => `${color}`),
      },
    ],
  }

  return (
    <div className="h-full">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} Applicants`,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
            y: {
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          },
        }}
      />
    </div>
  )
}

export default HiringFunnelChart