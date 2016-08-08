/**
 * Created by adrain on 2016/7/25.
 */
$(document).ready(function () {
    //提示：已经在页面导航部分引入了wildog.js和jquery.js
    //要读写数据，必须先创建 Wilddog 引用：
    var ref = new Wilddog("https://xuxiaoyu.wilddogio.com/"),
        arr=[];//创建一个数组

    //把数据提交到野狗去
    $('.s_sub').on('click',function () {

        //找到要提交的值
        var text = $(".s_txt").val();
        //把值提交
        ref.child('danmu').push(text);
        //把输入框清空
        $(".s_txt").val('');
    });

    //点击enter按钮做提交操作
    $(".s_txt").keypress(function (eve) {
        if(eve.keyCode == '13'){
            $('.s_sub').trigger('click');
        };
    });
    //清除所有数据
    $('.s_del').on('click',function () {
        ref.remove();
        arr = [];
        $('.danmu_show').empty();
    });

    //监听云端数据变更，云端数据变化，弹幕框里数据也跟着变化。
    //	当有新增子节点时触发
    ref.child('danmu').on('child_added',function (snapshot) {
        var text=snapshot.val();
        arr.push(text);
        var textObj = $('<div class=\"dm_message\"></div>');
        textObj.text(text);
        $('.danmu_show').append(textObj);
        //调用移动函数
        moveObj(textObj);
    });
    //当有子节点被删除时触发
    ref.child('danmu').on('child_removed',function () {
        arr = [];
        $('.danmu_show').empty();
    });

    //按照时间规则显示弹幕内容
    var topMin = 10,
        topMax = topMin + $('.danmu_mask').height(),
        _top   = topMin;

    var moveObj = function (obj) {
        var _left =  $('.danmu_mask').width() - obj.width();
        _top = _top + 50;

        if (_top > (topMax - 50)) {
            _top = topMin;
        }
        obj.css({
            left: _left,
            top:_top,
            color: getRandomColor()
        });
        var time = 10000 + 10000 * Math.random();

        obj.animate({
            left: "-" + _left + "px"
        }, time, function() {
            obj.remove();
        });
    };

    var getRandomColor=function () {
        return '#' + (function(h) {
                return new Array(7 - h.length).join("0") + h
            })((Math.random() * 0x1000000 << 0).toString(16))
    };

    var getAndRun = function() {
        if (arr.length > 0) {
            var n = Math.floor(Math.random() * arr.length + 1) - 1;
            var textObj = $("<div>" + arr[n] + "</div>");
            $(".dm_show").append(textObj);
            moveObj(textObj);
        }

        setTimeout(getAndRun, 3000);
    }

    jQuery.fx.interval = 10;
    getAndRun();








});