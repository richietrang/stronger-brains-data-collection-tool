import React, { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import TextField from '@material-ui/core/TextField';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import DialogComponent from '../components/DialogComponent';
import axios from 'axios';
import { paths } from '../server/paths';

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

const NewParticipantGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupDescription, setGroupDescription] = useState('');
  const [groupDescriptionError, setGroupDescriptionError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  function groupNameChange(event) {
    setGroupName(event.target.value);
  }

  function onGroupDescriptionChange(event) {
    setGroupDescription(event.target.value);
  }

  function handleSubmit() {
    if (groupName && groupDescription) {
      const newParticipantGroup = {
        group_name: groupName,
        group_description: groupDescription,
      }
      axios.post(paths.addParticipantGroup(), newParticipantGroup)
        .then(() => {
          setDialogOpen(true);
        })
        .catch(err => {
          alert(err);
        });
    }

    groupName ? setGroupNameError(false) : setGroupNameError(true);
    groupDescription ? setGroupDescriptionError(false) : setGroupDescriptionError(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return (
    <>
      <HeaderComponent headerText="New Participant Group" enableBackButton />
      <div style={styles.contentWrapper}>
        <form noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Group Name"
            color="secondary"
            onChange={groupNameChange}
            fullWidth
            required
            error={groupNameError}
            helperText={groupNameError ? 'Empty Field!' : ''}
          />
          <TextField
            id="standard-basic"
            label="Group Description"
            color="secondary"
            onChange={onGroupDescriptionChange}
            error={groupDescriptionError}
            helperText={groupDescriptionError ? 'Empty Field!' : ''}
            fullWidth
            required 
            />
          <div style={styles.buttonWrapper}>
            <PrimaryButtonComponent onClick={handleSubmit} buttonText="Create Participant Group" />
          </div>
        </form>
        <DialogComponent
          dialogTitle="Participant group successfully created"
          dialogText={`Participant group ${groupName} has been added.`}
          closeBtnText="close"
          backButtonText="Participants page"
          onCloseCallBack={handleDialogClose}
          dialogOpen={dialogOpen}
        />
      </div>
    </>
  );
};

export default NewParticipantGroupPage;
