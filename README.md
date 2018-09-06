# vue-iframe-demo
使用postpessage解决不同域下通信问题
# 只有vue-app.vue中的代码，其他为常用工具方法
# index.vue是与父通信的关键
#children下边的整理为常用到的：
- cache 缓存
使用方式 import cache from ''
cache.session.set('a',a)
cache.session.get('a')
- flexable 自适应整个屏幕
