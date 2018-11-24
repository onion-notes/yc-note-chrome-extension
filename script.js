/* eslint-disable */
if(document.URL.indexOf("/favorites") < 0){
	const openUrl = "http://localhost:8080/#/favorites?link=" + encodeURIComponent(document.URL)
	const win = window.open(openUrl, "_blank");
	win.focus();
}
