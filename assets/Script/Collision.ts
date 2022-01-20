const { ccclass, property } = cc._decorator;
import global, { PlayStatus, LifeStatus } from "./Global";

@ccclass
export default class NewClass extends cc.Component {
  // 当前分数节点
  @property(cc.Node)
  currentNode: cc.Node = null;

  // 历史分数节点
  @property(cc.Node)
  historyNum: cc.Node = null;

  // 重开按钮
  @property(cc.Button)
  resetBtn: cc.Button = null;

  // 死亡声音
  @property(cc.AudioClip)
  hitAudio: cc.AudioClip = null;

  // 跳跃动画停止
  jumpAnimateStop() {
    global.JumpAnimate.stop();
  }

  // 更新全局变量
  updateGlobalState() {
    global.moveAction.trexStop();
    global.moveAction.trexDie();
    global.playStatus = PlayStatus.stoped;
    global.lifeStatus = LifeStatus.dead;
    const timer = setTimeout(() => {
      global.valid = true;
      clearTimeout(timer);
    }, 600);
  }

  // 当前分数节点动画停止并返回播放时间
  currentAnimateStop() {
    const tempAnimate = this.currentNode.getComponent(cc.Animation);
    tempAnimate.pause();
    const animState = tempAnimate.getAnimationState("Main");
    const animatedTime = animState.time;
    return animatedTime;
  }

  // 更新历史分数节点
  historyAnimateUpdate(currentTime: number) {
    if (currentTime > global.historyRecord) {
      global.historyRecord = currentTime;
      this.historyNum.y = 95;
      const tempAnimate2 = this.historyNum.children[1].getComponent(
        cc.Animation
      );
      tempAnimate2.play("Main", global.historyRecord);
      tempAnimate2.pause();
      tempAnimate2.setCurrentTime(global.historyRecord);
    }
  }

  // 碰撞处理
  onCollisionEnter() {
    this.jumpAnimateStop();
    cc.audioEngine.play(this.hitAudio, false, 0.5);
    this.updateGlobalState();
    const animatedTime = this.currentAnimateStop();
    this.resetBtn.node.y = -100;
    this.historyAnimateUpdate(animatedTime);
  }
}
