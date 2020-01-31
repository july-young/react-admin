import Role from "./role";

export default interface User {
    username?: string
    _id:string,
    roles:any,
    errorMsg?:string
}