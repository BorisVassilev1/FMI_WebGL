// става и кост - конструктор
// добавих офсет за геометрията, който да не зависи от размера на елемента
// както и цвят за удобство
Bone = function (length, body, geoffset, color = [1, 1, 0], texture = undefined) {
	if (typeof geoffset == 'undefined') {
		geoffset = [0, 0, 0.5];
	}
	if (typeof body === 'undefined') {
		this.length = length[2];
		this.body = [custom(new Cuboid([0, 0, 0], length), { offset: geoffset, color: color })];
		if (texture != undefined) {
			this.body[0].texture = texture;
			texScale(this.body[0].texMatrix, [0.5 / this.length, 1]);
			texScale(this.body[0].texMatrix, [0.3, 0.3]);
		}
	}
	else {
		this.length = length[2];
		this.body = body;
	}
	this.rot = [0, 0, 0, 0];
}

// става и кост - метод за рисуване
Bone.prototype.draw = function () {
	if (this.rot) {
		if (this.rot[0]) zRotate(this.rot[0]);	// хоризонтален ъгъл
		if (this.rot[1]) yRotate(this.rot[1]);	// вертикален ъгъл
		if (this.rot[2]) xRotate(this.rot[2]);	// вертикален ъгъл
		if (this.rot[3]) zRotate(this.rot[3]);	// осев ъгъл
	}
	if (this.offset) translate(this.offset);
	for (var i = 0; i < this.body.length; i++)
		this.body[i].draw();
	translate([0, 0, this.length]); // преместване в края на костта
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

// пиле - конструктор
Bird = function () {
	this.position = [0, 0, 0];
	this.base = [0, 0, 0];
	this.body = new Bone([1, 2, 1]);

	this.body.body[0].color = [0.7, 0.7, 0.7];

	this.LWing = [];
	this.RWing = [];
	this.WING_SEGMENTS = 10;
	for (let i = 0; i < this.WING_SEGMENTS; ++i) {
		let a = 1 - (i / this.WING_SEGMENTS) + 0.1;
		this.LWing.push(new Bone([0.05, 1.7 * a, 0.2], undefined, [0, 0.3, 0.5], HSVtoRGB(a / 2, 1., 1.)));
		this.RWing.push(new Bone([0.05, 1.7 * a, 0.2], undefined, [0, 0.3, 0.5], HSVtoRGB(a / 2, 1., 1.)));
	}

	this.head = new Bone([0., 0., 0.7], [
		custom(new Cuboid([0, -0.2, 0.0], [0.5, 1.0, 0.9]), { color: [0.7, 0.7, 0.7] }),
		custom(new Cuboid([0.25, -0.3, 0.2], [0.1, 0.2, 0.2]), { color: [1, 1, 1] }),
		custom(new Cuboid([-0.25, -0.3, 0.2], [0.1, 0.2, 0.2]), { color: [1, 1, 1] }),
		custom(new Cuboid([0.30, -0.3, 0.2], [0.1, 0.1, 0.1]), { color: [0, 0, 1] }),
		custom(new Cuboid([-0.30, -0.3, 0.2], [0.1, 0.1, 0.1]), { color: [0, 0, 1] })
	]);

	this.beak = new Bone([0, 0, 0], [custom(new Cuboid([0, 0, 0], [0.1, 0.6, 0.6]), { color: [1, 0, 0] })]);
	this.timeOffset = 0.0;
}

// пиле - метод за анимиране
Bird.prototype.animate = function (time) {
	time += this.timeOffset;
	var t = time * 4;
	var q = time * 4 + PI;

	this.body.rot = [time * 20, 0, 0, 0];
	this.head.rot = [0, sin(time / 2 + 1) * 30, 0, 0];

	let r = -this.body.rot[0] / 180 * Math.PI;
	this.position = [this.base[0] + cos(r) * 10, this.base[1] + sin(r) * 10, this.base[2] + cos(t) * 0.2]

	this.LWing[0].rot = [sin(t) * 30, cos(t) * 30, 0, 0];
	this.RWing[0].rot = [sin(q) * 30, cos(q) * 30, 0, 0];

	for (let i = 1; i < 8; ++i) {
		this.LWing[i].rot = [sin(t) * 10, cos(t) * 10, 0, 0];
		this.RWing[i].rot = [sin(q) * 10, cos(q) * 10, 0, 0];
	}
}

// пиле - метод за рисуване
Bird.prototype.draw = function () {
	pushMatrix();
	translate(this.position);
	scale([0.8, 0.8, 0.8]);
	this.body.draw();

	var bodyMat = cloneMatrix(glmat);
	translate([0.5, -0.6, -0.5]);
	yRotate(90);
	for (var wing of this.LWing) wing.draw();

	glmat = cloneMatrix(bodyMat);
	translate([-0.5, -0.6, -0.5]);
	yRotate(-90);
	for (var wing of this.RWing) wing.draw();

	glmat = cloneMatrix(bodyMat);
	translate([0, -1.3, -0.5]);
	this.head.draw();

	translate([0, -0.5, -0.7]);
	xRotate(45);
	this.beak.draw();

	popMatrix();
}

// анимиран крак - конструктор
IKLeg = function (base, target, l1, l2, parentBody) {
	this.l1 = l1;
	this.l2 = l2;

	this.target = [
		base[0] + target[0],
		base[1] + target[1],
		base[2] + target[2],
	];
	this.restTarget = [
		this.target[0],
		this.target[1],
		this.target[2],
	];
	this.bestTarget = [
		this.target[0],
		this.target[1],
		this.target[2],
	]
	this.base = base;

	this.parent = parentBody;
	this.texture = parentBody.texture;

	this.bone1 = new Bone([0.6, 0.6, this.l1], undefined, undefined, [1.0, 1.0, 1.0], this.texture);
	this.bone2 = new Bone([0.5, 0.5, this.l2], undefined, undefined, [1.0, 1.0, 1.0], this.texture);

	this.a1 = 0; // base angle
	this.b1 = 0; // base z-rotation
	this.a2 = 0; // knee angle

	this.moveTimer = -1;
	this.moveInterval = 7;
	this.newTarget = [0, 0, 0];
	this.oldTarget = [0, 0, 0];
	this.targetDistance = 0;
	this.stepSound = new Audio(stepSoundSource);
	this.stepSound.volume = stepsVolume;
}

// анимиран крак - анимация до нова позиция
IKLeg.prototype.startMove = function (newTarget) {
	if (this.moveTimer != -1) return;
	this.moveTimer = this.moveInterval;
	++this.parent.movingLegs;
	this.oldTarget = this.target;
	this.newTarget = newTarget
}

// анимиран крак - ъпдейт
IKLeg.prototype.update = function (bodyMat) {
	let base = multiplyVectorMatrix(this.base, bodyMat);

	// относителна позиция на целта спрямо началото на крака
	let t = [
		this.target[0] - base[0],
		this.target[1] - base[1],
		this.target[2] - base[2]
	];

	// намираме обратно-въртящата матрица на тази на тялото
	pushMatrix();
	identity();
	xRotate(-this.parent.rot[0]); // обичайното въртене е zyx
	yRotate(-this.parent.rot[1]);
	zRotate(-this.parent.rot[2]);
	let inverse = glmat;
	popMatrix()
	// въртим позицията
	t = multiplyVectorMatrix(t, inverse, 0);

	let d = t[0] * t[0] + t[1] * t[1] + t[2] * t[2];
	if (d < (this.l1 + this.l2) * (this.l1 + this.l2)) {
		// ако разстоянието може да се покрие от крака
		let l1 = this.l1;
		let l2 = this.l2;
		this.b1 = Math.atan2(-t[1], t[0]);
		let tx = t[2];
		let ty = t[0] / cos(this.b1);
		this.a2 = Math.PI - Math.acos((l1 * l1 + l2 * l2 - tx * tx - ty * ty) / (2 * l1 * l2));
		this.a1 = Math.atan2(ty, tx) - Math.atan(l2 * sin(this.a2) / (l1 + l2 * cos(this.a2)));
	} else { // ако не, изправяме крака в тая посока
		this.a2 = 0;
		this.b1 = Math.atan2(-t[1], t[0]);
		let tx = t[2];
		let ty = t[0] / cos(this.b1);
		this.a1 = Math.atan2(ty, tx);
	}

	// намираме къде е позицията на покой на крака
	this.bestTarget = multiplyVectorMatrix(this.restTarget, bodyMat);
	// и я проектираме върху земята
	this.bestTarget = raycast([
		this.bestTarget[0],
		this.bestTarget[1],
		this.bestTarget[2]
	]);

	// смятаме разстояние до "перфектната" позиция
	let targetDist = [
		this.target[0] - this.bestTarget[0],
		this.target[1] - this.bestTarget[1],
		this.target[2] - this.bestTarget[2]
	];
	let len = (
		targetDist[0] * targetDist[0] +
		targetDist[1] * targetDist[1] +
		targetDist[2] * targetDist[2]
	);
	this.targetDistance = len;

	// анимираме когато трябва
	if (this.moveTimer >= 0) {
		let t = this.moveTimer / this.moveInterval;
		this.target = [
			this.oldTarget[0] * (t) + this.newTarget[0] * (1. - t),
			this.oldTarget[1] * (t) + this.newTarget[1] * (1. - t),
			this.oldTarget[2] * (t) + this.newTarget[2] * (1. - t),
		]
		this.target[2] += sin(t * PI);
		--this.moveTimer;
	}
	if (this.moveTimer == 0) {
		--this.parent.movingLegs;
		this.stepSound.play();
	}
}

// анимиран крак - рисуване
IKLeg.prototype.draw = function () {
	pushMatrix();
	translate(this.base);
	this.bone1.rot = [this.b1 * 180 / Math.PI, this.a1 * 180 / Math.PI, 0, 0];
	this.bone1.draw();

	this.bone2.rot = [0, this.a2 * 180 / Math.PI, 0, 0];
	this.bone2.draw();
	popMatrix();

}

// куршум - конструктор
Bullet = function (position, velocity) {
	this.position = position;
	this.velocity = velocity;
}

// куршум - ъпдейт
Bullet.prototype.update = function () {
	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];
	this.position[2] += this.velocity[2];

	particles.emit([
		this.position[0],
		this.position[1],
		this.position[2]
	], [
		Math.random() - 0.5,
		Math.random() - 0.5,
		Math.random() - 0.5
	], [
		1., 0.2, 0.1], 100);
}

// робот - конструктор
Robot = function (texture) {
	this.pos = [0, 0, 0];
	this.rot = [0, 0, 0];

	this.matrix = unitMatrix();

	// наклон на камерата по x оста
	this.pitch = Math.PI / 4;

	// тяло
	this.base = new Bone([2.5, 2.5, 0.5], undefined, undefined, [1, 1, 1]);
	// врат
	this.neck = new Bone([1, 1, 1], undefined, undefined, [1, 1, 1]);
	// глава
	this.head = new Bone([2, 2, 2], [custom(new Sphere([0, 0, 0], 0.5), { offset: [0, 0, 0.5], color: [0, 0, 1] })]);

	// текстура за краката
	this.texture = texture;

	// крака
	this.legs = [];
	this.legs[0] = new IKLeg([1, 1, 0], [2, 2, -2], 3, 3, this);
	this.legs[1] = new IKLeg([1, -1, 0], [2, -2, -2], 3, 3, this);
	this.legs[2] = new IKLeg([-1, 1, 0], [-2, 2, -2], 3, 3, this);
	this.legs[3] = new IKLeg([-1, -1, 0], [-2, -2, -2], 3, 3, this);
	this.legs[4] = new IKLeg([0, 1, 0], [0, 3, -2], 3, 3, this);
	this.legs[5] = new IKLeg([0, -1, 0], [0, -3, -2], 3, 3, this);

	// брой крака във въздуха
	this.movingLegs = 0;

	// куршуми
	this.bullets = new Map();
}

// робот - стреляне
Robot.prototype.shoot = function () {
	let time = now();
	let speed = 0.6;
	let yaw = -this.rot[2] / 180 * Math.PI;
	pitch = (90 + this.pitch) / 180 * Math.PI;
	// посока на стреляне от сферични координати
	let direction = [
		-speed * cos(yaw) * sin(pitch),
		-speed * sin(yaw) * sin(pitch),
		-speed * cos(pitch)
	]

	// посока "нагоре" за да бъде куршумът на мястото на главата
	let up = multiplyVectorMatrix([0, 0, 1], this.matrix, 0);
	this.bullets.set(time, new Bullet([
		this.pos[0] + 2 * up[0],
		this.pos[1] + 2 * up[1],
		this.pos[2] + 2 * up[2],
	], direction));
	// ще бъде изтрит след 2 секунди
	setTimeout(() => { this.bullets.delete(time) }, 2000);
	// звук
	shootSound.volume = shootVolume;
	shootSound.pause();
	shootSound.currentTime = 0;
	shootSound.play();
}

// робот - ъпдейт
Robot.prototype.update = function () {
	// смятаме матрицата на модела
	pushMatrix();
	translate(this.pos);
	zRotate(this.rot[2]);
	yRotate(this.rot[1]);
	xRotate(this.rot[0]);
	this.matrix = glmat;
	popMatrix();

	// ъпдейтваме краката
	for (i in this.legs) {
		this.legs[i].update(this.matrix);
	}

	let up = multiplyVectorMatrix([0, 0, 1], robot.matrix, 0);

	// смятаме колко 'нагоре' са някои групи от крака

	let leftHeight = (
		scalarProduct(this.legs[0].bestTarget, up) +
		scalarProduct(this.legs[2].bestTarget, up) +
		scalarProduct(this.legs[4].bestTarget, up)
	) / 3.;

	let rightHeight = (
		scalarProduct(this.legs[1].bestTarget, up) +
		scalarProduct(this.legs[3].bestTarget, up) +
		scalarProduct(this.legs[5].bestTarget, up)
	) / 3.;

	let frontHeight = (
		scalarProduct(this.legs[0].bestTarget, up) +
		scalarProduct(this.legs[1].bestTarget, up)
	) / 2.;

	let backHeight = (
		scalarProduct(this.legs[2].bestTarget, up) +
		scalarProduct(this.legs[3].bestTarget, up)
	) / 2.;

	// и въртим тялото по подходящ начин
	this.rot[0] += ((rightHeight - leftHeight) * 1.0).clamp(-1., 1.);
	this.rot[1] += ((backHeight - frontHeight) * 1.0).clamp(-1., 1.);

	// смятаме позиция за тялото така, че да е над земята
	let bodyRaycast = raycast(this.pos);
	bodyRaycast[0] += up[0] * 2.;
	bodyRaycast[1] += up[1] * 2.;
	bodyRaycast[2] += up[2] * 2.;

	// за да няма резки движения, преместваме тялото плавно
	this.pos[0] = this.pos[0] * 0.9 + bodyRaycast[0] * 0.1;
	this.pos[1] = this.pos[1] * 0.9 + bodyRaycast[1] * 0.1;
	this.pos[2] = this.pos[2] * 0.9 + bodyRaycast[2] * 0.1;

	// избираме си крака с най-голямо разстояние до позицията на покой
	let legToMove = -1;
	let maxDist = 1.;
	for (i in this.legs) {
		if (this.legs[i].targetDistance > maxDist) {
			legToMove = i;
			maxDist = this.legs[i].targetDistance;
		}
	}

	// и ако има под два крака във въздуха, го местим
	if (legToMove != -1 && this.movingLegs < 2) {
		let leg = this.legs[legToMove];
		leg.startMove([
			leg.bestTarget[0],
			leg.bestTarget[1],
			leg.bestTarget[2]
		]);
	}

	// ъпдейтваме куршумите
	for (const [key, bullet] of this.bullets) {
		bullet.update();
	}

	// пуши в синьо
	particles.emit([
		this.pos[0] + up[0] * 2. + (Math.random() - 0.5) * 1.3,
		this.pos[1] + up[1] * 2. + (Math.random() - 0.5) * 1.3,
		this.pos[2] + up[2] * 2. + (Math.random() - 0.5) * 1.3
	], [
		Math.random() - 0.5,
		Math.random() - 0.5,
		Math.random()
	], [
		0., 0.2, 1.0], 50);
}

// робот - рисуване
Robot.prototype.draw = function (t) {
	pushMatrix();
	// използваме вече сметнатата матрица
	glmat = cloneMatrix(this.matrix);
	useMatrix();
	gl.bindTexture(gl.TEXTURE_2D, noiseTexture);

	this.base.draw();

	for (i in this.legs) {
		this.legs[i].draw();
	}

	this.neck.draw();
	// yRotate(this.pitch);
	this.head.draw();

	popMatrix();
}

// src: https://stackoverflow.com/a/11409944/10984122 
/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
	return Math.min(Math.max(this, min), max);
};