---
title: UITableView列表优化
date: 2016-05-08 10:21:47
tags: UITableView 优化
---

移动开发中，任何一个应用都或多或少的有列表的存在，列表的上下滑动直接关系到用户体验。如果处理不好，就会使得列表滑动起来有明显的卡顿效果。所以对列表的优化，让它更加的顺滑，就成了移动开发工程师们一直努力的方向。下面就说说一些通用的列表优化，很多优化还是要到具体的列表环境中。欢迎交流。

### 一、Cell的复用
最基本的如果一个`table view`要展示1000条数据，不可能生成1000个`view`。其实只要生成够在屏幕上显示的cell个数就可以了。`table view`已经做了这个优化。下面是`UITableView`的重用机制。
> `UITableView`里面有一个array，存放当前能用的table view cell,当有新的cell滑入屏幕时，先查看这个array中有没有能用的cell，有能用的cell就直接返回，没有就重新生成一个cell，再返回，滑出屏幕的cell会放到这个array中。

### 二、图片的异步加载
这个是地球人都知道的，不能在主线程做耗时的操作。列表上显示的图片一般都比较小，所以可以不用原图，提升加载的速度。`github`上有很多很好的图片加载库[SDWebImage](https://github.com/rs/SDWebImage )  、[YYWebImage](https://github.com/ibireme/YYWebImage)

### 三、高度的缓存
`cell`的布局可以用手动计算，也可以用AutoLayout。但是在`view`的数量达到一定量时，autolayout会严重影响性能。为了不让系统每次都计算cell的高度，第一次计算好后要将高度缓存起来。手动布局时，各控件的位置也可以缓存起来。

### 四、离屏渲染、像素对齐的处理
instruments(Core Animation)只能真机下使用
* 离屏渲染：GPU在当前屏幕缓冲区以外新开辟一个缓冲区进行渲染操作
    * shouldRasterize(光栅化)
    * masks
    * shadows
    * edge antialiasing (抗锯齿）
    * opacity (不透明) 会产生图层混合
    * layer属性设置圆角
    * 渐变
>当使用圆角，阴影，遮罩的时候，图层属性的混合体被指定为在未预合成之前不能直接在屏幕中绘制，所以就需要屏幕外渲染被唤起。
屏幕外渲染并不意味着软件绘制，但是它意味着图层必须在被显示之前在一个屏幕外上下文中被渲染（不论CPU还是GPU）

在iOS中，有一个概念叫做像素对齐，如果像素不对齐，那么在GPU渲染时，需要进行插值计算，这个插值计算的过程会有性能损耗。

### 五、drawRect绘制
cell上的一些元素如果不要处理事件，可以直接绘制到cell上，减少GPU对layer的处理。

### 六、滑动时不设置图片(Runloop)
图片异步下载完成后，如果在滑动的时候设置到`UIImageView`上，会出现卡顿，所以要做到流畅的滑动，可以在滑动停止后设置。这里就可以用到`Runloop`了，当`UIScrollView`滑动时，`runloop`会切换到`UITrackingRunloopMode`,`UIScrollView`停止后会切换到`NSDefaultRunloopMode`所以，可以将设置图片的动作放在主线程的`NSDefaultRunloopMode`里。
```
[self performSelector:@selector(setImage:) onThread:[NSThread mainThread] withObject:image waitUntilDone:YES modes:@[NSDefaultRunLoopMode]];
```

### 七、想到了再更，肯定还有...


### 一些优化查看工具
* Instruments(Core Animation查看FPS、离屏渲染等)
* 实时显示FPS的库
