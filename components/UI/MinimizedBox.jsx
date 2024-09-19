import React, { useRef, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSavedState } from "hooks";

const MinimizedBox = ({ children, className, title = "filters_key", actionText, bordered }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMinimized, setIsMinimized, clearDefaultOptions] = useSavedState([], `easier-b2b-box-${router.pathname}-cache`);

  const [prevHeight, setPrevHeight] = useState("");
  const comRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleMinimize = useCallback(() => {
    setLoading(true);
    setIsMinimized((prevState) => !prevState);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer); // Clear the timer on unmount
  }, []);

  useEffect(() => {
    if (comRef.current && (isMinimized || prevHeight === "")) {
      if (isMinimized) {
        comRef.current.style.height = "0px";
      } else {
        comRef.current.style.height = prevHeight || "auto"; // Use prevHeight or auto
        if (!prevHeight) {
          setPrevHeight(`${comRef.current.offsetHeight}px`);
        }
      }
    }
  }, [isMinimized, prevHeight]);

  const boxClasses = classNames("bg-white dark:bg-gray-800 rounded-xl shadow-md mb-4", {
    "border-b-2": bordered,
    [className]: className,
  });

  const toggleText = isMinimized ? t("maximize_key") : t("minimize_key");

  return (
    <div className={boxClasses}>
      <header className="flex items-center justify-between p-5 rounded-t-xl"> {/* Rounded top corners */}
        <h3 className="text-lg font-medium">{t(title)}</h3>
        <button
          disabled={loading}
          className={classNames(
            isMinimized ? "bg-gray-100" : "bg-secondary",
            "flex items-center justify-between gap-2 px-4 w-32 py-2 rounded-full focus:outline-none hover:bg-opacity-80 dark:hover:bg-opacity-100"
          )}
          onClick={handleMinimize}
          aria-expanded={!isMinimized}
        >
          <span className="font-medium text-primary">
            {actionText || toggleText}
          </span>
          <ChevronDownIcon
            className={classNames(
              "text-primary duration-300 h-4 w-4",
              isMinimized ? "transform rotate-180" : ""
            )}
          />
        </button>
      </header>
      <div className={`${!isMinimized && !loading ? " overflow-visible" : "overflow-hidden"} duration-300 transition-all`} style={{ height: isMinimized ? "0px" : prevHeight }} ref={comRef}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

MinimizedBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  actionText: PropTypes.string,
  bordered: PropTypes.bool,
};

MinimizedBox.defaultProps = {
  className: "",
  bordered: false,
};

export default MinimizedBox;
