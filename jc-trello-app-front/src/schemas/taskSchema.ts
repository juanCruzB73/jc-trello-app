import * as yup from 'yup';
export const taskSchema =yup.object().shape ({

  title: yup.string().required("please name your task"),
  description: yup.string(),
});
