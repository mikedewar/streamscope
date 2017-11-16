var shell = require('gl-now')();
var glsl = require('glslify');
var createShader = require('gl-shader');
var createFBO = require("gl-fbo");
var fillScreen = require("a-big-triangle");
var createTexture = require("gl-texture2d");

var vert_particle_src = glsl('./vert_particle.glsl')
var frag_particle_src = glsl('./frag_particle.glsl')
var vert_trail_src = glsl('./vert_trail.glsl')
var frag_trail_src = glsl('./frag_trail.glsl')

var particle_shader;
var trails_shader;
var state;
var buffer;


var t0 = +new Date()
var t;
var vertices = [0, 0, 0];
var i = 1;

shell.on('gl-init', function() {
    var gl = shell.gl
    particle_shader = createShader(gl, vert_particle_src, frag_particle_src)
    trails_shader = createShader(gl, vert_trail_src, frag_trail_src)

    trails_shader.attributes.position.location = 0

    state = [ createFBO(gl, [512, 512]), createFBO(gl, [512, 512]) ]

    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // make sure the first vertex (the central point) is in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

})

shell.on('gl-render', function(t) {
    var gl = shell.gl;

    state[0].bind()

    particle_shader.bind();
    particle_shader.attributes.position.pointer();
    particle_shader.uniforms.t = +new Date() - t0;

    gl.drawArrays(gl.POINTS, 0, i)

    var tex = state[0].color[0] // get the texture from our framebuffer

    trails_shader.bind()

    // stick the texture we got from the framebuffer into the shader
    trails_shader.uniforms.texture = tex.bind()

    // bind the gl.FRAMEBUFFER (the screen) so whatever we do next writes to
    // the screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // fill the screen with a fucken big triangle which should have our texture
    // in it
    fillScreen(gl)

})

var ws = new WebSocket('ws://localhost:8080/transactions')

ws.onmessage = function(event) {
    d = JSON.parse(event.data);
    i++
    t = +new Date() - t0
    vertices = vertices.concat([d.Value / 60, 0, t])

    // pop the new vertices in the array buffer
    var gl = shell.gl
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}
