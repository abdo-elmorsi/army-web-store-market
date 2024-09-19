import React from 'react'
import PropTypes from 'prop-types';

export default function license(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={44}
      height={44}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.638 14.003H3.362a1.334 1.334 0 0 1-1.334-1.334V5.332C2.028 4.595 2.625 4 3.362 4h9.276c.737 0 1.334.596 1.334 1.333v7.337c0 .737-.598 1.334-1.334 1.334Z"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.999a1.667 1.667 0 1 1 0 3.334A1.667 1.667 0 0 1 8 6m3.002 6.002a1.589 1.589 0 0 0-.397-.578v0a1.58 1.58 0 0 0-1.076-.422H6.472c-.4 0-.783.15-1.077.422v0a1.59 1.59 0 0 0-.396.578M3.186 3.998v-.667c0-.737.597-1.333 1.334-1.333h6.96c.736 0 1.333.596 1.333 1.333v.667"
        stroke="#336a86"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  )
}
license.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};