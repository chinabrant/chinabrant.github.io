---
title: 我是这样封装view的
date: 2017-07-04 18:18:16
tags:
---

# 前言
一个有经验的开发，碰到一些特殊的UI控件，脑海中应该是有好几种实现方案的，同时也能记起一些第三方相似的开源控件。为了应对产品的需求变更，UI效果的变更，以及做到代码的可控性，所以在开发中，一般的UI效果我都喜欢自己动手去实现。而不是为了赶时间，或者什么的去用一些第三方的开源库。当然是除了一些非常通用的东西，像HUD, 下拉刷新这样，已经有非常好的实现，而且很容易做定制的。

# 示例
下面就以一个实际需求说一下自己封装UI的一点点经验：

先来看一下需求，直接上UI效果：
![](http://wx4.sinaimg.cn/mw690/acbce940gy1fh7ye51opnj20bi0bdwer.jpg)

## 产品需求：
1. 点击宝贝分类后弹出一个悬浮菜单
2. 菜单的内容可能有多个，所以可能存在要上下滑动显示
3. 点击菜单外面要隐藏菜单，不做其它的操作

## 放到整个项目中做通用控件考虑可定制项：
1. 菜单是否要高亮上次选中过的菜单项
2. 菜单项样式可能不同
3. 菜单显示的位置
4. 菜单上箭头显示的位置
5. 菜单内边距
6. 菜单边线颜色
7. 菜单项的文字颜色，字体大小
8. ...

通过上面的分析可以看到，要做一个极通用的控件，还是要考虑非常多的可定制点的。接触这个项目还不久，知道项目中是有一个类似的控件的，于是翻出来看了一下代码。可定制度很低。而且现在只有黑色的背景，颜色，菜单项高度的定制属性都没有，对项目不完全的熟悉，不能动通用控件，以防引起其它地方的bug。github上也看到过很多类似的控件。但是要完全按设计给到的UI效果来完成，还是要做很多的定制工作。所以还是决定自己写过。

## 实现
看UI效果，其实很简单的一个悬浮框显示到一个view上，以我写这种弹窗的经验，用一个透明背景的view做为整个控件的根view，加到要添加到的view上，里面的菜单做一个view,添加到透明view上。其它的就细节处理。

像上面这个view，层次是这样的，透明view 里面放 menu view ，menu view 里面放一个tableview 显示菜单项。箭头跟menu view同级，因为menu view 用了layer圆角，边框。箭头也可以考虑用layer画。更好定制。最后显示的时候将透明view加到self.navigationController.view上。
```
JXMenu *menu = [JXMenu showInView:self.navigationController.view point:CGPointMake(self.view.width / 4.0 - 50, self.view.height - 60 + 64) isTop:NO width:100 menuItems:self.viewModel.categoryArray];
            menu.action = ^(id data, NSInteger index) {
                
                ShopGoodsCategory *model = data;
                if (self.viewModel.currentCategory && [self.viewModel.currentCategory.id isEqualToString:model.id]) {
                    // 如果点击的是相同的分类，就不再请求
                    return;
                }
                
                // 传过来的就是点击到的分类，不用再用索引拿数据 
                self.viewModel.currentCategory = model;
                [self.collectionView.mj_header beginRefreshing];
            };
```
```
+ (JXMenu *)showInView:(UIView *)view point:(CGPoint)point isTop:(BOOL)isTop width:(CGFloat)width menuItems:(NSArray *)items {
    
    JXMenu *menu = [[JXMenu alloc] initWithFrame:view.bounds];
    
    menu.leftPoint = point;
    menu.attachView = view;
    menu.menuWidth = width;
    menu.menuItems = items;
    
    // 一定要赋值完成后再setupViews
    [menu setupViews];
    
    [view addSubview:menu];
    
    // 显示动画
    [menu showAnimation];
    
    return menu;
}
```

关于这个显示方法，还有很多要改进的地方。先完成产品需求，设计上考虑一些大的改进点。到后面有相关需求或者时间够的时候可以进行改进。
```
/**
 显示一个菜单到指定的view上
 
 isTop这个属性其实是可以算出来的，没做这个处理。待改进。
 
 事件也可以通过这个显示方法传进来，参数太多了，待改进。

 @param view 要添加到view
 @param point 左侧的一个顶点,通过/isTop/来判断是左上角还是左下角
 @param isTop 是不是左上角
 @param width 菜单的整体宽度
 @param items 这个array 里面的单个数据可以是对象，要实现 /JXMenuCellDataProtocol/
 */
+ (JXMenu *)showInView:(UIView *)view point:(CGPoint)point isTop:(BOOL)isTop width:(CGFloat)width menuItems:(NSArray *)items;
```
## 说一下传入的菜单项及点击事件
传入的显示项是不确定的，可能是一个商品的分类，也可能是几个操作项。但是写好的view是确定的，就是说view要显示的数据是确定的。在这个例子中，要显示的内容就是一个title，但是数据是从接口拿回来的，拿回来后model化成了一个对应的ShopGoodsCategory 类型的model 数组。不确定数据来源，数据形式的时候，应该用接口来跟源数据进行对接，所以这里我定义了一个用于view显示的数据接口。让传进来的model去实现接口，就可以直接传model数组了。这样做的好处是，在点击了菜单项后，view可以直接返回点击的数据， 而不是一个唯一标识或者一个索引什么的。

接口定义
```
#import <Foundation/Foundation.h>

// 菜单的数据接口
@protocol JXMenuCellDataProtocol <NSObject>

@property (nonatomic, copy, readonly) NSString *jxmenu_title;    // 要显示的菜单项的标题

@end
```
传入的model实现接口
```
#import <Foundation/Foundation.h>
#import "JXMenuCellDataProtocol.h"

@interface ShopGoodsCategory : NSObject <JXMenuCellDataProtocol>

@property (nonatomic, copy) NSString *id;   // 分类id

@property (nonatomic, copy) NSString *itemName; // 分类名称

@end


// 下面是m文件实现
#import "ShopGoodsCategory.h"

@implementation ShopGoodsCategory

- (NSString *)jxmenu_title {
    return self.itemName;
}

@end
```

## 点击事件回传
点击菜单项后，可以用代理或者block的方式将数据返回给调用者，我一般使用block。

定义一个传递事件的block，把显示view的时候传进来的数据中的指定项传回去， 看情况再传view本身以及索引等。
```
typedef void(^JXMenuAction) (id data, NSInteger index);
```

## 添加简单的显示动画
```
#pragma mark - private

- (void)showAnimation {
    self.alpha = 0;
    [UIView animateWithDuration:0.3 animations:^{
       
        self.alpha = 1;
    } completion:^(BOOL finished) {
        
    }];
}
```
# 关于扩展
要定制菜单项的话，可以把cell for row方法通过代理开放出来。
如果要定制padding,字体，颜色等，可以定义一个配置类出来。不要做成单例。

JXMenu的代码可以在github上找到：[JXMenu](https://github.com/chinabrant/JXMenu)
pod 并不能用，只是把代码从项目中搬出来了，没有做pod支持。需要Masonry 和UIView的positioning分类支持。
