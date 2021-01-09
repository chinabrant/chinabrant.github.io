---
title: RxSwift中的Subject（PublishSubject/BehaviorSubject/ReplaySubject/Variable）
date: 2017-10-18 16:45:38
tags:
---
RxSwift中有四种类型的Subject：

* PublishSubject： 只会发送新的事件给订阅者，订阅之前的事件不会发送。
* BehaviorSubject：有一个初始值，重复发送或者是发送最新的事件给订阅者。
* ReplaySubject：可以指定一个buffer size，它会通过这个buffer 来缓存最近发送的事件，通过buffer size的大小就是缓存事件的个数。当有新的订阅者是，它会把缓存的事件发送给新的订阅者。
* Variable：相当于一个BehaviorSubject的封装，它会保存当前值做为自身的一个状态，发送当前的状态给新的订阅者。

# 一、PublishSubject
## 功能解析
PublishSubject 即是一个被观察者（Observable）也是一个观察者 （Observer）

![](http://wx1.sinaimg.cn/mw690/acbce940gy1ficewiii5dj20g207it9o.jpg)

看上面的Marble diagram图：
第一条线是一个PublishSubject，第二、第三条是订阅者，向上的箭头表示订阅者订阅Subject，向下的箭头表示Subject发送事件。
第一个订阅者在1事件发送后才订阅，所以它不会收到1事件，它会收到2.3事件。第二个订阅者在2事件发送出来后才订阅，所以它只会收到3事件。

**PublishSubject 的next事件只会发送给当前已经订阅这个subject的订阅者，新的订阅者不会收到订阅之前发送的事件。**

Subject终止之后，再去订阅，会给后面的订阅者发送它的终止事件。所有的subject都是如此。

## 示例代码
```
example("PublishSubject") {
    let subject = PublishSubject<String>()

    subject.onNext("1")

    let subscriptionOne = subject.subscribe(onNext: { (element) in
        print("订阅者一：" + element)
    })

    subject.on(.next("2"))

    let subscriptionTwo = subject.subscribe(onNext: { (element) in
        print("订阅者二：" + element)
    })

    subject.onNext("3")
}
```

输出：
```
--- PublishSubject example ---
订阅者一：2
订阅者一：3
订阅者二：3
```

# 二、BehaviorSubject
## 功能解析
![](http://wx2.sinaimg.cn/mw690/acbce940gy1ficewlna97j20gg06vgmv.jpg)
BehaviorSubject跟PublishSubject相似，只是它会发送最近的一个next事件给新的订阅者。如上面的Marble diagram：
第一条线是一个BehaviorSubject，第二、第三条是订阅者，向上的箭头表示订阅者订阅Subject，向下的箭头表示Subject发送事件。
第一个订阅者在事件1后订阅subject，它会立马收到最近的一个next事件，也就是1.之后的事件正常接收。
第二个订阅者在事件2后订阅subject，它会立马收到最近的一个next事件，也就是2.之后的事件正常接收。

## 示例
```
enum MyError: Error {
    case anError
}

func print<T: CustomStringConvertible>(label: String, event: Event<T>) {
    print(label, event.element ?? event.error ?? event)
}

example("BehaviorSubject") {
    let subject = BehaviorSubject(value: "1")

    let disposeBag = DisposeBag()

    subject.subscribe({ (event) in

        print(label: "订阅者一：", event: event)
    })
    .disposed(by: disposeBag)

    subject.onNext("2")

    subject.onError(MyError.anError)

    subject.subscribe({ (event) in
        print(label: "订阅者二：", event: event)
    })
    .disposed(by: disposeBag)
}
```
输出：
```
--- BehaviorSubject example ---
订阅者一： 1
订阅者一： 2
订阅者一： anError
订阅者二： anError
```

# 三、ReplaySubject
## 功能解析
Replay subjects 可以指定一个buffer size，它会通过这个buffer 来缓存最近发送的事件，通过buffer size的大小就是缓存事件的个数。当有新的订阅者是，它会把缓存的事件发送给新的订阅者。
![](http://wx4.sinaimg.cn/mw690/acbce940gy1ficewofupkj20fb06tmyj.jpg)
上面的Marble diagram：
第一条线是一个buffer size为2的ReplaySubject，它会缓存最近的两个事件，第二、第三条是订阅者，向上的箭头表示订阅者订阅Subject，向下的箭头表示Subject发送事件。
第一个订阅者在一开始就订阅了，所以它可以收到，1、2、3事件
第二个订阅者在事件2后面才订阅，因为ReplaySubject的buffer size为2，所以第二个订阅者会立马收到缓存的1、2事件。3事件正常接收。

## 需要注意的点
ReplaySubject的缓存是缓存在内存里面的，所以，如果ReplaySubject发送的是图片，就不能将buffer size设置的太大，很容易造成内存压力。发送的是数组也一样。所以这里一定要注意内容压力，看类型，不能将buffer size设置过大。

## 示例
```
example("ReplaySubject") {
    let subject = ReplaySubject<String>.create(bufferSize: 2)
    let disposeBag = DisposeBag()

    subject.onNext("1")
    subject.onNext("2")
    subject.onNext("3")

    subject.subscribe({ (event) in
        print(label: "订阅者一：", event: event)
    })
    .disposed(by: disposeBag)
}
```
输出：
```
--- ReplaySubject example ---
订阅者一： 2
订阅者一： 3
```
# 四、Variable
## 功能解析

Variable要指定一个初始值,它会保存当前值做为自身的一个状态，并发送它的初始值或者最新值给新的订阅者。 可以通过它的value属性来读取到它的最新值。
不能给它发送完成或者错误事件，它会在释放的时候自动完成。

## 示例
```
example("Variable") {
    var variable = Variable("1")
    let disposeBag = DisposeBag()

    variable.asObservable().subscribe({ (event) in
        print(label: "订阅者一：", event: event)
    })
    .disposed(by: disposeBag)

    variable.value = "2"
}
```
