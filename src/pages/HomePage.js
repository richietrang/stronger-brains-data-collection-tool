import React, { useState } from 'react';
import FiveStageSummaryHeaderComponent from '../components/FiveStageSummaryHeaderComponent';
import H1TitleComponent from '../components/H1TitleComponent';
import useGetParticipantGroups from '../hooks/useGetParticipantGroups';
import SelectFormComponent from '../components/forms/SelectFormComponent';
import ThickListItemButtonComponent from '../components/ThickListItemButtonComponent';
import { Link } from 'react-router-dom';
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


const HomePage = () => {
  const [stageNumber, setStageNumber] = useState(1);
  const participantGroups = useGetParticipantGroups();
  const [selectedParticipantGroupId, setSelectedParticipantGroupId] = useState('');
  const [formSummaryDataOrganisedByStage, setFormSummaryDataOrganisedByStage] = useState([]);
  const [numberOfParticipantsInGroup, setNumberOfParticipantsInGroup] = useState(0);

  const onParticipantGroupSelected = (event) => {
    if (event.target.value) {
      const selectedGroup = participantGroups.filter(participantGroup => participantGroup.group_name === event.target.value)[0];
      setSelectedParticipantGroupId(selectedGroup._id);
      setNumberOfParticipantsInGroup(selectedGroup.summary_data.total_participants);
      organiseDatabaseSummaryDataToStages(selectedGroup.summary_data);
    }
  };
  return (
    <>
      <FiveStageSummaryHeaderComponent
        headerText="Participant Group Summary"
        onStageChangeCallBack={setStageNumber}
      />
      <div style={styles.contentWrapper}>
        <H1TitleComponent titleText={`Stage ${stageNumber} Summary`}/>

        <SelectFormComponent
          onSelected={onParticipantGroupSelected}
          label="Participant Group"
          selectOptions={participantGroups.map(participantGroup => participantGroup.group_name)}
        />
        
        {
          formSummaryDataOrganisedByStage.length > 0 && 
          <div style={styles.formSummaryWrapper}>
              {formSummaryDataOrganisedByStage[stageNumber - 1].map(formSummary => {
              return (
                <Link
                  to={{
                    pathname: '/form-summary-page',
                    state: {
                      participantGroupId: selectedParticipantGroupId,
                      formName: formSummary.formName,
                      formEndpointBaseURL: formSummary.formEndpointBaseURL,
                    }
                  }}
                  style={styles.noLinkTextDecoration}
                  key={formSummary.formName}
                >
                  <ThickListItemButtonComponent 
                    text={formSummary.formName}
                    greenBackground={numberOfParticipantsInGroup - formSummary.numberFormsCompleted === 0}
                    summaryStatisticText={`${formSummary.numberFormsCompleted}/${numberOfParticipantsInGroup}`}
                  />
                </Link>
              );
            })
          }
          </div>
        }
      </div>
    </>
  );

  function organiseDatabaseSummaryDataToStages(summaryData) {
    const stageOneSummaryData = [
      {
        formName: "Induction Intake",
        numberFormsCompleted: summaryData.total_induction_intake_filled,
        formEndpointBaseURL: dBcollectionBasePath.inductionIntakeForm,
      },
      {
        formName: "Pre-study DASS-21",
        numberFormsCompleted: summaryData.total_pre_study_dass21_filled,
        formEndpointBaseURL: dBcollectionBasePath.preStudyDASS21,
      },
      {
        formName: "Pre-study My Strategies Questionnaire",
        numberFormsCompleted: summaryData.total_pre_study_my_strategies_questionnaire_filled,
        formEndpointBaseURL: dBcollectionBasePath.preStudyMyStrategiesQuestionnaire,
      },
      {
        formName: "ACE Questionnaire",
        numberFormsCompleted: summaryData.total_pre_study_ace_questionnaire_filled,
        formEndpointBaseURL: dBcollectionBasePath.aceQuestionnaire,
      },
    ];

    const stageTwoSummaryData = [
      {
        formName: "Mid-study Stage 2 DASS-21",
        numberFormsCompleted: summaryData.total_mid_study_stage_2_dass21_filled,
        formEndpointBaseURL: dBcollectionBasePath.firstInStudyDASS21,
      },
    ];

    const stageThreeSummaryData = [
      {
        formName: "Mid-study Stage 3 DASS-21",
        numberFormsCompleted: summaryData.total_mid_study_stage_3_dass21_filled,
        formEndpointBaseURL: dBcollectionBasePath.secondInStudyDASS21,
      },
    ];

    const stageFourSummaryData = [
      {
        formName: "Mid-study ASVB Questionnaire",
        numberFormsCompleted: summaryData.total_mid_study_asvb_questionnaire_filled,
        formEndpointBaseURL: dBcollectionBasePath.inStudyASVBQuestionnaire,
      },
      {
        formName: "Mid-study My Strategies Questionnaire",
        numberFormsCompleted: summaryData.total_mid_study_my_strategies_questionnaire_filled,
        formEndpointBaseURL: dBcollectionBasePath.inStudyMyStrategiesQuestionnaire,
      },
    ];  

    const stageFiveSummaryData = [
      {
        formName: "Post-study ASVB Questionnaire",
        numberFormsCompleted: summaryData.total_post_study_asvb_questionnaire_filled,
        formEndpointBaseURL: dBcollectionBasePath.postStudyASVBQuestionnaire,
      },
    ];  
    setFormSummaryDataOrganisedByStage([stageOneSummaryData, stageTwoSummaryData, stageThreeSummaryData, stageFourSummaryData, stageFiveSummaryData]);
  }
}


export default HomePage;