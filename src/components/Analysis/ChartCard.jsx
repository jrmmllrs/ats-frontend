import { FiMaximize2, FiMinimize2 } from "react-icons/fi"

const ChartCard = ({ id, title, subtitle, icon, children, expandedCard, setExpandedCard }) => {
  const isExpanded = expandedCard === id
  const isAnyCardExpanded = expandedCard !== null
  const shouldHide = isAnyCardExpanded && !isExpanded

  const toggleCardExpand = (id) => {
    const newExpandedState = expandedCard === id ? null : id
    setExpandedCard(newExpandedState)
    document.body.style.overflow = newExpandedState ? "hidden" : "auto"
  }

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300
        ${isExpanded ? "fixed top-[10%] left-[10%] right-[10%] bottom-[10%] max-w-5xl mx-auto z-50" : "h-auto"}
        ${shouldHide ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      style={{
        boxShadow: isExpanded ? "0 10px 25px rgba(0, 0, 0, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.03)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        transform: shouldHide ? "scale(0.95)" : "scale(1)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <span className="text-primary">{icon}</span>
            <h3 className="text-base sm:text-lg">{title}</h3>
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={() => toggleCardExpand(id)}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? (
            <FiMinimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <FiMaximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>
      <div className={`p-4 sm:p-6 ${isExpanded ? "h-[calc(100%-70px)] overflow-y-auto" : ""}`}>{children}</div>
    </div>
  )
}

export default ChartCard