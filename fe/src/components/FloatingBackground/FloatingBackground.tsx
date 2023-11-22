import React from 'react';
import './FloatingBackground.scss';

export const FloatingBackground: React.FC = () => {
  return (
    <ul className='circles'>
      {Array(10).fill({}).map((_) => <li></li>)}
    </ul>
  );
};
