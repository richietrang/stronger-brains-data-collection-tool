const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
require('dotenv').config({ path: '../../.env' });

const participantsRoutes = require('./routes/participantsRoutes.js');
const participantGroupsRoutes = require('./routes/participantGroupsRoutes.js');
const usersRoutes = require('./routes/userRoutes');
const inductionIntakeFormRoutes = require('./routes/inductionIntakeFormRoutes.js');
const preStudyDASS21FormRoutes = require('./routes/preStudyDASS21FormRoutes.js');
const PreStudyMyStrategiesQuestionnaireFormRoutes = require('./routes/PreStudyMyStrategiesQuestionnaireFormRoutes.js');
const ACEQuestionnaireFormRoutes = require('./routes/ACEQuestionnaireFormRoutes.js');
const FirstInStudyDASS21FormRoutes = require('./routes/firstInStudyDASS21FormRoutes.js');
const SecondInStudyDASS21FormRoutes = require('./routes/SecondInStudyDASS21FormRoutes.js');
const InStudyASVBQuestionnaireFormRoutes = require('./routes/InStudyASVBQuestionnaireFormRoutes.js');
const InStudyMyStrategiesQuestionnaireFormRoutes = require('./routes/InStudyMyStrategiesQuestionnaireFormRoutes.js');
const postStudyASVBQuestionnaireFormRoutes = require('./routes/postStudyASVBQuestionnaireFormRoutes.js');

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('mongodb database connection established successfully');
});

app.use('/participants', participantsRoutes);
app.use('/participant-groups', participantGroupsRoutes);
app.use('/induction-intake-form', inductionIntakeFormRoutes);
app.use('/pre-study-DASS-21', preStudyDASS21FormRoutes);
app.use('/pre-study-my-strategies-questionnaire', PreStudyMyStrategiesQuestionnaireFormRoutes);
app.use('/ace-questionnaire', ACEQuestionnaireFormRoutes);
app.use('/first-in-study-DASS-21', FirstInStudyDASS21FormRoutes);
app.use('/second-in-study-DASS-21', SecondInStudyDASS21FormRoutes);
app.use('/in-study-ASVB-Questionnaire', InStudyASVBQuestionnaireFormRoutes);
app.use('/in-study-my-strategies-questionnaire', InStudyMyStrategiesQuestionnaireFormRoutes);
app.use('/post-study-asvb-questionnaire', postStudyASVBQuestionnaireFormRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log('server is running on port: ' + PORT);
});
