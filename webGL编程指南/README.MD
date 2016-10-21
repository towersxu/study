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


## 第三章

### 使用缓存区对象向顶点着色器传输多个顶点的数据。
- 创建缓冲区对象（gl.createBuffer()）
- 绑定缓冲区对象（gl.bindBuffer()）
- 将数据写入缓冲区对象 (gl.bufferData())
- 将缓冲区对象分配给一个attribute变量 （gl.vertexAttribPointer）
- 开启attribute变量（gl.enableVertexAttribArray）

### 创建缓冲区对象
- gl.createBuffer() 成功返回值非null.失败返回null
- gl.deleteBuffeer(buffer) 无返回值

### 绑定缓冲区对象
将缓冲区对象绑定到webGL系统中已经存在的“目标”上。

- `gl.bindBuffer(target,buffer)`
target：可取值为`gl.ARRAY_BUFFER`,`gl.ELEMENT_ARRAY_BUFFER`
  + `gl.ARRAY_BUFFER `表示缓冲区对象中包含了顶点的数据
  + `gl.ELEMENT_ARRAY_BUFFER`表示缓冲区对象中包含了顶到的索引值

### 将数据写入缓冲区对象
`gl.bufferData(target, data, usage)`,将`variable`中的数据写入绑定了`gl.ARRAY_BUFFER`上的缓冲区对象。我们不能直接向缓冲区写入数据，而只能向`target`写入数据，所以要向缓冲区写数据，必须先绑定。

### 类型化数组
创建类型化数组唯一的方法是使用`new`运算符
- get(index)
- set(index,value)
- set(array, offset)
- length
- BYTES_PER_ELEMENT

### 将缓冲区对象分配给attribute变量
**gl.vertexAttribPointer(location, size, type, normalized, stride, offset)**
- location:指待分配attribute变量的存储位置
- size:指定缓冲区中每个顶点的分量个数（1到4）。若size比attribute变量需要的分量小，缺失分量会自动补齐。
- type:
  + gl.UNSIGNED_BYTE 无符号字节，Uint8Array
  + gl.SHORT 短整形，Int16Array
  + gl.UNSIGNED_SHORT 无符号短整形，Uint16Array
  + gl.INT 整形，Int32Array
  + gl.UNSIGNED_INT 无符号整形，Uint32Array
  + gl.FLOAT 浮点型，Float32Array
- normalized: 传入true或者false,表明是否将非浮点型的数据归一化到[0,1]或者[-1,-1]区间
- stride: 只相邻两个顶点间的字节数，默认为0
- offset: 偏移量

### 开启attribute变量
为了使顶点着色器能够访问缓冲区内的数据，需要使用`gl.enableVertexAttribArray(location)`来开启attribute变量。
`gl.disableVertexArray(location)`

### webGL基本图形

![palette](chpter03/img/01.png)

### 变化矩阵

- 平移矩阵：
![palette](chpter03/img/02.png)

- 旋转矩阵:
![palette](chpter03/img/03.png)、

- 缩放矩阵:
![palette](chpter03/img/04.png)

### 按行主序（row major order）和按列主序（column major order）

![palette](chpter03/img/05.png)

WebGL和OpenGL都是按列主序

##第四章
这章主要是调用写好的方法，就不谢笔记了。
- `gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)`

##第五章

- 图形装配过程：将孤立的坐标点装配成几何图形。几何图形的类别由gl.drawArrays()函数的第一个参数决定。
- 图元光栅化（rasterzation process）表示发送在顶点着色器和片元着色器之间的从图形到片元的转化。

  ```javascript
  var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, FSIZE*2)
  ```
- varying变量（颜色变量）

- 纹理映射（texture mapping）
  1. 准备好映射到几何图形上的纹理图像
  2. 为几何图形配置纹理映射方式
  3. 加载纹理图像，对其进行一些配置，以在WebGL中使用它
  4. 在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元。

- 纹理坐标（texture coordinates, st坐标系统）
