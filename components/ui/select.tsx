import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = ({ children, ...props }: SelectProps) => {
  return (
    <select
      {...props}
      style={{
        width: '100%',
        padding: '0.6rem 0.75rem',
        borderRadius: 8,
        border: '1px solid #d1d5db',
        fontSize: 15,
        outline: 'none',
        background: '#f3f4f6',
        color: '#222',
        appearance: 'none',
      }}
    >
      {children}
    </select>
  );
};