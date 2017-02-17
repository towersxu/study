## SMIL
> Synchronized Multimedia Integration Language

- 通过CSS来控制SVG的样式和动画
> 这也就意味这，有不少动画效果是无法通过CSS来完成。如果你希望能够控制那些无法直接通过CSS实现的属性，可以用JS去实现，也可以用SMIL里的动画去实现。如果你更想用JS,你可以考虑使用被称作是“SVG领域中的jQuery”的snap.svg

- 使用xlink:href指定动画目标

- 使用attributeName和attributeType指定动画属性

### 使用from,to,duration,fill,by指定动画的状态

fill表示元素是否在动画结束后变成初始状态
- freeze 代表动画效果将保持动画结束时的状态，在之后处于冻结状态（除非重启动画）
- remove 代表当动画结束后，动画过程中实施的效果会被移除（除非重启动画）

### restart

- always：默认值，代表动画可以随时重新开始;
- whenNotActive： 代表只有在动画处于非激活状态时才可以重新开始，如果动画正在进行中，将会忽略触发它重新开始的事件;
- never动画将在整个容器时间段内无法重新开始（对于SVG文档片段来说，意味着整个文档过程中将不能重启动画）;

### 为动画命名并关联多个动画
另外一种关联多个动画的方式是“事件+另一个动画的ID”，比如你有多个动画（不论是否是同一个目标元素），你想让他们产生关联，比如动画A在动画B结束后开始，使用这种方式的话你就不需要知道其他动画的时长了。

### 使用repeatCount重复执行动画
如果你想重复执行动画，可以使用repeatCount属性，其对应的值可以是某个具体的数字，也可以是一些特殊的关键字，如indefinite来一直重复动画。有一点值得注意的是，动画在重复执行时，每一次都是从from这个值重新开始，而并不能从之前一次的动画结束点开始，这一点相比CSS的animation-direction:alternate就有些不便了。如果在SMIL中要达到类似的效果，就需要用JS来设置from和to值的变化了。还有一种技巧是把中间时间对应的值设为结束值，开始时间和结束时间对应的值都设为起始值

### 使用repeatDur限制动画重复时长
有时候如果一个时间比较长的动画一直重复的话可能会影响用户体验，所以可能会需要把动画重复的时间限制在一定范围内，即达到某个时间点后（相对于文档加载开始这个时间点而言）停止动画重复。这个时间范围我们称之为“表现时间(presentation time)。”，注意，这个时间是相对于整个文档片段的开始时间，而非某个动画的开始时间。

### 基于重复次数同步多个动画
之前我们提到过可以通过给begin属性设置值使不同动画产生关联，我们也可以类似地通过重复次数.`begin="circ-anim.repeat(2)"`

### 使用keyTimes和values控制动画帧
我们将使用keyTimes来制定帧的节点，用values来指定对应的值.

```html
<animate
 xlink:href="#orange-circle"
 attributeName="cx"
 from="50"
 to="450"
 dur="2s"
 begin="click"
 values="50; 490; 350; 450"
 keyTimes="0; 0.5; 0.8; 1"
 fill="freeze"
 id="circ-anim" />
```
在上面这个例子中的keyTimes和values的值都是以列表的形式出现的，keyTimes中的每个值对应一个values里的值。keyTimes里的值是一个介于0和1之间的小数，代表着占全部时长的比例，整体来说还是跟CSS的帧控制比较相似的。

要注意的是，如果定义了values，那么from,’to’,’by’都会被忽略。另外，keyTimes不是必须要设定的，如果你已经写明了values，那么其值根据values的值平均分配到不同的时间点上。

### 使用calcMode和keySplines控制动画节奏
我们都知道，在CSS中可以使用animation-timing-function来控制动画节奏，比如通过使用特定关键字或者定义贝塞尔函数来实现不同动画节奏。

在SMIL中，是通过calcMode来做这件事的，其默认值是linear（animateMotion除外，稍后会细说），其他的值还包括：discrete,paced,spline：

- discrete意味着动画将直接从一个值变为另一个值，有点类似于CSS里的steps()；
- paced有点像linear，只不过它会忽略keyTimes中定义的中间步骤。设定属性值为paced之后会计算随后的值并相应地分配时间。如果你的values里面本身就是线性模式的话，用paced和linear并没有什么区别。
- spline会根据贝塞尔曲线的设定将一个值过渡到下一个值。具体来讲，曲线的时间点在keyTimes中定义，具体的控制则是在keySplines属性中完成。

- keySplines接受一系列的贝塞尔控制点，每个控制点（control points）由四个值组成：x1, x2, y1, y2，这四个值用来描述某个时间区间的贝塞尔变化，这些值必须是在0到1之间，而且如果没有设置calcMode为spline的话这些值都将被忽略。

### 使用additive和accumulate完成附加动画和累加动画

additive的属性其实就是规定了from和to的值是否以当前值为参考值
> replace值是默认值，意味着from和to规定的值将替代当前/初始值，没有注意到这一点的话可能会造成动画开始时诡异的移动。
> sum：跟其他动画一样，你首先要制定from和to的值，然而如果你设置了additive为sum的话，那么这些中间变化的值都将会以最初的动画属性值作为参考值。比如在最开始的移动圆位置的例子中，你规定的cx是50，并且from=”0″,to=”100″，那么实际上圆的移动将会以0+50,100+50作为开始和结束。

如果我们想要的效果是重复第二次动画的时候，是以第一次动画结束时的状态为开始呢？这时候就可以使用accumulate。

### 使用多个begin和end值来定义动画间隔

事实上，begin和end属性都可以接受以分号分隔的列表值。此时，每个begin开始值就对应一个end里面的结束值，从而形成“激活态”和“非激活态”。

### 使用min和max限制激活时长

### 渐变路径例子
还有一个无法再CSS中实现动画，但是可以在SMIL中实现动画的是SVG<path>中的d属性（也就是SVG中的<path>属性），这个属性规定了形状的信息，包括告诉浏览器在哪里进行点或线的绘制。
> 通过对这个属性实施动画，我们可以创造路径渐变效果从而得到形状渐变的效果。不过，为了能够顺利地进行形状转换，开始，结束以及这期间会出现的形状都必须包括相同数量的绘制点，而且顺序需要保持一致。因为形状变化的实质是靠移动这些绘制点来实现的，所以如果缺失这些绘制点或者打乱了他们的顺序，形状就无法正常显示了。具体实现来说，你需要把attributeName的值设为d，把from和to的值设置为开始和结束时的形状，然后在values里把中间形状的值放进去。更详细的介绍还可以看这里。

### 使用<animateMotion>可以让元素沿着某条路线移动

- path用来指定移动的路线，跟在path元素上规定d的方法类似。不过这时候规定的路径值是相对于元素当前的位置而言的。

- 还有一种指定移动路线的方式<mpath>，<mpath>是<animateMotion>的子元素，使用<mpath>可以引用外部路径

> 对于指定移动路径而言，mpath会覆盖path,’path’会覆盖values，values会覆盖frombyto；对于指定keyTimes的对应点而言，keyPoints会覆盖path，path会覆盖values,最后才是from，by和to

### 在绝对路径上移动文字
在绝对路径上移动文字跟移动其他SVG元素不太一样，你需要使用的是<animate>元素而不是<animateMotion>。首先我们来把文字定位到某个路径上，此时可以把<textPath>嵌套到<text>元素里，而具体的路线将在<textPath>里指定。

```html
<path id="myPath" fill="none" stroke="#000000" stroke-miterlimit="10" d="M91.4,104.2c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3
 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7
 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5
 c1.9-2.1,3.7-5.5,6.5-6.5"/>
 <text>
 <textpath xlink:href="#myPath">
 Text laid out along a path.
 </textpath>
 </text>
```

### 使用实现动画变化
<animateTransform>元素会针对目标元素的变换属性实施动画，也就是说可以控制移动，缩放，旋转，倾斜。它用到的属性和<animate>元素一样，不过还有一个type属性。这个type属性是用来指定具体的变换类型的，包括translate, scale, rotate, skewX, skewY。


### 随机颜色
随机颜色需要避免rgb低于60（太暗）和高于230（太亮）的
```javascript
let randomColor = Math.floor(Math.random() * 171) + 60
```
