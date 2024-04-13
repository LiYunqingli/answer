/*开发者声明

---------------

开发者：李华荣（YQL）
时间：24/04/12 最后一次合并代码到主分支
联系方式：168278282@qq.com
主页：https://lihuarong.cn:8080/

$-请勿删除本声明-$

---------------

请尊重开发者的劳动成果，未经允许，请勿抄袭代码。*/

/* 如果用到本项目的任何代码，请标明出处以及开发者。*/


function start() {
    document.querySelector(".main").style.display = "flex";
    document.querySelector(".kaishi").style.display = "none";
}

//全屏
function enterFullScreen() {
    start();
    var element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(error => {
            console.error('Failed to enter fullscreen:', error);
        });
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen().catch(error => {
            console.error('Failed to enter fullscreen:', error);
        });
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen().catch(error => {
            console.error('Failed to enter fullscreen:', error);
        });
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen().catch(error => {
            console.error('Failed to enter fullscreen:', error);
        });
    }
}

function escapeHtml(unsafe) {
    var str = unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/&lt;br&gt;/g, "<br>") // 避免格式化 <br>
    // console.log(str);
    return str;
}


//定义全局json数据包
var data_1_ok, data_2_ok, data_3_ok;

//定义当前显示的题目数据包
var title_ok, options_ok, answer_ok;

var local_answer;

var data1_answer_ok = {};
var data2_answer_ok = {};
var data3_answer_ok = {};

var type_ok, id_ok;

//获取url的参数id
let urlParams = new URLSearchParams(window.location.search); //获取搜索栏的字符串
let id = urlParams.get("id");
if (id == null) {
    alert(`error，未知的试题id：${id}，默认切换到第一套`);
    id = 1;
}else if(id != 1 && id != 2 && id != 3){
    alert(`error，未知的试题id：${id}，默认切换到第一套`);
    id = 1;
}
//请求json
var xhr = new XMLHttpRequest();
xhr.open("GET", `./data/lilun${id}.json`, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        var data_1 = data.data1;
        var data_2 = data.data2;
        var data_3 = data.data3;
        data_1_ok = data_1;
        data_2_ok = data_2;
        data_3_ok = data_3;
        document.querySelector(".tip").innerHTML = data.msg;
        start_x_r();
    }
};
xhr.send();

function start_x_r() {
    //开始渲染画面
    console.log(data_1_ok);
    console.log(data_2_ok);
    console.log(data_3_ok);

    var shuchu1 = "";
    var shuchu2 = "";
    var shuchu3 = "";
    for (let key in data_1_ok) {
        if (data_1_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data_1_ok[key]);
            shuchu1 += `
              <div class="option" onclick="show_detail('1','${key}')" id="a_${key}">${key}</div>
              `;
        }
    }
    for (let key in data_2_ok) {
        if (data_2_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data_1_ok[key]);
            shuchu2 += `
              <div class="option" onclick="show_detail('2','${key}')" id="b_${key}">${key}</div>
              `;
        }
    }
    for (let key in data_3_ok) {
        if (data_3_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data_1_ok[key]);
            shuchu3 += `
              <div class="option" onclick="show_detail('3','${key}')" id="c_${key}">${key}</div>
              `;
        }
    }
    document.getElementById("_1").innerHTML = shuchu1;
    document.getElementById("_2").innerHTML = shuchu2;
    document.getElementById("_3").innerHTML = shuchu3;
    show_detail('1', 1)
}

function show_detail(type, id) {
    type_ok = Number(type);
    id_ok = Number(id);
    console.log(type + " " + id);
    if (type == "1") {
        var tit = data_1_ok[id].title;
        var data = data_1_ok[id].options;
        var answer = data_1_ok[id].answer;
        title_ok = tit;
        options_ok = data;
        answer_ok = answer;
        console.log(data);
        tit = escapeHtml(tit);
        console.log("格式化：" + tit);
        document.querySelector(".timu").innerHTML = id + "、" + tit;
        var option_shuchu = "";

        function numberToLetter(num) {
            if (num < 1 || num > 26) {
                return "Out of range: " + num;
            }
            return String.fromCharCode(64 + parseInt(num, 10));
        }

        var answer = update_option('1', id);

        for (var i = 0; i < data.length; i++) {
            var toletter = numberToLetter(i + 1);
            var option_save = escapeHtml(data[i]);
            if (i == answer - 1) {
                option_shuchu += `
          <div class="option_detail checked_option" onclick="save_answer('1','${id}','${i+1}');update_color(1,'${i}')" value="${i}"">${toletter}、${option_save}</div>
          `;
            } else {
                option_shuchu += `
          <div class="option_detail" onclick="save_answer('1','${id}','${i+1}');update_color(1,'${i}')" value="${i}">${toletter}、${option_save}</div>
          `;
            }
        }
        document.getElementById("option").innerHTML = option_shuchu + "<p></p>";

        var options = document.querySelectorAll(".option");
        for (var i = 0; i < options.length; i++) {
            options[i].style.backgroundColor = "rgb(199, 226, 250)";
            //当鼠标悬停的时候
            options[i].onmouseover = function () {
                this.style.backgroundColor = "rgb(255, 255, 255)";
            }
            options[i].onmouseout = function () {
                this.style.backgroundColor = "rgb(199, 226, 250)";
                show_detail(type, id)
            }
        }


        update();
        document.querySelector("#a_" + id).style.backgroundColor = "rgb(88 188 249)";

    } else if (type == "2") {
        var tit = data_2_ok[id].title;
        var data = data_2_ok[id].options;
        var answer = data_2_ok[id].answer;
        title_ok = tit;
        options_ok = data;
        answer_ok = answer;
        console.log(data);
        tit = escapeHtml(tit);
        console.log("格式化：" + tit);
        document.querySelector(".timu").innerHTML = id + "、" + tit;
        var option_shuchu = "";

        function numberToLetter(num) {
            if (num < 1 || num > 26) {
                return "Out of range: " + num;
            }
            return String.fromCharCode(64 + parseInt(num, 10));
        }

        var answer = String(update_option('2', id));
        console.log("fdsfdsajdfkllklklklkklklklk:" + answer)
        var answers = answer.split('');
        for (var i = 0; i < data.length; i++) {
            console.log(answers)
            var toletter = numberToLetter(i + 1);
            var option_save = escapeHtml(data[i]);
            if (answers.includes(String(i + 1))) {
                option_shuchu += `
          <div class="option_detail checked_option" onclick="save_answer('2','${id}','${i+1}');update_color(2,'${i}')" value="${i}">${toletter}、${option_save}</div>
          `;
            } else {
                option_shuchu += `
          <div class="option_detail" onclick="save_answer('2','${id}','${i+1}');update_color(2,'${i}')" value="${i}">${toletter}、${option_save}</div>
          `;
                console.log("判断为false");
            }
        }
        document.getElementById("option").innerHTML = option_shuchu + "<p></p>";

        var options = document.querySelectorAll(".option");
        for (var i = 0; i < options.length; i++) {
            options[i].style.backgroundColor = "rgb(199, 226, 250)";
            //当鼠标悬停的时候
            options[i].onmouseover = function () {
                this.style.backgroundColor = "rgb(255, 255, 255)";
            }
            options[i].onmouseout = function () {
                this.style.backgroundColor = "rgb(199, 226, 250)";
                show_detail(type, id)
            }
        }

        update();
        document.querySelector("#b_" + id).style.backgroundColor = "rgb(88 188 249)";
    } else if (type == "3") {
        var tit = data_3_ok[id].title;
        var data = data_3_ok[id].options;
        var answer = data_3_ok[id].answer;
        title_ok = tit;
        options_ok = data;
        answer_ok = answer;
        console.log(data);
        tit = escapeHtml(tit);
        console.log("格式化：" + tit);
        document.querySelector(".timu").innerHTML = id + "、" + tit;
        var option_shuchu = "";

        function numberToLetter(num) {
            if (num < 1 || num > 26) {
                return "Out of range: " + num;
            }
            return String.fromCharCode(64 + parseInt(num, 10));
        }

        var answer = update_option('3', id);

        for (var i = 0; i < data.length; i++) {
            var toletter = numberToLetter(i + 1);
            var option_save = escapeHtml(data[i]);
            if (i == answer - 1) {
                option_shuchu += `
          <div class="option_detail checked_option" onclick="save_answer('3','${id}','${i+1}');update_color(3,'${i}')" value="${i}">${toletter}、${option_save}</div>
          `;
            } else {
                option_shuchu += `
          <div class="option_detail" onclick="save_answer('3','${id}','${i+1}');update_color(3,'${i}')" value="${i}">${toletter}、${option_save}</div>
          `;
            }
        }
        document.getElementById("option").innerHTML = option_shuchu + "<p></p>";

        var options = document.querySelectorAll(".option");
        for (var i = 0; i < options.length; i++) {
            options[i].style.backgroundColor = "rgb(199, 226, 250)";
            //当鼠标悬停的时候
            options[i].onmouseover = function () {
                this.style.backgroundColor = "rgb(255, 255, 255)";
            }
            options[i].onmouseout = function () {
                this.style.backgroundColor = "rgb(199, 226, 250)";
                show_detail(type, id)
            }
        }

        update();
        document.querySelector("#c_" + id).style.backgroundColor = "rgb(88 188 249)";
    }

}


function save_answer(a, b, c) {
    console.log("save answer to: " + a + " " + b + " " + c);
    if (a == '1') {
        // 将答案按照 b:c写入数组 data1_answer_ok
        data1_answer_ok[b] = c;
        local_answer = c;
        console.log(" ")
        console.log(" ")
        console.log("data1_answer_ok: ")
        console.log(data1_answer_ok);
        console.log()

    } else if (a == '2') {
        // 将答案按照 b:c写入数组 data1_answer_ok
        if (data2_answer_ok[b] != undefined) {
            data2_answer_ok[b] = data2_answer_ok[b] + c;
        } else {
            data2_answer_ok[b] = c;
        }

        local_answer += c;
        console.log(" ")
        console.log(" ")
        console.log("data2_answer_ok: ")
        console.log(data1_answer_ok);
        console.log()
    } else if (a == '3') {
        // 将答案按照 b:c写入数组 data1_answer_ok
        data3_answer_ok[b] = c;
        local_answer = c;
        console.log(" ")
        console.log(" ")
        console.log("data3_answer_ok: ")
        console.log(data1_answer_ok);
        console.log()
    }
}

function update() {
    for (let key in data1_answer_ok) {
        if (data1_answer_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data1_answer_ok[key]);
            document.querySelector("#_1 #a_" + key).style.backgroundColor = "#2ed12e";
            console.log("fdsa")
        }
    }
    for (let key in data2_answer_ok) {
        if (data2_answer_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data1_answer_ok[key]);
            document.querySelector("#_2 #b_" + key).style.backgroundColor = "#2ed12e";
            console.log("fdsa")
        }
    }
    for (let key in data3_answer_ok) {
        if (data3_answer_ok.hasOwnProperty(key)) {
            // console.log(key);
            // console.log(data1_answer_ok[key]);
            document.querySelector("#_3 #c_" + key).style.backgroundColor = "#2ed12e";
            console.log("fdsa")
        }
    }
}

function update_option(type, id) {
    if (type == '1') {
        return data1_answer_ok[id];
    } else if (type == '2') {
        return data2_answer_ok[id];
    } else if (type == '3') {
        return data3_answer_ok[id];
    } else {
        console.log("error");
    }
}

function update_color(type, index) {
    if (type != 2) {
        document.querySelectorAll(".option_detail")[index].classList.add("checked_option");
        // 除了index，其他应用卸载样式checked_option
        for (let i = 0; i < document.querySelectorAll(".option_detail").length; i++) {
            if (i != index) {
                document.querySelectorAll(".option_detail")[i].classList.remove("checked_option");
            }
        }
    } else {
        document.querySelectorAll(".option_detail")[index].classList.add("checked_option");
    }
}

function update_down() {
    if (type_ok == 1) {
        var length = Object.keys(data_1_ok).length;
    } else if (type_ok == 2) {
        var length = Object.keys(data_2_ok).length;
    } else if (type_ok == 3) {
        var length = Object.keys(data_3_ok).length;
        if (id_ok == length) {
            alert("已经是最后一题了");
            return;
        }
    } else {
        return;
    }
    console.log(length);
    if (Number(id_ok) == length) {
        show_detail(type_ok + 1, 1);
    } else {
        show_detail(type_ok, id_ok + 1);
    }
}

function update_up() {
    if (type_ok == 1) {
        var length = Object.keys(data_1_ok).length;
        if (id_ok == 1) {
            alert("已经是第一题了");
            return;
        }
    } else if (type_ok == 2) {
        var length = Object.keys(data_2_ok).length;
    } else if (type_ok == 3) {
        var length = Object.keys(data_3_ok).length;
    } else {
        return;
    }
    console.log(length);
    if (Number(id_ok) == 1) {
        show_detail(type_ok - 1, 1);
    } else {
        show_detail(type_ok, id_ok - 1);
    }
}

//判定对错   没写完
function show_answer() {
    //获取chcked_option的value,如果没有则则返回输出consol.log()
    var answer = document.querySelectorAll(".checked_option");
    // 判断是否有获取到值
    if (answer.length > 0) {
        for (var i = 0; i < answer.length; i++) {
            var answer_value = answer[i].getAttribute("value");
            console.log(Number(answer_value) + 1);
            console.log(answer_ok);
            var answer_ok_s = answer_ok.split('');
            if (answer_ok_s.includes(String(Number(answer_value) + 1))) {
                answer[i].style.backgroundColor = "#00800091";
                console.log("正确");
            }
            //  else {
            //     //获取#option的第id项
            //     document.querySelectorAll(".option_detail")[Number(answer_value) - 1].style.backgroundColor = "#ff000091";
            //     console.log("错误");
            // }

            function numberToLetter(num) {
                if (num < 1 || num > 26) {
                    return "Out of range: " + num;
                }
                return String.fromCharCode(64 + parseInt(num, 10));
            }

            //给#option最后增加p标签，并且将answer_ok 的值赋给p标签的innerHTML
            // document.querySelector("#option p").innerHTML = "正确答案：" + numberToLetter(answer_ok);
            var shuchu_answer = "正确答案：";
            for (var j = 0; j < answer_ok_s.length; j++) {
                shuchu_answer += numberToLetter(answer_ok_s[j]) + " ";
            }
            document.querySelector("#option p").innerHTML = shuchu_answer;
        }

        //单独写一个循环来判断错误的选项
        var option_all = document.querySelectorAll(".checked_option");
        for (var i = 0; i < option_all.length; i++) {
            var answer_value = answer[i].getAttribute("value");
            var answer_ok_s = answer_ok.split('');
            if (answer_ok_s.includes(String(Number(answer_value) + 1)) == false) {
                answer[i].style.backgroundColor = "#ff000091";
                console.log("错误");
            }
        }
        // var answer_ok_s = answer_ok.split('');
        // for (var j = 0; j < answer_ok_s.length; j++) {
        //     var local_answer_s = local_answer.split('');
        //     for (var i = 0; i < local_answer_s.length; i++) {
        //         if (local_answer_s[i] != answer_ok_s[j]) {
        //             document.querySelectorAll(".option_detail")[Number(local_answer_s[i]) - 1].innerHTML += "（未选择）";
        //         }else{
        //             break
        //         }
        //     }
        // }

        var answer_ok_s = answer_ok.split('');
        var local_answer_s = local_answer.split('');

        // 使用 filter 方法筛选出 local_answer_s 中存在但 answer_ok_s 中不存在的元素
        var missingElements = answer_ok_s.filter(function (element) {
            return local_answer_s.indexOf(element) === -1;
        });
        console.log("存在于 local_answer_s 中但不存在于 answer_ok_s 中的元素:", missingElements);
        for (var i = 0; i < missingElements.length; i++) {
            document.querySelectorAll(".option_detail")[Number(missingElements[i]) - 1].innerHTML += "<span style='font-weight:bold;color:red;'>（未选择）</span>";
        }

    } else {
        alert("请先选择答案");
    }

}

//快捷键
document.addEventListener('keydown', function (event) {
    if (event.key === 'a' || event.key === 'A') {
        //a
        update_up();
    } else if (event.key === 'd' || event.key === 'D') {
        //d 
        update_down();
    } else if (event.key === 's' || event.key === 'S') {
        //s
        show_answer();
    }
});