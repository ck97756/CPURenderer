var draw;
var centerX, centerY;
var zbuffer, objectbuffer, output;
var cameraCenter, camera, cameraAx=0, cameraAy=0, cameraAz=0, cameraFocus=1000;
var dotDistance=0.02, dotStart=10, dotRadius=0;
var showPoint=true, showLine=true, showAxle=true, showPlane=true;
var drawPlaneBreak=false, drawingPlane=false;
var magni=50;
var worldColor, worldLight, cameraLight, vecCameraLight;
var tempObjects;
var drawMethod=perspective, drawAxleMethod=perspectiveAxle;
var painting=false;
var wannaplay=yes;

function drawPlane(a, b, conti)
{
	if(stop){
		return;
	}
	drawingPlane=true;
	if(a>=objects.length)
	{
		draw.putImageData(output, -1, -1);
		drawingPlane=false;
		return;
	}
	if(b>=objects[a].meshes.length)
	{
		if(conti==true)
		{
			setTimeout("drawPlane("+(a+1)+",0,true)", 0);
		}else{
			draw.putImageData(output, -1, -1);
			drawingPlane=false;
		}
		return;
	}
	for(c in tempObjects[a].meshes[b].triangle)
	{
		tempT=tempObjects[a].meshes[b].triangle[c];
		pointA=tempT.pointA;
		pointB=tempT.pointB;
		pointC=tempT.pointC;
		if(pointC.x>pointB.x)
		{
			pointT=pointC;
			pointC=pointB;
			pointB=pointT;
		}
		if(pointB.x>pointA.x)
		{
			pointT=pointA;
			pointA=pointB;
			pointB=pointT;
		}
		if(pointC.x>pointB.x)
		{
			pointT=pointC;
			pointC=pointB;
			pointB=pointT;
		}
		if(pointA.x==pointC.x)
		{
			continue;
		}
		if(objects[a].shading==0)
		{
			color=objects[a].color;
		}else if(objects[a].shading==1)
		{
			color=flatShader(tempObjects[a].meshes[b].triangle[c], objects[a].color);
		}
		Xab=pointA.x-pointB.x;
		tempX=(Xab*pointC.y+(pointB.x-pointC.x)*pointA.y)/(pointA.x-pointC.x);
		dir=pointB.y-tempX;
		dir=dir/Math.abs(dir);
		for(startA=0;startA<=pointA.x-pointB.x;startA++)
		{
			tempAZ=pointA.z-(pointC.z-pointA.z)/(pointC.x-pointA.x)*startA;
			tempBZ=pointA.z-(pointB.z-pointA.z)/(pointB.x-pointA.x)*startA;
			if(objects[a].shading==2)
			{
				tempACR=pointA.color.red-(pointC.color.red-pointA.color.red)/(pointC.x-pointA.x)*startA;
				tempACG=pointA.color.green-(pointC.color.green-pointA.color.green)/(pointC.x-pointA.x)*startA;
				tempACB=pointA.color.blue-(pointC.color.blue-pointA.color.blue)/(pointC.x-pointA.x)*startA;
				tempBCR=pointA.color.red-(pointB.color.red-pointA.color.red)/(pointB.x-pointA.x)*startA;
				tempBCG=pointA.color.green-(pointB.color.green-pointA.color.green)/(pointB.x-pointA.x)*startA;
				tempBCB=pointA.color.blue-(pointB.color.blue-pointA.color.blue)/(pointB.x-pointA.x)*startA;
			}else if(objects[a].shading==3)
			{
				tempAVX=pointA.vector.x-(pointC.vector.x-pointA.vector.x)/(pointC.x-pointA.x)*startA;
				tempAVY=pointA.vector.y-(pointC.vector.y-pointA.vector.y)/(pointC.x-pointA.x)*startA;
				tempAVZ=pointA.vector.z-(pointC.vector.z-pointA.vector.z)/(pointC.x-pointA.x)*startA;
				tempBVX=pointA.vector.x-(pointB.vector.x-pointA.vector.x)/(pointB.x-pointA.x)*startA;
				tempBVY=pointA.vector.y-(pointB.vector.y-pointA.vector.y)/(pointB.x-pointA.x)*startA;
				tempBVZ=pointA.vector.z-(pointB.vector.z-pointA.vector.z)/(pointB.x-pointA.x)*startA;
			}
			len=Math.abs((pointB.y-pointA.y)/(pointB.x-pointA.x)-(pointC.y-pointA.y)/(pointC.x-pointA.x))*startA;
			for(startB=0;startB<=len;startB++)
			{
				tempX=pointA.x-startA;
				tempY=Math.floor(pointA.y-(pointA.y-pointC.y)/(pointA.x-pointC.x)*startA+dir*startB);
				tempP=new Point(tempX, tempY, 0);
				tempP.testPosition();
				if(tempP.position==0&&testZbuffer(tempX, tempY, (tempAZ*(len-startB)+tempBZ*startB)/len))
				{
					if(objects[a].shading==2)
					{
						color=new Color(Math.floor((tempACR*(len-startB)+tempBCR*startB)/len), Math.floor((tempACG*(len-startB)+tempBCG*startB)/len), Math.floor((tempACB*(len-startB)+tempBCB*startB)/len));
					}else if(objects[a].shading==3)
					{
						tempV=new Vector((tempAVX*(len-startB)+tempBVX*startB)/len, (tempAVY*(len-startB)+tempBVY*startB)/len, (tempAVZ*(len-startB)+tempBVZ*startB)/len);
						tempV.vnormal();
						color=shader(tempV, objects[a].color);
					}
					drawObjectbuffer(tempX, tempY, a);
					drawPix(tempX, tempY, color.red, color.green, color.blue, 255);
					//drawPix(tempX, tempY, color.red, color.green, color.blue, 255);
				}
			}
		}
		for(startA=0;startA<=pointB.x-pointC.x;startA++)
		{
			tempAZ=pointC.z+(pointC.z-pointA.z)/(pointC.x-pointA.x)*startA;
			tempCZ=pointC.z+(pointB.z-pointC.z)/(pointB.x-pointC.x)*startA;
			if(objects[a].shading==2)
			{
				tempACR=pointC.color.red+(pointC.color.red-pointA.color.red)/(pointC.x-pointA.x)*startA;
				tempACG=pointC.color.green+(pointC.color.green-pointA.color.green)/(pointC.x-pointA.x)*startA;
				tempACB=pointC.color.blue+(pointC.color.blue-pointA.color.blue)/(pointC.x-pointA.x)*startA;
				tempCCR=pointC.color.red+(pointB.color.red-pointC.color.red)/(pointB.x-pointC.x)*startA;
				tempCCG=pointC.color.green+(pointB.color.green-pointC.color.green)/(pointB.x-pointC.x)*startA;
				tempCCB=pointC.color.blue+(pointB.color.blue-pointC.color.blue)/(pointB.x-pointC.x)*startA;
			}else if(objects[a].shading==3)
			{
				tempAVX=pointC.vector.x+(pointC.vector.x-pointA.vector.x)/(pointC.x-pointA.x)*startA;
				tempAVY=pointC.vector.y+(pointC.vector.y-pointA.vector.y)/(pointC.x-pointA.x)*startA;
				tempAVZ=pointC.vector.z+(pointC.vector.z-pointA.vector.z)/(pointC.x-pointA.x)*startA;
				tempCVX=pointC.vector.x+(pointB.vector.x-pointC.vector.x)/(pointB.x-pointC.x)*startA;
				tempCVY=pointC.vector.y+(pointB.vector.y-pointC.vector.y)/(pointB.x-pointC.x)*startA;
				tempCVZ=pointC.vector.z+(pointB.vector.z-pointC.vector.z)/(pointB.x-pointC.x)*startA;
			}
			len=Math.abs((pointB.y-pointC.y)/(pointB.x-pointC.x)-(pointC.y-pointA.y)/(pointC.x-pointA.x))*startA;
			for(startB=0;startB<=len;startB++)
			{
				tempX=pointC.x+startA;
				tempY=Math.floor(pointC.y+(pointA.y-pointC.y)/(pointA.x-pointC.x)*startA+dir*startB);
				tempP=new Point(tempX, tempY, 0);
				tempP.testPosition();
				if(tempP.position==0&&testZbuffer(tempX, tempY, (tempAZ*(len-startB)+tempCZ*startB)/len))
				{
					if(objects[a].shading==2)
					{
						color=new Color(Math.floor((tempACR*(len-startB)+tempCCR*startB)/len), Math.floor((tempACG*(len-startB)+tempCCG*startB)/len), Math.floor((tempACB*(len-startB)+tempCCB*startB)/len));
					}else if(objects[a].shading==3)
					{
						tempV=new Vector((tempAVX*(len-startB)+tempCVX*startB)/len, (tempAVY*(len-startB)+tempCVY*startB)/len, (tempAVZ*(len-startB)+tempCVZ*startB)/len);
						tempV.vnormal();
						color=shader(tempV, objects[a].color);
					}
					drawObjectbuffer(tempX, tempY, a);
					drawPix(tempX, tempY, color.red, color.green, color.blue, 255);
					//drawPix(tempX, tempY, 155, 51, 176, 255);
				}
			}
		}
	}
	wannaplay();
	if(drawPlaneBreak==true)
	{
		drawPlaneBreak=false;
		drawingPlane=false;
		return;
	}
	setTimeout("drawPlane("+a+","+(b+1)+","+conti+")", 0);
}

function yes(){
	draw.putImageData(output, -1, -1);
}

function no(){};

function drawLine(a, conti)
{
	if(a>=objects.length)
	{
		draw.putImageData(output, -1, -1);
		return;
	}
	
	if(a==select)
	{
		red=237;
		green=167;
		blue=39;
	}else{
		red=255;
		green=255;
		blue=255;
	}
	for(b in tempObjects[a].lines)
	{
		tempA=tempObjects[a].lines[b].pointA;
		tempB=tempObjects[a].lines[b].pointB;
		tempX=tempA.x-tempB.x;
		tempY=tempA.y-tempB.y;
		tempZ=tempA.z-tempB.z;
		//tempX/=Math.abs(tempY);
		//tempZ/=tempY;
		tempP=new Point(tempA.x, tempA.y, tempA.z);
		//dir=tempY/Math.abs(tempY);
		if(Math.abs(tempX)>Math.abs(tempY))
		{
			dir=-tempX/Math.abs(tempX);
			for(start=0;start<Math.abs(tempX);start++)
			{
				tempP.transfer(dir, -tempY/Math.abs(tempX), tempZ/tempX*dir);
				tempP.testPosition();
				if(tempP.position==0)
				{
					if(testZbuffer(tempP.x, Math.floor(tempP.y), tempP.z))
					{
						drawObjectbuffer(tempP.x, Math.floor(tempP.y), a);
						drawPix(tempP.x, Math.floor(tempP.y), red, green, blue, 255);
					}
				}
			}
		}else
		{
			dir=-tempY/Math.abs(tempY);
			for(start=0;start<Math.abs(tempY);start++)
			{
				tempP.transfer(-tempX/Math.abs(tempY), dir, tempZ/tempY*dir);
				tempP.testPosition();
				if(tempP.position==0)
				{
					if(testZbuffer(Math.floor(tempP.x), tempP.y, tempP.z))
					{
						drawObjectbuffer(Math.floor(tempP.x), tempP.y, a);
						drawPix(Math.floor(tempP.x), tempP.y, red, green, blue, 255);
					}
				}
			}
		}
	}
	wannaplay();
	if(conti==true)
	{
		setTimeout("drawLine("+(a+1)+", true)", 0);
	}else{
		draw.putImageData(output, -1, -1);
	}
}

function drawPoint(a, conti)
{
	if(a>=objects.length)
	{
		draw.putImageData(output, -1, -1);
		return;
	}
	
	if(a==select)
	{
		red=237;
		green=167;
		blue=39;
	}else{
		red=255;
		green=255;
		blue=255;
	}
	for(b in tempObjects[a].points)
	{
		tempP=tempObjects[a].points[b];
		tempX=tempP.x;
		tempY=tempP.y;
		if(tempP.position==0)
		{
			for(c=-1;c<2;c++)
			{
				for(d=-1;d<2;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempP.z)==true)
					{
						drawObjectbuffer(tempX+c, tempY+d, a);
						drawPix(tempX+c, tempY+d, red, green, blue, 255);
					}
				}
			}
		}
	}
	wannaplay();
	if(conti==true)
	{
		setTimeout("drawPoint("+(a+1)+", true)", 0);
	}else{
		draw.putImageData(output, -1, -1);
	}
}


function prints()
{
	painting=true;
	output=draw.createImageData(screenWidth, screenHeight);
	zbuffer=Array(screenWidth*screenHeight);
	objectbuffer=Array(screenWidth*screenHeight);
	drawMethod();
	if(showPlane)
	{
		if(drawingPlane==true)
		{
			drawPlaneBreak=true;
		}
		drawPlane(0, 0, true);
	}
	if(showLine)
	{
		drawLine(0, true);
	}
	if(showPoint)
	{
		drawPoint(0, true);
	}
	if(showAxle)
	{
		drawAxleMethod();
	}
	draw.putImageData(output, -1, -1);
	painting=false;
}

function render()
{
	var previousMagni=magni;
	var tempSW=screenWidth, tempSH=screenHeight;
	var tempIndex, index;
	var tempOutput;
	screenWidth=screenWidth*3-4;
	screenHeight=screenHeight*3-4;
	centerX=Math.floor(screenWidth/2);
	centerY=Math.floor(screenHeight/2);
	output=draw.createImageData(screenWidth, screenHeight);
	zbuffer=Array(screenWidth*screenHeight);
	objectbuffer=Array(screenWidth*screenHeight);
	magni=magni*3;
	perspective();
	if(showPlane)
	{
		drawPlane(0, 0, true);
	}
	if(showLine)
	{
		drawLine(0, true);
	}
	if(showPoint)
	{
		drawPoint(0, true);
	}
	if(showAxle)
	{
		perspectiveAxle();
	}	
	tempOutput=output;
	output=draw.createImageData(tempSW, tempSH);
	magni=previousMagni;
	screenWidth=tempSW;
	screenHeight=tempSH;
	centerX=Math.floor(screenWidth/2);
	centerY=Math.floor(screenHeight/2);
}

function perspective()
{
	tempObjects=Array(0);
	for(a in objects)										//objects calculate
	{
		tempObjects.push(new _Object(""));
		for(b in objects[a].points)
		{
			tempP=objects[a].points[b];
			tempObjects[a].points.push(new Point(objects[a].points[b].x, objects[a].points[b].y, objects[a].points[b].z));
			tempP=tempObjects[a].points[b];
			tempP.scale(magni, magni, magni);
			tempP.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
			tempP.transfer(-camera.x, -camera.y, -camera.z);
			tempObjects[a].points[b]=new Point(Math.floor(tempP.x*cameraFocus/(tempP.z+cameraFocus))+centerX, Math.floor(tempP.y*cameraFocus/(tempP.z+cameraFocus))+centerY, tempP.z);
			tempP=tempObjects[a].points[b];
			tempP.testPosition();
		}
		for(b in objects[a].lines)
		{
			tempObjects[a].addRLine(objects[a].lines[b].pointA, objects[a].lines[b].pointB);
		}
		for(b in objects[a].meshes)
		{
			tempObjects[a].newMesh();
			tempP=objects[a].meshes[b].points;
			meshlen=tempP.length;
			for(c=2;c<meshlen;c++)
			{
				tempObjects[a].meshes[b].triangle.push(new Triangle(tempObjects[a].points[tempP[0]], tempObjects[a].points[tempP[c-1]], tempObjects[a].points[tempP[c]]));
			}
		}
		if(objects[a].shading==2||objects[a].shading==3)
		{
			for(b in tempObjects[a].meshes)
			{
				for(c in tempObjects[a].meshes[b].triangle)
				{
					tri=tempObjects[a].meshes[b].triangle[c];
					vectorA=new Vector(tri.pointA.x-tri.pointB.x,tri.pointA.y-tri.pointB.y, tri.pointA.z-tri.pointB.z);
					vectorB=new Vector(tri.pointC.x-tri.pointB.x,tri.pointC.y-tri.pointB.y, tri.pointC.z-tri.pointB.z);
					tempV=vectorA.cross(vectorB);
					tempV.vnormal();
					tri.pointA.addVector(tempV);
					tri.pointB.addVector(tempV);
					tri.pointC.addVector(tempV);
				}
			}
			for(b in tempObjects[a].points)
			{
				tempObjects[a].points[b].color=shader(tempObjects[a].points[b].vector, objects[a].color);
			}
		}
	}
}

function perspectiveAxle()
{
	var tempX, tempY, tempA;
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(a, 0, 0);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x*cameraFocus/(tempA.z+cameraFocus))+centerX, Math.floor(tempA.y*cameraFocus/(tempA.z+cameraFocus))+centerY, tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 255, 0, 0, 255);
					}
				}
			}
		}
	}
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(0, a, 0);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x*cameraFocus/(tempA.z+cameraFocus))+centerX, Math.floor(tempA.y*cameraFocus/(tempA.z+cameraFocus))+centerY, tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 0, 255, 0, 255);
					}
				}
			}
		}
	}
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(0, 0, a);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x*cameraFocus/(tempA.z+cameraFocus))+centerX, Math.floor(tempA.y*cameraFocus/(tempA.z+cameraFocus))+centerY, tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 0, 0, 255, 255);
					}
				}
			}
		}
	}
}

function orthographic()
{
	tempObjects=Array(0);
	for(a in objects)										//objects calculate
	{
		tempObjects.push(new _Object(""));
		for(b in objects[a].points)
		{
			tempP=objects[a].points[b];
			tempObjects[a].points.push(new Point(objects[a].points[b].x, objects[a].points[b].y, objects[a].points[b].z));
			tempP=tempObjects[a].points[b];
			tempP.scale(magni, magni, magni);
			tempP.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
			tempP.transfer(-camera.x, -camera.y, -camera.z);
			tempObjects[a].points[b]=new Point(Math.floor(tempP.x+centerX), Math.floor(tempP.y+centerY), tempP.z);
			tempP=tempObjects[a].points[b];
			tempP.testPosition();
		}
		for(b in objects[a].lines)
		{
			tempObjects[a].addRLine(objects[a].lines[b].pointA, objects[a].lines[b].pointB);
		}
		for(b in objects[a].meshes)
		{
			tempObjects[a].newMesh();
			tempP=objects[a].meshes[b].points;
			meshlen=tempP.length;
			for(c=2;c<meshlen;c++)
			{
				tempObjects[a].meshes[b].triangle.push(new Triangle(tempObjects[a].points[tempP[0]], tempObjects[a].points[tempP[c-1]], tempObjects[a].points[tempP[c]]));
			}
		}
		if(objects[a].shading==2||objects[a].shading==3)
		{
			for(b in tempObjects[a].meshes)
			{
				for(c in tempObjects[a].meshes[b].triangle)
				{
					tri=tempObjects[a].meshes[b].triangle[c];
					vectorA=new Vector(tri.pointA.x-tri.pointB.x,tri.pointA.y-tri.pointB.y, tri.pointA.z-tri.pointB.z);
					vectorB=new Vector(tri.pointC.x-tri.pointB.x,tri.pointC.y-tri.pointB.y, tri.pointC.z-tri.pointB.z);
					tempV=vectorA.cross(vectorB);
					tempV.vnormal();
					tri.pointA.addVector(tempV);
					tri.pointB.addVector(tempV);
					tri.pointC.addVector(tempV);
				}
			}
			for(b in tempObjects[a].points)
			{
				tempObjects[a].points[b].color=shader(tempObjects[a].points[b].vector, objects[a].color);
			}
		}
	}
}

function orthographicAxle()
{
	var tempX, tempY, tempA;
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(a, 0, 0);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x+centerX), Math.floor(tempA.y+centerY), tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 255, 0, 0, 255);
					}
				}
			}
		}
	}
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(0, a, 0);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x+centerX), Math.floor(tempA.y+centerY), tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 0, 255, 0, 255);
					}
				}
			}
		}
	}
	for(a=-dotStart;a<=dotStart;a+=dotDistance)
	{
		tempA=new Point(0, 0, a);
		tempA.scale(magni, magni, magni);
		tempA.Protate(cameraCenter.x, cameraCenter.y, cameraCenter.z, cameraAx, cameraAy, cameraAz);
		tempA.transfer(-camera.x, -camera.y, -camera.z);
		tempA=new Point(Math.floor(tempA.x+centerX), Math.floor(tempA.y+centerY), tempA.z);
		tempA.testPosition();
		if(tempA.position==0)
		{
			tempX=tempA.x;
			tempY=tempA.y;
			for(c=-dotRadius;c<=dotRadius;c++)
			{
				for(d=-dotRadius;d<=dotRadius;d++)
				{
					if(testZbuffer(tempX+c, tempY+d, tempA.z)==true)
					{
						drawPix(tempX+c, tempY+d, 0, 0, 255, 255);
					}
				}
			}
		}
	}
}

function testZbuffer(x, y, z)
{
	x++;
	y++;
	temp=zbuffer[x+y*screenWidth];
	if(temp==undefined||temp>=z&&z>=0)
	{
		zbuffer[x+y*screenWidth]=z;
		return true;
	}else
	{
		return false;
	}
}

function drawObjectbuffer(x, y, o)
{
	x++;
	y++;
	objectbuffer[x+y*screenWidth]=o;
}

function drawPix(x, y, red, green, blue, alpha)
{
	x++;
	y++;
	index=(x+y*screenWidth)*4;
	output.data[index++]=red;
	output.data[index++]=green;
	output.data[index++]=blue;
	output.data[index++]=alpha;
}

function Color(r, g, b)
{
	this.red=r;
	this.green=g;
	this.blue=b;
}

function flatShader(tri, OColor)
{
	vectorA=new Vector(tri.pointA.x-tri.pointB.x,tri.pointA.y-tri.pointB.y, tri.pointA.z-tri.pointB.z);
	vectorB=new Vector(tri.pointC.x-tri.pointB.x,tri.pointC.y-tri.pointB.y, tri.pointC.z-tri.pointB.z);
	tempV=vectorA.cross(vectorB);
	tempV.vnormal();
	lum=tempV.dot(vecCameraLight);
	lum=lum<0?lum:0;
	lum=Math.abs(lum);
	red=(OColor.red*cameraLight.red/255*lum+OColor.red*worldLight.red/255);
	green=(OColor.green*cameraLight.green/255*lum+OColor.green*worldLight.green/255);
	blue=(OColor.blue*cameraLight.blue/255*lum+OColor.blue*worldLight.blue/255);
	red=red>255?255:red;
	green=green>255?255:green;
	blue=blue>255?255:blue;
	return new Color(Math.floor(red), Math.floor(green), Math.floor(blue));
}

function shader(vec, OColor)
{
	lum=vec.dot(vecCameraLight);
	lum=lum<0?lum:0;
	lum=Math.abs(lum);
	red=(OColor.red*cameraLight.red/255*lum+OColor.red*worldLight.red/255);
	green=(OColor.green*cameraLight.green/255*lum+OColor.green*worldLight.green/255);
	blue=(OColor.blue*cameraLight.blue/255*lum+OColor.blue*worldLight.blue/255);
	red=red>255?255:red;
	green=green>255?255:green;
	blue=blue>255?255:blue;
	return new Color(Math.floor(red), Math.floor(green), Math.floor(blue));
}