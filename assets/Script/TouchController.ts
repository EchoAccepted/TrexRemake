/** 触摸事件控制 */
import Global, { GameState } from "./Global";
import DinoActionControllerClass from "./DinoActionController";
import ScoreControllerClass from "./ScoreController";
import StageController from "./StageController";
import ButtonController from "./ButtonController";

const { ccclass } = cc._decorator;

@ccclass
export default class TouchController extends cc.Component {
  onLoad() {
    cc.macro.ENABLE_MULTI_TOUCH = false;
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchThrottle, this);
  }

  touchThrottle() {
    if (!Global.canPressSpace) {
      return;
    }
    console.log('pressed');
    Global.canPressSpace = false;
    this.touchHandle();
  }

  touchHandle() {
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
    this.node.getComponent(ButtonController).resetBtnHide();
    Global.canPressSpace = true;
  }
}
