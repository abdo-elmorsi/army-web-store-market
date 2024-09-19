import { useState, useCallback } from "react";
import validate, { isString } from '../utils/validation-rules.js';

const useInput = (initialValue = '', validateRule = 'textInput', submitted) => {
    const [value, setValue] = useState(initialValue);
    const [validator, setValidator] = useState(() => validate(validateRule, initialValue));

    const handleOnChange = useCallback(event => {
        let value = event.target.value;
        setValidator(validate(validateRule, value));
        setValue(value);
    }, [setValue, setValidator, validateRule]);

    const reset = useCallback(() => {
        let value = isString(initialValue) ? initialValue.trim() : initialValue;
        setValidator(validate(validateRule, value));
        setValue(value);
    }, [setValue, setValidator, validateRule, initialValue]);

    const changeValue = useCallback(inputValue => {
        let value = validateRule === 'email' ? inputValue.trim() : inputValue;
        setValidator(validate(validateRule, value));
        setValue(value);
    }, [setValue, setValidator, validateRule]);

    const setError = message => {
        const valid = !message;
        setValidator({ valid, message });
    };

    return {
        value,
        changeValue,
        isValid: validator && validator.valid,
        reset,
        setError,
        bind: {
            value,
            onChange: handleOnChange,
            validator,
            submitted
        }
    };
};

export default useInput;