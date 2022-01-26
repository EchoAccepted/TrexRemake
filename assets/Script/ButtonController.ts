const { ccclass, property } = cc._decorator;
import KeyboardController from "./KeyboardController";
import VideoController from "./VideoController";

@ccclass
export default class ButtonControllerClass extends cc.Component {
  @property(cc.Button)
  resetBtn: cc.Button = null;

  @property(cc.VideoPlayer)
  videoNode: cc.VideoPlayer = null;

  @property(cc.Button)
  videoBtn: cc.Button = null;

  @property(cc.Button)
  videoCancelBtn: cc.Button = null;

  onLoad() {
    this.resetBtn.node.on("click", this.resetAction, this);
    this.videoBtn.node.on("click", this.videoAction, this);
    this.videoCancelBtn.node.on("click", this.videoActionCancelAction, this);
    this.resetBtnHide();
    this.cancelBtnHide();
  }

  /** 取消播放视频 */
  videoActionCancelAction() {
    this.node.getComponent(VideoController).videoStop();
    this.cancelBtnHide();
  }

  /** 取消按钮显示 */
  cancelBtnShow() {
    this.videoCancelBtn.node.active = true;
  }

  /** 取消按钮隐藏 */
  cancelBtnHide() {
    this.videoCancelBtn.node.active = false;
  }

  /** 重置按钮显示 */
  resetBtnShow() {
    this.resetBtn.node.active = true;
    this.videoBtn.node.active = true;
  }

  /** 重置按钮隐藏 */
  resetBtnHide() {
    this.resetBtn.node.active = false;
    this.videoBtn.node.active = false;
  }

  /** 游戏重置 */
  resetAction() {
    /** 隐藏按钮 */
    this.resetBtnHide();
    this.node.getComponent(KeyboardController).restart();
  }

  /** 视频按钮Action */
  videoAction() {
    this.node.getComponent(VideoController).videoPlay();
  }
}
