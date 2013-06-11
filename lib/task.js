(function(ns) {
    var normalize;

    if(process) {
        Promise = require('./promise').Promise;
    }

    function Generator(gen) {
        this.send = function(x) {
            try {
                return {
                    value: gen.send(x)
                };
            } catch (e) {
                if (e instanceof StopIteration) {
                    return {
                        done: true
                    };
                } else {
                    throw e;
                }
            }
        };
        
        this.throw = function(x) {
            try {
                return {
                    value: gen.throw(x)
                };
            } catch (e) {
                if (e instanceof StopIteration) {
                    return {
                        done: true
                    };
                } else {
                    throw e;
                }
            }
        };
    };
    
    try {
        // check if a function with an asterisk is valid syntax by evaluating it
        eval("function* f(){}");
        normalize = function (gen) {
            return gen;
        };
    } catch (e) {
        normalize = function (gen) {
            return new Generator(gen);
        };
    }

    function tx (spawn) {
        return function(val) {
            var gen,
                promise,
                doReject,
                doFulfill,
                doAccept = function (value) { next(null, value); },
                doFail   = function (error) { next(error); };
        
            promise = new Promise(function(fulfill, reject) {
                doFulfill = function(value) {
                    if (Promise.isPromise(value)) {
                        value.then(fulfill, reject);
                    } else {
                        fulfill(value);
                    }
                };
            
                doReject = reject;
            });
        
            function next(error, value) {
                var result,
                    resultValue;
            
                try {
                    result = arguments.length === 1 ? gen.throw(error) : gen.send(value);
                } catch (e) {
                    doReject(e);
                }
            

                resultValue = result.value;
            
                if(result.done) {
                    doFulfill(resultValue);
                } else if(Promise.isPromise(resultValue)){
                    resultValue.then(doAccept, doFail);
                } else {
                    doAccept(resultValue);
                }
            }
 
            try {
                gen = normalize(spawn.call(this, val));
                next();
            } catch (e) {
                doReject(e);
            }
            return promise;
        };
    }

    ns.tx = tx;
    ns.task = function(spawn) {
        return tx(spawn)();
    };
    
}(typeof process !== 'undefined' ? exports : window));

