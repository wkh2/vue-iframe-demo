// 监听浏览器后退按钮

const browserDetectBack = {
    init(callbackFn) {
        // 监听hash change事件
        window.addEventListener('hashchange', function(event) {
            console.log('isBack event', browserDetectBack.isBack)
            // 为当前导航页附加一个tag
            // 异步触发
            setTimeout(_ => {
                history.replaceState('hasHash', '', '');
            })
            if (browserDetectBack.isBack) {
                browserDetectBack.isBack = false;
                if (typeof callbackFn === 'function') {
                    callbackFn();
                }
            }
        }, false);

        // 监听popstate事件
        window.addEventListener('popstate', function(e) {
            if (e.state) {
                // 侦测是用户触发的后退操作, do something
                browserDetectBack.isBack = true
            }
        }, false);
    },
    isBack: false
}

export default browserDetectBack
