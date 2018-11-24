/* eslint-disable */
document.addEventListener("signin", function(e) {
    chrome.runtime.sendMessage({ event: 'signin', token: e.detail.token});
});
document.addEventListener("signout", function() {
    chrome.runtime.sendMessage({ event: 'signout'});
});
