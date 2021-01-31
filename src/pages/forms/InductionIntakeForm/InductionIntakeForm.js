import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import H3TitleComponent from '../../../components/H3TitleComponent';
import PrimaryButtonComponent from '../../../components/PrimaryButtonComponent';
import DialogComponent from '../../../components/DialogComponent';
import useGetParticipantGroups from '../../../hooks/useGetParticipantGroups';
import CheckBoxComponent from '../../../components/forms/CheckBoxComponent';
import DatePickerComponent from '../../../components/forms/DatePickerComponent';
import NewSelectFormComponent from '../../../components/forms/NewSelectFormComponent';
import MultiStageFormStepperComponent from '../../../components/forms/MultiStageFormStepperComponent';
import TextFieldFormComponent from '../../../components/forms/TextFieldFormComponent';
import MultiCheckBoxComponent from '../../../components/forms/MultiCheckBoxComponent';
import SliderFormComponent from '../../../components/forms/SliderFormComponent';
import { validatorEnum } from "../../../utility/validatorEnum";
import { baseURL } from '../../../server/serverConfig';
import ConsentForm from './ConsentForm';
import countries from "countries-list";
import axios from 'axios';
import { paths, dBcollectionBasePath } from '../../../server/paths';
import { Prompt } from 'react-router-dom';

const countryCodes = Object.keys(countries.countries);
const countryNames = countryCodes.map(code => countries.countries[code].name);
const languageCodes = Object.keys(countries.languages);
const languageNames = languageCodes.map(code => countries.languages[code].name);
const localStorage = window.localStorage;
const loggedInUser = JSON.parse(localStorage.getItem('user'));

const InductionIntakeForm = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [requiredFieldsErrorModal, setRequiredFieldsErrorModal] = useState({
    state: false,
    title: '',
    text: '',
  });
  const participantGroups = useGetParticipantGroups();
  const [participants, setParticipants] = useState([]);
  const [formStageNumber, setFormStageNumber] = useState(0);
  const [prefilled, setPrefilled] = useState(false);

  const stageOneRequiredFields = ['participantGroup', 'participant', 'consentFormSubmitted'];
  const stageTwoRequiredFields = ['birthday', 'identifiedGender', 'preferredPronoun', 'mobileNumber', 'email', 'streetAddress', 'city',
    'state', 'postCode', 'emergencyContactOneFullName', 'emergencyContactOneRelationship', 'emergencyContactOneMobile',
    'emergencyContactTwoFullName', 'emergencyContactTwoRelationship', 'emergencyContactTwoMobile',
    'countryOfBirth', 'mainLanguageSpokenAtHome',
    'comfortReadingAndWriting', 'comfortReadingAndWritingDetails', 'generalFitness', 'generalFitnessDetails',
    'experienceWithTechnology', 'accessToTechnology'];

  const stageTwoRequiredMultiCheckBox = ['livingCircumstances'];
  const stageThreeRequiredFields = ['highestLevelOfEducation', 'educationStatusAffectingIndependence', 'employmentStatus', 'supportToPrepareForWork',
    'currentIncomeStream', 'employmentStatusAffectingIndependence', 'howTheyFoundOutAboutSB',
    'ASVBConfidenceQ1', 'ASVBConfidenceQ2', 'ASVBConfidenceQ3', 'ASVBConfidenceQ4', 'ASVBConfidenceQ5', 'ASVBConfidenceQ6',
    'ASVBConfidenceQ7', 'ASVBConfidenceQ8', 'ASVBConfidenceQ9'];

  const stageThreeRequiredMultiCheckBox = ['accessToTransport'];

  const [formState, setFormState] = useState({
    // Stage 1 Fields
    dataCollector: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
    dateFormAddedOrModified: getTodaysDate(),
    participantGroup: {},
    participant: {},
    consentFormSubmitted: false,
    // Stage 2 Fields
    birthday: '',
    identifiedGender: '',
    preferredPronoun: '',
    mobileNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    postCode: '',
    emergencyContactOneFullName: '',
    emergencyContactOneRelationship: '',
    emergencyContactOneMobile: '',
    emergencyContactTwoFullName: '',
    emergencyContactTwoRelationship: '',
    emergencyContactTwoMobile: '',
    identifiesAs: {
      'Aboriginal': false,
      'Anglo-Australian': false,
      'Australian South Sea Islander': false,
      'Non-English Speaking': false,
      'Torres Strait Islander': false,
    },
    countryOfBirth: '',
    mainLanguageSpokenAtHome: '',
    livingCircumstances: {
      'Partnered parent': false,
      'Single parent': false,
      'Living alone': false,
      'Living with a partner or spouse': false,
      'Living with a family': false,
      'Living with others not family': false,
      'No stable accommodation (homeless)': false,
    },
    disabilityConditions: {
      'Intellectual/learning': false,
      'Sensory/Speech': false,
      'Australian South Sea Islander': false,
      'Psychiatric/Psychological': false,
    },
    howMedicalConditionIsManaged: '',
    comfortReadingAndWriting: '',
    comfortReadingAndWritingDetails: '',
    generalFitness: '',
    generalFitnessDetails: '',
    drugsAndAlchohol: {
      'Alcohol': false,
      'Smoking': false,
      'Recreational drugs': false,
    },
    experienceWithTechnology: '',
    accessToTechnology: '',
    // Stage 3 Fields
    highestLevelOfEducation: '',
    currentEducationActivity: '',
    EducationGapsAndObstacles: '',
    educationStatusAffectingIndependence: {
      label: 'How has your education affected your ability to be independent?',
      rating: 0,
    },
    educationGapImpact: '',
    employmentStatus: '',
    currentIncomeStream: '',
    EmploymentGapsAndObstacles: '',
    employmentStatusAffectingIndependence: '',
    supportToPrepareForWork: '',
    employmentServicesBeingReceived: '',
    howTheyFoundOutAboutSB: '',
    accessToTransport: {
      'Personal Vehicle': false,
      'Borrowed Vehicle': false,
      'Bicycle': false,
      'Public Transport': false,
      'Shared Vehicle': false,
    },
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
        axios.get(paths.getFormDataMatchingParticipantGroupAndParticipantId(participantGroupId, participantId, dBcollectionBasePath.inductionIntakeForm))
          .then(res => {
            if (res.data[0]) {
              setFormState(deserialiseInductionIntakeFormData(res.data[0]));
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
      <HeaderComponent headerText="Induction Intake Form" enableBackButton />
      <div style={styles.contentWrapper}>
        <MultiStageFormStepperComponent
          stepsText={['Consent Form', 'Participant Data', 'Education and Employment']}
          formStageNumber={formStageNumber}
        />
        {formStageNumber === 0 &&
          <>
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

            <ConsentForm />
            <CheckBoxComponent
              formStateName="consentFormSubmitted"
              value={formState.consentFormSubmitted}
              label="Consent form signed and questions answered"
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.IS_TRUE}
              errorState={formError.consentFormSubmitted}
              errorText="Check this box after your participant has filled the consent form to continue"
              setFormError={onInputError}
              defaultValue={prefilled ? true : false}
              required
            />
          </>
        }

        {formStageNumber === 1 &&
          <>
            <DatePickerComponent
              formStateName="birthday"
              value={formState.birthday}
              label="1. Birthday"
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorState={formError.birthday}
              errorText="Please enter a valid birthday"
              setFormError={onInputError}
              required
            />

            <NewSelectFormComponent
              label="2. Identified Gender"
              formStateName="identifiedGender"
              value={formState.identifiedGender}
              onChange={onFormInputChange}
              errorState={formError.identifiedGender}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['male', 'female', 'transMale', 'transFemale', 'other']}
              required
            />

            <NewSelectFormComponent
              label="3. Preferred Pronoun"
              formStateName="preferredPronoun"
              value={formState.preferredPronoun}
              onChange={onFormInputChange}
              errorState={formError.preferredPronoun}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['he', 'she', 'they', 'other']}
              required
            />

            <TextFieldFormComponent
              formStateName="mobileNumber"
              value={formState.mobileNumber}
              label="4. Mobile Number"
              onChange={onFormInputChange}
              errorState={formError.mobileNumber}
              validatorMethod={validatorEnum.IS_AUS_MOBILE_NUMBER}
              errorText="Please enter a valid mobile number"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="email"
              value={formState.email}
              label="5. email"
              onChange={onFormInputChange}
              errorState={formError.email}
              validatorMethod={validatorEnum.IS_EMAIL}
              errorText="Please enter a valid email"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="streetAddress"
              value={formState.streetAddress}
              label="6. Street Address"
              onChange={onFormInputChange}
              errorState={formError.streetAddress}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid street address"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="city"
              value={formState.city}
              label="7. City"
              onChange={onFormInputChange}
              errorState={formError.city}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid city"
              setFormError={onInputError}
              required
            />

            <NewSelectFormComponent
              label="8. State"
              formStateName="state"
              value={formState.state}
              onChange={onFormInputChange}
              errorState={formError.state}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['NSW', 'VIC', 'QLD', 'WA', 'NT', 'SA', 'TAS']}
              required
            />

            <TextFieldFormComponent
              formStateName="postCode"
              value={formState.postCode}
              label="9. Post Code"
              onChange={onFormInputChange}
              errorState={formError.postCode}
              validatorMethod={validatorEnum.IS_AUS_POST_CODE}
              errorText="Please enter a valid 4 digit post code"
              setFormError={onInputError}
              required
            />

            <p>Emergency Contact One</p>

            <TextFieldFormComponent
              formStateName="emergencyContactOneFullName"
              value={formState.emergencyContactOneFullName}
              label="10. Full Name"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactOneFullName}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid full name"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="emergencyContactOneRelationship"
              value={formState.emergencyContactOneRelationship}
              label="11. Relationship"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactOneRelationship}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid relationship"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="emergencyContactOneMobile"
              value={formState.emergencyContactOneMobile}
              label="12. Mobile Number"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactOneMobile}
              validatorMethod={validatorEnum.IS_AUS_MOBILE_NUMBER}
              errorText="Please enter a valid mobile number"
              setFormError={onInputError}
              required
            />

            <p>Emergency Contact Two</p>

            <TextFieldFormComponent
              formStateName="emergencyContactTwoFullName"
              value={formState.emergencyContactTwoFullName}
              label="13. Full Name"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactTwoFullName}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid full name"
              setFormError={onInputError}
              required
            />


            <TextFieldFormComponent
              formStateName="emergencyContactTwoRelationship"
              value={formState.emergencyContactTwoRelationship}
              label="14. Relationship"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactTwoRelationship}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please enter a valid relationship"
              setFormError={onInputError}
              required
            />

            <TextFieldFormComponent
              formStateName="emergencyContactTwoMobile"
              value={formState.emergencyContactTwoMobile}
              label="15. Mobile Number"
              onChange={onFormInputChange}
              errorState={formError.emergencyContactTwoMobile}
              validatorMethod={validatorEnum.IS_AUS_MOBILE_NUMBER}
              errorText="Please enter a valid mobile number"
              setFormError={onInputError}
              required
            />

            <MultiCheckBoxComponent
              label='16. Identifies as'
              value={formState.identifiesAs}
              formStateName={'identifiesAs'}
              options={['Aboriginal', 'Anglo-Australian', 'Australian South Sea Islander', 'Non-English Speaking', 'Torres Strait Islander']}
              onChange={onFormInputChange}
              errorState={formError.identifiesAs}
              errorText="Please enter at least one checkbox"
              setFormError={onInputError}
            />

            <NewSelectFormComponent
              label="17. Country of Birth"
              formStateName="countryOfBirth"
              value={formState.countryOfBirth}
              onChange={onFormInputChange}
              errorState={formError.countryOfBirth}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={countryNames}
              required
            />

            <NewSelectFormComponent
              label="18. Main Language Spoken at Home"
              formStateName="mainLanguageSpokenAtHome"
              value={formState.mainLanguageSpokenAtHome}
              onChange={onFormInputChange}
              errorState={formError.mainLanguageSpokenAtHome}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={languageNames}
              required
            />

            <MultiCheckBoxComponent
              label='19. Living Circumstances'
              formStateName={'livingCircumstances'}
              value={formState.livingCircumstances}
              options={['Partnered parent', 'Single parent', 'Living alone', 'Living with a partner or spouse', 'Living with a family', 'Living with others not family', 'No stable accommodation (homeless)']}
              onChange={onFormInputChange}
              errorState={formError.livingCircumstances}
              errorText="Please enter at least one checkbox"
              setFormError={onInputError}
              required
            />

            <MultiCheckBoxComponent
              label='20. Identify as having one or more of the following conditions'
              formStateName={'disabilityConditions'}
              value={formState.disabilityConditions}
              options={['Intellectual/learning', 'Sensory/Speech', 'Psychiatric/Psychological']}
              onChange={onFormInputChange}
              errorState={formError.disabilityConditions}
              errorText="Please enter at least one checkbox"
              setFormError={onInputError}
            />
            <p style={styles.longFormQuestionLabel}>21. If you have a medication condition, how is it managed?</p>
            <TextFieldFormComponent
              formStateName="howMedicalConditionIsManaged"
              value={formState.howMedicalConditionIsManaged}
              label="21. Management strategies"
              onChange={onFormInputChange}
              errorState={formError.howMedicalConditionIsManaged}
              validatorMethod={validatorEnum.NO_VALIDATION}
              errorText=""
              setFormError={onInputError}
            />

            <NewSelectFormComponent
              label="22. Comfort Reading and Writing"
              formStateName="comfortReadingAndWriting"
              value={formState.comfortReadingAndWriting}
              onChange={onFormInputChange}
              errorState={formError.comfortReadingAndWriting}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Good', 'average', 'poor']}
              required
            />

            <TextFieldFormComponent
              formStateName="comfortReadingAndWritingDetails"
              value={formState.comfortReadingAndWritingDetails}
              label="Literacy Ability Details"
              onChange={onFormInputChange}
              errorState={formError.comfortReadingAndWritingDetails}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText=""
              setFormError={onInputError}
              required
            />

            <NewSelectFormComponent
              label="23. General Fitness"
              formStateName="generalFitness"
              value={formState.generalFitness}
              onChange={onFormInputChange}
              errorState={formError.generalFitness}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Good', 'average', 'poor']}
              required
            />

            <TextFieldFormComponent
              formStateName="generalFitnessDetails"
              value={formState.generalFitnessDetails}
              label="Fitness Details"
              onChange={onFormInputChange}
              errorState={formError.generalFitnessDetails}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText=""
              setFormError={onInputError}
              required
            />


            <MultiCheckBoxComponent
              label='24. Participate in the following?'
              formStateName={'drugsAndAlchohol'}
              value={formState.drugsAndAlchohol}
              options={['Alcohol', 'Smoking', 'Recreational drugs']}
              onChange={onFormInputChange}
              errorState={formError.drugsAndAlchohol}
              errorText="Please enter at least one checkbox"
              setFormError={onInputError}
            />

            <NewSelectFormComponent
              label="25. Experience with computer and phone?"
              formStateName="experienceWithTechnology"
              value={formState.experienceWithTechnology}
              onChange={onFormInputChange}
              errorState={formError.experienceWithTechnology}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Good', 'Average', 'Poor']}
              required
            />

            <NewSelectFormComponent
              label="26. Access to computer and phone?"
              formStateName="accessToTechnology"
              value={formState.accessToTechnology}
              onChange={onFormInputChange}
              errorState={formError.accessToTechnology}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Easy access', 'Generally accessible', 'Difficult to access', 'Inaccessible']}
              required
            />
          </>
        }

        {formStageNumber === 2 &&
          <>
            <H3TitleComponent titleText="Education" />
            <NewSelectFormComponent
              label="1. Highest level of education completed"
              value={formState.highestLevelOfEducation}
              formStateName="highestLevelOfEducation"
              onChange={onFormInputChange}
              errorState={formError.highestLevelOfEducation}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please select a field"
              setFormError={onInputError}
              selectOptions={['Year 10/11', 'Year 12', 'Certificate I/II', 'Certificate III/IV', 'Diploma/Advanced Diploma',
                'Bachelor Degree', 'Graduate certificate/diploma', 'Masters Degree', 'PhD']}
              required
            />

            <TextFieldFormComponent
              formStateName="currentEducationActivity"
              value={formState.currentEducationActivity}
              label="2. Current Education Activity"
              onChange={onFormInputChange}
              errorState={formError.currentEducationActivity}
              validatorMethod={validatorEnum.NO_VALIDATION}
              errorText=""
              setFormError={onInputError}
            />

            <TextFieldFormComponent
              formStateName="EducationGapsAndObstacles"
              value={formState.EducationGapsAndObstacles}
              label="3. Describe education gaps and obstacles"
              onChange={onFormInputChange}
              errorState={formError.EducationGapsAndObstacles}
              validatorMethod={validatorEnum.NO_VALIDATION}
              errorText=""
              setFormError={onInputError}
              multiline
            />

            <SliderFormComponent
              formStateName="educationStatusAffectingIndependence"
              value={formState.educationStatusAffectingIndependence}
              label="4. How education status has affected independence?"
              onChange={onFormInputChange}
              validatorMethod={validatorEnum.NOT_ZERO}
              errorState={formError.educationStatusAffectingIndependence}
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

            <H3TitleComponent titleText="Other" />
            <p style={styles.longFormQuestionLabel}>11. How did you hear about the Rewire the Brain Program?</p>
            <TextFieldFormComponent
              formStateName="howTheyFoundOutAboutSB"
              value={formState.howTheyFoundOutAboutSB}
              label="Discovery method"
              onChange={onFormInputChange}
              errorState={formError.howTheyFoundOutAboutSB}
              validatorMethod={validatorEnum.IS_NOT_EMPTY}
              errorText="Please write a valid response"
              setFormError={onInputError}
              required
            />

            <MultiCheckBoxComponent
              label='12. Transport Options'
              formStateName={'accessToTransport'}
              value={formState.accessToTransport}
              options={['Personal Vehicle', 'Borrowed Vehicle', 'Bicycle', 'Public Transport', 'Shared Vehicle']}
              onChange={onFormInputChange}
              errorState={formError.accessToTransport}
              errorText="Please enter at least one checkbox"
              setFormError={onInputError}
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
          </>
        }

        <div style={styles.buttonWrapper}>
          {formStageNumber !== 0 && formStageNumber !== 3 &&
            <PrimaryButtonComponent onClick={previousFormStage} buttonText="Back" />
          }
          {formStageNumber !== 2 && formStageNumber !== 3 &&
            <PrimaryButtonComponent onClick={nextFormStage} buttonText="Next" />
          }
        </div>

        {formStageNumber === 2 &&
          <div style={styles.buttonWrapper}>
            <PrimaryButtonComponent onClick={handleSubmit} buttonText={`${!prefilled ? 'Submit form data' : 'Update form data'}`} />
          </div>
        }

        {formState.participant && formState.participant.first_name && formState.participant.last_name &&
          <DialogComponent
            dialogTitle={`Induction intake form successfully ${!prefilled ? 'added' : 'updated.'}`}
            dialogText={`Induction intake form ${!prefilled ? 'added' : 'updated.'} for ${formState.participant.first_name} ${formState.participant.last_name}.`}
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

  function checkRequiredMultiCheckboxSet(...requiredFields) {
    let allRequiredFieldsSet = true;
    let updatedFormErrorState = formError;
    requiredFields.forEach(formField => {
      if (Object.values(formState[formField]).every(val => val === false)) {
        updatedFormErrorState[formField] = true;
        allRequiredFieldsSet = false;
      }
    });
    setFormError({ ...updatedFormErrorState });
    return allRequiredFieldsSet;
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

    axios.get(paths.getFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, participant[0]._id, dBcollectionBasePath.inductionIntakeForm))
    .then(res => {
      if (res.data[0]) {
        setFormState(
        deserialiseInductionIntakeFormData(res.data[0]));
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
    let multiCheckBoxRequiredFieldsSet = checkRequiredMultiCheckboxSet(...stageThreeRequiredMultiCheckBox);
    if (checkRequiredFieldsSet(...stageThreeRequiredFields) && multiCheckBoxRequiredFieldsSet) {
      if (!Object.values(formError).includes(true)) {
        setFormStageNumber(3);
        setFormChanged(false);
        const newInductionIntakeFormData = serialiseInductionIntakeFormData(formState);
        if (!prefilled) {
          axios.post(`${baseURL}/induction-intake-form/add/`, newInductionIntakeFormData)
          .then((res) => {
            setDialogOpen(true);
          })
          .catch(err => {
            alert(err);
          });
        } else {
          axios.post(paths.updateFormDataMatchingParticipantGroupAndParticipantId(formState.participantGroup._id, formState.participant._id, dBcollectionBasePath.inductionIntakeForm), newInductionIntakeFormData)
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

  function nextFormStage() {
    switch (formStageNumber) {
      case 0:
        if (checkRequiredFieldsSet(...stageOneRequiredFields)) {
          setRequiredFieldsErrorModal({
            ...requiredFieldsErrorModal,
            state: false,
          });
          setFormStageNumber(formStageNumber + 1);
        } else {
          setRequiredFieldsErrorModal({
            state: true,
            title: 'Oh snap!',
            text: 'Please fill all missing required fields',
          });
        }
        return;
      case 1:
        let multiCheckBoxRequiredFieldsSet = checkRequiredMultiCheckboxSet(...stageTwoRequiredMultiCheckBox);
        if (checkRequiredFieldsSet(...stageTwoRequiredFields) && multiCheckBoxRequiredFieldsSet) {
          setFormStageNumber(formStageNumber + 1);
          setRequiredFieldsErrorModal({
            ...requiredFieldsErrorModal,
            state: false,
          });
        } else {
          setRequiredFieldsErrorModal({
            state: true,
            title: 'Oh snap!',
            text: 'Please fill all missing required fields',
          });
        }
        return;
      default:
    }
  }

  function previousFormStage() {
    if (formStageNumber > 0) {
      setFormStageNumber(formStageNumber - 1);
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

  function serialiseInductionIntakeFormData(formData) {
    return {
      administrator_name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
      update_date: getTodaysDate(),
      participant_id: formData.participant._id,
      participant_first_name: formData.participant.first_name,
      participant_last_name: formData.participant.last_name,
      group_id: formData.participantGroup._id,
      group_name: formData.participantGroup.group_name,
      consent_form_submitted: formData.consentFormSubmitted,
      birthday: formData.birthday,
      identified_gender: formData.identifiedGender,
      preferred_pronoun: formData.preferredPronoun,
      mobile_number: formData.mobileNumber,
      email: formData.email,
      street_address: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      postCode: formData.postCode,
      emergency_contact_one_full_name: formData.emergencyContactOneFullName,
      emergency_contact_one_relationship: formData.emergencyContactOneRelationship,
      emergency_contact_one_mobile: formData.emergencyContactOneMobile,
      emergency_contact_two_full_name: formData.emergencyContactTwoFullName,
      emergency_contact_two_relationship: formData.emergencyContactTwoRelationship,
      emergency_contact_two_mobile: formData.emergencyContactTwoRelationship,
      identifies_as: formData.identifiesAs,
      country_of_birth: formData.countryOfBirth,
      main_language_spoken_at_home: formData.mainLanguageSpokenAtHome,
      living_circumstances: formData.livingCircumstances,
      disability_conditions: formData.disabilityConditions,
      how_medical_condition_is_managed: formData.howMedicalConditionIsManaged,
      comfort_reading_and_writing: formData.comfortReadingAndWriting,
      comfort_reading_and_writing_details: formData.comfortReadingAndWritingDetails,
      general_fitness: formData.generalFitness,
      general_fitness_details: formData.generalFitnessDetails,
      drugs_and_alchohol: formData.drugsAndAlchohol,
      experience_with_technology: formData.experienceWithTechnology,
      access_to_technology: formData.accessToTechnology,
      highest_level_of_education: formData.highestLevelOfEducation,
      current_education_activity: formData.currentEducationActivity,
      education_gaps_and_obstacles: formData.education_gaps_and_obstacles,
      education_status_affecting_independence: formData.educationStatusAffectingIndependence,
      education_gap_impact: formData.education_gap_impact,
      employment_status: formData.employmentStatus,
      current_income_stream: formData.currentIncomeStream,
      employment_gaps_and_obstacles: formData.EmploymentGapsAndObstacles,
      employment_status_affecting_independence: formData.employmentStatusAffectingIndependence,
      support_to_prepare_for_work: formData.supportToPrepareForWork,
      employment_services_being_received: formData.employmentServicesBeingReceived,
      how_they_found_out_about_SB: formData.howTheyFoundOutAboutSB,
      access_to_transport: formData.accessToTransport,
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

  function deserialiseInductionIntakeFormData(formDatabaseObject) {
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
      consentFormSubmitted: formDatabaseObject.consent_form_submitted,
      birthday: formDatabaseObject.birthday,
      identifiedGender: formDatabaseObject.identified_gender,
      preferredPronoun: formDatabaseObject.preferred_pronoun,
      mobileNumber: formDatabaseObject.mobile_number,
      email: formDatabaseObject.email,
      streetAddress: formDatabaseObject.street_address,
      city: formDatabaseObject.city,
      state: formDatabaseObject.state,
      postCode: formDatabaseObject.postCode,
      emergencyContactOneFullName: formDatabaseObject.emergency_contact_one_full_name,
      emergencyContactOneRelationship: formDatabaseObject.emergency_contact_one_relationship,
      emergencyContactOneMobile: formDatabaseObject.emergency_contact_one_mobile,
      emergencyContactTwoFullName: formDatabaseObject.emergency_contact_two_full_name,
      emergencyContactTwoRelationship: formDatabaseObject.emergency_contact_two_relationship,
      emergencyContactTwoMobile: formDatabaseObject.emergency_contact_two_mobile,
      identifiesAs: formDatabaseObject.identifies_as,
      countryOfBirth: formDatabaseObject.country_of_birth,
      mainLanguageSpokenAtHome: formDatabaseObject.main_language_spoken_at_home,
      livingCircumstances: formDatabaseObject.living_circumstances,
      disabilityConditions: formDatabaseObject.disability_conditions,
      howMedicalConditionIsManaged: formDatabaseObject.how_medical_condition_is_managed,
      comfortReadingAndWriting: formDatabaseObject.comfort_reading_and_writing,
      comfortReadingAndWritingDetails: formDatabaseObject.comfort_reading_and_writing_details,
      generalFitness: formDatabaseObject.general_fitness,
      generalFitnessDetails: formDatabaseObject.general_fitness_details,
      drugsAndAlchohol: formDatabaseObject.drugs_and_alchohol,
      experienceWithTechnology: formDatabaseObject.experience_with_technology,
      accessToTechnology: formDatabaseObject.access_to_technology,
      highestLevelOfEducation: formDatabaseObject.highest_level_of_education,
      currentEducationActivity: formDatabaseObject.current_education_activity,
      EducationGapsAndObstacles: formDatabaseObject.education_gaps_and_obstacles,
      educationStatusAffectingIndependence: formDatabaseObject.education_status_affecting_independence,
      educationGapImpact: formDatabaseObject.education_gap_impact,
      employmentStatus: formDatabaseObject.employment_status,
      currentIncomeStream: formDatabaseObject.current_income_stream,
      EmploymentGapsAndObstacles: formDatabaseObject.employment_gaps_and_obstacles,
      employmentStatusAffectingIndependence: formDatabaseObject.employment_status_affecting_independence,
      supportToPrepareForWork: formDatabaseObject.support_to_prepare_for_work,
      employmentServicesBeingReceived: formDatabaseObject.employment_services_being_received,
      howTheyFoundOutAboutSB: formDatabaseObject.how_they_found_out_about_SB,
      accessToTransport: formDatabaseObject.access_to_transport,
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

  function getTodaysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
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

export default InductionIntakeForm;
