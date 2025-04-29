import { FiMaximize2, FiMinimize2 } from "react-icons/fi"

const Card = ({ id, title, icon, children, className = "", expandedCard, setExpandedCard }) => {
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
        rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 ${className}
        ${isExpanded
          ? "fixed top-[10%] left-[10%] right-[10%] bottom-[10%] max-w-5xl mx-auto z-50"
          : "h-auto min-h-[12rem] xs:min-h-[13rem] sm:min-h-[15rem]"
        }
        ${shouldHide ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      style={{
        boxShadow: isExpanded ? "0 10px 25px rgba(0, 0, 0, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.03)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        transform: shouldHide ? "scale(0.95)" : "scale(1)",
      }}
    >
      <div className="flex items-center justify-between p-2 xs:p-3 sm:p-4 border-b border-opacity-10 border-gray-200">
        <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base font-medium text-gray-700">
          <span className="text-primary">{icon}</span>
          {title}
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
      <div
        className={`p-2 xs:p-3 sm:p-4 ${isExpanded
          ? "h-[calc(100%-60px)] overflow-y-auto"
          : "h-[calc(100%-40px)] xs:h-[calc(100%-44px)] sm:h-[calc(100%-56px)] custom-scrollbar"
          }`}
        style={{ overflowY: "auto" }}
      >
        {children}
      </div>
    </div>
  )
}

export default Card