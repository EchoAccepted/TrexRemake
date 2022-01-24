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

  /** 更新历史节点 */
  historyAnimationUpdate() {
    let currentTime = this.currentNode
      .getComponent(cc.Animation)
      .getAnimationState("Main").time;
    if (currentTime > Global.historyRecord) {
      Global.historyRecord = currentTime;
      this.historyNode.y = 95;
      let historyAnimate = this.historyNode.children[1].getComponent(
        cc.Animation
      );
      historyAnimate.play("Main", currentTime);
      historyAnimate.pause();
      historyAnimate.setCurrentTime(currentTime);
    }
  }
}
