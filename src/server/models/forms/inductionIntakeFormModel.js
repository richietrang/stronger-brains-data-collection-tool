const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Induction_Intake_Forms = new Schema({
  administrator_name: Schema.Types.String,
  update_date: Schema.Types.String,
  participant_id: Schema.Types.ObjectId,
  participant_first_name: Schema.Types.String,
  participant_last_name: Schema.Types.String,
  group_id: Schema.Types.ObjectId,
  group_name: Schema.Types.String,
  consent_form_submitted: Schema.Types.Boolean,
  birthday: Schema.Types.String,
  identified_gender: Schema.Types.String,
  preferred_pronoun: Schema.Types.String,
  mobile_number: Schema.Types.String,
  email: Schema.Types.String,
  street_address: Schema.Types.String,
  city: Schema.Types.String,
  state: Schema.Types.String,
  postCode: Schema.Types.String,
  emergency_contact_one_full_name: Schema.Types.String,
  emergency_contact_one_relationship: Schema.Types.String,
  emergency_contact_one_mobile: Schema.Types.String,
  emergency_contact_two_full_name: Schema.Types.String,
  emergency_contact_two_relationship: Schema.Types.String,
  emergency_contact_two_mobile: Schema.Types.String,
  identifies_as: {
    "Aboriginal": Schema.Types.Boolean,
    "Anglo-Australian": Schema.Types.Boolean,
    "Aboriginal": Schema.Types.Boolean,
    "Australian South Sea Islander": Schema.Types.Boolean,
    "Non-English Speaking": Schema.Types.Boolean,
    "Torres Strait Islander": Schema.Types.Boolean,
  },
  country_of_birth: Schema.Types.String,
  main_language_spoken_at_home: Schema.Types.String,
  living_circumstances: {
    "Partnered parent": Schema.Types.Boolean,
    "Single parent": Schema.Types.Boolean,
    "Living alone": Schema.Types.Boolean,
    "Living with a partner or spouse": Schema.Types.Boolean,
    "Living with a family": Schema.Types.Boolean,
    "Living with others not family": Schema.Types.Boolean,
    "No stable accommodation (homeless)": Schema.Types.Boolean,
  },
  disability_conditions: {
    "Intellectual/learning": Schema.Types.Boolean,
    "Sensory/Speech": Schema.Types.Boolean,
    "Psychiatric/Psychological": Schema.Types.Boolean,
  },
  how_medical_condition_is_managed: Schema.Types.String,
  comfort_reading_and_writing: Schema.Types.String,
  comfort_reading_and_writing_details: Schema.Types.String,
  general_fitness: Schema.Types.String,
  general_fitness_details: Schema.Types.String,
  drugs_and_alchohol: {
    "Alcohol": Schema.Types.Boolean,
    "Smoking": Schema.Types.Boolean,
    "Recreational drugs": Schema.Types.Boolean,
  },
  experience_with_technology: Schema.Types.String,
  access_to_technology: Schema.Types.String,
  highest_level_of_education: Schema.Types.String,
  current_education_activity: Schema.Types.String,
  education_gaps_and_obstacles: Schema.Types.String,
  education_status_affecting_independence: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  education_gap_impact: Schema.Types.String,
  employment_status: Schema.Types.String,
  current_income_stream: Schema.Types.String,
  employment_gaps_and_obstacles: Schema.Types.String,
  employment_status_affecting_independence: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  support_to_prepare_for_work: Schema.Types.String,
  employment_services_being_received: Schema.Types.String,
  how_they_found_out_about_SB: Schema.Types.String,
  access_to_transport: {
    "Personal Vehicle": Schema.Types.Boolean,
    "Borrowed Vehicle": Schema.Types.Boolean,
    "Bicycle": Schema.Types.Boolean,
    "Public Transport": Schema.Types.Boolean,
    "Shared Vehicle": Schema.Types.Boolean,
  },
  ASVB_confidence_Q1: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q2: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q3: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q4: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q5: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q6: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q7: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q8: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  ASVB_confidence_Q9: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  form_completed: Schema.Types.Boolean
});

module.exports = mongoose.model('Induction_Intake_Forms', Induction_Intake_Forms);
