import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "store/ThemeSlice";
import PropTypes from "prop-types"

const GlobalSetting = ({ children }) => {
  const dispatch = useDispatch();
  const [isRender, setIsRender] = useState(true);



  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      dispatch(toggleTheme("dark"));
    } else {
      dispatch(toggleTheme("light"));
    }
    setIsRender(false);




    if (process.env.NODE_ENV === 'production') {
      let hidden, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
      }

      const handleVisibilityChange = () => {
        if (document[hidden]) {
          showNotification();
        }
      };

      document.addEventListener(visibilityChange, handleVisibilityChange);

      return () => {
        document.removeEventListener(visibilityChange, handleVisibilityChange);
      };
    }

  }, []);




  const showNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
          setTimeout(() => {
            new Notification('Come back!', {
              body: 'We miss you. Click to return to our site.',
              icon: '/favicon.ico'
            }).onclick = function () {
              window.focus();
            };
          }, 1000);
        }
      });
    }
  };


  return <>{!isRender && children}</>;
};
export default GlobalSetting;

GlobalSetting.propTypes = {
  children: PropTypes.node.isRequired
}