import User from "./user";

interface Action {
    type?: string,
    data?:any,
    user?:User,
    errorMsg?:string
}

export default Action;