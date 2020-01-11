
export default interface Menu{
    title:string,
    key:string,
    icon:string,
    isPublic:boolean,
    children:Array<Menu>
}

