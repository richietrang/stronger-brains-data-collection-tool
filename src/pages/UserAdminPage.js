import React, { useState, useEffect } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import H3TitleComponent from '../components/H3TitleComponent';
import axios from 'axios';
import TextFieldFormComponent from '../components/forms/TextFieldFormComponent';
import DialogComponent from '../components/DialogComponent';
import { validatorEnum } from '../utility/validatorEnum';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";
import NewSelectFormComponent from '../components/forms/NewSelectFormComponent';
import useGetParticipantGroups from '../hooks/useGetParticipantGroups';
import { dBcollectionBasePath, paths } from '../server/paths';
import FileSaver from 'file-saver';
const { Parser } = require('json2csv');

const formsToDownload = [
  {
    route: dBcollectionBasePath.inductionIntakeForm,
    name: 'Stage 1: Induction Intake Form',
  },
  {
    route: dBcollectionBasePath.preStudyDASS21,
    name: 'Stage 1: Pre-Study DASS 21',
  },
  {
    route: dBcollectionBasePath.preStudyMyStrategiesQuestionnaire,
    name: 'Stage 1: Pre-Study My Strategies Questionnaire',
  },
  {
    route: dBcollectionBasePath.aceQuestionnaire,
    name: 'Stage 1: Mid-Study ACE Questionnaire',
  },
  {
    route: dBcollectionBasePath.firstInStudyDASS21,
    name: 'Stage 2: First Mid Study DASS-21',
  },
  {
    route: dBcollectionBasePath.secondInStudyDASS21,
    name: 'Stage 3: Second Mid Study DASS-21',
  },
  {
    route: dBcollectionBasePath.inStudyASVBQuestionnaire,
    name: 'Stage 4: First Mid-Study ASVB Questionnaire',
  },
  {
    route: dBcollectionBasePath.inStudyMyStrategiesQuestionnaire,
    name: 'Stage 4: First Mid-Study My Strategies Questionnaire',
  },
  {
    route: dBcollectionBasePath.postStudyASVBQuestionnaire,
    name: 'Stage 5: Post-Study ASVB Questionnaire',
  },
];

const UserAdminPage = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    downloadFormType: '',
    participantGroup: {},
    formToDownload: {
      route: '',
      name: '',
    }
  });

  const [formError, setFormError] = useState(
    Object.keys(formState).reduce((formErrorState, formStateKey)=> {
      return ({
          ...formErrorState,
          [formStateKey]: false,
      });
    }, {})
  );

  const [editDetailsEnabled, setEditDetailsEnabled] = useState(false);
  const [editPasswordEnabled, setEditPasswordEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { setAuthTokens } = useAuth();
  const participantGroups = useGetParticipantGroups();

  const [modal, setModal] = useState({
    state: false,
    title: '',
    text: '',
  });

  const localStorage = window.localStorage;
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    axios.get(paths.getUserById(userId))
      .then(res => {
        setFormState({
          ...formState,
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
        });
      });
  }, [userId]);

  return (
    <>
      {!isLoggedIn &&
        <Redirect to="/login" />
      }
      <HeaderComponent headerText="User Admin Profile" />
      <div style={styles.contentWrapper}>
        <H3TitleComponent titleText="Your Profile Information" />
        <TextFieldFormComponent
          formStateName="firstName"
          value={formState.firstName}
          label="First Name"
          onChange={onFormInputChange}
          errorState={formError.firstName}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please enter a valid first name"
          setFormError={onInputError}
          disabled={!editDetailsEnabled}
        />

        <TextFieldFormComponent
          formStateName="lastName"
          value={formState.lastName}
          label="Last Name"
          onChange={onFormInputChange}
          errorState={formError.lastName}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please enter a valid last name"
          setFormError={onInputError}
          disabled={!editDetailsEnabled}
        />

        <TextFieldFormComponent
          formStateName="email"
          value={formState.email}
          label="Email"
          onChange={onFormInputChange}
          errorState={formError.email}
          validatorMethod={validatorEnum.IS_EMAIL}
          errorText="Please enter a valid email"
          setFormError={onInputError}
          disabled={!editDetailsEnabled}
        />

      { !editDetailsEnabled && 
        <PrimaryButtonComponent onClick={() => {setEditDetailsEnabled(true)}} buttonText="Edit Info" />
      }

      { editDetailsEnabled && 
        <div style={styles.buttonWrapper}>
          <PrimaryButtonComponent secondaryColor onClick={() => {setEditDetailsEnabled(false)}} buttonText="Cancel" />
          <PrimaryButtonComponent onClick={handleEditDetailsSubmit} buttonText="Update" />
        </div>
      }

      <H3TitleComponent titleText="Change Password" />
      <TextFieldFormComponent
        formStateName="password"
        value={formState.password}
        label="Current Password"
        onChange={onFormInputChange}
        errorState={formError.password}
        validatorMethod={validatorEnum.IS_NOT_EMPTY}
        errorText="Please enter your original password."
        setFormError={onInputError}
        type="password"
        disabled={!editPasswordEnabled}
      />

      <TextFieldFormComponent
        formStateName="newPassword"
        value={formState.newPassword}
        label="New Password"
        onChange={onFormInputChange}
        errorState={formError.newPassword}
        validatorMethod={validatorEnum.IS_MORE_THAN_TEN_CHARS}
        errorText="Please enter a password more than ten characters long"
        setFormError={onInputError}
        type="password"
        disabled={!editPasswordEnabled}
      />

      <TextFieldFormComponent
        formStateName="confirmNewPassword"
        value={formState.confirmNewPassword}
        label="Confirm New Password"
        onChange={onFormInputChange}
        errorState={formError.confirmNewPassword}
        validatorMethod={passwordMatches}
        errorText="Please enter a matching password"
        setFormError={onInputError}
        type="password"
        disabled={!editPasswordEnabled}
      />

      { !editPasswordEnabled && 
        <PrimaryButtonComponent onClick={() => {setEditPasswordEnabled(true)}} buttonText="Edit Password" />
      }

      { editPasswordEnabled && 
        <div style={styles.buttonWrapper}>
          <PrimaryButtonComponent secondaryColor onClick={() => {setEditPasswordEnabled(false)}} buttonText="Cancel" />
          <PrimaryButtonComponent onClick={handleEditPasswordSubmit} buttonText="Update" />
        </div>
      }

      <H3TitleComponent titleText="Administration" />
      <p style={{textAlign: 'left'}}>Download form and user data as a csv</p>
      <NewSelectFormComponent
        label="Form Type"
        formStateName="downloadFormType"
        value={formState.downloadFormType}
        onChange={onFormInputChange}
        errorState={formError.downloadFormType}
        validatorMethod={validatorEnum.IS_NOT_EMPTY}
        errorText=""
        setFormError={onInputError}
        selectOptions={['Participant Data', 'Form Data']}
      />

      <NewSelectFormComponent
        label="Participant Group"
        formStateName="participantGroup"
        value={formState.participantGroup}
        onChange={onFormInputChange}
        errorState={formError.participantGroup}
        validatorMethod={validatorEnum.IS_NOT_EMPTY}
        errorText=""
        setFormError={onInputError}
        selectOptions={participantGroups.map(participantGroup => participantGroup.group_name)}
      />

      { formState.downloadFormType === 'Form Data' &&
        <NewSelectFormComponent
          label="Form Type to Download"
          formStateName="formToDownload"
          value={formState.formToDownload.name}
          onChange={onFormDownloadTypeChange}
          errorState={formError.formToDownload}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please select a form to download"
          setFormError={onInputError}
          selectOptions={formsToDownload.map(form => form.name)}
        />
      }

      <div style={styles.buttonWrapper}>
        <PrimaryButtonComponent onClick={onDownload} buttonText="Download CSV" />
      </div>

      <H3TitleComponent titleText="Logout of Application" />
      <div style={styles.buttonWrapper}>
        <PrimaryButtonComponent onClick={onLogout} buttonText="Logout" />
      </div>
      
      </div>
      {modal.state &&
        <DialogComponent
          dialogTitle={modal.title}
          dialogText={modal.text}
          closeBtnText="Close"
          dialogOpen={modal.state}
          onCloseCallBack={closeModal}
        />
        }
    </>
  );

  function closeModal() {
    setModal({
      ...modal,
      state: false,
    });
  }

  function onFormInputChange(event, formStateField) {
    setFormState({
      ...formState,
      [formStateField]: event.target.value,
    });
  }

  function onInputError(formStateField, isError) {
    setFormError({
      ...formError,
      [formStateField]: isError,
    });
  }

  function passwordMatches(input) {
    if (input !== formState.newPassword) {
      return false;
    }
    return true;
  }

  function checkRequiredFieldsSet(...requiredFields) {
    let allRequiredFieldsSet = true;
    let updatedFormErrorState = formError;

    requiredFields.forEach(formField => {
      if (!formState[formField] || (Object.keys(formState[formField]).length === 0 && typeof formState[formField] === 'object')) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      } else if (formState[formField].label && formState[formField].rating === 0) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      }
    });
    setFormError({ ...updatedFormErrorState });
    return allRequiredFieldsSet;
  }

  function handleEditDetailsSubmit(e) {
    e.preventDefault();
    setEditDetailsEnabled(false);
    if (checkRequiredFieldsSet('firstName', 'lastName', 'email')) {
      if (!Object.values(formError).includes(true)) {
        axios.post(paths.updateUserDetails(userId), {
          first_name: formState.first_name,
          last_name: formState.lastName,
          email: formState.email,
        })
        .then((res) => {
          setModal({
            state: true,
            title: 'User details succesfully updated',
            text: `First name is ${formState.firstName}. Last name is ${formState.lastName}. Email is ${formState.email}`,
          });
        })
        .catch(err => {
          alert(err);
        });

      }
    } else {
      setModal({
        state: true,
        title: 'Oh snap! ',
        text: `Please check all the fields are valid and not empty.`,
      });
    }
  }

  function handleEditPasswordSubmit(e) {
    e.preventDefault();
    setEditPasswordEnabled(false);
    if (checkRequiredFieldsSet('password', 'newPassword', 'confirmNewPassword')) {
      if (!Object.values(formError).includes(true)) {
        axios.post(paths.updateUserPassword(userId), {
          password: formState.password,
          newPassword: formState.newPassword,
        })
        .then((res) => {
          if (res.data.err) {
            setModal({
              state: true,
              title: 'Oh Snap!',
              text: `Your password is incorrect. Please contact Stronger Brains for help.`,
            });
          } else {
            setFormState({
              ...formState,
              password: '',
              newPassword: '',
              confirmNewPassword: '',
            })
            setModal({
              state: true,
              title: 'Success!',
              text: `User password successfully updated`,
            });
          }

        })
        .catch(err => {
          alert(err);
        });

      }
    } else {
      setModal({
        state: true,
        title: 'Oh snap! ',
        text: `Please check all the password fields are valid and not empty.`,
      });
    }
  }

  function onLogout() {
    setAuthTokens({ tokens: '', user: '' });
    setIsLoggedIn(false);
  }

  function onDownload() {
    const selectedGroup = participantGroups.filter(participantGroup => participantGroup.group_name === formState.participantGroup)[0];
    let path;
    if (formState.downloadFormType === 'Form Data' && checkRequiredFieldsSet('participantGroup', 'formToDownload')) {
      path = paths.getFormDataMatchingParticipantGroup(selectedGroup._id, formState.formToDownload.route)
    } else if (formState.downloadFormType === 'Participant Data' && checkRequiredFieldsSet('participantGroup')) {
    path = paths.getParticipantsByGroupId(selectedGroup._id);
    }

    if (path) {
      axios.get(path)
      .then((res) => {
        setTimeout(() => {
          const json2csvParser = new Parser({ unwind: paths, unwindBlank: true, flatten: true, flattenSeparator: '__' });
          const csv = json2csvParser.parse(res.data);
          const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          FileSaver.saveAs(csvData, 'data.csv');
        }, 0);
      })
      .catch(err => {
        alert(err);
      });
    }
  }

  function onFormDownloadTypeChange(event) {
    if (event.target.value) {
      const formToDownload = formsToDownload.filter(form => form.name === event.target.value)[0];
      setFormState({
        ...formState,
        formToDownload: formToDownload,
      });
    } else {
      setFormState({
        ...formState,
        formToDownload: '',
      });
    }
  }
};

const styles = {
  contentWrapper: {
    padding: '0 10%',
    margin: '75px 0 100px 0',
  },
  buttonWrapper: {
    display: 'flex',
    marginTop: '20px',
    justifyContent: 'space-between',
  },
}

export default UserAdminPage;
