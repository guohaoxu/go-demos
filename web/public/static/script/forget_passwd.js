//密码找回
$(function (){
	var forgetPasswd = {};
	forgetPasswd.InterValObj; //timer变量，控制时间
    forgetPasswd.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
    forgetPasswd.curCount;//当前剩余秒数
	forgetPasswd.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
	forgetPasswd.isMobileRegisted = false;
	forgetPasswd.mobileCodeSended = false;
	forgetPasswd.mobileCodeCorrect = false;
	forgetPasswd.captchaCorrect = false;
	var eqN = 0;
	$(".findpassword ul").eq(eqN).show();
	$(".fp_nx").click(function (){
		if(eqN == 0){
           var mobile = $('input[name=mobile]').val();
           var captcha = $('input[name=captcha]').val();

           forgetPasswd.isMobileRegisted = checkMobileRegisted(mobile);
           if(!forgetPasswd.isMobileRegisted){
               $('#mobileTip').html('<em class="err"></em>该账号不存在');
			   return false;
           }
           $('#mobileTip').html('');

           var isMobileCorrect = checkMobile(mobile);
		   if(!isMobileCorrect){
		   	   $('#mobileTip').html('<em class="err"></em>请输入正确手机号码!');
			   return false;
		   }
           
           forgetPasswd.captchaCorrect = checkCaptcha(captcha);
           if(!forgetPasswd.captchaCorrect){
           	    $('#captchaTip').html('<em class="err"></em>验证码错误!');
                return false;
           }
           else{
           	    $('#captchaTip').hide();
           }
		}

		if(eqN == 1){
           if(!forgetPasswd.mobileCodeSended){
              return false;
           }

           var mobileCode = $('input[name=mobileCode]').val();
           var mobile = $('input[name=mobile]').val();
           forgetPasswd.mobileCodeCorrect = checkMobileCode(mobile,mobileCode);
 
           if(!forgetPasswd.mobileCodeCorrect){
           	  $('#mobileCodeTip').html('<em class="err"></em>手机验证码错误，请重新输入!');
              return false;
           }
		}

		eqN++;
		$(".findpassword ul").eq(eqN).show().siblings("ul").hide();
		$(".findstep").addClass("findstep"+(eqN+1));
	})

    $('#passwdNext').click(function(){
           if(!forgetPasswd.mobileCodeCorrect){
              return false;
           }

           var password = $('input[name=password]').val();
           var confirmPassword = $('input[name=confirmPassword]').val();
           var mobileCode = $('input[name=mobileCode]').val();
           var mobile = $('input[name=mobile]').val();

           if(password.length < 6 || password.length > 16){
           	  $('#passwordTip').html('<em class="err"></em>密码长度在6-16之间!');
              return false;
           }
           if(confirmPassword.length < 6 || confirmPassword.length > 16){
              $('#confirmPasswordTip').html('<em class="err"></em>确认密码长度在6-16之间!');
              return false;
           }
           if(password != confirmPassword){
              $('#passwordTip').html('<em class="err"></em>两次输入密码不一致!');
              $('#confirmPasswordTip').html("");
              return false;
           }

           $.ajax({
				url : ctx.web_domain+"/password/reset",
				type : "POST",
				dataType : "json",
				async : false,
				data : {
					"mobile":mobile,                  
					"password":password,
					"confirmPassword":confirmPassword,
					"mobileCode":mobileCode     
				},
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					if(result){
                        window.location.href = ctx.web_domain+"/passwd_success.html";
					}
					else{
						$('#passwordTip').html("抱歉，密码修改失败");
                        $('#confirmPasswordTip').html("");
					}
				}
		    })

    });

	 //获取验证码
   $('#getMobileCode').click(function(){  
	     forgetPasswd.curCount = forgetPasswd.count;
		 var mobile = $("input[name='mobile']").val();
		 
	     //发送验证码手机
		 $.ajax({
			url : ctx.web_domain+"/verification/mobile/code?mobile="+mobile,
			type : "get",
			dataType : "json",
			async : false,
			error : function(XMLHttpRequest, textStatus,
					errorThrown) {
			},
			success : function(result) {
				if (result == 1){
					$('#mobileCodeTip').html('<em class="err"></em>手机验证码发送失败');
				}
				else if (result == 2){
					$('#mobileCodeTip').html('<em class="err"></em>抱歉，您今天信息发送次数已用完');
				}
				else if (result == 0){
					forgetPasswd.mobileCodeSended = true;
					 //设置button效果，开始计时
					$('#getMobileCode').attr("disabled", true);
					$('#getMobileCode').val(forgetPasswd.curCount + "秒内输入");
					forgetPasswd.InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
					$('#mobileCodeTip').html('<em class="corr"></em>手机验证码已发送，请注意查收');
				}
			}
		 })
	});

       //刷新验证码
    $("#captchaImage").click(function() {
		var captchaUrl =  ctx.web_domain+"/captcha/?" + Math.random().toString();
		$("#captchaImage").attr("src", captchaUrl);
	});

   	//timer处理函数
    function SetRemainTime() {
		
		if (forgetPasswd.curCount == 0) {                
			window.clearInterval(forgetPasswd.InterValObj);//停止计时器
			$("#getMobileCode").removeAttr("disabled");//启用按钮
			$("#getMobileCode").val("重新发送");
			forgetPasswd.curCount = ctx.messageAliveTime*60;
		}
		else {
			forgetPasswd.curCount--;
			$("#getMobileCode").val(forgetPasswd.curCount + "秒内输入");
		}
	}

    function checkMobileRegisted(mobile){
         var isRegisted = true;
         $.ajax({
				url : ctx.web_domain + "/user/check/mobile?mobile="+mobile, 
				type : 'GET',
				async : false,
				dataType : "json",
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					isRegisted = result;
				}
		});
        return isRegisted;
    }

	function checkMobile(mobile){
        if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 return false;
		}
		return true;
	}

	function checkMobileCode(mobile,mobileCode){
		var isCorrect = false;
		$.ajax({
				url : ctx.web_domain + "/verification/check/mobilecode?mobile="+mobile+"&mobileCode="+mobileCode,
				type : 'GET',
				async : false,
				dataType : "json",
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					isCorrect = result;
				}
		});

		return isCorrect;
	}
	
	function  checkCaptcha(captcha){
		var isCorrect = false;
		$.ajax({
			url : ctx.web_domain+"/verification/check/code?captcha="+captcha,
			type : "GET",
			dataType : "json",
			async : false,
			error : function(XMLHttpRequest, textStatus,
					errorThrown) {
			},
			success : function(result) {
				isCorrect =  result;		
			}
		});
		return isCorrect;
	}
})
