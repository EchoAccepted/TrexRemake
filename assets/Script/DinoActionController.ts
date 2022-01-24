/** 定义一个恐龙动作类，方便对恐龙动作进行统一管理 */
import global from "./Global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DinoActionControllerClass extends cc.Component {
  /** 跳跃声音 */
  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  /** 跳跃高度 */
  jumpHeight: number = 150;

  /** 当前恐龙自身动画 */
  animateComponent: cc.Animation = null;

  /** 当前恐龙跳跃动画 */
  dinoJumpAnimate: cc.Tween = null;

  onLoad() {
    this.animateComponent = this.node.getComponent(cc.Animation);
  }

  /** 恐龙移动 */
  dinoMove() {
    this.animateComponent.play("Move");
  }

  /** 恐龙死亡 */
  dinoDie() {
    if (this.dinoJumpAnimate) {
      this.dinoJumpAnimate.stop();
    }
    this.animateComponent.play("Dead");
  }

  /** 恐龙跳跃 */
  dinoJump() {
    this.animateComponent.play("Jump");
    this.dinoJumpAnimate = cc
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
        this.animateComponent.play("Move");
        global.canPressSpace = true;
      })
      .start();
    cc.audioEngine.play(this.jumpAudio, false, 0.5);
  }

  /** 恐龙重生 */
  dinoReborn() {
    this.node.y = -270;
    this.animateComponent.play("Move");
  }
}
