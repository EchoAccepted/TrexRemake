/** 控制键盘事件 */
import GameController, { GameState } from "./GameController";
import DinoActionControllerClass from "./DinoActionController";
import ScoreControllerClass from "./ScoreController";
import StageController from "./StageController";
import ButtonController from "./ButtonController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KeyboardController extends cc.Component {
  static canPressSpace: boolean = true;

  onLoad() {
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      this.pressThrottle,
      this
    );
  }

  /** 禁用节流，不可触发按键事件 */
  public static disableThrottle() {
    KeyboardController.canPressSpace = false;
  }

  /** 开启节流 ，可触发按键事件 */
  public static ableThrottle() {
    KeyboardController.canPressSpace = true;
  }

  /** 按键节流 */
  pressThrottle(event: cc.Event.EventKeyboard) {
    if (!KeyboardController.canPressSpace) {
      return;
    }
    KeyboardController.canPressSpace = false;
    this.KeyboardController(event);
  }

  /** 键盘事件处理 */
  KeyboardController(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      /** 游戏未开始 */
      if (GameController.gameState === GameState.initial) {
        this.node.getComponent(ScoreControllerClass).currentAnimationStart();
        this.node.getComponent(DinoActionControllerClass).dinoJump();
        GameController.gameState = GameState.playing;
      } else if (
        /** 游戏正在运行 */
        GameController.gameState === GameState.playing
      ) {
        this.node.getComponent(DinoActionControllerClass).dinoJump();
      } else if (
        /** 游戏结束 */
        GameController.gameState === GameState.stopped
      ) {
        this.restart();
      }
    }
  }

  /**
   * 恐龙重生
   * 当前分数重置
   * 游戏状态重置
   * 舞台状态重置
   * 按钮重置
   * 键盘事件可使用
   */
  restart() {
    this.node.getComponent(DinoActionControllerClass).dinoReborn();
    GameController.gamePlaying();
    this.node.getComponent(ScoreControllerClass).currentAnimationStart();
    this.node.getComponent(StageController).stageReinit();
    this.node.getComponent(ButtonController).resetBtnHide();
    KeyboardController.ableThrottle();
  }
}
