function upload(prefix,requestPath,uploadForm,callback) {
	this.prefix = prefix;
	this.callback = callback;
	this.requestPath = requestPath;
	this.uploadForm = uploadForm; 
}

upload.prototype.render = function() {
	this.buildUploadForm(this.uploadForm)
	this.click();
	this.change();
}

upload.prototype.click = function() {
	var self = this;
	$("#"+self.prefix+"Btn").click(function(){
		$("#"+self.prefix+"File").click();
	});
}

upload.prototype.change = function() {
	var self = this;
	$("#"+self.prefix+"File").change(function() {
		var filename = this.value.substring(this.value.lastIndexOf("\\")+1,this.value.length);
		$("#"+self.prefix+"FileName").attr("value" , filename);
		$("#"+self.prefix+"Form").ajaxSubmit({
			success : function(data) {
				if (typeof(data) != 'undefined') {
					self.callback(self.prefix, data);
				}
		    }
		 });
	});
}

upload.prototype.buildUploadForm = function(uploadForm) {
	var tmpForm = $("<form id='"+this.prefix+"Form' action='"+ctx.fileUploadUrl+"/image/upload' method='post' enctype='multipart/form-data'></form>");
	tmpForm.append("<input style='display:none' type='file' id='"+this.prefix+"File' name='"+this.requestPath+"' style='filter:alpha(opacity=0);' class='edui-image-file' hidefocus='' accept='image/gif,image/jpeg,image/png,image/jpg,image/bmp' />");
	tmpForm.append("<input type='hidden' name='requestPath' value='"+this.requestPath+"'/>");
	tmpForm.append("<input type='hidden' name='fileName' id='"+this.prefix+"FileName'/>");
	$("#" + uploadForm).append(tmpForm);
}