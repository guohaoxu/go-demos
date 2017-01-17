$(function (){
		/* 手机输入正确打勾 */
		$("input[name='username']").blur(function(){
		 if (($("#username-error").length ==0 && $("#username").val()!="") || $("#username-error").css('display') == 'none'){
				$("#getcode").removeAttr("disabled");//移除获取验证码按钮的disabled属性
				$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").addClass("validata_ok");
			}else{
				
				$("#getcode").attr("disabled", true);//设置获取验证码按钮为不可触发
				$(this).parent().removeClass("gb");
				$(this).parent().addClass("rb");
				$(this).parent().find("strong").removeClass("validata_ok");
			}
		});
		$("input[name='username']").focus(function(){
				$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").removeClass("validata_ok");
		});
		/* 验证信息正确打勾 */
		$("input[name='securityCode']").blur(function(){
		 if (($("#securityCode-error").length ==0 && $("#securityCode").val()!="") || $("#securityCode-error").css('display') == 'none'){
				$(this).parent().removeClass("coderb");
				$(this).parent().addClass("codegb");
				$(this).parent().find("strong").addClass("validata_ok");
			}else{
				$(this).parent().removeClass("codegb");
				$(this).parent().addClass("coderb");
				$(this).parent().find("strong").removeClass("validata_ok");
			}
		});
		$("input[name='securityCode']").focus(function(){
				$(this).parent().removeClass("coderb");
				$(this).parent().addClass("codegb");
				$(this).parent().find("strong").removeClass("validata_ok");
		});
		/* 密码输入正确打勾 */
		$("input[name='password']").blur(function(){
		  if (($("#password-error").length ==0 && $("#password").val()!="") || $("#password-error").css('display') == 'none'){
			  	$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").addClass("validata_ok");
			}else{
				$(this).parent().removeClass("gb");
				$(this).parent().addClass("rb");
				$(this).parent().find("strong").removeClass("validata_ok");
			}
		});
		$("input[name='password']").focus(function(){
				$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").removeClass("validata_ok");
		});
		/* 确认密码输入正确打勾 */
		$("input[name='confirm_password']").blur(function(){
		if (($("#confirm_password-error").length ==0 && $("#confirm_password").val()!="") || $("#confirm_password-error").css('display') == 'none'){
				$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").addClass("validata_ok");
			}else{
				$(this).parent().removeClass("gb");
				$(this).parent().addClass("rb");
				$(this).parent().find("strong").removeClass("validata_ok");
			}
		});
	$("input[name='confirm_password']").focus(function(){
				$(this).parent().removeClass("rb");
				$(this).parent().addClass("gb");
				$(this).parent().find("strong").removeClass("validata_ok");
		});
		
		/* 开始验证 */
		$.validator.addMethod("isMobile",function(value,element){
			var length=value.length;
			var mobile = /^(130|131|132|133|134|135|136|137|138|139|150|151|152|153|155|156|157|158|159|180|185|186|187|188|189)\d{8}$/;
			return this.optional(element)||(length==11&&mobile.test(value));
		},"请输入正确的手机号码");
		$.validator.addMethod("onlyusername", function(value,element) {
		var username = $("#username").val();
		return eval($.ajax({
		url : ctx.web_domain + "/user/checkusername",
		type : 'POST',
		async : false,
		dataType : "json",
		data : {
					username : username
				}
				}).responseText);
			}, "该用户名已经被注册！");
			
		/*验证码*/
		$.validator.addMethod("checkCode", function(value,element) {
		var securityCode = $("#securityCode").val();
		return eval($.ajax({
		url : ctx.web_domain + "/user/checkcode",
		type : 'POST',
		async : false,
		dataType : "json",
		data : {
					code : securityCode
				}
				}).responseText);
			}, "输入验证码错误！");	
		

		$("#signupForm").validate({
		rules:{
			username : {
				required : true,
				isMobile : true,
				onlyusername : true
				},
			securityCode : {
				required : true,
				checkCode : true
			},		
			password : {
				required : true,
				minlength : 6,
				maxlength : 16
			},
			confirm_password : {
				required : true,
				equalTo : $("input[name='password']")
				},
			agree : "required"
			},
		messages : {
			username : {
				required : "请输入您的手机号码"
				},
				securityCode : {
				required : "请输入验证码"
			},	
			password : {
				required : "请输入您的密码",
				minlength : "密码长度至少6位",
				maxlength : "密码长度之多16位"
				},
			confirm_password : {
				required : "请输入您的确认密码",
				equalTo : "您两次输入的密码不一致"
				},
			agree : "请勾选按钮"
			}		
		})
		
		
	})