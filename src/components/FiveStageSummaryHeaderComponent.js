import React, { useState } from 'react';
import { iconUrls } from '../assets/icons/iconUrls';
import history from '../history';

const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '260px',
    backgroundColor: '#FEDBD0',
    position: 'fixed',
    top: '0',
    zIndex: 10,
    fontFamily: 'WoodfordBournePro-Bold',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '24px',
    textAlign: 'left',
  },
  headerText: {
    marginLeft: '35px',
    fontSize: '32px',
    marginBottom: '0',
    maxWidth: '280px',
  },
  stageText: {
    marginLeft: '35px',
    marginTop: '10px',
    fontSize: '36px',
  },
  brainLogo: {
    width: '100px',
    height: '100px',
    position: 'absolute',
    right: '-10px',
    top: '-10px',
    zIndex: '-10',
  },
  stageSummaryContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    marginTop: '30px',
  },
  stageSummaryCircleButton: {
    borderRadius: '50%',
    border: '1px solid #6D6D6D',
    backgroundColor: 'white',
    height: '30px',
    width: '30px',
    margin: '0 15px',
    cursor: 'pointer',
  },
  stageSummaryHelpText: {
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'cabin',
    color: '#767676',
    fontSize: '14px',
  },
  dashedLine: {
    border: 'none',
    borderTop: '1px solid #767676',
    height: '1px',
    width: '270px',
    position: 'absolute',
    zIndex: '-10',
    top: '3px',
  },
  activeStageSummaryCircleButton: {
    borderRadius: '50%',
    height: '30px',
    width: '30px',
    margin: '0 15px',
    backgroundColor: '#E74D79',
    border: '1px solid #E61753',
    cursor: 'pointer',
  },
  numberTextActive: {
    color: '#E61753',
    fontFamily: 'cabin',
    fontSize: '14px',
    textAlign: 'center',
  },
  numberTextInactive: {
    color: '#6D6D6D',
    fontFamily: 'cabin',
    fontSize: '14px',
    textAlign: 'center',
  },
  backArrow: {
    marginLeft: '10px',
    cursor: 'pointer',
    position: 'absolute',
    top: '40px',
  },
}

const FiveStageSummaryHeaderComponent = ({ headerText, onStageChangeCallBack, enableBackButton }) => {
 
  const onStageSummaryCircleButtonClick = (stageNumber) => {
    onStageChangeCallBack(stageNumber);
    setStageNumber(stageNumber);
  }

  const [stageNumber, setStageNumber] = useState(1);
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
      <img style={styles.brainLogo} src={iconUrls.brainLogo} alt="stronger brains logo" />
      <p style={styles.headerText}>{headerText}</p>
      <div style={styles.stageSummaryContainer}>
        <div>
          <div 
            style={stageNumber === 1 ? styles.activeStageSummaryCircleButton : styles.stageSummaryCircleButton } 
            onClick={() => {onStageSummaryCircleButtonClick(1)}} 
          />
          <div style={stageNumber === 1 ? styles.numberTextActive : styles.numberTextInactive } >1</div>
        </div>
        <div>
          <div 
            style={stageNumber === 2 ? styles.activeStageSummaryCircleButton : styles.stageSummaryCircleButton } 
            onClick={() => {onStageSummaryCircleButtonClick(2)}}
          />
          <div style={stageNumber === 2 ? styles.numberTextActive : styles.numberTextInactive } >2</div>
        </div>
        <div>
          <div 
            style={stageNumber === 3 ? styles.activeStageSummaryCircleButton : styles.stageSummaryCircleButton } 
            onClick={() => {onStageSummaryCircleButtonClick(3)}}
          />
          <div style={stageNumber === 3 ? styles.numberTextActive : styles.numberTextInactive } >3</div>
        </div>
        <div>
          <div 
            style={stageNumber === 4 ? styles.activeStageSummaryCircleButton : styles.stageSummaryCircleButton } 
            onClick={() => {onStageSummaryCircleButtonClick(4)}} 
          />
          <div style={stageNumber === 4 ? styles.numberTextActive : styles.numberTextInactive } >4</div>
        </div>
        <div>
          <div 
            style={stageNumber === 5 ? styles.activeStageSummaryCircleButton : styles.stageSummaryCircleButton } 
            onClick={() => {onStageSummaryCircleButtonClick(5)}}
          />
          <div style={stageNumber === 5 ? styles.numberTextActive : styles.numberTextInactive } >5</div>
        </div>

        <hr style={styles.dashedLine}/>
      </div>
      <div style={styles.stageSummaryHelpText}>Navigate stage summaries</div>
    </div>
  );
};

export default FiveStageSummaryHeaderComponent;
