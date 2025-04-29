const Overlay = ({ expandedCard, setExpandedCard }) => {
    if (!expandedCard) return null
  
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center min-h-screen"
        onClick={() => {
          setExpandedCard(null)
          document.body.style.overflow = "auto"
        }}
      />
    )
  }
  
  export default Overlay