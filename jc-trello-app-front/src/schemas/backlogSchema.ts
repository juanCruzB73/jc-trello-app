import * as yup from 'yup';
//title,description,deadLine
export const sprintSchema = yup.object().shape({
    title: yup.string().required("please name your backlog"),
    description: yup.string(),
    deadLine: yup.string().required("please enter the dead line").test("valid-begin","Invalid date format",(value)=>!isNaN(new Date(value).getTime())),
});