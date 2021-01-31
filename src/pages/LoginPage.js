import React, { useState } from 'react';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import axios from 'axios';
import { paths } from '../server/paths';
import DialogComponent from '../components/DialogComponent';
import { useAuth } from "../context/auth";
import { Link, Redirect } from "react-router-dom";
import LoginSignupLayout from "./layouts/LoginSignupLayout";
import TextFieldFormComponent from "../components/forms/TextFieldFormComponent";
import { validatorEnum } from "../utility/validatorEnum";

const styles = {
  contentWrapper: {
    padding: '0 40px',
    marginTop: '20px',
    width: '85%',
  },
  buttonWrapper: {
    display: 'flex',
    marginTop: '20px',
    justifyContent: 'center',
  },
  redirectLink: {
    margin: '10px 0 0 0',
    color: '#0500ff',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '15px',
    borderRadius: '10px',
  },
}

const LoginPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const { setAuthTokens } = useAuth();

  const [formError, setFormError] = useState({
    email: false,
    password: false,
  });

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  function onFormInputChange(event, formStateName) {
    setFormState({
      ...formState,
      [formStateName]: event.target.value,
    });
  }

  function onInputError(formStateName, isError) {
    setFormError({
      ...formError,
      [formStateName]: isError,
    });
  }

  function checkRequiredFieldsSet(...requiredFields) {
    let allRequiredFieldsSet = true;
    let updatedFormErrorState = formError;

    requiredFields.forEach(formField => {
      if (!formState[formField] || Object.keys(formState[formField]).length === 0) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      }
    });
    setFormError({ ...updatedFormErrorState });
    return allRequiredFieldsSet;
  }

  function handleSubmit() {
    if (checkRequiredFieldsSet('email', 'password')) {
      const loginData = formState;
      if (!Object.values(formError).includes(true)) {
        axios.post(paths.login(), loginData)
          .then(res => {
            if (res.data.status === 201) {
              setAuthTokens({ tokens: res.data.token, user: res.data.user });
              setIsLoggedIn(true)
            } else {
              setDialogText(res.data.err);
              setDialogOpen(true);
            }
          })
          .catch(err => {
            alert(err);
          })
      }
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return (
    <>
      {isLoggedIn &&
        <Redirect to="/" />
      }
      <LoginSignupLayout>
        <div style={styles.contentWrapper}>

          <form noValidate autoComplete="off">
            <div style={styles.formContainer}>
              <TextFieldFormComponent
                formStateName="email"
                value={formState.email}
                label="email"
                onChange={onFormInputChange}
                errorState={formError.email}
                validatorMethod={validatorEnum.IS_EMAIL}
                errorText="Please enter a valid email"
                setFormError={onInputError}
                required
              />
              <TextFieldFormComponent
                formStateName="password"
                value={formState.password}
                label="password"
                onChange={onFormInputChange}
                errorState={formError.password}
                validatorMethod={validatorEnum.IS_NOT_EMPTY}
                errorText="Please enter a password"
                setFormError={onInputError}
                type="password"
                required
              />
            </div>

            <Link to="/sign-up">
              <p style={styles.redirectLink}>New? Create an account</p>
            </Link>

            <div style={styles.buttonWrapper}>
              <PrimaryButtonComponent onClick={handleSubmit} buttonText="Login" />
            </div>
          </form>
          <DialogComponent
            dialogTitle="Incorrect login credentials"
            dialogText={dialogText}
            closeBtnText="close"
            onCloseCallBack={handleDialogClose}
            dialogOpen={dialogOpen}
          />
        </div>
      </LoginSignupLayout>
    </>
  );
};

export default LoginPage;
