const fs = require('fs');
const path = require('path');

// 读取环境变量的文件把它转化成对象
module.exports = (file) => { // flie为文件路径
    const fileName = path.join(__dirname, file);
    const data = fs.readFileSync(fileName, { encoding: 'utf8' })
    const restData = data.replace(/\r/g, ',').replace(/\n/g, '') // 把换行和回车替换
    const arr = restData.split(',').map(item => {
        return item.split('=')
    })
    const obj = {}
    arr.forEach(item => {
        if (item[1] && item[0]) {
            obj[item[0].replace(/\s+/g, '')] = item[1].replace(/\s+/g,'')
        }
    })
    return obj
}