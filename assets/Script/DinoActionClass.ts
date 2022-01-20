/** 定义一个恐龙动作类，方便对恐龙动作进行统一管理 */

export default class DinoActionClass {
  /** 恐龙节点 */
  dinoNode: cc.Node;
  /** 跳跃高度 */
  jumpHeight: number;
  /** 跳跃声音 */
  jumpAudio: cc.AudioClip;

  constructor(dinoNode: cc.Node, jumpHeight: number, jumpAudio: cc.AudioClip) {
    this.dinoNode = dinoNode;
    this.jumpHeight = jumpHeight;
    this.jumpAudio = jumpAudio;
  }

  dinoJump = () => {
    cc.audioEngine.play(this.jumpAudio, false, 0.5);
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
      );
  };
}
