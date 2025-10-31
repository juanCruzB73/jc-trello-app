import { ChangeEvent, useState } from "react";
import { sprintSchema } from "../schemas/sprintSchema";
import { ISprint } from "../types/pop-ups/sprints/ISprint";
import { Itask } from "../types/pop-ups/sprints/ITask";
import { ISprintErros } from "../types/errors/ISprintErrors";


interface IDataToValidate extends ISprint, Itask {}
interface IFormErrors extends ISprintErros {}

interface IValidation {
  dataToValidate: IDataToValidate;
  setButtonState: (value: boolean) => void;
  shemaName:string;
}

export const useValidate = <T extends IDataToValidate>({dataToValidate,setButtonState,shemaName}: IValidation) => { 
  
  //this function gos throw the names of the data to validate and add Error to it, title=>titleError 
  const initialErrors = Object.keys(dataToValidate).reduce((acc, key) => {
    acc[`${key}Error`] = "";
    return acc;
  }, {} as Record<string, string>);

  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(initialErrors);
  //const [formValues, setFormValues] = useState<T>(dataToValidate as T);

  // Validation function using Yup
  const validate = async () => {
      switch(shemaName){
        case "sprint":  
          try {
            await sprintSchema.validate({...dataToValidate}, { abortEarly: false });
            // reset errors if all valid  
            setErrorMessages(initialErrors);
            setButtonState(true);
          } catch (err: any) {
            const newerrors = { ...initialErrors };
            setButtonState(false);
            if (err.inner) {
              err.inner.foreach((validationerror: any) => {
                const fieldname = validationerror.path; 
                const message = validationerror.message; 
                if (fieldname) newerrors[`${fieldname}error`] = message;
              });
            }
            setErrorMessages(newerrors);
          }
        break;
        default:
          console.log("you didnt pass a schema type retard");
      }
  }

  return{
    ...initialErrors,
    ...errorMessages,
    validate
  }

}