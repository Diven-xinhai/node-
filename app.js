const express = require('express')
const path = require('path');
const removeWmApi = require('./routers/removeWm')

const app = express()
const port = 3001
let login = true


// 将请求转换成json格式
app.use(express.json());
// 当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。 想要post请求得到值，设置extended是必须的 。
app.use(express.urlencoded({
    extended: true
}))

app.use('/', express.static('./public/h5')) // 托管静态资源，给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在)
app.use('/public', express.static('./public')) // 托管静态资源，给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在)

// 配置get请求访问静态资源
app.get('/public/*', function (req, res) {
    res.sendFile(__dirname + "/" + req.url);
    console.log("Request for " + req.url + " received.");
})

app.all("*", function (req, res, next) {
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    res.header("Content-Type", "application/json;charset=utf-8");
    // if (!login) {
    //     return response.json('未登录')
    // }
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
})

app.use('/api', removeWmApi)

const interfaces = require('os').networkInterfaces(); //服务器本机地址
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            global.IPAdress = alias.address; // global全局对象，类似于浏览器window对象
            global.serveAddress = `${alias.address}:${port}`
        }
    }
}


app.listen(port, () => {
    console.log(`listenling on ${global.IPAdress}:${port}`);
})