import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({ className = "btn--primary", type = "button", children, disabled, ...rest }) => {
  const boxClasses = classNames(
    `btn`,
    className
  );
  return (
    <button
      className={boxClasses}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
