import React, { useState } from 'react';
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

const SelectFormComponent = ({ label, required, onSelected, errorState, selectOptions }) => {
  const materialFormStyles = useMaterialFormStyles();
  const materialLabelStyles = useMaterialLabelStyles();
  const [selectedItem, setSelectedItem] = useState('');
  const onGroupSelected = (event) => {
    setSelectedItem(event.target.value);
    onSelected(event);
  }
  return (
    <>
      <FormControl required={required} className={materialFormStyles.formControl} >
        <InputLabel htmlFor={label} classes={materialLabelStyles}>{label}</InputLabel>
        <Select
          native
          value={selectedItem}
          onChange={onGroupSelected}
          color="secondary"
          error={errorState}
          id={`${label} selector`}
        >
          <option value='' key='empty'>{}</option>
          {selectOptions.map(selectOption => {
            return (
              <option key={selectOption}>{selectOption}</option>
            );
          })}
          
        </Select>
        {errorState &&
          <FormHelperText error={errorState}>Empty Field!</FormHelperText>
        }
      </FormControl>
    </>
  );
};

export default SelectFormComponent;
