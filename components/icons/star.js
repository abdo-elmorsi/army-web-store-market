import React from 'react'
import PropTypes from 'prop-types';

export default function Star(props) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <path
        d="M14.932 12.433a.917.917 0 0 0-.266.809l.741 4.1a.9.9 0 0 1-.375.9.918.918 0 0 1-.975.066l-3.69-1.925a.942.942 0 0 0-.418-.109h-.225a.678.678 0 0 0-.225.075l-3.692 1.934a.974.974 0 0 1-.592.092.926.926 0 0 1-.741-1.06l.741-4.1a.933.933 0 0 0-.266-.815L1.94 9.483a.9.9 0 0 1-.224-.941.936.936 0 0 1 .741-.625l4.142-.601a.927.927 0 0 0 .733-.508l1.825-3.741c.043-.084.1-.16.167-.225l.075-.059a.56.56 0 0 1 .134-.108l.09-.033.142-.059h.351c.314.033.59.22.734.5l1.849 3.725a.926.926 0 0 0 .691.508l4.142.6c.35.05.642.292.758.626.11.334.015.7-.241.941l-3.117 2.95Z"
        fill="#FFCE73"
      />
    </svg>
  )
}
Star.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};