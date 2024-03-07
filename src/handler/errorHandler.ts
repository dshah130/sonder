

export function printErrorMsg(error:any):void{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode,errorMessage)
}