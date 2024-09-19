import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import moment from 'moment';
import PropTypes from 'prop-types';

// custom
import PrintPageTableWrapper from "components/printPageTableWrapper";
import { useTranslation } from "react-i18next";


const PrintView = forwardRef(({ data }, ref) => {
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
            filename={t("tenants_key")}
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
                                <th>{t('tenant_name_key')}</th>
                                <th>{t('phone_number_key')}</th>
                                <th>{t('email_key')}</th>
                                <th>{t('national_id_key')}</th>
                                <th>{t('birth_date_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{row.full_name}</td>
                                    <td>{row.phone}</td>
                                    <td>{row.email}</td>
                                    <td>{row.national_or_iqma_id}</td>
                                    <td>{moment(row.birth_date_key).format(date_format)}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
PrintView.propTypes = {
    language: PropTypes.string.isRequired,
    data: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;