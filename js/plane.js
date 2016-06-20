function Line(a, b){
	this.pointA=a;
	this.pointB=b;
};

function Triangle(a, b, c)
{
	this.pointA=a;
	this.pointB=b;
	this.pointC=c;
}

function Plane()
{
	this.triangle=Array(0);
	this.points=Array(0);
}

Plane.prototype.addPoint=function(a)
{
	this.points.push(a);
}

function Vector(_x, _y, _z)
{
	this.x=_x;
	this.y=_y;
	this.z=_z;
}

Vector.prototype.cross=function(vec)
{
	return new Vector(this.y*vec.z-this.z*vec.y, this.z*vec.x-this.x*vec.z, this.x*vec.y-this.y*vec.x);
}

Vector.prototype.dot=function(vec)
{
	return (this.x*vec.x+this.y*vec.y+this.z*vec.z);
}

Vector.prototype.vnormal=function()
{
	temp=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	this.x/=temp;
	this.y/=temp;
	this.z/=temp;
}