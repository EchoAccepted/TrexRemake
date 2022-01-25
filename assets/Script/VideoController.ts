// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Global, { GameState } from "./Global";
import DinoActionControllerClass from "./DinoActionController";
import ButtonControllerClass from "./ButtonController";
import StageController from "./StageController";
import ScoreControllerClass from "./ScoreController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  // LIFE-CYCLE CALLBACKS:
  @property(cc.VideoPlayer)
  videoController: cc.VideoPlayer = null;
  @property(cc.Node)
  clockNode: cc.Node = null;

  onLoad() {
    this.videoController.node.active = false;
    this.videoController.node.on("ready-to-play", this.videoReady, this);
    this.videoController.node.on("playing", this.videoPlaying, this);
    this.videoController.node.on("stopped", this.videoStopped, this);
    this.videoController.node.on("completed", this.videoCompleted, this);
    this.clockNode
      .getComponent(cc.Animation)
      .on("finished", this.clockFinished, this);
  }

  videoPlay() {
    this.videoController.node.active = true;
    this.videoController.play();
  }

  videoPlaying() {
    Global.canPressSpace = false;
  }

  videoStopped() {
    Global.canPressSpace = true;
    this.videoController.node.active = false;
  }

  videoReady() {
    this.videoController.play();
  }

  videoPause() {
    this.videoController.node.active = false;
    this.videoController.pause();
  }

  videoStop() {
    this.videoController.node.active = false;
    this.videoController.stop();
  }

  videoCompleted() {
    this.videoController.node.active = false;
    this.node.getComponent(StageController).stageReinit();
    this.node.getComponent(ButtonControllerClass).resetBtnHide();
    this.clockNode.active = true;
    this.clockNode.getComponent(cc.Animation).play();
    this.node.getComponent(DinoActionControllerClass).dinoInit();
  }

  clockFinished() {
    Global.canPressSpace = true;
    this.clockNode.active = false;
    Global.gameState = GameState.playing;
    this.node.getComponent(ScoreControllerClass).curretnAnimateResume();
    this.node.getComponent(DinoActionControllerClass).dinoReborn();
  }

  start() {}

  // update (dt) {}
}
