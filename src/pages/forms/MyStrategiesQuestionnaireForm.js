import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import H3TitleComponent from '../../components/H3TitleComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import DialogComponent from '../../components/DialogComponent';
import useGetParticipantGroups from '../../hooks/useGetParticipantGroups';
import NewSelectFormComponent from '../../components/forms/NewSelectFormComponent';
import SliderFormComponent from '../../components/forms/SliderFormComponent';
import TextFieldFormComponent from '../../components/forms/TextFieldFormComponent';
import { validatorEnum } from "../../utility/validatorEnum";
import { baseURL } from '../../server/serverConfig';
import axios from 'axios';
import { paths } from '../../server/paths';
import { Prompt } from 'react-router-dom';

const styles = {
  contentWrapper: {
    padding: '0 40px',
    marginTop: '70px',
    marginBottom: '70px',
  },
  buttonWrapper: {
    display: 'flex',
    marginTop: '20px',
  },
  longFormQuestionLabel: {
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0',
    textAlign: 'left',
  },
}

const MyStrategiesQuestionnaireForm = (props) => {
  const {route, title} = props.location.state;
  const localStorage = window.localStorage;
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [changedKnowledgeScore, setChangedKnowledgeScore] = useState(0);
  const [empowermentScore, setEmpowermentScore] = useState(0);

  const [requiredFieldsErrorModal, setRequiredFieldsErrorModal] = useState({
    state: false,
    title: '',
    text: '',
  });
  const participantGroups = useGetParticipantGroups();
  const [participants, setParticipants] = useState([]);
  const [prefilled, setPrefilled] = useState(false);

  const [formState, setFormState] = useState({
    dataCollector: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
    dateFormAddedOrModified: getTodaysDate(),
    participantGroup: {},
    participant: {},
    motivationJobRating: {
      label: 'How motivated are you to find a job? Or to maintain your current job?',
      rating: 0,
    },
    resourcesJobRating: {
      label: "How equipped/resourceful do you feel you are in order to find a new job should you need to",
      rating: 0,
    },
    jobRatingJustification: '',
    confidenceRating: {
      label: ' How confident are you in managing problems or challenges that you might encounter as part of your daily life?',
      rating: 0,
    },
    resourcesToManageDailyProblemsRating: {
      label: "How equipped/resourceful do you feel you are in order to find a new job should you need to",
      rating: 0,
    },
    resourcesToManageDailyProblemsRatingJustification: '',
  });

  const [formError, setFormError] = useState(
    Object.keys(formState).reduce((formErrorState, formStateKey)=> {
      return ({
          ...formErrorState,
          [formStateKey]: false,
      });
    }, {})
  );


  useEffect(() => {
    if (props && props.location && props.location.state) {
      const { participantGroupId, participantId } = props.location.state;
      if (participantGroupId && participantId) {
        axios.get(paths.getFormDataMatchingParticipantGroupAndParticipantId(participantGroupId, participantId, route))
          .then(res => {
            if (res.data[0]) {
              deserialiseDASS21FormData(res.data[0]);
              setPrefilled(true);
            }
          });
        axios.get(`${baseURL}/participant-groups/get-participants-by-group-id/${participantGroupId}`)
          .then((res) => {
            setParticipants(res.data);
          });
      }
    }
  }, [props, route]);

  useEffect(() => {
    setChangedKnowledgeScore(Math.floor((formState.resourcesJobRating.rating + formState.resourcesToManageDailyProblemsRating.rating) / 2));
    setEmpowermentScore(Math.floor((formState.motivationJobRating.rating + formState.confidenceRating.rating) / 2));
  }, [formState]);

  return (
    <>
      <HeaderComponent headerText={title} enableBackButton />
        <div style={styles.contentWrapper}>
        {prefilled &&
          <>
            <H3TitleComponent titleText={`${formState.participant.first_name} ${formState.participant.last_name}'s Form Data`} />
            <p style={{textAlign: 'left'}}>Prefilled data for already completed form. Update the fields and press update at the end of the form to make changes.</p>
          </>
        }

        <p style={{textAlign: 'left'}}>{`Data Administrator:  ${formState.dataCollector}`}</p>
        <p style={{textAlign: 'left'}}>{`Date form added or modified:  ${formState.dateFormAddedOrModified}`}</p>


        <H3TitleComponent titleText="Participant" />

        <NewSelectFormComponent
          label="Participant Group"
          formStateName="participantGroup"
          value={formState.participantGroup.group_name}
          onChange={onParticipantGroupSelected}
          errorState={formError.participantGroup}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please select a field"
          setFormError={onInputError}
          selectOptions={participantGroups.map(participantGroup => participantGroup.group_name)}
          disabled={prefilled ? true : false}
        />

        <NewSelectFormComponent
          label="Participant"
          formStateName="participant"
          onChange={onParticipantSelected}
          value={`${formState.participant.first_name} ${formState.participant.last_name}`}
          errorState={formError.participant}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please select a field"
          setFormError={onInputError}
          selectOptions={participants.map(participant => participant.first_name + ' ' + participant.last_name)}
          disabled={prefilled ? true : false}
        />
        <H3TitleComponent titleText="DASS-21 Form" />
        <p style={{textAlign: 'left'}}>
          Please read each statement with a rating and select a number either 1, 2, or 3, 4, or 5.
        </p>

        <ul style={{textAlign: 'left'}}>
          <li>1 - Very Low</li>
          <li>2 - Low</li>
          <li>3 - Moderate</li>
          <li>4 - High</li>
          <li>5 - Very High</li>
        </ul>

        <SliderFormComponent
          formStateName="motivationJobRating"
          value={formState.motivationJobRating}
          label={formState.motivationJobRating.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NOT_ZERO}
          errorState={formError.motivationJobRating}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="resourcesJobRating"
          value={formState.resourcesJobRating}
          label={formState.resourcesJobRating.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NOT_ZERO}
          errorState={formError.resourcesJobRating}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          required
        />
        <p style={styles.longFormQuestionLabel}>
          Why do you feel this way? What resources do you feel you have? What do you feel you need? (i.e. resume, help finding jobs, transportation, etc.)
        </p>
        <TextFieldFormComponent
          formStateName="jobRatingJustification"
          value={formState.jobRatingJustification}
          label="Resources rating justification"
          onChange={onFormInputChange}
          errorState={formError.jobRatingJustification}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please write a justification."
          setFormError={onInputError}
          multiline
        />

        <SliderFormComponent
          formStateName="confidenceRating"
          value={formState.confidenceRating}
          label={formState.confidenceRating.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NOT_ZERO}
          errorState={formError.confidenceRating}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="resourcesToManageDailyProblemsRating"
          value={formState.resourcesToManageDailyProblemsRating}
          label={formState.resourcesToManageDailyProblemsRating.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NOT_ZERO}
          errorState={formError.resourcesToManageDailyProblemsRating}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          required
        />
        <p style={styles.longFormQuestionLabel}>
          Why do you feel this way? What resources do you currently use? How do you cope with life? What are current strategies? Could they be better?
        </p>
        <TextFieldFormComponent
          formStateName="resourcesToManageDailyProblemsRatingJustification"
          value={formState.resourcesToManageDailyProblemsRatingJustification}
          label="Resources to manage problems rating justification"
          onChange={onFormInputChange}
          errorState={formError.resourcesToManageDailyProblemsRatingJustification}
          validatorMethod={validatorEnum.IS_NOT_EMPTY}
          errorText="Please write a justification."
          setFormError={onInputError}
          multiline
        />


      <H3TitleComponent titleText="DEX Scores" />
      <table>
        <thead>
          <tr>
            <th>Changed Knowledge Score</th>
            <th>Empowerment Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{changedKnowledgeScore}</td>
            <td>{empowermentScore}</td>
          </tr>
        </tbody>
      </table>

      <a href="https://docdro.id/HJiqaQI" target="_blank" rel="noopener noreferrer">How are these values calculated?</a>
      <div style={styles.buttonWrapper}>
        <PrimaryButtonComponent onClick={handleSubmit} buttonText={`${!prefilled ? 'Submit form data' : 'Update form data'}`} />
      </div>

      </div>

      { formState.participant && formState.participant.first_name && formState.participant.last_name &&
        <DialogComponent
          dialogTitle={`${title} successfully ${!prefilled ? 'added' : 'updated.'}`}
          dialogText={`${title} ${!prefilled ? 'added' : 'updated.'} for ${formState.participant.first_name} ${formState.participant.last_name}.`}
          backButtonText="Back"
          dialogOpen={dialogOpen}
        />
      }
      
      {requiredFieldsErrorModal.state &&
        <DialogComponent
          dialogTitle={requiredFieldsErrorModal.title}
          dialogText={requiredFieldsErrorModal.text}
          closeBtnText="Close"
          dialogOpen={requiredFieldsErrorModal.state}
          onCloseCallBack={closeRequiredFieldsErrorModal}
        />
      }
      <Prompt
        when={!!(formChanged && formState.participantGroup._id && formState.participant._id)}
        message="If you leave the page, you will lose your unsaved changes. To save the form, fill all required fields and submit."
      />
    </>
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (checkRequiredFieldsSet('participantGroup', 'participant')) {
      if (!Object.values(formError).includes(true)) {
        setFormChanged(false);
        const newDASS21FormData = serialiseDASS21FormData(formState);
        if (!prefilled) {
          axios.post(`${baseURL}${route}/add`, newDASS21FormData)
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(err => {
            alert(err);
          });
        } else {
          axios.post(paths.updateFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, formState.participant._id, route), newDASS21FormData)
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(err => {
            alert(err);
          });
        }
      }
    }
  }

  function onInputError(formStateField, isError) {
    setFormError({
      ...formError,
      [formStateField]: isError,
    });
  }

  function checkRequiredFieldsSet(...requiredFields) {
    let allRequiredFieldsSet = true;
    let updatedFormErrorState = formError;
    requiredFields.forEach(formField => {
      if (!formState[formField] || (Object.keys(formState[formField]).length === 0 && typeof formState[formField] === 'object')) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      } else if (formState[formField].label && formState[formField].rating === 0) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      }
    });
    setFormError({ ...updatedFormErrorState });
    return allRequiredFieldsSet;
  }


  function onParticipantSelected(event, formStateField) {
    let participant = participants.filter((participant) => {
      return participant.first_name + ' ' + participant.last_name === event.target.value;
    });

    setFormState({
      ...formState,
      [formStateField]: participant[0],
    });

    axios.get(paths.getFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, participant[0]._id, route))
    .then(res => {
      if (res.data[0]) {
        deserialiseDASS21FormData(res.data[0]);
        setPrefilled(true);
      }
    });
  }

  function onParticipantGroupSelected(event, formStateField) {
    if (event.target.value) {
      const selectedGroup = participantGroups.filter(participantGroup => participantGroup.group_name === event.target.value)[0];
      setFormState({
        ...formState,
        [formStateField]: selectedGroup,
      });

      axios.get(`${baseURL}/participant-groups/get-participants-by-group-id/${selectedGroup._id}`)
        .then((res) => {
          setParticipants(res.data);
        });
    }
  }

  function closeRequiredFieldsErrorModal() {
    setRequiredFieldsErrorModal({
      ...requiredFieldsErrorModal,
      state: false,
    })
  }

  function onFormInputChange(event, formStateField) {
    setFormChanged(true);
    setFormState({
      ...formState,
      [formStateField]: event.target.value,
    });
  }

  function getTodaysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
  }

  function serialiseDASS21FormData(formState) {
    return {
      administrator_name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
      update_date: getTodaysDate(),
      participant_id: formState.participant._id,
      participant_first_name: formState.participant.first_name,
      participant_last_name: formState.participant.last_name,
      group_id: formState.participantGroup._id,
      group_name: formState.participantGroup.group_name,
      motivation_job_rating: formState.motivationJobRating,
      resources_job_rating: formState.resourcesJobRating,
      job_rating_justification: formState.jobRatingJustification,
      confidence_rating: formState.confidenceRating,
      resources_to_manage_daily_problems_rating: formState.resourcesToManageDailyProblemsRating,
      resources_to_manage_daily_problems_rating_justification: formState.resourcesToManageDailyProblemsRatingJustification,
      changed_knowledge_score: changedKnowledgeScore,
      empowerment_score: empowermentScore,
      form_completed: true,
    }
  }

  function deserialiseDASS21FormData(formDatabaseObject) {
    setFormState({
      dataCollector: formDatabaseObject.administrator_name,
      dateFormAddedOrModified: formDatabaseObject.update_date,
      participant: {
        _id: formDatabaseObject.participant_id,
        first_name: formDatabaseObject.participant_first_name,
        last_name: formDatabaseObject.participant_last_name,
      },
      participantGroup: {
        _id: formDatabaseObject.group_id,
        group_name: formDatabaseObject.group_name,
      },
      motivationJobRating:formDatabaseObject.motivation_job_rating,
      resourcesJobRating: formDatabaseObject.resources_job_rating,
      jobRatingJustification: formDatabaseObject.job_rating_justification,
      confidenceRating: formDatabaseObject.confidence_rating,
      resourcesToManageDailyProblemsRating: formDatabaseObject.resources_to_manage_daily_problems_rating, 
      resourcesToManageDailyProblemsRatingJustification: formDatabaseObject.resources_to_manage_daily_problems_rating_justification,
    });

    setChangedKnowledgeScore(formDatabaseObject.changed_knowledge_score);
    setEmpowermentScore(formDatabaseObject.empowerment_score);
  }
};

export default MyStrategiesQuestionnaireForm;
