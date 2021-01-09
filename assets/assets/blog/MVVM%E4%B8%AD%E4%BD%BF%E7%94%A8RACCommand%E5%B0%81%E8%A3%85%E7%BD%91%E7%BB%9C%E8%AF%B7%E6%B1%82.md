---
title: MVVM中使用RACCommand封装网络请求
date: 2017-08-23 16:34:16
tags:
---
今天要说的是RACCommnad在MVVM项目中的实际应用

# 场景
ViewModel里面有一个网络请求，在开始请求的时候要在页面上显示加载状态（转圈圈），结束请求的时候隐藏加载状态。

# 以前的解决方案
刚接触ReactiveCocoa时，对RACCommand等特性没有深入了解，用过一些不RAC的做法。因为不能在view model里面引入UIKit相关的东西。所以试过下面两种做法：
* 声明一个block在Controller和View Model间作回调。
* 了解了RACSubject后，声明一个RACSubject在Controller和View Model间传递数据，状态。

# RACCommand方案
实例演示：有一个接口从服务端读取团队列表，开始读取的时候显示加载状态。读取完成后更新页面。

1. 在ViewModel中将接口声明成一个RACCommand
```
@property (nonatomic, strong) RACCommand *fetchTeamListCommand;
```
```
// 读取我的团队列表
- (RACCommand *)fetchTeamListCommand {
    if (!_fetchTeamListCommand) {
        _fetchTeamListCommand = [[RACCommand alloc] initWithSignalBlock:^RACSignal *(id input) {

            return [RACSignal createSignal:^RACDisposable *(id<RACSubscriber> subscriber) {

                [TeamApi fetchTeamListWithResult:^(BOOL isSuccess, id data, NSError *error) {

                    if (isSuccess) {
                        self.teamList = [TeamModel mj_objectArrayWithKeyValuesArray:data];

                        [subscriber sendNext:self.teamList];
                    }
                    else {
                        [subscriber sendNext:@(NO)];
                    }
                    // 一定要记得发送完成消息，不然不能再次执行
                    [subscriber sendCompleted];
                }];

                return nil;
            }];
        }];
    }

    return _fetchTeamListCommand;
}
```

2. 在Controller中订阅信号
```
[[self.viewModel.fetchTeamListCommand executionSignals] subscribeNext:^(id x) {
        // 这里的x是一个RACSignal，即执行Command时返回的那个Signal，所以x也是可以订阅的。收到这个信号，说明网络请求开始。
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        // 这里收到信号是开始发送网络请求
        [x subscribeNext:^(id x) {
            // 这里收到信号是网络请求返回
            [MBProgressHUD hideHUDForView:self.view animated:YES];

            // do something            
        }];

    }];
```
在要读取的地方执行command
```
// 执行请求
    [self.viewModel.fetchTeamListCommand execute:nil];
```
如果不用在发送网络请求前做什么事，也可以这样订阅：
```
[[[self.viewModel.fetchTeamListCommand executionSignals] switchToLatest] subscribeNext:^(id x) {

    }];
```

# 注意的点
* 在Command返回的Signal里面一定要记得发送Completed信号，不能这个Command的不能重复执行。
* 上面的订阅方式只要订阅一次，每次执行Command都会接收到。还有一种在execute方法后面直接订阅的方式。那样每次execute都得订阅。个人更喜欢上面这种订阅方式。

# 最后
这只是一个简单的RACCommand的用法，它会让你的代码更多的优雅。
> 我会不时的写一些iOS开发中的技术点。或者一些个人认为比较优雅的写法，解决方案。如果喜欢就点个关注吧，一起交流。
QQ群：**97039265**
