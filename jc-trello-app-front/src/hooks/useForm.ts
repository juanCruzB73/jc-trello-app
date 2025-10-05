import { ChangeEvent, useState } from "react";

interface FormValue{
  [key:string]:string|number|null|any[];
}


export const useForm=<T extends FormValue>(initialState:T)=>{
      const [formValues,setFormValue]=useState<T>(initialState);

      const onInputChange=({target}:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        
        const {name,value}=target;
        setFormValue({
          ...formValues,
          [name]:value
        })
      };
    const onResetForm=()=>{
      setFormValue(initialState)
    }
  return {...formValues,formValues,onInputChange,onResetForm};
};

