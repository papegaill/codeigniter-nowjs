//Get session cookie with cookie plugin
var session_id = $.cookie('ci_session');

$('form').submit(function(e) {
	now.distributeMessage($("textarea").val(),session_id);
	$("textarea").val('');
	e.preventDefault();
});

now.receiveMessage = function(message){
	$("#messages").append(message + "<br>");
};