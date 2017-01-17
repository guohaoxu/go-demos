
$(function () { 
	$('#password').keyup(function () { 
		var passwordTxt = $(this).val();
	
			mpsw("#psw",passwordTxt);
			mpsw("#psw2",passwordTxt);
			mpsw("#psw1",passwordTxt);
	}) 
});
function mpsw(obj,passwordTxt){ 
		var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g"); 
		var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		var enoughRegex = new RegExp("(?=.{6,}).*", "g");
	if (strongRegex.test(passwordTxt)) { 
			//$(obj).find("strong").removeClass('ruo');
			//$(obj).find("strong").removeClass('zhong'); 
			$(obj).find("strong").eq(2).addClass('qiang'); 
			//密码为八位及以上并且字母数字特殊字符三项都包括 
			} 
			else if (mediumRegex.test(passwordTxt)) { 			
			//$(obj).find("strong").removeClass('ruo');
			$(obj).find("strong").removeClass('qiang'); 
			$(obj).find("strong").eq(1).addClass('zhong'); 
			//密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
			} 
			else if(enoughRegex.test(passwordTxt)){ 
			$(obj).find("strong").removeClass('zhong');
			$(obj).find("strong").removeClass('qiang');
			$(obj).find("strong").eq(0).addClass('ruo'); 
			//如果密码为6位，就算字母、数字、特殊字符三项都包括，强度也是弱的 
			} 
			else{
			$(obj).find("strong").removeClass('qiang');
			$(obj).find("strong").removeClass('ruo');
			$(obj).find("strong").removeClass('zhong');
			}
			return true; 
			}
