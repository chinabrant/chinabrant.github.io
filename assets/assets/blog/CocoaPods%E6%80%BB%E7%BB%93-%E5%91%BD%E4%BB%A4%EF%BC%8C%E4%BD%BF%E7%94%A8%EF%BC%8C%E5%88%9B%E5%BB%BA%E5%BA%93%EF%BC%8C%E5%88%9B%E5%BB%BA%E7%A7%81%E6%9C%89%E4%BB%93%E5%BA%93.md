---
title: 'CocoaPods总结[命令，使用，创建库，创建私有仓库]'
date: 2017-05-05 18:11:14
tags: CocoaPods
---

# 一、前言
* 第三方代码管理
* 在多个项目间管理公共代码
* 组件化

# 二、项目使用CocoaPods
## 初始化
> $ pod init

第一行：指明项目支持的iOS版本
platform :ios, '8.0'

`CocoaPods`现在是通过`target`来组织的,如果项目有多个`target`，可以写多个`target`为每个`target`引入不同的第三方库。
写法：
```
target '78S_iOS' do
    # pod 'xxx'
end
```

## 集成到现有的workspace,没试过。
```
workspace 'MyWorkspace'
```
## 什么时候用`pod install` 什么时候用`pod update`
* `pod install` 用来为项目安装新的pod，不管你以前有没有运行过`pod install`, 当在`Podfile`中添加或删除了pod时，都应该用`pod install`,（可以理解为你更新的你的Podfile文件 ，就用'pod install'）。
* `pod update [PODNAME] 只有当你要更新已经存在的库到一个最新的版本时才使用。

### 关于`pod install`
* 运行这个命令，会下载`Podfile`中添加的新pod，并且打下载的`pod`的版本信息等写到`Podfile.lock`文件中。
* 运行这个命令，只会检查`Podfile.lock`文件中不存在的`pod`，如果`Podfile.lock`文件中已经存在的`pod`，只会下载`Podfile.lock`文件中保存的版本，就算这个时候这个库有一个新的版本，也不会去更新。对于`Podfile.lock`文件中不存在的`pod`，会下载`Podfile`文件中声明的版本。
### 关于`pod outdated`
* 运行这个命令，`CocoaPods`会列出`Podfile.lock`文件中保存的版本过旧的库（就是会列出有新版本的库）

### 关于`pod update  [PODNAME]`
* 这个命令会更新指定`pod`的版本到最新版本，如果不指定`pod`，则会更新所有的库到最新版本。所以为了让一个team里所有人的库都保持在一个相同的版本，版本控制要上传`Podfile.lock`文件。尽量不要用`pod update`
* `pod update`这个命令会带上`pod repo update`,`repo`更新会很慢，可以添加参数`--no-repo-update`来跳过`repo update`.

# 三、`CocoaPods`库的创建

## 从无到有创建一个库（ScalableImageView)
```
pod lib create ScalableImageView
```
还可以通过`--template-url=你的url`来指定模版。可以clone[官方模版](https://github.com/cocoapods/pod-template) 模版做一些定制修改。

![](https://chinabrant.github.io/images/cocoapods_lib_create.png)

官方模版会有几个选项：
* 用什么语言 `Objective-C` or `Swift`
* 是否创建一个`Demo`项目
* 是否要一个测试框架
* `UI`测试框架
* `Objective-C`的前缀

目录结构：
![](https://chinabrant.github.io/images/cocoapods_list.png)

## `podspec`文件

## 提交`pod`到`trunk` 仓库
* 检查pod,有两个命令
    * `pod lib lint`这个命令是在本地检查，不用连接网络
    * `pod spec lint`要联网，会检查是远端
* 如果检查没有错误，要提交到`trunk`
    * 代码推送到git仓库，打上对应的`tag`
    * 首先要得到一个授权`pod trunk register orta@cocoapods.org 'Orta Therox' --description='macbook air'`  这条命令会发一个邮件到你提供的邮箱中，点击验证后才能进行下面的操作。
    * 验证后，可以通过`pod trunk me`来查看你的授权信息
    * 通过`pod trunk push`将当前pod提交到trunk

# 四、现有代码添加`CocoaPods`支持
* 只要处理好`podspec`文件即可
* 通过命令`pod spec create xxx`来创建`podspec`文件，更改文件对应的设置就可以

# 五、私有Spec Repo仓库创建
* 首先在`github`或者自己的`git`服务器上创建一个`repo`来存放`Spec Repo`
* 将创建好的私有`repo`添加到`CocoaPods`中
```
pod repo add REPO_NAME SOURCE_URL(仓库地址)  (repo名最好跟仓库名保持一致)
```
验证是否安装成功
> cd ~/.cocoapods/repos/REPO_NAME
   pod repo lint .

# 六、提交库到私有仓库
```
pod repo push REPO_NAME SPEC_NAME.podspec
```

# 七、在项目中使用私有仓库的pod
在Podfile文件中添加源
```
source 'https://github.com/xx/xx.git'  // 自己的源
source 'https://github.com/CocoaPods/Specs.git'  // 官方源
```