const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Participants = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  group_a_or_b: {
    type: String,
  },
  summary_data: {
    induction_intake_completed: {
      type: Boolean,
    },
    pre_study_dass21_completed: {
      type: Boolean,
    },
    pre_study_my_strategies_questionnaire_completed: {
      type: Boolean,
    },
    pre_study_ace_questionnaire_completed: {
      type: Boolean,
    },
    mid_study_stage_2_dass21_completed: {
      type: Boolean,
    },
    mid_study_stage_3_dass21_completed: {
      type: Boolean,
    },
    mid_study_asvb_questionnaire_completed: {
      type: Boolean,
    },
    mid_study_my_strategies_questionnaire_completed: {
      type: Boolean,
    },
    post_study_asvb_questionnaire_completed: {
      type: Boolean,
    },
  }
});

module.exports = mongoose.model('participants', Participants);
