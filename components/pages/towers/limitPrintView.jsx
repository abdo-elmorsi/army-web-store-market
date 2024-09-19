import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import moment from 'moment';
import PropTypes from 'prop-types';

// custom
import { formatComma, sum } from "utils/utils";
import PrintPageTableWrapper from "components/printPageTableWrapper";
import { useTranslation } from "react-i18next";


const LimitPrintView = forwardRef(({ language, data }, ref) => {
    const { t } = useTranslation("common");
    const componentRef = useRef(null);
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
            filename={`${t("tenants_key")} - ${t("limit_key")}`}
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
                                <th>{t('transaction_key')}</th>
                                <th>{t('date_key')}</th>

                                <th>{t('limit_key')}</th>
                                <th>{t('expiry_date_key')}</th>
                                <th>{t('balance_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{t("deposit_key")}</td>
                                    <td>{moment(row.created_at).format(date_format)}</td>

                                    <td>{formatComma(row.limit_amount_gross)}</td>
                                    <td>{moment(row.valid_until).format(date_format)}</td>
                                    <td>{formatComma(row.remaining_amount_gross)}</td>
                                </tr>
                            ))}
                            {data && <tr className="h-8 text-white bg-primary">
                                <td colSpan='2' className="text-center bold">{t('total_key')}</td>
                                <td>{formatComma(sum(data, "limit_amount_gross"))}</td>
                                <td></td>
                                <td>{formatComma(sum(data, "remaining_amount_gross"))}</td>
                            </tr>}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
LimitPrintView.propTypes = {
    language: PropTypes.string.isRequired,
    data: PropTypes.array,
};

LimitPrintView.displayName == "LimitPrintView";

export default LimitPrintView;