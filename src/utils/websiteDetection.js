
$(function () {
    layui.use(['element', 'table'], function () {
        // debugger
        // Tab的切换功能，切换事件监听等，需要依赖element模块
        var table = layui.table
            , layer = layui.layer //弹层
            , form = layui.form
            ,element = layui.element;

        element.on('tab(tab-all)', function(){
            debugger
            clearInput();
            $("#result").hide();
            layui.form.render();

        });
    });
});


//通过域名调后端接口进行数据监测
function checkDomin(dominName){
    var tableContent = new Array();
    $("#result").show();
      if(!dominName){
          layer.msg("请输入检测域名")
          return false;
      }
    var h = "http(s)?://";
    var url = "：";
    var reg = new RegExp(h);
    var reg1 = new RegExp(url);
    if(reg1.test(dominName)){
        layer.msg("包含中文冒号")
        return  false;
    }
    if(reg.test(dominName)) {
        //不做处理
    }else {
       dominName = "http://" +dominName;
    }
      //查询数据库中的全部ip
    $.ajax({
        url: '/websiteDetection/getProxyIps',
        type:'GET',
        success:function (result) {
              if(result.length > 0){
                  var str = "共有" + result.length + "个监测点,已完成0个,请稍后...";
                  $("#bq").html(str);
                  var loading = layer.load(2, {
                      shade: false
                  });
                   check(result,0,tableContent,dominName,loading);
              }
        }
    })
    layui.table.render({
        elem:'#detectionList',
        limit:Number.MAX_VALUE, // 数据表格默认全部显示
        cols:[[ //标题栏
            {field:'dps',width:200,title:'监测点'}
            ,{ field: 'ip',width:200, title: '响应ip'}
            , { field: 'address', width:200,title: 'IP归属地' }
            , { field: 'time', width:300,title: '响应时间'}
            ,{field:'status',width:200,title:"响应状态"}
        ]]
        ,data:tableContent
    });
    layui.form.render();
}


function check(result,count,tableContent,dominName,loading) {
    //查询数据库中的全部ip
    if(count < result.length) {
        $.ajax({
            url: '/websiteDetection/checkDomin?domin=' + dominName + "&id=" + result[count],
            type: 'GET',
            async: true,
            success: function (data) {
                count++;
                var str = "共有" + result.length + "个监测点,已完成" + count + "个";
                $("#bq").html(str);
                var detection = data.data;
                tableContent.push(detection);
                console.log(tableContent);
                layui.table.render({
                    elem: '#detectionList',
                    limit: Number.MAX_VALUE, // 数据表格默认全部显示
                    cols: [[ //标题栏
                        {field: 'dps', title: '监测点'}
                        , {field: 'ip', title: '响应域名'}
                        , {field: 'address', title: 'IP归属地'}
                        , {field: 'time', title: '响应时间'}
                        , {
                            field: 'status', title: "响应状态", templet: function (b) {
                                if (b.status) {
                                    return '<span style="color: #5FB878;">连接成功</span>'
                                } else {
                                    return '<span style="color: #FF5722;">连接超时</span>'
                                }
                            }
                        }
                    ]]
                    , data: tableContent
                });
                layui.form.render();
                check(result,count,tableContent,dominName,loading);
            }
        })
    }else{
        layer.close(loading);
    }
}


function checkWall(dominName) {
    layer.closeAll();
    if(!dominName){
        layer.msg("请输入检测域名")
        return false;
    }
    var loading = layer.load(2, {
        shade: false
    });
    $.ajax({
        url: '/detectWall/checkFireWall?domin=' + dominName,
        type:'GET',
        success:function (result) {
           var wallResult = result.data;
        //    console.log(wallResult);
           var type = wallResult.status;
           var name = wallResult.domin;
           var str = "";
           if(type == 0){
               str = "被墙";
           }else if(type == 1){
               str = "正常";
           }else{
               str = "检测超时,请稍后重试！"
           }
            layer.close(loading);
            layer.open({
                type: 0,
                title: "检测结果",
                fixed: false,
                resize: false,
                closeBtn: 0,
                shadeClose: true, //点击旁边可以关闭
                shade:0,
                content: '<div >' +
                    '<div  class="layui-form-item"><div class="layui-form-label" style="width: 70px;display: inline">检测域名：</div><div  class="layui-input-block">'+name+'</div></div>' +
                    '<div  class="layui-form-item"> <div class="layui-form-label" style="width: 70px;display: inline">检测结果：</div><div  class="layui-input-block">'+str+'</div></div>' +
                    '</div>'
            })
        }
    })
}


//ping检测
function pingSite(dominName) {
    debugger
    var tableContent = new Array();
    var  maxTime = 0;   //最慢时间
    var  minTime = 0;   //最快时间
    var  aveTime = 0;   //平均时间
    var times = new Array();
    $("#result").show();
    if(!dominName){
        layer.msg("请输入检测域名")
        return false;
    }
    if(dominName.indexOf("://") != -1){
        dominName = dominName.substring(dominName.indexOf("://") + 3,dominName.length);
    }
    if(dominName.indexOf(":") != -1){
        var i = dominName.indexOf(":");
        dominName = dominName.substring(0,i);
    }
    for(var count = 0; count < 10;count ++) {
        //查询数据库中的全部ip
        if (count == 0) {
            $.ajax({
                url: '/websiteDetection/pingDomin?domin=' + dominName,
                type: 'GET',
                async: false,
                success: function (data) {
                    var  countTime =0;
                    debugger;
                    var pingInfo = data.data;
                    var time = pingInfo.time;
                    times.push(time);
                    for( var j = 0; j < times.length; j++) {
                        countTime = countTime + times[j];
                    }
                    aveTime = countTime/ times.length;
                    if (time > maxTime) {
                        maxTime = time;
                    }
                    if(pingInfo.status){
                        minTime = time;
                    }else{
                        minTime = 0;
                    }
                    var str = "最快：" + minTime + "ms     " + "最慢：" + maxTime + "ms     " + "平均：" + aveTime + "ms";
                    $("#bq").html(str);
                    tableContent.push(pingInfo);
                    layui.table.render({
                        elem: '#detectionList',
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                        cols: [[ //标题栏
                            {field: 'ip', title: '响应Ip'}
                            , {
                                field: 'time', title: "响应时间", templet: function (b) {
                                    if (b.time) {
                                        return '<span>' + b.time + 'ms</span>'
                                    } else {
                                        return '<span> - </span>'
                                    }

                                }
                            }
                            , {
                                field: 'ttl', title: 'TTL', templet: function (b) {
                                    if (b.ttl) {
                                        return '<span>' + b.ttl + '</span>'
                                    } else {
                                        return '<span> - </span>'
                                    }
                                }
                            }
                            , {
                                field: 'status', title: "响应状态", templet: function (b) {
                                    if (b.status) {
                                        return '<span style="color: #5FB878;">连接成功</span>'
                                    } else {
                                        return '<span style="color: #FF5722;">连接超时</span>'
                                    }
                                }
                            }
                        ]]
                        , data: tableContent
                    });
                    layui.form.render();
                }
            })
        } else {
        $.ajax({
            url: '/websiteDetection/pingDomin?domin=' + dominName,
            type: 'GET',
            async: true,
            success: function (data) {
                debugger;
                var  countTime =0;
                var pingInfo = data.data;
                var time = pingInfo.time;
                times.push(time);
                for( var j = 0; j < times.length; j++) {
                    countTime = countTime + times[j];
                }
                aveTime = countTime/ times.length;
                if (time > maxTime) {
                    maxTime = time;
                }
                if(pingInfo.status){
                    if(minTime == 0){
                        minTime = time;
                    }else{
                        if(time < minTime){
                            minTime = time;
                        }
                    }
                }
                var str = "最快：" + minTime + "ms     " + "最慢：" + maxTime + "ms     " + "平均：" + aveTime + "ms";
                $("#bq").html(str);
                tableContent.push(pingInfo);
                layui.table.render({
                    elem: '#detectionList',
                    limit: Number.MAX_VALUE, // 数据表格默认全部显示
                    cols: [[ //标题栏
                        {field: 'ip', title: '响应Ip'}
                        , {
                            field: 'time', title: "响应时间", templet: function (b) {
                                if (b.time) {
                                    return '<span>' + b.time + 'ms</span>'
                                } else {
                                    return '<span> - </span>'
                                }

                            }
                        }
                        , {
                            field: 'ttl', title: 'TTL', templet: function (b) {
                                if (b.ttl) {
                                    return '<span>' + b.ttl + '</span>'
                                } else {
                                    return '<span> - </span>'
                                }
                            }
                        }
                        , {
                            field: 'status', title: "响应状态", templet: function (b) {
                                if (b.status) {
                                    return '<span style="color: #5FB878;">连接成功</span>'
                                } else {
                                    return '<span style="color: #FF5722;">连接超时</span>'
                                }
                            }
                        }
                    ]]
                    , data: tableContent
                });
                layui.form.render();
            }
        })
        }
    }
    layui.form.render();
}


//通过两个域名进行网站测速对比
function compareDomin(domin1,domin2) {
    var tableContent = new Array();
    var num = 0;
    $("#detectionList").show();
    if(!domin1){
        layer.msg("请输入第一个检测域名")
        return false;
    }
    if(!domin2){
        layer.msg("请输入第二个检测域名")
       return false;
    }
    //查询数据库中的全部ip
    $.ajax({
        url: '/websiteDetection/getProxyIps',
        type:'GET',
        success:function (result) {
            if(result.length > 0){
                var str = "共有" + result.length + "个监测点,已完成0个,请稍后...";
                $("#bq").html(str);
                for(var i = 0; i < result.length; i ++){
                    // console.log(result[i]);
                    //查询数据库中的全部ip
                    $.ajax({
                        url: '/websiteDetection/compareDomin?domin1=' + domin1+"&domin2="+domin2+"&id=" +result[i],
                        type:'GET',
                        async:true,
                        success:function (data) {
                            num++;
                            debugger
                            var str = "共有" + result.length + "个监测点,已完成"+num+"个";
                            $("#bq").html(str);
                            for(var x =0; x < data.length; x ++){
                                tableContent.push(data[x]);
                            }
                            // console.log(tableContent);
                            layui.table.render({
                                elem:'#detectionList',
                                limit:Number.MAX_VALUE, // 数据表格默认全部显示
                                cols:[[ //标题栏
                                    {field:'dps',title:'监测点'}
                                    ,{ field: 'ip',title: '响应域名'}
                                    , { field: 'address', title: 'IP归属地' }
                                    , { field: 'time',title: '响应时间'}
                                    ,{field:'status',title:"响应状态",templet:function (b) {
                                            if(b.status){
                                                return'<span style="color: #5FB878;">连接成功</span>'
                                            }else{
                                                return'<span style="color: #FF5722;">连接超时</span>'
                                            }
                                        }}
                                ]]
                                ,data:tableContent
                            });
                            layui.form.render();
                        }
                    })
                }
            }
        }
    })
    layui.table.render({
        elem:'#detectionList',
        limit:Number.MAX_VALUE, // 数据表格默认全部显示
        cols:[[ //标题栏
            {field:'dps',width:200,title:'监测点'}
            ,{ field: 'ip',width:200, title: '响应ip'}
            , { field: 'address', width:200,title: 'IP归属地' }
            , { field: 'time', width:300,title: '响应时间'}
            ,{field:'status',width:200,title:"响应状态"}
        ]]
        ,data:tableContent
    });
    layui.form.render();

}


/*
* 合并单元格(如果结束行传0代表合并所有行)
* @param table1    表格的ID
* @param startRow  起始行
* @param endRow    结束行
* @param col   合并的列号，对第几列进行合并(从0开始)。第一行从0开始
*/
function mergeCell(table1, startRow, endRow, col) {
    var tb = document.getElementById(table1);
    if(!tb || !tb.rows || tb.rows.length <= 0) {
        return;
    }
    if(col >= tb.rows[0].cells.length || (startRow >= endRow && endRow != 0)) {
        return;
    }
    if(endRow == 0) {
        endRow = tb.rows.length - 1;
    }
    for(var i = startRow; i < endRow; i++) {
        if(tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) { //如果相等就合并单元格,合并之后跳过下一行
            tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col]);
            tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan) + 1;
        } else {
            mergeCell(table1, i + 1, endRow, col);
            break;
        }
    }
}


function clearInput() {
    $("#bq").html("");
    $("#pingName").val("");
    $("#dominName").val("");
    layer.closeAll();
}

