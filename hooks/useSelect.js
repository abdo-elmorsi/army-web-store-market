import { useState, useCallback } from "react";
import validate, { isString } from 'utils/validation-rules.js';

const useSelect = (initialValue = '', validateRule = 'textInput', submitted) => {
  const [value, setValue] = useState(initialValue);
  const [validator, setValidator] = useState(() => validate(validateRule, initialValue));
  const [options, setOptions] = useState();

  const handleOnChange = useCallback(selected => {
    let value = selected;

    //checking is select-all is selected
    if (selected && Array.isArray(selected) && options) {
      if (selected.some(c => c.isSelectAll)) {
        value = options;
      }
    }

    setValidator(validate(validateRule, Array.isArray(value) ? true : (value?.value || value?.id)));
    setValue(value);
  }, [setValue, setValidator, validateRule, options]);

  const reset = useCallback(() => {
    let value = isString(initialValue) ? initialValue.trim() : initialValue;
    setValidator(validate(validateRule, value));
    setValue(value);
  }, [setValue, setValidator, validateRule, initialValue]);

  const changeValue = useCallback(inputValue => {
    setValidator(validate(validateRule, Array.isArray(inputValue) ? true : (inputValue?.value || inputValue?.id)));
    setValue(inputValue);
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
    setOptions,
    bind: {
      value,
      onChange: handleOnChange,
      validator,
      submitted
    }
  };
};

export default useSelect;