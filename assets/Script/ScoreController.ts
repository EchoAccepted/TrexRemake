/**
 * 分数节点控制类
 */
import Global from "./Global";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ScoreControllerClass extends cc.Component {
  @property(cc.Node)
  currentNode: cc.Node = null;

  @property(cc.Node)
  historyNode: cc.Node = null;

  onLoad() {
    this.historyNode.active = false;
  }

  /** 播放当前分数节点动画 */
  currentAnimationStart() {
    let currentAnimate = this.currentNode.getComponent(cc.Animation);
    currentAnimate.play();
  }

  /** 停止当前分数节点动画并返回时间 */
  curretnAnimationStop() {
    let currentAnimate = this.currentNode.getComponent(cc.Animation);
    currentAnimate.pause();
    return currentAnimate.getAnimationState("Main").time;
  }

  /** 继续当前动画 */
  curretnAnimateResume() {
    let currentAnimate = this.currentNode.getComponent(cc.Animation);
    currentAnimate.resume();
  }

  /** 更新历史节点 */
  historyAnimationUpdate() {
    let currentTime = this.currentNode
      .getComponent(cc.Animation)
      .getAnimationState("Main").time;
    if (currentTime > Global.historyRecord) {
      Global.historyRecord = currentTime;
      this.historyNode.active = true;
      let historyAnimate = this.historyNode.children[1].getComponent(
        cc.Animation
      );
      historyAnimate.play("Main", currentTime);
      historyAnimate.pause();
      historyAnimate.setCurrentTime(currentTime);
    }
  }
}
