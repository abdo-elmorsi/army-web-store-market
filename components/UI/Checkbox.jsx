import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import TextError from './TextError';
import { Switch, Typography } from '@material-tailwind/react';

const Checkbox = ({ label, description, validator, submitted, formGroup, className, disabled, ...props }) => {
    const hasWarning = useMemo(() => submitted && validator && !validator.valid, [submitted, validator]);

    const boxClasses = classNames(`${description ? "-mt-4" : ""}`, {
        [className]: className,
    });
    return (
        <Switch
            id={label}
            disabled={disabled}
            aria-label={label}
            aria-invalid={hasWarning}
            label={
                <div>
                    <Typography color="blue-gray" className="text-sm font-medium text-gray-800 dark:text-gray-300 rtl:pr-2">
                        {label}
                    </Typography>
                    {hasWarning && <TextError>{validator.message}</TextError>}
                    {description && <Typography variant="small" color="gray" className="font-normal text-gray-700 dark:text-gray-200">
                        {description}
                    </Typography>}

                </div>
            }
            containerProps={{
                className: boxClasses,
            }}
            {...props}
        />
    );
};

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    validator: PropTypes.shape({
        valid: PropTypes.bool,
        message: PropTypes.string,
    }),
    submitted: PropTypes.bool,
    formGroup: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

Checkbox.defaultProps = {
    formGroup: true,
    className: '',
    disabled: false,
};

export default Checkbox;
