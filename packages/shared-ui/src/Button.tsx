import React from 'react';

export const Button: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <button
    style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
  >
    {children}
  </button>
);
