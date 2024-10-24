import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@headlessui/react';

interface PinInputProps {
  initialPin: string[];
  onPinChange: (updatedPin: string[]) => void;
}

const PinInput: React.FC<PinInputProps> = ({ initialPin, onPinChange }) => {
  const [pin, setPin] = useState(initialPin);

  const refs = [ 
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ] 

  useEffect(() => {
    if (refs[0]) refs[0].current?.focus()
  }, []);

  const onDigitInputKeyDown = (digitIndex: number) => (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !pin[digitIndex] && digitIndex > 0 && refs[digitIndex - 1] !== null) {
      refs[digitIndex - 1].current?.focus();
    }
  };

  const onDigitInputChange = (digitIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[digitIndex] = value;
    setPin(newPin);

    // Move focus to the next input
    if (value && digitIndex < initialPin.length - 1) {
      const nextRef = refs[digitIndex + 1];
      nextRef?.current?.focus();
    }

    onPinChange(newPin);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').slice(0, 4).split('');
    
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newPin = [...pastedData, ...Array(4).fill('')].slice(0, 4);
      setPin(newPin);
      refs[Math.min(pastedData.length, 3)].current?.focus();
    }
  };

  return (
    <div className='flex gap-2 justify-center w-full'>
        {pin.map((digit, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            ref={refs[index]}
            maxLength={1}
            value={digit}
            onChange={onDigitInputChange(index)}
            onKeyDown={onDigitInputKeyDown(index)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-2xl border rounded-lg transition-colors duration-150
                     data-[focus=true]:border-blue-500 data-[focus=true]:ring-2 data-[focus=true]:ring-blue-500 
                     data-[hover=true]:border-gray-400
                     data-[disabled=true]:bg-gray-100 data-[disabled=true]:text-gray-400"
          />
        ))}
    </div>
  );
};

export default PinInput;
