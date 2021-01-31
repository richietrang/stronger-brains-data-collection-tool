import React from 'react';

const primaryColorBackground = '#E61753';
const secondaryColorBackground = '#807E7E';

const styles = {
  button: {
    backgroundColor: primaryColorBackground,
    borderRadius: '20px',
    color: 'white',
    border: 'none',
    padding: '10px 30px',
  },
  secondaryColor: {
    backgroundColor: secondaryColorBackground,
  }
}

const PrimaryButtonComponent = ({ buttonText, onClick, secondaryColor }) => {
  return (
    <div>
      <button 
        style={
          secondaryColor ? {...styles.button, ...styles.secondaryColor} : styles.button
        }
        type="button" 
        onClick={onClick}>
          {buttonText}
      </button>
    </div>
  );
};

export default PrimaryButtonComponent;
