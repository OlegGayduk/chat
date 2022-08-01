    const server = "https://oleg-chat.herokuapp.com"; 
    var io = io(server);

    var count = 0;

    var num = 0;
    var alias = "";

    var lastId = 0;

    var loadMoreMsgs = 0;

    var load = 0;

class Client {
    constructor(num) {
    
        this.num = num;

        this.xhr = this.getXhrType();

        this.date = new Date();
    }

    getXhrType() {

        var x;
    
        try {
            x = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                x = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                x = 0;
            }
        }
    
        if(!x && typeof XMLHttpRequest != 'undefined') x = new XMLHttpRequest();
    
        return x;
    }

    sendMedia(t, type) {

        //alert(this.date.getMinutes());
        //var n = ++this.num;
        //alert(n);

        var file = t.files[0];

        const fileId = file.size + '-' + window.num + '-' + file.name;

        const xhr = this.xhr;

        xhr.onload = xhr.onerror = function() {
            if (this.status == 200) {

                const response = JSON.parse(this.responseText);

                this.uploadFile(file, response.signedRequest, response.url, type , fileId);

            } else {
                console.log("Error " + this.status);
            }
        };

        xhr.open('GET', `/media_upload?file-name=${fileId}&file-type=${file.type}`);

        xhr.send();
    }

    uploadFile(file, signedRequest, url, type, fileId){

        const xhr = this.xhr;

        xhr.onload = xhr.onerror = function() {
            if (this.status == 200) {

                document.getElementsByClassName('media-progress')[type].style.width = "0px";
                    
                if(type == 0) {
                    io.emit("new_message", {
                        msg: '<a href=https://oleg-chat.s3.amazonaws.com/'+fileId+' download>'+file.name+'</a>',
                        id:  window.num,
                        alias: window.alias,
                        time: getTime()
                    });
                } else {
                    //alert(file.clientWidth);
                    io.emit("new_message", {
                        msg: '<img src=https://oleg-chat.s3.amazonaws.com/'+fileId+' width=350 height=300/>',
                        id:  window.num,
                        alias: window.alias,
                        time: getTime()
                    });
                }
            } else {
              alert('Could not upload file.');
            }
        };

      xhr.upload.onprogress = function(event) {
        document.getElementsByClassName('media-progress')[type].style.width = Math.round((event.loaded * 100) / event.total) + "%";
      }

      xhr.open('PUT', signedRequest);

      xhr.send(file);
    }
}

    upload = new Client(num);

    window.onload = function() {

        /*for(var u = 0;u < 12;u++) {
            for(var i = 0;i < 24;i++) {
                document.getElementsByClassName("nano-content")[1].innerHTML += "<div onmouseover='smileOver(this)' onmouseout='smileOut(this)' onclick='addSmile(this)' style='margin-top:5px;margin-left:10px;cursor:pointer;display:inline-block;margin-right:-4px;width:16px;height:16px;background:url("+"../img/emoji.png"+");background-position: -"+i * 16+"px -"+u * 16+"px;'></div>";
                if(u == 11 && i == 16) break;
            }
        }*/

        for(var a=0;7>a;a++)for(var b=0;27>b&&(document.getElementsByClassName("nano-content")[1].innerHTML+="<div onmouseover='smileOver(this)' onmouseout='smileOut(this)' onclick='addSmile(this)' style='margin-top:5px;margin-left:10px;cursor:pointer;display:inline-block;margin-right:-4px;width:26px;height:26px;background:url(../assets/spraits/emojisprite.png);background-position: -"+26*b+"px -"+26*a+"px;background-size: 702px 182px;'></div>",11!=a||26!=b);b++);
        //this.nano()

        $('.nano').nanoScroller();
    }

    function addSmile(a) {
        //document.getElementsByClassName("msgs-send-textarea")[0].innerHTML += "<img class='emoji' src='../assets/spraits/blank.gif' style='background-position:"+t.style.backgroundPosition+"' onresizestart='return false'>";
        var x=parseInt(a.style.backgroundPositionX);var y=parseInt(a.style.backgroundPositionY);(x==0)?x=0:x-=6*(x/26);(y==0)?y=0:y-=6*(y/26);document.getElementsByClassName("msgs-send-textarea")[0].innerHTML+="<img class='emoji' src='../assets/spraits/blank.gif' style='background-position:"+x+"px "+y+"px' onresizestart='return false'>";document.getElementsByClassName("msgs-send-textarea")[0].focus();
    }

    function showSmiles() {
        (document.getElementsByClassName("emoji-list")[0].style.display == "none") ? document.getElementsByClassName("emoji-list")[0].style.display = "inline-block" : document.getElementsByClassName("emoji-list")[0].style.display = "none";
        //(document.getElementsByClassName("emoji-list")[0].style.visibility == "hidden") ? document.getElementsByClassName("emoji-list")[0].style.visibility = "visible" : document.getElementsByClassName("emoji-list")[0].style.visibility = "hidden";
    }

    function smileOver(t) {
        t.style["boxShadow"] = "0 0 5px rgb(70,90,124)";
    }

    function smileOut(t) {
        t.style["boxShadow"] = "0 0 0px transparent";
    }

    function sendMedia(t, type) {

        var file = t.files[0];

        var fileId = file.size + '-' + window.num + '-' + file.name;

        var xhr = getXhrType();

        xhr.onload = xhr.onerror = function() {
            if (this.status == 200) {

                const response = JSON.parse(this.responseText);

                uploadFile(file, response.signedRequest, response.url, type , file, fileId);

            } else {
                console.log("Error " + this.status);
            }
        };

        /*xhr.upload.onprogress = function(event) {
          document.getElementsByClassName('media-progress')[type].style.width = Math.round((event.loaded * 100) / event.total) + "%";
        }*/

        xhr.open('GET', `/media_upload?file-name=${fileId}&file-type=${file.type}`);

        xhr.send();
    }

    function uploadFile(file, signedRequest, url, type, fileId){

        const xhr = getXhrType();

        xhr.onload = xhr.onerror = function() {
            if (this.status == 200) {

                document.getElementsByClassName('media-progress')[type].style.width = "0px";
                    
                if(type == 0) {
                    io.emit("new_message", {
                        msg: '<a href=https://oleg-chat.s3.amazonaws.com/'+fileId+' download>'+file.name+'</a>',
                        id:  window.num,
                        alias: window.alias,
                        time: getTime()
                    });
                } else {
                    //alert(file.clientWidth);
                    io.emit("new_message", {
                        msg: '<img src=https://oleg-chat.s3.amazonaws.com/'+fileId+' width=350 height=300/>',
                        id:  window.num,
                        alias: window.alias,
                        time: getTime()
                    });
                }
            } else {
              alert('Could not upload file.');
            }
        };

      xhr.upload.onprogress = function(event) {
        document.getElementsByClassName('media-progress')[type].style.width = Math.round((event.loaded * 100) / event.total) + "%";
      }

      xhr.open('PUT', signedRequest);

      xhr.send(file);
    }

    function getXhrType() {

        var x;
    
        try {
            x = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                x = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                x = 0;
            }
        }
    
        if(!x && typeof XMLHttpRequest != 'undefined') x = new XMLHttpRequest();
    
        return x;
    }

    function getMoreMsgs(t) {
        if(t.scrollTop <= 100 && window.loadMoreMsgs != 1 && window.load != 1) {

            console.log(lastId);

            window.load = 1;

            var x = getXhrType();

            x.open("POST", server + "/get_more_msgs", true);
        
            var id = {
                lastId: lastId
            };
        
            x.setRequestHeader("Content-Type", "application/json");
        
            x.send(JSON.stringify(id));
        
            x.onload = function() {
        
                if(this.responseText == 0) {
                    loadMoreMsgs = 1;
                } else {
                    var data = JSON.parse(this.responseText);
                    for (var a = 0; a < data.length; a++) {
                        // display message
                        // creates new DOM element
                        var con = document.getElementsByClassName('nano-content')[0].scrollHeight;
                        
                        $(document.getElementsByClassName('msgs-history-selected')[0]).prepend(
                        "<div class='msg-wrap' id="+data[a].id+" onmouseover='msgsMouseOver("+data[a].id+")' onmouseout='msgsMouseOut("+data[a].id+")'>"+
                        "<div class='delete-btn' data-id='" + data[a].id + "' onclick='deleteMessage(this);'></div>"+
                        "<div class='msg-wrap-big'>"+
                            "<div class='msg-content'>"+
                                "<span class='msg-date'>"+data[a].date_min+"</span>"+
                                "<div class='msg-body msg-body-min'>"+
                                    "<div class='msg-content-text'>"+
                                        "<span class='msg-text'><span class='msg-sender'>" + data[a].alias + "</span>" + ": " + data[a].text + "</span>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>"); 
                        //}
                        
                        msgsHeightChange(con);
                        
                        if(a == (data.length - 1)) {
                            lastId = data[a].id;
                            load = 0;
                        }
                    }
                }
            }
        
            x.onerror = function() {
                //alert("Server error! Please try again later!");
                alert(this.responseText);
            }
        }
    }

    function typing(t) {

        let a = ++count,

        time = setTimeout(function () {

            if (a == window.count) {
                io.emit("stop_typing");
            } else {
                clearTimeout(time);
                io.emit("typing", window.alias);
            }
        }, 500);

        return false;
    }

    function sanitize(text) {
        return text.replace(/<script>|[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gim, "");
    }

    function sendMsgFromKey(e) {

        if(e.keyCode == "13") sendMsg(e);

        return;
    }

    function sendMsg(e) {

        var msg = sanitize(document.getElementsByClassName("msgs-send-textarea")[0].innerHTML);

        //alert(msg);

        if(msg != "") {

            document.getElementsByClassName("msgs-send-textarea")[0].innerHTML= "";
            
            var time = getTime();
     
            //(time == false) ? io.emit("new_message", {msg: msg,id:  window.num,alias: window.alias}) : io.emit("new_message", {msg: msg,id:  window.num,alias: window.alias})
    
            io.emit("new_message", {
                msg: msg,
                id:  window.num,
                alias: window.alias,
                time: time
            });
        } 
        
        // this is prevent the form submitting
        return false;
    }

    $.ajax({
        url: server + '/check',
        method: "GET",
        success: function(response) {
            if(response == 0) {

                window.location = "index.html";

            } else {

                window.num = response.id;
                window.alias = response.alias;

                $.ajax({
                    url: server + '/get_msgs',
                    method: "GET",
                    success: function(response) {

                        //console.log(response);

                        if(response == 0) {
                            loadMoreMsgs = 1;
                            document.getElementsByClassName('msgs-history-selected')[0].innerHTML = "You haven't got any msgs yet.";
                        } else {

                            var data = JSON.parse(response);
                            for (var a = 0; a < data.length; a++) {
                                // display message
                                // creates new DOM element
                                var con = document.getElementsByClassName('nano-content')[0].scrollHeight;
                                
                                $(document.getElementsByClassName('msgs-history-selected')[0]).prepend(
                                "<div class='msg-wrap' id="+data[a].id+" onmouseover='msgsMouseOver("+data[a].id+")' onmouseout='msgsMouseOut("+data[a].id+")'>"+
                                "<div class='delete-btn' data-id='" + data[a].id + "' onclick='deleteMessage(this);'></div>"+
                                "<div class='msg-wrap-big'>"+
                                    "<div class='msg-content'>"+
                                        "<span class='msg-date'>"+data[a].date_min+"</span>"+
                                        "<div class='msg-body msg-body-min'>"+
                                            "<div class='msg-content-text'>"+
                                                "<span class='msg-text'><span class='msg-sender'>" + data[a].alias + "</span>" + ": " + data[a].text + "</span>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"); 
                                //}
                                
                                msgsHeightChange(con);

                                document.getElementsByClassName('nano-content')[0].scrollTop = document.getElementsByClassName('nano-content')[0].scrollHeight;

                                if(a == (data.length - 1)) lastId = data[a].id;

                            }
                        }
                    }
                });
            }
        }
    });

    function msgsMouseOver(id) {
        //document.getElementById(id).style.visibility = "visible";
        (document.getElementById(id).childNodes[0]).style.visibility = "visible";
    }

    function msgsMouseOut(id) {
        (document.getElementById(id).childNodes[0]).style.visibility = "hidden";
    }

    function getTime() {

        var dat = new Date();

        if(dat.getMinutes() >= 10) {
            if(dat.getSeconds() >= 10) {
                return dat.getHours() + ':' + dat.getMinutes();
            } else {
                return dat.getHours() + ':' + dat.getMinutes();
            }
        } else {
            if(dat.getSeconds() >= 10) {
                return dat.getHours() + ':0' + dat.getMinutes();
            } else {
                return dat.getHours() + ':0' + dat.getMinutes();
            }
        }
    }

    function msgsHeightChange(con) {

        if(document.getElementsByClassName('msgs-history-selected')[0].scrollHeight > con) {
            document.getElementsByClassName('msgs-history-selected')[0].style.marginTop = "0px";
        } else {
            document.getElementsByClassName('msgs-history-selected')[0].style.marginTop = con - document.getElementsByClassName('msgs-history-selected')[0].scrollHeight - 30 + 'px';
        
            if(document.getElementsByClassName('msgs-history-selected')[0].scrollHeight > (con - 30)) document.getElementsByClassName('msgs-history-selected')[0].style.marginTop = "0px";
        }
        
        $('.nano').nanoScroller();
        
        return;
    }

    function deleteMessage(self) {
        // get message id
        var id = self.getAttribute("data-id");

        //send event to server
        io.emit("delete_message", {
            id: id,
            alias: window.alias
        });
    }

    io.on('typing', function(name) {
        if(name != window.alias) document.getElementsByClassName('msgs-history-typing-wrap-text')[0].innerHTML = name + " typing...";
    });

    io.on('stop_typing', function() {
        //console.log("typing");
        document.getElementsByClassName('msgs-history-typing-wrap-text')[0].innerHTML = "";
    });

    // attach listener on client
    io.on("delete_message", function(data) {

        var con = document.getElementsByClassName('nano-content')[0].scrollHeight;
        // get node by id
        var node = document.getElementById(data.id);
        node.innerHTML = "This message has been deleted by " + data.alias;

        //$('.nano').nanoScroller();

        msgsHeightChange(con);

        document.getElementsByClassName('nano-content')[0].scrollTop = document.getElementsByClassName('nano-content')[0].scrollHeight;
    });

    // client will listen from server 
    io.on("new_message", function (data) {

        console.log("Server says", data);
        
        var con = document.getElementsByClassName('nano-content')[0].scrollHeight;
                
        $(document.getElementsByClassName('msgs-history-selected')[0]).append(
        "<div class='msg-wrap' id="+data.id+" onmouseover='msgsMouseOver("+data.id+")' onmouseout='msgsMouseOut("+data.id+")'>"+
        "<div class='delete-btn' data-id='" + data.id + "' onclick='deleteMessage(this);'></div>"+
        "<div class='msg-wrap-big'>"+
            "<div class='msg-content'>"+
                "<span class='msg-date'>" + data.time + "</span>"+
                "<div class='msg-body msg-body-min'>"+
                    "<div class='msg-content-text'>"+
                        "<span class='msg-text'><span class='msg-sender'>" + data.alias + "</span>" + ": " + data.msg + "</span>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"); 
        
        msgsHeightChange(con);

        document.getElementsByClassName('nano-content')[0].scrollTop = document.getElementsByClassName('nano-content')[0].scrollHeight;

        //lastId = data.id;
    });