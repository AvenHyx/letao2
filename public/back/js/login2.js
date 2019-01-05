


$(function(){
//设置插件bootstrap-validator
     //自动进行表单校验
     //插件会自动校验提交，去除掉默认提交，用ajax发送请求验证
     //表单校验成功有success.form.bv 事件 去验证状态，失败的情况下，显示用户名不存在 密码错误
  $("#form").bootstrapValidator({
      feedbackIcons:{
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
          //拿input的name属性设置参数
          username:{
              validators:{
                //不能为空
                notEmpty:{
                    message : "用户名不能为空"
                },
                stringLength:{
                    min:2,
                    max:6,
                    message:"用户名长度为2-6位"
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
                  //校验长度
                  stringLength:{
                      min:6,
                      max:12,
                      message:"密码长度为6-12位"
                  },
                  callback:{
                      message:"密码错误"
                  }
              }
          }
      }
  })
               
           //表单校验状态，需要ajax发送请求， 阻止插件的自动提交
           $("#form").on("success.form.bv",function(e){
               e.preventDefault();
               //使用ajax提交
               $.ajax({
                   type:"post",
                   data:$("#form").serialize(),
                   dataType:"json",
                   url:"/employee/employeeLogin",
                   success:function(info){
                      if(info.error ===1000){
                          //实时校验ajax传回的数据校验状态，1000用户名不存在
                       $("#form").data('bootstrapValidator').updateStatus("username","INVALID","callback")
                      }
                      if(info.error === 1001){
                          //1001密码错误,配置相应的回调函数
                       $("#form").data('bootstrapValidator').updateStatus("password","INVALID","callback");   
                      }
                      if(info.success){
                        location.href = "index.html"  
                      }
                   }
               })
           })


   
             //重置下表单，用插件的resetForm方法
             //给重置按钮注册事件
             $('[type = "reset"]').click(function(){
                $("#form").data("bootstrapValidator").resetForm() 
             })
        
})