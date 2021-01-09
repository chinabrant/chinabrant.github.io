---
title: xcassets简介
date: 2017-03-06 13:47:37
tags:
---

### 一、简介
`Asset Catalog` 是  `Xcode 5`引入的一个图片管理新方式。
特性：
* 图片名称管理简单，只要命名Asset名称，对应的`1x`，`2x`，`3x`图片名字无要求，只要拖入对应的图片位置就可以。使用的时候直接使用`Asset`名称。
* 管理应用的`ICON`，`Launch Images`.(同样的对图片名字无要求，直接拖入项目要严格按命名规范来。）
* 支持矢量图片（`pdf`格式，编译期会自动生成`@1x` `@2x` `@3x`的图片，`pdf`的图片大小要按`1x`的大小来做）
* 支持图片拉伸 （不需要在项目是写`resizeImage`这样的代码来缩放了）
* 不支持`initWithContentOfFile:`方法读取。

### 二、基本使用 (demo)
* images.xcassets创建
* 文件夹，资源项创建
* 图片拖入
* contents.json文件查看
* icon,launch image

### 三、图片拉伸 (demo)
Show Slicing
三条分隔线，左边线到中间线之间的区域是拉伸区，右边线到中间的区域是隐藏区（发生拉伸时，左边区域根据拉伸模式填充，右边的区域被隐藏）

UIImageResizingModeTile,        // 平铺
UIImageResizingModeStretch,     // 拉伸

### 四、xcassets.car文件介绍，cartool介绍
用`images.xcassets`管理的图片，在最打包成`Assets.car`文件。解压ipa包可以看到。`Assets.car`是经过压缩的。
`cartool`就是用来提取`Assets.car`文件中的图片的。

* [github address](https://github.com/steventroughtonsmith/cartool)

### 五、图片分块管理介绍(命名规则讨论)
* 可以分模块建立不同的images.xcassets文件
* 常用分类
   * Nav
   * TabBar
   * Common(Default)
   * 按模块命名
        * 子模块
### 六、插件（RTImageAssets)
一个 `Xcode` 插件，用来生成 `@3x` 的图片资源对应的 `@2x` 和 `@1x` 版本，只要拖拽高清图到 `@3x` 的位置上，然后按 `Ctrl+Shift+A` 即可自动生成两张低清的补全空位。当然你也可以从 `@2x` 的图生成 `@3x` 版本，如果你对图片质量要求不高的话。

`Xcode8` 不支持插件了，但是github上有一些第三方的解决方案，不推荐.

* 特性

    * 只会填补空位，如果你已经设置好了自己的 `@2x` 图，则不会生成
    * 自动重命名，保持项目干净（把 N.imageset 下的图片名字改为 `N.png` `N@2x.png` `N@3x.png` 等）；
* [github地址](https://github.com/rickytan/RTImageAssets)