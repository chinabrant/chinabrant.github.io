---
title: URL拦截转换成本地路由模块
date: 2017-08-07 11:12:07
tags:
---

# 需求场景
1. 做过电商App的可能都遇到过这样的需求，在商场首页，各种各样动态的跳转，跳转商品详情、秒杀列表、品牌列表、搜索结果、分类结果页面等等等等。同一个位置，可能今天跳这个商品，明天跳转那个商品，运营配的就是一个web端的URL。
2. 拦截webView里面的URL。

# 需求分析
1. 拦截各种各样的URL，跳转到指定的原生页面。
2. URL的种类可能会一直增加。
3. 指定位置即某个button点击后的URL也不是固定的，可以动态配置。

# 以前的解决方案
接手项目前，已经有这个功能，之前也没有引入路由。这一块的做法是：对url进行path匹配或者字符串匹配，成功后再做特殊的操作。所以经常出现这个url没拦截，那个url跳错了这样的bug。每添加新的URL拦截都得修改代码，发版。

# 新的解决方案
在客户端引入路由后，我们需要的应该是下面这样一个URLRewrite模块，将输入的各种各样的URL转化为本地可以设别的路由URL。
![](http://wx2.sinaimg.cn/mw690/acbce940gy1fiazdeba2wj20jf02dmx5.jpg)
做法是效仿天猫的Rewrite系统。天猫团队文章看这里：[解耦神器---统跳协议和Rewrite引擎](http://pingguohe.net/2015/11/24/Navigator-and-Rewrite.html)

# 原理
> Rewrite引擎的原理非常简单，模拟Web容器（Apache/Nginx等）的Rewrite配置，根据配置把传入的原始URL进行重写，返回重写后的目标URL，交给统跳协议处理。
配置是通过正则表达式描述的Rewrite规则列表，这份列表通过后台接口实现动态更新。

关键点：URL是动态的，跳转的页面也是动态的，所以，URLRewrite中应该也有一个动态的东西来对应这个两个动态的变化。那就是Rewrite的规则。规则可以由接口动态更新，所以可以做到不发版本添加新的URL解析，新的页面跳转。

# 具体实现
后面会有具体的例子解析，先看一下代码实现。

规则的组成：规则有三个字段组成

* pattern 用来匹配原始URL的正则表达式串。
* targetUrl 转换后的目标串。
* flag 标记位，做一些特殊处理。

匹配过程：原始URL通过规则匹配，找到URL中的参数，将targetUrl字段里面的参数占位符替换成url中找到的参数。完成重写。

```
//
//  RewriteRule.h
//  YTURLRewrite
//
//  Created by brant on 2017/8/3.
//  Copyright © 2017年 瘦不拉机. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RewriteRule : NSObject

// 用来匹配的原始URL的正则串
@property (nonatomic, copy) NSString *pattern;

// 转换后的目标串 参数占位用 $0, $1 这样
// 这里是一个标准的本地路由
@property (nonatomic, copy) NSString *targetUrl;

// 标记位
// 值一：k： 保留原url，不做重写
@property (nonatomic, copy) NSString *flag;

// 返回重写后的url
- (NSString *)targetUrlWithParams:(NSArray *)params url:(NSString *)url;

@end
```
**原始URL解析**
```
/**
 *  正则匹配返回符合要求的字符串及参数数组
 *
 *  @param string   需要匹配的字符串
 *  @param regexStr 正则表达式
 *
 *  @return 符合要求的字符串及参数数组
 */
+ (NSArray *)matchString:(NSString *)string toRegexString:(NSString *)regexStr {

    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:regexStr options:NSRegularExpressionCaseInsensitive error:nil];

    NSArray * matches = [regex matchesInString:string options:0 range:NSMakeRange(0, [string length])];

    NSMutableArray *array = [NSMutableArray array];

    for (NSTextCheckingResult *match in matches) {

        for (int i = 0; i < [match numberOfRanges]; i++) {
            //以正则中的(),划分成不同的匹配部分
            NSString *component = [string substringWithRange:[match rangeAtIndex:i]];

            [array addObject:component];

        }

    }

    return array;
}
```

**匹配过程** app启动时，更新服务器规则赋值给 `self.rules` ，没有就读取本地规则。使用时，调用rewriteUrl方法返回重写后的URL。
```
/**
 重写url

 @param url 要重写的url
 @return 返回重写后的url
 */
- (NSString *)rewriteUrl:(NSString *)url {

    for (RewriteRule *rule in self.rules) {
        NSArray *array = [YTURLRewrite matchString:url toRegexString:rule.pattern];
        if (array.count > 0) {
            // 匹配到了
            return [rule targetUrlWithParams:array url:url];
        }
    }

    return url;
}
```
# 具体例子
原始URL： http://test.com/product/2345.html   这是运营配置的一个商品详情的URL
`self.rules` 里面会有一条这样的规则与之对应：
```
pattern:
^(?:https?:)\\/\\/test.(com|test)\\/product\\/([0-9]*).html$

targetUrl:
myappScheme://host.mobile/goodsDetail?goodsId=$2

flat:
空
```
原始URL经过 `[YTURLRewrite matchString:url toRegexString:rule.pattern]` 方法后,匹配到上面这条规则，返回的NSArray是这样的：
array[0] : 是匹配到的字符串，即：http://test.com/product/2345.html
array[1]: 是后面用小括号括起来的参数 com
array[2]: 也是小括号括起来的参数 2345
`targetUrlWithParams` 方法会返回targetUrl字符串，$2这种参数占位符会被解析出来的参数替换掉。
```
- (NSString *)targetUrlWithParams:(NSArray *)params url:(NSString *)url {

    if ([self.flag isEqualToString:@"a"]) {
        // 添加
        return [NSString stringWithFormat:@"%@%@", url, self.targetUrl];
    }
    else if ([self.flag isEqualToString:@"k"]) {
        // 保留原url
        return url;
    }

    NSString *target = self.targetUrl;

    // 将参数替换成从url中解析出来的参数
    for (int i = 1; i < params.count; i++) {
        target = [target stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"$%d", i] withString:params[i]];
    }

    return target;
}
```
所以最后Rewrite出来的URL是这样的：`myappScheme://host.mobile/goodsDetail?goodsId=2345 `这是我们本地支持的路由，可以直接这样处理： `[YTRouter openUrl:myappScheme://host.mobile/goodsDetail?goodsId=2345]; ` 跳转到商品详情页面。

**可以看到，这个URLRewrite引擎是只依赖规则的，所以要添加新的url，新的跳转，只要后台更新规则就可以了。**
