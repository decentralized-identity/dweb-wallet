import { Button as HeadlessButton } from '@headlessui/react'

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'warning' | 'error'
  onClick?: () => void;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ color: propsColor, children, ...props }) => {

  const color = ((color: 'primary' | 'secondary' | 'warning' | 'error' | undefined, disabled = false) => {
    switch(color) {
      case 'secondary':
        return disabled ? 'bg-background-400' : 'text-primary bg-background-500 hover:bg-background-300 active:bg-background-400';
      case 'warning':
        return disabled ? 'bg-yellow-300' : 'bg-yellow-900 hover:bg-yellow-700 active:bg-yellow-800';
      case 'error':
        return disabled ? 'bg-red-300' : 'bg-red-500 hover:bg-red-700 active:bg-red-800';
      default:
        return disabled ? 'bg-background-400' : 'bg-primary hover:bg-primary-500 active:bg-primary-600';
    }
  })(propsColor, props.disabled);

  if (!props.className) {
    props.className = `text-background font-semibold inline-flex px-3 py-1 items-center rounded ${color} text-sm/6 shadow-inner shadow-white/10`;
  }

  return <HeadlessButton {...props}>
    {children}
    </HeadlessButton>
}

export default Button;