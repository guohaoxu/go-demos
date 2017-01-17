//注册
$(function (){
	var registOrg = {};
	registOrg.InterValObj; //timer变量，控制时间
    registOrg.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
    registOrg.curCount;//当前剩余秒数
	registOrg.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
	registOrg.mobileCodeSended = false;
	registOrg.mobileCodeCorrect = false;
	registOrg.mobileExist = true;
	

   //获取验证码
   $('#getMobileCode').click(function(){  
	     registOrg.curCount = registOrg.count;
		 var mobile = $("input[name='mobile']").val();
	     if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 showError('<em></em>提示：请输入正确手机号码');
			 return false;
		 }
		 
	     //发送验证码手机
		 $.ajax({
			url : ctx.web_domain+"/verification/regist/mobile/code?mobile="+mobile,
			type : "get",
			dataType : "json",
			async : false,
			error : function(XMLHttpRequest, textStatus,
					errorThrown) {
			},
			success : function(result) {
				if (result == 1){
					showError('<em></em>提示：手机验证码发送失败');
				}
				else if (result == 2){
					showError('<em></em>提示：抱歉，您今天信息发送次数已用完');
				}
				else if (result == 3){
					showError('<em></em>提示：请输入手机号码');
				}
				else if (result == 4){
					showError('<em></em>提示：该手机号码已注册');
				}
				else if (result == 0){
					registOrg.mobileCodeSended = true;
					showError('提示：手机验证码已发送');
					 //设置button效果，开始计时
					$('#getMobileCode').attr("disabled", true);
					$('#getMobileCode').val(registOrg.curCount + "秒内输入");
					registOrg.InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

				}
			}
		 })
	});

$("#registOrgSubmit").click(function() {
		var mobile = $("input[name='mobile']").val();
		var mobileCode = $("#registerMobileCode").val();
		var password = $("input[name='password']").val();
		var confirmPassword = $("input[name='confirmPassword']").val();

		//开始验证
        if(mobile == ''  || !(header.isMobilePhone.test(mobile))){
			 showError('<em class="err"></em>手机号码不正确');
			 return false;
		}	
		else if(password.length < 6 || password.length > 16){
              showError('<em></em>提示：密码长度在6-16之间');
			 return false;
		}
		else if(confirmPassword.length < 6 || confirmPassword.length > 16){
              showError('<em></em>提示：确认密码长度在6-16之间');
			 return false;
		}
		else if(password != confirmPassword){
              showError('<em></em>提示：密码和确认密码不正确');
			 return false;
		}
		else{
             hideError();
		}

		if (!registOrg.mobileCodeSended) {
           showError('<em></em>提示：手机验证码错误');
           return false;
        };

		$.ajax({
				url : ctx.web_domain + "/user/check/mobile?mobile="+mobile,
				type : 'GET',
				async : false,
				dataType : "json",
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					registOrg.mobileExist = result;
				}
		});

        if (registOrg.mobileExist) {
           showError('<em></em>提示：该手机号码已注册');
           return false;
        }

        $.ajax({
				url : ctx.web_domain + "/verification/check/mobilecode?mobile="+mobile+"&mobileCode="+mobileCode,
				type : 'GET',
				async : false,
				dataType : "json",
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					registOrg.mobileCodeCorrect = result;
				}
		});

		if (!registOrg.mobileCodeCorrect) {
		   showError('<em></em>提示：手机验证码错误');
           return false;
		};

		$.ajax({
				url : ctx.web_domain+"/organization/register/save",
				type : "POST",
				dataType : "json",
				data : {
					"mobile":mobile,                  
					"password":password,
					"confirmPassword":confirmPassword     
				},
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(result) {
					if(result){
						var href = ctx.web_domain+"/manage/organization/register/complete";
					    	   	   
						window.location.href = href;
					}
					else{
					   showError('<em></em>提示：抱歉，注册失败');
					}		
				}
		});
	});

	
	 //同意协议
	$("#agree").click(function() {
		var checked = $(this).is(':checked');
		var submitButton = $('#registOrgSubmit');
		if(checked){
           submitButton.removeClass();
           submitButton.addClass("newreg_submit"); 
           submitButton.removeAttr("disabled");
		}
		else{
           submitButton.removeClass();
           submitButton.addClass("newreg_submit disabled"); 
           submitButton.attr("disabled", true);
		}
	});

	function showError(msg) {
		$(".regerror").show();
		$(".rederror_msg").html(msg);
	};

	function hideError() {
		$(".regerror").hide();
		$(".rederror_msg").html("");
	};
	
	//验证提示
	function tips(text){
		$("#tipText").html(text);
		$(".loan_succ_tck2").show().animate({
			"opacity":"1",
			"top":"49%"
		},800);
		setTimeout(function(){
			$(".loan_succ_tck2").fadeOut(800).animate({
				"opacity":"0",
				"top":"50%"
			},1);
		},1800)	
	}
	
	//timer处理函数
    function SetRemainTime() {
		
		if (registOrg.curCount == 0) {                
			window.clearInterval(registOrg.InterValObj);//停止计时器
			$("#getMobileCode").removeAttr("disabled");//启用按钮
			$("#getMobileCode").val("重新发送");
			registOrg.curCount = ctx.messageAliveTime*60;
		}
		else {
			registOrg.curCount--;
			$("#getMobileCode").val(registOrg.curCount + "秒内输入");
		}
	}

	//验证提示
	function tips(text){
		$("#tipText").html(text);
		$(".loan_succ_tck2").show().animate({
			"opacity":"1",
			"top":"49%"
		},800);
		setTimeout(function(){
			$(".loan_succ_tck2").fadeOut(800).animate({
				"opacity":"0",
				"top":"50%"
			},1);
		},1800)
		
	}
})

function setUserUrl()
{   	 	   
       var href;
	   var backUrl = getQueryString('back');
       if(backUrl == ''){
		   href = ctx.web_domain+"/register.html";
	   }
       else{
		   href = ctx.web_domain+"/register.html?back="+encodeURIComponent(backUrl);
	   }	   	   
	   window.location = href;  
}

function getQueryString(name)
{
	 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 var r = window.location.search.substr(1).match(reg);
	 if(r!=null)return  unescape(r[2]); 
	 
	 return '';
}