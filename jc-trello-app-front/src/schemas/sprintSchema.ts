import * as yup from 'yup';

export const sprintSchema = yup.object().shape({
    title: yup.string().required("please name your sprint"),
    beginLine: yup.string().required("please enter the begin line").test("valid-begin","Invalid date format",(value)=>!isNaN(new Date(value).getTime())),
    deadLine: yup.string().required("please enter the dead line").test("valid-begin","Invalid date format",(value)=>!isNaN(new Date(value).getTime())).test("is-after-begin","Deadline must be later that the begin line",function(value) {
        let {beginLine}=this.parent;
        if(!beginLine || !value) return true;

        const begin=new Date(beginLine);
        const deadline = new Date(value);

        return deadline>begin;
    }),
});