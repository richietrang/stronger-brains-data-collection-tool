import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

const useMaterialLabelStyles = makeStyles(() => ({
  formControlLabel: {
    textAlign: 'left',
    marginBottom: '10px',
  },
  formHelperText: {
    color: 'red',
  }
}));

const styles = {
  multiCheckBoxWrapper: {
    textAlign: 'left',
    marginTop: '18px',
  },
  checkboxesWrapper: {
    marginTop: '10px',
  }
}

const MultiCheckBoxComponent = ({ label, value, formStateName, options, onChange, errorState, errorText, setFormError, required }) => {
  const [optionsChecked, setOptionsChecked] = useState(
    options.reduce((optionsObject, option) => {
      return { ...optionsObject, [option]: false };
    }, {})
  );
  const materialLabelStyles = useMaterialLabelStyles();


  function handleChange(option) {
    const updatedCheckBoxState = { ...optionsChecked, [option]: !optionsChecked[option] };
    const event = {
      target: {
        value: updatedCheckBoxState,
      }
    }
    setFormError(formStateName, false);

    if (required && !Object.values(updatedCheckBoxState).includes(true)) {
      setFormError(formStateName, true);
    }
    setOptionsChecked(updatedCheckBoxState)
    onChange(event, formStateName);
  }

  useEffect(() => {
    setOptionsChecked(value);
  }, [value]);


  return (
    <div style={styles.multiCheckBoxWrapper}>
      <FormLabel>{label} {required ? '*' : ''}</FormLabel><div></div>
      {
        optionsChecked &&
        <div style={styles.checkboxesWrapper}>
        {options.map((option, index) => {
          return (
            <span key={`${option}-${index}`}>
              <FormControlLabel
                control={<Checkbox checked={optionsChecked[option]} onChange={() => handleChange(option)} name="groupedCheckbox" />}
                label={option}
                classes={{ root: materialLabelStyles.formControlLabel }}
              />
            </span>
          );
        })
        }
      </div>
      }
      {errorState &&
        <FormHelperText
          classes={{ root: materialLabelStyles.formHelperText }}
        >{errorText}
        </FormHelperText>
      }
    </div>
  );
};

export default MultiCheckBoxComponent;
