---
title: iOS路由引入及遇到的问题
date: 2017-08-06 10:14:32
tags:
---
最近在给项目引入路由功能。

# 什么是路由
路由是指根据url分配到对应的处理程序，在移动端就可以理解为，根据给定的url跳转到指定页面的功能模块。

# 传统跳转跟路由的简单对比

## Native的跳转方式：
iOS：
```
TestViewController *vc = [[TestViewController alloc] init];

[self.navigationController pushViewController:vc animated:YES];
```
Android：
```
Intent intent = **new** Intent();  
intent.setClass(Intent1Activity.**this**,   
Intent2Activity.**class**);  

intent.startActivity(intent);
```

## 路由跳转方式
iOS:
```
[Router openURL:@"xxx://xxx.com/live/player?id=200"];
```
Android(直接扣的ARouter的代码):
```
// 1. 应用内简单的跳转(通过URL跳转在'进阶用法'中)
ARouter.getInstance().build("/test/activity").navigation();

// 2. 跳转并携带参数
ARouter.getInstance().build("/test/1")
   .withLong("key1", 666L)
   .withString("key3", "888")
   .withObject("key4", new Test("Jack", "Rose"))

   .navigation();
```

# 优点：路由解决的问题
* 跳转的时候不用依赖具体的目标类。
* 从外部（web或者其它app，推送等）打开App指定页面。
* **统一iOS，Android端的跳转逻辑**。
* **App复杂后组件化后，组件间解耦**。
* 统计埋点可以通过路由进行，因为路由是一个中间件，所以对路由进行AOP就行。
* 做一个热修复接口的话，可以将指定的路由更改指向（例如指向web端），可以达到热修复的效果。
* 做统一的错误处理页面。
* ...

# 路由的缺点
* 传参：因为url就是一个特定格式的字符串，所以不能携带object类型的数据。在传参方面有一定的限制。（内部跳转可以添加一些其它的方案，将对象类型转换成字典进行传递）
* 管理：路由的管理，随着项目的扩大，路由会越来越多，所以要有统一的地方管理，方便查找。
* 参数名：不能用自动补全，参数名容易出错。
* 命名：如果要在两端统一，那么要保证命名的一致性。
* ...

# URL组成
![](http://upload-images.jianshu.io/upload_images/67449-ab5284688b89b9e7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`NSURLComponent` 类中都有对应的字段。所以URL可以通过`NSURLComponent`来进行解析。

对应到移动端的路由可能是这样的：

商品详情：xxx://xxx.com/mall/goods/detail?id=2003

URL的定义应该比较直观，有一定的意义，让人一看就大概能知道这个URL的作用。

# iOS端的路由库
读了一些github上的开源路由库的代码，实现的原理都是一样的，用一个集合类缓存路由跟处理闭包的对应关系，在app启动的时候，注册好支持的URL，当调用openURL的时候，根据给定的URL查找到对应的闭包，执行闭包代码，实现跳转。找不到对应的闭包的时候，可以定义一个公共的错误页面。

还有一种是保存url跟类名的对应关系，在openURL的时候，找到对应的类名，通过runtime生成实例，实现统一跳转。

![](http://upload-images.jianshu.io/upload_images/67449-8add2b8b49cb329f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* [JLRoutes](https://github.com/joeldev/JLRoutes)
    * 集成简单
    * 可以处理各种各样的url
    * 支持通配符
    * 支持多个scheme
    * 比较纯粹，不支持打开页面后的值回传。要自己再加工。
* [MGJRouter](https://github.com/meili/MGJRouter)
    * 代码简单易懂
    * 功能全面
    * 支持push值回传
    * 支持多scheme
    * openUrl时支持一个userInfo （造成了跟系统的不统一，多出来的参数还是可以放到url中，传对象的时候有点用）（模块内部传对象可以用，模块间的话不应该传对象，会造成耦合）
* [HHRouter](https://github.com/lightory/HHRouter)
* [Routable](https://github.com/clayallsopp/routable-ios)

# 三种iOS路由注册处理方案
 ## 第一种：模块自己注册的路由自己处理

在注册url的时候，自己处理openUrl的block，中间件会提供一个当前的viewcontroller给组件做跳转用。
```
[MGJRouter registerURLPattern:@"test://test/test" toHandler:^(NSDictionary *routerParameters) {
        // 注册的时候自己处理 push present
        // 注册的地方在自己的模块里面，所以，自己可以拿到viewController的实例
    }];
```

### 优点
* url中不用体现类名，所以即使修改了类名，也只要修改注册的地方
* 可以自己决定是push还是present
* 可以验证参数，参数不正确可以返回错误信息
* 可以做到一个url对应一个vc
* 可以取消注册
* 方便和web端和Android端做统一

### 缺点
* 每个注册的URL都要自己处理跳转
* URL会很多，不好管理，不能随便改动URL（这点可以通过在一个公共的地方将URL定义成宏）
* 注册代码也会好多。（定义模块类，将注册代码分散到各个模块类中去，在模块类的load方法中注册，要检查是否会影响启动速度）

## 第二种：注册成功后，通过runtime统一处理跳转
```
[MGJRouter registerURLPattern:@"test://push/:controller" toHandler:^(NSDictionary *routerParameters) {
        UIViewController *currentVc = [self currentViewController];
        UIViewController *v = [[NSClassFromString(parameters[@"controller"]) alloc] init];
        // 通过runtime设置参数
        [self paramToVc:v param:parameters];
        [currentVc.navigationController pushViewController:v animated:YES];
        return YES;
    }];
```

### 优点
* 注册的时候很简单，统一在一个地方注册几种类型（push， present， xib， storyboard）就可以了。
* 跳转也是统一处理，不用再写更多的代码。模块自己都不用注册。

### 缺点
* 不能一个url对应到一个vc（缺点？）
* 不能做参数检查
* 打开路由的时候，要在url里面带上vc的名字，给中间件反射用，如果修改了类名，调用的地方就得改。
* 不能取消注册
* 不好跟其它平台做统一。如：web网页要打开一个原生页面，如果要iOS跟Android用同一个url的话，他们都得用我们的类名。耦合太大。

## 第三种：URL跟ViewController一一对应，同时统一处理跳转。
注册的时候保存好路由跟类名字符串的一一对应关系，openURL的时候通过url找到对应的类名，通过runtime生成实例，进行跳转。

保存一个如下这样的routes关系：
```
@{
        @"http" : @"YTWebViewController",
        @"https" : @"YTWebViewController",
        JXSG_SCHEME: @{
            PATH_SEARCH_RESULT : @"SearchResultViewController",
            PATH_CATEGORY : @"CategoryViewController",
	},
}
```
里面的viewController的类名对应的键是路由的path。如下：
```
myscheme://baidu.com/mall/category
```
这个路由对应的routes关系是 : @"/mall/category" : @"CategoryViewController"
调用的时候像这样：
```
[YTRouter pushURL:@"myscheme://xxx.com/xxx/xxx?p1=v1&p2=v2];
```
这里p1,p2的参数名称要跟view controller里面的参数名称一致，这样才能用runtime把参数设置到view controller里面去。

# 方案选择
我们最后选择了第三种方案，实际集成的时候还是有好多其它的问题。这里列举一些：
* 结果回传：有些viewController打开后，要给上个vc返回一个值，如：地址选择页面等。解决方法是，用runtime统一给viewController添加一个block，pushURL的时候可以传进去。赋值给push出来的viewController，实现回传。
* 参数检查：我们项目中有这样的情况，后台配置一个url到首页的banner上（也有可能是推送），点击时，通过url调起本地的直播页面。这个页面如果参数有误的话还不能进去。要对参数进行检查。解决方法是，给Router添加一个拦截器接口。pushURL的时候可以传一个拦截器，拦截器里面就一个方法。
    ```
    // 实现检查参数的方法，返回NO则不进行跳转
    - (BOOL)checkParams:(NSDictionary *)params urlString:(NSString *)urlString;
    ```

* 登录验证：有很多的页面是需要登录以后才能打开的。用url后因为跳转是统一处理，所以AOP跳转过程，实现跳转前的登录验证，我们目前有两个项目，所以这个项目相关的功能不能写到路由里面去，最后也是通过拦截器的形式解决的。考虑到每个项目都会有这个需要，但是具体的实现又不相同。所以在Router里面添加了一个默认的登录验证拦截器，在Router初始化的时候传进去。

    XXRouter.h
    ```
    // 登录验证拦截器
    @property (nonatomic, strong) id <XXRouterInterceptorProtocol> loginInterceptor;
    ```
    拦截器实现
    ```

    //  Created by brant on 2017/8/3.
    //  Copyright © 2017年 Brant. All rights reserved.
    //

    #import "YTCheckLoginInterceptor.h"
    #import "User.h"
    #import "XXRouterConfig.h"

    @interface XXCheckLoginInterceptor ()

    @end

    @implementation YTCheckLoginInterceptor

    - (BOOL)checkParams:(NSDictionary *)params urlString:(NSString *)urlString {
        if ([User instanceUser].userId) {
            return YES;
        }
        else {

            // 未登录，判断这个路由是否要登录
            NSURL *url = [NSURL URLWithString:urlString];
            for (NSString *path in [XXRouterConfig needLoginPath]) {
                if ([url.path isEqualToString:path]) {
                    // 需要登录
                   // 执行登录操作,同时返回no，不对路由做后续处理
                    return NO;
                }
            }

        }

        return YES;
    }

    @end

    ```
    ```
    // 设置登录检查拦截器
    [XXRouter shareInstance].loginInterceptor = [XXCheckLoginInterceptor new];
    ```
* 运营配的webUrl跟本地路由的统一：因为我们的App是电商app，所以主页面的跳转基本上都是动态配置的，而且运营配的就是一个web端的url，像这样：
  ```
  // 要跳转商品详情
  http://m.xx.com/product/234.html
  ```
  而我们本地的URL是这样的：
  ```
  xxscheme://xx.com/goodsDetail?id=234
  ```
  运营配的URL千奇百怪，有时候版本上线了，发现某个url没有拦截到。坑好深。最后参考天猫团队的解决   方案，做了一个URLRewrite模块，针对新加的url只要配规则就可以了，规则从服务器读取。结果是，运营现在突然加一个url要跳转到指定的本地页面，在后台配一条新的解析规则就可以了。这个后面写一篇文章专门介绍一下这个模块。

# 辅助方法
runtime给view controller设置参数
```
-(void)setViewController:(UIViewController *) v parameters:(NSDictionary<NSString *,NSString *> *)parameters {

    unsigned int propertiesCount = 0;
    objc_property_t * properties = class_copyPropertyList(v.class , & propertiesCount);
    for (int i = 0; i < propertiesCount; i++) {

        objc_property_t property = properties[i];
        NSString *key = [NSString stringWithUTF8String:property_getName(property)];
        NSString *param = parameters[key];
        if (param != nil) {
            [v setValue:param forKey:key];
        }
    }
}
```

# 路由方案引申出的架构需求：组件化
纯粹的使用URL来做跳转，意义并不大。免去了查找view controller的过程，却引入了查找URL的过程，URL不被支持后还得清理。而且调用的参数也没有直接调用来得直观、明确。参数也不好以对象的形式传递。

路由的主要作用应该是解耦，但是如果不组件化，还是会存在各种各样的耦合。耦合太多的话，会增加测试的难度。组件间通讯解耦就不局限于路由了，可以面向接口编程，通过接口来对外暴露模块支持的功能。
