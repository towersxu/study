#webGL编程指南demo及笔记

## 第二章
- 获取绘图环境`gl = canvasElement.getContext('webgl')`
- 设置背景颜色`gl.clearColor(0.0,0.0,0.0,0.8)` 黑色透明度为0.8，每个参数取值在0.0~1.0之间
- 使用背景色清空绘图区域 `gl.clear(gl.COLOR_BUFFER_BIT)`

### gl.clear(buffer)
参数 buffer
`gl.COLOR_BUFFER_BIT`   - 指定颜色缓存
`gl.DEPTH_BUFFER_BIT`   - 指定深度缓冲区
`gl.STENCIL_BUFFER_BIT` - 指定模板缓冲区

### 着色器
在三维场景中，仅仅用线条和颜色把图形画出来是远远不够的。还需要考虑光照射上去之后，或者观察者视角发生变化等对场景的影响。
- 着色器是以js字符串的形式编写着色器语言OpenGL ES 着色器语言（GLSL ES）
- 顶点着色器（Vertex shader）:顶点着色器是用来描述顶点特性（如位置、颜色等）的程序。
顶点（vertex）是指二维或三维空间中的一个点，比如二维或三维图形的端点或交点。
- 片元着色器（Fragment shader）:进行逐片元处理过程如光照的程序。片元（Fragment）是一个WBEGL术语，可以理解为含有一个像素的位置，颜色和其他信息的信息集合。
  - gl_FragColor:片元着色器唯一的内置变量，它控制着像素在屏幕上的最终颜色。
- 齐次坐标（x,y,z,w）等价于三维坐标（x/w,y/w,z/w）.

### 绘制
- gl.drawArrays(mode, first, count)
  `mode`: 指定绘制的方式，可选参数有`gl.POINTS`,`gl.LINES`,`gl.LINE_STRIP`,`gl.LINE_LOOP`,`gl.TRIANGLES`,`gl.TRIANGLE_STRIP`,`gl.TRIANGLE_FAN`
  `first`: 指定从那个点开始绘制（整数）
  `count`: 指定绘制需要用到多少个顶点（整数）
  当程序调用gl.drawArrays()时，顶点着色器将执行count次，每次处理一个顶点。一旦顶点着色器执行完之后，片元着色器就会开始执行，将颜色赋值给gl_FragColor

### 在js中将位置信息传给顶点着色器
- attribute变量：传输与顶点位置相关的数据
```glsl
  attribute vec4 a_Position
```
attribute变量声明必须成全局变量，数据将从着色器外部传给该变量。
<存储限定符><类型><变量名>
- 获取attribute变量
先要向WebGL系统获取变量的存储地址，然后才能拿该变量传输数据。
`gl.getAttribLocation(program,name)`
  - `program`:指定包含顶点着色器和片元着色器的着色器程序对象
    ```javascript
      gl.vertexAttrib1f(location, v0)
      gl.vertexAttrib2f(location, v0, v1)
      gl.vertexAttrib3f(location, v0, v1, v2)
      gl.vertexAttrib4f(location, v0, v1, v2, v3)

      var postion = new Float32Array([1.0,2.0,3.0,1.0])
      gl.vertexAttrib4fv(location, postion) // 带有v表示可以接受数组作为参数
    ```
  - `location`:修改的attribute变量的存储位置

- uniform变量：传输所有顶点都相同或者无关的数据
  `gl.getUniformLocation`
  `gl.uniform4fv(u_FragColor,g_colors[i])`

### 总结
顶点着色器进行的是逐顶点的操作，片元着色器进行的是逐片元的操作。


## 第二章
