import { baseURL } from './serverConfig';

export const paths = {
  getParticipantsByGroupId: (groupId) => {
    return `${baseURL}/participant-groups/get-participants-by-group-id/${groupId}`;
  },
  getAllParticipantGroups: () => {
    return `${baseURL}/participant-groups/`;
  },
  addParticipantGroup: () => {
    return `${baseURL}/participant-groups/add/`;
  },
  addParticipant: () => {
    return `${baseURL}/participants/add/`;
  },
  getParticipantById: (participantId) => {
    return `${baseURL}/participants/get-by-id/${participantId}`;
  },
  updateParticipantGroupById: (participantGroupId) => {
    return `${baseURL}/participant-groups/update-by-id/${participantGroupId}`;
  },
  deleteParticipantGroupById: (participantGroupId) => {
    return `${baseURL}/participant-groups/delete-by-id/${participantGroupId}`;
  },
  getFormDataMatchingParticipantGroup: (participantGroupId, dBcollectionBasePath) => {
    return `${baseURL}${dBcollectionBasePath}/get-form-data-from-group-id/${participantGroupId}`;
  },
  getFormDataMatchingParticipantGroupAndParticipantId: (participantGroupId, participantId, dBcollectionBasePath) => {
    return `${baseURL}${dBcollectionBasePath}/${participantGroupId}/${participantId}`;
  },
  updateFormDataMatchingParticipantGroupAndParticipantId: (participantGroupId, participantId, dBcollectionBasePath) => {
    return `${baseURL}${dBcollectionBasePath}/update/${participantGroupId}/${participantId}`;
  },
  addUser: () => {
    return `${baseURL}/users/add`;
  },
  getUserById: (userId) => {
    return `${baseURL}/users/${userId}`;
  },
  updateUserDetails: (userId) => {
    return `${baseURL}/users/update/${userId}`;
  },
  updateUserPassword: (userId) => {
    return `${baseURL}/users/update-password/${userId}`;
  },
  login: () => {
    return `${baseURL}/users/login`;
  },
  inductionIntakePage: () => {
    return `${baseURL}${dBcollectionBasePath.inductionIntakeForm}`;
  },
  preStudyDASS21Page: () => {
    return `${baseURL}${dBcollectionBasePath.preStudyDASS21}`;
  },
  preStudyMyStrategiesQuestionnairePage: () => {
    return `${baseURL}${dBcollectionBasePath.preStudyMyStrategiesQuestionnaire}`;
  },
  aceQuestionnairePage: () => {
    return `${baseURL}${dBcollectionBasePath.aceQuestionnaire}`;
  },
  firstInStudyDASS21Page: () => {
    return `${baseURL}${dBcollectionBasePath.firstInStudyDASS21}`;
  },
  secondInStudyDASS21Page: () => {
    return `${baseURL}${dBcollectionBasePath.secondInStudyDASS21}`;
  },  
  inStudyASVBQuestionnairePage: () => {
    return `${baseURL}${dBcollectionBasePath.inStudyASVBQuestionnaire}`;
  },  
  inStudyMyStrategiesQuestionnairePage: () => {
    return `${baseURL}${dBcollectionBasePath.inStudyMyStrategiesQuestionnaire}`;
  },
  postStudyASVBQuestionnairePage: () => {
    return `${baseURL}${dBcollectionBasePath.postStudyASVBQuestionnaire}`;
  },
};


export const dBcollectionBasePath = {
  participants: '/participants',
  participantGroups: '/participant-groups',
  inductionIntakeForm: '/induction-intake-form',
  preStudyDASS21: '/pre-study-DASS-21',
  preStudyMyStrategiesQuestionnaire: '/pre-study-my-strategies-questionnaire',
  aceQuestionnaire: '/ace-questionnaire',
  firstInStudyDASS21: '/first-in-study-DASS-21',
  secondInStudyDASS21: '/second-in-study-DASS-21',
  inStudyASVBQuestionnaire: '/in-study-ASVB-Questionnaire',
  inStudyMyStrategiesQuestionnaire: '/in-study-my-strategies-questionnaire',
  postStudyASVBQuestionnaire: '/post-study-asvb-questionnaire',
}

