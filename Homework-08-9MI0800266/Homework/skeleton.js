// става и кост - конструктор
// добавих офсет за геометрията, който да не зависи от размера на елемента
// както и цвят за удобство
Bone = function(length,body,geoffset = [0,0,0.5], color = [1, 1, 0])
{
	if (typeof body==='undefined')
	{
		this.length = length[2];
		this.body = [custom(new Cuboid([0,0,0],length),{offset:geoffset, color: color})];
	}
	else
	{
		this.length = length[2];
		this.body = body;
	}
	this.rot = [0,0,0,0];
}

// става и кост - метод за рисуване
Bone.prototype.draw = function()
{	
	if (this.rot)
	{
		if (this.rot[0]) zRotate(this.rot[0]);	// хоризонтален ъгъл
		if (this.rot[1]) yRotate(this.rot[1]);	// вертикален ъгъл
		if (this.rot[2]) xRotate(this.rot[2]);	// вертикален ъгъл
		if (this.rot[3]) zRotate(this.rot[3]);	// осев ъгъл
	}
	if (this.offset) translate(this.offset);
	for (var i=0; i<this.body.length; i++)
		this.body[i].draw();
	translate([0,0,this.length]); // преместване в края на костта
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}

// скелет - конструктор
Bird = function()
{
	this.position = [0,0,0];	
	this.body = new Bone([1,2,1]);

	this.body.body[0].color = [0.7,0.7,0.7];

	this.LWing = [];
	this.RWing = [];
	this.WING_SEGMENTS = 10;
	for(let i = 0; i < this.WING_SEGMENTS; ++ i) {
		let a = 1 - (i / this.WING_SEGMENTS) + 0.1;
		this.LWing.push(new Bone([0.05, 1.7 * a, 0.2], undefined, [0, 0.3, 0.5], HSVtoRGB(a / 2, 1.,1.)));
		this.RWing.push(new Bone([0.05, 1.7 * a, 0.2], undefined, [0, 0.3, 0.5], HSVtoRGB(a / 2, 1.,1.)));
	}

	this.head = new Bone([0., 0., 0.7], [
		custom(new Cuboid([    0,-0.2, 0.0], [0.5, 1.0, 0.9]), {color: [0.7,0.7,0.7]}),
		custom(new Cuboid([ 0.25,-0.3, 0.2], [0.1, 0.2, 0.2]), {color: [1,1,1]}),
		custom(new Cuboid([-0.25,-0.3, 0.2], [0.1, 0.2, 0.2]), {color: [1,1,1]}),
		custom(new Cuboid([ 0.30,-0.3, 0.2], [0.1, 0.1, 0.1]), {color: [0,0,1]}),
		custom(new Cuboid([-0.30,-0.3, 0.2], [0.1, 0.1, 0.1]), {color: [0,0,1]})
	]);

	this.beak = new Bone([0,0,0], [custom(new Cuboid([ 0, 0, 0], [0.1, 0.6, 0.6]), {color: [1,0,0]})]);
}

// скелето - метод за анимиране
Bird.prototype.animate = function(time) {
	var t = time * 4;
	var q = time * 4 + PI;

	this.position = [-cos(time / 2), 0, 0.5 + cos(t) * 0.4];
	
	this.body.rot = [-sin(time / 2) * 30,sin(time / 2) * 30,0,0];
	this.head.rot = [0,sin(time / 2 + 1) * 30,0,0];

	this.LWing[0].rot = [sin(t) * 30, cos(t) * 30,0, 0];
	this.RWing[0].rot = [sin(q) * 30, cos(q) * 30,0, 0];

	for(let i = 1; i < 8; ++ i) {
		this.LWing[i].rot = [sin(t) * 10, cos(t) * 10,0, 0];
		this.RWing[i].rot = [sin(q) * 10, cos(q) * 10,0, 0];
	}
}

// скелето - метод за рисуване
Bird.prototype.draw = function()
{
	pushMatrix();
	translate(this.position);
	scale([0.8, 0.8, 0.8]);
	this.body.draw();
	
	var bodyMat = cloneMatrix(glmat);
	translate([0.5, -0.6, -0.5]);
	yRotate(90);
	for(var wing of this.LWing) wing.draw();

	glmat = cloneMatrix(bodyMat);
	translate([-0.5, -0.6, -0.5]);
	yRotate(-90);
	for(var wing of this.RWing) wing.draw();

	glmat = cloneMatrix(bodyMat);
	translate([0, -1.3, -0.5]);
	this.head.draw();

	translate([0, -0.5, -0.7]);
	xRotate(45);
	this.beak.draw();

	popMatrix();
}
