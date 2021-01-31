const ParticipantGroups = require('../models/participantGroupModel');
const DASS21FormModels = require('../models/forms/DASS21FormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const SecondInStudyDASS21FormRoutes = express.Router();

SecondInStudyDASS21FormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_mid_study_stage_3_dass21_filled++;
      ParticipantGroup.save()
      .then(() => {
        let secondInStudyDASS21FormData = new DASS21FormModels.SecondInStudyDASS21Forms(req.body);
        secondInStudyDASS21FormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.mid_study_stage_3_dass21_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('First In study dass21 form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save first in Study DASS21 Form');
      });
    }
  });
});

SecondInStudyDASS21FormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  DASS21FormModels.SecondInStudyDASS21Forms.find({group_id: req.params.groupId}, (err, secondInStudyDASS21FormData) => {
    if (!secondInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(secondInStudyDASS21FormData);
    }
  });
});

SecondInStudyDASS21FormRoutes.route('/:groupId/:participantId').get((req, res) => {
  DASS21FormModels.SecondInStudyDASS21Forms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, secondInStudyDASS21FormData) => {
    if (!secondInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(secondInStudyDASS21FormData);
    }
  });
});

SecondInStudyDASS21FormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  DASS21FormModels.SecondInStudyDASS21Forms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, secondInStudyDASS21FormData) => {
    if (!secondInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(secondInStudyDASS21FormData);
    }
  });
});

module.exports = SecondInStudyDASS21FormRoutes;
