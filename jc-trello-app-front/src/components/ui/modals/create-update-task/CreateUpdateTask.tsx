import { FC, FormEvent, useState,useEffect } from 'react';
import { Itask } from '../../../../types/pop-ups/sprints/ITask';
import styles from './createUpdateTask.module.css';
import { popUpStore } from '../../../../store/PopUpsStore';
import { useForm } from '../../../../hooks/useForm';
import { addTask, updateTask } from '../../../../http/tasks';
import { taskStore } from '../../../../store/TaskStore';
import {useValidate} from "../../../../hooks/useValidate"
import Swal from 'sweetalert2';

interface ICreateUpdateTask{
    modalStatus:boolean;
};

export const CreateUpdateTask:FC<ICreateUpdateTask> = ({modalStatus}) => {
    
    const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
    const activeTask = taskStore((state) => (state.activeTask));
    const setActiveTask = taskStore((state) => (state.setActiveTask));
    const [initialStateEdit,setInitialStateEdit]=useState({
          title:activeTask?activeTask.title:"",
          description:activeTask?activeTask.description:"",
          deadLine:activeTask?activeTask.deadLine:"",
    });

    const {title,description,deadLine,onInputChange,onResetForm}=useForm(initialStateEdit);
    
    const handleTogglePopUp = (popUpName: string) => {
        setChangePopUpStatus(popUpName); 
    };

    const handleCrate=async()=>{
        try{
          const data={title,description,deadLine,state:"todo"}
          await addTask(data);
        }catch(err){
          console.error(err);
        }
      };
    
      const handleUpdate=async()=>{
        try{
          const data={_id:activeTask!._id,title,description,deadLine,state:activeTask?.state}
          await updateTask(data);
        }catch(err){
          console.error(err);
        }
      };
    
      const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault();
        if(!activeTask){
          await handleCrate();
          Swal.fire('Done!', 'The Task has been added.', 'success');
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
                await handleUpdate();
                Swal.fire('Done!', 'The Task has been updated.', 'success');
              }
          });
        }
        handleTogglePopUp("createedittask")
      }
  const errorsArray=["please name your task#title","please enter the dead line#deadLine","Invalid date format#deadLine"]
  const [buttonState,setButtonState]=useState(false); 
  const {validate,...errors}=useValidate({
      dataToValidate:{
        title,
        description,
        deadLine
      },
      setButtonState,
      schemaName:"task",
      errorsArray
  });

  useEffect(()=>{
   console.log(errors);
   validate(); 
  },[title,description,deadLine])


    return (
      <div className={modalStatus?styles.taskModalMainConainer:styles.taskModalMainConainerNotShow}>
          <div className={styles.taskModalContainer}>
              <h1>{activeTask?"Update task":"Create task"}</h1>
              <form className={styles.taskModalForm} onSubmit={handleSubmit}>
                  <input type="text" name='title' value={title} onChange={onInputChange} placeholder='title'/>

            {errors.titleError && <span className={styles.errorMessage}>{errors.titleError}</span>}
                  <input type="text" name='description' value={description} onChange={onInputChange} placeholder='description' />
                  <input type="date" name='deadLine' value={deadLine} onChange={onInputChange}/>
                  
            {errors.deadLineError && <span className={styles.errorMessage}>{errors.deadLineError}</span>}
                  <div className={styles.taskModalButtons}>
                      <button>Send</button>
                      <button type='button' onClick={() => {onResetForm();setActiveTask(null);handleTogglePopUp("createedittask")}}>cancel</button>
                  </div>    
              </form>  
          </div>
      </div>
    )
}
