/**
 * 对碰撞进行检测，并进行逻辑处理
 */

const { ccclass, property } = cc._decorator;
import GameController, { GameState } from "./GameController";
import KeyboardController from "./KeyboardController";
import DinoActionControllerClass from "./DinoActionController";
import ButtonControllerClass from "./ButtonController";
import ScoreControllerClass from "./ScoreController";

@ccclass
export default class CollisionController extends cc.Component {
  /** 碰撞声音 */
  @property(cc.AudioClip)
  hitAudio: cc.AudioClip = null;

  hittedNode: cc.Node = null;
  onLoad() {
    cc.director.getCollisionManager().enabled = true;
  }

  /** 碰撞处理 ：
   * 恐龙死亡
   * 碰撞音效
   * 游戏状态更新
   * 历史分数更新
   * 键盘事件可触发
   * 重置按钮显示
   */

  onCollisionEnter(other: cc.Node) {
    cc.audioEngine.play(this.hitAudio, false, 0.5);
    this.node.getComponent(DinoActionControllerClass).dinoHealthReduce();
    if (DinoActionControllerClass.dinoHealth <= 0) {
      this.hittedNode = other;
      this.node.getComponent(DinoActionControllerClass).dinoDie();
      GameController.gameState = GameState.stopped;
      this.node.getComponent(ScoreControllerClass).curretnAnimationStop();
      this.node.getComponent(ScoreControllerClass).historyAnimationUpdate();
      this.node.getComponent(ButtonControllerClass).resetBtnShow();
      KeyboardController.ableThrottle();
    }
  }

  destoryHittedNode() {
    this.hittedNode.active = false;
    this.hittedNode.opacity = 0;
    //this.hittedNode.destroy();
  }

  onCollisionExit() {
    this.node.getComponent(DinoActionControllerClass).dinoMove();
  }
}
