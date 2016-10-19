+ function(){
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + // attribute variable
    'attribute float a_PointSize;\n'+
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

  // Fragment shader program
  var FSHADER_SOURCE =
    'precision mediump float;\n'+
    'uniform vec4 u_FragColor;\n'+
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
  }
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (a_Position < 0 || !u_FragColor) {
    console.log('failed get attribute')
  }
  var g_points = []
  var g_colors = []
  canvas.onmousedown = function(ev){
    gl.clear(gl.COLOR_BUFFER_BIT)
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2)
    y = (canvas.width/2 - (y-rect.top))/(canvas.width/2)
    g_points.push([x,y]);
    if (x >= 0 && y >= 0) {
      g_colors.push([1.0,0.0,0.0,1.0]);
    }
    else if(x < 0 && y < 0) {
      g_colors.push([0.0,1.0,1.0,1.0]);
    }
    else if (x < 0 && y >= 0) {
      g_colors.push([0.1,0.1,1.0,1.0]);
    }
    else {
      g_colors.push([1.0,1.0,1.0,1.0]);
    }
    var len  =g_points.length;
    for(var i = 0;i < len;i++) {
      gl.vertexAttrib3f(a_Position,g_points[i][0],g_points[i][1],0.0)
      gl.uniform4fv(u_FragColor,g_colors[i])
      gl.drawArrays(gl.POINTS, 0 ,1)
    }
  }
}()
