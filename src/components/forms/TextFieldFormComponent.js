import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

const TextFieldFormComponent = ({ formStateName, value, label, onChange, validatorMethod, errorState, errorText, setFormError, type, multiline, disabled, required }) => {
  const [textValue, setTextValue] = useState('');
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  function onTextFieldChange(event) {
    setFormError(formStateName, false);

    if (!validatorMethod(event.target.value)) {
      setFormError(formStateName, true);
    }
    onChange(event, formStateName);
    setTextValue(event.target.value);  
  }
  return (
    <div style={styles.textFieldFormComponentWrapper}>
      <TextField
        label={label}
        onChange={onTextFieldChange}
        error={errorState}
        helperText={errorState ? errorText : ''}
        color="secondary"
        fullWidth
        required={required}
        type={type}
        multiline={multiline}
        value={textValue}
        disabled={disabled}
      />
    </div>
  );
};

const styles = {
  textFieldFormComponentWrapper: {
    marginBottom: '10px',
  }
}

export default TextFieldFormComponent;
