import * as yup from 'yup';

export const sprintSchema = yup.object().shape({
    title: yup.string().required("please name your sprint"),
    beginLine: yup.string().required("please enter the begin line"),
    deadLine: yup.string().required("please enter the dead line"),//add begind line + 1 hour
});