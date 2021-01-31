import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  icon: {
    color: 'grey',
    "&$activeIcon": {
      color: theme.palette.secondary.main
    },
    "&$completedIcon": {
      color: theme.palette.secondary.main
    },
  },
  activeIcon: {},
  completedIcon: {},
}));

const MultiStageFormStepperComponent = ({ formStageNumber, stepsText }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>

        <Stepper activeStep={formStageNumber} alternativeLabel>
          {stepsText.map((label) => (
            <Step key={label}>
                <StepLabel StepIconProps={{ classes:{ root: classes.icon, active: classes.activeIcon, completed: classes.completedIcon } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>


    </div>
  );
};

export default MultiStageFormStepperComponent;
