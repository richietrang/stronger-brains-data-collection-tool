import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import H3TitleComponent from '../../components/H3TitleComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import DialogComponent from '../../components/DialogComponent';
import useGetParticipantGroups from '../../hooks/useGetParticipantGroups';
import NewSelectFormComponent from '../../components/forms/NewSelectFormComponent';
import TextFieldFormComponent from '../../components/forms/TextFieldFormComponent';
import SliderFormComponent from '../../components/forms/SliderFormComponent';
import { validatorEnum } from "../../utility/validatorEnum";
import { baseURL } from '../../server/serverConfig';
import axios from 'axios';
import { paths } from '../../server/paths';
import { Prompt } from 'react-router-dom';


const ASVBQuestionnaireForm = (props) => {
  const {route, title} = props.location.state;
  const localStorage = window.localStorage;
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [requiredFieldsErrorModal, setRequiredFieldsErrorModal] = useState({
    state: false,
    title: '',
    text: '',
  });
  const participantGroups = useGetParticipantGroups();
  const [participants, setParticipants] = useState([]);
  const [prefilled, setPrefilled] = useState(false);

  const requiredFields = ['participantGroup', 'participant', 'employmentStatus', 'currentIncomeStream', 'employmentStatusAffectingIndependence', 'supportToPrepareForWork',
                          'ASVBConfidenceQ1', 'ASVBConfidenceQ2', 'ASVBConfidenceQ3', 'ASVBConfidenceQ4', 'ASVBConfidenceQ5', 'ASVBConfidenceQ6',
                          'ASVBConfidenceQ7', 'ASVBConfidenceQ8', 'ASVBConfidenceQ9'];

  const [formState, setFormState] = useState({
    dataCollector: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
    dateFormAddedOrModified: getTodaysDate(),
    participantGroup: {},
    participant: {},
    employmentStatus: '',
    currentIncomeStream: '',
    EmploymentGapsAndObstacles: '',
    employmentStatusAffectingIndependence: '',
    supportToPrepareForWork: '',
    employmentServicesBeingReceived: '',
    ASVBConfidenceQ1: {
      label: 'I start feeling anxious if I do not understand a problem immediately',
      rating: 0,
    },
    ASVBConfidenceQ2: {
      label: 'Even when nobody is watching, I feel anxious in new situations',
      rating: 0,
    },
    ASVBConfidenceQ3: {
      label: 'In difficult situations where a lot depends on me, I’m afraid of failing',
      rating: 0,
    },
    ASVBConfidenceQ4: {
      label: 'I feel uneasy about undertaking a task if I am unsure of succeeding',
      rating: 0,
    },
    ASVBConfidenceQ5: {
      label: 'I am afraid of tasks that I cannot work out or solve',
      rating: 0,
    },
    ASVBConfidenceQ6: {
      label: 'I like situations where I can find out how capable I am',
      rating: 0,
    },
    ASVBConfidenceQ7: {
      label: 'I am attracted to tasks that allow me to test my abilities',
      rating: 0,
    },
    ASVBConfidenceQ8: {
      label: 'I enjoy situations that make use of my abilities',
      rating: 0,
    },
    ASVBConfidenceQ9: {
      label: 'When confronted with a difficult problem, I prefer to start working on it straight away',
      rating: 0,
    },
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
              setFormState(deserialiseASVBQuestionnaireFormData(res.data[0]));
              setPrefilled(true);
            }
          });
        axios.get(`${baseURL}/participant-groups/get-participants-by-group-id/${participantGroupId}`)
          .then((res) => {
            setParticipants(res.data);
          });
      }
    }
  }, []);

  return (
    <>
      <Prompt
        when={!!(formChanged && formState.participantGroup._id && formState.participant._id)}
        message="If you leave the page, you will lose your unsaved changes. To save the form, fill all required fields and submit."
      />
      <HeaderComponent headerText={title} enableBackButton />
      <div style={styles.contentWrapper}>


            {prefilled &&
            <>
              <H3TitleComponent titleText={`${formState.participant.first_name} ${formState.participant.last_name}'s Form Data`} />
              <p style={{textAlign: 'left'}}>Press the 'Next' button to start updating the fields. Press update at the end of the form to make changes.</p>
            </>
            }

            <p style={{textAlign: 'left'}}>{`Data Administrator:  ${formState.dataCollector}`}</p>
            <p style={{textAlign: 'left'}}>{`Date form added or modified:  ${formState.dateFormAddedOrModified}`}</p>

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


            <H3TitleComponent titleText="Employment" />
            <NewSelectFormComponent
              label="5. Employment Status"
              formStateName="employmentStatus"
              value={formState.employmentStatus}
              onChange={onFormInputChange}
              errorState={formError.employmentStatus}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Full-time (38hrs+)', 'Part-time(<38hrs)', 'Self-employed', 'Casual - Full time equiv (>38hrs)', 'Casual - Part-time equiv (<38hrs)',
                'Student', 'Unemployed', 'Unemployed seeking employment', 'Unemployed due to injury, illness, or disability']}
              required
            />

            <TextFieldFormComponent
              formStateName="EmploymentGapsAndObstacles"
              value={formState.EmploymentGapsAndObstacles}
              label="6. Describe employment gaps and obstacles"
              onChange={onFormInputChange}
              errorState={formError.EmploymentGapsAndObstacles}
              validatorMethod={validatorEnum.NO_VALIDATION}
              errorText=""
              setFormError={onInputError}
              multiline
            />

            <NewSelectFormComponent
              label="7. Did you receive job preparation help?"
              formStateName="supportToPrepareForWork"
              value={formState.supportToPrepareForWork}
              onChange={onFormInputChange}
              errorState={formError.supportToPrepareForWork}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Yes', 'No']}
              required
            />
            <p>*Job assistance examples include pay for clothing or pay for personal assistance such as counselling, rehabilitation, grooming, medical or dental services</p>

            <TextFieldFormComponent
              formStateName="employmentServicesBeingReceived"
              value={formState.employmentServicesBeingReceived}
              label="8. Preparation name, durations, and types."
              onChange={onFormInputChange}
              errorState={formError.employmentServicesBeingReceived}
              validatorMethod={validatorEnum.NO_VALIDATION}
              errorText="Please write a valid income strategy"
              setFormError={onInputError}
              multiline
            />

            <TextFieldFormComponent
              formStateName="currentIncomeStream"
              value={formState.currentIncomeStream}
              label="9. Income Strategy"
              onChange={onFormInputChange}
              errorState={formError.currentIncomeStream}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please write a valid income strategy"
              setFormError={onInputError}
              required
            />

            <SliderFormComponent
              formStateName="employmentStatusAffectingIndependence"
              value={formState.employmentStatusAffectingIndependence}
              label="10. How employment status has affected independence?"
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.employmentStatusAffectingIndependence}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={5}
              step={1}
              defaultValue={0}
              legendText={['1. Negative Impact', '2. Moderate Negative Impact', '3. Middle Ground/Unsure',
                '4. Adequate over the Short Term', '5. Adequate and Stable over the Medium Term']}
              required
            />
            
            <H3TitleComponent titleText="Self Esteem and Confidence" />
            <p>Please state your level of agreement with the following statements, where: 1 = Strongly disagree, and 7 = Strongly agree.</p>

            <SliderFormComponent
              formStateName="ASVBConfidenceQ1"
              value={formState.ASVBConfidenceQ1}
              label={formState.ASVBConfidenceQ1.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ1}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ2"
              value={formState.ASVBConfidenceQ2}
              label={formState.ASVBConfidenceQ2.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ2}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ3"
              value={formState.ASVBConfidenceQ3}
              label={formState.ASVBConfidenceQ3.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ3}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ4"
              value={formState.ASVBConfidenceQ4}
              label={formState.ASVBConfidenceQ4.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ4}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ5"
              value={formState.ASVBConfidenceQ5}
              label={formState.ASVBConfidenceQ5.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ5}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ6"
              value={formState.ASVBConfidenceQ6}
              label={formState.ASVBConfidenceQ6.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ6}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ7"
              value={formState.ASVBConfidenceQ7}
              label={formState.ASVBConfidenceQ7.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ7}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ8"
              value={formState.ASVBConfidenceQ8}
              label={formState.ASVBConfidenceQ8.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ8}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

            <SliderFormComponent
              formStateName="ASVBConfidenceQ9"
              value={formState.ASVBConfidenceQ9}
              label={formState.ASVBConfidenceQ9.label}
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.ASVBConfidenceQ9}
              errorText="Please select a value"
              setFormError={onInputError}
              min={0}
              max={7}
              step={1}
              defaultValue={0}
              required
            />

    
          <div style={styles.buttonWrapper}>
            <PrimaryButtonComponent onClick={handleSubmit} buttonText={`${!prefilled ? 'Submit form data' : 'Update form data'}`} />
          </div>


        {formState.participant && formState.participant.first_name && formState.participant.last_name &&
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

      </div>
    </>
  );

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
        setFormState(
        deserialiseASVBQuestionnaireFormData(res.data[0]));
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

  function handleSubmit(e) {
    e.preventDefault();
    if (checkRequiredFieldsSet(...requiredFields)) {
      if (!Object.values(formError).includes(true)) {
        setFormChanged(false);
        const newASVBQuestionnaireData = serialiseASVBQuestionnaireFormData(formState);
        if (!prefilled) {
          axios.post(`${baseURL}${route}/add/`, newASVBQuestionnaireData)
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(err => {
            alert(err);
          });
        } else {
          axios.post(paths.updateFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, formState.participant._id, route), newASVBQuestionnaireData)
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

  function serialiseASVBQuestionnaireFormData(formData) {
    return {
      administrator_name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
      update_date: getTodaysDate(),
      participant_id: formData.participant._id,
      participant_first_name: formData.participant.first_name,
      participant_last_name: formData.participant.last_name,
      group_id: formData.participantGroup._id,
      group_name: formData.participantGroup.group_name,
      employment_status: formData.employmentStatus,
      current_income_stream: formData.currentIncomeStream,
      employment_gaps_and_obstacles: formData.EmploymentGapsAndObstacles,
      employment_status_affecting_independence: formData.employmentStatusAffectingIndependence,
      support_to_prepare_for_work: formData.supportToPrepareForWork,
      employment_services_being_received: formData.employmentServicesBeingReceived,
      ASVB_confidence_Q1: formData.ASVBConfidenceQ1,
      ASVB_confidence_Q2: formData.ASVBConfidenceQ2,
      ASVB_confidence_Q3: formData.ASVBConfidenceQ3,
      ASVB_confidence_Q4: formData.ASVBConfidenceQ4,
      ASVB_confidence_Q5: formData.ASVBConfidenceQ5,
      ASVB_confidence_Q6: formData.ASVBConfidenceQ6,
      ASVB_confidence_Q7: formData.ASVBConfidenceQ7,
      ASVB_confidence_Q8: formData.ASVBConfidenceQ8,
      ASVB_confidence_Q9: formData.ASVBConfidenceQ9,
      form_completed: true,
    }
  }

  function deserialiseASVBQuestionnaireFormData(formDatabaseObject) {
    return {
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
      employmentStatus: formDatabaseObject.employment_status,
      currentIncomeStream: formDatabaseObject.current_income_stream,
      EmploymentGapsAndObstacles: formDatabaseObject.employment_gaps_and_obstacles,
      employmentStatusAffectingIndependence: formDatabaseObject.employment_status_affecting_independence,
      supportToPrepareForWork: formDatabaseObject.support_to_prepare_for_work,
      employmentServicesBeingReceived: formDatabaseObject.employment_services_being_received,
      ASVBConfidenceQ1: formDatabaseObject.ASVB_confidence_Q1,
      ASVBConfidenceQ2: formDatabaseObject.ASVB_confidence_Q2,
      ASVBConfidenceQ3: formDatabaseObject.ASVB_confidence_Q3,
      ASVBConfidenceQ4: formDatabaseObject.ASVB_confidence_Q4,
      ASVBConfidenceQ5: formDatabaseObject.ASVB_confidence_Q5,
      ASVBConfidenceQ6: formDatabaseObject.ASVB_confidence_Q6,
      ASVBConfidenceQ7: formDatabaseObject.ASVB_confidence_Q7,
      ASVBConfidenceQ8: formDatabaseObject.ASVB_confidence_Q8,
      ASVBConfidenceQ9: formDatabaseObject.ASVB_confidence_Q9,
      formCompleted: true,
    }
  }
};

const styles = {
  contentWrapper: {
    padding: '0 40px',
    marginTop: '70px',
    marginBottom: '70px',
  },
  buttonWrapper: {
    display: 'flex',
    marginTop: '20px',
    justifyContent: 'space-between',
  },
  longFormQuestionLabel: {
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0',
    textAlign: 'left',
  }
}

export default ASVBQuestionnaireForm;
