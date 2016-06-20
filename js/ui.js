var canvas1;
var screenHeight, screenWidth;
var totalPoints=0, totalLines=0;
var select=0;
var mouseX, mouseY, mouseB, mouseM=0;
var ortho=false;
var menuState=true, objectMenu;
var commandLine, responseLine, responseTimer=null;
var stop=false;
window.onload=function()
{
	canvas1=document.getElementById("canvas");
	objectMenu=document.getElementById("objectManager");
	commandLine=document.getElementById("command");
	responseLine=document.getElementById("response");
	draw=canvas.getContext("2d");
	canvas1.onmousemove=STmousemove;
	canvas1.onmousedown=mousedown;
	canvas1.onmouseup=mouseup;
	document.onmouseup=function(e){mouseB=null};
	worldColor=new Color(51, 51, 51);
	worldLight=new Color(100, 100, 100);
	cameraLight=new Color(200, 200, 200);
	vecCameraLight=new Vector(-0.5, 0.5, 1);
	vecCameraLight.vnormal();
	changeWorldLight();

	cameraCenter=new Point(0, 0, 0);
	camera=new Point(0, 0, -1000);
	
	document.getElementById('objectSelected').options.add(new Option("None"));
	objects.push(new _Object("None"));
	objects[0].center=new Point(0, 0, 0);
	document.getElementById('objectSelected').options.add(new Option("Default Cube"));
	objects.push(new _Object("Default Cube"));
	objects[1].randomColor();
	objects[1].addPoint(5, -5, -5);
	objects[1].addPoint(5, 5, -5);
	objects[1].addPoint(-5, 5, -5);
	objects[1].addPoint(-5, -5, -5);
	objects[1].addPoint(5, -5, 5);
	objects[1].addPoint(5, 5, 5);
	objects[1].addPoint(-5, 5, 5);
	objects[1].addPoint(-5, -5, 5);
	objects[1].newMesh();
	objects[1].addPointToMesh(0);
	objects[1].addPointToMesh(1);
	objects[1].addPointToMesh(2);
	objects[1].addPointToMesh(3);
	objects[1].addLine(0, 1);
	objects[1].addLine(1, 2);
	objects[1].addLine(2, 3);
	objects[1].addLine(3, 0);
	objects[1].newMesh();
	objects[1].addPointToMesh(4);
	objects[1].addPointToMesh(7);
	objects[1].addPointToMesh(6);
	objects[1].addPointToMesh(5);
	objects[1].addLine(4, 7);
	objects[1].addLine(7, 6);
	objects[1].addLine(6, 5);
	objects[1].addLine(5, 4);
	objects[1].newMesh();
	objects[1].addPointToMesh(0);
	objects[1].addPointToMesh(4);
	objects[1].addPointToMesh(5);
	objects[1].addPointToMesh(1);
	objects[1].addLine(0, 4);
	objects[1].addLine(4, 5);
	objects[1].addLine(5, 1);
	objects[1].addLine(1, 0);
	objects[1].newMesh();
	objects[1].addPointToMesh(1);
	objects[1].addPointToMesh(5);
	objects[1].addPointToMesh(6);
	objects[1].addPointToMesh(2);
	objects[1].addLine(1, 5);
	objects[1].addLine(5, 6);
	objects[1].addLine(6, 2);
	objects[1].addLine(2, 1);
	objects[1].newMesh();
	objects[1].addPointToMesh(2);
	objects[1].addPointToMesh(6);
	objects[1].addPointToMesh(7);
	objects[1].addPointToMesh(3);
	objects[1].addLine(2, 6);
	objects[1].addLine(6, 7);
	objects[1].addLine(7, 3);
	objects[1].addLine(3, 2);
	objects[1].newMesh();
	objects[1].addPointToMesh(4);
	objects[1].addPointToMesh(0);
	objects[1].addPointToMesh(3);
	objects[1].addPointToMesh(7);
	objects[1].addLine(4, 0);
	objects[1].addLine(0, 3);
	objects[1].addLine(3, 7);
	objects[1].addLine(7, 4);
	window.onresize=resize;
	resize();
}

function resize()
{
	screenHeight=window.innerHeight+2;
	screenWidth=window.innerWidth+2;
	canvas1.height=screenHeight-2;
	canvas1.width=screenWidth-2;
	centerX=Math.floor(screenWidth/2);
	centerY=Math.floor(screenHeight/2);
	prints();
}

function mousedown(e){
	mouseX=e.pageX;
	mouseY=e.pageY;
	mouseB=e.button;
	mouseM=0;
	return false;
}

function mouseup(e){
	if(mouseM==0){
		selectChange(objectbuffer[e.pageX+e.pageY*screenWidth]);
	}
	mouseB=null;
}

function STmousemove(e){
	if(mouseB==0&&painting==false){
		var tempX=e.pageX;
		var tempY=e.pageY;
		var tempP=new Point(tempX-mouseX, tempY-mouseY, 0);
		tempP.rotate(-cameraAx, -cameraAy, -cameraAz);
		screenTransfer(-tempP.x, -tempP.y, -tempP.z);
		mouseX=tempX;
		mouseY=tempY;
		mouseM=1;
	}
}

function screenTransfer(dx, dy, dz){
	cameraCenter.transfer(dx, dy, dz);
	camera.transfer(dx, dy, dz);
	prints();
}

function inputFile(){
	if (typeof FileReader==='undefined') {
		alert("瀏覽器不支援FileReader");
	}else{
		document.getElementById('inputfile').click();
	}
}

function read(){
	var objlen=objects.length-1;
	var currentVex, vexnum=1;
	readin=readin.split("\n");
	for(var i in readin){
		readin[i]=readin[i].split(" ");
		if(readin[i][0]=="o"||readin[i][0]=="g"){
			objects.push(new _Object(readin[i][1]));
			document.getElementById('objectSelected').options.add(new Option(readin[i][1]));
			objlen=objects.length-1;
			objects[objlen].color=new Color(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
			currentVex=vexnum;
		}else if(readin[i][0]=="v"){
			objects[objlen].addPoint(parseFloat(readin[i][1]), parseFloat(readin[i][3]), parseFloat(readin[i][2]));
			vexnum++;
		}else if(readin[i][0]=="f"){
			var rlen=readin[i].length;
			objects[objlen].newMesh();
			for(k=1;k<rlen;k++){
				readin[i][k]=readin[i][k].split("/");
				objects[objlen].addPointToMesh(readin[i][k][0]-currentVex);
			}
			for(var k=2;k<rlen;k++){
				objects[objlen].addLine(readin[i][k][0]*1-currentVex, readin[i][k-1][0]*1-currentVex);
			}
			if(rlen>3){
				objects[objlen].addLine(readin[i][1][0]*1-currentVex, readin[i][rlen-1][0]*1-currentVex);
			}
		}
	}
	var s=document.getElementById('objectSelected');
	s.options[s.length-1].selected=true;
	changeObject();
}

function inputFileB(){
	if(document.getElementById('inputfile').files.length==0)	return;
	this.file=document.getElementById('inputfile').files[0];
	this.reader=new FileReader();
	this.reader.onload=function(e){
		readin=reader.result;
		read();
	}
	this.reader.readAsText(this.file, "UTF-8");
	document.getElementById('inputForm').reset();
}

function changeObject(){
	select=document.getElementById('objectSelected').selectedIndex;
	prints();
};

function selectChange(o)
{
	var previous=select;
	if(o==undefined)
	{
		o=0;
	}
	select=o;
	if(previous!=select)
	{
		document.getElementById('objectSelected').options[o].selected=true;
		if(showPoint==true)
		{
			drawPoint(previous, false);
			drawPoint(select, false);
		}
		if(showLine==true)
		{
			drawLine(previous, false);
			drawLine(select, false);
		}
	}
}

function deleteObject(){
	if(select!="0"){
		document.getElementById('objectSelected').remove(select);
		totalLines=totalLines-objects[select].lines.length;
		totalPoints=totalPoints-objects[select].points.length;
		objects.splice(select, 1);
		changeObject();
	}
}

function changeWorldLight()
{
	canvas1.style.background="rgb("+worldColor.red+","+worldColor.green+","+worldColor.blue+")";
}

function changeDrawMethod(obj)
{
	if(ortho==false)
	{
		ortho=true;
		magni=30;
		drawMethod=orthographic;
		drawAxleMethod=orthographicAxle;
		obj.innerHTML="Persp";
		prints();
	}else{
		ortho=false;
		magni=50;
		drawMethod=perspective;
		drawAxleMethod=perspectiveAxle;
		obj.innerHTML="Ortho";
		prints();
	}
}

function menuOn(obj)
{
	if(menuState==false)
	{
		menuState=true;
		objectMenu.style.display="block";
	}else{
		menuState=false;
		objectMenu.style.display="none";
	}
}

function commanding()
{
	var x, y, z, px, py, pz;
	temp=commandLine.value;
	if(temp=="i hate fun"){
		wannaplay=no;
		response("I know you do.");
		commandLine.value="";
		return;
	}else if(temp=="lets have fun"){
		wannaplay=yes;
		response("YA!");
		commandLine.value="";
		return;
	}else if(temp=="stop"){
		stop=true;
		return;
	}else if(temp=="start"){
		stop=false;
		prints();
		return;
	}else
	temp=temp.split(" ");
	if(temp=="")
	{
		response("No command!");
	}else if(select==0){
		response("No object selected!");
	}
	else if(temp[0]=="rotate"){
		switch(temp.length){
			case 1:
				response("No argument!");
				break;
			case 2:
				x=parseFloat(temp[1]);
				if(isNaN(x)){
					response("Argument error!");
					break;
				}else{
					objects[select].rotate(x, x, x);
					prints();
					response("Done.");
					break;
				}
			case 4:
				x=parseFloat(temp[1]);
				y=parseFloat(temp[2]);
				z=parseFloat(temp[3]);
				if(isNaN(x+y+z)){
					response("Argument error!");
					break;
				}else{
					objects[select].rotate(x, y, z);
					prints();
					response("Done.");
					break;
				}
			case 7:
				px=parseFloat(temp[1]);
				py=parseFloat(temp[2]);
				pz=parseFloat(temp[3]);
				x=parseFloat(temp[4]);
				y=parseFloat(temp[5]);
				z=parseFloat(temp[6]);
				if(isNaN(px+py+pz+x+y+z))
				{
					response("Argument error");
					break;
				}else{
					objects[select].protate(px, py, pz, x, y, z);
					prints();
					response("Done.");
					break;
				}
			default:
				response("Argument error");
				break;
		}
	}else if(temp[0]=="transfer"){
		switch(temp.length){
			case 1:
				response("No argument!");
				break;
			case 2:
				x=parseFloat(temp[1]);
				if(isNaN(x)){
					response("Argument error!");
					break;
				}else{
					objects[select].transfer(x, x, x);
					prints();
					response("Done.");
					break;
				}
			case 4:
				x=parseFloat(temp[1]);
				y=parseFloat(temp[2]);
				z=parseFloat(temp[3]);
				if(isNaN(x+y+z)){
					response("Argument error!");
					break;
				}else{
					objects[select].transfer(x, y, z);
					prints();
					response("Done.");
					break;
				}
			default:
				response("Argument error");
				break;
		}
	}else if(temp[0]=="scale"){
		switch(temp.length){
			case 1:
				response("No argument!");
				break;
			case 2:
				x=parseFloat(temp[1]);
				if(isNaN(x)){
					response("Argument error!");
					break;
				}else{
					objects[select].scale(x, x, x);
					prints();
					response("Done.");
					break;
				}
			case 4:
				x=parseFloat(temp[1]);
				y=parseFloat(temp[2]);
				z=parseFloat(temp[3]);
				if(isNaN(x+y+z)){
					response("Argument error!");
					break;
				}else{
					objects[select].scale(x, y, z);
					prints();
					response("Done.");
					break;
				}
			case 7:
				px=parseFloat(temp[1]);
				py=parseFloat(temp[2]);
				pz=parseFloat(temp[3]);
				x=parseFloat(temp[4]);
				y=parseFloat(temp[5]);
				z=parseFloat(temp[6]);
				if(isNaN(px+py+pz+x+y+z))
				{
					response("Argument error");
					break;
				}else{
					objects[select].pscale(px, py, pz, x, y, z);
					prints();
					response("Done.");
					break;
				}
			default:
				response("Argument error");
				break;
		}
	}else if(temp[0]=="shear"){
		if(temp.length!=4){
			response("Argument error!");
			return;
		}
		x=parseFloat(temp[2]);
		y=parseFloat(temp[3]);
		if(isNaN(x+y)){
			response("Argument error!");
			return;
		}
		if(temp[1]=="x"){
			objects[select].shearX(x, y);
			prints();
		}else if(temp[1]=="y"){
			objects[select].shearY(x, y);
			prints();
		}else if(temp[1]=="z"){
			objects[select].shearZ(x, y);
			prints();
		}else{
			response("Argument error!");
		}
	}else if(temp[0]=="color"){
		switch(temp.length){
			case 1:
				response("No argument!");
				break;
			case 2:
				x=parseInt(temp[1]);
				if(isNaN(x)||x<0||x>255){
					response("Argument error!");
					break;
				}else{
					objects[select].color=new Color(x, x, x);
					prints();
					response("Done.");
					break;
				}
			case 4:
				x=parseInt(temp[1]);
				y=parseInt(temp[2]);
				z=parseInt(temp[3]);
				if(isNaN(x+y+z)||x<0||y<0||z<0||x>255||y>255||z>255){
					response("Argument error!");
					break;
				}else{
					objects[select].color=new Color(x, y, z);
					prints();
					response("Done.");
					break;
				}
			default:
				response("Argument error");
				break;
		}
	}else {
		response("Command error!");
	}
	return;
}

function response(res)
{
	if(responseTimer!=null)
	{
		clearTimeout(responseTimer);
	}
	responseLine.innerHTML=res;
	responseTimer=setTimeout("responseLine.innerHTML=\"\"; responseTimer=null;", 5000);
}