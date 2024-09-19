import React from 'react'
import PropTypes from 'prop-types';

export default function carMeter(props) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <circle
        cx={12.874}
        cy={13.431}
        r={1.751}
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.873 7.431v1-1Z"
        fill="#15AABE"
      />
      <path
        d="M12.873 7.431v1"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m8.629 9.19.707.707-.707-.707Z"
        fill="#15AABE"
      />
      <path
        d="m8.629 9.19.707.707"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.113 12.195 17.12 9.19l-3.006 3.005Z"
        fill="#15AABE"
      />
      <path
        d="M14.113 12.195 17.12 9.19"
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.373 17.935h7.003-7.003Z"
        fill="#15AABE"
      />
      <path
        d="M9.373 17.935h7.003"
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.877 13.433h-1 1Z"
        fill="#15AABE"
      />
      <path
        d="M18.877 13.433h-1"
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.872 13.433h-1 1Z"
        fill="#15AABE"
      />
      <path
        d="M7.872 13.433h-1"
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M12.594 4.428a9.104 9.104 0 0 0-8.723 8.984 8.983 8.983 0 0 0 3.74 7.322 3.889 3.889 0 0 0 2.278.7h5.98a3.816 3.816 0 0 0 2.228-.677 8.999 8.999 0 0 0-5.503-16.33Z"
        stroke="#15AABE"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
carMeter.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};