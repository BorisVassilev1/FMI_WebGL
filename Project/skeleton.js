// става и кост - конструктор
// добавих офсет за геометрията, който да не зависи от размера на елемента
// както и цвят за удобство
Bone = function(length,body, geoffset, color = [1, 1, 0])
{
	if(typeof geoffset == 'undefined') {
		geoffset = [0, 0, 0.5];
	}
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

IKLeg = function(base, target, l1, l2, parentBody) {
	this.l1 = l1;
	this.l2 = l2;

	this.target = [
		target[0],
		target[1],
		target[2],
	];
	this.base = base;
	
	this.bone1 = new Bone([0.5,0.5,this.l1], undefined, undefined, [1.0, 1.0, 1.0]);
	this.bone2 = new Bone([0.5,0.5,this.l2], undefined, undefined, [1.0, 1.0, 1.0]);
	
	this.parent = parentBody;
	this.moveTimer = -1;
	this.moveInterval = 6;
	this.newTarget = [0,0,0];
	this.oldTarget = [0,0,0];
}

IKLeg.prototype.startMove = function(newTarget) {
	this.moveTimer = this.moveInterval;
	this.parent.isMovingLeg = true;
	this.oldTarget = this.target;
	this.newTarget = newTarget;
}

IKLeg.prototype.draw = function() {
	
	if(this.moveTimer >= 0) {
		// if(this.moveTimer > 0) {
			let t = this.moveTimer / this.moveInterval;
			this.target = [
				this.oldTarget[0] * (t) + this.newTarget[0] * (1. - t),
				this.oldTarget[1] * (t) + this.newTarget[1] * (1. - t),
				this.oldTarget[2] * (t) + this.newTarget[2] * (1. - t),
			]

			this.target[2] += t;
		// }
		-- this.moveTimer;
	}
	if(this.moveTimer == 0) {
		this.parent.isMovingLeg = false;
	}

	let t = [
		this.target[0] - this.base[0], 
		this.target[1] - this.base[1],
		this.target[2] - this.base[2]
	];

	let l1 = this.l1;
	let l2 = this.l2;
	let r1 = Math.atan2(-t[1] , t[0]);
	let tx = t[2];
	let ty = t[0] / cos(r1);
	let q2 = Math.PI - Math.acos((l1*l1 + l2*l2 - tx*tx - ty*ty) / (2 * l1 * l2));
	let q1 = Math.atan2(ty , tx) - Math.atan(l2 * sin(q2) / (l1 + l2 * cos(q2)));
	
	pushMatrix();

	translate(this.base);
	this.bone1.rot = [r1 * 180 / Math.PI, q1 * 180 / Math.PI, 0, 0];
	this.bone1.draw();

	this.bone2.rot = [0, q2 * 180 / Math.PI, 0, 0];
	this.bone2.draw();
	
	popMatrix();
}

Robot = function() {

	this.pos = [0,0,0];
	this.prevPos = [0,0,0];
	this.yaw = 0;
	this.prevYaw = 0;
	this.pitch = Math.PI / 4;
	this.base = new Bone([2.5, 2.5, 0.5]);

	this.neck = new Bone([1, 1, 1]);
	this.head = new Bone([3, 2, 1]);
	
	this.targets = [];
	this.targets[0] = [ 3, 3, -2];
	this.targets[1] = [ 3,-3, -2];
	this.targets[2] = [-3, 3, -2];
	this.targets[3] = [-3,-3, -2];

	this.legs = [];
	this.legs[0] = new IKLeg([ 1, 1, 0], this.targets[0], 3, 3, this);
	this.legs[1] = new IKLeg([ 1,-1, 0], this.targets[1], 3, 3, this);
	this.legs[2] = new IKLeg([-1, 1, 0], this.targets[2], 3, 3, this);
	this.legs[3] = new IKLeg([-1,-1, 0], this.targets[3], 3, 3, this);
}

Robot.prototype.draw = function(t) {
	pushMatrix();
	translate(this.pos);
	translate([0,0,1.5]);
	zRotate(this.yaw);
	this.base.draw();

	let r = this.yaw / 180 * Math.PI;
	// calculate difference in position
	let delta = [
		this.pos[0] - this.prevPos[0],
		this.pos[1] - this.prevPos[1],
		this.pos[2] - this.prevPos[2]
	];
	delta = [
		delta[0] * cos(-r) + delta[1] * sin(-r),
		-delta[0] * sin(-r) + delta[1] * cos(-r),
		delta[2]
	];

	if(Math.abs(delta[0]) > 1) delta[0] = 1;
	if(Math.abs(delta[1]) > 1) delta[1] = 1;
	if(Math.abs(delta[2]) > 1) delta[2] = 1;
	
	// difference in rotation
	let deltaR = this.yaw - this.prevYaw;
	let dr = deltaR / 180 * Math.PI;

	let biggestDistance = 1.0; 
	let legToMove = -1;
	let legMoveDist = null;
	for(i in this.legs) {
		// correct leg targets based on position
		let t = this.legs[i].target;
		this.legs[i].target[0] -= delta[0];
		this.legs[i].target[1] -= delta[1];
		this.legs[i].target[2] -= delta[2];

		// then muse evaluate the error, caused by rotation
		let rotDist = [
			t[0] * (1. - cos(dr)) - t[1] * 		 sin(dr),
			t[0] *  	 sin(dr)  - t[1] * (1. - cos(dr))
		];

		this.legs[i].target[0] += rotDist[0];
		this.legs[i].target[1] += rotDist[1];
		
		if(!this.isMovingLeg) {
			let dist = [
				this.targets[i][0] - this.legs[i].target[0],
				this.targets[i][1] - this.legs[i].target[1],
				this.targets[i][2] - this.legs[i].target[2]
			]
			let distLen = Math.sqrt(
				dist[0] * dist[0] + 
				dist[1] * dist[1] + 
				dist[2] * dist[2]
				);

			if(distLen > biggestDistance) {
				biggestDistance = distLen;
				legToMove = i;
				legMoveDist = dist;
			}
		}
	}

	if(!this.isMovingLeg && legToMove != -1) {
		let newTarget = target = [
			this.legs[legToMove].target[0] + 1.0 * legMoveDist[0],
			this.legs[legToMove].target[1] + 1.0 * legMoveDist[1],
			this.legs[legToMove].target[2] + 1.0 * legMoveDist[2],
		];
		this.legs[legToMove].startMove(newTarget);
	}

	for(i in this.legs) {
		this.legs[i].draw();
	}

	this.neck.draw();
	yRotate(this.pitch);
	this.head.draw();

	this.prevPos = [this.pos[0], this.pos[1], this.pos[2]];
	this.prevYaw = this.yaw;
	
	popMatrix();
}