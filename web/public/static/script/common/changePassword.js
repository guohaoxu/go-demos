function colorChange(obj,obj1){
	//new密码边框变化		
	$(obj).blur(function(){
		 if (($(obj+"-error").length ==0 && $(obj).val()!="") || $(obj+"-error").css('display') == 'none'){
			$(this).removeClass("rb");
			$(this).addClass("gb");
			$(this).nextAll("em").addClass("validata_ok");
		}else{
			$(this).removeClass("gb");
			$(this).addClass("rb");
			$(this).nextAll("em").removeClass("validata_ok");
		}
	});
	$(obj).click(function(){
			$(this).removeClass("rb");
			$(this).addClass("gb");
			$(this).nextAll("em").removeClass("validata_ok");
	});
	//确认密码边框变化
	$(obj1).blur(function(){
		 if (($(obj1+"-error").length ==0 && $(obj1).val()!="") || $(obj1+"-error").css('display') == 'none'){
			$(this).removeClass("rb");
			$(this).addClass("gb");
			$(this).nextAll("em").addClass("validata_ok");
			$(this).siblings('.lxw_tips').html("");
		}else{
			$(this).removeClass("gb");
			$(this).addClass("rb");
			$(this).nextAll("em").removeClass("validata_ok");
		}
	});
	$(obj1).click(function(){
			$(this).removeClass("rb");
			$(this).addClass("gb");
			$(this).nextAll("em").removeClass("validata_ok");
	});
}
function tipChange(obj){
	$(obj).focus(function() {
		$(this).siblings('.lxw_tips').html("");
		$("#pswTip").show();
	});
}
$(function(){
	colorChange("#quickLoanPassword","#quickloanConfirmPassword");
	colorChange("#calculatePassword","#calculateConfirmPassword");
	colorChange("#password","#confirmPassword");
	
	
	tipChange("#password");
	tipChange("#currentPassword");

	$("#submit").click(function(){
		$.post( ctx.web_domain+ "/manage/personal/editpassword" , 
				{  "password": $('#password').val(),"confirmPassword":$('#confirmPassword').val(), "currentPassword":$('#currentPassword').val()}, 
				function(result){
					$(".lxw_tips").html("");
				if(result == "currentNull"){
					$("#oldPasswordNull").html('<em class="err"></em>当前密码不允许为空');
				}else if(result == "passwordNull"){
					$("#pswTip").hide();
					$("#newPasswordNull").html('<em class="err"></em>密码不允许为空');
				}else if(result == "confirmNull"){
					$("#rePasswordNull").html('<em class="err"></em>确认密码不允许为空');
				}else if(result == "confimDifferent"){
					$("#rePasswordNull").html('<em class="err"></em>新密码和确认密码不相等');
				}else if(!isNaN(result)){
					showTips("密码不匹配!","您输入的当前密码错误，为了您账户的安全，如果再输入错误"+(5-result)+"次密码将在24小时内不能修改密码");
				}else if(result == "locked"){
					showTips("","由于您输入错误密码达到上限，为了您账户的安全，修改密码功能将锁定24小时(以第一次输入错误开始计算)");
				}else if(result == "true"){
					showTips("修改成功!","确定返回登陆页面");
					$("#confirm").click(function(){
						window.location = ctx.web_domain+"/manage/login";
					})
				}
				},
			     'json' )
    });
		$("#register").validate({
			/**设置验证规则 */
			rules : {
				'currentPassword' : {
					required : true,
					minlength : 6,
					maxlength : 16
					},
				'password' : {
					required : true,
					minlength : 6,
					maxlength : 16
				},
				'confirmPassword': {
					required: true,
					minlength : 6,
					equalTo: $("input[name='password']")
				}
			},

			/**设置错误信息 */
			messages : {
				'currentPassword' : {
					required : "",
					minlength : "",
					maxlength : ""
					},
				'password' : {
					required : "",
					minlength : "",
					maxlength : ""
				},
				'confirmPassword': {
					required: "",
					minlength : "",
					equalTo: ""
				}
			}
		});		
})
//contTxt : 弹窗要显示的内容;
function showTips(contTxt,contTxt1){
		var tips = $('<div class="czx_shanchuqueren"><div class="czx_zhifuheader"><a class="closeBtn"></a><span>提示</span></div><div class="czx_zhifuCont"><div class="contTxt">'+contTxt+'</div><p>'+contTxt1+'</p></div><div class="czx_zhifufooter"><div><a id="confirm" class="confirm" href="javascript:;">确定</a</div></div></div>');
	$("#showTip").append(tips);
	$("#showTip").show();
	hideTips(".confirm");
	hideTips(".closeBtn");
}
function hideTips(that){
	$(that).click(function(){
		$("#showTip").hide();
		$(".czx_shanchuqueren").remove();
	})
}
	function getQueryString(name)
	{
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);
		 if(r!=null)return  unescape(r[2]); 
		 
		 return '';
	}
	$(function(){
		colorChange("#quickLoanPassword","#quickloanConfirmPassword");
		colorChange("#calculatePassword","#calculateConfirmPassword");
		colorChange("#password","#confirmPassword");	
		$("#quickLoanSubmit").click(function(){
			var password = $('#quickLoanPassword').val();
			var confirmPassword = $('#quickloanConfirmPassword').val();
			$.ajax({
				url : ctx.web_domain+ "/manage/personal/quickloan/editpassword",
				type : "POST",
				dataType : "json",
				data: {
			       password:password,
			       confirmPassword:confirmPassword
			    },
				error : function(XMLHttpRequest,textStatus, errorThrown) {
					
				},
				success : function(result) {
					if(result){
						window.location.href = ctx.web_domain+"/manage/login";
					}
				}
			})
	    });

		$("#calculateSubmit").click(function(){
			var password = $('#calculatePassword').val();
			var confirmPassword = $('#calculateConfirmPassword').val();
			$.ajax({
				url : ctx.web_domain+ "/manage/personal/calculate/editpassword",
				type : "POST",
				dataType : "json",
				data: {
			       password:password,
			       confirmPassword:confirmPassword
			    },
				error : function(XMLHttpRequest,textStatus, errorThrown) {
					
				},
				success : function(result) {
					if(result){
						var href;
					    var backUrl = getQueryString('url');
				        if(backUrl == ''){
						   href = ctx.web_domain+"/manage/login";
					    }
				        else{
				           var index = window.location.href.indexOf('editedPassword');
						   if (index == -1) {
							   backUrl+="&editedPassword=true"
						   }
						   href = decodeURIComponent(backUrl);
					    }	   	   
						window.location.href = href;
					}
				}
			})
	    });

})