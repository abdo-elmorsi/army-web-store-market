import React, { forwardRef, useState, useCallback, useImperativeHandle, useRef, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import { useReactToPrint } from "react-to-print";


export const getPageStyle = (size = 'A4 landscape', additionsCss = '') => {
    return `
    @page {
        /* dimensions for the whole page */
        size: ${size};
        margin: 5mm;
    }
    
    html {
    /* off-white, so body edge is visible in browser */
    // background: #eee;
    margin: 0;
    padding: 0;
    width: 100%;
    }
    
    body {
    /* this affects the margin on the content before sending to printer */
    margin: 0px;
    width: 100%;
    }
    
    .page-table {
    width: 100%;
    border-spacing: 2px;
    }
    
    .table {
    width: 100%
    }
    
    .table>tbody {
    border: black solid 1px;
    }
    
    .table>tbody>tr>td,
    .table>tfoot>tr>td {
    padding: 0 5px !important;
    border: black solid 1px;
    }
    
    .print-none {
    display: none;
    }
    
    .table>thead>tr>th {
    // padding: 5px !important;
    font-weight: bold;
    border: black solid 1px;
    }
    
    .print-only {
    display: initial;
    !important;
    }
    
    .table,
    .table-responsive {
    max-height: auto !important;
    height: auto !important;
    
    }
    
    .print-preview {
    padding: 5px;
    display: block;
    }
    
    .avoid-break-inside {
    page-break-inside: avoid;
    }
    
    @media print {
        .print-view {
            display: block !important;
        }
        .print-hidden {
            display: none !important;
        }

        * {
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }
    }
    @media not print {
        .print-only {
            display: none !important;
        }
    }
    ${additionsCss}
    `
}

const PrintPageTableWrapper = forwardRef(({  filename, additionsCss = '', size = 'A4 landscape', ...props }, ref) => {
    const componentRef = useRef(null);
    const onBeforeGetContentResolve = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const pageStyle = getPageStyle(size, additionsCss);


    const handleOnBeforeGetContent = useCallback(() => {
        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve;
            setIsPrinting(true);
        });
    }, [setIsPrinting]);
    const handleBeforePrint = () => { }
    const handleAfterPrint = () => {
        setIsPrinting(false);
        onBeforeGetContentResolve.current = null;
    }
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `${filename}`,
        onBeforeGetContent: handleOnBeforeGetContent,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        pageStyle: pageStyle,
        copyStyles: true
        // removeAfterPrint: true
    });

    useImperativeHandle(ref, () => ({
        print: () => {
            handlePrint();
        }
    }));

    useEffect(() => {
        if (isPrinting && onBeforeGetContentResolve.current) {
            onBeforeGetContentResolve.current();
        }
    }, [isPrinting, onBeforeGetContentResolve.current]);




    return <>
        <div className="print-view w-100" ref={componentRef}>
            {isPrinting && <div className="mt-2 w-100">
                <table className="page-table">
                    <thead className="mb-2">
                        <tr>
                            <th>
                                <div className="justify-center pt-3 text-start">
                                    {filename}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.children}
                    </tbody>
                </table>
            </div>}
        </div>
    </>
})
PrintPageTableWrapper.propTypes = {
    filename: PropTypes.string,
    additionsCss: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.node.isRequired,
};
PrintPageTableWrapper.displayName = "PrintPageTableWrapper"
export default PrintPageTableWrapper;
