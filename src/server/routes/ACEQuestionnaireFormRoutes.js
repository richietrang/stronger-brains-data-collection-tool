const ParticipantGroups = require('../models/participantGroupModel');
const ACEQuestionnaireForms = require('../models/forms/aceQuestionnaireFormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const ACEQuestionnaireFormRoutes = express.Router();

ACEQuestionnaireFormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_pre_study_ace_questionnaire_filled++;
      ParticipantGroup.save()
      .then(() => {
        let AceQuestionnaireFormData = new ACEQuestionnaireForms(req.body);
        AceQuestionnaireFormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.pre_study_ace_questionnaire_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('Pre-Study ACE Questionnaire Form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save Pre-Study ACE Questionnaire Form');
      });
    }
  });
});

ACEQuestionnaireFormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  ACEQuestionnaireForms.find({group_id: req.params.groupId}, (err, AceQuestionnaireFormData) => {
    if (!AceQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(AceQuestionnaireFormData);
    }
  });
});

ACEQuestionnaireFormRoutes.route('/:groupId/:participantId').get((req, res) => {
  ACEQuestionnaireForms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, AceQuestionnaireFormData) => {
    if (!AceQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(AceQuestionnaireFormData);
    }
  });
});

ACEQuestionnaireFormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  ACEQuestionnaireForms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, AceQuestionnaireFormData) => {
    if (!AceQuestionnaireFormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(AceQuestionnaireFormData);
    }
  });
});

module.exports = ACEQuestionnaireFormRoutes;
