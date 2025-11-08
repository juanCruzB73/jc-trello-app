import { useMemo, useState } from "react";
import { ISprint } from "../types/pop-ups/sprints/ISprint";
import { Itask } from "../types/pop-ups/sprints/ITask";
import { ISprintErros } from "../types/errors/ISprintErrors";
import { validationSchemas } from "../schemas/validationShemas";

interface IDataToValidate extends Partial<ISprint>, Partial<Itask> {}
interface IFormErrors extends Partial<ISprintErros> {}

interface IValidation {
  dataToValidate: IDataToValidate;
  setButtonState: (value: boolean) => void;
  schemaName: string;
  errorsArray: string[];
}

export const useValidate = <T extends IDataToValidate>({
  dataToValidate,
  setButtonState,
  schemaName,
  errorsArray
}: IValidation) => {

  const initialErrors = useMemo(() => {
    return Object.keys(dataToValidate).reduce((acc, key) => {
      acc[`${key}Error`] = "";
      return acc;
    }, {} as Record<string, string>);
  }, [dataToValidate]);
    
  const [errorMessages, setErrorMessages] = useState<IFormErrors>(initialErrors);
  
  const validate = async () => {
    const schema = validationSchemas[schemaName];
    
    if (!schema) {
      console.warn(`Schema "${schemaName}" not found`);
      return;
    }
    console.log(schema) 
    console.log(dataToValidate) 
    try {
      await schema.validate(
        { ...dataToValidate }, { abortEarly: false }
      );
      // reset errors if all valid
      console.log("no errors")
      setErrorMessages(initialErrors);
      setButtonState(true);
    } catch (err: any) {
      const newerrors = { ...initialErrors };
      setButtonState(false);
      
      if (err.errors) { 
        err.errors.forEach((validationerror: any) => {
          console.log(err.errors)
          errorsArray.forEach((message) => {
            const [errorMsg, field] = message.split("#");
            const fieldError = `${field}Error`;
            if (validationerror === errorMsg) {
              newerrors[fieldError] = validationerror;
            }
          });
        });
      }
      setErrorMessages(newerrors);
    }
  };

  return {
    ...errorMessages,
    validate
  };
};
