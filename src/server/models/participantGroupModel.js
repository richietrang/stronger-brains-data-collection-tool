const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Participant_Groups = new Schema({
  group_name: {
    type: String,
  },
  group_description: {
    type: String,
  },
  summary_data : {
    total_participants: {
      type: Number,
    },
    total_induction_intake_filled: {
      type: Number,
    },
    total_pre_study_dass21_filled: {
      type: Number,
    },
    total_pre_study_my_strategies_questionnaire_filled: {
      type: Number,
    },
    total_pre_study_ace_questionnaire_filled: {
      type: Number,
    },
    total_mid_study_stage_2_dass21_filled: {
      type: Number,
    },
    total_mid_study_stage_3_dass21_filled: {
      type: Number,
    },
    total_mid_study_asvb_questionnaire_filled: {
      type: Number,
    },
    total_mid_study_my_strategies_questionnaire_filled: {
      type: Number,
    },
    total_post_study_asvb_questionnaire_filled: {
      type: Number,
    },
  },
  participants_id: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Participant_Groups', Participant_Groups);
