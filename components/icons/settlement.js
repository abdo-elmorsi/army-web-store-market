import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function Settlement(props) {
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
        d="M2.996 16.293h2.335c.354 0 .693-.14.943-.39v0c.25-.25.39-.59.39-.944V9.623c0-.354-.14-.693-.39-.943v0c-.25-.25-.59-.39-.943-.39H2.996m18.007 0H18.67c-.353 0-.693.14-.943.39v0c-.25.25-.39.59-.39.943v5.336c0 .354.14.693.39.944v0c.25.25.59.39.944.39h2.333"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.355 15.19h-.86c-.286 0-.569.06-.83.18l-4.208 1.916m-.814-8.078a1.99 1.99 0 0 0-1.676-.164l-2.301.83m10.829-.898-2.877-1.267a2 2 0 0 0-1.894.152l-2.611 1.692a1.507 1.507 0 0 0-.193 2.38v0c.45.407 1.099.505 1.649.249l1.556-.726"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13.126 11.455.79.717a2.001 2.001 0 0 1 .009 2.958l-2.018 1.847a2 2 0 0 1-2.694.007l-1.387-1.258a2 2 0 0 0-1.185-.5"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x={2.996}
        y={2.996}
        width={18.008}
        height={18.008}
        rx={4}
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
Settlement.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};