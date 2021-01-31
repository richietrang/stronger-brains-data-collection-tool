const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let My_Strategies_Questionnaire_Forms = new Schema({
  administrator_name: Schema.Types.String,
  update_date: Schema.Types.String,
  participant_id: Schema.Types.ObjectId,
  participant_first_name: Schema.Types.String,
  participant_last_name: Schema.Types.String,
  group_id: Schema.Types.ObjectId,
  group_name:  Schema.Types.String,
  motivation_job_rating: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  resources_job_rating: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  job_rating_justification: Schema.Types.String,
  confidence_rating: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  resources_to_manage_daily_problems_rating: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  resources_to_manage_daily_problems_rating_justification: Schema.Types.String,
  changed_knowledge_score: Schema.Types.Number,
  empowerment_score: Schema.Types.Number,
  form_completed: Schema.Types.Boolean,
});

module.exports = {
  PreStudyMyStrategiesQuestionnaireForms: mongoose.model('Pre_Study_My_Strategies_Questionnaire', My_Strategies_Questionnaire_Forms),
  InStudyMyStrategiesQuestionnaireForms: mongoose.model('In_Study_My_Strategies_Questionnaire_Forms', My_Strategies_Questionnaire_Forms),
}

