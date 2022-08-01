'use strict';

var io=io("https://oleg-chat.herokuapp.com");

class Client{
	constructor(){
		this.xhr=this.getXhrType(),this.check(),this.nano(),this.emojiInitialize(),this.num=0,this.count=0,this.alias="",this.lastId=0,this.loadMoreMsgs=0,this.load=0,this.date=new Date,this.bot = 0,this.red = 0,this.blue = 0,this.day = 0
	}

	emojiInitialize(){
    	for(var a=0;7>a;a++)for(var b=0;27>b&&(document.getElementsByClassName("nano-content")[1].innerHTML+="<div onmouseover='smileOver(this)' onmouseout='smileOut(this)' onclick='addSmile(this)' style='margin-top:5px;margin-left:10px;cursor:pointer;display:inline-block;margin-right:-4px;width:26px;height:26px;background:url(../assets/spraits/emojisprite.png);background-position: -"+26*b+"px -"+26*a+"px;background-size: 702px 182px;'></div>",11!=a||26!=b);b++);
        this.nano()
	}

	getXhrType(){var a;try{a=new ActiveXObject("Msxml2.XMLHTTP")}catch(b){try{a=new ActiveXObject("Microsoft.XMLHTTP")}catch(b){a=0}}return a||"undefined"==typeof XMLHttpRequest||(a=new XMLHttpRequest),a}

	check(){
		const a=this.xhr;a.onload=a.onerror=function(){200==a.status?0==a.responseText?window.location="index.html":(this.num=JSON.parse(a.responseText).id,this.alias=JSON.parse(a.responseText).alias,this.getMsgs()):alert("Error! Please try again later!")}.bind(this),a.open("GET","/check"),a.send()
	}

	getMsgs(){
		const a=this.xhr;a.onload=a.onerror=function(){200==a.status?0==a.responseText?(this.loadMoreMsgs=1,document.getElementsByClassName("msgs-history-selected")[0].innerHTML="You haven't got any msgs yet."):(this.showMsgsCycle(JSON.parse(a.responseText),0),document.getElementsByClassName("nano-content")[0].scrollTop=document.getElementsByClassName("nano-content")[0].scrollHeight):alert("Error! Please try again later!"),document.getElementsByClassName("media-progress")[0].style.width="0px"}.bind(this),a.onprogress=function(a){document.getElementsByClassName("media-progress")[0].style.width=Math.round(100*a.loaded/a.total)+"%"},a.open("GET","https://oleg-chat.herokuapp.com/get_msgs"),a.send()
	}

	getMoreMsgs(a){
	    if(a.scrollTop <= 100 && this.loadMoreMsgs != 1 && this.load != 1) {

            this.load = 1;

            var x = this.xhr;

            x.open("POST", "https://oleg-chat.herokuapp.com/get_more_msgs", true);
        
            x.setRequestHeader("Content-Type", "application/json");
        
            x.send(JSON.stringify({lastId: this.lastId}));
        
            x.onload = function() {
        
                if(this.responseText == 0) {
                    this.loadMoreMsgs = 1;
                } else {
                    this.showMsgsCycle(JSON.parse(x.responseText),1)
                    document.getElementsByClassName("media-progress")[0].style.width = "0px"
                }
            }.bind(this)

            x.onprogress=function(a){document.getElementsByClassName("media-progress")[0].style.width=Math.round(100*a.loaded/a.total)+"%"}
        
            x.onerror = function() {
                alert(this.responseText);
            }
        }
	}

	showMsgsCycle(b,c){
		for(var d,e=0;e<b.length;e++)d=document.getElementsByClassName("nano-content")[0].scrollHeight,$(document.getElementsByClassName("msgs-history-selected")[0]).prepend("<div class='msg-wrap' id="+b[e].id+" onmouseover='msgsMouseOver("+b[e].id+")' onmouseout='msgsMouseOut("+b[e].id+")'><div class='delete-btn' data-id='"+b[e].id+"' onclick='client.deleteMessage(this);'></div><div class='msg-wrap-big'><div class='msg-content'><span class='msg-date'>"+b[e].date_min+"</span><div class='msg-body msg-body-min'><div class='msg-content-text'><span class='msg-text'><span class='msg-sender'>"+b[e].alias+"</span>: "+b[e].text+"</span></div></div></div></div>"),this.msgsHeightChange(d),e==b.length-1&&(this.lastId=b[e].id),1==c&&(this.load=0)
	}
	
	msgsHeightChange(a){
		document.getElementsByClassName("msgs-history-selected")[0].scrollHeight>a?document.getElementsByClassName("msgs-history-selected")[0].style.marginTop="0px":(document.getElementsByClassName("msgs-history-selected")[0].style.marginTop=a-document.getElementsByClassName("msgs-history-selected")[0].scrollHeight-30+"px",document.getElementsByClassName("msgs-history-selected")[0].scrollHeight>a-30&&(document.getElementsByClassName("msgs-history-selected")[0].style.marginTop="0px")),this.nano()}nano(){$(".nano").nanoScroller()
	}
	
	getTime(){
		return 10<=this.date.getMinutes()?10<=this.date.getSeconds()?this.date.getHours()+":"+this.date.getMinutes():this.date.getHours()+":"+this.date.getMinutes():10<=this.date.getSeconds()?this.date.getHours()+":0"+this.date.getMinutes():this.date.getHours()+":0"+this.date.getMinutes()
	}
	
	typing(){
		let b=++this.count;var a=setTimeout(function(){b==this.count?io.emit("stop_typing"):(clearTimeout(a),io.emit("typing",this.num,this.alias))}.bind(this),500);return!1}sanitize(a){return a.replace(/<script>|[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gim,"")
	}
	
	sendMsgFromKey(a){
		"13"==a.keyCode&&this.sendMsg(a)
	}
	
	sendMsg(){
		var a=this.sanitize(document.getElementsByClassName("msgs-send-textarea")[0].innerHTML);

		//var a=document.getElementsByClassName("msgs-send-textarea")[0].innerHTML;
        
        if(a != "") {

        	document.getElementsByClassName("msgs-send-textarea")[0].innerHTML=""

        	io.emit("new_message",{msg:a,id:this.num,alias:this.alias,time:this.getTime()});

        	var hello = ["../assets/video/hello1.mp4", "../assets/video/hello2.mp4"];
    		var thanks = ["../assets/video/thanks1.mp4", "../assets/video/thanks2.mp4"];
    		var bye = ["../assets/video/bye1.mp4", "../assets/video/bye2.mp4", "assets/video/bye3.mp4"];

            if(this.bot == 1) {
            	if(a.match("Hello") || a.match("Hi") || a.match("hello") || a.match("hi") || a.match("Привет") || a.match("привет") || a.match("прив") || a.match("Здравствуйте") || a.match("здравствуйте") || a.match("здравствуй") || a.match("добрый день") || a.match("день добрый")) {
    				//io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src='+hello[Math.floor(Math.random() * 2)]+'></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src='+hello[Math.floor(Math.random() * 2)]+'></video>');
    			} else if(a.match("thank you") || a.match("Thank you") || a.match("thanks") || a.match("Thanks") || a.match ("Спасибо") || a.match ("спасибо") || a.match ("спасибки") || a.match ("Спасибо вам") || a.match ("cпасибо Вам") || a.match ("Спасибо Вам")) {
    				//io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src='+thanks[Math.floor(Math.random() * 2)]+'></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src='+thanks[Math.floor(Math.random() * 2)]+'></video>');
    			} else if(a.match("До свидания") || a.match("Goodbye") || a.match("Пока") || a.match("Прощай") || a.match ("до свидания") || a.match ("goodbye") || a.match ("Bye") || a.match ("bye") || a.match ("пока") || a.match ("прощай")) {
    			    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src='+bye[Math.floor(Math.random() * 3)]+'></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src='+bye[Math.floor(Math.random() * 3)]+'></video>');
    			} else if(a.match("расписание") || a.match("Расписание") || a.match("timetable") || a.match ("расп") || a.match ("rasp") || a.match ("Расп") || a.match ("Rasp") || a.match ("table")) {
    			    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/timetable1.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/timetable1.mp4></video>');
    			} else if(a.match("синяя") || a.match("blue") || a.match("Синяя") || a.match("Blue") || a.match ("синее") || a.match ("Синее") || a.match ("синеватое") || a.match ("син") || a.match ("Син") || a.match ("bue") || a.match ("bl") || a.match ("Bue") || a.match ("Bl")) {
        		    this.red = 0
    				this.blue = 1
    			    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/blue_ask.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/blue_ask.mp4></video>');
    			} else if(a ==  "красная" || a ==  "red" || a ==  "Красная" || a ==  "Red" || a ==  "крас" || a ==  "красноватое" || a ==  "крас" || a ==  "R" || a ==  "r") {
    				this.red = 1
    				this.blue = 0 
        		    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/red_ask.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
        		    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/red_ask.mp4></video>');
        		} else if((a ==  "Да" || a ==  "да" || a ==  "yes" || a ==  "Yes" || a ==  "ye" || a ==  "Ye") && (this.red == 1 || this.blue == 1)) {
        			//io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/day_choose.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
        			io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/day_choose.mp4></video>');
        			this.day = 1
        		} else if(a ==  "Нет" || a ==  "нет" || a ==  "no" || a ==  "No" || a ==  "не" || a ==  "Не") {
    			    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/gotit.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/gotit.mp4></video>');
    			} else if((a.match("понедельник") || a.match("monday") || a.match("mon") || a.match ("Понедельник") || a.match ("Monday") || a.match ("Mon") || a.match ("пон") || a.match ("Пон")) && this.day == 1) {
    				if(this.red == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/mon_red.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/mon_red.mp4></video>');
    				} else if(this.blue == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/mon_blue.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/mon_blue.mp4></video>');
    				}
    			} else if((a.match("вторник") || a.match("tuesday") || a.match("tue") || a.match ("Вторник") || a.match ("Tuesday") || a.match ("tue")) && this.day == 1) {
    				if(this.red == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/tue_red.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/tue_red.mp4></video>');
    				} else if(this.blue == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/tue_blue.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/tue_blue.mp4></video>');
    				}
    			} else if((a.match("среда") || a.match("wednesday") || a.match("wed") || a.match ("Среда") || a.match ("Wednesday") || a.match ("Wed")) && this.day == 1) {
    				if(this.this.red == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/wed_red.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/wed_red.mp4></video>');
    				} else if(this.blue == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/wed_blue.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/wed_blue.mp4></video>');
    				}
    			} else if((a.match ("четверг") || a.match ("thursday") || a.match ("th") || a.match ("Th") || a.match ("Четверг") || a.match ("Thursday")) && this.day == 1) {
            			io.emit("bot_msg", "<div class=error>В четверг у вас военная кафедра!</div>");
    			} else if((a.match("пятница") || a.match("friday") || a.match("fri") || a.match ("Пятница") || a.match ("Friday") || a.match ("Fri")) && this.day == 1) {
    				if(this.red == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/fri_red.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/fri_red.mp4></video>');
    				} else if(this.blue == 1) {
    				    //io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/fri_blue.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    				    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/fri_blue.mp4></video>');
    				}
    			} else if((a.match ("суббота") || a.match ("saturday") || a.match ("sat") || a.match ("Sat") || a.match ("Суббота") || a.match ("Saturday") || a.match ("Sat")) && this.day == 1) {
    				//io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/sat.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/sat.mp4></video>');
    			} else if((a.match ("воскресенье") || a.match ("sunday") || a.match ("sun") || a.match ("Sun") || a.match ("Воскресенье") || a.match ("sunday") || a.match ("Sat") && day == 1)) {
            		//videoAppend("Воскресенье выходной!");
            		io.emit("bot_msg", '<div class=error>Воскресенье выходной!</div>');
    			} else if(a == "bot_stop") {
    				//io.emit("new_message",{msg:"Бот остановлен!",id:0,alias:"Bot",time:this.getTime()});
    				io.emit("bot_msg", "<div class=error>Бот остановлен!</div>");
    				this.bot = 0;
    			} else {
    				//io.emit("new_message",{msg:'<video type=video/mp4 controls=controls width=350 height=200 src=../assets/video/error1.mp4></video>',id:0,alias:"Bot",time:this.getTime()});
    			    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/error1.mp4></video>');
    			}
            } else {
        		if(a == "bot_start") {
        			this.bot = 1;
        			//io.emit("new_message",{msg:"Бот активирован!",id:0,alias:"Bot",time:this.getTime()});
        		    //var hello = ["../assets/video/hello1.mp4", "../assets/video/hello2.mp4"];
        		    //io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src=../assets/video/.mp4></video>');
        		    io.emit("bot_msg", '<video type=video/mp4 controls=controls width=500 height=700 src='+hello[Math.floor(Math.random() * 2)]+'></video>');
        		}
        	} 
        } else {
        	document.getElementsByClassName("msgs-send-textarea")[0].focus();
        }

		//return""==a?document.getElementsByClassName("msgs-send-textarea")[0].focus():(document.getElementsByClassName("msgs-send-textarea")[0].innerHTML="",io.emit("new_message",{msg:a,id:this.num,alias:this.alias,time:this.getTime()})),!1
	}
	
	deleteMessage(a){
		var b=a.getAttribute("data-id");io.emit("delete_message",{id:b,alias:this.alias})
	}
	
	sendPhoto(a){
		var c=a.files[0];this.sendMediaNext(a,2,c);
	}
	
	sendMedia(a){
		var c=a.files[0];if((c.name).match(/.jpeg|.jpg|.gif|.png/gim) == null){this.sendMediaNext(a,1,c);}else{let res = confirm("Do you want to send file as photo?");(res == true)?this.sendMediaNext(a,2,c):this.sendMediaNext(a,1,c);}
	}
	
	sendMediaNext(a,b,c){
		const d=c.size+"-"+this.num+"-"+c.name,e=this.xhr;e.onload=e.onerror=function(){if(200==e.status){const a=JSON.parse(e.responseText);this.uploadFile(c,a.signedRequest,a.url,b,d)}else alert("Error while uploading!")}.bind(this),e.open("GET",`/media_upload?file-name=${d}&file-type=${c.type}`),e.send()
	}
	
	uploadFile(a,b,c,d,e){
		const f=this.xhr;f.onload=f.onerror=function(){if(200==f.status){if(1===d){io.emit("new_message",{msg:"<a href=https://oleg-chat.s3.amazonaws.com/"+e+" download>"+a.name+"</a>",id:this.num,alias:this.alias,time:this.getTime()});}else if(2===d){let img = document.createElement('img');img.src='https://oleg-chat.s3.amazonaws.com/'+e+'';img.onload = function(){io.emit("new_message",{msg:"<img class=file-img src=https://oleg-chat.s3.amazonaws.com/"+e+" width=350 height=200 />",id:this.num,alias:this.alias,time:this.getTime()});}.bind(this);}else{io.emit("new_message",{msg:"<a href=https://oleg-chat.s3.amazonaws.com/"+e+" download>"+a.name+"</a>",id:this.num,alias:this.alias,time:this.getTime()});}}else{alert("Could not upload file.");}document.getElementsByClassName("media-progress")[d].style.width="0px"}.bind(this),f.upload.onprogress=function(a){document.getElementsByClassName("media-progress")[d].style.width=Math.round(100*a.loaded/a.total)+"%"},f.open("PUT",b),f.send(a)
	}
	
	getId(){
		return this.num
	}
	
	getNotifySound(){
		return this.notify
	}
	
	getOnlineStatus(){
		return this.online
	}
}

let client=new Client;

function addSmile(a){
	var x=parseInt(a.style.backgroundPositionX);var y=parseInt(a.style.backgroundPositionY);(x==0)?x=0:x-=6*(x/26);(y==0)?y=0:y-=6*(y/26);document.getElementsByClassName("msgs-send-textarea")[0].innerHTML+="<img class='emoji' src='../assets/spraits/blank.gif' style='background-position:"+x+"px "+y+"px' onresizestart='return false'>";document.getElementsByClassName("msgs-send-textarea")[0].focus();
}

function showSmiles(){
	document.getElementsByClassName("emoji-list")[0].style.display="none"==document.getElementsByClassName("emoji-list")[0].style.display?"inline-block":"none"}function smileOver(a){a.style.boxShadow="0 0 5px rgb(70,90,124)"
}

function smileOut(a){
	a.style.boxShadow="0 0 0px transparent"
}

function msgsMouseOver(a){
	document.getElementById(a).childNodes[0].style.visibility="visible"
}

function msgsMouseOut(a){
	document.getElementById(a).childNodes[0].style.visibility="hidden"
}

io.on("typing",function(a,b){a!=client.getId()&&(document.getElementsByClassName("msgs-history-typing-wrap-text")[0].innerHTML=b+" typing...")}),io.on("stop_typing",function(){document.getElementsByClassName("msgs-history-typing-wrap-text")[0].innerHTML=""}),io.on("delete_message",function(a){var b=document.getElementsByClassName("nano-content")[0].scrollHeight,c=document.getElementById(a.id);c.innerHTML="This message has been deleted by "+a.alias,client.msgsHeightChange(b),document.getElementsByClassName("nano-content")[0].scrollTop=document.getElementsByClassName("nano-content")[0].scrollHeight}),io.on("new_message",function(a){var b=document.getElementsByClassName("nano-content")[0].scrollHeight;$(document.getElementsByClassName("msgs-history-selected")[0]).append("<div class='msg-wrap' id="+a.id+" onmouseover='msgsMouseOver("+a.id+")' onmouseout='msgsMouseOut("+a.id+")'><div class='delete-btn' data-id='"+a.id+"' onclick='client.deleteMessage(this);'></div><div class='msg-wrap-big'><div class='msg-content'><span class='msg-date'>"+a.time+"</span><div class='msg-body msg-body-min'><div class='msg-content-text'><span class='msg-text'><span class='msg-sender'>"+a.alias+"</span>: "+a.msg+"</span></div></div></div></div>"),io.on("bot_msg", function(a){document.getElementsByClassName("video-container")[0].innerHTML = a}),client.msgsHeightChange(b),document.getElementsByClassName("nano-content")[0].scrollTop=document.getElementsByClassName("nano-content")[0].scrollHeight});