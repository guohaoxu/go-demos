<%@ page language="java" contentType="text/html; charset=utf-8" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.youboy.jrplatform.commons.file.Uploader" %>

<%
    request.setCharacterEncoding("utf-8");
    response.setCharacterEncoding("utf-8");
    String[] fileType = {".gif", ".png", ".jpg", ".jpeg", ".bmp"};
    Uploader up = new Uploader(request).setSavePath(request.getParameter("imagetype")).setAllowFiles(fileType).setMaxSize(10000).upload();
	
    response.getWriter().print("{'original':'" + up.getOriginalName() + "','url':'" + up.getFileName() + "','title':'" + up.getTitle() + "','state':'" + up.getState() + "'}");
%>
