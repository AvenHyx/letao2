



$(function(){

var currentId; //当前操作的用户id 通过返回数据来判断
var isDelete; //当前需要修改的用户

var currentPage = 1;
var pageSize = 5;
//发送ajax请求 动态渲染模板引擎
render();

function render(){
    $.ajax({
        url:"/user/queryUser",
        type:"get",
        dataType:"json",
        data:{
            page:currentPage,
            pageSize:pageSize
        },
        success:function(info){
            console.log(info)
           //准备数据 准备模板引擎 info是对象刚好可以直接用
           var htmlStr= template("userTpl",info);
           $("tbody").html(htmlStr);
          
           //分页初始化
           $("#paginator").bootstrapPaginator({
               //版本号
               bootstrapMajorVersion:3,
               //当前页
               currentPage:info.page,
               //总页数
               totalPages:Math.ceil(info.total/info.size),
               //添加页码点击事件
               onPageClicked:function(a,b,c,page){
                   //前三个参数必须传 用不上 拿abc来占位
                   currentPage = page;
                   render();
               }
           })
        }
    })
}

//给按钮注册点击事件 因为是动态渲染的 所以注册事件委托

$("tbody").on("click",".btn",function(){
    //让模态框弹出，
    $("#userModal").modal("show")
    //首先获取当前id  因为写在父辈上 所以找父辈的id
    currentId = $(this).parent().data("id");
    //获取当前的状态 如果是禁用按钮，判断是否有类 ，禁用0,启用1
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    console.log(isDelete)
})
    //点击确定按钮的时候发送ajax请求
    //禁用改成启用 反之，btn的文本内容做修改
$("#submitBtn").on("click",function(){
        //发送ajax请求，去修改用户状态
    $.ajax({
        url:"/user/updateUser",
        type:"post",
        data:{
            id:currentId,
            isDelete:isDelete
        },
        dataType:"json",
        success:function(info){
            console.log(info)
            if(info.success){
                //关闭模态框
                $("#userModal").modal("hide");
                //重新渲染页面
                render()
              }
           }
       })   
    })
})