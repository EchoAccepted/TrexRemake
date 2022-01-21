import instiatePrefab from "./InstiatePrefab";

export default class StageController {
  /** 云移动速度 */
  cloudSpeed: number;

  /** 路移动速度 */
  roadSpeed: number;

  /** 仙人掌预制件数组 */
  plantsArray: cc.Prefab[];

  /** 地面数组 */
  grounds: cc.Node[];

  /** 云数组 */
  clouds: cc.Node[];

  constructor(
    plantsArray: cc.Prefab[],
    grounds: cc.Node[],
    clouds: cc.Node[],
    cloudSpeed: number,
    roadSpeed: number
  ) {
    this.plantsArray = plantsArray;
    this.grounds = grounds;
    this.clouds = clouds;
    this.cloudSpeed = cloudSpeed;
    this.roadSpeed = roadSpeed;
  }

  /** 背景移动 */
  backgroundMove() {
    this.clouds[0].x -= this.cloudSpeed;
    this.clouds[1].x -= this.cloudSpeed;
    this.grounds[0].x -= this.roadSpeed;
    this.grounds[1].x -= this.roadSpeed;
  }
  /** 地面位置更新 */
  groundsPositionUpdate() {
    if (this.grounds[0].x <= -480) {
      this.grounds[0].setPosition(this.grounds[0].x + 4800, this.grounds[0].y);
      instiatePrefab(this.grounds[0], this.plantsArray);
    }
    if (this.grounds[1].x <= -480) {
      this.grounds[1].setPosition(this.grounds[1].x + 4800, this.grounds[0].y);
      instiatePrefab(this.grounds[1], this.plantsArray);
    }
  }

  /** 云位置更新 */
  cloudsPositionUpdate() {
    if (this.clouds[0].x <= -600) {
      this.clouds[0].setPosition(this.clouds[0].x + 1150, this.clouds[0].y);
    }
    if (this.clouds[1].x <= -680) {
      this.clouds[1].setPosition(this.clouds[1].x + 1200, this.clouds[1].y);
    }
  }

  /** 整体舞台移动控制 */
  stageMove() {
    this.backgroundMove();
    this.groundsPositionUpdate();
    this.cloudsPositionUpdate();
  }

  /** 移除地面所有子节点 */
  groundsRemoveChildren() {
    this.grounds[0].removeAllChildren();
    this.grounds[1].removeAllChildren();
  }
}
