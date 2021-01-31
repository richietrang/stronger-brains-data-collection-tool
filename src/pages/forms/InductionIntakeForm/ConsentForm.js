import React from 'react';
import H3TitleComponent from '../../../components/H3TitleComponent';

const styles = {
  consentFormContainer: {
    textAlign: 'left',
  }
}

const ConsentForm = () => {
  return (
    <div style={styles.consentFormContainer}>
      <H3TitleComponent
        titleText='Consent Form'
      />
      <b>Statement to Participant</b>
      <p>Rewire the Brain (RTB) is a training program that aims to improve cognitive function and social and emotional skills in VET students or young people looking for employment. The program utilises cutting-edge neuroplasticity training to empower individuals to reach their full potential. Over a series of weeks, participants will be guided through brain training, skill-building and mentoring by our Stronger Brains team.</p>
      <p>Program participants will have the chance to build on their personal strengths to improve their cognitive function and social and emotional skills which will provide them with greater mental control and increased capacity for self-regulation. Through achieving these outcomes, students will be more likely to re-engage and remain engaged in education, increasing their likelihood of gaining and sustaining employment. As part of the induction process, I’m going to now be asking you some questions, we will get you to complete a few questionnaires and then will talk you through the program in more detail. </p>
      <p>The information that you provide on this form includes your personal information. Your personal information is protected by law, including the Privacy Act 1988. Your personal information collected on this form is used primarily for DSS (Department of Social Service who funds the program) reporting purposes. Stronger Brains will also be utilising your data to study and learn more about the impact of these types of programs on improving outcomes for young people. For the purposes of this study no identifiable data will be used.</p>
      <a href="https://docdro.id/5erYdNd" target="_blank" rel="noopener noreferrer">Consent Form</a>
    </div>
  );
};

export default ConsentForm;
