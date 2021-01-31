import React from 'react';
import { iconUrls } from '../assets/icons/iconUrls';

const styles = {
  thinListItemButtonWrapper: {
    height: '30px',
    backgroundColor: '#D4D4D4',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    paddingLeft: '15px',
    opacity: '0.7',
    fontSize: '14px',
  },
  forwardArrow: {
    position: 'absolute',
    right: '15px',
  },
  greenHighlighted: {
    backgroundColor: '#BBE1A5',
  }
}

const ThinListItemButtonComponent = ({ text, greenHighlighted }) => {
  return (
    <div style={
      greenHighlighted ? {...styles.thinListItemButtonWrapper, ...styles.greenHighlighted} : styles.thinListItemButtonWrapper
    }>
      <div style={styles.text}>{text}</div>
      <img style={styles.forwardArrow} src={iconUrls.forwardArrow} alt="go-to-participant-icon" />
    </div>
  );
};

export default ThinListItemButtonComponent;
