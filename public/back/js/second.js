

$(function(){
   //发送了ajax请求，动态渲染该数据页面 参考接口文档
  //声明2个全局变量，存储页数 和当前页
   var currentPage = 1;
   var pageSize = 5; 

    render();
//封装页面渲染的函数 方便复用
  function render(){
    $.ajax({
        url :"/category/querySecondCategoryPaging",
        type:"get",
        dataType:"json",
        data:{
            page: currentPage,
            pageSize: pageSize
        },
        success:function(info){
           console.log(info)
           var htmlStr = template("secondTpl",info);
           $(".lt_content tbody").html(htmlStr);
          //设置分页
          $("#paginator").bootstrapPaginator({
              //设置当前版本+当前页码+总页数
              bootstrapMajorVersion : 3,
              currentPage : info.page,
              totalPages: Math.ceil(info.total / info.size),
              //给页码添加点击事件 并重新渲染页码
              onPageClicked : function(a, b, c, page){
                  // console.log(page)为当前点击的页码的值
                  currentPage = page;
                  render();
              }
          })

          //做下表单验证 用bootstrapValidator插件
       
        }
    })
  }

//点击添加按钮， 显示添加模态框
   $("#addBtn").click(function(){
       //让模态框显现出来
       $("#addModal").modal("show");
       //通过配置来获取所有的分类 二级菜单的
       $.ajax({
           type:"get",
           url:"/category/queryTopCategoryPaging",
           data:{
               page:1,
               pageSize:100
           },
           dataType:"json",
           success:function(info){
               console.log(info)
               var htmlStr = template("dropdownTpl",info);
            //    console.log(htmlStr);
               $(".dropdown-menu").html(htmlStr);
           }
       })
   })
   
    //配置表单校验插件validator
      $("#form").bootstrapValidator({
        excluded:[],
        
        feedbackIcons:{
         valid: 'glyphicon glyphicon-ok',
         invalid: 'glyphicon glyphicon-remove',
         validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
          brandName:{
              //校验规则
              validators:{
                  notEmpty:{
                      message:"请输入二级分类"
                  }
              }
          },
          categoryId:{
              validators:{
                  notEmpty:{
                      message:"请选择一级分类"
                  }
              }
          },
          //图片地址
          brandLogo:{
              validators:{
                  notEmpty:{
                      message:"请上传图片"
                  }
              }
          }
        }
    });

   //给所有下拉菜单 a添加点击事件 并且把值赋值给下拉框的值
   $(".dropdown-menu").on("click","a",function(){
        var txt = $(this).text();
        // console.log(txt)
        //赋值到下拉框的值
        $("#dropdownText").text(txt);
        //将选中的id设置到input的表单元素中，需要将校验状态配置成VALID
        var id = $(this).data("id");
        $('[name="categoryId"]').val( id );
        // console.log($('[name="categoryId"]').val(  ))
        $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID")
   })


   //配置fileupload进行初始化
   $("#fileupload").fileupload({
       dataType : "json",
       //文件上传完成的回调函数
       done : function(e, data){
           console.log(data)
           var picUrl = data.result.picAddr;    
           //把这个地址赋值给上传图片的地址
           $("#imgBox img").attr("src",picUrl)
           //将图片地址保存在隐藏域种
           $('[name = "brandLogo"]').val(picUrl);
           //更新校验状态
           $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
       }
   })



 //注册校验成功事件， 通过ajax进行添加和提交
   $("#form").on("success.form.bv",function(e){
       e.preventDefault();
       $.ajax({
           url:"/category/addSecondCategory",
           type:"post",
           dataType:"json",
           data:$("#form").serialize(),
           success:function(info){
               console.log(info)
               //true或者false
               
                   //关闭模态框
                   $("#addModal").modal("hide");
                   //重置表单里面的内容和校验状态
                   $("#form").data("bootstrapValidator").resetForm(true)
                   //重新渲染页面
                   currentPage = 1;
                   render();
                   //找到下拉菜单文本重置
                   $("#dropdownText").text("请选择1级分类")
                   //找到图片重新重置下 直接赋默认值就可以了
                   $("#imgBox img").attr("src","images/02.jpg")
              
           }
       })
   })



})



