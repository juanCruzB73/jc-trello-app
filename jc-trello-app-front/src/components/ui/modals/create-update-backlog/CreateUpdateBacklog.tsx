import { FC, FormEvent, useState,useEffect } from 'react'; 
import styles from './createUpdateBacklog.module.css'; 
import { popUpStore } from '../../../../store/PopUpsStore'; 
import { useForm } from '../../../../hooks/useForm';
import { backlogStore } from '../../../../store/BacklogStore'; 
import { addBacklog, updateBacklog } from '../../../../http/backlog';
import {useValidate} from "../../../../hooks/useValidate"
import Swal from 'sweetalert2';
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';


interface ICreateUpdateBacklog{ modalStatus:boolean;
}

export const CreateUpdateBacklog:FC<ICreateUpdateBacklog> = ({modalStatus}) => {
  
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const activeBacklog = backlogStore((state) => (state.activeBacklogTasks));
  const setActiveBacklogs = backlogStore((state) => (state.setActiveBacklogTasks));
  const [buttonState,setButtonState]=useState(false);
  const [radiusState,setRadiusState]=useState("todo");

  const [initialStateEdit,setInitialStateEdit]=useState({
    title:activeBacklog?activeBacklog.title:"",
    description:activeBacklog?activeBacklog.description:"",
    deadLine:activeBacklog?activeBacklog.deadLine:"",
    state:activeBacklog?activeBacklog.state:"todo"
  }); const {title,description,deadLine,onInputChange,onResetForm}=useForm(initialStateEdit);
    
  const errorsArray=["please name your backlog#title","Invalid date format#deadLine"]; 
  const {validate,...errors}=useValidate({
      dataToValidate:{
        title,
        description,
        deadLine
      },
      setButtonState,
      schemaName:"backlog",
      errorsArray
  });
  
  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };
  
  useEffect(()=>{
    validate();
  },[title,deadLine,description]);

  const handleCrate=async()=>{
          try{
            const data={title,description,deadLine,state:radiusState}
            await addBacklog(data);
          }catch(err){
            console.error(err);
          }
        };
      
        const handleUpdate=async()=>{
          try{
            const data={_id:activeBacklog!._id,title,description,deadLine,state:radiusState}
            await updateBacklog(data);
          }catch(err){
            console.error(err);
          }
        };
        const handleSubmit=async(e:FormEvent)=>{
                e.preventDefault();
                if(!activeBacklog){
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
                handleTogglePopUp("createeditbacklog");
              }
  
  return (
    <div className={modalStatus?styles.createUpdateBacklogMainContainer:styles.createUpdateBacklogNotShow}>
        <div className={styles.createUpdateBacklogContainer}>
          <h1>{activeBacklog?"Edit backlog task":"Create backlog task"}</h1>
          <form className={styles.createeditbacklogFormContainer} onSubmit={handleSubmit}>
            <input type="text" className={`${styles["input-field-backlog"]} ${errors.titleError ? styles["input-field-backloginput-error"]:''}`} placeholder='Task Title' name='title' value={title} onChange={onInputChange}/>
           
            {errors.titleError && <span className={styles.errorMessage}>{errors.titleError}</span>}
            <input type="text" placeholder='Description (optional)' name='description' value={description} onChange={onInputChange}/>

            <div className={styles.taskModalButtons}></div>
            <div className={styles.createeditbacklogButtonContainer}>
              <button type='button' onClick={()=>{handleTogglePopUp("createeditbacklog"),setActiveBacklogs(null)}} style={{backgroundColor:"#dd2e37"}}><ImCross /></button>
              <button type='submit' style={{backgroundColor:"#2fb457"}} ><FaCheck /></button>
            </div>
          </form>
        </div>
    </div>
  )
}
