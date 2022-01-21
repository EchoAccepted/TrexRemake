/** 负责对游戏进行主要的节点与资源进行控制与处理 */

const { ccclass, property } = cc._decorator;
import DinoActionControllerClass from "./DinoActionController";
import StageController from "./StageController";
import ScoreControllerClass from "./ScoreController";
import KeyboardController, { restart } from "./KeyboardController";
import global, { GameStatus, PlayerStatus } from "./Global";
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

  /** 历史分数节点 */
  @property(cc.Node)
  historyNode: cc.Node = null;

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
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      this.pressThrottle,
      this
    );
    instiatePrefab(this.grounds[1], this.plantsArray);
    this.resetBtn.node.on("click", restart, this);
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
  }

  start() {
    /** 恐龙动作控制器 */
    global.dinoActionController = new DinoActionControllerClass(
      this.node,
      this.jumpHeight,
      this.jumpAudio,
      this.node.getComponent(cc.Animation)
    );

    /** 分数节点控制器 */
    global.scoreController = new ScoreControllerClass(
      this.currentNode,
      this.historyNode
    );

    /** 舞台控制器 */
    global.stageController = new StageController(
      this.plantsArray,
      this.grounds,
      this.clouds,
      this.cloudSpeed,
      this.roadSpeed
    );
  }

  /** 按键节流 */
  pressThrottle(event: cc.Event.EventKeyboard) {
    if (!global.canPressSpace) {
      return;
    }
    global.canPressSpace = false;
    KeyboardController(event, this.resetBtn);
  }

  update(dt: number) {
    if (
      global.gameStatus === GameStatus.playing &&
      global.playerStatus === PlayerStatus.alive
    ) {
      global.stageController.stageMove();
    }
  }
}
