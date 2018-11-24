/* eslint-disable */
const serverUrl = 'http://localhost:4000'
const frontUrl = 'http://localhost:8080'
function emitNotification(n) {
    const idObj = {
        random: Math.random().toString(),
        id: n.id,
        link: n.link
    }
    const id = Base64.encode(JSON.stringify(idObj))
    chrome.notifications.create(id, {
        title: n.title,
        iconUrl: 'onion.png',
        type: 'basic',
        message: `点击查看来自【${n.username}】的分享`,
        contextMessage: '分享理由:' + n.description || '无',
        isClickable: true
    }, () => {});
}

function pullAndEmitNotification () {
    chrome.storage.sync.get('token', function (item) {
        if (item && item.token) {
            axios({
                method: 'get',
                url: serverUrl + '/api/notifications',
                headers: {
                    Authorization: item.token
                }
            }).then(function (resp) {
                if (resp && resp.data && resp.data.success) {
                    resp.data.data.forEach(function (a) {
                        emitNotification(a)
                    })
                }
            }).catch(function (e) {
                // alert(e.toString() + item.token)
            });
        }
    })
}

// 点击icon图片出发事件
chrome.browserAction.onClicked.addListener(function(){
        chrome.tabs.executeScript(null, {file: "script.js"});
});

// 新tab 重定向
chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.url == "chrome://newtab/") {
        setTimeout(function() {
            chrome.tabs.update(tab.id, {
                "url": frontUrl + '/#/home',
                "highlighted": true
            });
        }, 500)
    }
});

// 监听登录登出
chrome.runtime.onMessage.addListener(function(message) {
    const event = message.event
    const token = message.token
    if (event === 'signin') {
        // 存token
        // alert(token)
        chrome.storage.sync.set({'token': token}, function() {
            // alert('存储token成功：' + token)
        });
        return
    }
    if (event === 'signout') {
        chrome.storage.sync.remove('token', function() {
            // alert('删除token成功')
        });
        return
    }
});


chrome.notifications.onClicked.addListener(function (notificationId) {
    const idObj = JSON.parse(Base64.decode(notificationId))
    const win = window.open(idObj.link, '_blank');
    win.focus();
});

// 定时器拉取通知

setInterval(function () {
    pullAndEmitNotification()
}, 5000)


