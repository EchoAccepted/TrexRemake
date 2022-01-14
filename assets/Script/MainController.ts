const { ccclass, property } = cc._decorator;

@ccclass
export default class MainController extends cc.Component {
  //随机植物1
  @property(cc.Prefab)
  plant1: cc.Prefab = null;

  //随机植物2
  @property(cc.Prefab)
  plant2: cc.Prefab = null;

  //随机植物3
  @property(cc.Prefab)
  plant3: cc.Prefab = null;

  //随机植物4
  @property(cc.Prefab)
  plant4: cc.Prefab = null;

  //随机植物5
  @property(cc.Prefab)
  plant5: cc.Prefab = null;

  //随机植物6
  @property(cc.Prefab)
  plant6: cc.Prefab = null;

  //地面1
  @property(cc.Node)
  ground1: cc.Node = null;

  //地面2
  @property(cc.Node)
  ground2: cc.Node = null;

  //高处云
  @property(cc.Node)
  cloudHigher: cc.Node = null;

  //低处云
  @property(cc.Node)
  cloudLower: cc.Node = null;

  //当前分数节点
  @property(cc.Node)
  currentNode: cc.Node = null;

  //历史分数节点
  @property(cc.Node)
  historyNum: cc.Node = null;

  //跳跃声音
  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  //得分声音
  @property(cc.AudioClip)
  scoreAudio: cc.AudioClip = null;

  //死亡声音
  @property(cc.AudioClip)
  hitAudio: cc.AudioClip = null;

  //重开按钮
  @property(cc.Button)
  resetBtn: cc.Button = null;

  //play状态，初始化为false
  playStatus: boolean = false;
  //存活状态，初始化为true
  lifeStatus: boolean = true;
  //历史最高分数
  historyRecord: number = 0;
  // 定时器Id
  timer: number = 0;
  // 是否正在跳跃:
  jumpStatus: boolean = false;
  //跳跃动画
  JumpAnimate: cc.Tween = null;
  //跳跃高度
  jumpHeight: number = 150;
  //云移动速度
  cloudSpeed: number = 2;
  //路移动速度
  roadSpeed: number = 5;
  //声明一个trex移动对象，控制其所有移动方法
  moveAction: any = null;
  // throttle 参数
  valid: boolean = true;
  //动画状态
  animState: cc.AnimationState = null;
  //动画已播放时间
  animatedTime: number = null;
  //实际分数
  score: number = 0;
  //是否允许闪烁
  blinkVaild: boolean = true;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.throttle, this);
    this.instiatePrefab(2);
    this.resetBtn.node.on("click", this.restart, this);
  }

  start() {
    let manager = cc.director.getCollisionManager();
    manager.enabled = true;
    manager.enabledDebugDraw = true;
    manager.enabledDrawBoundingBox = true;
    this.moveAction = {
      animateTrexComponent: this.node.getComponent(cc.Animation)
        ? this.node.getComponent(cc.Animation)
        : null,
      //animateTrexStart
      trexStart: function () {
        return this.animateTrexComponent.play("Move");
      },
      //animateTrexPause
      trexJump: function () {
        return this.animateTrexComponent.play("Jump");
      },
      trexDie: function () {
        return this.animateTrexComponent.play("Dead");
      },
      trexPause: function () {
        return this.animateTrexComponent.pause();
      },
      //animateStop
      trexStop: function () {
        return this.animateTrexComponent.stop();
      },
    };
  }

  //  节流 Done
  throttle(event: cc.Event.EventKeyboard) {
    if (!this.valid) {
      return;
    } else {
      this.onKeyDown(event);
    }
    this.valid = false;
    this.timer = setTimeout(() => {
      this.valid = true;
    }, 600);
  }

  //监听键盘事件，按空格则进行逻辑处理。 Done
  onKeyDown(event: cc.Event.EventKeyboard) {
    if (this.jumpStatus) {
      return;
    }
    if (event.keyCode === cc.macro.KEY.space) {
      if (!this.playStatus && this.lifeStatus) {
        this.playStatus = true;
        this.moveAction.trexStart();
        this.jumpStatus = true;
        let tempAnimate = this.currentNode.getComponent(cc.Animation);
        tempAnimate.play();
        this.jumpAction();
      } else if (this.playStatus && this.lifeStatus) {
        this.jumpStatus = true;
        this.jumpAction();
      } else if (this.playStatus && !this.lifeStatus) {
        return;
      } else if (!this.playStatus && !this.lifeStatus) {
        this.restart();
      }
    }
  }

  //跳跃，异步处理。 Done
  async jumpAction() {
    this.moveAction.trexJump();
    await this.jumpAnimate().then(() => {
      let tempTimer = setTimeout(() => {
        this.jumpStatus = false;
        if (this.lifeStatus) this.moveAction.trexStart();
        clearTimeout(tempTimer);
      }, 600);
    });
  }

  //跳跃动画 Done
  async jumpAnimate() {
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
      .start();
  }

  //一个stopAnimate方法，方便动画控制。 Done
  jumpAnimateStop() {
    this.JumpAnimate.stop();
  }

  //实例化预制件
  instiatePrefab(e: number) {
    if (e == 1) {
      this.ground1.removeAllChildren();
    } else if (e == 2) {
      this.ground2.removeAllChildren();
    }
    let tempArray = [
      this.plant1,
      this.plant2,
      this.plant3,
      this.plant4,
      this.plant5,
      this.plant6,
    ];

    let randomNums = Math.floor(Math.random() * (6 - 3)) + 3;
    for (let i = 0; i < randomNums; i++) {
      let tempNode = cc.instantiate(tempArray[Math.floor(Math.random() * 6)]);
      tempNode.parent = e == 1 ? this.ground1 : this.ground2;
      tempNode.setPosition(
        -(
          (2400 / randomNums) * (i + 1) +
          Math.random() * 100 * (Math.random() >= 0.5 ? -1 : 1)
        ),
        0
      );
    }
  }

  //碰撞处理
  async onCollisionEnter(other: cc.Node, self: cc.Node) {
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
  }

  //重新开始游戏事件
  restart() {
    this.playStatus = true;
    this.lifeStatus = true;
    this.ground1.removeAllChildren();
    this.ground2.removeAllChildren();
    let tempAnimate = this.currentNode.getComponent(cc.Animation);
    tempAnimate.play();
    this.resetBtn.node.y = -500;
    this.node.y = -270;
    this.moveAction.trexStart();
  }

  protected onDestroy(): void {
    clearInterval(this.timer != 0 ? this.timer : null);
  }

  update(dt) {
    if (this.playStatus && this.lifeStatus) {
      this.cloudHigher.x -= this.cloudSpeed;
      this.cloudLower.x -= this.cloudSpeed;
      this.ground1.x -= this.roadSpeed;
      this.ground2.x -= this.roadSpeed;
    }
    if (this.ground1.x <= -480) {
      this.ground1.setPosition(this.ground1.x + 4800, this.ground1.y);
      this.instiatePrefab(1);
    }
    if (this.ground2.x <= -480) {
      this.ground2.setPosition(this.ground2.x + 4800, this.ground1.y);
      this.instiatePrefab(2);
    }
    if (this.cloudHigher.x <= -600) {
      this.cloudHigher.setPosition(
        this.cloudHigher.x + 1150,
        this.cloudHigher.y
      );
    }
    if (this.cloudLower.x <= -680) {
      this.cloudLower.setPosition(this.cloudLower.x + 1200, this.cloudLower.y);
    }
  }
}
