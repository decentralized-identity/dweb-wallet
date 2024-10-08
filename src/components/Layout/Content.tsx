const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-full">
      {children}
    </div>
  )
}

export default Content;