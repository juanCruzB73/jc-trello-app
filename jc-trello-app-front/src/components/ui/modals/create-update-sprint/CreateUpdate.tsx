import { FC, FormEvent, useEffect, useState } from 'react';
import styles from './createUpdate.module.css';
import { popUpStore } from '../../../../store/PopUpsStore';
import { useForm } from '../../../../hooks/useForm';
import { ISprint } from '../../../../types/pop-ups/sprints/ISprint';
import { sprintStore } from '../../../../store/SprintStore';
import { addSprint, updateSprint } from '../../../../http/sprints';
import Swal from 'sweetalert2';
import { fromStringToDate } from '../../../../utils/fromStringToDate';
import { sprintSchema } from '../../../../schemas/sprintSchema';
import { useValidate } from '../../../../hooks/useValidate';

interface ICreateUpdate{
    modalStatus:boolean;
};

interface IformErrors{
  titleError:string,
  beginLineError:string,
  endLineError:string,
}

const initialState:ISprint={
    title:"",
    beginLine:"",
    deadLine:"",
    tasks:[]
};

export const CreateUpdate:FC<ICreateUpdate> = ({modalStatus}) => {

  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const activeSprint = sprintStore((state) => (state.activeSprint));
  const setActiveSprint  = sprintStore((state) => (state.setActiveSprint ));
    
  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  const [buttonState,setButtonState]=useState(false);
  const [wasSubmited,setWasSubmited]=useState(false);

  const [initialStateEdit,setInitialStateEdit]=useState<ISprint>({
    title:activeSprint?activeSprint.title:"",
    beginLine:activeSprint?activeSprint.beginLine:"",
    deadLine:activeSprint?activeSprint.deadLine:"",
    tasks:activeSprint?activeSprint.tasks:[]
  });

  const {title,beginLine,deadLine,onInputChange,onResetForm}=useForm<ISprint>(initialStateEdit);
  
  const { validate, ...errors } = useValidate({
    dataToValidate: { title, beginLine, deadLine, tasks: [] },
    setButtonState,
    shemaName: "sprint"
});


  useEffect(() => {
      validate();
  }, [title, beginLine,deadLine]);

  const handleCrate=async()=>{
    try{
      const data={title,beginLine,deadLine,tasks:[]}
//      console.log(data);
      await addSprint(data);
    }catch(err){
      console.error(err);
    }
  };

  const handleUpdate=async()=>{
    try{
      const data:ISprint={_id:activeSprint!._id,title,beginLine,deadLine,tasks:activeSprint!.tasks}
      await updateSprint(data);
    }catch(err){
      console.error(err);
    }
  };

  const handleSubmit=async(e:FormEvent)=>{
    e.preventDefault();
    setWasSubmited(true)
    if(!activeSprint){
      await handleCrate();
      Swal.fire('Done!', 'The Sprint has been added.', 'success');
    }else{
      Swal.fire({
        title: 'Do you want to submit this?',
        text: 'continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'Cancel'
      }).then(async(result)=>{
        if (result.isConfirmed){
          Swal.fire('Done!', 'The Sprint has been updated.', 'success');
          await handleUpdate();
        }
      });
    }
    handleTogglePopUp("createeditsprint");
  }
  
  return (
    <div className={modalStatus?styles.modalMainContainer:styles.modalMainContainerNotShow}>
      <div className={styles.modalContainer}>
        <h1>{activeSprint?"Update Sprint":"Create Sprint"}</h1>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <input type="text" className={`${styles["input-field-sprint"]} ${errors.titleError && wasSubmited ? styles["input-field-sprintinput-error"]:''}`} placeholder='title' name='title' value={title} onChange={onInputChange}/>
          {errors.titleError && <span className={styles.errorMessage}>{errors.titleError}</span>}
          <input type="date" className={`${styles["input-field-sprint"]} ${errors.beginLineError && wasSubmited ? styles["input-field-sprintinput-error"]:''}`} name='beginLine' value={beginLine} onChange={onInputChange}/>
          {errors.beginLineError && <span className={styles.errorMessage}>{errors.beginLineError}</span>}
          <input type="date" name='deadLine' className={`${styles["input-field-sprint"]} ${errors.endLineError && wasSubmited ? styles["input-field-sprintinput-error"]:''}`} value={deadLine} onChange={onInputChange}/>
          {errors.endLineError && <span className={styles.errorMessage}>{errors.endLineError}</span>}
          <div className={styles.sprintsModalButtons}>
            <button type='submit' disabled={!buttonState}>Submit</button>
            <button type='button' onClick={() => {handleTogglePopUp("createeditsprint");setActiveSprint(null);onResetForm();}}>cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
