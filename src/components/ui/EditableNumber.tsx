"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export function EditableNumber({ value, onChange, className = "" }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    const num = parseFloat(localValue);
    if (!isNaN(num)) {
      onChange(num);
    } else {
      setLocalValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-white/10 border border-white/30 rounded px-1 w-24 text-center outline-none ${className}`}
        autoFocus
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-white/10 hover:outline hover:outline-1 hover:outline-white/30 rounded px-1 inline-block ${className}`}
      title="Click to edit"
    >
      {value}
    </span>
  );
}
