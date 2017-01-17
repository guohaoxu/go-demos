

var objX = 0;
var objY = 0;
var bodyScrollWidth = 0;
var bodyScrollHeight = 0;
var screenAvailWidth = window.screen.availWidth;
var screenAvailHeight = window.screen.availHeight;

var bdMvEvt;
var bdUpEvt;

var jobareaId;
var btnSltAreaId;

function recoverBodyEvent() {
    document.body.onmousemove = bdMvEvt;
    document.body.onmouseup = bdUpEvt;
}

if (navigator.appName.indexOf("Explorer") > -1) { //ie
    var exp = 1;
} else { //for ff
    var exp = 2;
}
var layer = new Array();
var dragObj = new Array();
var dragObjId = new Array();

reCalBodySize();

function reCalBodySize() {
    bodyScrollWidth = document.documentElement.scrollWidth;
    bodyScrollHeight = document.documentElement.scrollHeight;
}
function checkAndResetStyleTop(obj) {
    var clientHeight = obj.firstChild.clientHeight;
    var styleTop = parseInt(obj.style.top.substring(0, obj.style.top.length - 2));
    if (clientHeight + styleTop > bodyScrollHeight) {
        obj.style.top = (bodyScrollHeight - clientHeight) + 'px';
    }
}

function set_div_style(obj, id, top, left, width, height, position, border, cursor, background) {
    var obj = obj;
    obj.id = id ? id: null;
    obj.style.top = top ? top: '0px';
    obj.style.left = left ? left: '0px';
    obj.style.width = width ? width: '0px';
    obj.style.height = height ? height: '0px';
    obj.style.position = position ? position: "static";
    obj.style.border = border ? border: "1px #000 solid";
    obj.style.cursor = cursor ? cursor: "default";
    obj.style.background = background ? background: "";
    return obj
}

function drag_mouse_down(event, obj) {
    var obj_left = obj.style.left;
    var obj_top = obj.style.top;
    var obj_left = obj_left.replace(/p|x/g, "");
    var obj_top = obj_top.replace(/p|x/g, "");
    if (event == null) { //IE必须
        event = window.event;
    }
    var clientX = String(event.clientX).replace(/p|x/g, "");
    var clientY = String(event.clientY).replace(/p|x/g, "");
    objX = clientX - obj_left;
    objY = clientY - obj_top;
}

function drag(event, obj) {
    if (objX != 0 && objY != 0) {
        if (event == null) { //IE必须
            event = window.event;
        }
        if (event.button == 1 || event.button == 0) {
            var objWidth = obj.firstChild.clientWidth;
            var objHeight = obj.firstChild.clientHeight;
            reCalBodySize();

            var leftPo = event.clientX - objX;
            if (leftPo < 0) {
                leftPo = 0;
            }
            if (leftPo > bodyScrollWidth - objWidth) {
                leftPo = bodyScrollWidth - objWidth;
            }

            var topPo = event.clientY - objY;
            if (topPo < 0) {
                topPo = 0;
            }
            if (topPo > bodyScrollHeight - objHeight) {
                topPo = bodyScrollHeight - objHeight;
            }
            obj.style.left = leftPo + 'px';
            obj.style.top = topPo + 'px';
        }
    }
}

function GetLength(strTemp) {
    var i, sum;
    sum = 0;
    for (i = 0; i < strTemp.length; i++) {
        if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) sum = sum + 1;
        else sum = sum + 2;
    }
    return sum;
}

function subStringPro(str, length) {
    var stri = '';
    for (i = 0, j = 0; j < length;) {
        if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {
            stri += str.charAt(i);
            j++;
        } else {
            stri += str.charAt(i);
            j += 2;
        }
        i++;
    }
    return stri;
}

//*********************
//隐藏元素
var hiddenObjs = [];
function HideElement(strElementTagName) {
    try {
        for (i = 0; i < window.document.all.tags(strElementTagName).length; i++) {
            var objTemp = window.document.all.tags(strElementTagName)[i];
            if ('visible' == objTemp.style.visibility) {
                objTemp.style.visibility = "hidden";
                hiddenObjs.push(objTemp);
            }
        }
    } catch(e) {
        alert(e.message);
    }
}

function hideElementAll() {
    hiddenObjs = [];
    HideElement("SELECT");
    HideElement("OBJECT");
    HideElement("IFRAME");
}

function showElementAll() {
    var len = hiddenObjs.length;
    for (var i = 0; i < len; i++) {
        hiddenObjs[i].style.visibility = "visible";
    }
}
//滤镜效果
function hide() {
    synSizeByBody("globalDiv");
    document.getElementById("globalDiv").style.display = "block";
    if (1 == exp) {
        hideElementAll();
    }
}

function cancel() {
    document.getElementById("globalDiv").style.display = "none";
    if (1 == exp) {
        showElementAll();
    }

    recoverBodyEvent();
}
function buildGlobalDiv() {
    var globalDiv = document.createElement('div');
    globalDiv.id = 'globalDiv';
    globalDiv.style.display = 'none';
    globalDiv.style.zIndex = '98';
    globalDiv = set_div_style(globalDiv, 'globalDiv', '0px', '0px', bodyScrollWidth + 'px', bodyScrollHeight + 'px', "absolute", " #333333 0px solid", "default", "darkgray");

    if (1 == exp) {
        globalDiv.style.filter = "alpha(opacity=30)";
    } else {
        globalDiv.style.opacity = 30 / 100;
    }
    document.body.appendChild(globalDiv);
}
function synSizeByBody() {
    reCalBodySize();
    var argArr = synSizeByBody.arguments;
    for (var i = 0; i < argArr.length; i++) {
        if (document.getElementById(argArr[i]) != null) {
            document.getElementById(argArr[i]).style.width = (bodyScrollWidth) + 'px';
            document.getElementById(argArr[i]).style.height = (bodyScrollHeight) + 'px';
        }
    }
}
//将悬浮层的位置定位在body可见区域
function GetCenterXY_ForLayer(objdiv) {
    objdiv.style.display = 'block';
    var styleWidth = objdiv.style.width.substring(0, objdiv.style.width.length - 2);
    var clientHeight = objdiv.firstChild.clientHeight;
    var objLeft = parseInt(document.documentElement.scrollLeft + (document.documentElement.clientWidth - styleWidth) / 6) + 'px';
    var relTop = (document.documentElement.clientHeight - clientHeight) / 12 > 0 ? (document.documentElement.clientHeight - clientHeight) / 12 : 0;
    var objTop = parseInt(document.documentElement.scrollTop + relTop) + 'px';
    objdiv.style.top = objTop;
    objdiv.style.left = objLeft;
    checkAndResetStyleTop(objdiv);
}
//************************************************************
function $(str) { //通过对象ID返回对象
    if (typeof str == 'string' && document.getElementById(str) != null) {
        return document.getElementById(str);
    }
    return false;
}

function buildDiv() {
    var argArr = buildDiv.arguments;

    //定义层需要的初始字串变量
    var mainTable = '';

    for (var i = 0; i < argArr.length; i++) {
        //求出其相应的TABLE
        switch (argArr[i]) {
        case 'popupArea':
            mainTable = initJobArea();
            break;
        default:
            return false;
        }
        dragObjId[i] = argArr[i];
        layer[i] = document.createElement("div");
        layer[i].style.visibility = 'hidden';
        layer[i].style.zIndex = '999';
        layer[i].innerHTML += mainTable;
        document.body.appendChild(layer[i]);

        var styleWidth = layer[i].firstChild.width + 'px';
        var styleHeight = layer[i].firstChild.firstChild.clientHeight + 'px';
        var layerId = argArr[i];

        layer[i] = set_div_style(layer[i], layerId, '0px', '0px', styleWidth, '0px', "absolute", "0px solid #c0d4db", "default", "#fff");
        dragObj[i] = layer[i].firstChild.firstChild.firstChild.firstChild;
        dragObj[i].style.cursor = 'move';

        dragObj[i].onmousedown = function(event) {
            drag_mouse_down(event, this.parentNode.parentNode.parentNode.parentNode)
        };

        layer[i].onselectstart = function() {
            return false
        };

        if (1 == exp) {
            layer[i].firstChild.onresize = function() {
                checkAndResetStyleTop(this.parentNode)
            };
        } else {
            layer[i].firstChild.onclick = function() {
                checkAndResetStyleTop(this.parentNode)
            };
        }
    }
}

function hiddenLayerOther(layerID) {
    for (var i = 0; i < dragObjId.length; i++) {
        if (dragObjId[i] != layerID && document.getElementById(dragObjId[i]) != null) {
            hiddenLayer(dragObjId[i]);
        }
    }
}

function displayLayer(layerID, sjobarea, sbtnSltArea) {
    jobareaId = sjobarea;
    btnSltAreaId = sbtnSltArea;
    if (document.getElementById(layerID) != null) {
        var dv = document.getElementById(layerID);
        hiddenLayerOther(layerID);
        if (dv.style.visibility == "hidden") {
            GetCenterXY_ForLayer(dv);
            dv.style.visibility = "visible";
        }
        document.body.onmousemove = function(event) {
            drag(event, dv)
        };
        document.body.onmouseup = function() {
            objX = 0;
            objY = 0
        };
    }
    return false;
}

function hiddenLayer() {
    var argArr = hiddenLayer.arguments;
    for (var i = 0; i < argArr.length; i++) {
        if (document.getElementById(argArr[i]) != null) {
            document.getElementById(argArr[i]).style.visibility = "hidden";
        }
    }
}

function sltJobarea(show, value) {
    document.getElementById(jobareaId).value = value;
    document.getElementById("showArea").innerHTML = show;
    //添加cookie
    Cookies.set('area', show);
	if(logined){
		//改变用户城市
       sendAjaxRequest(ctx.web_domain + "/user/city/" + value);
	}
    cancel();
    hiddenLayer("popupArea");
}

function initJobArea() {
    var htmlDiv = '';

    htmlDiv += '<table width="500" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" >';
    htmlDiv += '<tr>';
    htmlDiv += '<td width="797" height="36" valign="top" background=""  top="top" left="left" repeat-x;="repeat-x;"">';
    htmlDiv += '<table width="100%" height="28" border="0" cellpadding="0" cellspacing="0">';
    htmlDiv += '<tr>';
    htmlDiv += '<td width="4%" align="center" valign="middle"></td>';
    htmlDiv += '<td width="86%" align="left" valign="middle"  style="color:#fff;">请选择地点</td>';
    htmlDiv += '<td width="10%" align="center" valign="middle" style="color:#fff;"><a onClick="javascript:cancel();hiddenLayer(\'popupArea\')" style="color:#FFFFFF;cursor:pointer;">[关闭]</a> </td>';
    htmlDiv += '</tr>';
    htmlDiv += '</table>';
    htmlDiv += '</td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="center" valign="top">';

    htmlDiv += '<div id="subareadiv">';

    htmlDiv += getAllArea();

    htmlDiv += '</div>';

    htmlDiv += '</td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td height="4" align="center" valign="top" bgcolor="#FF7400"></td>';
    htmlDiv += '</tr>';
    htmlDiv += '</table>';

    return htmlDiv;
}

function showSubArea(subareaid, subareaname) {
    htmlDiv = '';

    htmlDiv += '<table width="100%" border="0" cellspacing="0">';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle"  bgcolor="#F7F7F7" style="text-indent:5px;"><span style="cursor:pointer; color:#ff7300;" onMouseOver="this.style.color=\'#000000\'" onMouseOut="this.style.color=\'#ff7300\'" onClick="javascript:document.getElementById( \'subareadiv\' ).innerHTML=getAllArea();">[返回所有省份]</span></td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr><td><table width="100%"><tr>'

    subareaids = getAreaIDs(subareaid);
    subareanames = getAreaNames(subareaid);
    num = 0;
    for (var m = 0; m < subareaids.length; m++) {
        num++;
        htmlDiv += '<td align="left" valign="bottom" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="sltJobarea(\'' + subareanames[m] + '\',\'' + subareaids[m] + '\');">' + subareanames[m] + '</span></td>';
        if (num % 7 == 0) {
            htmlDiv += '</tr><tr>';
        }
    }
    htmlDiv += '</tr></table></td></tr></table>';

    document.getElementById('subareadiv').innerHTML = htmlDiv;
}

function getAllArea() {
    htmlDiv = '';

    htmlDiv += '<table width="100%" border="0" cellpadding="3" cellspacing="0">';
    htmlDiv += '<tr>';
    htmlDiv += '<td colspan="7" align="left" valign="middle" bgcolor="#F7F7F7" style="color:#ff7400; font-size: 14px; font-weight: bold;">所有省份:</td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td width="80" align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">直辖市：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:sltJobarea( \'北京市\' , \'1\' )">北京市</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:sltJobarea( \'天津市\' , \'2\' )">天津市</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:sltJobarea( \'上海市\' , \'9\' )">上海市</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:sltJobarea( \'重庆市\' , \'22\' )">重庆市</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td width="80" align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">华北-东北：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'3\' , \'河北省\' )">河北省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'4\' , \'山西省\' )">山西省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'5\' , \'内蒙古\' )">内蒙古</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'6\' , \'辽宁省\' )">辽宁省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'7\' , \'吉林省\' )">吉林省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'8\' , \'黑龙江省\' )">黑龙江省</span></td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">华东地区：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'10\' , \'江苏省\' )">江苏省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'11\' , \'浙江省\' )">浙江省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'12\' , \'安徽省\' )">安徽省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'13\' , \'福建省\' )">福建省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'14\' , \'江西省\' )">江西省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'15\' , \'山东省\' )">山东省</span></td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">华南-华中：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'19\' , \'广东省\' )">广东省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'20\' , \'广西\' )">广西</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'21\' , \'海南省\' )">海南省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'22\' , \'河南省\' )">河南省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'17\' , \'湖北省\' )">湖北省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'18\' , \'湖南省\' )">湖南省</span></td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">西北-西南：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'27\' , \'陕西省\' )">陕西省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'28\' , \'甘肃省\' )">甘肃省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'29\' , \'青海省\' )">青海省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'30\' , \'宁夏\' )">宁夏</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'31\' , \'新疆\' )">新疆</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'23\' , \'四川省\' )">四川省</span></td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'24\' , \'贵州省\' )">贵州省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'25\' , \'云南省\' )">云南省</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'26\' , \'西藏\' )">西藏</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '</tr>';
    htmlDiv += '<tr>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF" style="color:#000000;font-weight: bold;">其它：</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'32\' , \'香港\' )">香港</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'33\' , \'澳门\' )">澳门</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF"><span style="cursor:pointer" onMouseOver="this.style.color=\'#ff7300\'" onMouseOut="this.style.color=\'\'" onClick="javascript:showSubArea( \'34\' , \'台湾\' )">台湾</span></td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '<td align="left" valign="middle" bgcolor="#FFFFFF">&nbsp;</td>';
    htmlDiv += '</tr>';

    htmlDiv += '</table>';

    return htmlDiv;

}

function getAreaIDs(idx) {
    switch (idx) {
    case '6':
        return new Array('71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84');
    case '7':
        return new Array('85', '86', '87', '88', '89', '90', '91', '92', '93');
    case '8':
        return new Array('94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106');
    case '10':
        return new Array('108', '109', '110', '111', '112', '113', '114', '115', '116', '114', '118', '119', '120');
    case '11':
        return new Array('121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131');
    case '12':
        return new Array('132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148');
    case '13':
        return new Array('149', '150', '151', '152', '153', '154', '155', '156', '157');
    case '14':
        return new Array('158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168');
    case '15':
        return new Array('169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185');
    case '16':
        return new Array('186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202'
        /* , '济源市' */
        );
    case '17':
        return new Array('203', '204', '205', '211', '206', '207', '208', '209', '210', '212', '213', '214',
        /*  '仙桃市', '天门市',
						'潜江市', */
        '216', '215');
    case '18':
        return new Array('217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230');
    case '19':
        return new Array('231', '233', '234', '235', '232', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251');
    case '28':
        return new Array('332',
        /* '金昌市', */
        '335', '336', '334', '337', '338', '339', '340', '341', '342', '343', '344', '345');
    case '23':
        return new Array('269', '270', '271', '272', '273', '274', '275', '276', '277', '278', '279', '280', '281', '282', '283', '284', '285', '286', '287', '288', '289');
    case '24':
        return new Array('290', '291', '292', '293', '294', '296', '295', '297', '298');
    case '21':
        return new Array('266', '367', '380');
    case '25':
        return new Array('299', '300', '301', '302', '303', '304',
        /* '思茅市',  */
        '306', '309', '308', '310', '307', '311', '312', '313', '314');
    case '29':
        return new Array('346', '347', '348', '349', '350', '351', '352', '353');
    case '27':
        return new Array('322', '323', '324', '325', '326', '327', '328', '329', '330', '331');
    case '20':
        return new Array('252', '253', '254', '255', '256', '257', '258', '259', '260', '261', '262', '263', '264', '265');
    case '26':
        return new Array('315', '319', '316', '317', '318', '320', '321');
    case '30':
        return new Array('354', '355', '356', '357', '358');
    case '31':
        return new Array('359', '360', '361', '362', '363', '364', '365', '366', '367', '368', '369', '370', '371', '372', '373', '374', '375', '376');
    case '5':
        return new Array('59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70');
    case '33':
        return new Array('378');
    case '32':
        return new Array('377');
    default:
        return new Array();
    }
}

function getAreaNames(idx) {
    switch (idx) {
    case '3':
        return new Array('石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市');
    case '4':
        return new Array('太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市');
        /* case '34':
				return new Array('台北市', '高雄市', '基隆市', '台中市', '台南市', '新竹市',
						'嘉义市', '台北县', '宜兰县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县',
						'南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '澎湖县', '台东县',
						'花莲县'); */
    case '6':
        return new Array('沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市');
    case '7':
        return new Array('长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族');
    case '8':
        return new Array('哈尔滨市', '齐齐哈尔市', '鹤岗市', '双鸭山市', '鸡市', '大庆市', '伊春市', '牡丹江市', '佳木斯市', '七台河市', '黑河市', '绥化市', '大兴安岭');
    case '10':
        return new Array('南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市');
    case '11':
        return new Array('杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市');
    case '12':
        return new Array('合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '巢湖市', '六安市', '亳州市', '池州市', '宣城市');
    case '13':
        return new Array('福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市');
    case '14':
        return new Array('南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市');
    case '15':
        return new Array('济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市');
    case '16':
        return new Array('郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'
        /* , '济源市' */
        );
    case '17':
        return new Array('武汉市', '黄石市', '十堰市', '荆州市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '黄冈市', '咸宁市', '随州市',
        /* '仙桃市', '天门市',
						'潜江市', */
        '神农架林区', '恩施土家族');
    case '18':
        return new Array('长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族');
    case '19':
        return new Array('广州市', '深圳市', '珠海市', '汕头市', '韶关市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市');
    case '28':
        return new Array('兰州市',
        /* '金昌市', */
        '白银市', '天水市', '嘉峪关市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族', '甘南藏族');
    case '23':
        return new Array('成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族', '甘孜藏族', '凉山彝族');
    case '24':
        return new Array('贵阳市', '六盘水市', '遵义市', '安顺市', '铜仁地区', '毕节地区', '黔西南布依族', '黔东南苗族侗族', '黔南布依族');
    case '21':
        return new Array('海口市', '三沙市', '三亚市');
    case '25':
        return new Array('昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市',
        /* '思茅市',  */
        '临沧市', '文山壮族苗族', '红河哈尼族彝族', '西双版纳傣族', '楚雄彝族', '大理白族', '德宏傣族景颇族', '怒江傈傈族', '迪庆藏族');
    case '29':
        return new Array('西宁市', '海东地区', '海北藏族', '黄南藏族', '海南藏族', '果洛藏族', '玉树藏族', '海西蒙古族');
    case '27':
        return new Array('西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市');
    case '20':
        return new Array('南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市');
    case '26':
        return new Array('拉萨市', '那曲地区', '昌都地区', '山南地区', '日喀则地区', '阿里地区', '林芝地区');
    case '30':
        return new Array('银川市', '石嘴山市', '吴忠市', '固原市', '中卫市');
    case '31':
        return new Array('乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市');
    case '5':
        return new Array('呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '锡林郭勒盟', '兴安盟', '阿拉善盟');
    case '33':
        return new Array('澳门特别行政区');
    case '32':
        return new Array('香港特别行政区');
    default:
        return new Array();
    }
}

var Cookies = {};
/** 设置Cookies */
Cookies.set = function(name, value) {
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : '/';
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) + ((expires == null) ? "": ("; expires=" + expires.toGMTString())) + ((path == null) ? "": ("; path=" + path)) + ((domain == null) ? "": ("; domain=" + domain)) + ((secure == true) ? "; secure": "");
};

/** 读取Cookies */
Cookies.get = function(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while (i < clen) {
        j = i + alen;
        if (document.cookie.substring(i, j) == arg) return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
};

Cookies.getCookieVal = function(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};

var XMLHttpReq;
function createXMLHttpRequest() {
    try {
        XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP"); //IE高版本创建XMLHTTP  
    } catch(E) {
        try {
            XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); //IE低版本创建XMLHTTP  
        } catch(E) {
            XMLHttpReq = new XMLHttpRequest(); //兼容非IE浏览器，直接创建XMLHTTP对象  
        }
    }

}
function sendAjaxRequest(url) {
    createXMLHttpRequest(); //创建XMLHttpRequest对象  
    XMLHttpReq.open("put", url, true);
    XMLHttpReq.onreadystatechange = processResponse; //指定响应函数  
    XMLHttpReq.send(null);
}
//回调函数  
function processResponse() {
    if (XMLHttpReq.readyState == 4) {
        if (XMLHttpReq.status == 200) {
            var text = XMLHttpReq.responseText;
            text = window.decodeURI(text);
        }
    }

}