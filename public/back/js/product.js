

$(function() {

    var currentPage = 1; // 当前页
    var pageSize = 2; // 每页条数
    var picArr = []; // 存放所有的图片对象 (图片名称, 图片地址)
  
  
    // 1. 一进入页面, 调用 render 默认渲染第一页
    render();
  
    function render() {
      // 发送ajax利用模板渲染
      $.ajax({
        type: "get",
        url: "/product/queryProductDetailList",
        data: {
          page: currentPage,
          pageSize: pageSize
        },
        dataType: "json",
        success: function( info ) {
          console.log( info );
          var htmlStr = template( 'productTpl', info );
          $('tbody').html( htmlStr );
  
          // 进行分页初始化
          $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion: 3,
            currentPage: info.page,
            totalPages: Math.ceil( info.total / info.size ),
            // 添加页码点击事件
            onPageClicked: function( a, b, c, page ) {
              currentPage = page;
              render();
            }
          })
        }
      })
    }
  
  
  
    // 2. 点击添加按钮, 显示添加模态框
    $('#addBtn').click(function() {
      $('#addModal').modal("show");
  
      // 发送ajax请求, 获取二级分类的全部数据, 进行下拉菜单的渲染
      $.ajax({
        type: "get",
        url: "/category/querySecondCategoryPaging",
        data: {
          page: 1,
          pageSize: 100
        },
        dataType: "json",
        success: function( info ) {
          console.log( info );
          var htmlStr = template("dropdownTpl", info);
          $('.dropdown-menu').html( htmlStr );
        }
      })
    });
  
  
  
    // 3. 给下拉菜单的所有的 a, 添加点击事件(事件委托添加)
    //    (1) 获取文本, 设置给按钮
    //    (2) 获取 id,  设置给隐藏域, 用于提交
    $('.dropdown-menu').on("click", "a", function() {
  
      // 获取文本, 设置给按钮
      var txt = $(this).text();
      $('#dropdownText').text( txt );
  
      // 获取 id, 设置给 隐藏域
      var id = $(this).data("id");
      $('[name="brandId"]').val( id );
  
      // 手动将隐藏域校验状态改成成功
      $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  
    });
  
  
  
    // 4. 配置多文件上传
    $('#fileupload').fileupload({
      // 返回回来的数据类型
      dataType: "json",
      // done 文件成功上传完成的回调函数
      done: function( e, data ) {
        console.log( data.result ); // 后台返回的结果对象
        var picObj = data.result; // 后台返回的图片对象
  
        // 往数组前面追加
        picArr.unshift( picObj );
  
        var picUrl = picObj.picAddr; // 返回的图片地址
  
        // 将图片添加到 imgBox 最前面
        $('#imgBox').prepend('<img style="width: 100px;" src="'+ picUrl +'" alt="">');
  
  
        if ( picArr.length > 3 ) {  // 4
          // 说明长度超过 3 了
          // 保留最新的, 去掉最后的
          picArr.pop(); // 删除数组的最后一项
          // 结构的最后一张图片也要删除
          // 找最后一个 img 类型的 元素, 让其自杀
          $('#imgBox img:last-of-type').remove();
        }
  
        // 判断数组长度, 如果满三张了, 说明应该校验成功
        if ( picArr.length === 3 ) {
          // 将隐藏域校验状态, 改成成功
          $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
        }
      }
    });
  
  
  
    // 5. 配置表单校验
    $('#form').bootstrapValidator({
      // 配置不校验的类型, 对 hidden 需要进行校验
      excluded: [],
  
      // 配置图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',    // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
  
      // 配置校验字段
      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: "请选择二级分类"
            }
          }
        },
        proName: {
          validators: {
            notEmpty: {
              message: "请输入商品名称"
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: "请输入商品描述"
            }
          }
        },
        num: {
          validators: {
            notEmpty: {
              message: "请输入商品库存"
            },
            // 商品库存格式, 必须是非零开头的数字
            // 需要添加正则校验
            // 正则校验
            // 1,  11,  111,  1111, .....
            /*
            *   \d 表示数字 0-9
            *   +     表示出现1次或多次
            *   ?     表示出现0次或1次
            *   *     表示出现0次或多次
            *   {n}   表示出现 n 次
            *   {n,m} 表示出现 n 到 m 次
            * */
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '商品库存格式, 必须是非零开头的数字'
            }
          }
        },
        size: {
          validators: {
            notEmpty: {
              message: "请输入商品尺码"
            },
            // 要求: 必须是 xx-xx 的格式, xx为两位的数字
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '必须是 xx-xx 的格式, xx为两位的数字, 例如: 36-44'
            }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: "请输入商品原价"
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: "请输入商品现价"
            }
          }
        },
        picStatus: {
          validators: {
            notEmpty: {
              message: "请上传三张图片"
            }
          }
        }
      }
    });
  
  
  
    // 6. 注册表单校验成功事件, 阻止默认的提交, 通过ajax提交
    $('#form').on("success.form.bv", function( e ) {
      e.preventDefault();
  
      var paramsStr = $('#form').serialize();
      // 还要拼接上图片的数据
      // paramsStr += "&key=value";
      paramsStr += "&picArr=" + JSON.stringify( picArr );
  
      $.ajax({
        type: 'post',
        url: "/product/addProduct",
        data: paramsStr,
        dataType: "json",
        success: function( info ) {
          console.log( info );
          if ( info.success ) {
            // 添加成功
            // 关闭模态框
            $('#addModal').modal("hide");
            // 重新渲染第一页
            currentPage = 1;
            render();
  
            // 重置内容和状态
            $('#form').data("bootstrapValidator").resetForm(true);
  
            // 将下拉菜单的按钮文本 和 图片重置
            $('#dropdownText').text("请选择二级分类");
            $('#imgBox img').remove();
            //重置图片数组
            picArr = [];
          }
        }
      })
    })
  
  
  
  
  })
  