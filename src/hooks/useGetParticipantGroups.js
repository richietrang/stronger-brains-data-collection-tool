import { useEffect, useState } from 'react';
import { paths } from '../server/paths';
import axios from 'axios';

export default () => {
  const [participantGroups, setParticipantGroups] = useState([]);
  
  const getParticipantGroups = () => {
    axios.get(paths.getAllParticipantGroups())
    .then((res) => {
      setParticipantGroups(res.data);
    })
    .catch(err => {
      alert(err);
    });
  };

  useEffect(() => {
    getParticipantGroups();
  }, []);

  return participantGroups;
}
