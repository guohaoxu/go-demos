var common = {}
common.wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // ��Ȩ����   
common.valideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // ���֤��֤λֵ.10����X   
common.isIdCardNo = function(idCard) {
	idCard = this.trim(idCard.replace(/ /g, ""));               //ȥ���ַ���ͷβ�ո�                     
    if (idCard.length == 15) {   
        return this.isValidityBrithBy15IdCard(idCard);       //����15λ���֤����֤    
    } else if (idCard.length == 18) {   
        var a_idCard = idCard.split("");                // �õ����֤����   
        if (this.isValidityBrithBy18IdCard(idCard) && this.isTrueValidateCodeBy18IdCard(a_idCard)){   //����18λ���֤�Ļ�����֤�͵�18λ����֤
            return true;   
        } else {   
            return false;   
        }   
    } else {   
        return false;   
    }   
}

/**  
 * �ж����֤����Ϊ18λʱ������֤λ�Ƿ���ȷ  
 * @param a_idCard ���֤��������  
 * @return  
 */  
common.isTrueValidateCodeBy18IdCard = function(a_idCard) {   
    var sum = 0;                             // ������Ȩ��ͱ���   
    if (a_idCard[17].toLowerCase() == 'x') {   
        a_idCard[17] = 10;                    // �����λΪx����֤���滻Ϊ10�����������   
    }   
    for ( var i = 0; i < 17; i++) {   
        sum += this.wi[i] * a_idCard[i];            // ��Ȩ���   
    }   
    valCodePosition = sum % 11;                // �õ���֤����λ��   
    if (a_idCard[17] == this.valideCode[valCodePosition]) {   
        return true;   
    } else {   
        return false;   
    }   
}

/**  
  * ��֤18λ�����֤�����е������Ƿ�����Ч����  
  * @param idCard 18λ�����֤�ַ���  
  * @return  
  */  
common.isValidityBrithBy18IdCard = function(idCard18){   
    var year =  idCard18.substring(6,10);   
    var month = idCard18.substring(10,12);   
    var day = idCard18.substring(12,14);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
    // ������getFullYear()��ȡ��ݣ�����ǧ�������   
    if (temp_date.getFullYear() != parseFloat(year)   
         || temp_date.getMonth() != parseFloat(month)-1   
         || temp_date.getDate() != parseFloat(day)){   
        return false;   
    } else {   
        return true;   
    }   
}   

/**  
   * ��֤15λ�����֤�����е������Ƿ�����Ч����  
   * @param idCard15 15λ�����֤�ַ���  
   * @return  
   */  
common.isValidityBrithBy15IdCard = function(idCard15){   
    var year =  idCard15.substring(6,8);   
    var month = idCard15.substring(8,10);   
    var day = idCard15.substring(10,12);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
    // ���������֤�е����������迼��ǧ��������ʹ��getYear()����   
    if(temp_date.getYear()!=parseFloat(year)   
		  ||temp_date.getMonth()!=parseFloat(month)-1   
		  ||temp_date.getDate()!=parseFloat(day)){   
		return false;   
    } else {   
		return true;   
    }   
}

//ȥ���ַ���ͷβ�ո�   
common.trim = function(str) {   
    return str.replace(/(^\s*)|(\s*$)/g, "");   
} 

common.isMobile = function(mobile) {
	var length = mobile.length;
	var reg =/^(130|131|132|133|134|135|136|137|138|139|150|151|152|153|155|156|157|158|159|180|185|186|187|188|189)\d{8}$/;
	return (length == 11 && reg.test(mobile));
}

common.isCallName = function(callname){
	var r =/[\u4e00-\u9fa5]/;
	return r.test(callname);
}