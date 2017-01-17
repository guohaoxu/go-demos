$(document).ready(function() {

		
	//用户名边框变化
		$("#username").blur(function(){
			 if (($("#username-error").length ==0 && $("#username").val()!="") || $("#username-error").css('display') == 'none'){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").addClass("success");
			}else{
				$(this).removeClass("gb");
				$(this).removeClass("rb");
				$(this).addClass("rb");
				$(this).nextAll("em").removeClass("success");
			}
		});
		$("#username").click(function(){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").removeClass("success");
		});
		//密码边框变化		
		$("#password").blur(function(){
			 if (($("#password-error").length ==0 && $("#password").val()!="") || $("#password-error").css('display') == 'none'){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").addClass("success");
			}else{
				$(this).removeClass("gb");
				$(this).removeClass("rb");
				$(this).addClass("rb");
				$(this).nextAll("em").removeClass("success");
			}
		});
		$("#password").click(function(){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").removeClass("success");
		});
		//确认密码边框变化
		$("#confirm_password").blur(function(){
			 if (($("#confirm_password-error").length ==0 && $("#confirm_password").val()!="") || $("#confirm_password-error").css('display') == 'none'){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").addClass("success");
			}else{
				$(this).removeClass("gb");
				$(this).removeClass("rb");
				$(this).addClass("rb");
				$(this).nextAll("em").removeClass("success");
			}
		});
		$("#confirm_password").click(function(){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").removeClass("success");
		});
		//手机边框变化
		$("#mobile").blur(function(){
			 if (($("#mobile-error").length ==0 && $("#mobile").val()!="") || $("#mobile-error").css('display') == 'none'){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").addClass("success");
			}else{
				$(this).removeClass("gb");
				$(this).removeClass("rb");
				$(this).addClass("rb");
				$(this).nextAll("em").removeClass("success");
			}
		});
		$("#mobile").click(function(){
				$(this).removeClass("rb");
				$(this).removeClass("gb");
				$(this).addClass("gb");
				$(this).nextAll("em").removeClass("success");
		});
	// 手机号码验证         
	$.validator.addMethod("isMobile",function(value, element) {
		var length = value.length;
		var mobile = /^(130|131|132|133|134|135|136|137|138|139|150|151|152|153|155|156|157|158|159|180|185|186|187|188|189)\d{8}$/;
		return this.optional(element)|| (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");

	/* 验证用户名不重复 */
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
	/* 验证手机号码不重复 */
	$.validator.addMethod("onlymobile", function(value,element) {
		var mobile = $("#mobile").val();
		return eval($.ajax({
		url : ctx.web_domain + "/user/checkmobile",
		type : 'POST',
		async : false,
		dataType : "json",
		data : {
					mobile : mobile
				}
			}).responseText);
			}, "该手机已经被注册！");

	$("#signupForm").validate({
		rules : {
			username : {
					required : true,
					onlyusername : true,
					minlength : 2,
					maxlength : 18
			},
			password : {
					required : true,
					minlength : 5
						},
			confirm_password : {
					equalTo : "#password"
						},0

			mobile : {
					required : true,
					onlymobile : true,
					isMobile : true
					},
			agree : "required"
							},

			messages : {
					username : {
						required : "请输入您的用户名",
						minlength : "4-18个字符，一个汉字为两个字符，推荐使用中文会员名",
						maxlength : "4-18个字符，一个汉字为两个字符，推荐使用中文会员名"
						},
					password : {
						required : "请输入密码",
						minlength : "密码长度最少位5个字符"
						},
					confirm_password : {
						equalTo : "两次输入密码不一致不一致"
						},

					mobile : {
						required : "请输入11位正确的手机号码"
						},
						agree : "请勾选按钮"
					}
			});
		});