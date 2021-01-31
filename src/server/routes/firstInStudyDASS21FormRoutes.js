const ParticipantGroups = require('../models/participantGroupModel');
const DASS21FormModels = require('../models/forms/DASS21FormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const FirstInStudyDASS21FormRoutes = express.Router();

FirstInStudyDASS21FormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_mid_study_stage_2_dass21_filled++;
      ParticipantGroup.save()
      .then(() => {
        let firstInStudyDASS21FormData = new DASS21FormModels.FirstInStudyDASS21Forms(req.body);
        firstInStudyDASS21FormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.mid_study_stage_2_dass21_completed = true;
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

FirstInStudyDASS21FormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  DASS21FormModels.FirstInStudyDASS21Forms.find({group_id: req.params.groupId}, (err, firstInStudyDASS21FormData) => {
    if (!firstInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(firstInStudyDASS21FormData);
    }
  });
});

FirstInStudyDASS21FormRoutes.route('/:groupId/:participantId').get((req, res) => {
  DASS21FormModels.FirstInStudyDASS21Forms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, firstInStudyDASS21FormData) => {
    if (!firstInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(firstInStudyDASS21FormData);
    }
  });
});

FirstInStudyDASS21FormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  DASS21FormModels.FirstInStudyDASS21Forms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, firstInStudyDASS21FormData) => {
    if (!firstInStudyDASS21FormData) {
      res.status(400).send('data is not found');
    } else {
      res.json(firstInStudyDASS21FormData);
    }
  });
});

module.exports = FirstInStudyDASS21FormRoutes;
