---
title: UITableView和UICollectionView多种类型cell处理，更好地组织代码
date: 2017-07-10 14:51:07
tags:
---

# 问题点介绍
开发不仅仅是完成功能，还要写出认后来人可以很容易上手维护的代码。今天就记录一下列表数据，多种类型cell时，如何更好的组织代码。从实际需求场景出发，先看一下UI效果图。
![](http://wx1.sinaimg.cn/mw690/acbce940gy1fhbd2o1zvpj20ak0p214t.jpg)

刚开始做开发的人，碰到table view什么的，很容易写出下面这样的代码：
```
if (indexPath.section == 0) {
  if (indexPath.row == 0) {

  }
  else if (indexPath.row == 1) {

  }
}
else if (indexPath.section == 2) {

}
```
各种各样的魔法数字。刚写的那会还好，还知道是什么意思，能很快的找到要修改的地方。过了一两个月，再有需求修改的话，写的人自己都要读好久的代码，还容易出错。如果让别人接手，那就有点痛苦了。

举个栗子：我看过一个商品详情页面的代码，一个cellForRow方法里面有650行代码。cellForRow方法里面做了各种各样的事情，最主要的是清一色的上面这样的if else。

# 先从大的方面列几点建议：
1. 目前一直用MVVM的模式开发，所以数据请求，加工处理应该放在ViewModel里面。
2. cellForRow方法，应该只是做为Data跟View的一个接口处，不应该放各种设置代码，处理代码。相应的代码应该放到cell里面去处理。
3. 不要用0，1这样的魔法数字。今天主要讲这点。

# 用魔法数字的缺点
* 无意义，0、1这样的数字只能表示位置。没有其它的信息。
* 容易出错，在cell代理方法，高度代理方法，点击代理方法里面要保持一致，容易出错。
* 不方便修改，如果要修改两个cell的顺序，要修改好几个地方。

下面说一下解决方法，并不是什么高深的东西，有一定开发经验的人应该都懂。对于一个tableview，位置数字肯定是有的，我们要消除数字，那就得找到相应的数据来代替它。这里，主要的场景一般都是一个row对应一种类型的cell，所以类型是固定的，所以我们用一个枚举来定义所有类型的cell。

```
typedef NS_ENUM(NSInteger, HomeCellType) {
    HomeCellTypeTopFunction = 0,
    HomeCellTypeToutiao,
    HomeCellTypeToday,
    HomeCellTypeSeckill,
    HomeCellTypeActivity,    
    HomeCellTypeSpecialTopic,    
};
```
上面是我从项目里直接复制出来的，请忽略名字（取名真是一个痛苦的事【抱头】）。列表的数据一般都是放在一个Array里面，还是以我上面的例子来说明，我有6种类型的model，有些model可能有多个，像上面枚举里面最后那个类型的model就可能有多个。从服务器拉回数据后，我就在vm里面解析好，全放到一个array里面了，就是列表的数据源。下面是我的cellForRow方法：
```
id model = self.viewModel.dataArray[indexPath.row];
        switch ([self getHomeCellType:model]) {
            case HomeCellTypeTopFunction: {
                TopFunctionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[TopFunctionCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            case HomeCellTypeToutiao: {
                IndexToutiaoCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[IndexToutiaoCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            case HomeCellTypeToday: {
                IndexTodayCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[IndexTodayCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            case HomeCellTypeActivity: {
                IndexActivityCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[IndexActivityCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            case HomeCellTypeSeckill: {
                SeckillCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[SeckillCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            case HomeCellTypeSpecialTopic: {
                IndexSpecialTopicCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[IndexSpecialTopicCell cellIdentifier] forIndexPath:indexPath];

                cell.viewModel = model;

                return cell;
                break;
            }

            default:
                break;
        }
```
这样的cellForRow方法是不是很简洁。里面的getHomeCellType方法是通过dataArray里面model的类型，拿到对应的cell类型。方法如下：
```
- (HomeCellType)getHomeCellType:(id)model {
    HomeCellType type = HomeCellTypeTopFunction;
    if ([model isKindOfClass:[IndexToutiaoCellViewModel class]]) {
        type = HomeCellTypeToutiao;
    }
    else if ([model isKindOfClass:[SeckillCellViewModel class]]) {
        type = HomeCellTypeSeckill;
    }
    else if ([model isKindOfClass:[IndexTodayCellViewModel class]]) {
        type = HomeCellTypeToday;
    }
    else if ([model isKindOfClass:[IndexActivityCellViewModel class]]) {
        type = HomeCellTypeActivity;
    }
    else if ([model isKindOfClass:[IndexSpecialTopicCellViewModel class]]) {
        type = HomeCellTypeSpecialTopic;
    }

    return type;
}
```

不是公共代码我们一般不加项目前缀，有点多余的感觉。

# 优点
* 看到枚举的名字一般就知道这个cell对应到view上的哪个。清晰、易理解。
* 要修改cell的顺序只要修改dataArray里面的顺序就可以。不用改动其它的代码。
* 其它的代理方法也是这个写法，隐藏、添加cell、改动顺序什么的都不需要改动。
* 易于维护，就算一个新人接手这样的代码，加上一定量的注释，可以很快的熟悉并上手修改。

# 一些其它的方式
* cell的type也可以放到model里面去。
* 如果有多个section的话，还可以定义一个section的枚举，再定义每个section对应的row的枚举。
