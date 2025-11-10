import * as yup from 'yup';
//title,description,deadLine
export const backlogSchema = yup.object().shape({
    title: yup.string().required("please name your backlog"),
    description: yup.string(),
});
