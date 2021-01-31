import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Switch, useLocation } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import history from './history';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import HomePage from './pages/HomePage';
import ParticipantsPage from './pages/ParticipantsPage';
import QuickFillPage from './pages/QuickFillPage';
import NewParticipantGroupPage from './pages/NewParticipantGroupPage';
import EditParticipantGroupPage from './pages/EditParticipantGroupPage';
import NewParticipantPage from './pages/NewParticipantPage';
import FormSummaryPage from './pages/FormSummaryPage';
import ParticipantProfilePage from './pages/ParticipantProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserAdminPage from './pages/UserAdminPage';

import InductionIntakeForm from './pages/forms/InductionIntakeForm/InductionIntakeForm';
import DASS21Form from './pages/forms/DASS21Form';
import MyStrategiesQuestionnaireForm from './pages/forms/MyStrategiesQuestionnaireForm';
import ACEQuestionnaireForm from './pages/forms/ACEQuestionnaireForm';
import ASVBQuestionnaireForm from './pages/forms/ASVBQuestionnaireForm';

import { iconUrls } from './assets/icons/iconUrls';

const useMaterialUIStyles = makeStyles({
  label: {
    color: 'black',
    fontSize: '10px',
    marginTop: '3px',
  },
  selected: {
    color: '#E61753',
  },
});

const styles = {
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
}

function App() {
  const [activeNavigationIndex, setActiveNavigationIndex] = useState(0);
  const bottomNavigationActionStyles = useMaterialUIStyles();
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data.tokens));
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthTokens(data);
  }

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveNavigationIndex(0);
    } else if (location.pathname === '/participants') {
      setActiveNavigationIndex(1);
    } else if (location.pathname === '/quick-fill') {
      setActiveNavigationIndex(2);
    } else if (location.pathname === '/profile') {
      setActiveNavigationIndex(3);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <div className="App">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/sign-up" component={SignUpPage} />
            <PrivateRoute path="/" exact component={HomePage} />
            <PrivateRoute path="/participants" component={ParticipantsPage} />
            <PrivateRoute path="/quick-fill" component={QuickFillPage} />
            <PrivateRoute path="/edit/:id" component={EditPage} />
            <PrivateRoute path="/create/" component={CreatePage} />
            <PrivateRoute path="/new-participant-group" component={NewParticipantGroupPage} />
            <PrivateRoute path="/new-participant" component={NewParticipantPage} />
            <PrivateRoute path="/edit-participant-group/:id" component={EditParticipantGroupPage} />
            <PrivateRoute path="/form-summary-page" component={FormSummaryPage} />
            <PrivateRoute path="/participant-profile/:id" component={ParticipantProfilePage} />
            <PrivateRoute path="/user-admin" component={UserAdminPage} />

            <PrivateRoute path="/induction-intake-form" component={InductionIntakeForm} />
            <PrivateRoute path="/pre-study-DASS-21" component={DASS21Form} />
            <PrivateRoute path="/pre-study-my-strategies-questionnaire" component={MyStrategiesQuestionnaireForm} />
            <PrivateRoute path="/ace-questionnaire" component={ACEQuestionnaireForm} />
            <PrivateRoute path="/first-in-study-dass-21" component={DASS21Form} />
            <PrivateRoute path="/in-study-asvb-questionnaire" component={ASVBQuestionnaireForm} />
            <PrivateRoute path="/in-study-my-strategies-questionnaire" component={MyStrategiesQuestionnaireForm} />
            <PrivateRoute path="/post-study-asvb-questionnaire" component={ASVBQuestionnaireForm} />
            <PrivateRoute path="/second-in-study-dass-21" component={DASS21Form} />
          </Switch>

        <div style={styles.stickToBottom}>
          {
            JSON.parse(localStorage.getItem('tokens')) &&
            <BottomNavigation
              value={activeNavigationIndex}
              onChange={(event, newNavigationIndex) => {
                setActiveNavigationIndex(newNavigationIndex);
              }}
              showLabels
            >
              <BottomNavigationAction
                label="Home"
                icon={<img alt="home icon" src={activeNavigationIndex === 0 ? iconUrls.homeActive : iconUrls.home} />}
                classes={bottomNavigationActionStyles}
                onClick={() => history.push('/')}
              />
              <BottomNavigationAction
                label="Participants"
                icon={<img alt="participants icon" src={activeNavigationIndex === 1 ? iconUrls.participantsActive : iconUrls.participants} />}
                classes={bottomNavigationActionStyles}
                onClick={() => history.push('/participants')}
              />
              <BottomNavigationAction
                label="Quick Fill"
                icon={<img alt="fill icon" src={activeNavigationIndex === 2 ? iconUrls.quickFillActive : iconUrls.quickFill} />}
                classes={bottomNavigationActionStyles}
                onClick={() => history.push('/quick-fill')}
              />

              <BottomNavigationAction
                label="User Admin"
                icon={<img alt="Profile" src={activeNavigationIndex === 3 ? iconUrls.profileActive : iconUrls.profile} />}
                classes={bottomNavigationActionStyles}
                onClick={() => history.push('/user-admin')}
              />
              </BottomNavigation>
          }
        </div>
      </div>
    </AuthContext.Provider>
  );
}
export default App;
