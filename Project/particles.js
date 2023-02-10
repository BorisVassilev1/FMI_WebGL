
var PARTICLE_SIZE = 10; // 3 pos, 3 vel, 1 duration, 3 color (в байтове)
var MAX_PARTICLES = 1000;

// система от частици - конструктор
ParticleSystem = function () {
    let data = [
        -0.5, -0.5,
        0.5, -0.5,
        -0.5, 0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5,
    ];
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.buf = buf;
    this.texture = null;
    this.positions = new Float32Array(MAX_PARTICLES * PARTICLE_SIZE);
    this.particleCount = 0;
    this.posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// система от частици - ъпдейт
ParticleSystem.prototype.update = function() {
    for(let i = 0; i < this.particleCount; ++ i) {
        let j = i * PARTICLE_SIZE;
        
        // позиции                скорости              **ако имаме 60 кадъра
        this.positions[j + 0] += this.positions[j + 3] / 60.;
        this.positions[j + 1] += this.positions[j + 4] / 60.;
        this.positions[j + 2] += this.positions[j + 5] / 60.;
        
        // намаляваме живота
        this.positions[j + 6] -= 1;
        if(this.positions[j + 6] <= 0) {
            // премества последната на мястото на текущата 
            -- this.particleCount;
            this.positions[j + 0] = this.positions[PARTICLE_SIZE * this.particleCount + 0];
            this.positions[j + 1] = this.positions[PARTICLE_SIZE * this.particleCount + 1];
            this.positions[j + 2] = this.positions[PARTICLE_SIZE * this.particleCount + 2];
            this.positions[j + 3] = this.positions[PARTICLE_SIZE * this.particleCount + 3];
            this.positions[j + 4] = this.positions[PARTICLE_SIZE * this.particleCount + 4];
            this.positions[j + 5] = this.positions[PARTICLE_SIZE * this.particleCount + 5];
            this.positions[j + 6] = this.positions[PARTICLE_SIZE * this.particleCount + 6];
            this.positions[j + 7] = this.positions[PARTICLE_SIZE * this.particleCount + 7];
            this.positions[j + 8] = this.positions[PARTICLE_SIZE * this.particleCount + 8];
            this.positions[j + 9] = this.positions[PARTICLE_SIZE * this.particleCount + 9];
        }
    }
    // и ъпдейтваме буфера
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// система от частици - създаване на нова частица
ParticleSystem.prototype.emit = function (position, velocity = [0,0,0], color = [0.5, 0.5, 0.5], duration = 500) {
    if(this.particleCount > 999) return;
    this.positions[PARTICLE_SIZE * this.particleCount + 0] = position[0];
    this.positions[PARTICLE_SIZE * this.particleCount + 1] = position[1];
    this.positions[PARTICLE_SIZE * this.particleCount + 2] = position[2];
    this.positions[PARTICLE_SIZE * this.particleCount + 3] = velocity[0];
    this.positions[PARTICLE_SIZE * this.particleCount + 4] = velocity[1];
    this.positions[PARTICLE_SIZE * this.particleCount + 5] = velocity[2];
    this.positions[PARTICLE_SIZE * this.particleCount + 6] = duration;
    this.positions[PARTICLE_SIZE * this.particleCount + 7] = color[0];
    this.positions[PARTICLE_SIZE * this.particleCount + 8] = color[1];
    this.positions[PARTICLE_SIZE * this.particleCount + 9] = color[2];
    ++ this.particleCount;
}

// система от частици - рисуване
ParticleSystem.prototype.draw = function () {
    // няма да пишем по дълбочинния буфер
    gl.depthMask(false);
    // additive blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    
    gl.uniform1f(spriteProg.uMaxParticleLife, 50);
    gl.bindTexture(gl.TEXTURE_2D, spriteTexture);
    
    // позиции 
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ, 2, gl.FLOAT, false, 0 * FLOATS, 0 * FLOATS);

    // позиции, скорост, живот и цвят за инстанциите
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
    gl.enableVertexAttribArray(aParticlePosition);
    gl.vertexAttribPointer(aParticlePosition, 3, gl.FLOAT, false, PARTICLE_SIZE * FLOATS, 0 * FLOATS);
    gl.vertexAttribDivisor(aParticlePosition, 1);

    // gl.enableVertexAttribArray(aParticleVelocity);
    // gl.vertexAttribPointer(aParticleVelocity, 3, gl.FLOAT, false, PARTICLE_SIZE * FLOATS, 3 * FLOATS);
    // gl.vertexAttribDivisor(aParticleVelocity, 1);

    gl.enableVertexAttribArray(aParticleLife);
    gl.vertexAttribPointer(aParticleLife, 1, gl.FLOAT, false, PARTICLE_SIZE * FLOATS, 6 * FLOATS);
    gl.vertexAttribDivisor(aParticleLife, 1);

    gl.enableVertexAttribArray(aParticleColor);
    gl.vertexAttribPointer(aParticleColor, 3, gl.FLOAT, false, PARTICLE_SIZE * FLOATS, 7 * FLOATS);
    gl.vertexAttribDivisor(aParticleColor, 1);
    
    // самото рисуване
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.particleCount);

    // връщаме важните неща както преди
    gl.disableVertexAttribArray(aParticlePosition);
    gl.disableVertexAttribArray(aParticleLife);
    gl.disableVertexAttribArray(aParticleColor);    
    gl.vertexAttribDivisor(aParticlePosition, 0);
    gl.vertexAttribDivisor(aParticleLife, 0);
    gl.vertexAttribDivisor(aParticleColor, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

