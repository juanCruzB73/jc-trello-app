import * as yup from 'yup';
export const taskSchema =yup.object().shape ({

  title: yup.string().required("please name your task"),
  description: yup.string(),
  deadLine: yup.string().required("please enter the dead line").test("valid-begin","Invalid date format",(value)=>!isNaN(new Date(value).getTime())),
});
