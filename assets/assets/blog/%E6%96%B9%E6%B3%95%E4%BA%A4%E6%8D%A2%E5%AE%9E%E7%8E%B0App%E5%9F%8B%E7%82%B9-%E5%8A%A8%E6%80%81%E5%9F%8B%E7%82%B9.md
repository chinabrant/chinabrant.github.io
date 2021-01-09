---
title: '方法交换实现App埋点,动态埋点'
date: 2017-09-14 16:41:09
tags:
---
对于一个移动App来说，统计用户的使用习惯已经是一个最基本的需求了。本文要讲的不是教你如何去实现一个统计模块，毕竟大部分的公司不会自己去开发一套统计系统。这里要讲的是如何方便优雅的集成第三方的统计系统，如:友盟等。

一般的埋点都是每个要统计的地方都加一句埋点代码，你刚毕业的时候这么写没有问题，但是如果你做了几年的软件开发，还这样写，那就是你的错了。这样分散的代码，不易于修改，不易于维护，还不易于测试。删除添加什么的，都很麻烦。

所以，做为一个有点经验的开发，我们应该要想有没有其它的方法来实现。一般的埋点就是在方法的开头或者结尾插入一句统计的代码。它不影响方法的运行。基于这样的要求。自然而然的就会想到，这是对方法进行AOP了。在iOS里面可以通过runtime来实现。也有一些很成熟的第三方库，像[Aspects](https://github.com/steipete/Aspects), 下面的例子就是通过Aspects将埋点代码进行统一。

Aspects 给NSObject类添加了一个分类来做AOP：
```
+ (id<AspectToken>)aspect_hookSelector:(SEL)selector
                      withOptions:(AspectOptions)options
                       usingBlock:(id)block
                            error:(NSError **)error;
```

假设我们有一个UserViewController，我们要统计它的打开次数，可以这样写：
```
[UserViewController aspect_hookSelector:@selector(viewWillAppear:) withOptions:AspectPositionAfter usingBlock:^(id<AspectInfo> aspectInfo, NSString *code) {
        // 这里写友盟的统计代码
    } error:nil];
```

上面这句代码是跟UserViewController的实例无关的，所以，我们可以把这句代码抽离到一个新的类中。
```
#import "UmengHelper.h"

@implementation UmengHelper

+ (void)statistics {
    [UserViewController aspect_hookSelector:@selector(viewWillAppear:) withOptions:AspectPositionAfter usingBlock:^(id<AspectInfo> aspectInfo) {
        // 这里写友盟的统计代码
    } error:nil];

    [UserViewController aspect_hookSelector:@selector(addFriend:) withOptions:AspectPositionAfter usingBlock:^(id<AspectInfo> aspectInfo) {
        // 这里写友盟的统计代码
    } error:nil];
}

@end
```
上面这样写，把所有要埋点的地方都写到同一个文件中了。但是有一个问题，这个新的类要引入所有用到的类。想一想这也是可以继续优化的。类名用字符串的形式保存，通过runtime得到对应的类。再调hook方法就解决了。

再进一步想一下，既然类名跟方法名都是一个字符串，那么这些字符串是不是可以保存到后台，通过接口下发。这样就实现了动态埋点。

但是产品经理是不会让我们这么舒服的，他肯定又会有这样的需求，『打开这个商品详情的时候要统计这个商品的名称』，Aspects也是支持参数传递的，通过那个usingBlock。

> 学了几年iOS，现在工作中偶尔写一点iOS相关的经验文章。Objective-C，Swift，RxSwift等。欢迎查看往期文章，喜欢的可以点个关注。
QQ群：**97039265**
