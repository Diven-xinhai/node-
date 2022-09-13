const fs = require('fs')

// 递归遍历目录的方法
function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }
    })
}

/**
 * @description: 解析字符串里面的url
 * @param {string} str
 * @return {string | null}
 */
const httpString = (str) => {
    let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    try {
        return str.match(reg)[0];
    } catch (error) {
        return null;
    }
}

/**
 * 检查字符创中是否有该值
 * @param {string} str 字符创
 * @param {boolean} val 检查的值
 */
const checkStr = (str, val) => {
    return str.indexOf(val) > -1;
}

/**
 * 将字符串中所有的 正斜杠(/) 替换成 反斜杠(\)
 * @param {string} str 
 * @return {string}
 */
const pathSlashToBackslash = (str) => {
    return str.replace(/\//g, "\\");
}

/**
 * 将字符串中所有的 反斜杠(\) 替换成 正斜杠(/)
 * @param {string} str 
 * @return {string}
 */
const pathBackslashToSlash = (str) => {
    return str.replace(/\\/g, "/");
}

module.exports = {
    readFileList,
    httpString,
    checkStr,
    pathSlashToBackslash,
    pathBackslashToSlash
}
