export interface DatabaseResultType {
    status : boolean,
    result? : any
}

export const ErrorMessge = Object.freeze({
    Account_Not_Exist : "Account_Not_Exist",
    Parameter_Wrong_Format : "Parameter_Wrong_Format",
    Password_Not_Fit : "Password_Not_Fit",
    Email_Not_Match : "Email_Not_Match",
    Forget_Password_Not_Allow : "Forget_Password_Not_Allow",
});