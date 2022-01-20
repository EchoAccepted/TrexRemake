const { ccclass, property } = cc._decorator;
import TrexMove from "./ActionClass";
import global, { PlayStatus, LifeStatus } from "./Global";
import instiatePrefab from "./InstiatePrefab";
@ccclass
export default class MainController extends cc.Component {
  // 仙人掌预制件数组
  @property([cc.Prefab])
  plantsArray: cc.Prefab[] = new Array();

  // 地面数组
  @property([cc.Node])
  grounds: cc.Node[] = new Array();

  // 云数组
  @property([cc.Node])
  clouds: cc.Node[] = new Array();

  // 当前分数节点
  @property(cc.Node)
  currentNode: cc.Node = null;

  // 跳跃声音
  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  // 得分声音
  @property(cc.AudioClip)
  scoreAudio: cc.AudioClip = null;

  // 重开按钮
  @property(cc.Button)
  resetBtn: cc.Button = null;

  // 跳跃高度
  @property
  jumpHeight: number = 150;

  // 云移动速度
  @property
  cloudSpeed: number = 2;

  // 路移动速度
  @property
  roadSpeed: number = 5;

  // 是否允许闪烁
  blinkVaild: boolean = true;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.throttle, this);
    instiatePrefab(this.grounds[1], this.plantsArray);
    this.resetBtn.node.on("click", this.restart, this);
  }

  start() {
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    global.moveAction = new TrexMove(this.node.getComponent(cc.Animation));
  }

  //  节流 Done
  throttle(event: cc.Event.EventKeyboard) {
    if (!global.valid) {
      return;
    }
    global.valid = false;
    this.onKeyDown(event);
  }

  // 监听键盘事件，按空格则进行逻辑处理。 Done
  onKeyDown(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      if (global.playStatus === 1 && global.lifeStatus === 0) {
        global.playStatus = PlayStatus.playing;
        global.moveAction.trexStart();
        const tempAnimate = this.currentNode.getComponent(cc.Animation);
        tempAnimate.play();
        this.jumpAction();
      } else if (global.playStatus === 0 && global.lifeStatus === 0) {
        this.jumpAction();
      } else if (global.playStatus === 1 && global.lifeStatus === 1) {
        this.restart();
      }
    }
  }

  // 跳跃处理。 Done
  jumpAction() {
    global.moveAction.trexJump();
    cc.audioEngine.play(this.jumpAudio, false, 0.5);
    this.jumpAnimate();
  }

  // 跳跃动画 Done
  jumpAnimate() {
    global.JumpAnimate = cc
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
        global.valid = true;
        global.moveAction.trexStart();
      })
      .start();
  }

  // 重新开始游戏
  restart() {
    global.valid = true;
    global.playStatus = PlayStatus.playing;
    global.lifeStatus = LifeStatus.alive;
    this.grounds[0].removeAllChildren();
    this.grounds[1].removeAllChildren();
    const tempAnimate = this.currentNode.getComponent(cc.Animation);
    tempAnimate.play();
    this.resetBtn.node.y = -500;
    this.node.y = -270;
    global.moveAction.trexStart();
    global.initial = true;
  }

  backgroundMove() {
    this.clouds[0].x -= this.cloudSpeed;
    this.clouds[1].x -= this.cloudSpeed;
    this.grounds[0].x -= this.roadSpeed;
    this.grounds[1].x -= this.roadSpeed;
  }

  groundsPositionUpdate() {
    if (this.grounds[0].x <= -480) {
      this.grounds[0].setPosition(this.grounds[0].x + 4800, this.grounds[0].y);
      instiatePrefab(this.grounds[0], this.plantsArray);
    }
    if (this.grounds[1].x <= -480) {
      this.grounds[1].setPosition(this.grounds[1].x + 4800, this.grounds[0].y);
      instiatePrefab(this.grounds[1], this.plantsArray);
    }
  }

  cloudsPositionUpdate() {
    if (this.clouds[0].x <= -600) {
      this.clouds[0].setPosition(this.clouds[0].x + 1150, this.clouds[0].y);
    }
    if (this.clouds[1].x <= -680) {
      this.clouds[1].setPosition(this.clouds[1].x + 1200, this.clouds[1].y);
    }
  }

  update(dt: number) {
    if (global.playStatus === 0 && global.lifeStatus === 0) {
      this.backgroundMove();
      this.groundsPositionUpdate();
      this.cloudsPositionUpdate();
    }
  }
}
