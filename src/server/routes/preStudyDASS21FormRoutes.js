const ParticipantGroups = require('../models/participantGroupModel');
const DASS21FormModels = require('../models/forms/DASS21FormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const preStudyDASS21FormRoutes = express.Router();

preStudyDASS21FormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_pre_study_dass21_filled++;
      ParticipantGroup.save()
      .then(() => {
        let preStudyDASS21FormData = new DASS21FormModels.preStudyDASS21Forms(req.body);
        preStudyDASS21FormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.pre_study_dass21_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('pre study dass21 form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save preStudyDASS21Forms intake form');
      });
    }
  });
});

preStudyDASS21FormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  DASS21FormModels.preStudyDASS21Forms.find({group_id: req.params.groupId}, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});

preStudyDASS21FormRoutes.route('/:groupId/:participantId').get((req, res) => {
  DASS21FormModels.preStudyDASS21Forms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});

preStudyDASS21FormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  DASS21FormModels.preStudyDASS21Forms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, preStudyDASS21Forms) => {
    if (!preStudyDASS21Forms) {
      res.status(400).send('data is not found');
    } else {
      res.json(preStudyDASS21Forms);
    }
  });
});


module.exports = preStudyDASS21FormRoutes;
