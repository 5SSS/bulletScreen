// console.log(Math.random().toString(36).substr(2, 8));
(function hookXHR () {var send = XMLHttpRequest.prototype.send;;XMLHttpRequest.prototype.send = function () {send.apply(this, [])}})();
