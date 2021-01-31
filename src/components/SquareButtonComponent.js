import React from 'react';

const styles = {
  squareButtonComponentWrapper: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '20px',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    backgroundColor: '#EEE7E7',
    cursor: 'pointer',
  },
  buttonIcon: {
    width: '30px',
    height: '30px',
  },
  buttonText: {
    fontSize: '10px',
    marginTop: '0',
  }
}

const SquareButtonComponent = ({ iconURL, iconAltText, buttonText }) => {
  return (
    <div style={styles.squareButtonComponentWrapper}>
      <div style={styles.button}>
        <img style={styles.buttonIcon} src={iconURL} alt={iconAltText} />
      </div>
      <p style={styles.buttonText}>{buttonText}</p>
    </div>
  );
};

export default SquareButtonComponent;
