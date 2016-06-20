function Point(_x, _y, _z)
{
	this.position=0;
	this.x=_x;
	this.y=_y;
	this.z=_z;
	this.connect=0;
	this.vector=new Vector(0, 0, 0);
	this.color;
}

Point.prototype.transfer=function(dx, dy, dz)
{
	this.x+=dx;
	this.y+=dy;
	this.z+=dz;
};

Point.prototype.rotate=function(ax, ay, az)
{
	var tx, ty, tz;
	ax=ax*2*Math.PI/360;
	ay=ay*2*Math.PI/360;
	az=az*2*Math.PI/360;
	ty=this.y*Math.cos(ax)-this.z*Math.sin(ax);
	tz=this.y*Math.sin(ax)+this.z*Math.cos(ax);
	this.y=ty;
	this.z=tz;
	tx=this.x*Math.cos(ay)+this.z*Math.sin(ay);
	tz=this.z*Math.cos(ay)-this.x*Math.sin(ay);
	this.x=tx;
	this.z=tz;
	tx=this.x*Math.cos(az)-this.y*Math.sin(az);
	ty=this.x*Math.sin(az)+this.y*Math.cos(az);
	this.x=tx;
	this.y=ty;
};

Point.prototype.Protate=function(px, py, pz, ax, ay, az)
{
	this.transfer(-px, -py, -pz);
	this.rotate(ax, ay, az);
	this.transfer(px, py, pz);
};

Point.prototype.scale=function(rx, ry, rz)
{
	this.x*=rx;
	this.y*=ry;
	this.z*=rz;
};

Point.prototype.Pscale=function(px, py, pz, rx, ry, rz)
{
	this.transfer(-px, -py, -pz);
	this.scale(rx, ry, rz);
	this.transfer(px, py, pz);
};

Point.prototype.testPosition=function()
{
	this.position=0;
	if(this.x<0)
	{
		this.position+=1;
	}else if(this.x>=screenWidth-2)
	{
		this.position+=2;
	}
	if(this.y<0)
	{
		this.position+=4;
	}else if(this.y>=screenHeight-2)
	{
		this.position+=8;
	}
}

Point.prototype.addVector=function(vec)
{
	this.vector.x*=this.connect;
	this.vector.y*=this.connect;
	this.vector.z*=this.connect;
	this.connect++;
	this.vector.x+=vec.x;
	this.vector.y+=vec.y;
	this.vector.z+=vec.z;
	this.vector.x/=this.connect;
	this.vector.y/=this.connect;
	this.vector.z/=this.connect;
}