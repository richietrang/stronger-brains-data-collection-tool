import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import H3TitleComponent from '../../components/H3TitleComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import DialogComponent from '../../components/DialogComponent';
import useGetParticipantGroups from '../../hooks/useGetParticipantGroups';
import NewSelectFormComponent from '../../components/forms/NewSelectFormComponent';
import SliderFormComponent from '../../components/forms/SliderFormComponent';
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
}

const DASS21Form = (props) => {
  const {route, title} = props.location.state;
  const localStorage = window.localStorage;
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [DASS21Scores, setDASS21Scores] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
  });

  const [dexScores, setDexScores] = useState({
    depression: 0,
    anxiety: 0,
    stress: 0,
    totalDividedByThree: 0,
  });

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
    DASS21Q1: {
      label: 'I found it hard to wind down',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q2: {
      label: 'I was aware of dryness in my mouth',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q3: {
      label: "I couldn't seem to experience any positive feeling at all",
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q4: {
      label: 'I experienced breathing difficulty (e.g, excessively rapid breathing, breathlessness in the absence of physical exertion)',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q5: {
      label: 'I found it difficult to work up the initative to do things',
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q6: {
      label: 'I tended to over-react to situations',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q7: {
      label: 'I experienced trembling (e.g, in the hands)',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q8: {
      label: 'I felt that I was using a lot of nervous energy',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q9: {
      label: 'I was worried about situations in which I might panic and make a fool of myself',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q10: {
      label: 'I felt that I had nothing to look forward to',
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q11: {
      label: 'I found myself getting agitated',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q12: {
      label: 'I found it difficult to relax',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q13: {
      label: 'I felt down hearted and blue',
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q14: {
      label: 'I was intolerant of anything that kept me from getting on with what I was doing',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q15: {
      label: 'I felt I was close to panic',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q16: {
      label: 'I was unable to become enthusiastic about anything',
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q17: {
      label: "I felt I wasn't worth much as a person",
      rating: 0,
      DAS_category: 'depression',
    },
    DASS21Q18: {
      label: 'I felt that I was rather touchy',
      rating: 0,
      DAS_category: 'stress',
    },
    DASS21Q19: {
      label: 'I was aware of the action of my heart in the absence of physical exertion (e.g, sense of heart rate increase, heart missing a beat)',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q20: {
      label: 'I felt scared without any good reason',
      rating: 0,
      DAS_category: 'anxiety',
    },
    DASS21Q21: {
      label: 'I felt that life was meaningless',
      rating: 0,
      DAS_category: 'depression',
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
    const DASS21DepressionScore = (formState.DASS21Q3.rating + formState.DASS21Q5.rating + formState.DASS21Q10.rating + formState.DASS21Q13.rating + formState.DASS21Q16.rating + formState.DASS21Q17.rating + formState.DASS21Q21.rating) * 2;
    const DASS21AnxietyScore = (formState.DASS21Q2.rating + formState.DASS21Q4.rating + formState.DASS21Q7.rating + formState.DASS21Q9.rating + formState.DASS21Q15.rating + formState.DASS21Q19.rating + formState.DASS21Q20.rating) * 2;
    const DASS21StressScore = (formState.DASS21Q1.rating + formState.DASS21Q6.rating + formState.DASS21Q8.rating + formState.DASS21Q11.rating + formState.DASS21Q12.rating + formState.DASS21Q14.rating + formState.DASS21Q18.rating) * 2;
    setDASS21Scores({
      depression: DASS21DepressionScore,
      anxiety: DASS21AnxietyScore,
      stress: DASS21StressScore,
    });

    const dass21Scores = [DASS21DepressionScore, DASS21AnxietyScore, DASS21StressScore];
    let dexDepressionScore = 0;
    let dexAnxietyScore = 0;
    let dexStressScore = 0;

    dass21Scores.forEach((score, index) => {
      let severity = 0;
      if (score >= 0 && score <= 9) {
        severity = 5;
      } else if (score >= 10 && score <= 13) {
        severity = 4;
      } else if (score >= 14 && score <= 20) {
        severity = 3;
      } else if (score >= 21 && score <= 27) {
        severity = 2;
      } else if (score >= 28) {
        severity = 1;
      }
      if (index === 0) {
        dexDepressionScore = severity;
      } else if (index === 1 ) {
        dexAnxietyScore = severity; 
      } else if (index === 2 ){
        dexStressScore = severity;
      }
    });

    const dexScoreTotalDividedByThree = ((dexDepressionScore + dexAnxietyScore + dexStressScore)/3).toFixed(2);
    setDexScores({
      depression: dexDepressionScore,
      anxiety: dexAnxietyScore,
      stress: dexStressScore,
      totalDividedByThree: dexScoreTotalDividedByThree,
    });

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
          Please read each statement and select a number either 0, 1, 2, or 3 indicating how much the statement applied to you over the past week. 
          There are no right or wrong ansers. Do not spend too much time on any statement 
        </p>

        <ul style={{textAlign: 'left'}}>
          <li>0 - Did not apply to me at all - NEVER</li>
          <li>1 - Applied to me to some degree, or some of the time - SOMETIMES</li>
          <li>2 - Applied to me to a considerable degree, or a good part of time - OFTEN</li>
          <li>3 - Applied to me very much, or most of the time - ALMOST ALWAYS</li>
        </ul>

        <SliderFormComponent
          formStateName="DASS21Q1"
          value={formState.DASS21Q1}
          label={formState.DASS21Q1.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q1}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q2"
          value={formState.DASS21Q2}
          label={formState.DASS21Q2.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q2}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q3"
          value={formState.DASS21Q3}
          label={formState.DASS21Q3.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q3}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q4"
          value={formState.DASS21Q4}
          label={formState.DASS21Q4.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q4}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />
        <SliderFormComponent
          formStateName="DASS21Q1"
          value={formState.DASS21Q5}
          label={formState.DASS21Q5.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q5}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q6"
          value={formState.DASS21Q6}
          label={formState.DASS21Q6.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q6}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q7"
          value={formState.DASS21Q7}
          label={formState.DASS21Q7.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q7}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q8"
          value={formState.DASS21Q8}
          label={formState.DASS21Q8.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q8}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />
        <SliderFormComponent
          formStateName="DASS21Q9"
          value={formState.DASS21Q9}
          label={formState.DASS21Q9.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q9}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q1"
          value={formState.DASS21Q10}
          label={formState.DASS21Q10.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q10}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q11"
          value={formState.DASS21Q11}
          label={formState.DASS21Q11.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q11}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q12"
          value={formState.DASS21Q12}
          label={formState.DASS21Q12.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q12}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q13"
          value={formState.DASS21Q13}
          label={formState.DASS21Q13.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q13}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q14"
          value={formState.DASS21Q14}
          label={formState.DASS21Q14.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q14}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q15"
          value={formState.DASS21Q15}
          label={formState.DASS21Q15.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q15}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q16"
          value={formState.DASS21Q16}
          label={formState.DASS21Q16.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q16}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q17"
          value={formState.DASS21Q17}
          label={formState.DASS21Q17.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q17}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q18"
          value={formState.DASS21Q18}
          label={formState.DASS21Q18.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NOT_ZERO}
          errorState={formError.DASS21Q18}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q19"
          value={formState.DASS21Q19}
          label={formState.DASS21Q19.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q19}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q20"
          value={formState.DASS21Q20}
          label={formState.DASS21Q20.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q20}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

        <SliderFormComponent
          formStateName="DASS21Q21"
          value={formState.DASS21Q21}
          label={formState.DASS21Q21.label}
          onChange={onFormInputChange}
          validatorMethod={validatorEnum.NO_VALIDATION}
          errorState={formError.DASS21Q21}
          errorText="Please select a value"
          setFormError={onInputError}
          min={0}
          max={3}
          step={1}
          defaultValue={0}
          required
        />

      <H3TitleComponent titleText="DASS-21 Scores" />
      <table>
        <thead>
          <tr>
            <th>Depression</th>
            <th>Anxiety</th>
            <th>Stress</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{DASS21Scores.depression}</td>
            <td>{DASS21Scores.anxiety}</td>
            <td>{DASS21Scores.stress}</td>
          </tr>
        </tbody>
      </table>

      <H3TitleComponent titleText="DEX Scores" />
      <table>
        <thead>
          <tr>
            <th>Depression</th>
            <th>Anxiety</th>
            <th>Stress</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{dexScores.depression}</td>
            <td>{dexScores.anxiety}</td>
            <td>{dexScores.stress}</td>
          </tr>
        </tbody>
      </table>

      <H3TitleComponent titleText="DEX  Score for Circumstances - Wellbeing, Mental health, and Self-Care" />
      <p style={{textAlign: 'left'}}>{`Score: ${dexScores.totalDividedByThree}`}</p>

      <a href="https://docdro.id/Nm1GwFm" target="_blank" rel="noopener noreferrer">How are these values calculated?</a>


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
      administrator_name: formState.dataCollector,
      update_date: formState.dateFormAddedOrModified,
      participant_id: formState.participant._id,
      participant_first_name: formState.participant.first_name,
      participant_last_name: formState.participant.last_name,
      group_id: formState.participantGroup._id,
      group_name: formState.participantGroup.group_name,
      DASS_Q1: formState.DASS21Q1,
      DASS_Q2: formState.DASS21Q2,
      DASS_Q3: formState.DASS21Q3,
      DASS_Q4: formState.DASS21Q4,
      DASS_Q5: formState.DASS21Q5,
      DASS_Q6: formState.DASS21Q6,
      DASS_Q7: formState.DASS21Q7,
      DASS_Q8: formState.DASS21Q8,
      DASS_Q9: formState.DASS21Q9,
      DASS_Q10: formState.DASS21Q10,
      DASS_Q11: formState.DASS21Q11,
      DASS_Q12: formState.DASS21Q12,
      DASS_Q13: formState.DASS21Q13,
      DASS_Q14: formState.DASS21Q14,
      DASS_Q15: formState.DASS21Q15,
      DASS_Q16: formState.DASS21Q16,
      DASS_Q17: formState.DASS21Q17,
      DASS_Q18: formState.DASS21Q18,
      DASS_Q19: formState.DASS21Q19,
      DASS_Q20: formState.DASS21Q20,
      DASS_Q21: formState.DASS21Q21,
      DASS_21_score: {
        depression: DASS21Scores.depression,
        anxiety: DASS21Scores.anxiety,
        stress: DASS21Scores.stress,
      },
      DEX_score_translation: {
        depression: dexScores.depression,
        anxiety: dexScores.anxiety,
        stress: dexScores.stress,
      },
      DEX_score_circumstances_wellbeing_mental_heath_self_care: dexScores.totalDividedByThree,
      form_completed: true,
    }
  }

  function deserialiseDASS21FormData(formDatabaseObject) {
    setFormState({
      administrator_name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
      update_date: getTodaysDate(),
      participant: {
        _id: formDatabaseObject.participant_id,
        first_name: formDatabaseObject.participant_first_name,
        last_name: formDatabaseObject.participant_last_name,
      },
      participantGroup: {
        _id: formDatabaseObject.group_id,
        group_name: formDatabaseObject.group_name,
      },
      DASS21Q1: formDatabaseObject.DASS_Q1,
      DASS21Q2: formDatabaseObject.DASS_Q2,
      DASS21Q3: formDatabaseObject.DASS_Q3,
      DASS21Q4: formDatabaseObject.DASS_Q4,
      DASS21Q5: formDatabaseObject.DASS_Q5,
      DASS21Q6: formDatabaseObject.DASS_Q6,
      DASS21Q7: formDatabaseObject.DASS_Q7,
      DASS21Q8: formDatabaseObject.DASS_Q8,
      DASS21Q9: formDatabaseObject.DASS_Q9,
      DASS21Q10: formDatabaseObject.DASS_Q10,
      DASS21Q11: formDatabaseObject.DASS_Q11,
      DASS21Q12: formDatabaseObject.DASS_Q12,
      DASS21Q13: formDatabaseObject.DASS_Q13,
      DASS21Q14: formDatabaseObject.DASS_Q14,
      DASS21Q15: formDatabaseObject.DASS_Q15,
      DASS21Q16: formDatabaseObject.DASS_Q16,
      DASS21Q17: formDatabaseObject.DASS_Q17,
      DASS21Q18: formDatabaseObject.DASS_Q18,
      DASS21Q19: formDatabaseObject.DASS_Q19,
      DASS21Q20: formDatabaseObject.DASS_Q20,
      DASS21Q21: formDatabaseObject.DASS_Q21,
    });

    setDASS21Scores({
      depression: formDatabaseObject.DASS_21_score.depression,
      anxiety: formDatabaseObject.DASS_21_score.anxiety,
      stress: formDatabaseObject.DASS_21_score.stess,
    });

    setDexScores({
      depression: formDatabaseObject.DEX_score_translation.depression,
      anxiety: formDatabaseObject.DEX_score_translation.anxiety,
      stress: formDatabaseObject.DEX_score_translation.stess,
      totalDividedByThree: formDatabaseObject.DEX_score_circumstances_wellbeing_mental_heath_self_care,
    });
  }
};

export default DASS21Form;
