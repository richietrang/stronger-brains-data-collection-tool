
const ParticipantGroups = require('../models/participantGroupModel');
const Participants = require('../models/participantModel');
const express = require('express');
const participantsRoutes = express.Router();

participantsRoutes.route('/add').post((req, res) => {
  let participant = new Participants({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    group_a_or_b: req.body.group_a_or_b,
    summary_data: {
      induction_intake_completed: false,
      pre_study_dass21_completed: false,
      pre_study_my_strategies_questionnaire_completed: false,
      pre_study_ace_questionnaire_completed: false,
      mid_study_stage_2_dass21_completed: false,
      mid_study_stage_3_dass21_completed: false,
      mid_study_asvb_questionnaire_completed: false,
      mid_study_my_strategies_questionnaire_completed: false,
      post_study_asvb_questionnaire_completed: false,
    }
  });
  participant.save((err) => {
    if(err){
      console.log(err);
      return;
    }
    ParticipantGroups.findOne({group_name: req.body.group_name}, (err, participantGroup) => {
      if (!participantGroup) {
        res.status(400).send('data is not found');
      } else {
        participantGroup.participants_id.push(participant._id);
        participantGroup.summary_data.total_participants++;
        participantGroup.save()
        .then(participantGroup => {
          res.json('Participant added and participant group updated');
        })
        .catch(err => {
          res.status(400).send('participant group update not possible ' + err);
        });
      }
    });
  });
});

participantsRoutes.route('/get-by-id/:id').get((req, res) => {
  Participants.findById(req.params.id, (err, participant) => {
    if (err) {
      console.log(err);
    } else {
      res.json(participant);
    }
  });
});

module.exports = participantsRoutes;
