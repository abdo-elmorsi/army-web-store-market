import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TextError from './TextError';
import { useTranslation } from 'react-i18next';

const DateInput = React.memo(
  ({
    label,
    placeholder,
    value,
    onChange,
    validator,
    submitted,
    mandatory,
    dateFormat,
    className,
    'data-testid': dataTestId,
    ...props
  }) => {
    const { t } = useTranslation('common');
    const hasWarning = useMemo(() => submitted && validator && !validator.valid, [
      submitted,
      validator,
    ]);

    return (
      <div className={`w-full block-input-date ${hasWarning ? '-mb-1' : ''}`}>
        {label && (
          <label
            className="block text-sm text-gray-800 dark:text-white"
            htmlFor={props.id}
          >
            {label}
            {mandatory && (
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            )}
            {mandatory && (
              <span className="sr-only"> ({t('common:required')})</span>
            )}
          </label>
        )}
        <DatePicker
          className="block w-full p-2 border rounded-lg rtl:pr-6 dark:focus:bg-gray-800 hover:border-primary focus:border-primary focus:shadow-outline-blue focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
          selected={value}
          onChange={onChange}

          isClearable
          placeholderText={placeholder}
          data-testid={dataTestId || props.id}
          aria-invalid={hasWarning ? 'true' : 'false'}
          aria-describedby={hasWarning ? `${props.id}-error` : null}
          dateFormat={dateFormat}

          showYearDropdown={props.showYearDropdown ?? true}
          showMonthDropdown={props.showMonthDropdown ?? true}
          // dateFormatCalendar="MMMM"
          yearDropdownItemNumber={30}
          scrollableYearDropdown
        // withPortal
        {...props}
        />
        {hasWarning && <TextError>{validator.message}</TextError>}
      </div>
    );
  }
);

DateInput.defaultProps = {
  placeholder: "dd/MM/yyyy",
  dateFormat: "dd/MM/yyyy",
};

DateInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  validator: PropTypes.shape({
    valid: PropTypes.bool,
    message: PropTypes.string,
  }),
  showYearDropdown: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  submitted: PropTypes.bool,
  mandatory: PropTypes.bool,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
};
DateInput.displayName = "DateInput";

export default DateInput;