var MyPromise = function (func) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.status = 'pending';
    func(this.resolve, this.reject);
}

MyPromise.all = function (arr) {
    var results = [];
    var i = 0, j = 1;
    return new MyPromise(function (resolve, reject) {
        while (func = arr[i]) {
            (function (i) {
                func.then(function (result) {
                    results[i] = result;
                    if (j === arr.length) {
                        resolve(results);
                    }
                    j++;
                }, function (err) {
                    reject(err);
                });
            })(i)
            i++;
        }
    })

}

MyPromise.prototype.resolve = function (result) {
    this.status = 'resolved';
    this.resolveFunc(result);
}

MyPromise.prototype.reject = function (err) {
    this.status = 'rejected';
    this.rejectFunc(err);
}

MyPromise.prototype.then = function (resolveFunc, rejectFunc) {
    if (resolveFunc) this.resolveFunc = resolveFunc.bind(this);
    if (rejectFunc) this.rejectFunc = rejectFunc.bind(this);
}

MyPromise.prototype.catch = function (rejectFunc) {
    this.then(null, rejectFunc);
}