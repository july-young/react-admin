


/**
 * 模型转换器 前后端模型适配
 */
const  Converter={

    toUser:(userVo)=>{
        let user={};
        user._id = userVo.userId
        user.username = userVo.userId
        user.role = userVo.role
        return user;
    }

} 

export default Converter;