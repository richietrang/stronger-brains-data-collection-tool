import React from 'react';

const styles = {
  titleText: {
    fontFamily: 'Cabin',
    color: '#EE255C',
    textAlign: 'left',
    paddingTop: '20px',
    fontWeight: 'normal',
    marginBottom: '5px',
  },
}

const H3TitleComponent = ({ titleText }) => {
  return (
    <h2 style={styles.titleText}>
      {titleText}
    </h2>
  );
};

export default H3TitleComponent;
