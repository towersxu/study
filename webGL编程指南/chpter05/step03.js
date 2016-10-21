+ function (){
  // RotatedTriangle_Matrix.js (c) matsuda
  // Vertex shader program
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'attribute float a_PointSize;\n'+
    'void main() {\n' +
    '  gl_Position = u_xformMatrix * a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

  // Fragment shader program
  var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n' +
    '}\n';

  // The rotation angle
  var ANGLE = 90.0;

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  var xformMatrix = new Matrix4();
  xformMatrix.setRotate(ANGLE, 0, 0, 1);
  // Pass the rotation matrix to the vertex shader
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.POINTS, 0, n);
  function initVertexBuffers(gl) {
    var vertices = new Float32Array([
      0, 0.5, 20.0,
      -0.5, -0.5, 20.0,
      0.5, -0.5, 30.0
    ]);
    // var sizes = new Float32Array([
    //   10.0, 20.0, 30.0
    // ])
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    var sizeBuffer = gl.createBuffer();
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*3, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, FSIZE*2);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
  }
}()
