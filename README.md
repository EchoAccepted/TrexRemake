# T-Rex Game Remake

## 项目介绍

T-Rex是Chorem浏览器的一个小彩蛋，当你的chrome浏览器进入离线模式后，会出现这个小恐龙游戏，本项目是使用cocos creator引擎对其进行重制，引擎版本为v2.4.7。

## 实现思路

游戏玩法很简单，控制小恐龙跳跃以躲避仙人掌，存活时间越久分数越高。

因此有以下几个主要功能需要实现：

| 功能点                   | 实现思路                                                     |
| ------------------------ | ------------------------------------------------------------ |
| 游戏初始化               | 播放挂载在TRex节点上的Animation：Init，设置playStatus为false，lifeStatus为true |
| 云朵移动                 | 设立一个cloudSpeed，在update生命周期中调用，如果playStatus为true就移动--将该cloud节点的x-cloudSpeed，如果锚点（1，0.5）到达画布最左边就移至画布右侧。 |
| 地面移动                 | 设立两个ground节点，水平排列，锚点都设为（1，0.5），设立一个groundSpeed，在update生命周期中调用，如果playStatus为true就移动--将该ground.x -= groundSpeed，如果ground锚点移出画布，就将其移至下一个ground节点的后面，这样轮流设置位置以达到地面的移动。 |
| 小恐龙跳跃               | 当lifeStatus为真时，小恐龙为可以跳跃状态，第一次跳跃也即游戏开始，将playStatus设为true，触发键盘事件会对其进行节流处理，即每秒只能触发一次跳跃事件，跳跃事件触发时会播放缓动动画。 |
| 实例化植物预制件（随机） | 游戏初始化时在第二个地面节点上先随机初始化一些预制件，这些预制件的父节点为其所处的地面节点，当当前ground移出画布时会触发实例化函数，首先判断其是否有子节点，有则全部删除重新实例，这样实例化处的植物位置不同，个数也不同。 |
| 碰撞检测及处理           | 给小恐龙和植物预制件都加好碰撞组件，如果发生碰撞，会将playStatus与lifeStatus设为false；跳跃动画也会停止，然后播放Trex节点的Dead动画。 |
| 游戏重新开始             | 当发生碰撞之后，lifeStatus与playStatus都设为false，游戏会结束，因此需要将重新开始按钮显示在画布上，同时空格键也可触发重开事件，若小恐龙正在跳跃还需将其归位，TRex节点开始播放Move动画，再判断小恐龙处在哪个地面节点上，将其子节点全部移除。。 |
| 分数显示                 | 当playStatus为true的时候开始播放分数Main动画，发生碰撞事件时将其停止，并获取其播放时间，将当前播放时间与历史播放时间（初始化为0）比较，若当前更高则将当前时间赋给历史时间，同时在第一次碰撞时，history节点就显示在画布中。 |

## 项目结构

Assets文件夹为所有素材文件夹，其内有Animate文件夹（存放动画文件），Audio文件夹（存放音频文件），Prefab文件夹（存放预制件），Scene文件夹（存放场景文件），Script文件夹（存放脚本文件夹），Texture文件夹（存放纹理文件）。

项目主要功能实现是由脚本文件MainController.ts控制。

## 具体实现

### 1.游戏初始化

| API      | 目的                                             |
| -------- | ------------------------------------------------ |
| onLoad() | 绑定键盘事件，实例化植物预制件，绑定按钮事件     |
| start()  | 开启碰撞检测，初始化小恐龙对象（控制小恐龙动作） |

将TRex节点的Animation组建的default clip设为Init，并且选中play on load，

~~~~tsx
onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.throttle, this);
    this.instiatePrefab(this.grounds[1]);
    this.resetBtn.node.on("click", this.restart, this);
  }

  start() {
    let manager = cc.director.getCollisionManager();
    manager.enabled = true;

    class trexMove {
      animateComponent: cc.Animation;

      constructor(anim: cc.Animation) {
        this.animateComponent = anim;
      }
      trexStart = () => {
        return this.animateComponent.play("Move");
      };
      trexJump = () => {
        return this.animateComponent.play("Jump");
      };
      trexDie = () => {
        return this.animateComponent.play("Dead");
      };
      trexPause = () => {
        return this.animateComponent.pause();
      };
      //animateStop
      trexStop = () => {
        return this.animateComponent.stop();
      };
    }
    this.moveAction = new trexMove(this.node.getComponent(cc.Animation));
  }
~~~~



### 2. 云朵移动

| API                | 目的                                                         |
| ------------------ | ------------------------------------------------------------ |
| update()           | 在update中每帧进行移动处理                                   |
| node.x             | 设置云朵节点的位置，node.x -= cloudSpeed                     |
| node.setPosition() | 当云朵到达画布左侧就将其setPostion至画布右侧，node.setPosition(node.x+=CanvasWidth,node.y) |

### 3.地面移动

| API                | 目的                                                         |
| ------------------ | ------------------------------------------------------------ |
| update()           | 在update中每帧进行移动处理                                   |
| node.x             | 设置地面节点的位置，node.x -= groundSpeed                    |
| node.setPosition() | 当地面节点到达画布左侧就将其setPostion至下一个地面节点右侧，node.setPosition(node.x+=CanvasWidth,node.y) |

~~~~tsx
update(dt: number) {
    if (this.playStatus && this.lifeStatus) {
      this.clouds[0].x -= this.cloudSpeed;
      this.clouds[1].x -= this.cloudSpeed;
      this.grounds[0].x -= this.roadSpeed;
      this.grounds[1].x -= this.roadSpeed;
      if (this.grounds[0].x <= -480) {
        this.grounds[0].setPosition(
          this.grounds[0].x + 4800,
          this.grounds[0].y
        );
        this.instiatePrefab(this.grounds[0]);
      }
      if (this.grounds[1].x <= -480) {
        this.grounds[1].setPosition(
          this.grounds[1].x + 4800,
          this.grounds[0].y
        );
        this.instiatePrefab(this.grounds[1]);
      }
      if (this.clouds[0].x <= -600) {
        this.clouds[0].setPosition(this.clouds[0].x + 1150, this.clouds[0].y);
      }
      if (this.clouds[1].x <= -680) {
        this.clouds[1].setPosition(this.clouds[1].x + 1200, this.clouds[1].y);
      }
    }
~~~~

### 4.小恐龙跳跃

| API             | 目的               |
| --------------- | ------------------ |
| cc.tween        | 小恐龙跳跃缓动动画 |
| cc.tween.stop() | 停止小恐龙跳跃动画 |

~~~~tsx
//跳跃处理。 Done
  jumpAction() {
    this.moveAction.trexJump();
    this.jumpAnimate();
  }

  //跳跃动画 Done
  jumpAnimate() {
    this.JumpAnimate = cc
      .tween(this.node)
      .by(
        0.3,
        { position: cc.v3(0, this.jumpHeight, 0) },
        { easing: "quadOut" }
      )
      .by(
        0.3,
        { position: cc.v3(0, -this.jumpHeight, 0) },
        { easing: "quadIn" }
      )
      .call(() => {
        this.valid = true;
        this.moveAction.trexStart();
      })
      .start();
  }

  //一个stopAnimate方法，方便动画控制。 Done
  jumpAnimateStop() {
    this.JumpAnimate.stop();
  }
~~~~



### 5.实例化植物预制件（随机）

| API                 | 目的                     |
| ------------------- | ------------------------ |
| removeAllChildren() | 移除当前节点的所有子节点 |
| cc.instantiate()    | 实例化预制件             |
| setPosition()       | 设置每个预制件位置       |

~~~~tsx
//实例化预制件
    //实例化预制件
  instiatePrefab(ground: cc.Node) {
    if (ground.children.length > 0) {
      ground.removeAllChildren();
    }
    let randomNums = Math.floor(Math.random() * (6 - 3)) + 3;
    for (let i = 0; i < randomNums; i++) {
      let tempRandom = Math.floor(
        !this.initial ? Math.random() * 6 : Math.random() * 4
      );
      let tempNode = cc.instantiate(this.plantsArray[tempRandom]);
      tempNode.parent = ground ? ground : this.grounds[0];
      tempNode.setPosition(
        -(
          (2400 / randomNums) * (i + 1) +
          Math.random() * 100 * (Math.random() >= 0.5 ? -1 : 1)
        ),
        0
      );
    }
    this.initial = false;
  }

~~~~

随机生成randomNums，即每个Ground节点都有3-6个子植物节点，再通过子节点数量计算每个子节点的位置。

### 6.碰撞检测及处理

| API                               | 目的                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| cc.director.getCollisionManager() | .enabled打开碰撞检测，.enableDebugDraw绘制碰撞节点的外框，.enabledDrawBoudingBox绘制碰撞节点的检测框 |
| onCollisionEnter()                | 触发碰撞事件的回调函数                                       |
| getComponent()                    | 获取当前分数节点的Animation组件                              |
| getAnimationState()               | 获取当前分数节点的状态                                       |
| Animation.setCurrentTime()        | 设置历史分数节点动画的当前播放时间                           |

~~~~tsx
//碰撞处理
  onCollisionEnter(other: cc.Node, self: cc.Node) {
    this.jumpAnimateStop();
    this.moveAction.trexStop();
    this.moveAction.trexDie();
    this.playStatus = false;
    this.lifeStatus = false;
    let tempAnimate = this.currentNode.getComponent(cc.Animation);
    tempAnimate.pause();
    this.animState = tempAnimate.getAnimationState("Main");
    this.animatedTime = this.animState.time;
    this.resetBtn.node.y = -100;
    if (this.animatedTime > this.historyRecord) {
      this.historyRecord = this.animatedTime;
      this.historyNum.y = 95;
      let tempAnimate2 = this.historyNum.children[1].getComponent(cc.Animation);
      tempAnimate2.play("Main", this.historyRecord);
      tempAnimate2.pause();
      tempAnimate2.setCurrentTime(this.historyRecord);
    }
    let timer = setTimeout(() => {
      this.valid = true;
      clearTimeout(timer);
    }, 300);
  }
~~~~



### 7.游戏重新开始

| API                 | 目的                            |
| ------------------- | ------------------------------- |
| removeAllChildren() | 清除所有子节点                  |
| getComponent()      | 获取当前分数节点的Animation组件 |
| Animation.play()    | 重新播放分数动画                |

~~~~tsx
 //重新开始游戏事件
  restart() {
    this.valid = true;
    this.playStatus = true;
    this.lifeStatus = true;
    this.grounds[0].removeAllChildren();
    this.grounds[1].removeAllChildren();
    let tempAnimate = this.currentNode.getComponent(cc.Animation);
    tempAnimate.play();
    this.resetBtn.node.y = -500;
    this.node.y = -270;
    this.moveAction.trexStart();
    this.initial = true;
  }
~~~~



### 8. 分数显示

| API                 | 目的                           |
| ------------------- | ------------------------------ |
| getComponent()      | 获取分数节点的Animation组件    |
| getAnimationState() | 获取分数节点的动画播放状态信息 |
| setCurrentTime()    | 设置历史分数节点的动画播放时间 |

当游戏开始时，当前分数节点的动画就会开始播放，直到发生碰撞，动画就会停止，再回去该动画播放时间，判断该动画播放时间是否大于当前的历史记录时间，大于就将该动画播放时间赋给历史记录时间，再更新历史分数节点的动画播放时间。



## 性能优化

### 1.键盘事件的频繁触发

在玩游戏时，会经常连点空格键，但是频繁的触发键盘事件只会白白消耗性能，最初，我设置了一个jumpStatus，当跳跃时会他会将其设为true，再设个定时器，1秒后jumoStatus再为false，才能再次起跳，但是设置过多的定时器会消耗大量性能，因此转而使用节流函数，从源头上解决这个问题。

~~~~tsx
  //  节流 Done
  throttle(event: cc.Event.EventKeyboard) {
    if (!this.valid) {
      return;
    }
    this.valid = false;
    this.onKeyDown(event);
  }
~~~~

然后再jump动画尾部加上回调，设置valid为true，之后才会触发一次键盘事件，当发生碰撞时，代码不会运行到尾部，不会发生回调，则在碰撞检测处理中设置valid为true。

### 2.分数组件的频繁刷新

一开始，我是将10个数字Sprite一起引入，然后在update（）中将当前分数+=1，再根据分数来动态设置当前分数节点的每位数字的SpriteFrame，这样导致我的游戏运行页面巨卡，因此我使用了帧动画来优化这一情况。

### 3.重新开始游戏

第一版中，因为写的过于臃肿，有大量读写sessionStorage的操作，重新开始游戏时需重新加载当前的Scene，会造成画面不连贯，游戏体验不是特别好，现在将这个过程简化，舍弃了sessionStorage的使用，直接将当前ground节点的子节点销毁，再将当前分数与小恐龙复位，即可完成动作。

### 4.减少预制件与其它节点资源的反复添加

通过声明一个预制件数组来初始化大量的预制件，其它资源也以这种方式加载，之后添加预制件或其它资源可无需修改代码，减少后期维护成本。

### 5.封装一个T-Rex动作类，增加代码的复用性

Trex有各种各样的动作，如移动，初始化，死亡等，开发过程会大量使用这些动作，封装为类可以减少大量无意义的代码，开发更便捷。

## TypeScript的使用

### 类型检查

### 类型守卫

### 类型约束













