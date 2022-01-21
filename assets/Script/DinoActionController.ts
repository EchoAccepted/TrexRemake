/** 定义一个恐龙动作类，方便对恐龙动作进行统一管理 */

export default class DinoActionControllerClass {
  /** 恐龙节点 */
  dinoNode: cc.Node;
  /** 跳跃高度 */
  jumpHeight: number;
  /** 跳跃声音 */
  jumpAudio: cc.AudioClip;
  /** 当前恐龙动画 */
  animateComponent: cc.Animation;
  constructor(
    dinoNode: cc.Node,
    jumpHeight: number,
    jumpAudio: cc.AudioClip,
    animateComponent: cc.Animation
  ) {
    this.dinoNode = dinoNode;
    this.jumpHeight = jumpHeight;
    this.jumpAudio = jumpAudio;
    this.animateComponent = animateComponent;
  }

  /** 恐龙移动 */
  dinoMove() {
    this.animateComponent.play("Move");
  }
  /** 恐龙死亡 */
  dinoDie() {
    this.animateComponent.play("Dead");
  }

  /**恐龙停止 */
  dinoStop() {
    this.animateComponent.stop();
  }

  /** 恐龙跳跃 */
  dinoJump() {
    cc.audioEngine.play(this.jumpAudio, false, 0.5);
    this.animateComponent.play("Jump");
    return cc
      .tween(this.dinoNode)
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
      });
  }

  /** 恐龙重生 */
  dinoReborn() {
    this.dinoNode.y = -270;
    this.animateComponent.play("Move");
  }
}
