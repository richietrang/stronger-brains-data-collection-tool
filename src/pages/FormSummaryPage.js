import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import ThinListItemButtonComponent from '../components/ThinListItemButtonComponent';
import H3TitleComponent from '../components/H3TitleComponent';
import useGetFormDataMatchingParticipantGroup from '../hooks/useGetFormDataMatchingParticipantGroup';
import useGetParticipantsFromGroupId from '../hooks/useGetParticipantsFromGroupId';

const styles = {
  contentWrapper: {
    padding: '0 10%',
    marginTop: '50px',
    marginBottom: '80px',
  },
  noLinkTextDecoration: {
    textDecoration: 'none',
    color: 'black',
  },
};

const FormSummaryPage = (props) => {
  const { formEndpointBaseURL, participantGroupId, formName } = props.location.state;
  const [participants, setParticipants] = useState([]);
  useGetParticipantsFromGroupId(participantGroupId, setParticipants);
  const participantsWithCompletedForm = useGetFormDataMatchingParticipantGroup(participantGroupId, formEndpointBaseURL);
  const participantsWithIncompleteCompleteForm = getParticipantsWithIncompleteForms(participants, participantsWithCompletedForm);
  function getParticipantsWithIncompleteForms(participants, participantsWithCompletedForm) {
    const participantIdsWithCompletedForm = participantsWithCompletedForm.map(participantFormData => {
      return participantFormData.participant_id;
    });

    return participants.filter(participant => {
      return !participantIdsWithCompletedForm.includes(participant._id);
    });
  }

  return (
    <>
      <HeaderComponent 
        headerText={formName} 
        enableBackButton
      />
      <div style={styles.contentWrapper}>

      { participantsWithIncompleteCompleteForm.length > 0 &&
        <H3TitleComponent titleText='Incomplete Forms' />
      }
      {
        participantsWithIncompleteCompleteForm.map((participantFormData, index) => {
          return (
            <Link
              to={{
                pathname: `${formEndpointBaseURL}`,
                state: {
                  participantGroupId: participantGroupId,
                  participantId: participantFormData._id,
                  route: formEndpointBaseURL,
                  title: formName,
                }
              }}
              style={styles.noLinkTextDecoration}
            >
              <ThinListItemButtonComponent
                text={`${participantFormData.first_name} ${participantFormData.last_name}`}
                key={`${participantFormData.first_name} ${participantFormData.last_name} ${index}`}
              />
            </Link>
          );
        })
      }

      { participantsWithCompletedForm.length > 0 &&
        <H3TitleComponent titleText='Completed Forms' />
      }
      {
        participantsWithCompletedForm.map((participantFormData, index) => {
          return (
            <Link
            to={{
              pathname: `${formEndpointBaseURL}`,
              state: {
                participantGroupId: participantGroupId,
                participantId: participantFormData.participant_id,
                route: formEndpointBaseURL,
                title: formName,
              }
            }}
            style={styles.noLinkTextDecoration}
          >
            <ThinListItemButtonComponent
              text={`${participantFormData.participant_first_name} ${participantFormData.participant_last_name}`}
              key={`${participantFormData.participant_first_name} ${participantFormData.participant_last_name} ${index}`}
              greenHighlighted={true}
            />
          </Link>
          );
        })
      }
      </div>
    </>
  );
};

export default withRouter(FormSummaryPage);
