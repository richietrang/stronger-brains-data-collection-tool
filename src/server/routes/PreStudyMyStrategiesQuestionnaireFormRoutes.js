const ParticipantGroups = require('../models/participantGroupModel');
const MyStrategiesQuestionnaireForms = require('../models/forms/MyStrategiesQuestionnaireFormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const PreStudyMyStrategiesQuestionnaireFormRoutes = express.Router();

PreStudyMyStrategiesQuestionnaireFormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_pre_study_my_strategies_questionnaire_filled++;
      ParticipantGroup.save()
      .then(() => {
        let preStudyMyStrategiesQuestionnaireFormData = new MyStrategiesQuestionnaireForms.PreStudyMyStrategiesQuestionnaireForms(req.body);
        preStudyMyStrategiesQuestionnaireFormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.pre_study_my_strategies_questionnaire_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('Pre-Study My Strategies Questionnaire Form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save Pre-Study MyStrategies Questionnaire Form');
      });
    }
  });
});

PreStudyMyStrategiesQuestionnaireFormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  MyStrategiesQuestionnaireForms.PreStudyMyStrategiesQuestionnaireForms.find({group_id: req.params.groupId}, (err, preStudyMyStrategiesQuestionnaireFormData) => {
    if (!preStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyMyStrategiesQuestionnaireFormData);
    }
  });
});

PreStudyMyStrategiesQuestionnaireFormRoutes.route('/:groupId/:participantId').get((req, res) => {
  MyStrategiesQuestionnaireForms.PreStudyMyStrategiesQuestionnaireForms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, preStudyMyStrategiesQuestionnaireFormData) => {
    if (!preStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyMyStrategiesQuestionnaireFormData);
    }
  });
});

PreStudyMyStrategiesQuestionnaireFormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  MyStrategiesQuestionnaireForms.PreStudyMyStrategiesQuestionnaireForms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, preStudyMyStrategiesQuestionnaireFormData) => {
    if (!preStudyMyStrategiesQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyMyStrategiesQuestionnaireFormData);
    }
  });
});


module.exports = PreStudyMyStrategiesQuestionnaireFormRoutes;
