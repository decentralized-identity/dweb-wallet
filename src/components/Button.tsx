import { Button as HeadlessButton } from '@headlessui/react'

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'warning' | 'error'
  onClick?: () => void;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {

  const color = ((color: 'primary' | 'secondary' | 'warning' | 'error' | undefined, disabled = false) => {
    switch(color) {
      case 'secondary':
        return disabled ? 'bg-slate-300'
        : 'bg-slate-700 hover:bg-slate-900 active:bg-slate-800';
      case 'warning':
        return disabled ? 'bg-yellow-300' : 'bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-800';
      case 'error':
        return disabled ? 'bg-red-300' : 'bg-red-500 hover:bg-red-700 active:bg-red-800';
      default:
        return disabled ? 'bg-gray-300' : 'bg-gray-900 hover:bg-gray-700 active:bg-gray-800';
    }
  })(props.color, props.disabled);

  const className = `inline-flex px-3 py-1 items-center rounded-md ${color} text-sm/6 font-semibold text-white shadow-inner shadow-white/10`;

  if (!props.className) {
    props.className = className;
  }

  return <HeadlessButton {...props}>
    {children}
    </HeadlessButton>
}

export default Button;