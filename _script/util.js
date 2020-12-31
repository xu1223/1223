const compareTable = {
    salesmanage: 'salesManage',
    api_admin: 'api/admin',
    api: 'api/member',
    api_auth: 'api/auth',
    api_user: 'api'
}

module.exports = (env) => { 
    const destProxy = []
    Object.entries(env).map(item => {
        const [key, target] = item
        if (key.indexOf('APP_HOST_URL') != -1) {
            const base = key.split('APP_HOST_URL_')[1].toLowerCase()
            const proxyObj = {
                target: target.toString().replace(/'/g, ''),
                changeOrigin: true,
                secure: false
            }
            if (base == 'erp') {
                destProxy.push({
                    context: ['/base', '/third', '/home', '/order', '/erp'],
                    ...proxyObj
                })
            } else {
                destProxy.push({
                    context: ['/' + (compareTable[base] || base)],
                    ...proxyObj
                })
            }
        }
    })
    return destProxy
}
