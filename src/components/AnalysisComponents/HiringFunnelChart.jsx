import { Bar } from "react-chartjs-2"

// Custom colors for charts - teal palette
const COLORS = ["#004040", "#006060", "#008080", "#00a0a0", "#00bfbf", "#e0f7fa", "#e6ffff"]

const HiringFunnelChart = ({ data, loading }) => {
  // Prepare data for hiring funnel chart
  const hiringFunnelLabels = 
  [
    'Unprocessed',
    'Pre-screening',
    'Test Sent',
    'Interview Schedule Sent',
    'Phone Interview',
    'First Interview',
    'Second Interview',
    'Third Interview',
    'Fourth Interview',
    'Follow-up Interview',
    'Final Interview',
    'For Decision Making',
    'For Job Offer',
    'Job Offer Rejected',
    'Job Offer Accepted',
    'For Future Pooling',
    'Withdrew Application',
    'Blacklisted',
    'Ghosted',
    'Not Fit',
  ]
  const chartData = {
    labels: hiringFunnelLabels,
    datasets: [
      {
        label: "Applicants",
        data: data
          ? [
            data.unprocessed, 
            data.pre_screening, 
            data.test_sent, 
            data.interview_schedule_sent, 
            data.phone_interview,
            data.first_interview,
            data.second_interview,
            data.third_interview,
            data.fourth_interview,
            data.follow_up_interview,
            data.final_interview,
            data.for_decision_making,
            data.for_job_offer,
            data.job_offer_rejected,
            data.job_offer_accepted,
            data.for_future_pooling,
            data.withdrew_application,
            data.blacklisted,
            data.ghosted,
            data.not_fit,
          ]
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
                  size: 12,
                },
              },
            },
            y: {
              ticks: {
                font: {
                  size: 13,
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