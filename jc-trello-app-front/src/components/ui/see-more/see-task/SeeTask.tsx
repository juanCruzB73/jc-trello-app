import { FC } from 'react';
import styles from'./seeTask.module.css';
import { taskStore } from '../../../../store/TaskStore';
import { popUpStore } from '../../../../store/PopUpsStore';

interface ISeeTask{
    modalStatus:boolean;
}

export const SeeTask:FC<ISeeTask> = ({modalStatus}) => {

    const activeTask = taskStore((state) => (state.activeTask));
      const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
      
  
      const handleTogglePopUp = (popUpName: string) => {
          setChangePopUpStatus(popUpName); 
        };

  return (
    <div className={modalStatus?styles.seeTaskMainContainer:styles.seeTaskMainContainerNotShow}>
      <div className={styles.seeTaskContainer}>
          <h2>Title: {activeTask?.title}</h2>
          <h3>Description: {activeTask?.description}</h3>
          <h3>Dead line: {activeTask?.deadLine}</h3>
          <button type='button' onClick={()=>{handleTogglePopUp("seetask")}}>Cancel</button>
      </div>
    </div>
  )
}
