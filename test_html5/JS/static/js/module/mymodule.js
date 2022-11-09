


/*
 通过闭包原理编写js模块
引入文件，此函数为自执行函数，也就是说一引入就自动执行，添加到window属性，所以可以直接调用


功能：
    在外部调用函数的局部变量
*/

(function myModule(){
    var msg = "Dai Weide"
    function upperName(){
        console.log(msg.toUpperCase())

    }

    function lowerName(){
        console.log(msg.toLowerCase())
    }

    window.myModule = {
        "upperName": upperName,
        "lowerName": lowerName
    }
})()