

// 配置mui
mui(".mui-scroll-wrapper").scroll({
    deceleration : 0.0005, //flick减速系数，系数越大，滚动速度减慢
    indicators: false //是否显示滚动条
})

//获得slider插件对象
var  gallery = mui(".mui-slider");
gallery.slider({
    interval : 3000 //自动轮播周期，若为0 则不自动播放，默认为0
})   