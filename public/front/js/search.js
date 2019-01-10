

$(function(){
    //约定在后台添加假数据，键名是search_list;
    /*
    var arr = ['a','b','c']
    数组先转成json字符串
    var jsonStr = JSON.stringify(arr);
    将数据存入本地,因为本地存储存的都是字符串
    localStorage.setItem('search_list',jsonStr)
    
    功能1 ： 历史纪录渲染
         从本地存储中读取历史记录，转成数组返回
         获取本地存储的数据,因为是json字符串，所以转成json数组，放到模板引擎渲染
         因为是数组，所以需要用对象包一下
    */
   function getHistory(){
     var jsonStr = localStorage.getItem("search_list") || "[]";
     var arr = JSON.parse(jsonStr);
     return arr;
   }
  //获取数组 模板引擎渲染数据
  function  render(){ 
       var arr = getHistory();
       var htmlStr = template("searchTpl",{arr : arr});
       $(".lt_history").html(htmlStr);
  }
  render()
  /*
  功能2：清空历史纪录，removeItem 
        给清空记录注册事件委托 因为模板引擎渲染
  */
 $('.lt_history').on("click",".btn_empty",function(){
 
     mui.confirm("你确定要清空历史记录吗?","温馨提示",["取消","确认"],function(e){
          console.log(e);
          if(e.index == 1){
               localStorage.removeItem("search_list");
               render()
          }
     }) 
   })
   /*
  功能3 ： 点击x号，删除单个记录
     给x号注册事件委托
     删除单个记录removeItem，找到指定的index 下标，用splice数组的方法来删除
     splice(开始的下标，删几个，替换项),重新设置约定本地存储键名search_list,再重新渲染
*/
   $(".lt_history ").on("click",".btn_delete",function(){
      //先获取index,
      var  index = $(this).data("index")
      //删除指定的记录
      var arr  = getHistory()
      arr.splice(index,1);
      //将数组转成jsonstr
      var jsonStr = JSON.stringify(arr);
      //重新设置本地存储search_list键名
      localStorage.setItem("search_list",jsonStr);
      //重新渲染
      render()
 })
 /*
   功能4：添加单个历史记录功能
         获取搜索框的内容，添加点击事件
         把内容加在数组里面， 重新转成字符串
         给本地存储文件set来设置值 重新渲染页面
 */
   $('.search_btn').on('click',function(){
        var text= $(".search_input").val().trim();
        if(text === ""){
             mui.toast("请输入关键字")
             return;
        }
        //获取之前的数组
        var arr = getHistory();
        //1.如果有重复项，需要删除重复项 indexOf=-1说明不存在
        //获取输入的内容 在数组里面的下标
        var index = arr.indexOf(text);
        if(index !== -1){
             //有重复项，删除该项
             arr.splice(index,1);
             console.log(arr)
        }
        //如果长度大于10条 从最后面删除
        if(arr.length >= 10){
             arr.pop()
        }
        //在数组前面添加最新搜索记录
        arr.splice(0,0,text); //或者arr.unshift(text)
     //    console.log(arr)
        //把数组转成字符串
        var jsonStr = JSON.stringify(arr);
     //    console.log(jsonStr)
      localStorage.setItem('search_list',jsonStr);
      render()

      //清空input
      $(".search_input").val("");
   })    

}) 
