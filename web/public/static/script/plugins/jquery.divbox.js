//By Robin_TYUT 2010/08/19
//Thank U 4 sharing!
jQuery.fn.extend({
    OpenDiv: function() {

        var sWidth, sHeight;
        sWidth = window.screen.availWidth;
        if (window.screen.availHeight > document.body.scrollHeight) {
            sHeight = window.screen.availHeight;
        } else {
            sHeight = document.body.scrollHeight + 20;
        }
        var maskObj = document.createElement("div");
        maskObj.setAttribute('id', 'BigDiv');
        maskObj.style.position = "absolute";
        maskObj.style.top = "0px";
        maskObj.style.left = "0px";
        maskObj.style.background = "#000";
        maskObj.style.filter = "Alpha(opacity=60);";
        maskObj.style.opacity = "0.6";
        maskObj.style.width = 100 + "%";
        // maskObj.style.height = $(document).height() + "px";
        // maskObj.style.width = sWidth + "px";
        maskObj.style.height = sHeight + "px";
        maskObj.style.zIndex = "998";
        document.body.appendChild(maskObj);
        $("#BigDiv").data("divbox_selectlist", $("select:visible"));
        $("select:visible").hide();
        // $("body").attr("scroll", "no");
        $("body").css({
            "overflow": "hidden"
        }); // 禁用滚动条
        var MyDiv_w = this.width();
        var MyDiv_h = this.height();
        MyDiv_w = parseInt(MyDiv_w);
        MyDiv_h = parseInt(MyDiv_h);
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;

        var Div_topposition = (height / 2) - (MyDiv_h / 2);
        var Div_leftposition = (width / 2) - (MyDiv_w / 2);
        this.css("position", "fixed");
        this.css("z-index", "999");
        this.css("left", Div_leftposition + "px");
        this.css("top", Div_topposition + "px");
        if ($.browser != null && $.browser.mozilla) {
            this.show();
            return;
        }
        this.fadeIn("fast");
    },
    CloseDiv: function() {

        if ($.browser != null && $.browser.mozilla) {
            this.hide();
        } else {
            this.fadeOut("fast");
        }

        $("#BigDiv").data("divbox_selectlist").show();
        // $("body").attr("scroll", "yes");
        $("body").css({
            "overflow-y": "scroll"
        });
        $("#BigDiv").remove();
    }
});

$.extend({
    PageSize: function() {
        var width = 0;
        var height = 0;
        width = window.innerWidth != null ? window.innerWidth: document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth: document.body != null ? document.body.clientWidth: null;
        height = window.innerHeight != null ? window.innerHeight: document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight: document.body != null ? document.body.clientHeight: null;
        return {
            Width: width,
            Height: height
        };
    },
    ScrollPosition: function() {
        var top = 0,
        left = 0;
        if ($.browser.mozilla) {
            top = window.pageYOffset;
            left = window.pageXOffset;
        } else if ($.browser.msie) {
            top = document.documentElement.scrollTop;
            left = document.documentElement.scrollLeft;
        } else if (document.body) {
            top = document.body.scrollTop;
            left = document.body.scrollLeft;
        }
        return {
            Top: top,
            Left: left
        };
    }
});

/**
 * @author linxs
 */
(function($) {
	
	var BoxesCallbock = {};
	
	$.extend({
		openBox : function(title, content, ensureCallback) {
			$("#boxes-title").html(title);
			$("#boxes-content").html(content);
			
			$("#boxes").OpenDiv();
			
			BoxesCallbock.ensure = function() {
				ensureCallback();
			}
			
			$("#boxes-ensure").click(function() {
				new BoxesCallbock.ensure();
				
				BoxesCallbock.ensure = function() {
					//reset this method...
				};
			});
		},
		closeBox : function() {
			$("#boxes").CloseDiv("#boxes");
		},
		openDivBox : function(elem) {
			$(elem).OpenDiv();
		},
		closeDivBox : function(elem) {
			$(elem).CloseDiv(elem);
		}
	});

})(jQuery);
