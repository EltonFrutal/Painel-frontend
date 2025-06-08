import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      style={{
        display: 'block',
        marginBottom: 4,
        color: '#111827',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {children}
    </label>
  );
};