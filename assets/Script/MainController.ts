/** 负责对游戏进行主要的节点与资源进行控制与处理 */

const { ccclass, property } = cc._decorator;
import DinoAnimateClass from "./DinoAnimateClass";
import DinoActionClass from "./DinoActionClass";
import global, { PlayStatus, LifeStatus } from "./Global";
import instiatePrefab from "./InstiatePrefab";
@ccclass
export default class MainController extends cc.Component {
  /** 仙人掌预制件数组 */
  @property([cc.Prefab])
  plantsArray: cc.Prefab[] = new Array();

  /** 地面数组 */
  @property([cc.Node])
  grounds: cc.Node[] = new Array();

  /** 云数组 */
  @property([cc.Node])
  clouds: cc.Node[] = new Array();

  /** 当前分数节点 */
  @property(cc.Node)
  currentNode: cc.Node = null;

  /** 跳跃声音 */
  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  /** 得分声音 */
  @property(cc.AudioClip)
  scoreAudio: cc.AudioClip = null;

  /** 重开按钮 */
  @property(cc.Button)
  resetBtn: cc.Button = null;

  /** 跳跃高度 */
  @property
  jumpHeight: number = 150;

  /** 云移动速度 */
  @property
  cloudSpeed: number = 2;

  /** 路移动速度 */
  @property
  roadSpeed: number = 5;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.throttle, this);
    instiatePrefab(this.grounds[1], this.plantsArray);
    this.resetBtn.node.on("click", this.restart, this);
  }

  start() {
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    global.dinoAnimateAction = new DinoAnimateClass(
      this.node.getComponent(cc.Animation)
    );
    global.dinoAction = new DinoActionClass(
      this.node,
      this.jumpHeight,
      this.jumpAudio
    );
  }

  /** 节流 */
  throttle(event: cc.Event.EventKeyboard) {
    if (!global.valid) {
      return;
    }
    global.valid = false;
    this.onKeyDown(event);
  }

  /** 监听键盘事件，按空格则进行逻辑处理。 */
  onKeyDown(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      if (
        global.playStatus === PlayStatus.stopped &&
        global.lifeStatus === LifeStatus.alive
      ) {
        global.playStatus = PlayStatus.playing;
        global.dinoAnimateAction.trexStart();
        const tempAnimate = this.currentNode.getComponent(cc.Animation);
        tempAnimate.play();
        this.jumpAction();
      } else if (
        global.playStatus === PlayStatus.playing &&
        global.lifeStatus === LifeStatus.alive
      ) {
        this.jumpAction();
      } else if (
        global.playStatus === PlayStatus.stopped &&
        global.lifeStatus === LifeStatus.dead
      ) {
        this.restart();
      }
    }
  }

  /** 跳跃处理。 */
  jumpAction() {
    global.dinoAnimateAction.trexJump();
    global.JumpAnimate = global.dinoAction.dinoJump();
    global.JumpAnimate.call(() => {
      global.dinoAnimateAction.trexStart();
      global.valid = true;
    }).start();
  }

  /** 重新开始游戏 */
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
    global.dinoAnimateAction.trexStart();
    global.initial = true;
  }

  /** 背景移动 */
  backgroundMove() {
    this.clouds[0].x -= this.cloudSpeed;
    this.clouds[1].x -= this.cloudSpeed;
    this.grounds[0].x -= this.roadSpeed;
    this.grounds[1].x -= this.roadSpeed;
  }

  /** 地面位置更新 */
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

  /** 云位置更新 */
  cloudsPositionUpdate() {
    if (this.clouds[0].x <= -600) {
      this.clouds[0].setPosition(this.clouds[0].x + 1150, this.clouds[0].y);
    }
    if (this.clouds[1].x <= -680) {
      this.clouds[1].setPosition(this.clouds[1].x + 1200, this.clouds[1].y);
    }
  }

  update(dt: number) {
    if (
      global.playStatus === PlayStatus.playing &&
      global.lifeStatus === LifeStatus.alive
    ) {
      this.backgroundMove();
      this.groundsPositionUpdate();
      this.cloudsPositionUpdate();
    }
  }
}
