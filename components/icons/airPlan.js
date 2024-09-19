import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function AirPlan(props) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 18}
      height={props.height || 17}
      aria-hidden="true"
      viewBox="0 0 18 17"
      fill="none"
      {...props}
    >
      <path
        d="m7.666 9.167-2.383 4.17a.333.333 0 0 0 .29.499h1.123a.667.667 0 0 0 .502-.228l3.886-4.441"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M6.904 10.5H5.443a3.335 3.335 0 0 1-2-.666L1.662 8.5l.668-.667-.667-2.668h2l1.334 2h9.337a2 2 0 0 1 2.001 2.002v0c0 .736-.597 1.334-1.333 1.334H9.916"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11.084 7.166 7.782 3.392a.667.667 0 0 0-.502-.227H6.157a.333.333 0 0 0-.29.498L7.87 7.166"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
AirPlan.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};