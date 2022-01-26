import GameController, { GameState } from "./GameController";
import DinoActionControllerClass from "./DinoActionController";
import ButtonControllerClass from "./ButtonController";
import CollisionController from "./Collision";
import ScoreControllerClass from "./ScoreController";
import KeyboardController from "./KeyboardController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  // LIFE-CYCLE CALLBACKS:
  @property(cc.VideoPlayer)
  videoController: cc.VideoPlayer = null;
  @property(cc.Node)
  clockNode: cc.Node = null;
  @property(cc.Node)
  coverNode: cc.Node = null;

  onLoad() {
    this.videoController.node.active = false;
    this.videoController.node.on("ready-to-play", this.videoReady, this);
    this.videoController.node.on("playing", this.videoPlaying, this);
    this.videoController.node.on("stopped", this.videoStopped, this);
    this.videoController.node.on("completed", this.videoCompleted, this);
    this.clockNode
      .getComponent(cc.Animation)
      .on("finished", this.clockFinished, this);
    this.coverNode.active = false;
  }

  videoPlay() {
    this.videoController.node.active = true;
    this.node.getComponent(ButtonControllerClass).cancelBtnShow();
    this.videoController.play();
    this.coverNode.active = true;
  }

  videoPlaying() {
    this.node.getComponent(ButtonControllerClass).cancelBtnShow();
    KeyboardController.canPressSpace = false;
    this.coverNode.active = true;
  }

  videoReady() {
    this.videoPlay();
  }

  videoStopped() {
    KeyboardController.canPressSpace = true;
    this.node.getComponent(ButtonControllerClass).cancelBtnHide();
    this.videoController.node.active = false;
    this.coverNode.active = false;
  }

  videoStop() {
    this.videoController.currentTime = 0;
    this.videoController.node.active = false;
    this.coverNode.active = false;
    this.videoController.stop();
    this.node.getComponent(ButtonControllerClass).cancelBtnHide();
  }

  videoCompleted() {
    this.clockNode.active = true;
    this.clockNode.getComponent(cc.Animation).play();
    this.videoController.node.active = false;
    this.node.getComponent(CollisionController).destoryHittedNode();
    this.node.getComponent(ButtonControllerClass).resetBtnHide();
    this.node.getComponent(ButtonControllerClass).cancelBtnHide();
    this.node.getComponent(DinoActionControllerClass).dinoInit();
    this.coverNode.active = false;
  }

  clockFinished() {
    KeyboardController.canPressSpace = true;
    this.node.getComponent(DinoActionControllerClass).dinoBlink();
    this.clockNode.active = false;
    GameController.gamePlaying();
    this.node.getComponent(ScoreControllerClass).curretnAnimateResume();
    this.node.getComponent(DinoActionControllerClass).dinoReborn();
  }
}
