import React from 'react';
import { iconUrls } from '../assets/icons/iconUrls';

const styles = {
  summaryButtonContainer: {
    display: 'flex',
    width: '100%',
    margin: '10px 0',
    height: '60px',
    backgroundColor: '#E5E5E5',
    borderRadius: '2px',
    position: 'relative',
  },
  favouriteContainer: {
    backgroundColor: '#FEDBD0',
    minWidth: '30px',
    width: '30px',
    height: '100%',
  },
  nameTextAndStageNumberBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  nameText: {
    margin: '10px 0 10px 10px',
    textAlign: 'left',
    fontSize: '13px',
  },
  stageNumberBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '10px',
  },
  stageNumberBox: {
    height: '14px',
    width: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
    fontSize: '10px',
    borderRadius: '2px',
  },
  forwardArrow: {
    position: 'absolute',
    right: '20px',
    top: '20px',
  },
}

const ParticipantSummaryButtonComponent = ({ firstName, lastName, stageCompletion }) => {
  return (
    <div style={styles.summaryButtonContainer}>
      <div style={styles.favouriteContainer}></div>
      <div style={styles.nameTextAndStageNumberBoxContainer}>
        <p style={styles.nameText}>{`${firstName} ${lastName}`}</p>
        <div style={styles.stageNumberBoxContainer}>
          {stageCompletion.map((stageCompleted, index) => {
            return (
              
              <div
                style={{...styles.stageNumberBox, backgroundColor: [stageCompleted ? '#BBE1A5' : '#CDCDCD' ]}}
                key={`${firstName} ${lastName} ${index} ${stageCompleted.toString()}`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>
      <img style={styles.forwardArrow} src={iconUrls.forwardArrow} alt="go-to-participant-icon" />
    </div>
  );
};

export default ParticipantSummaryButtonComponent;
