import { XCircleIcon } from "@heroicons/react/16/solid";

const Chip: React.FC<{
  icon?: React.ReactNode;
  onDelete?: () => void;
  label: string;
  size: 'small' | 'medium' | 'large'
}> = ({ icon, label, size, onDelete }) => {

  const sizeClasses = {
    small: 'text-xs px-2 py-1 m-1',
    medium: 'text-sm px-3 py-1.5 m-2',
    large: 'text-base px-4 py-2 m-3',
  };

  const iconClasses ={
    small: 'mr-1',
    medium: 'mr-2',
    large: 'mr-3',
  }

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  }

  const itemHeight = {
    small: 'h-4',
    medium: 'h-5',
    large: 'h-6',
  }

  const itemPadding = {
    small: icon ? 'pr-1' : 'px-1',
    medium: icon ? 'pr-2' : 'px-2',
    large: icon ? 'pr-3' : 'px-3',
  }

  return (
    <div className={`flex justify-center items-center rounded-full bg-gray-600 text-white font-medium ${sizeClasses[size]} hover:bg-gray-400 transition-colors duration-200`}>
      {icon && <span className={`${iconSizes[size]} ${iconClasses[size]}`}>{icon}</span>}
      <span className={`flex ${itemPadding[size]} flex-initial max-w-full ${itemHeight[size]} leading-none items-center`}>{label}</span>
      {onDelete && <span className={`cursor-pointer ${iconSizes[size]}`} onClick={onDelete}>
        <XCircleIcon />
      </span>}
    </div>
  );
};

export default Chip;