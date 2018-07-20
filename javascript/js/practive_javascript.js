"use strict"
var basic = {
    run: function () {
        this.testWrap()
    },
    //浮点数
    testFloat: function () {
        return 0.1 + 0.2
    },
    //判断变量是否真的为NaN
    isReallyNaN: function (x) {
        return x !== x
    },
    //闭包
    box: function () {
        var val = undefined;
        return {
            set: function (newVal) {
                val = newVal
            },
            get: function () {
                return val;
            },
            type: function () {
                return typeof val;
            }
        }
    },
    //闭包通过引用而不是值捕获它们的外部变量
    testWrap: function () {
        function wrapElement(a){
            var result = [];
            for(var i=0;i<a.length;i++){
                (function (j) {    //立即调用函数，解决js缺少块级作用域的方法
                    result[i] = function () {
                        return a[j];
                    }
                })(i);
            }
            return result;
        }
        var wrapped = wrapElement([1,2,3,4,5,6]);
        var f = wrapped[1];
        console.log(f());
    }

};
basic.run();