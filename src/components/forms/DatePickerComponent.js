import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 200,
    marginBottom: '10px',
  },
}));

const DatePickerComponent = ({ formStateName, value, label, onChange, validatorMethod, errorState, errorText, setFormError, required }) => {
  const [date, setDate] = useState('2020-01-01');
  const classes = useStyles();
  useEffect(() => {
    setDate(value);
  }, [value]);
  
  const onTextFieldChange = (event) => {
    setFormError(formStateName, false);

    if (!validatorMethod(event.target.value)) {
      setFormError(formStateName, true);
    }
    onChange(event, formStateName);
    setDate(event.target.value);
  }

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="date"
        value={date}
        className={classes.textField}
        onChange={onTextFieldChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={errorState}
        helperText={errorState ? errorText : ''}
        required={required}
      />
    </form>
  );
}

export default DatePickerComponent;
