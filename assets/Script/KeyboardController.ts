/** 控制键盘事件 */
import Global, { GameState } from "./Global";
import DinoActionControllerClass from "./DinoActionController";
import ScoreControllerClass from "./ScoreController";
import StageController from "./StageController";
import ButtonController from "./ButtonController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KeyboardController extends cc.Component {
  public static canPressSpace = true;

  onLoad() {
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      this.pressThrottle,
      this
    );
  }

  /** 按键节流 */
  pressThrottle(event: cc.Event.EventKeyboard) {
    if (!Global.canPressSpace) {
      return;
    }
    Global.canPressSpace = false;
    this.KeyboardController(event);
  }

  KeyboardController(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      /** 游戏未开始 */
      if (Global.gameState === GameState.initial) {
        this.node.getComponent(ScoreControllerClass).currentAnimationStart();
        this.node.getComponent(DinoActionControllerClass).dinoJump();
        Global.gameState = GameState.playing;
      } else if (
        /** 游戏正在运行 */
        Global.gameState === GameState.playing
      ) {
        this.node.getComponent(DinoActionControllerClass).dinoJump();
      } else if (
        /** 游戏结束 */
        Global.gameState === GameState.stopped
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
    Global.gameState = GameState.playing;
    this.node.getComponent(ScoreControllerClass).currentAnimationStart();
    this.node.getComponent(StageController).stageReinit();
    this.node.getComponent("ButtonController").resetBtnHide();
    Global.canPressSpace = true;
  }
}
