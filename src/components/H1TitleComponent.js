import React from 'react';

const styles = {
  titleText: {
    fontFamily: 'Cabin',
    color: '#EE255C',
    textAlign: 'left',
    paddingTop: '20px',
    fontWeight: 'normal',
  },
}

const H1TitleComponent = ({ titleText }) => {
  return (
    <h1 style={styles.titleText}>
      {titleText}
    </h1>
  );
};

export default H1TitleComponent;
