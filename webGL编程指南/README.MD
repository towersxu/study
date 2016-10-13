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

- 片元着色器（Fragment shader）:进行逐片元处理过程如光照的程序。片元（Fragment）是一个WBEGL术语，可以理解为像素。
