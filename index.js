var shell = require('gl-now')()
var createShader = require('gl-shader')

var ws = new WebSocket('ws://localhost:8080/')
var shader1, shader2, buffer
var vertices = [];
var i = 0;

var t0 = +new Date()
var t;

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    return parseFloat(
        "0." + parseInt(this.valueOf(), 36).toExponential().slice(2, 4), 10)
};

shell.on('gl-init', function() {
    var gl = shell.gl

    //Create shader
    shader1 = createShader(gl,
        'attribute vec3 position;\
        uniform float t;\
        void main() {\
            float start = position.z;\
            float translation = (t - start)/2000.0;\
            vec2 position_t = vec2(-1.0+translation, 0);\
            gl_Position = vec4(position_t, 0, 1.0);\
            gl_PointSize = 5.0;\
        }',
        'precision highp float;\
        void main() {\
          gl_FragColor = vec4(0.41, 0.41, 0.41, 1.0);\
        }'
    )

    shader2 = createShader(gl,
        'attribute vec3 position;\
        uniform float t;\
        const float PI = 3.141;\
        varying float color;\
        void main() {\
            color = position.x;\
            float theta = (position.x / 4.0 * PI); \
            float start = position.z;\
            float y0 = -4.0 * tan(theta);\
            float dx = (t - start)/2000.0;\
            float dy = tan(theta) * dx;\
            float x0 = -5.0;\
            vec2 position_t = vec2(x0+dx, y0+dy);\
            gl_Position = vec4(position_t, 0, 1.0);\
            gl_PointSize = 5.0;\
        }',
        'precision highp float;\
        varying float color;\
        void main() {\
          gl_FragColor = vec4(color,0.5-color, 1.0-color,1);\
        }'
    )

    shader3 = createShader(gl,
        'attribute vec3 position;\
        uniform float t;\
        varying float color;\
        void main() {\
            color = position.x;\
            float start = position.z;\
            float translation = (t - start)/2000.0;\
            float deflection = (t-start)/8000.0;\
            vec2 position_t = vec2(-1.0+translation-2.0,0);\
            gl_Position = vec4(position_t, 0, 1.0);\
            gl_PointSize = 5.0;\
        }',
        'precision highp float;\
        varying float color;\
        void main() {\
          gl_FragColor = vec4(color,0.5-color, 1.0-color,1);\
        }'
    )

    //Create vertex buffer
    vertices = []
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0)

    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW)
})

ws.onmessage = function(event) {
    console.log(JSON.parse(event.data).c);
    d = JSON.parse(event.data);
    console.log(d.c.hashCode())

    t = +new Date() - t0
    vertices = vertices.concat([d.c.hashCode(), 0, t])

    // make a new buffer and pop the new vertices in
    var gl = shell.gl
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW)
}

shell.on('gl-render', function(t) {
    var gl = shell.gl

    //for first view
    gl.viewport(0, 0, 200, 500);
    //Bind shader1
    shader1.bind()
        //Set attributes
    shader1.attributes.position.pointer()
    shader1.uniforms.t = +new Date() - t0
        //Draw
    if (vertices.length / 3 > 0) {
        gl.drawArrays(gl.POINTS, 0, vertices.length / 3)
    }

    gl.viewport(200, 0, 200, 500);
    //Bind shader
    shader3.bind()
        //Set attributes
    shader3.attributes.position.pointer()
    shader3.uniforms.t = +new Date() - t0
        //Draw
    if (vertices.length / 3 > 0) {
        gl.drawArrays(gl.POINTS, 0, vertices.length / 3)
    }

    //for third view
    gl.viewport(400, 0, 200, 500);
    //Bind shader
    shader2.bind()
        //Set attributes
    shader2.attributes.position.pointer()
    shader2.uniforms.t = +new Date() - t0
        //Draw
    if (vertices.length / 3 > 0) {
        gl.drawArrays(gl.POINTS, 0, vertices.length / 3)
    }
})
