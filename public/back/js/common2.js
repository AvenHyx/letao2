


$(function(){
    //给ajax注册全局事件， 插入进度条 利用插件
   $(document).ajaxStart(function(){
       NProgress.start()
   })

   //注册结束事件
   $(document).ajaxStop(function(){
       NProgress.done()
   })




   //公共功能
   //1.二级菜单切换显示隐藏
   $('.nav .category').click(function(){
       $(this).next().stop().slideToggle()
   })
   //2.左侧侧边栏+top栏等切换
   $(".icon_menu").click(function(){
       $(".lt_aside").toggleClass("hidemenu");
       $(".lt_main").toggleClass("hidemenu");
       $(".lt_topbar").toggleClass("hidemenu");
   
   })
   //3.登录拦截，显示模态框，实现登录退出
   $(".icon_logout").click(function(){
       $('#logoutModal').modal("show");
   })
   $("#logoutBtn").click(function(){
       //实现退出登录的功能
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