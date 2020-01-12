
export default interface MenuModel{
    title:string,
    key:string,
    icon:string,
    isPublic:boolean,
    children:Array<MenuModel>
}

