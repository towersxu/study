var canvas = document.querySelector('canvas')
var gl = canvas.getContext('webgl')

WebGLDebugUtils.makeDebugContext(gl);
// Specify the color for clearing <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw a point
// gl.drawArrays(gl.POINTS, 0, 1);
