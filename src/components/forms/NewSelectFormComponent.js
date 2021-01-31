import React, { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';

const useMaterialFormStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const useMaterialLabelStyles = makeStyles(() => ({
  root: {
    '&$focused': {
      color: '#E61753',
    },
  },
  focused: {},
}));

const NewSelectFormComponent = ({ label, formStateName, value, onChange, validatorMethod, errorState, errorText, setFormError, selectOptions, required, disabled }) => {

  const materialFormStyles = useMaterialFormStyles();
  const materialLabelStyles = useMaterialLabelStyles();
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  const onSelection = (event) => {
    setFormError(formStateName, false);

    if (!validatorMethod(event.target.value)) {
      setFormError(formStateName, true);
    }
    onChange(event, formStateName);
    setSelectedItem(event.target.value);
  }

  return (
    <>
      <FormControl required={required} className={materialFormStyles.formControl} >
        <InputLabel htmlFor={label} classes={materialLabelStyles}>{label}</InputLabel>
        <Select
          native
          value={selectedItem}
          onChange={onSelection}
          color="secondary"
          error={errorState}
          id={`${label} selector`}
          disabled={disabled}
        >
          <option value='' key='empty'>{}</option>
          {selectOptions.map((selectOption, index) => {
            return (
              <option key={selectOption}>{selectOption}</option>
            );
          })
          }
        </Select>
        {errorState &&
          <FormHelperText error={errorState}>{errorText}</FormHelperText>
        }
      </FormControl>
    </>
  );
};

export default NewSelectFormComponent;
