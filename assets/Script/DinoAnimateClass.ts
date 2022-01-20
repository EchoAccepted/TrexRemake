/** 定义一个恐龙动画类，方便统一管理 */

export default class DinoAnimateClass {
  animateComponent: cc.Animation;
  constructor(anim: cc.Animation) {
    this.animateComponent = anim;
  }
  trexStart = () => {
    return this.animateComponent.play("Move");
  };
  trexJump = () => {
    return this.animateComponent.play("Jump");
  };
  trexDie = () => {
    return this.animateComponent.play("Dead");
  };
  trexPause = () => {
    return this.animateComponent.pause();
  };
  // animateStop
  trexStop = () => {
    return this.animateComponent.stop();
  };
}
