//void main() {
//    gl_Position = vec4(1,0,0,1);
//    }
varying vec3 vNormal;
varying vec2 vUv;
void main() {
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
vNormal = normalize( normalMatrix * normal );
vUv = uv;
}

uniform sampler2D texture;
varying vec3 vNormal;
varying vec2 vUv;
void main() {
    vec3 diffuse = texture2D(texture, vUv).xyz;
    float intensity = 1.05 - dot(vNormal, vec3( 0.0, 0.0, 1.0 ));
    vec3 atmosphere = vec3(1.0, 1.0, 1.0 ) * pow( intensity, 3.0);
    gl_FragColor = vec4(diffuse + atmosphere, 1.0);
}
