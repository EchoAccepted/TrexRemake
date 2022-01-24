const { ccclass, property } = cc._decorator;
import KeyboardController from "./KeyboardController";

@ccclass
export default class ButtonControllerClass extends cc.Component {
  @property(cc.Button)
  resetBtn: cc.Button = null;

  onLoad() {
    this.resetBtn.node.on("click", this.resetAction, this);
  }

  /** 重置按钮显示 */
  resetBtnShow() {
    this.resetBtn.node.y = -100;
  }

  /** 重置按钮隐藏 */
  resetBtnHide() {
    this.resetBtn.node.y = -500;
  }

  /** 游戏重置 */
  resetAction() {
    /** 隐藏按钮 */
    this.resetBtnHide();
    this.node.getComponent(KeyboardController).restart();
  }
}
