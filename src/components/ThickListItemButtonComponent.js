import React from 'react';
import { iconUrls } from '../assets/icons/iconUrls';

const styles = {
  thickListItemButtonContainer: {
    display: 'flex',
    width: '100%',
    margin: '10px 0',
    height: '80px',
    backgroundColor: '#E5E5E5',
    borderRadius: '2px',
    position: 'relative',
    alignItems: 'center',
  },
  nameText: {
    textAlign: 'left',
    fontSize: '16px',
    marginLeft: '15px',
  },
  forwardArrow: {
    position: 'absolute',
    right: '20px',
    top: '30px',
  },
  summaryStatisticText: {
    position: 'absolute',
    right: '5px',
    top: '0px',
    opacity: '0.6',
  },
}

const ThickListItemButtonComponent = ({ text, summaryStatisticText, greenBackground }) => {
  return (
    <div style={{...styles.thickListItemButtonContainer, backgroundColor: [greenBackground ? '#BBE1A5' : '#E5E5E5' ]}}>
        <p style={styles.nameText}>{text}</p>
      <img style={styles.forwardArrow} src={iconUrls.forwardArrow} alt="go-to-participant-icon" />
      <div style={styles.summaryStatisticText}>{summaryStatisticText}</div>
    </div>
  );
};

export default ThickListItemButtonComponent;
