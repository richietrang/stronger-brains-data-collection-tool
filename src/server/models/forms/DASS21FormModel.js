const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DASS21_Forms = new Schema({
  administrator_name: Schema.Types.String,
  update_date: Schema.Types.String,
  participant_id: Schema.Types.ObjectId,
  participant_first_name: Schema.Types.String,
  participant_last_name: Schema.Types.String,
  group_id: Schema.Types.ObjectId,
  group_name: Schema.Types.String,
  form_completed: Schema.Types.Boolean,
  DASS_Q1: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q2: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q3: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q4: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q5: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q6: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q7: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q8: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q9: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q10: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q11: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q12: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q13: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q14: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q15: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q16: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q17: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q18: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q19: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q20: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_Q21: {
    label: Schema.Types.String,
    rating: Schema.Types.Number,
  },
  DASS_21_score: {
    depression: Schema.Types.Number,
    anxiety: Schema.Types.Number,
    stress: Schema.Types.Number,
  },
  DEX_score_translation: {
    depression: Schema.Types.Number,
    anxiety: Schema.Types.Number,
    stress: Schema.Types.Number,
  },
  DEX_score_circumstances_wellbeing_mental_heath_self_care: Schema.Types.Number,
});

module.exports = {
  preStudyDASS21Forms: mongoose.model('Pre_Study_DASS21_Forms', DASS21_Forms),
  FirstInStudyDASS21Forms: mongoose.model('First_In_Study_DASS21_Forms', DASS21_Forms),
  SecondInStudyDASS21Forms: mongoose.model('Second_In_Study_DASS21_Forms', DASS21_Forms),
}
