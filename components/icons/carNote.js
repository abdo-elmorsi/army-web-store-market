import React from 'react'
import PropTypes from 'prop-types';

export default function CarNote(props) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <path
        d="M12.002 9.834a2.668 2.668 0 1 1 0 5.335 2.668 2.668 0 0 1 0-5.335"
        stroke="#15AABE"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m12.9 12.053-1.123 1.126-.675-.677M5.548 8.147H4.136m7.101 0H9.824m2.119-2.119 1.412-.706m-9.925.706-1.413-.706m3.371-2.824c-.656 0-1.226.452-1.376 1.09l-.6 2.562.6-2.561c.15-.64.72-1.091 1.376-1.091h4.596c.656 0 1.226.452 1.375 1.09l.6 2.562"
        stroke="#15AABE"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.355 8.5v-.527a1.89 1.89 0 0 0-1.887-1.89H3.907a1.89 1.89 0 0 0-1.89 1.89v3.195c0 .368.298.667.667.667h1.491a.667.667 0 0 0 .667-.667v-.902H8"
        stroke="#15AABE"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
CarNote.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};