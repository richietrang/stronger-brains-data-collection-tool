import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textAlign: 'left',
    paddingTop: '1rem',
    marginBottom: '1rem',
  },
  formHelperText: {
    color: 'red',
  },
  slider: {
    color: '#f50057',
  },
});

const styles = {
  noMargin: {
    margin: '0',
  }
};

const SliderFormComponent = ({ formStateName, value, label, onChange, validatorMethod, errorState, errorText, setFormError, min, max, step, defaultValue, required, legendText }) => {
  const materialLabelStyles = useStyles();
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const parentStateValue = value;
  function onSliderChange(event, value) {
    setFormError(formStateName, false);

    if (!validatorMethod(value)) {
      setFormError(formStateName, true);
    }
    const eventOverride = {
      target: {
        value: {
          ...parentStateValue,
          label: label,
          rating: value,
        },
      },
    }
    setSliderValue(value);
    onChange(eventOverride, formStateName);
  }

  useEffect(() => {
    if (value && value.rating) {
      setSliderValue(value.rating);
    }
  }, [value])

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormLabel id="discrete-slider">
        {label} {required ? '*' : ''}
      </FormLabel>
      <Slider
        classes={{ root: materialLabelStyles.slider }}
        onChange={onSliderChange}
        value={sliderValue}
        defaultValue={defaultValue}
        step={step}
        min={min}
        max={max}
        required={required}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        marks
      />
      {errorState &&
        <FormHelperText
          classes={{ root: materialLabelStyles.formHelperText }}
        >{errorText}
        </FormHelperText>
      }

      <div style={styles.noMargin}>
        {legendText && legendText.length &&
          legendText.map((legendItem, index) => {
            return (
              <div key={`${legendItem}-${index}`}>{legendItem}</div>
            );
          })
        }
      </div>
    </div>
  );
}

export default SliderFormComponent;
