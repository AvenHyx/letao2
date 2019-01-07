

//动态渲染模板，发送ajax请求的

$(function(){


    var currentPage = 1;
    var pageSize = 5;
     //页面渲染的ajax请求
    render()
    //1. 封装页面渲染的函数 方便复用
    function render(){
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            data:{
                page : currentPage,
                pageSize : pageSize
            },
            type: "get",
            success : function (info ){
                console.log(info)
                var htmlStr = template("secondTpl",info);
                // console.log(htmlStr)
                $("tbody").html(htmlStr)
                //进行分页渲染
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion : 3,
                    currentPage : info.page,
                    totalPages : Math.ceil( info.total / info.size),
                    onPageClicked : function(a, b, c, page){
                        currentPage = page;
                        render()
                    }
                })
            }
        })
    }

    //2. 点击添加分类按钮，显示模态框 并发送ajax请求
   $("#addBtn").click(function(){
       $("#addModal").modal("show")
       $.ajax({
           url : "/category/queryTopCategoryPaging",
           post : "get",
           data : {
               page : 1,
               pageSize :100
           },
           success : function(info){
               var htmlStr = template("cateTpl", info);
               $(".dropdown-menu").html(htmlStr)
           }
       })
   })

   // 3.点击一级下拉菜单的时候， 给a注册点击事件获取a的文本内容，并赋值到一级菜单里面
   $(".dropdown-menu").on("click","a",function(){
      var txt = $(this).text();
      $(".cate").text(txt);
      //获取当前点击的id 匹配当前的
      var id = $(this).data("id");
      $('[name = "categoryId"]').val( id ); 
      //将校验状态重置为VALID
      $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID")
   })
  
   // 4. 表单进行校验，借助bootstrapValidator的插件  需要先指定name值
   $("#form").bootstrapValidator({
       excluded : [],
       feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
       },
       fields:{
         categoryId:{
             validators:{
                 notEmpty : {
                     message : "请输入一级分类"
                 }
             }
         },
         brandName:{
             validators:{
                 notEmpty : {
                     message : "请输入二级分类"
                 }
             }
         },
         brandLogo : {
             validators : {
                 notEmpty : {
                     message : "请上传图片"
                 }
             }
         }  
       }
   })

   // 5.表单上传获取图片数据 ，利用query-fileupload插件
    $("#fileupload").fileupload({
        dataType : "json",
        done : function(e, data){
            var picAddr = data.result.picAddr;
            //把该图片的地址赋值给上传图片的路径里，也赋值给隐藏的input地址里
            $("#imgBox img").attr("src",picAddr)
            $('[name = "brandLogo"]').val(picAddr)
            //手动重置状态 将校验状态改成校验成功
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID")
        }
    })

       // 6.表单校验成功，注册校验成功事件 并且阻止插件submit的默认提交行为
   $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    //让ajax来发送请求
    $.ajax({
        url : "/category/addSecondCategory",
        type : "post",
        data : $("#form").serialize(),
        success : function(info){
            console.log(info)
            //退出模态框
            $("#addModal").modal("hide");
            //重新渲染页面
            currentPage = 1;
            render();
            //重置表单格式
            $("#form").data("bootstrapValidator").resetForm(true)
            //重置下拉菜单的内容
            $(".cate").text("请选择一级分类")
            //重置图片的内容
            $("#imgBox img").attr("src","images/02.jpg")
        }
    })
  })
})
