import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import ThinListItemButtonComponent from '../components/ThinListItemButtonComponent';
import { Link } from 'react-router-dom';
import { dBcollectionBasePath } from '../server/paths';


const styles = {
  contentWrapper: {
    padding: '0 10%',
    marginTop: '100px',
    marginBottom: '80px',
  },
  subheading: {
    textAlign: 'left',
    color: '#EE255C',
    fontFamily: 'Cabin',
    fontSize: '24px',
    margin: '35px 0 14px 0',
  },
  noLinkTextDecoration: {
    textDecoration: 'none',
    color: 'black',
  },
}

const QuickFillPage = () => {
  return (
    <>
      <HeaderComponent headerText="Quick fill" />
      <div style={styles.contentWrapper}>

        <Link to="/new-participant-group" style={styles.noLinkTextDecoration}>
          <ThinListItemButtonComponent text="Add new participant group"/>
        </Link>

        <Link to="/new-participant" style={styles.noLinkTextDecoration}>
          <ThinListItemButtonComponent text="Add new participant"/>
        </Link>

        <div style={styles.subheading}> Stage 1 Forms</div>
        <Link to="/induction-intake-form" style={styles.noLinkTextDecoration}>
          <ThinListItemButtonComponent text="Induction Intake"/>
        </Link>

        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.preStudyDASS21,
            state: {
              route: dBcollectionBasePath.preStudyDASS21,
              title: 'Pre-Study DASS21 Form',
            }
          }}
          >
          <ThinListItemButtonComponent text="Pre-study DASS-21"/>
        </Link>
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.preStudyMyStrategiesQuestionnaire,
            state: {
              route: dBcollectionBasePath.preStudyMyStrategiesQuestionnaire,
              title: 'Pre-study My Strategies Questionnaire',
            }
          }}
          >
          <ThinListItemButtonComponent text="Pre-study My Strategies Questionnaire"/>
        </Link>

        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.aceQuestionnaire,
            state: {
              route: dBcollectionBasePath.aceQuestionnaire,
              title: 'Pre-study ACE Questionnaire',
            }
          }}
          >
          <ThinListItemButtonComponent text="Pre-study ACE Questionnaire"/>
        </Link>
        
        <div style={styles.subheading}> Stage 2 Forms</div>
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.firstInStudyDASS21,
            state: {
              route: dBcollectionBasePath.firstInStudyDASS21,
              title: 'Mid-Study Stage 2 DASS21 Form',
            }
          }}
          >
          <ThinListItemButtonComponent text="Mid-Study Stage 2 DASS-21"/>
        </Link>

        <div style={styles.subheading}> Stage 3 Forms</div>
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.secondInStudyDASS21,
            state: {
              route: dBcollectionBasePath.secondInStudyDASS21,
              title: 'Mid-Study Stage 3 DASS21 Form',
            }
          }}
          >
          <ThinListItemButtonComponent text="Mid-Study Stage 3 DASS-21"/>
        </Link>
        

        <div style={styles.subheading}> Stage 4 Forms</div>
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.inStudyASVBQuestionnaire,
            state: {
              route: dBcollectionBasePath.inStudyASVBQuestionnaire,
              title: 'Mid-study AVSB Questionnaire',
            }
          }}
          >
          <ThinListItemButtonComponent text="Mid-study AVSB Questionnaire"/>
        </Link>
        
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.inStudyMyStrategiesQuestionnaire,
            state: {
              route: dBcollectionBasePath.inStudyMyStrategiesQuestionnaire,
              title: 'Mid-study My Strategies Questionnaire',
            }
          }}
          >
          <ThinListItemButtonComponent text="Mid-study My Strategies Questionnaire"/>
        </Link>
        

        <div style={styles.subheading}> Stage 5 Forms</div>
        <Link 
          style={styles.noLinkTextDecoration}
          to={{
            pathname: dBcollectionBasePath.postStudyASVBQuestionnaire,
            state: {
              route: dBcollectionBasePath.postStudyASVBQuestionnaire,
              title: 'Post-study AVSB Questionnaire',
            }
          }}
          >
          <ThinListItemButtonComponent text="Post-study AVSB Questionnaire"/>
        </Link>
      </div>
    </>
  );
};

export default QuickFillPage;
