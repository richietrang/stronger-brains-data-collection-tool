import React from 'react';
import { iconUrls } from '../assets/icons/iconUrls';
import history from '../history';

const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '60px',
    backgroundColor: '#FEDBD0',
    position: 'fixed',
    top: '0',
    zIndex: 10,
    fontFamily: 'WoodfordBournePro-Bold',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '24px',
  },
  backArrow: {
    marginLeft: '10px',
    cursor: 'pointer',
  },
}

const HeaderComponent = ({ headerText, enableBackButton }) => {
  return (
    <div style={styles.headerContainer}>
      {enableBackButton &&
        <img 
          style={styles.backArrow} 
          src={iconUrls.backArrow} 
          alt="back arrow" 
          onClick={() => history.goBack()}
        />
      }
      <p style={enableBackButton ? {marginLeft: '15px'} : {marginLeft: '35px'}}>{headerText}</p>
    </div>
  );
};

export default HeaderComponent;
