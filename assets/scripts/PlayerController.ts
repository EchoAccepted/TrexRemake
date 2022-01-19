// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
  @property
  jumpHeight: number = 0;

  @property
  public playStatus: boolean = false;

  @property
  jumpStatus: boolean = false;

  @property(cc.Label)
  labelNode: cc.Label = null;

  @property(cc.Label)
  labelNode2: cc.Label = null;

  @property(cc.Label)
  labelNode3: cc.Label = null;

  @property(cc.AudioClip)
  audio: cc.AudioClip = null;

  @property(cc.AudioClip)
  audio2: cc.AudioClip = null;

  @property(cc.Button)
  btnNode: cc.Button = null;

  timer: any = null;
  historyRecord: Array<number> = [];
  survivorStatus: boolean = true;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    cc.systemEvent.on("keydown", this.onKeyDown, this);
    this.btnNode.node.on("click", this.onBtnClick, this);
    window.sessionStorage.setItem("playStatus", "false");
  }

  onBtnClick() {
    console.log("btnClick");
    window.sessionStorage.setItem("Initial", "true");
    this.playStatus = true;
    this.btnNode.node.y = -400;
    this.labelNode3.node.y = -350;
    this.survivorStatus = true;
    window.sessionStorage.setItem("playStatus", "true");
    window.sessionStorage.setItem("survivorStatus", "true");
    this.labelNode.string = "0";
  }

  onKeyDown(event: cc.Event.EventKeyboard) {
    if (event.keyCode === cc.macro.KEY.space) {
      let tempData: string = window.sessionStorage.getItem("survivorStatus");
      if (tempData === "true") {
        this.survivorStatus = true;
      }
      if (!this.playStatus && this.survivorStatus) {
        this.playStatus = true;
        this.timer = setInterval(() => {
          let survivor = this.survivorStatus;
          if (survivor && this.labelNode) {
            let labelVal = Number(
              this.labelNode.string ? this.labelNode.string : "0"
            );
            this.labelNode.string = (1 + labelVal).toString();
            if ((1 + labelVal) % 100 === 0) {
              cc.audioEngine.play(this.audio2, false, 0.5);
            }
            if (labelVal >= 10000) return;
          } else {
            return;
          }
        }, 300);
        window.sessionStorage.setItem("playStatus", "true");
      } else {
        if (this.jumpStatus) {
          return;
        } else if (!this.jumpStatus && this.survivorStatus) {
          this.characterJump();
        }
      }
    }
  }

  onCollisionEnter(other: any, self: any) {
    clearInterval(this.timer);
    this.playStatus = false;
    this.btnNode.node.y = 0;
    this.labelNode3.node.y = 100;
    this.survivorStatus = false;

    let tempData: any = JSON.parse(
      window.sessionStorage.getItem("HistoryRecord")
    );
    this.historyRecord.push(Number(this.labelNode.string));
    if (tempData) {
      this.historyRecord = this.historyRecord.concat(tempData);
      this.historyRecord = this.historyRecord.sort(function (a, b) {
        return b - a;
      });
    }
    window.sessionStorage.setItem(
      "HistoryRecord",
      JSON.stringify(this.historyRecord)
    );

    window.sessionStorage.setItem("survivorStatus", "false");
    window.sessionStorage.setItem("playStatus", "false");
  }

  characterJump() {
    cc.audioEngine.play(this.audio, false, 0.5);
    this.jumpStatus = true;
    setTimeout(() => {
      this.jumpStatus = false;
    }, 1000);
    cc.tween(this.node)
      .by(0.5, { position: cc.v3(0, this.jumpHeight, 0) })
      .by(0.5, { position: cc.v3(0, -this.jumpHeight, 0) })
      .start();
  }

  update(dt) {
    let tempData = JSON.parse(window.sessionStorage.getItem("HistoryRecord"));
    if (tempData) this.labelNode2.string = "HI! " + tempData[0];
  }
}
