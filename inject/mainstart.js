let jsurl = chrome.runtime.getURL('inject/hstart.js');
let script = document.createElement('script');
script.src = jsurl;
script.setAttribute('crossorigin', 'anonymous');
document.querySelector('*').appendChild(script);
