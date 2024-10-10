import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

// custom
import PrintPageTableWrapper from "components/printPageTableWrapper";
import { useTranslation } from "react-i18next";


const PrintView = forwardRef(({ title = 'title', columns = [], data = [] }, ref) => {
    const router = useRouter();
    const { t } = useTranslation("common");
    const componentRef = useRef(null);
    const language = router.locale.toLowerCase();
    const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

    const now = moment().format(`${date_format}, HH:mm:ss`);

    const printComponent = useCallback(() => {
        componentRef.current.print();
    }, [componentRef.current])
    useImperativeHandle(ref, () => ({
        print: () => {
            printComponent();
        }
    }));
    return <>
        <PrintPageTableWrapper
            ref={componentRef}
            filename={title}
        >
            <tr>
                <td>
                    <p className="m-0 text-end"><i><small>{t('printed_on_key')} {now}</small></i></p>
                    <table className="table table-print table-bordered w-100"
                        dir={language == 'ar' ? 'rtl' : 'ltr'}
                        style={{ direction: language == 'ar' ? 'rtl' : 'ltr' }}
                    >
                        <thead className="h-10 font-bold text-white bg-primary">
                            <tr>
                                {columns?.filter(c => !c.omit && !c.noPrint).map(c => <th key={c.name}>{c.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => {
                                return (
                                    <tr
                                        key={`row-${i}`}
                                        className={`break-inside-avoid ${row?.subtotal ? 'bg-secondary' : ''}`}
                                    >
                                        {columns?.filter(c => !c.omit && !c.noPrint)
                                            .map(c =>
                                            (
                                                <td className="px-2" key={c.name}>
                                                    {c.cell ? c.cell(row) : c.selector(row)}
                                                </td>
                                            )
                                            )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
PrintView.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    columns: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;