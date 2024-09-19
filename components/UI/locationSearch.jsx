import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextError from './TextError';

const LocationSearch = forwardRef(({ labelKey, hasWarning, message }, ref) => {
  const { t } = useTranslation('common');

  return (
    <div className="my-4">
      <label
        className="block text-sm text-gray-800 dark:text-white"
        htmlFor="delivery_address"
      >
        {t(labelKey)}
      </label>
      <input

        id="delivery_address"
        placeholder={t("search_key")}
        className="w-full px-3 py-2 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800 placeholder-gray-400 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline-blue hover:border-primary focus:border-primary"
        ref={ref}
      />
      {hasWarning && <TextError>{message}</TextError>}
    </div>
  );
});

LocationSearch.displayName = "LocationSearch";

LocationSearch.propTypes = {
  labelKey: PropTypes.string.isRequired,
  hasWarning: PropTypes.bool,
  message: PropTypes.string,
};

export default LocationSearch;
