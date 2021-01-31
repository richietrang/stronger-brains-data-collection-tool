const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ACE_Questionnaire_Forms = new Schema({
  administrator_name: Schema.Types.String,
  update_date: Schema.Types.String,
  participant_id: Schema.Types.ObjectId,
  participant_first_name: Schema.Types.String,
  participant_last_name: Schema.Types.String,
  group_id: Schema.Types.ObjectId,
  section_one_statements: {
    "Your parents or guardians were separated or divorced": Schema.Types.Boolean,
    "You lived with a household member who served time in jail or prison": Schema.Types.Boolean,
    "You lived with a household member who was depressed, mentally ill or attempted suicide": Schema.Types.Boolean,
    "You saw or heard household members hurt or threaten to hurt each other": Schema.Types.Boolean,
    "A household member swore at, insulted, humiliated, or put you down in a way that scared you OR a household member acted in a way that made you afraid that you might be physically hurt": Schema.Types.Boolean,
    "Someone touched your private parts or asked you to touch their private parts in a sexual way that was unwanted, against your will, or made you feel comfortable": Schema.Types.Boolean,
    "More than once, you went without food, clothing, a place to live, or had no one to protect you": Schema.Types.Boolean,
    "Someone pushed, grabbed, slapped or threw something at yoiu OR you were hit so hard you were injured or had marks": Schema.Types.Boolean,
    "You lived with someone who had a problem with drinking or using drugs": Schema.Types.Boolean,
    "You often felt unsupported, unloved and/or unprotected": Schema.Types.Boolean,
  },
  section_two_statements: {
    "You have been in foster care": Schema.Types.Boolean,
    "You have experienced harassment or bullying at school": Schema.Types.Boolean,
    "You have lived with a parent or guardian who died": Schema.Types.Boolean,
    "You have been separated from your primary caregiver through deportation or immigration": Schema.Types.Boolean,
    "You have had a serious medical procedure of life threatening illness": Schema.Types.Boolean,
    "You have often seen or heard violence in the neighbourhood or in your school neighbourhood": Schema.Types.Boolean,
    "You have been detained, arrested or incarcerated": Schema.Types.Boolean,
    "You have been treated badly because of race, sexual orientation, place of birth, disability or religion": Schema.Types.Boolean,
    "You have expererienced verbal or physical abuse or threats from a romantic partner (i.e your boyfriend or girlfriend)": Schema.Types.Boolean,
  },
  total_section_one_statements_checked: Schema.Types.Number,
  total_section_two_statements_checked: Schema.Types.Number,
  form_completed: Schema.Types.Boolean,
});

module.exports = mongoose.model('ACE_Questionnaire_Forms', ACE_Questionnaire_Forms);
