import React from "react";
import moment from "moment";
function CopyRights() {
  return <p className="fixed text-xs pointer-events-none bottom-1 right-1 rtl:right-auto rtl:left-1 dark:text-white">
    © Copyright: <a target="_blank" rel="noreferrer" className="text-primary" href="https://www.easier.com">Easier</a> {moment().format("YYYY")}
  </p>
}
export default CopyRights;