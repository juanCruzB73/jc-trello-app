const errorsArray=["please name your sprint#title","please enter the begin line#beginLine","Invalid date format in begin line#beginLine","please enter the dead line#deadLine","Invalid date format in deadLline#deadLine","Deadline must be later that the begin line#deadLine"];
let final = {};
errorsArray.forEach(message=>{
    const errorWithField = message.split("#");
    const fieldErrorAppended=errorWithField[1].concat("Error");
    final[fieldErrorAppended]=errorWithField[0];
});
console.log(final);
