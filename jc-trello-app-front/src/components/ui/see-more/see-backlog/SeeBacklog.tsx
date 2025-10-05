import { FC } from 'react';
import styles from './seeBacklog.module.css';
import { backlogStore } from '../../../../store/BacklogStore';
import { popUpStore } from '../../../../store/PopUpsStore';

interface ISeeBacklog{
    modalStatus:boolean;
}

export const SeeBacklog:FC<ISeeBacklog> = ({modalStatus}) => {

    const activeBacklog = backlogStore((state) => (state.activeBacklogTasks));
    const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
    

    const handleTogglePopUp = (popUpName: string) => {
        setChangePopUpStatus(popUpName); 
      };

    return (
      <div className={modalStatus?styles.seeBacklogMainContainer:styles.seeBacklogMainContainerNotShow}>
        <div className={styles.seeBacklogContainer}>
            <h2>Title: {activeBacklog?.title}</h2>
            <h3>Description: {activeBacklog?.description}</h3>
            <h3>Dead line: {activeBacklog?.deadLine}</h3>
            <button type='button' onClick={()=>{handleTogglePopUp("seebacklog")}}>Cancel</button>
        </div>
      </div>
    )
}
