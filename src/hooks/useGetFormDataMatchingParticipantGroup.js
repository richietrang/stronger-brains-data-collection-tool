import { useEffect, useState } from 'react';
import { paths } from '../server/paths';
import axios from 'axios';

export default (participantGroupId, formName) => {
  const [formData, setFormData] = useState([]);
  
  const getFormDataMatchingParticipantGroup = (participantGroupId, formName) => {
    axios.get(paths.getFormDataMatchingParticipantGroup(participantGroupId, formName))
    .then((res) => {
      setFormData(res.data);
    })
    .catch(err => {
      alert(err);
    });
  };

  useEffect(() => {
    getFormDataMatchingParticipantGroup(participantGroupId, formName);
  }, []);

  return formData;
}
