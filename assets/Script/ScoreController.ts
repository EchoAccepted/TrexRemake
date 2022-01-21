/**
 * 分数节点控制类
 */

export default class ScoreControllerClass {
  currentNode: cc.Node;
  historyNode: cc.Node;

  constructor(curretnNode: cc.Node, historyNode: cc.Node) {
    this.currentNode = curretnNode;
    this.historyNode = historyNode;
  }

  currentAnimationStart() {
    let currentAnimate = this.currentNode.getComponent(cc.Animation);
    currentAnimate.play();
  }

  curretnAnimationStop() {
    let currentAnimate = this.currentNode.getComponent(cc.Animation);
    currentAnimate.pause();
    return currentAnimate.getAnimationState("Main").time;
  }

  historyAnimationUpdate(currentTime: number) {
    this.historyNode.y = 95;
    let historyAnimate = this.historyNode.children[1].getComponent(
      cc.Animation
    );
    historyAnimate.play("Main", currentTime);
    historyAnimate.pause();
    historyAnimate.setCurrentTime(currentTime);
  }
}
