/** 定义一些全局变量 */

import DinoActionControllerClass from "./DinoActionController";
import ScoreControllerClass from "./ScoreController";
import StageController from "./StageController";
/**
 * GameStatus枚举，{playing,stopped}
 * playing代表正在进行游戏，可操作；
 * stoped代表游戏未开始或结束，不可操作
 */
enum GameStatus {
  /** 游戏正在进行 */
  playing,
  /** 游戏未开始或结束 */
  stopped,
}

/**
 * PlayerStatus枚举，{alive,dead}
 * alive代表玩家角色存活；
 * dead代表玩家角色死亡
 */
enum PlayerStatus {
  /** 存活*/
  alive,
  /** 死亡 */
  dead,
}
/** Global 接口，规范global对象及其property类型 */
interface Global {
  gameStatus: GameStatus;
  playerStatus: PlayerStatus;
  JumpAnimate: cc.Tween;
  canPressSpace: boolean;
  historyRecord: number;
  initial: boolean;
  dinoActionController: DinoActionControllerClass;
  scoreController: ScoreControllerClass;
  stageController: StageController;
}

/** global全局对象 */
const global: Global = {
  /** 游戏运行状态 */
  gameStatus: GameStatus.stopped,
  /** 玩家生存状态 */
  playerStatus: PlayerStatus.alive,
  /** 跳跃动画 */
  JumpAnimate: null,
  /** 是否触发按键事件 */
  canPressSpace: true,
  /** 历史分数记录 */
  historyRecord: 0,
  /** 游戏是否为初始化 */
  initial: true,
  /** 恐龙动作控制方法 */
  dinoActionController: null,
  /** 舞台控制方法 */
  stageController: null,
  /** 分数节点控制器 */
  scoreController: null,
};

export default global;
export { GameStatus, PlayerStatus };
