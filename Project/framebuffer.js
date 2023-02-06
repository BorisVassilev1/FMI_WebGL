function makeColorTexture(width, height) {
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return tex;
}

function makeDepthTexture(width, height) {
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return tex;
} 

function makeFrameBuffer(width, height, textures) {
    fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    for(const tex of textures) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, tex[0], gl.TEXTURE_2D, tex[1], 0);
    }
   
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch (status) {
        case gl.FRAMEBUFFER_COMPLETE:
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            console.log("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            console.log("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            console.log("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            console.log("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
            break;
        default:
            console.log("Incomplete framebuffer: " + status);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fb;
}

// правоъгълник за рисуване на екрана
ScreenQuad = function () {
    let data = [
        -1, -1,
        -1, 1,
        1, -1,
        1, -1,
        1, 1,
        -1, 1,
    ];
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.buf = buf;
}

ScreenQuad.prototype.draw = function () {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ, 2, gl.FLOAT, false, 0 * FLOATS, 0 * FLOATS);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

