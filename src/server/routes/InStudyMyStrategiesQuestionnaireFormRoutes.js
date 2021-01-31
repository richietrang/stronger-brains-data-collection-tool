const ParticipantGroups = require('../models/participantGroupModel');
const MyStrategiesQuestionnaireForms = require('../models/forms/MyStrategiesQuestionnaireFormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const InStudyMyStrategiesQuestionnaireFormRoutes = express.Router();

InStudyMyStrategiesQuestionnaireFormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_mid_study_my_strategies_questionnaire_filled++;
      ParticipantGroup.save()
      .then(() => {
        let InStudyMyStrategiesQuestionnaireFormData = new MyStrategiesQuestionnaireForms.InStudyMyStrategiesQuestionnaireForms(req.body);
        InStudyMyStrategiesQuestionnaireFormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.mid_study_my_strategies_questionnaire_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('Mid-Study My Strategies Questionnaire Form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save Mid-Study MyStrategies Questionnaire Form');
      });
    }
  });
});

InStudyMyStrategiesQuestionnaireFormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  MyStrategiesQuestionnaireForms.InStudyMyStrategiesQuestionnaireForms.find({group_id: req.params.groupId}, (err, InStudyMyStrategiesQuestionnaireFormData) => {
    if (!InStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(InStudyMyStrategiesQuestionnaireFormData);
    }
  });
});

InStudyMyStrategiesQuestionnaireFormRoutes.route('/:groupId/:participantId').get((req, res) => {
  MyStrategiesQuestionnaireForms.InStudyMyStrategiesQuestionnaireForms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, InStudyMyStrategiesQuestionnaireFormData) => {
    if (!InStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(InStudyMyStrategiesQuestionnaireFormData);
    }
  });
});

InStudyMyStrategiesQuestionnaireFormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  MyStrategiesQuestionnaireForms.InStudyMyStrategiesQuestionnaireForms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, InStudyMyStrategiesQuestionnaireFormData) => {
    if (!InStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(InStudyMyStrategiesQuestionnaireFormData);
    }
  });
});


module.exports = InStudyMyStrategiesQuestionnaireFormRoutes;
