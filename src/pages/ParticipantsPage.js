import React, { useState } from 'react';
import SquareButtonComponent from '../components/SquareButtonComponent';
import HeaderComponent from '../components/HeaderComponent';
import SelectFormComponent from '../components/forms/SelectFormComponent';
import { iconUrls } from '../assets/icons/iconUrls';
import { Link } from 'react-router-dom';
import useGetParticipantGroups from '../hooks/useGetParticipantGroups';
import ParticipantSummaryButtonComponent from '../components/ParticipantSummaryButtonComponent';
import { paths } from '../server/paths';
import axios from 'axios';

const styles = {
  contentWrapper: {
    padding: '0 10%',
    margin: '75px 0 100px 0',
  },
  squareButtonsContainer: {
    display: 'flex',
    margin: '20px 0',
  },
  noLinkTextDecoration: {
    textDecoration: 'none',
    color: 'black',
  },
}

const ParticipantsPage = () => {
  const onParticipantGroupSelected = (event) => {
    if (event.target.value) {
      const selectedGroup = participantGroups.filter(participantGroup => participantGroup.group_name === event.target.value)[0];
      setParticipantGroupId(selectedGroup._id);

      axios.get(paths.getParticipantsByGroupId(selectedGroup._id))
      .then((res) => {
        setParticipants(res.data);
      });
    }
  };

  const [participantGroupId, setParticipantGroupId] = useState('');
  const [participants, setParticipants] = useState([]);
  const participantGroups = useGetParticipantGroups();
  return (
    <>
      <HeaderComponent headerText="Participants" />
      <div style={styles.contentWrapper}>
        <SelectFormComponent
          onSelected={onParticipantGroupSelected}
          label="Participant Group"
          selectOptions={participantGroups.map(participantGroup => participantGroup.group_name)}
        />
        <div style={styles.squareButtonsContainer}>
          {participantGroupId &&
            <Link to={`/edit-participant-group/${participantGroupId}`} style={styles.noLinkTextDecoration}>
              <SquareButtonComponent
                iconURL={iconUrls.editGroup}
                iconAltText="Edit group icon"
                buttonText="Edit group"
              />
            </Link>
          }
          <Link to="/new-participant-group" style={styles.noLinkTextDecoration}>
            <SquareButtonComponent
              iconURL={iconUrls.newGroup}
              iconAltText="new group icon"
              buttonText="New Group"
            />
          </Link>
          <Link to="/new-participant" style={styles.noLinkTextDecoration}>
            <SquareButtonComponent
              iconURL={iconUrls.addParticipant}
              iconAltText="Add participant icon"
              buttonText="Add Participant"
            />
          </Link>
        </div>
        {participants.map((participant, index) => {
          return (
            <Link
              to={{
                pathname: `/participant-profile/${participant._id}`,
                state: {
                  participantGroupId: participantGroupId,
                  participantId: participant._id,
                  participantFirstName: participant.first_name,
                  participantLastName: participant.last_name,
                }
              }}
              style={styles.noLinkTextDecoration}
              key={`${participant.first_name} ${participant.last_name} ${index}`}
            >
              <ParticipantSummaryButtonComponent
                firstName={participant.first_name}
                lastName={participant.last_name}
                stageCompletion={getFormStageCompletion(participant.summary_data)}
              />
            </Link>

          );
        })}
      </div>
    </>
  );

  function getFormStageCompletion(summaryData) {
    return [
      summaryData.induction_intake_completed && summaryData.pre_study_dass21_completed && summaryData.pre_study_my_strategies_questionnaire_completed && summaryData.pre_study_ace_questionnaire_completed,
      summaryData.mid_study_stage_2_dass21_completed,
      summaryData.mid_study_stage_3_dass21_completed,
      summaryData.mid_study_asvb_questionnaire_completed && summaryData.mid_study_my_strategies_questionnaire_completed,
      summaryData.post_study_asvb_questionnaire_completed,
    ];
  }
};

export default ParticipantsPage;
