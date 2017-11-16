attribute vec3 position;
uniform float t;

void main() {
    float value = position.x;
    float start = position.z;

    float translation = (t - start)/500.0;

    float x = value*sin(translation);
    float y = value*cos(translation);

    vec2 position_t = vec2(x,y);

    gl_Position = vec4(position_t, 0, 1.0);
    gl_PointSize = 5.0;
}
