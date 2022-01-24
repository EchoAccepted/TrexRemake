/** 舞台节点控制 */

import instiatePrefab from "./InstiatePrefab";
import Global, { GameState } from "./Global";
const { ccclass, property } = cc._decorator;

@ccclass
export default class StageController extends cc.Component {
  /** 云移动速度 */
  @property
  cloudSpeed: number = 0;

  /** 路移动速度 */
  @property
  roadSpeed: number = 0;

  /** 仙人掌预制件数组 */
  @property([cc.Prefab])
  plantsArray: cc.Prefab[] = new Array();

  /** 地面数组 */
  @property([cc.Node])
  grounds: cc.Node[] = new Array();

  /** 云数组 */
  @property([cc.Node])
  clouds: cc.Node[] = new Array();

  onLoad() {
    this.stageInit();
  }

  /** 初始化舞台 */
  stageInit() {
    instiatePrefab(this.grounds[1], this.plantsArray);
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

  /** 舞台重置 */
  stageReinit() {
    this.groundsRemoveChildren();
    if (this.grounds[1].x <= 0) {
      instiatePrefab(this.grounds[1], this.plantsArray);
    } else {
      instiatePrefab(this.grounds[0], this.plantsArray);
    }
  }

  /** 移除地面所有子节点 */
  groundsRemoveChildren() {
    this.grounds[0].removeAllChildren();
    this.grounds[1].removeAllChildren();
  }

  /**  */
  update() {
    if (Global.gameState === GameState.playing) this.stageMove();
  }
}
