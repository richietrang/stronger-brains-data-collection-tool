const ParticipantGroups = require('../models/participantGroupModel');
const InductionIntakeForms = require('../models/forms/inductionIntakeFormModel');
const Participants = require('../models/participantModel');
const express = require('express');
const inductionIntakeFormRoutes = express.Router();

inductionIntakeFormRoutes.route('/add').post((req, res) => {
  ParticipantGroups.findById(req.body.group_id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      ParticipantGroup.summary_data.total_induction_intake_filled++;
      ParticipantGroup.save()
      .then(() => {
        let inductionIntakeFormData = new InductionIntakeForms(req.body);
        inductionIntakeFormData.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          Participants.findById(req.body.participant_id, (err, Participant) => {
            Participant.summary_data.induction_intake_completed = true;
            Participant.save()
            .then(() => {
              res.status(200).send('induction intake form successfully added');
            })
          });
        });
      })
      .catch(() => {
        console.log('Unable to save induction intake form');
      });
    }
  });
});


inductionIntakeFormRoutes.route('/get-form-data-from-group-id/:groupId').get((req, res) => {
  InductionIntakeForms.find({group_id: req.params.groupId}, (err, inductionIntakeForms) => {
    if (!inductionIntakeForms) {
      res.status(400).send('data is not found');
    } else {
      res.json(inductionIntakeForms);
    }
  });
});

inductionIntakeFormRoutes.route('/:groupId/:participantId').get((req, res) => {
  InductionIntakeForms.find({group_id: req.params.groupId, participant_id: req.params.participantId}, (err, inductionIntakeForms) => {
    if (!inductionIntakeForms) {
      res.status(400).send('data is not found');
    } else {
      res.json(inductionIntakeForms);
    }
  });
});

inductionIntakeFormRoutes.route('/update/:groupId/:participantId').post((req, res) => {
  InductionIntakeForms.updateOne({group_id: req.params.groupId, participant_id: req.params.participantId}, req.body, (err, inductionIntakeForms) => {
    if (!inductionIntakeForms) {
      res.status(400).send('data is not found');
    } else {
      res.json(inductionIntakeForms);
    }
  });
});


module.exports = inductionIntakeFormRoutes;
