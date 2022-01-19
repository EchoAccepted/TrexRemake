// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property(cc.Prefab)
  plantNode: cc.Prefab = null;
  @property(cc.Prefab)
  plantNode2: cc.Prefab = null;
  @property(cc.Prefab)
  plantNode3: cc.Prefab = null;

  @property(cc.Node)
  labelNode: cc.Node = null;

  PlayStatus: string = "false";

  start() {
    let manager = cc.director.getCollisionManager();
    manager.enabled = true;
    //manager.enabledDebugDraw = true;
    //manager.enabledDrawBoundingBox = true;
  }

  move() {
    this.node.x -= 5;
    if (this.node.x <= -955) {
      this.node.x = 955;
      if (this.plantNode) {
        for (let i = 0; i < this.node.childrenCount; i++) {
          this.node.children[i].destroy();
        }
        this.instiantsPlant();
      }
    }
  }

  instiantsPlant() {
    let nodes: any = [];
    for (let i = 0; i < Math.floor(Math.random() * (4 - 1)) + 1; i++) {
      let randomNum = Math.floor(Math.random() * (3 - 1)) + 1;
      nodes[i] = cc.instantiate(
        randomNum == 2
          ? this.plantNode
          : randomNum == 3
          ? this.plantNode2
          : randomNum == 1
          ? this.plantNode3
          : this.plantNode
      );
      nodes[i].parent = this.node;
      nodes[i].setPosition(0 + 10 * i, 87);
    }
  }

  update(dt) {
    this.PlayStatus = window.sessionStorage.getItem("playStatus");
    if (this.PlayStatus === "true") {
      this.move();
    }
    let tempData = window.sessionStorage.getItem("Initial");
    if (tempData && tempData === "true") {
      window.sessionStorage.setItem("Initial", "false");
      cc.director.loadScene("Main");
    }
  }
}
