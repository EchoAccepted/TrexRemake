export default class trexMove{
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
      //animateStop
      trexStop = () => {
        return this.animateComponent.stop();
      };
}