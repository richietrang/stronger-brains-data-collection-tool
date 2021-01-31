import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import axios from 'axios';
import { paths } from '../server/paths';
import DialogComponent from '../components/DialogComponent';
import { useAuth } from "../context/auth";
import { Link, Redirect } from "react-router-dom";
import LoginSignupLayout from "./layouts/LoginSignupLayout";

const styles = {
  contentWrapper: {
    padding: '0 30px',
    marginTop: '10px',
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

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [signUpKey, setSignUpKey] = useState('');
  const [signUpKeyError, setSignUpKeyError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { setAuthTokens } = useAuth();

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  function onConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  function onSignUpKeyChange(event) {
    setSignUpKey(event.target.value);
  }

  function onFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function onLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleSubmit() {
    if (firstName && lastName && email && password && signUpKey && (password === confirmPassword)) {
      console.log('everything is good');
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        sign_up_key: signUpKey,
      };
      axios.post(paths.addUser(), newUser)
        .then((res) => {
          if (res.data.status === 201) {
            alert('Successfuly signed up to stronger brains data collection platform.');
            setAuthTokens({ tokens: res.data.token, user: res.data.user });
            setLoggedIn(true);
          } else {
            setDialogOpen(true);
          }
        })
        .catch(err => {
          alert(err);
        });
    }
    firstName ? setFirstNameError(false) : setFirstNameError(true);
    lastName ? setLastNameError(false) : setLastNameError(true);
    email ? setEmailError(false) : setEmailError(true);
    password ? setPasswordError(false) : setPasswordError(true);
    password === confirmPassword ? setConfirmPasswordError(false) : setConfirmPasswordError(true);
    signUpKey ? setSignUpKeyError(false) : setSignUpKeyError(true);

  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return (
    <>
      { isLoggedIn &&
        <Redirect to="/" />
      }
      <LoginSignupLayout>
        <div style={styles.contentWrapper}>

          <form noValidate autoComplete="off">

            <div style={styles.formContainer}>
              <TextField
                label="Email"
                color="secondary"
                onChange={onEmailChange}
                fullWidth
                required
                error={emailError}
                helperText={emailError ? 'Empty Field!' : ''}
              />
              <TextField
                label="Password"
                color="secondary"
                onChange={onPasswordChange}
                fullWidth
                required
                error={passwordError}
                helperText={passwordError ? 'Empty Field!' : ''}
                type="password"
              />

              <TextField
                label="Confirm Password"
                color="secondary"
                onChange={onConfirmPasswordChange}
                fullWidth
                required
                error={confirmPasswordError}
                helperText={confirmPasswordError ? 'Passwords do not match' : ''}
                type="password"
              />

              <TextField
                label="First Name"
                color="secondary"
                onChange={onFirstNameChange}
                error={firstNameError}
                helperText={firstNameError ? 'Empty Field!' : ''}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                color="secondary"
                onChange={onLastNameChange}
                fullWidth
                required
                error={lastNameError}
                helperText={lastNameError ? 'Empty Field!' : ''}
              />
              <TextField
                label="Stronger Brains Sign Up Key"
                color="secondary"
                onChange={onSignUpKeyChange}
                error={signUpKeyError}
                helperText={signUpKeyError ? 'Empty Field!' : ''}
                fullWidth
                required
              />
            </div>
          </form>

          <Link to="/login">
            <p style={styles.redirectLink}>Already have an account? Login</p>
          </Link>

          <div style={styles.buttonWrapper}>
            <PrimaryButtonComponent onClick={handleSubmit} buttonText="Signup" />
          </div>
          <DialogComponent
            dialogTitle="Sign up key is incorrect"
            dialogText={`Please contact stronger brains for signup issues.`}
            closeBtnText="close"
            onCloseCallBack={handleDialogClose}
            dialogOpen={dialogOpen}
          />
        </div>

      </LoginSignupLayout>


    </>
  );
};

export default SignUpPage;
