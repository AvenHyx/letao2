// 进度条方法初体验
// 开启进度条
//NProgress.start();

//setTimeout(function() {
//  // 结束进度条
//  NProgress.done();
//}, 500)


// 添加进度条效果:
// 1. 在第一个ajax开始发送时, 开启进度条
// 2. 在所有的ajax完成时, 结束进度条

// ajax 全局事件
// .ajaxComplete()   每个ajax完成时, 都会调用  (不管成功还是失败都调用)
// .ajaxSuccess()    每个成功的ajax, 都会调用
// .ajaxError()      每个失败的ajax, 都会调用
// .ajaxSend()       每个ajax准备发送时, 调用

// .ajaxStart()      第一个ajax发送时, 调用   (开启进度条)
// .ajaxStop()       当所有的ajax都完成时, 调用  (结束进度条)

//配置禁用小圆点
NProgress.configure({ showSpinner: false });


$(document).ajaxStart(function(){
    NProgress.start()
})

$(document).ajaxStop(function(){
    //模拟下网络延迟，但项目中不要这么做
    // setTimeout(function(){
    //    NProgress.done()
    // },500)
    NProgress.done()
    
})




//入口函数，等待当前的dom结构加载完毕后 再执行
$(function(){
//公共的功能
//1，左侧二级菜单切换功能
$(".lt_aside .category").click(function(){
    $(this).next().stop().slideToggle();
})
//2.左侧侧边栏切换功能
$(".icon_menu").click(function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
})

//3.退出功能
//点击按钮实现退出，显示模态框，  
$(".icon_logout").click(function(){
    //让模态框显示， 隐藏
    $("#logoutModal").modal("show");
})  

//点击退出按钮 发送退出请求，实现退出
$("#logoutBtn").click(function(){
    //发送ajax请求， 来退出
    $.ajax({
        type:"get",
        url:"/employee/employeeLogout",
        dataType:"json",
        success:function(info){
            if(info.success){
                location.href = "login.html"
            }
        }
     })
   })
})


















    




