import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import config from 'config/config';
import { Select } from 'components/UI';
import { useRouter } from 'next/router';
import { useSavedState } from 'hooks';
import axiosInstance from 'helper/apis/axiosInstance';

export default function CompanySearch({ companyId, fetchReport, ...reset }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "easier-b2b-company-cache");

  const router = useRouter();
  const language = router.locale.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`${config.apiGateway.API_URL_PRODUCTION}/v2/supplier/business/company/collection`)
        .then(({ data }) => {
          const company = (data?.data || [])?.map((c) => {
            return {
              value: c.uuid,
              label: language == 'en' ? c.name.en : c.name.ar,
            };
          });
          setDefaultOptions(company)
        });
    };

    !defaultOptions.length && fetchData();
  }, [])


  return (
    <Select
      label={t('company_key')}
      // mandatory
      // async={true}
      // loadOptions={CompanySearch}
      options={defaultOptions}
      isDisabled={false}
      value={companyId.value}
      onChange={(value) => {
        companyId.changeValue(value);
        fetchReport && fetchReport({ companyId: value });
      }}
      {...reset}
    // defaultValue={[{label:"ss",value:"va"}]}
    />
  );
}

CompanySearch.propTypes = {
  companyId: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
  fetchReport: PropTypes.func,
};

// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
// import config from 'config/config';
// import { Select } from 'components/UI';
// import { useRouter } from 'next/router';

// export default function CompanySearch({ companyId, fetchReport, ...reset }) {
//   const { t } = useTranslation('common');
//   const [defaultOptions, setDefaultOptions] = useState([]);
//   const router = useRouter();
//   const language = router.locale.toLowerCase();

//   useEffect(() => {
//     const fetchData = async () => {
//       await CompanySearch("a", (data) => setDefaultOptions(data));
//     };
//     fetchData();
//   }, [])

//   const CompanySearch = (inputValue, callback) => {
//     if (!inputValue) {
//       return callback([]);
//     } else {
//       axiosInstance
//         .get(
//           `${config.apiGateway.API_URL_PRODUCTION}/v2/supplier/business/company/collection?search[value]=${inputValue}&start=0&length=10&is_export=false`
//         )
//         .then(({ data }) => {
//           const company = data.data;
//           if (!company?.length) {
//             return callback([]);
//           }
//           return callback(
//             [...company]?.map((c) => {
//               return {
//                 value: c.uuid,
//                 label: language == 'en' ? c.name.en : c.name.ar,
//               };
//             })
//           );
//         });
//     }
//   };

//   return (
//     <Select
//       label={t('company_key')}
//       mandatory
//       async={true}
//       loadOptions={CompanySearch}
//       isDisabled={false}
//       value={companyId.value}
//       onChange={(value) => {
//         companyId.changeValue(value);
//         fetchReport && fetchReport({ company: value });
//       }}
//       {...reset}
//       defaultOptions={defaultOptions}
//     // defaultValue={[{label:"ss",value:"va"}]}
//     />
//   );
// }

// CompanySearch.propTypes = {
//   companyId: PropTypes.shape({
//     value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     changeValue: PropTypes.func,
//   }).isRequired,
//   fetchReport: PropTypes.func,
// };