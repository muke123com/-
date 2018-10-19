"use strict";

//匿名函数
(function (global, factory) {
    global.basic = factory();
})(this, function () {
    'use strict'
    var basic = {
        run: function () {
            this.testCall()
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
        },
        //高阶函数：将函数作为参数或返回值的函数
        testFunction: function () {
            var names = ['Warcraft', 'Witcher 3', 'Watch Dog'];
            var uppers = [];
            uppers = names.map(function (name) {
                return name.toUpperCase();
            });
            console.log(uppers);
        },
        //call apply bind
        testCall: function () {
            //ex1
            var table1 = {
                name: 'Warcraft',
                getUpper: function (a) {
                    console.log(a);
                    return this.name.toUpperCase();
                },
                getName: function(a){
                    return this.name;
                }
            };
            var table2 = {
                name: 'Watch Dog',
                getLower: function (a) {
                    console.log(a);
                    return this.name.toLowerCase();
                }
            };
            // console.log(table2.getLower.call(table1, '参数call'));   //table1 获取table2的getLower方法
            // console.log(table1.getUpper.apply(table2,['apply', 1]));   //table1 获取table2的getLower方法
            // console.log(table1.getName.bind(table2)());  //将table2中的属性引入table1中
            //ex2
            var source = ["867", "-", "5520"];
            var buffer = {
                entries: [],
                add: function (s) {
                    this.entries.push(s);
                },
                concat: function(){
                    return this.entries.join("")
                }
            };
            // source.forEach(buffer.add, buffer);
            source.forEach(buffer.add.bind(buffer));
            console.log(buffer.concat());
        },
        //迭代器
        testIterator: function () {
            //es5
            function values() {
                var i = 0;
                var n = arguments.length;
                var a = arguments;
                return {
                    hasNext: function(){
                        return i < n;
                    },
                    next: function () {
                        if(i >= n) {
                            throw new Error("end of iteration")
                        }
                        return a[i++];
                    }
                }
            }
            var it = values(1,2,5,8,52,2,1,4,5,6);
            console.log(it.next(),it.next(),it.next(),it.next());

            //es6
            function *valuesEs6() {
                var a = arguments;
                for(var i=0;i<a.length;i++){
                    yield a[i];
                }
            }
            let itEs6 = valuesEs6(1,2,5,8,52,2,1,4,5,6);
            console.log(itEs6.next(),itEs6.next(),itEs6.next(),itEs6.next());
        }
    };
    return basic;
});
