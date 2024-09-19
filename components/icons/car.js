import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function Car(props) {
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
        d="m22 9-2.62 1M4.63 10 2 9m17.379 1-.839-4.012A2.501 2.501 0 0 0 16.092 4h-8.08a2.5 2.5 0 0 0-2.434 1.931L4.627 10"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M3.25 20H5.5A1.5 1.5 0 0 0 7 18.5v-1h10v1a1.5 1.5 0 0 0 1.5 1.5h2.25c.69 0 1.25-.56 1.25-1.25V13a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v5.75c0 .69.56 1.25 1.25 1.25Z"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 14h-2.5m-7.5 0h-2.5"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
Car.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};