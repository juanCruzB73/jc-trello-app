import { ChangeEvent, useState } from "react";
import { sprintSchema } from "../schemas/sprintSchema";
import { ISprint } from "../types/pop-ups/sprints/ISprint";
import { Itask } from "../types/pop-ups/sprints/ITask";
import { ISprintErros } from "../types/errors/ISprintErrors";


interface IDataToValidate extends Partial<ISprint>, Partial<Itask> {}interface IFormErrors extends ISprintErros {}
interface IFormErrors extends Partial<ISprintErros> {}
interface IValidation {
  dataToValidate: IDataToValidate;
  setButtonState: (value: boolean) => void;
  shemaName:string;
  errorsArray:string[]
}

export const useValidate = <T extends IDataToValidate>({dataToValidate,setButtonState,shemaName,errorsArray}: IValidation) => { 
  console.log("data to validate",dataToValidate);
  
  //this function gos throw the names of the data to validate and add Error to it, title=>titleError 
  const initialErrors = Object.keys(dataToValidate).reduce((acc, key) => {
    acc[`${key}Error`] = "";
    return acc;
  }, {} as Record<string, string>);

  console.log("initial errors",initialErrors);
  

  const [errorMessages, setErrorMessages] = useState<IFormErrors>(initialErrors);
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
            if (err.errors) {
              err.errors.forEach((validationerror: any) => {
                //look for a way to make this generic
                //if (errorElement === "please name your sprint") newErrors.titleError = errorElement;
                console.log(validationerror);
                
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
