import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';

const useMaterialLabelStyles = makeStyles(() => ({
  formControlLabel: {
    textAlign: 'left',
  },
  formHelperText: {
    color: 'red',
  }
}));

const CheckBoxComponent = ({formStateName, value, label, onChange, validatorMethod, errorState, errorText, setFormError, required}) => {
  const [checked, setChecked] = useState(false);
  const materialLabelStyles = useMaterialLabelStyles();

  useEffect(() => {
    setChecked(value);
  }, [value]);

  function handleChange() {
    const event = {
      target: {
        value: !checked,
      }
    }

    setFormError(formStateName, false);
    if (validatorMethod(checked)) {
      setFormError(formStateName, true);
    }
    setChecked(!checked);
    onChange(event, formStateName);
  }

  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} name="checkedA" required={required}/>}
        label={label}
        classes={{ root: materialLabelStyles.formControlLabel }}
      />
      { errorState &&
        <FormHelperText
        classes={{ root: materialLabelStyles.formHelperText }}
          >{errorText}
        </FormHelperText>
      }
    </>
  );
};

export default CheckBoxComponent;
