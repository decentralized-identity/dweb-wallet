import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useState } from 'react';

interface PinInputProps {
  pinLength: number;
  onPinChange: (pin: string[]) => void;
}

const PinInput: React.FC<PinInputProps> = ({ pinLength, onPinChange }) => {
  const [pin, setPin] = useState(Array(pinLength).fill(''));

  const handlePinInput = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = [...pin];
    newPin[index] = event.target.value;
    setPin(newPin);

    // Move focus to the next input
    if (event.target.value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    onPinChange(newPin);
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {pin.map((digit, index) => (
        <Grid key={index}>
          <TextField
            id={`pin-${index}`}
            variant="outlined"
            value={digit}
            onChange={handlePinInput(index)}
            onKeyDown={handleKeyDown(index)}
            sx={{ width: 60, height: 60 }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PinInput;