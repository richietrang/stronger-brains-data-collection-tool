import React, { useState } from 'react';
import FiveStageSummaryHeaderComponent from '../components/FiveStageSummaryHeaderComponent';
import H1TitleComponent from '../components/H1TitleComponent';
import ThickListItemButtonComponent from '../components/ThickListItemButtonComponent';
import { Link } from 'react-router-dom';
import useGetParticipantFromId from '../hooks/useGetParticipantFromId';
import { withRouter } from 'react-router-dom';
import { dBcollectionBasePath } from '../server/paths';

const styles = {
  contentWrapper: {
    padding: '0 10%',
    marginTop: '260px',
    marginBottom: '80px',
  },
  formSummaryWrapper: {
    marginTop: '30px',
  },
  noLinkTextDecoration: {
    textDecoration: 'none',
    color: 'black',
  },
};

const ParticipantProfilePage = (props) => {
  const { participantGroupId, participantId, participantFirstName, participantLastName } = props.location.state;
  const [stageNumber, setStageNumber] = useState(1);
  const [formSummaryDataOrganisedByStage, setFormSummaryDataOrganisedByStage] = useState([]);

  function setParticipantData(participant) {
    setFormSummaryDataOrganisedByStage(organiseDatabaseSummaryDataToStages(participant.summary_data));
  }

  useGetParticipantFromId(participantId, setParticipantData);
  return (
    <>
      <FiveStageSummaryHeaderComponent
        headerText={`${participantFirstName} ${participantLastName}`}
        onStageChangeCallBack={setStageNumber}
        enableBackButton
      />
      <div style={styles.contentWrapper}>
        <H1TitleComponent titleText={`Stage ${stageNumber} Forms`}/>
        <div style={styles.formSummaryWrapper}>
          {
            formSummaryDataOrganisedByStage.length > 0 ? formSummaryDataOrganisedByStage[stageNumber - 1].map(formSummary => {
              return (
                <Link
                  to={{
                    pathname: formSummary.route,
                    state: {
                      participantGroupId: participantGroupId,
                      participantId: participantId,
                      title: formSummary.formName,
                      route: formSummary.route,
                    }
                  }}
                  style={styles.noLinkTextDecoration}
                  key={formSummary.formName}
                >
                  <ThickListItemButtonComponent 
                    text={formSummary.formName}
                    greenBackground={formSummary.formCompleted}
                  />
                </Link>
              );
            }) : null
          }
        </div>
      </div>
    </>
  );


  function organiseDatabaseSummaryDataToStages(summaryData) {
    const stageOneSummaryData = [
      {
        formName: "Induction Intake",
        formCompleted: summaryData.induction_intake_completed,
        route: dBcollectionBasePath.inductionIntakeForm,
      },
      {
        formName: "Pre-study DASS-21",
        formCompleted: summaryData.pre_study_dass21_completed,
        route: dBcollectionBasePath.preStudyDASS21,
      },
      {
        formName: "Pre-study My Strategies Questionnaire",
        formCompleted: summaryData.pre_study_my_strategies_questionnaire_completed,
        route: dBcollectionBasePath.preStudyMyStrategiesQuestionnaire,
      },
      {
        formName: "ACE Questionnaire",
        formCompleted: summaryData.pre_study_ace_questionnaire_completed,
        route: dBcollectionBasePath.aceQuestionnaire,
      },
    ];

    const stageTwoSummaryData = [
      {
        formName: "Mid-study Stage 2 DASS-21",
        formCompleted: summaryData.mid_study_stage_2_dass21_completed,
        route: dBcollectionBasePath.firstInStudyDASS21,
      },
    ];

    const stageThreeSummaryData = [
      {
        formName: "Mid-study Stage 3 DASS-21",
        formCompleted: summaryData.mid_study_stage_3_dass21_completed,
        route: dBcollectionBasePath.secondInStudyDASS21,
      },
    ];

    const stageFourSummaryData = [
      {
        formName: "Mid-study ASVB Questionnaire",
        formCompleted: summaryData.mid_study_asvb_questionnaire_completed,
        route: dBcollectionBasePath.inStudyASVBQuestionnaire,
      },
      {
        formName: "Mid-study My Strategies Questionnaire",
        formCompleted: summaryData.mid_study_my_strategies_questionnaire_completed,
        route: dBcollectionBasePath.inStudyMyStrategiesQuestionnaire,
      },
    ];  

    const stageFiveSummaryData = [
      {
        formName: "Post-study ASVB Questionnaire",
        formCompleted: summaryData.post_study_asvb_questionnaire_completed,
        route: dBcollectionBasePath.postStudyASVBQuestionnaire,
      },
    ]; 
    return [stageOneSummaryData, stageTwoSummaryData, stageThreeSummaryData, stageFourSummaryData, stageFiveSummaryData];
  }
}

export default withRouter(ParticipantProfilePage);
