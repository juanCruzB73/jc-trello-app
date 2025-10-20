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
}

export const useValidate = <T extends IDataToValidate>({
  dataToValidate,
  setButtonState,
}: IValidation) => {
  // Create initial errors dynamically based on dataToValidate keys
  const initialErrors = Object.keys(dataToValidate).reduce((acc, key) => {
    acc[`${key}Error`] = "";
    return acc;
  }, {} as Record<string, string>);

  const [errorMessages, setErrorMessages] = useState<IFormErrors>(initialErrors as IFormErrors);
  const [formValues, setFormValues] = useState<T>(dataToValidate as T);

  // Validation function using Yup
  const validate = async () => {
    try {
      await sprintSchema.validate(formValues, { abortEarly: false });
      // Reset errors if all valid
      setErrorMessages(initialErrors as IFormErrors);
      setButtonState(true);
    } catch (err: any) {
      const newErrors = { ...initialErrors };
      setButtonState(false);

      if (err.inner) {
        
        err.inner.forEach((validationError: any) => {
          const fieldName = validationError.path; 
          const message = validationError.message; 
          if (fieldName) newErrors[`${fieldName}Error`] = message;
        });
      }

      setErrorMessages(newErrors as IFormErrors);
    }
  };

  

  return {
    formValues,
    errorMessages,
    validate,
  };
};