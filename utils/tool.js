module.exports = {
    /**
     * @description: 返回数据格式模板
     * @return object
     */    
    Result: ({
        code = 200,
        msg = '',
        data = {}
    }) => {
        return {
            code: code,
            msg: msg,
            data: data
        }

    }


}