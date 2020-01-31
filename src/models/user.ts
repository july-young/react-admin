export default interface User {
    username?: string,
    password?:string,
    gmtCreate?:string,
    _id:string,
    roles:any,
    phone:string,
    email:string,
    errorMsg?:string
}