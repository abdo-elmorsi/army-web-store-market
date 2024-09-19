import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function Corporates(props) {
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
        d="M21.004 21.004V4.284a1.287 1.287 0 0 0-1.738-1.2L12.834 5.49c-.502.189-.835.67-.834 1.207v14.306"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M6.373 5.247h2.25c.622 0 1.126.504 1.126 1.126v2.25H5.247v-2.25c0-.622.504-1.126 1.126-1.126v0Z"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.498 2.996v2.251M2.996 21.004V9.749c0-.622.504-1.125 1.126-1.125h6.752c.622 0 1.126.503 1.126 1.125v11.255m-6.19-5.628h3.377m-3.377 0h3.377M5.81 12h3.377m-1.689 7.316v1.688m14.506 0H1.996M15.001 9.056v7.946m3.002-7.946v7.946"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
Corporates.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};