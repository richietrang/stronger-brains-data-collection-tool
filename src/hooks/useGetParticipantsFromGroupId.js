import { useEffect, useState } from 'react';
import axios from 'axios';
import { paths } from '../server/paths';

export default (participantGroupId, setParticipantsFromGroupCallBackFn) => {
  const [participantGroup, setParticipantGroup] = useState({});

  const getParticipantGroupById = (participantGroupId) => {
    axios.get(paths.getParticipantsByGroupId(participantGroupId))
    .then((res) => {
      setParticipantGroup(res.data);
      setParticipantsFromGroupCallBackFn(res.data);
    })
    .catch(err => {
      alert(err);
    });
  };

  useEffect(() => {
    getParticipantGroupById(participantGroupId);
  }, []);

  return participantGroup;
}
