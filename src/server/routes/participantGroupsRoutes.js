const ParticipantGroups = require('../models/participantGroupModel');
const Participants = require('../models/participantModel');
const express = require('express');
const participantGroupsRoutes = express.Router();

participantGroupsRoutes.route('/').get((req, res) => {
  ParticipantGroups.find((err, ParticipantGroups)=> {
    if (err) {
      console.log(err);
    } else {
      res.json(ParticipantGroups);
    }
  });
});

participantGroupsRoutes.route('/get-by-id/:id').get((req, res) => {
  ParticipantGroups.findById(req.params.id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      res.json(ParticipantGroup);
    }
  });
});

participantGroupsRoutes.route('/get-participants-by-group-id/:id').get((req, res) => {
  ParticipantGroups.findById(req.params.id, (err, ParticipantGroup) => {
    if (err) {
      console.log(err);
    } else {
      Participants.find({_id : {$in: ParticipantGroup.participants_id}}, (err, Participants) => {
        if (err) {
          console.log(err);
        } else {
          res.json(Participants);
        }
      })
    }
  });
});

participantGroupsRoutes.route('/update-by-id/:id').post((req, res) => {
  ParticipantGroups.findById(req.params.id, (err, ParticipantGroup) => {
    if (!ParticipantGroup) {
      res.status(400).send('data is not found');
    } else {
      ParticipantGroup.group_name = req.body.group_name;
      ParticipantGroup.group_description = req.body.group_description;
      ParticipantGroup.save()
      .then(ParticipantGroup => {
        res.json('ParticipantGroup updated');
      })
      .catch(err => {
        res.status(400).send('Update not possible');
      })
    }
  });
});

participantGroupsRoutes.route('/delete-by-id/:id').post((req, res) => {
  ParticipantGroups.deleteOne({_id: req.params.id}, err => {
    if (err) {
      res.json(err);
    } else {
      res.json({deleted: 'true'});
    }
  })
});

participantGroupsRoutes.route('/add').post((req, res) => {
  let participantGroup = new ParticipantGroups({
    group_name: req.body.group_name,
    group_description: req.body.group_description,
    participants_id: req.body.participants_id,
    summary_data : {
      total_participants: 0,
      total_induction_intake_filled: 0,
      total_pre_study_dass21_filled: 0,
      total_pre_study_my_strategies_questionnaire_filled: 0,
      total_pre_study_ace_questionnaire_filled: 0,
      total_mid_study_stage_2_dass21_filled: 0,
      total_mid_study_stage_3_dass21_filled: 0,
      total_mid_study_asvb_questionnaire_filled: 0,
      total_mid_study_my_strategies_questionnaire_filled: 0,
      total_post_study_asvb_questionnaire_filled: 0,
    },
  });
  participantGroup.save((err) => {
    if(err){
      console.log(err);
      return;
  }
    res.status(200).json({participantGroup: 'participantGroup added successfully'});
  });
});

module.exports = participantGroupsRoutes;
