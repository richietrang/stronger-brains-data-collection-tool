import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import H3TitleComponent from '../../components/H3TitleComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import DialogComponent from '../../components/DialogComponent';
import useGetParticipantGroups from '../../hooks/useGetParticipantGroups';
import NewSelectFormComponent from '../../components/forms/NewSelectFormComponent';
import MultiCheckBoxComponent from '../../components/forms/MultiCheckBoxComponent';
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

const AceQuestionnaireForm = (props) => {
  const {route, title} = props.location.state;
  const localStorage = window.localStorage;
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [totalSectionOneStatementsChecked, setTotalSectionOneStatementsChecked] = useState(0);
  const [totalSectionTwoStatementsChecked, setTotalSectionTwoStatementsChecked] = useState(0);

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
    sectionOneStatements: {
      'Your parents or guardians were separated or divorced': false,
      'You lived with a household member who served time in jail or prison': false,
      'You lived with a household member who was depressed, mentally ill or attempted suicide': false,
      'You saw or heard household members hurt or threaten to hurt each other': false,
      'A household member swore at, insulted, humiliated, or put you down in a way that scared you OR a household member acted in a way that made you afraid that you might be physically hurt': false,
      'Someone touched your private parts or asked you to touch their private parts in a sexual way that was unwanted, against your will, or made you feel comfortable': false,
      'More than once, you went without food, clothing, a place to live, or had no one to protect you': false,
      'Someone pushed, grabbed, slapped or threw something at yoiu OR you were hit so hard you were injured or had marks': false,
      'You lived with someone who had a problem with drinking or using drugs': false,
      'You often felt unsupported, unloved and/or unprotected': false,
    },
    sectionTwoStatements: {
      'You have been in foster care': false,
      'You have experienced harassment or bullying at school': false,
      'You have lived with a parent or guardian who died': false,
      'You have been separated from your primary caregiver through deportation or immigration': false,
      'You have had a serious medical procedure of life threatening illness': false,
      'You have often seen or heard violence in the neighbourhood or in your school neighbourhood': false,
      'You have been detained, arrested or incarcerated': false,
      'You have been treated badly because of race, sexual orientation, place of birth, disability or religion': false,
      'You have expererienced verbal or physical abuse or threats from a romantic partner (i.e your boyfriend or girlfriend)': false,
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
              deserialiseAceFormData(res.data[0]);
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

  useEffect(() => {
    const totalSectionOneStatementsChecked = Object.values(formState.sectionOneStatements).reduce((a, item) => a + (item === true ? 1 : 0), 0);
    const totalSectionTwoStatementsChecked = Object.values(formState.sectionTwoStatements).reduce((a, item) => a + (item === true ? 1 : 0), 0);
    setTotalSectionOneStatementsChecked(totalSectionOneStatementsChecked);
    setTotalSectionTwoStatementsChecked(totalSectionTwoStatementsChecked);
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

        <H3TitleComponent titleText="Section One" />
        <p style={{textAlign: 'left'}}>Of the statements in section one, tick the boxes that apply to you.</p>
        <MultiCheckBoxComponent
          label='Section One Statements'
          formStateName={'sectionOneStatements'}
          value={formState.sectionOneStatements}
          options={Object.keys(formState.sectionOneStatements)}
          onChange={onFormInputChange}
          errorState={formError.sectionOneStatements}
          errorText=""
          setFormError={onInputError}
          required
        />

        <H3TitleComponent titleText="Section Two" />
        <p style={{textAlign: 'left'}}>Of the statements in section two, tick the boxes that apply to you.</p>

        <MultiCheckBoxComponent
          label='Section Two Statements'
          formStateName={'sectionTwoStatements'}
          value={formState.sectionTwoStatements}
          options={Object.keys(formState.sectionTwoStatements)}
          onChange={onFormInputChange}
          errorState={formError.sectionTwoStatements}
          errorText=""
          setFormError={onInputError}
          required
        />
    
      <H3TitleComponent titleText="Section Summary" />
      <table>
        <thead>
          <tr>
            <th>Total Section One Statements</th>
            <th>Total Section Two Statements</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalSectionOneStatementsChecked}</td>
            <td>{totalSectionTwoStatementsChecked}</td>
          </tr>
        </tbody>
      </table>

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
        const newAceFormData = serialiseAceFormData(formState);
        if (!prefilled) {
          axios.post(`${baseURL}${route}/add`, newAceFormData)
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(err => {
            alert(err);
          });
        } else {
          axios.post(paths.updateFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, formState.participant._id, route), newAceFormData)
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
        deserialiseAceFormData(res.data[0]);
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

  function serialiseAceFormData(formState) {
    return {
      administrator_name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
      update_date: getTodaysDate(),
      participant_id: formState.participant._id,
      participant_first_name: formState.participant.first_name,
      participant_last_name: formState.participant.last_name,
      group_id: formState.participantGroup._id,
      group_name: formState.participantGroup.group_name,
      section_one_statements: formState.sectionOneStatements,
      section_two_statements: formState.sectionTwoStatements,
      total_section_one_statements_checked: totalSectionOneStatementsChecked,
      total_section_two_statements_checked: totalSectionTwoStatementsChecked,
      form_completed: true,
    }
  }

  function deserialiseAceFormData(formDatabaseObject) {
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
      sectionOneStatements: formDatabaseObject.section_one_statements,
      sectionTwoStatements: formDatabaseObject.section_two_statements,
    });

    setTotalSectionOneStatementsChecked(formDatabaseObject.total_section_one_statements_checked);
    setTotalSectionTwoStatementsChecked(formDatabaseObject.total_section_two_statements_checked);
  }
};

export default AceQuestionnaireForm;
