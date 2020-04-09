





function getStyle(obj, name){

    /*
    获取指定元素当前所有样式
        obj 要获取样式的元素
        name 要获取的样式名
    */

    if(window.getComputedStyle){
        // 正常浏览器的方式，具有getComputedStyle方法

        return getComputedStyle(obj, null)[name]
    }else{
        // IE8的方式，没有getComputedStyle（）方法

        return obj.currentStyle[name];
    }
}




function move(obj, attr, target, speed, callback){

    /*
    参数：

        obj：执行动画的对象
        attr: 要执行动画的样式,left，width
        target： 执行动画的目标位置
        speed： 移动的速度
        callback: 动画执行完毕之后执行
    */

    // 关闭上一个定时器
    clearInterval(obj.timer);


    // 获取元素当前位置

    var current = parseInt(getStyle(obj, attr))

    /*
    如果从0到800移动，则speed为正
    如果从800到0移动，则speed为负
    
    */
    if(current > target){
        speed = -speed
    }

    // 开启一个定时器，用来执行动画效果
    obj.timer = setInterval(function(){
        // 获取obj原来的left值

        var oldValue = parseInt(getStyle(obj, attr)) 

        // 在旧值的基础上增加
        var newValue = oldValue + speed;

        // 向左移动时，需要判断newValue是否小于target
        // 向右移动时，需要判断newValue是否大于target
        if((speed < 0 && newValue < target) || (speed > 0 && newValue > target)){
            newValue = target;
        }

        // 将新值设置给obj
        obj.style[attr] = newValue + "px";

        // 当新值移动到800px时，使其停止动画

        if (newValue==target){

            clearInterval(obj.timer)
            // 动画执行完毕，调用回调函数
            callback && callback()
        }
    }, 30)



}



/*

拖拽
事件捕获中使用 在拖拽练习

box1.setCapter && box1.setCapter()
box1.releaseCapture && box1.releaseCapture()
*/

function drag(obj){
    /*
    拖拽元素

        obj：被拖拽的元素对象
    */

    obj.onmousedown = function(event){

        event = event || window.event

        // if (box1.setCapter){
        //     box1.setCapter()
        // }

        obj.setCapter && obj.setCapter()


        // 求div的水平偏移量   event.clientX - box1.offsetLeft
        // 求div的垂直偏移量   event.clientY - box1.offsetTop

        var ol = event.clientX - obj.offsetLeft
        var ot = event.clientY - obj.offsetTop

        // 为document绑定一个onmousemove事件
        document.onmousemove = function(event){
            event = event || window.event

            // 当鼠标移动时被拖拽元素跟随鼠标移动
            // 获取鼠标坐标
            var left = event.clientX - ol
            var top = event.clientY - ot

            // 修改box1的位置

            obj.style.left = left + "px"
            obj.style.top = top + "px"
        }


        // 为元素绑定一个鼠标松开事件
        document.onmouseup = function(){
            // 当鼠标松开时，被拖拽元素固定在当前位置
            // 取消document的onmousemove事件

            document.onmousemove = null;
            // 取消document.onmouseup事件
            document.onmouseup = null;

            obj.releaseCapture && obj.releaseCapture()
        }


        /*
        当我们拖拽一个网页中的内容的时候，浏览器会默认去搜索引擎中搜索内容，
        此时会导致拖拽功能异常，这个时浏览器提供的默认行为
        如果不希望发生这个行为，可以通过return false来取消默认行为

        但是这招对IE8不起作用

        所以如果要在IE8中使用，要使用setCapture
        */

        return false
    }
}



/*

向指定元素绑定句柄
*/

function bind(obj, eventStr, callback){

    /*
    向指定元素绑定句柄
        obj 要绑定的事件
        eventStr 事件的字符串（不要on）
        callback 回调函数
    */
    if(obj.addEventListener){
        // 大部分浏览器兼容的方式
        obj.addEventListener(eventStr, callback, false)

    }else{
        // IE8及一下,需要修改this的调用者
        obj.attachEvent("on"+eventStr, function(){
            callback
        });
    }
}




function addClass(obj, cn){
    /*
    向一个元素中添加指定的属性值

    参数：
        obj 要添加的class属性
        cn  要添加的class值
    
    */

    if(!hasClass(obj, cn)){
        obj.className += " " + cn
    }
}


function removeClass(obj, cn){
    /*
    向一个元素中删除指定的属性值
    参数：
        obj 要添加的class属性
        cn  要添加的class值

    */

   var p = new RegExp("\\b"+ cn + "\\b")

   obj.className = obj.className.replace(p, "")
}


function toggleClass(obj, cn){
    /*
    切换一个元素中的类

    如果元素中有该类，则删除，
    如果元素中没有该类，则添加
    */

    // 判断obj中是否有cn
    if(hasClass(obj, cn)){
        // 有则删除
        removeClass(obj, cn);
    }else{
        // 没有，则添加
        addClass(obj, cn)
    }
}





function hasClass(obj, cn){

    // 判断obj中有没有cn 的class

    var p = new RegExp("\\b"+ cn + "\\b")

    return p.test(obj.className)
}