const { ccclass, property } = cc._decorator;

@ccclass
export default class MainController extends cc.Component {
  //仙人掌预制件数组
  @property([cc.Prefab])
  plantsArray: cc.Prefab[] = new Array();

  //地面数组
  @property([cc.Node])
  grounds: cc.Node[] = new Array();

  //云数组
  @property([cc.Node])
  clouds: cc.Node[] = new Array();

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

  //跳跃高度
  @property
  jumpHeight: number = 150;

  //云移动速度
  @property
  cloudSpeed: number = 2;

  //路移动速度
  @property
  roadSpeed: number = 5;

  //play状态，初始化为false
  playStatus: boolean = false;
  //存活状态，初始化为true
  lifeStatus: boolean = true;
  //历史最高分数
  historyRecord: number = 0;
  //跳跃动画
  JumpAnimate: cc.Tween = null;
  //声明一个trex动作类，控制其所有动作方法
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
  //是否初始化
  initial: boolean = true;

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

  //  节流 Done
  throttle(event: cc.Event.EventKeyboard) {
    if (!this.valid) {
      return;
    }
    this.valid = false;
    this.onKeyDown(event);
  }

  //监听键盘事件，按空格则进行逻辑处理。 Done
  onKeyDown(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      if (!this.playStatus && this.lifeStatus) {
        this.playStatus = true;
        this.moveAction.trexStart();
        let tempAnimate = this.currentNode.getComponent(cc.Animation);
        tempAnimate.play();
        this.jumpAction();
      } else if (this.playStatus && this.lifeStatus) {
        this.jumpAction();
      } else if (this.playStatus && !this.lifeStatus) {
        return;
      } else if (!this.playStatus && !this.lifeStatus) {
        this.restart();
      }
    }
  }

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
  }
}
