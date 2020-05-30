import React from 'react';

const Loading = () => {
  return (
    <svg className='circular' viewBox='0 0 50 50'>
      <circle
        cx='25'
        cy='25'
        r='20'
        fill='none'
        stroke='#106CFA'
        strokeWidth='5%'
        strokeLinecap='round'
      />
    </svg>
  );
};

export default Loading;
