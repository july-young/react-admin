
export default interface MenuModel{
    _id:string;
    title:string,
    key:string,
    icon:string,
    isPublic:boolean,
    children:Array<MenuModel>
}

