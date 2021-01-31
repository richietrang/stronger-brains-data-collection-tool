const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ASVB_Questionnaire_Form = new Schema({
  administrator_name: Schema.Types.String,
  update_date: Schema.Types.String,
  participant_id: Schema.Types.ObjectId,
  participant_first_name: Schema.Types.String,
  participant_last_name: Schema.Types.String,
  group_id: Schema.Types.ObjectId,
  group_name: Schema.Types.String,
  employment_status: Schema.Types.String,
  current_income_stream: Schema.Types.String,
  employment_gaps_and_obstacles: Schema.Types.String,
  employment_status_affecting_independence: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  support_to_prepare_for_work: Schema.Types.String,
  employment_services_being_received: Schema.Types.String,
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
  form_completed: Schema.Types.Boolean,
});

module.exports = {
  InStudyASVBQuestionnaireForms: mongoose.model('In_Study_ASVB_Questionnaire_Forms', ASVB_Questionnaire_Form),
  PostStudyASVBQuestionnaireForms: mongoose.model('Post_Study_ASVB_Questionnaire_Forms', ASVB_Questionnaire_Form),
}
