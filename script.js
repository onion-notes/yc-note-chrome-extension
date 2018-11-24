/* eslint-disable */
if(document.URL.indexOf("/favorites") < 0){
	const openUrl = "http://web.yc.ailearning.pro/#/favorites?link=" + encodeURIComponent(document.URL)
	const win = window.open(openUrl, "_blank");
	win.focus();
}
