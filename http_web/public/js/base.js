$(function(){
  $('[data-toggle="tooltip"]').tooltip();

  $(".loginForm").submit(function () {
    if($("input[name='username']").val() == "" || $("input[name='password']").val() == "") {
      alert("用户名或密码输入错误")
      return false
    }
  });

  $(".logupForm").submit(function () {
    if($("input[name='username']").val() == "" || $("input[name='password']").val() == "" || $("input[name='password']").val() != $("input[name='repPassword']").val() ) {
      alert("用户名或密码输入错误")
      return false
    }
  });

  $.get("http://localhost:3000/tasks",{},function(data){
    console.log(data)
  })

});
