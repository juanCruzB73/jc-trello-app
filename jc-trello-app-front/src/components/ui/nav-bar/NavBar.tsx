import styles from './navBar.module.css';
import { FiMenu } from "react-icons/fi";
import { popUpStore } from '../../../store/PopUpsStore';

export const NavBar = () => {
  
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName);
  };

  return (
    <div className={styles.navBarMainContainer}>
      <FiMenu onClick={() => handleTogglePopUp("hamburgerbutton")} />
      <h2>TODO APP</h2>
    </div>
  );
}
