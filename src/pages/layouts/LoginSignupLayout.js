import React from 'react';
import { iconUrls } from "../../assets/icons/iconUrls";
import H3TitleComponent from "../../components/H3TitleComponent";

const styles = {
  layoutWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  bottomBackgroundImageWrapper: {
    position: 'fixed',
    bottom: '0',
    height: '350px',
    width: '100%',
    backgroundImage: `url(${iconUrls.strongerBrainsDefaultBannerCentered})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: '-10000',
  },
  bottomBackgroundImage: {
    width: '100%',
    maxHeight: '300px',
  },
  strongerBrainsLogo: {
    width: '154px',
    height: '212px',
  }
}

const LoginSignupLayout = ({ children }) => {
  return (
    <div style={styles.layoutWrapper}>
      <img style={styles.strongerBrainsLogo} src={iconUrls.strongerBrainsLogoWithTitle} alt="Stronger Brains - For Better Lives Logo" />
      <H3TitleComponent titleText="Pyschometric Data Management" />
      {children}
      <div style={styles.bottomBackgroundImageWrapper}>
      </div>
    </div>
  );
};

export default LoginSignupLayout;
