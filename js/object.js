//texture is depended on object
var objects=Array(0);

function _Object(name)
{
	this.lines=Array(0);
	this.points=Array(0);
	this.meshes=Array(0);
	this.center=new Point(0, 0, 0);
	this.shading=0;
	this.color=new Color(200, 200, 200);
}

_Object.prototype.addPoint=function(_x, _y, _z)
{
	this.center.x*=this.points.length;
	this.center.y*=this.points.length;
	this.center.z*=this.points.length;
	this.points.push(new Point(_x, _y, _z));
	this.center.x+=_x;
	this.center.y+=_y;
	this.center.z+=_z;
	totalPoints+=1*1;
	this.center.x/=this.points.length;
	this.center.y/=this.points.length;
	this.center.z/=this.points.length;
};

_Object.prototype.addRPoint=function(_x, _y, _z)
{
	this.center.x*=this.points.length;
	this.center.y*=this.points.length;
	this.center.z*=this.points.length;
	this.points.push(new Point(_x, _y, _z));
	this.center.x+=_x;
	this.center.y+=_y;
	this.center.z+=_z;
	this.center.x/=this.points.length;
	this.center.y/=this.points.length;
	this.center.z/=this.points.length;
};

_Object.prototype.addLine=function(a, b){
	this.lines.push(new Line(a, b));
	totalLines+=1*1;
};

_Object.prototype.addRLine=function(a, b){
	this.lines.push(new Line(this.points[a], this.points[b]));
};

_Object.prototype.newMesh=function()
{
	this.meshes.push(new Plane());
}

_Object.prototype.addPointToMesh=function(a)
{
	this.meshes[this.meshes.length-1].addPoint(a);
}

_Object.prototype.scale=function(ax, ay, az)
{
	for(a in this.points)
	{
		this.points[a].Pscale(this.center.x, this.center.y ,this.center.z, ax, ay, az);
	}
}

_Object.prototype.pscale=function(px, py, pz, ax, ay, az)
{
	for(a in this.points)
	{
		this.points[a].Pscale(px, py, pz, ax, ay, az);
	}
	this.center.Pscale(px, py, pz, ax, ay, az);
}

_Object.prototype.transfer=function(dx, dy, dz)
{
	for(a in this.points)
	{
		this.points[a].transfer(dx, dy, dz);
	}
	this.center.transfer(dx, dy, dz);
}

_Object.prototype.rotate=function(ax, ay, az)
{
	for(a in this.points)
	{
		this.points[a].Protate(this.center.x, this.center.y ,this.center.z, ax, ay, az);
	}
}

_Object.prototype.protate=function(px, py, pz, ax, ay, az)
{
	for(a in this.points)
	{
		this.points[a].Protate(px, py, pz, ax, ay, az);
	}
	this.center.Protate(px, py, pz, ax, ay, az);
}

_Object.prototype.randomColor=function()
{
	this.color=new Color(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
}

_Object.prototype.pshearX=function(px, py, pz, _y, _z)
{
	for(a in this.points)
	{
		this.points[a].transfer(-px, -py, -pz);
		this.points[a].x+=this.points[a].y*_y+this.points[a].z*_z;
		this.points[a].transfer(px, py, pz);
	}
	this.center.transfer(-px, -py, -pz);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.center.transfer(px, py, pz);
}

_Object.prototype.pshearY=function(px, py, pz, _x, _z)
{
	for(a in this.points)
	{
		this.points[a].transfer(-px, -py, -pz);
		this.points[a].y+=this.points[a].x*_x+this.points[a].z*_z;
		this.points[a].transfer(px, py, pz);
	}
	this.center.transfer(-px, -py, -pz);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.center.transfer(px, py, pz);
}

_Object.prototype.pshearZ=function(px, py, pz, _x, _y)
{
	for(a in this.points)
	{
		this.points[a].transfer(-px, -py, -pz);
		this.points[a].z+=this.points[a].x*_x+this.points[a].y*_y;
		this.points[a].transfer(px, py, pz);
	}
	this.center.transfer(-px, -py, -pz);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.center.transfer(px, py, pz);
}

_Object.prototype.shearX=function(_y, _z)
{
	for(a in this.points)
	{
		this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
		this.points[a].x+=this.points[a].y*_y+this.points[a].z*_z;
		this.points[a].transfer(this.center.x, this.center.y, this.center.z);
	}
	this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.points[a].transfer(this.center.x, this.center.y, this.center.z);
}

_Object.prototype.shearY=function(_x, _z)
{
	for(a in this.points)
	{
		this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
		this.points[a].y+=this.points[a].x*_x+this.points[a].z*_z;
		this.points[a].transfer(px, py, pz);
	}
	this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.points[a].transfer(this.center.x, this.center.y, this.center.z);
}

_Object.prototype.shearZ=function(_x, _y)
{
	for(a in this.points)
	{
		this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
		this.points[a].z+=this.points[a].x*_x+this.points[a].y*_y;
		this.points[a].transfer(px, py, pz);
	}
	this.points[a].transfer(-this.center.x, -this.center.y, -this.center.z);
	this.center.x+=this.points[a].y*_y+this.points[a].z*_z;
	this.points[a].transfer(this.center.x, this.center.y, this.center.z);
}