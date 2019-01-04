

//使用表单插件， 引入bootstrap-validator

$(function(){
    $("#form").bootstrapValidator({
        //需求：用户名长度2-6位，密码长度6-12位
        //指定校验字段
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
        fields:{
            feedbackIcons:{
                valid: 'glyphicon glyphicon-ok',//校验成功
                invalid: 'glyphicon glyphicon-remove', //校验失败
                validating: 'glyphicon glyphicon-refresh' //正在校验
            },
            username :{
                validators:{
                    //不能为空
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    //长度校验
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必须是2-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }
                
                }
            },
            password:{
                validators:{
                    //不能为空
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码不正确"
                    }
                }
            }
        }
    });

    //注册表单校验成功事件，判断下状态结合接口文档
   
  // 2. 进行登录请求
  //    通过 ajax 进行登录请求
  // 表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 默认会阻止提交
     $("#form").on("success.form.bv",function(e){
         //阻止submit键提交 和跳转
         e.preventDefault();

        $.ajax({
           type:"post",
           data:$('#form').serialize(),
           url:"/employee/employeeLogin",
           dataType:"json",
           success: function(info){
            //    console.log(info)
                 if(info.error === 1000){
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
                 }
                 if(info.error === 1001){
                   $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                 }
                 if(info.success){
                     location.href = "index.html"
                 }
             }
          })
      })

    //需求 ：点击 reset按钮 进行表单重置
      $('[type = "reset"]').click(function(){
          //有true和false两种参数，默认为false,如果为true代表内容和状态都被重置，reset已经事先将内容重置了，所以只需要重置状态，不用传参数
        $("#form").data("bootstrapValidator").resetForm();
      })
    
})
 
  
  