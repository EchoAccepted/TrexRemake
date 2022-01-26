/** 定义一个恐龙动作类，方便对恐龙动作进行统一管理 */
import KeyboardController from "./KeyboardController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DinoActionControllerClass extends cc.Component {
  /** 跳跃声音 */
  @property(cc.AudioClip)
  jumpAudio: cc.AudioClip = null;

  /** 生命值节点 */
  @property(cc.Node)
  healthNode: cc.Node = null;

  /** 恐龙生命值 */
  public static dinoHealth: number = 3;

  /** 跳跃高度 */
  jumpHeight: number = 150;

  /** 当前恐龙自身动画 */
  animateComponent: cc.Animation = null;

  /** 当前恐龙跳跃动画 */
  dinoJumpAnimate: cc.Tween = null;

  onLoad() {
    this.animateComponent = this.node.getComponent(cc.Animation);
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getPhysicsManager().gravity = cc.v2(0, -320);
  }

  /** 恐龙初始化 */
  dinoInit() {
    this.node.y = -270;
    this.animateComponent.play("Init");
  }

  /** 恐龙移动 */
  dinoMove() {
    this.animateComponent.play("Move");
  }

  /** 恐龙生命值减少 */
  dinoHealthReduce() {
    if (this.healthNode.children[0].active) {
      DinoActionControllerClass.dinoHealth -= 1;
      this.healthNode.children[DinoActionControllerClass.dinoHealth].active =
        false;
      this.animateComponent.play("Dead");
    }
  }

  /** 恐龙闪烁 */
  dinoBlink() {
    let action = cc.blink(1, 5);
    this.node.runAction(action);
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
        KeyboardController.ableThrottle();
      })
      .start();
    cc.audioEngine.play(this.jumpAudio, false, 0.5);
  }

  /** 恐龙重生 */
  dinoReborn() {
    DinoActionControllerClass.dinoHealth = 3;
    this.healthNode.children.forEach((item) => {
      item.active = true;
    });
    this.node.y = -270;
    this.animateComponent.play("Move");
  }
}
