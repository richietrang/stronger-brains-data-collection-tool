import React, { useState } from 'react';
import axios from 'axios';
import { paths } from '../server/paths';

const CreatePage = () => {
  const [participantGroup, setParticipantGroup] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function onParticipantGroupChange(event) {
    setParticipantGroup(event.target.value);
  }

  function onFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function onLastNameChange(event) {
    setLastName(event.target.value);
  }
  
  function handleSubmit(event) {
    const newParticipant = {
      participant_group: participantGroup,
      first_name: firstName,
      last_name: lastName,
    }
    axios.post(paths.addParticipant(), newParticipant)
      .then(() => {
        alert('user added!');
      })
      .catch(err => {
        alert(err);
      });
  }
  
  return (
    <div>
      <h1>Create a new participant</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Participant Group:
          <input type="text" value={participantGroup} onChange={onParticipantGroupChange}/>
        </label>
        <label>
          First Name
          <input type="text" value={firstName} onChange={onFirstNameChange}/>
        </label>
        <label>
          Last Name
          <input type="text" value={lastName} onChange={onLastNameChange}/>
        </label>
        <input type="submit" value="Submit" onSubmit={handleSubmit}/>
      </form>

      <p>{participantGroup}</p>
      <p>{firstName}</p>
      <p>{lastName}</p>
    </div>
  );
};


export default CreatePage;