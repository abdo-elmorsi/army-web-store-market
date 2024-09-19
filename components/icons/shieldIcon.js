import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function ShieldIcon(props) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12 2.5L3.5 6v12l8.5 3 8.5-3V6L12 2.5z"
        stroke={theme === 'dark' ? '#15AABE' : '#15AABE'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17.5V7.5"
        stroke={theme === 'dark' ? '#15AABE' : '#15AABE'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

ShieldIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};