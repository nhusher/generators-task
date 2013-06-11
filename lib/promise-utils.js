(function(ns) {
    if(process) {
        extend = require('./utils').extend;
        Promise = require('./promise').Promise;
    }

    function ListPromise() {
        ListPromise.superclass.constructor.apply(this, arguments);
    };
    
    function arrayMethod(method) {
        return function() {
            var args = arguments;
            
            return this.then(function(r) {
                if(!Array.isArray(r)) {
                    r = [ r ];
                }
                
                return r[method].apply(r, args);
            });
        };
    }
    
    extend(ListPromise, Promise, {
        forEach     : arrayMethod('forEach'),
        every       : arrayMethod('every'),
        some        : arrayMethod('some'),
        filter      : arrayMethod('filter'),
        map         : arrayMethod('map'),
        reduce      : arrayMethod('reduce'),
        reduceRight : arrayMethod('reduceRight')
    });
    
    ns.ListPromise = ListPromise;

    function collect(promises) {
        var doFulfill,
            doReject,
            promise,
            remaining = promises.length,
            results = new Array(promises.length);
        
        promise = new Promise(function(fulfill, reject) {
            doFulfill = fulfill;
            doReject = reject;
        })
        
        promises.forEach(function(p, i) {
            p.then(function(result) {
                remaining -= 1;
                results[i] = result;
                
                if(remaining === 0) {
                    doFulfill(results);
                }
            }, doReject);
        });
        
        return promise;
    }

    ns.Promise = Promise;
    ns.collect = collect;

}(typeof process !== 'undefined' ? exports : window));
