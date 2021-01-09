---
title: 浅淡iOS列表数据管理
date: 2016-10-04 23:08:24
tags:
---

# 前言
 
* 在移动端的开发中，肯定免不了列表数据的展示。这里是我个人iOS开发中经历过的一些列表数据管理。是给`viewController`瘦身过程中的一些收获，不考虑设计模式。如果您有更好的管理方式，希望能交流。谢谢。

# 最初：刚开始开发的时候

* 刚开始做开发的时候，在`ViewController`中声明一个`NSMutableArray` 和 `currentPage` 所有的数据和页面管理都放在 `ViewController` 里面，使得数据杂乱，不好维护，无法重用。
> 
@property (nonatomic, copy) NSMutableArray *list;
@property (nonatomic) NSInteger currentPage;

# 进一步：开发一定的时间后


* 开发一段时间后，知道要把数据单独管理，给`ViewController`瘦身，同时提高数据的可重用性。这个时期会声明一个`DataList`来管理数据，把数据解析，页码的管理都单独到一个数据类中去。

* `DataList`做为基类，具体的数据继承`DataList`产生相对应的子类，例如有一个用户列表，则对应的有一个`UserList`继承自`DataList`。下面是`DataList`的实现.

> DataList.h

```
//
//  DataList.h
//  PageControlDemo
//
//  Created by brant on 2016/12/6.
//  Copyright © 2016年 wushujun. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DataList : NSObject

@property (nonatomic) NSInteger currentPage;            // 当前页码
@property (nonatomic, strong) NSMutableArray *list;     // 数据list
@property (nonatomic) BOOL haveMore;                    // 是否有下一页
@property (nonatomic) BOOL isRefresh;                   // 是否是刷新数据，如果是刷新数据，则把当前数据清空

/**
 从网络返回的数据中解析数据成model保存到list中
 
 子类要重写这个方法来解析数据,父类这里做页码的管理
 
 @param array 要解析的数据
 */
- (void)loadDataFromArray:(NSArray *)array;

/**
 读取一条数据

 @param index 数据的位置
 @return 返回读取到的数据，不存在返回nil
 */
- (id)objectAtIndex:(NSInteger)index;

/**
 向数组中添加一条数据

 @param object 要添加的数据
 */
- (void)addObject:(id)object;

/**
 移除所有的数据
 */
- (void)removeAll;

@end
```

> DataList.m

```
//
//  DataList.m
//  PageControlDemo
//
//  Created by brant on 2016/12/6.
//  Copyright © 2016年 wushujun. All rights reserved.
//

#import "DataList.h"

@implementation DataList

/**
 从网络返回的数据中解析数据成model保存到list中
 
 子类要重写这个方法来解析数据,父类这里做页码的管理

 @param array 要解析的数据
 */
- (void)loadDataFromArray:(NSArray *)array {
    
    _currentPage++;
    
    // 如果是刷新，要清空数据，重置页码
    if (_isRefresh) {
        [self removeAll];
        self.currentPage = 0; // 这里看后台配置，也可能是1
    }
    
    if (array == nil || array.count <= 0) {
        _haveMore = NO;
        return;
    }
}

- (id)objectAtIndex:(NSInteger)index {
    if (self.list.count > index) {
        return self.list[index];
    }
    
    return nil;
}

- (void)addObject:(id)object {
    [self.list addObject:object];
}

- (void)removeAll {
    if (_list) {
        [_list removeAllObjects];
    }
}

# pragma mark - getters

- (NSMutableArray *)list {
    if (!_list) {
        _list = [[NSMutableArray alloc] init];
    }
    
    return _list;
}

@end
```

> UserList.m 只要重写Load数据的方法

```
//
//  UserList.m
//  PageControlDemo
//
//  Created by sjwu on 2016/12/6.
//  Copyright © 2016年 wushujun. All rights reserved.
//

#import "UserList.h"
#import "User.h"

@implementation UserList

- (void)loadDataFromArray:(NSArray *)array {
    [super loadDataFromArray:array];
    
    // 这里做array的解析
    if (array.count > 0) {
        for (NSDictionary *dic in array) {
            User *user = [User new];
            // 这里做单个user的解析
            [user loadDataFromDictionary:dic];
            [self.list addObject:user];
        }
    }
}

@end
```

# 再后来...

* 再后来，各路大神写出了各种`字典`转`model`，`model`转`字典`的库，手动解析`model`就没有再做过了，从最开始的`JSONModel`到最近用的`YYModel`，这些库可以省去大部分的解析代码，判断代码。

* 开发中推荐`YYModel`，`JSONModel`在多线程写入时，没有做同步，会有crash的情况发生。

（2017.03.05 更新）
# MVVM模式，ViewModel管理page
* 最近项目中开始用RAC配合MVVM项目架构，page的管理放到viewModel中。个人感觉还是建一个对应的listl来管理更加好。(但是list是对model的进一步封装，会多出很多的代码量来)
