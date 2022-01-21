/**
 * 对碰撞进行检测，并进行逻辑处理
 */

const { ccclass, property } = cc._decorator;
import global, { GameStatus, PlayerStatus } from "./Global";

@ccclass
export default class NewClass extends cc.Component {
  /** 重开按钮 */
  @property(cc.Button)
  resetBtn: cc.Button = null;

  /** 碰撞声音 */
  @property(cc.AudioClip)
  hitAudio: cc.AudioClip = null;

  /**  跳跃动画停止 */
  jumpAnimateStop() {
    global.dinoActionController.dinoJump().stop();
  }

  /** 更新全局变量 */
  updateGlobalState() {
    global.dinoActionController.dinoDie();
    global.gameStatus = GameStatus.stopped;
    global.playerStatus = PlayerStatus.dead;
    global.canPressSpace = true;
  }

  /** 当前分数节点动画停止并返回播放时间 */
  currentAnimateStop() {
    return global.scoreController.curretnAnimationStop();
  }

  /** 更新历史分数节点 */
  historyAnimateUpdate(currentTime: number) {
    if (currentTime > global.historyRecord) {
      global.scoreController.historyAnimationUpdate(currentTime);
    }
  }

  /** 碰撞处理 */
  onCollisionEnter() {
    global.JumpAnimate.stop();
    cc.audioEngine.play(this.hitAudio, false, 0.5);
    this.updateGlobalState();
    const animatedTime = this.currentAnimateStop();
    this.historyAnimateUpdate(animatedTime);
    this.resetBtn.node.y = -100;
  }
}
