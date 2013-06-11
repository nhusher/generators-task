(function(ns) {
    
    function ajax(url) {
        return new Promise(function(fulfill, reject) {
            var xhr = new XMLHttpRequest(),
                start = Date.now(),
                timeout;

            xhr.onreadystatechange = function () {
                var e;
                if (xhr.readyState === 4) {

                    if(timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    if (xhr.status === 0) {
                        e = new Error('Request aborted.');
                        reject(e);
                    } else if (xhr.status >= 400) {
                        e = new Error(xhr.statusText);
                        e.status = xhr.status;
                        reject(e);
                    } else {
                        fulfill({
                            status: xhr.status,
                            statusText: xhr.statusText,
                            responseText: xhr.responseText
                        });
                    }
                }
            };
        
            xhr.open('GET', url, true);
            xhr.send();
            
            this.abort = function() {
                xhr.abort();
                return this;
            };
            
            this.timeout = function(countdown) {
                var passed = Date.now() - start,
                    self = this;
                if(timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                
                if(countdown - passed <= 0) {
                    xhr.abort();
                } else {
                    timeout = setTimeout(function() {
                        xhr.abort();
                    }, countdown - passed);
                }
            };
        });
    }

    function json(url) {
        var promise = ajax(url),
            out = promise.then(function(res) { return JSON.parse(res.responseText); })
        
        out.timeout = promise.timeout;
        out.abort   = promise.abort;
        return out
    }

    function sleep(duration) {
        return new Promise(function(fulfill) {
            setTimeout(function() {
                fulfill();
            }, duration || 0);
        });
    }

    ns.collect = collect;
    ns.ajax    = ajax;
    ns.json    = json;
    ns.sleep   = sleep;
    
}(typeof process !== 'undefined' ? exports : window));
