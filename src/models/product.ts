
export default class ProductModel {
    name?:string='';
    desc?:string;
    price?:string;
    detail:string='';
    imgs:Array<any>=Array<any>();
    status?:number;
    _id?:string;
    categoryId?:string;
    pCategoryId:string='';
}