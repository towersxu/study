## SVG Stroke 属性

所有stroke属性，可应用于任何种类的线条，文字和元素就像一个圆的轮廓。

- `Stroke`属性定义一条线，文本或元素轮廓颜色
- `stroke-width`属性定义了一条线，文本或元素轮廓厚度
- [`stroke-linecap`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-linecap)属性定义不同类型的开放路径的终结
>stroke-linecap 属性制定了，在开放子路径被设置描边的情况下，用于开放自路径两端的形状。


- `stroke-dasharray`属性用于创建虚线
> 它是一个<length>和<percentage>数列，数与数之间用逗号或者空白隔开，指定短划线和缺口的长度。如果提供了奇数个值，则这个值的数列重复一次，从而变成偶数个值。因此，5,3,2等同于5,3,2,5,3,2。

- `stroke-dashoffset`属性指定了dash模式到路径开始的距离
> 如果使用了一个 <百分比> 值， 那么这个值就代表了当前viewport的一个百分比。值可以取为负值。

- `stroke-linecap` 属性制定了，在开放子路径被设置描边的情况下，用于开放自路径两端的形状。
> 作为一个展现属性，它也可以在一个CSS样式表内部，作为一个属性直接使用。

- `stroke-opacity`属性指定了当前对象的轮廓的不透明度。它的默认值是1。
> 在当前对象的轮廓上用该涂色操作的不透明度。任何超出0.0到1.0范围的值都会被压回这个范围（0.0表示完全透明，1.0表示完全不透明）。

- `stroke-linejoin`:<miterlimit>
> 如果两条线交汇在一起形成一个尖角，而且属性stroke-linejoin指定了miter，斜接有可能扩展到远远超过出路径轮廓线的线宽。属性stroke-miterlimit对斜接长度和stroke-width的比率强加了一个极限。当极限到达时，交汇处由斜接变成倒角。
对斜角长度与stroke-width的比率的限制。<miterlimit>的值必须是一个大于或等于1的<number>。


- 怎么实现画轮廓的功能的？
> 将stroke-dasharray的两个参数设置为整个线条一样的长度,表示有相同的边和相通的空白，然后设置stroke-dashoffset为整个线条的长度，表示将实线部分偏离出去，将空白部分显示出来。然后在使用动画。
