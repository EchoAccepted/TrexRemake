/** 触摸事件控制 */
import GameController, { GameState } from "./GameController";
import DinoActionControllerClass from "./DinoActionController";
import ScoreControllerClass from "./ScoreController";
import StageController from "./StageController";
import ButtonController from "./ButtonController";
import KeyboardController from "./KeyboardController";

const { ccclass } = cc._decorator;

@ccclass
export default class TouchController extends cc.Component {
  dinoNode: cc.Node = null;

  onLoad() {
    this.dinoNode = cc.find("Canvas/TRex");
    cc.macro.ENABLE_MULTI_TOUCH = false;
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchThrottle, this);
  }

  touchThrottle() {
    if (!KeyboardController.canPressSpace) {
      return;
    }
    KeyboardController.canPressSpace = false;
    this.touchHandle();
  }

  touchHandle() {
    /** 游戏未开始 */
    if (GameController.gameState === GameState.initial) {
      this.dinoNode.getComponent(ScoreControllerClass).currentAnimationStart();
      this.dinoNode.getComponent(DinoActionControllerClass).dinoJump();
      GameController.gamePlaying();
    } else if (
      /** 游戏正在运行 */
      GameController.gameState === GameState.playing
    ) {
      this.dinoNode.getComponent(DinoActionControllerClass).dinoJump();
    } else if (
      /** 游戏结束 */
      GameController.gameState === GameState.stopped
    ) {
      //this.restart();
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
    this.dinoNode.getComponent(DinoActionControllerClass).dinoReborn();
    GameController.gameState = GameState.playing;
    this.dinoNode.getComponent(ScoreControllerClass).currentAnimationStart();
    this.dinoNode.getComponent(StageController).stageReinit();
    this.dinoNode.getComponent(ButtonController).resetBtnHide();
    KeyboardController.ableThrottle();
  }
}
