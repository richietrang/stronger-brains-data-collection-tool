import React, { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import TextField from '@material-ui/core/TextField';
import PrimaryButtonComponent from '../components/PrimaryButtonComponent';
import axios from 'axios';
import useGetParticipantsFromGroupId from '../hooks/useGetParticipantsFromGroupId';
import DialogComponent from '../components/DialogComponent';
import { paths } from '../server/paths';

const styles = {
  contentWrapper: {
    padding: '0 40px',
    marginTop: '100px',
  },
  saveChangesButtonWrapper: {
    marginLeft: '20px',
  },
  buttonsContainer: {
    display: 'flex',
    marginTop: '20px',
  }
}

const EditParticipantGroupPage = (props) => {
  const [groupName, setGroupName] = useState('');
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupDescription, setGroupDescription] = useState('');
  const [groupDescriptionError, setGroupDescriptionError] = useState(false);
  const [saveChangeDialogOpen, setSaveChangeDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);

  useGetParticipantsFromGroupId(props.match.params.id, group => {
    setGroupName(group.group_name);
    setGroupDescription(group.group_description);
  });

  function groupNameChange(event) {
    setGroupName(event.target.value);
  }

  function onGroupDescriptionChange(event) {
    setGroupDescription(event.target.value);
  }

  function handleSaveChangeDialogClose() {
    setSaveChangeDialogOpen(false);
  }

  function onSaveChanges() {
    if (groupName && groupDescription) {
      const newParticipantGroup = {
        group_name: groupName,
        group_description: groupDescription,
      }
      axios.post(paths.updateParticipantGroupById(props.match.params.id, newParticipantGroup))
        .then(() => {
          setSaveChangeDialogOpen(true);
        })
        .catch(err => {
          alert(err);
        });
    }

    groupName ? setGroupNameError(false) : setGroupNameError(true);
    groupDescription ? setGroupDescriptionError(false) : setGroupDescriptionError(true);
  }

  function onDeleteGroup() {
    axios.post(paths.deleteParticipantGroupById(props.match.params.id))
      .then(() => {
        setDeleteGroupDialogOpen(true);
      })
      .catch(err => {
        alert(err);
      });
  }

  return (
    <>
      <HeaderComponent headerText="Edit Group Details" enableBackButton />
      <div style={styles.contentWrapper}>
        <form noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Group Name"
            color="secondary"
            onChange={groupNameChange}
            fullWidth
            required
            value={groupName}
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
            value={groupDescription}
            required
          />
          <div style={styles.buttonsContainer}>
            <PrimaryButtonComponent onClick={onDeleteGroup} buttonText="Delete group" secondaryColor />
            <div style={styles.saveChangesButtonWrapper}>
              <PrimaryButtonComponent onClick={onSaveChanges} buttonText="Save Changes" />
            </div>
          </div>
        </form>
        <DialogComponent
          dialogTitle="Participant group successfully edited"
          dialogText={`Group name has changed to ${groupName} and description is: ${groupDescription}.`}
          closeBtnText="close"
          backButtonText="Participants page"
          onCloseCallBack={handleSaveChangeDialogClose}
          dialogOpen={saveChangeDialogOpen}
        />

        <DialogComponent
          dialogTitle="Participant group successfully deleted"
          dialogText={`Group ${groupName} has been deleted from the system.`}
          backButtonText="Participants page"
          dialogOpen={deleteGroupDialogOpen}
        />
      </div>
    </>
  );
};

export default EditParticipantGroupPage;
