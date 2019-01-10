


//设置假的数据，获取的是json字符串
 function getHistory(){
     var jsonStr = localStorage.getItem("search_list") || "[]";
     var arr = JSON.parse(jsonStr);
     return arr;
 }
 //历史纪录渲染 获取数组的数据，进行模板引擎渲染
function render(){
    var arr = getHistory();
    var htmlStr = template("searchTpl",{arr : arr});
    $(".lt_history").html(htmlStr)
}
render()
//清空所有记录
$(".lt_history").on("click",".btn_empty",function(){
    mui.confirm("确认删除该条数据","温馨提示",["取消","确认"],function(e){
        console.log(e)
         //先获取数组
      //删除整个数组 用remove来删除之前预存的那个键名
        if(e.index == 1){
            localStorage.removeItem("search_list")
            render()  
        }
     })
   
    // var arr = getHistory();
    // var jsonStr = JSON.stringify(arr);
    // localStorage.removeItem("search_list",jsonStr) ;
})
//删除单个记录
  $(".lt_history").on("click",".btn_delete",function(){
    
      var index = $(this).data("index");
      var arr = getHistory();
      arr.splice(index,1);
      var jsonStr = JSON.stringify(arr);
      localStorage.setItem("search_list",jsonStr);
      render()
  })
//添加历史记录
$(".search_btn").on("click",function(){
       //获取输入框的内容， 去除两端空白
       var txt = $(".search_input").val().trim();
       //如果内容为空，返回 并弹出提示框 请输入关键字
       if(txt === ""){
           mui.toast("请输入关键字")
           return;
       }
     
       var arr = getHistory();
       var index = arr.indexOf(txt);
       if(index !== -1){
            //2.  去重，如果indexOf 不等于1，说明存在，这时候需要删除掉
           //说明存在 需要删除
           arr.splice(index,1)
       }
          //1， 如果输入的长度超过10，删除最后一个
          if(arr.length >= 10){
            arr.pop()
        }
          //把搜索框的内容设置给历史记录，也就是添加到数组的最前面
       arr.unshift(txt);
       //重新转字符串放在本地存储
       var jsonStr = JSON.stringify(arr);
        localStorage.setItem("search_list",jsonStr)
        render()  
       //3.重新清空搜索框内容
       $(".search_input").val("")
})
