import { ServerStackIcon } from '@heroicons/react/16/solid';
import React, { MouseEvent,useEffect, useState } from 'react';
import Chip from './Chip';
import Button from './Button';
import { Field, Input, Label } from '@headlessui/react';

interface Props {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}

const ListInput:React.FC<Props> = ({ label, value, onChange, defaultValue, placeholder, className, required = false }) => {
  const [ inputValue, setInputValue ] = useState<string>(defaultValue || '');
  const [ addItem, setAddItem ] = useState(false);

  useEffect(() => {
    if (!addItem) {
      setInputValue(defaultValue || '');
    }
  }, [ addItem ]);

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value && !value.includes(inputValue)) {
      onChange([...value, inputValue]);
      setAddItem(false);
    }
  }

  const wrapperClass = `flex justify-center items-center flex-wrap list-none p-2 mb-1`;

  return (<div className={`${wrapperClass} ${className}`}>
      {value.length > 0 && <div className="my-3 mb-4">{value.map((item) =>
        <Chip
          size="medium"
          onDelete={() => onChange(value.filter(v => v !== item))}
          icon={<ServerStackIcon />}
          key={item}
          label={item}
        />
      )}</div> || <div className="my-3 mb-5">
        <p className="text-center">No {label} added</p>
        {required && <p className="text-red-500 italic text-sm text-center">At least one is required</p>}
      </div>}
      <div className="w-full flex items-center justify-center">
        {!addItem && <Button
          variant="outlined"
          onClick={() => setAddItem(true)}
        >
          Add {label}
        </Button>}
        {addItem && <Field className="w-full">
          <Label htmlFor={label} className="text-sm font-medium leading-6 text-gray-900">
            {label}
          </Label>
          <Input
            type='text'
            id={label}
            name={label}
            placeholder={placeholder}
            value={inputValue}
            required={required}
            onChange={(e) => setInputValue(e.target.value)}
            className={
              'mt-1 mb-2 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
            }
          />
          <div className="flex gap-2">
          <Button
            disabled={!inputValue || value.includes(inputValue)}
            variant="outlined"
            onClick={handleAdd}
          >Add</Button>
          <Button
            variant="outlined"
            onClick={() => setAddItem(false)}
          >Cancel</Button>
          </div>
        </Field>}
      </div>
  </div>)
}

export default ListInput;