import React, { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import TextField from '@material-ui/core/TextField';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import SelectFormComponent from '../components/forms/SelectFormComponent';
import axios from 'axios';
import { paths } from '../server/paths';
import useGetParticipantGroups from '../hooks/useGetParticipantGroups';
import DialogComponent from '../components/DialogComponent';

const styles = {
  contentWrapper: {
    padding: '0 40px',
    marginTop: '70px',
  },
  buttonWrapper: {
    display: 'flex',
    marginTop: '20px',
  },
}

const NewParticipantPage = () => {
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [participantGroup, setParticipantGroup] = useState('');
  const [participantGroupError, setParticipantGroupError] = useState(false);
  const [groupAorB, setGroupAorB] = useState('');
  const [groupAorBError, setGroupAorBError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const participantGroups = useGetParticipantGroups();

  function onGroupAorBChange(event) {
    setGroupAorB(event.target.value);
  }

  const onParticipantGroupSelected = (event) => {
    setParticipantGroup(event.target.value);
  }

  function onFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function onLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleSubmit() {
    if (firstName && lastName && participantGroup && groupAorB) {
      const newParticipant = {
        group_name: participantGroup,
        first_name: firstName,
        last_name: lastName,
        group_a_or_b: groupAorB,
      }
      axios.post(paths.addParticipant(), newParticipant)
        .then(() => {
          setDialogOpen(true);
        })
        .catch(err => {
          alert(err);
        });
    }
    firstName ? setFirstNameError(false) : setFirstNameError(true);
    lastName ? setLastNameError(false) : setLastNameError(true);
    participantGroup ? setParticipantGroupError(false) : setParticipantGroupError(true);
    groupAorB ? setGroupAorBError(false) : setGroupAorBError(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return (
    <>
      <HeaderComponent headerText="New Participant" enableBackButton />
      <div style={styles.contentWrapper}>
        <SelectFormComponent
          required
          label="Participant Group"
          onParticipantGroupSelected={onParticipantGroupSelected}
          selectOptions={participantGroups.map(participantGroup => participantGroup.group_name)}
          onSelected={onParticipantGroupSelected}
          errorState={participantGroupError} />
        <form noValidate autoComplete="off">
          <TextField
            label="First Name"
            color="secondary"
            onChange={onFirstNameChange}
            fullWidth
            required
            error={firstNameError}
            helperText={firstNameError ? 'Empty Field!' : ''}
          />
          <TextField
            label="Last Name"
            color="secondary"
            onChange={onLastNameChange}
            error={lastNameError}
            helperText={lastNameError ? 'Empty Field!' : ''}
            fullWidth
            required
          />
          <SelectFormComponent
            required
            label="Group A or B?"
            onParticipantGroupSelected={onParticipantGroupSelected}
            selectOptions={['A', 'B']}
            onSelected={onGroupAorBChange}
            errorState={groupAorBError} />
          <div style={styles.buttonWrapper}>
            <PrimaryButtonComponent onClick={handleSubmit} buttonText="Add Participant" />
          </div>
        </form>
        <DialogComponent
          dialogTitle="Participant successfully added"
          dialogText={`Participant ${firstName} ${lastName} was added to group ${participantGroup}.`}
          closeBtnText="close"
          backButtonText="Participants page"
          onCloseCallBack={handleDialogClose}
          dialogOpen={dialogOpen}
        />
      </div>
    </>
  );
};

export default NewParticipantPage;
