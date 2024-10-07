const SidebarHeader: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ icon, children, onClick, open = true }) => {
  return (
    <div className="flex items-center justify-center mt-8" onClick={onClick}>
      <div className="flex items-center">
        {icon && <span className="w-12 h-12">{icon}</span>}
        {open && children}
      </div>
    </div>
  )
}

export default SidebarHeader;