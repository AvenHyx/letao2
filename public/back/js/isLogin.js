


//登录拦截
//如果当前用户未登录，拦截到登录页
//发送ajax请求 后台来判断


$.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
        console.log(info)
        if(info.error === 400){
            location.href="login.html";
        }
        if(info.success){
            console.log("当前用户已登录")
        }
    }
})