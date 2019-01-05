




$(function(){

    var currentPage = 1;
    var pageSize = 5;

    //进入页面渲染一次
    render()
    //发送ajax请求 进行模板引擎渲染
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page: currentPage,
                pageSize: pageSize,
            },
            dataType:"json",
            success:function(info){
                console.log(info)
                var htmlstr = template("firstTpl",info);
                $("tbody").html(htmlstr);
                //练习下分页
                $("#paginator").bootstrapPaginator({
                    //当前版本
                    bootstrapMajorVersion : 3,
                    currentPage : info.page,
                    totalPages : Math.ceil(info.total / info.size),
                    onPageClicked : function(a, b, c, page){
                        currentPage = page,
                        render();
                    }
                })  
            }
        })
    }

    //点击添加分类 弹出模态框 发送Ajax请求
    $("#addBtn").on("click",function(){
        //弹出模态框
       $("#addModal").modal("show");
    })
           //配置校验文件
    $("#form").bootstrapValidator({
     feedbackIcons: {
         valid: 'glyphicon glyphicon-ok',
         invalid: 'glyphicon glyphicon-remove',
         validating: 'glyphicon glyphicon-refresh'
       },
       fields:{
         categoryName:{
             validators:{
                 //不能为空
                 notEmpty:{
                     message:"请输入一级分类名称"
                 }
              }
            }
        }
     })

//注册表单校验成功事件 在成功准备提交表单时，阻止默认的提交，通过ajax提交
    $("#form").on("success.form.bv",function(e){
        e.preventDefault();
        //更改成ajax提交
        $.ajax({
            url:"/category/addTopCategory",
            type:"post",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
               console.log(info)
               if(info.success){
                   //关闭模态框
                   $("#addModal").modal("hide");
                   //重新渲染页面
                   currentPage =1;
                   render();
                   //重置表单内容,内容和状态都重置 因为按钮type为submit不是reset，所以传参true
                   $("#form").data("bootstrapValidator").resetForm(true);
               }
            }
        })
    })
})
