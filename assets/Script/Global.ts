/** 定义一些全局变量 */

import DinoAnimateClass from "./DinoAnimateClass";
import DinoActionClass from "./DinoActionClass";
/**
 * PlayStatus枚举，{playing,stopped}
 * playing代表正在进行游戏，可操作；
 * stoped代表游戏未开始或结束，不可操作
 */
enum PlayStatus {
  playing,
  stopped,
}

/**
 * LifeStatus枚举，{alive,dead}
 * alive代表玩家角色存活；
 * dead代表玩家角色死亡
 */
enum LifeStatus {
  alive,
  dead,
}
/** Global 接口，规范global对象及其property类型 */
interface Global {
  playStatus: PlayStatus;
  lifeStatus: LifeStatus;
  JumpAnimate: cc.Tween;
  valid: boolean;
  dinoAnimateAction: DinoAnimateClass;
  dinoAction: DinoActionClass;
  historyRecord: number;
  initial: boolean;
}

/** global全局对象 */
const global: Global = {
  playStatus: PlayStatus.stopped,
  lifeStatus: LifeStatus.alive,
  JumpAnimate: null,
  valid: true,
  dinoAnimateAction: null,
  dinoAction: null,
  historyRecord: 0,
  initial: true,
};

export default global;
export { PlayStatus, LifeStatus };
