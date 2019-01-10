

// 发送ajax 利用模板引擎渲染页面

$(function(){

    //已进入页面 就发送ajax请求
   $.ajax({
       type : "get",
       url: "/category/queryTopCategory",
       dataType : "json",
       success : function(info){
           console.log(info)
           var htmlStr = template("cateTpl",info);
           $(".lt_category_left ul").html(htmlStr);
           //已进入页面 默认在第一个 和第二级分类
           renderById(info.rows[0].id)
       }
   })

//给左侧a注册点击事件，显示二级分类 根据id的值去判断
  $(".lt_category_left").on("click","a",function(){
      //点击切换效果
      //移除所有的
      $(".lt_category_left a").removeClass("current");
      //给自己加上current类
      $(this).addClass("current");
      //获取id
      var id = $(this).data("id");
      renderById(id);
  })
  //根据一级分类id  发送ajax请求 渲染二级分类
function renderById(id){
    $.ajax({
        type:"get",
        url:"/category/querySecondCategory",
        dataType :"json",
        data:{
            id : id
        },
        success:function(info){
            console.log(info)
            var htmlStr = template("rightTpl",info);
            $(".lt_category_right ul").html(htmlStr)
        }
    })
}


})