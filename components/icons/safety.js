import React from 'react'
import PropTypes from 'prop-types';

export default function Safety(props) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
      >
      <path
        clipRule="evenodd"
        d="M20.625 12.113c0 4.541-3.413 8.787-8 9.818-4.587-1.031-8-5.277-8-9.818V8.546a2 2 0 0 1 1.243-1.851l5-2.046a4.637 4.637 0 0 1 3.514 0l5 2.046a2 2 0 0 1 1.243 1.851v3.567Z"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m15.875 11.056-3.75 3.75-2.25-2.25"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
Safety.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};