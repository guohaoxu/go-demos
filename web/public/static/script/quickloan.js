
$(function (){

        var quickloan = {};
        quickloan.isMobile = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
        quickloan.isFee = /^[-\+]?\d+(\.\d+)?$/;
        quickloan.InterValObj; //timer变量，控制时间
        quickloan.count = ctx.messageAliveTime*60; //间隔函数，1秒执行
        quickloan.curCount;//当前剩余秒数
        quickloan.mobileCodeSended = false;
        quickloan.toLogin = false;
        
		$('#getMobileCode').click(function(){  	
			 quickloan.curCount = quickloan.count;
			 var mobile = $("#loanMobile").val();
			 
			 if(mobile == '' || !(header.isMobilePhone.test(mobile))){
				 $('#loanMobileTip').html('<em class="err"></em>请输入手机号码');
				 return false;
			 }
			 $('#loanMobileTip').html('');
		 
			 //发送验证码手机
			 $.ajax({
				url : ctx.web_domain +"/verification/mobile/code?mobile="+mobile,
				type : "get",
				dataType : "json",
				async : false,
				error : function(XMLHttpRequest, textStatus,errorThrown) {
				},
				success : function(result) {
					if (result == 1){
						$('#loanMobileCodeTip').html('<em class="err"></em>手机验证码发送失败');
					}
					else if (result == 2){
						$('#loanMobileCodeTip').html('<em class="err"></em>抱歉，您今天信息发送次数已用完');
					}
					else if (result == 3){
						$('#loanMobileCodeTip').html('<em class="err"></em>请输入手机号码');
					}
					else if (result == 5){
						$('#loanMobileCodeTip').html('<em class="err"></em>抱歉，机构用户不能申请贷款');
					}
					else if (result == 0){
						//设置button效果，开始计时
						$('#getMobileCode').attr("disabled", true);
						$("this").val(quickloan.curCount + "秒内输入");
						quickloan.InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
						quickloan.mobileCodeSended = true;
						$('#loanMobileCodeTip').html('<em class="corr"></em>提示，验证码发送成功');
					}
				}
			 })
		});

		$('#loanSubmit').click(function(){		

			var mobile = $("#loanMobile").val();
			var aliasName = $("#loanAliasName").val();
			var mobileCode = $("#loanMobileCode").val();
			var fee = $("#loanServiceFeeAmount").val();
          
			if(mobile == '' || !(header.isMobilePhone.test(mobile))){
				$('#loanMobileTip').html('<em class="err"></em>请输入手机号码');
				return false;
			}
			$('#loanMobileTip').html('');
			if(aliasName == ''){
				$('#aliasNameTip').html('<em class="err"></em>请输入您的称呼');
				return false;
			}
			$('#aliasNameTip').html('');
			if (!quickloan.isFee.test(fee)) {
				$('#feeAmountTip').html('<em class="err"></em>请输入正确贷款金额');
				return false;
			}
			$('#feeAmountTip').html('');
			if (mobileCode.length != 6) {
				$('#loanMobileCodeTip').html('<em class="err"></em>请输入正确手机验证码');
				return false;
			}
            $('#loanMobileCodeTip').html('');
			

			if (quickloan.mobileCodeSended) {		
				//验证手机验证码是否填写正确
				$.ajax({
					url : ctx.web_domain +"/verification/check/mobilecode?mobileCode="
							+ mobileCode + "&mobile="
							+ mobile,
					type : "get",
					dataType : "json",
					async : false,
					error : function(XMLHttpRequest,
							textStatus, errorThrown) {
					},
					success : function(result) {
						quickloan.mobileCodeCorrect = result;
					}
				})
				if (!quickloan.mobileCodeCorrect) {
					 $('#loanMobileCodeTip').html('<em class="err"></em>手机验证码错误');
					 return false;
				}

			} else {
				  $('#loanMobileCodeTip').html('<em class="err"></em>手机验证码发送失败');
			     return false;
			}

			$.ajax({
					url :ctx.web_domain + "/quick/loan/check/mobile?mobile="+mobile,
					type : "GET",
					dataType : "json",
					async : false,
					error : function(XMLHttpRequest, textStatus,
							errorThrown) {
					},
					success : function(quickLoanVo) {
						if(!quickLoanVo.logined && quickLoanVo.registed){
							quickloan.toLogin = true;
						}						
					}
			});

			//弹出登陆框
			if(quickloan.toLogin){
				$.openDivBox('#notLoginQuickApplyDiv');
				var captchaUrl =  ctx.web_domain+"/captcha/?" + Math.random().toString();
				$("#captchaImageQuickLoan").attr("src", captchaUrl);

				return false;
			}
			
			quickLoanSubmit();	
		});

		$("#quickloan_success_sure").click(function () {
			//已登录
			if(quickloan.logined){
				$(".mask").hide();
				$("#quickloan_success_show").hide();
				location.reload();
			}
			//未登录已注册
			else if(!quickloan.logined && quickloan.registed){
				$(".mask").hide();
				$("#quickloan_success_show").hide();
				location.reload();
			} 
			//未登录未注册
			else if(!quickloan.logined && !quickloan.registed){
				$(".mask").hide();
				$("#quickloan_success_show").hide();
				window.location.href = ctx.web_domain +"/manage/personal/modifypassword?type=quick";

			}
		})
			
		//快速贷款登陆
	    $("#quickLoanLoginSubmit").click(function() {
			var mobile = $('#quickLoanMobile').val();
			var password = $('#quickLoanPassword').val();
			var captcha = $('#quickLoanLoginCaptcha').val();

			$.ajax({
					url : ctx.web_domain + "/quick/loan/login",
					type : "POST",
					dataType : "json",
					data : {
						"mobile":mobile,    
						"password":password,
						"captcha":captcha      
					},
					error : function(XMLHttpRequest, textStatus,
							errorThrown) {
					},
					success : function(result) {
						 $('#quickLoanLoginMobileTip').html('');
						 $('#quickLoanLoginCaptchaTip').html('');
						 if (result == 0 ){
							 $.closeDivBox('#notLoginQuickApplyDiv');
							 quickLoanSubmit();
						 }
						 else if (result == 1){							 
							 $('#quickLoanLoginMobileTip').html('<em class="err"></em>用户名或密码错误');
						 }
						 else if (result == 2){						 
							 $('#quickLoanLoginCaptchaTip').html('<em class="err"></em>验证码错误');
					     }
					}
			});			
		});

		//快速贷款验证码
	    $("#captchaImageQuickLoan").click(function() {
			var captchaUrl =  ctx.web_domain +"/captcha/?" + Math.random().toString();
			$("#captchaImageQuickLoan").attr("src", captchaUrl);
		});
	    
	  //未登陆用户立即申请验证码
		$("#getMessageCode").click(function() {
			 quickloan.curCount = quickloan.count;
			 var mobile = $("#mobiledata").val();
			
			 if(mobile == '' || !(header.isMobilePhone.test(mobile))){
				 $(".loan_succ_tck2").stop();
			     tips('请输入正确手机号');
				 return false;
			 }
		 
			 //发送验证码手机
			 $.ajax({
				url : ctx.web_domain +"/verification/mobile/code?mobile="+mobile,
				type : "get",
				dataType : "json",
				async : false,
				error : function(XMLHttpRequest, textStatus,errorThrown) {
				},
				success : function(result) {
					if (result == 1){
						$(".loan_succ_tck2").stop();
						tips('手机验证码发送失败');
					}
					else if (result == 2){
						$(".loan_succ_tck2").stop();
						tips('抱歉，您今天信息发送次数已用完');
					}
					else if (result == 3){
						$(".loan_succ_tck2").stop();
						tips('请输入手机号码');
					}
					else if (result == 5){
						$(".loan_succ_tck2").stop();
						tips('抱歉，机构用户不能申请贷款');
					}
					else if (result == 0){
						//设置button效果，开始计时

						$('#getMessageCode').attr("disabled", true);
						$(this).val(quickloan.curCount + "秒内输入");
						quickloan.InterValObj = window.setInterval(function() {

							if (quickloan.curCount == 0) {                
								window.clearInterval(quickloan.InterValObj);//停止计时器
								$("#getMessageCode").removeAttr("disabled");//启用按钮
								$("#getMessageCode").val("重新发送验证码");
								quickloan.curCount = ctx.messageAliveTime*60;
							} else {
								quickloan.curCount--;
								$("#getMessageCode").val(quickloan.curCount + "秒内输入");
							}

						}, 1000); //启动计时器，1秒执行一次
						quickloan.mobileCodeSended = true;
					}
				}
			 })
		});

		//快速贷款提交
		function quickLoanSubmit(){
            
            var canSubmit = checkSubmit();
            if(!canSubmit){
               return false;
            }
           
			var mobile = $("#loanMobile").val();
			var aliasName = $("#loanAliasName").val();
			var mobileCode = $("#loanMobileCode").val();
			var fee = $("#loanServiceFeeAmount").val();

			$.ajax({
				url : ctx.web_domain +"/quick/loan/apply",
				type : "POST",
				dataType : "json",
				data : {
					"mobile":mobile,    
					"mobileCode":mobileCode,                
					"submitAmount":fee,
					"aliasName":aliasName         
				},
				error : function(XMLHttpRequest, textStatus,
						errorThrown) {
				},
				success : function(quickLoanVo) {
					quickloan.logined = quickLoanVo.logined;
					quickloan.registed =  quickLoanVo.registed;
					quickloan.successed = quickLoanVo.successed;
					if (quickLoanVo.successed){
						$(".mask").show();
						$("#quickloan_success_show").show();
					}
					else{
						$(".loan_succ_tck2").stop();
					    tips('抱歉，申请失败');
					} 						
				}
		    });
		}

		function checkSubmit(){
			var lastSubmit = header.submitTime;
            var nowSubmit = new Date();
            if(lastSubmit != ""){
            	var ms = nowSubmit.getTime() - lastSubmit.getTime();
                var interValTime = 120*1000;           
                if(ms > interValTime){           	
                    return false;
                }
            }
            else{
            	header.submitTime = new Date();
            }
            return true;
		}

		//timer处理函数
	    function SetRemainTime() {
			
			if (quickloan.curCount == 0) {                
				window.clearInterval(quickloan.InterValObj);//停止计时器
				$("#getMobileCode").removeAttr("disabled");//启用按钮
				$("#getMobileCode").val("重新发送验证码");
				quickloan.curCount = ctx.messageAliveTime*60;
			}
			else {
				quickloan.curCount--;
				$("#getMobileCode").val(quickloan.curCount + "秒内输入");
			}
		}
})

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