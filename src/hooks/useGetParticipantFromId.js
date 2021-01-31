import { useEffect, useState } from 'react';
import { paths } from '../server/paths';
import axios from 'axios';

export default (participantId, callBackFunction) => {
  const [participant, setParticipant] = useState([]);
  
  const getParticipantById = (participantId) => {
    axios.get(paths.getParticipantById(participantId))
    .then((res) => {
      setParticipant(res.data);
      callBackFunction(res.data);
    })
    .catch(err => {
      alert(err);
    });
  };

  useEffect(() => {
    getParticipantById(participantId);
  }, []);

  return participant;
}
