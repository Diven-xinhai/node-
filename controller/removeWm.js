const request = require('request')
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const dayjs = require('dayjs')
const utils = require('../utils/index')
const tool = require('../utils/tool')

// const url = "8.71 mqr:/ 复制打开抖音，看看【𝗧𝗼𝗼𝗰𝗿𝗮𝘇𝘆.的作品】请艾特出世界上最可爱的女孩子来看. https://v.douyin.com/jSB9BBr/"

/**
 * @description: start
 * @param {*} url
 */
const removeWm = ({ url }) => {
    return new Promise((resolve, reject) => {
        const httpUrl = utils.httpString(url)
        console.log(httpUrl);
        if (!httpUrl) {
            return tool.Result({
                code: '-1',
                msg: '未检测到解析地址',
                data: null
            })
        }

        if (utils.checkStr(httpUrl, 'douyin')) {
            resolve(douyin(httpUrl))
        }
    })

}

/**
 * @description: 解析抖音视频
 * @param {string} url
 * @return {*}
 */
const douyin = async (url) => {

    const _id = await getID(url, /video\/(.*)\?/, /note\/(.*)\?/);
    const _url = `https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids=${_id}`;
    const _data = await getReqBody(_url)
    console.log('接口结束');
    if (!_data.item_list.length) {
        return tool.Result({
            code: '-1',
            msg: '解析失败',
            data: null
        })
    }

    let title = _data.item_list[0].share_info.share_title,// 标题
        cover = _data.item_list[0]['video']['origin_cover']['url_list'][0],// 封面
        images = [],// 图集
        videoUrl = null, // 视频地址
        videoName = null

    if (_data.item_list[0]['images'] && _data.item_list[0]['images'].length) {// 图集
        _data.item_list[0]['images'].forEach(item => {
            images.push({
                url: item.url_list[0]
            })
        });
    } else {//视频
        const video_url_init = _data.item_list[0]['video']["play_addr"]["url_list"][0].replace('playwm', 'play');
        videoName = `${dayjs().unix()}.mp4`
        await saveVideoToFile(video_url_init, path.join(__dirname, '../public/video'), videoName).then((res) => {
            videoUrl = `${global.serveAddress}/public/video/${videoName}`
        })
    }
    return tool.Result({
        msg: '解析成功',
        data: {
            title,
            images,
            cover,
            videoUrl,
            videoName,
            relativePath: `/public/video/${videoName}`
        }
    })

}

/**
 * @description: 保存视频到服务端本地
 * @param {string} url 下载地址
 * @param {string} filePath 地址
 * @param {string} name 文件名
 * @return {Promise} Promise
 */
const saveVideoToFile = async (url, filePath, name) => {
    if (!fs.existsSync(filePath)) { // 检查是否存在某个目录
        fs.mkdirSync(filePath) // 同步创建目录
    }

    const myPath = path.resolve(filePath, name) // 拼接路径，其传参个数没有限制，每个参数均表示一段路径
    const writer = fs.createWriteStream(myPath) // createReadSream()：读取流文件    createWriteStrea()：写入流文件
    const res = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    res.data.pipe(writer) // 边读边写 节省内存
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve()) // 监听写入完成
        writer.on('error', reject())
    })
}

/**
 * @description: 客户端下载视频
 * @param {*} relativePath
 * @param {*} videoName
 * @return {Promise} Promise
 */
const downloadVideo = ({ relativePath, videoName }) => {
    const rPath = path.resolve('./') // 获取命令行目录
    return new Promise((resolve) => {
        resolve({ relativePath: rPath + utils.pathSlashToBackslash(relativePath), videoName })
    })
}

/**
 * 根据链接地址和正则规则获取相应id
 * @param {string} url 链接地址
 * @param {string} reg1 正则表达式1
 * @param {string} reg2 正则表达式2
 */
const getID = (url, reg1, reg2 = null) => {
    return new Promise((resolve) => {
        request(encodeURI(url), (error, res) => {
            try {
                if (!error && res.statusCode == 200) {
                    const check1 = res.request.href.match(reg1) ? res.request.href.match(reg1)[1] : null;
                    const check2 = res.request.href.match(reg2) ? res.request.href.match(reg2)[1] : null;
                    const result = check1 || check2;
                    resolve(result);
                } else resolve(null);
            } catch (e) {
                console.warn('getID有错误抛出：', e);
                resolve(null);
            }
        })
    })
}

/**
 * 请求抖音接口获取内容
 * @param {string} url 请求地址
 */
const getReqBody = (url) => {
    return new Promise((resolve, reject) => {
        console.log(url);
        axios.get(url, {
            headers: {
                'user-agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        }).then((res) => {
            if (res.status == 200) {
                resolve(res.data);
            } else resolve(null);
        }).catch((err) => {
            reject(null)
        })
    })
}

module.exports = {
    removeWm,
    downloadVideo
}