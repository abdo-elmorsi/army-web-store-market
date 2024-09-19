import * as React from "react";
const Loader = (props) => (
  <div className="min-h-72 h-screen max-h-[50vh] flex flex-col items-center justify-center gap-4">
    <svg
      width={44}
      height={44}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>
        {
          ".spinner_ZCsl{animation:spinner_qV4G 1.2s cubic-bezier(0.52,.6,.25,.99) infinite}.spinner_gaIW{animation-delay:.6s}@keyframes spinner_qV4G{0%{r:0;opacity:1}100%{r:11px;opacity:0}}"
        }
      </style>
      <circle className="spinner_ZCsl" cx={12} cy={12} r={0} />
      <circle className="spinner_ZCsl spinner_gaIW" cx={12} cy={12} r={0} />
    </svg>
    <h1 className="text-slate-400 text-xl uppercase">Loading, please wait.</h1>
  </div>
);
export default Loader;
