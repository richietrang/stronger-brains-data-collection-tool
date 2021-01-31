const ParticipantGroups = require('../models/participantGroupModel');
const AVSBQuestionnaireFormModel = require('../models/forms/AVSBQuestionnaireFormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const postStudyASVBQuestionnaireFormRoutes = express.Router();

postStudyASVBQuestionnaireFormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_post_study_asvb_questionnaire_filled++;
      ParticipantGroup.save()
      .then(() => {
        let preStudyDASS21FormData = new AVSBQuestionnaireFormModel.PostStudyASVBQuestionnaireForms(req.body);
        preStudyDASS21FormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.post_study_asvb_questionnaire_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('Post-Study ASVB form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save Post-Study ASVB form');
      });
    }
  });
});

postStudyASVBQuestionnaireFormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  AVSBQuestionnaireFormModel.PostStudyASVBQuestionnaireForms.find({group_id: req.params.groupId}, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});

postStudyASVBQuestionnaireFormRoutes.route('/:groupId/:participantId').get((req, res) => {
  AVSBQuestionnaireFormModel.PostStudyASVBQuestionnaireForms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});

postStudyASVBQuestionnaireFormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  AVSBQuestionnaireFormModel.PostStudyASVBQuestionnaireForms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});


module.exports = postStudyASVBQuestionnaireFormRoutes;

