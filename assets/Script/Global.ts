/** 定义一些全局变量 */
/**
 * GameStatus枚举，{playing,stopped}
 * playing代表正在进行游戏，可操作；
 * stoped代表游戏未开始或结束，不可操作
 */
export enum GameState {
  /** 初始化 */
  initial,
  /** 游戏正在进行 */
  playing,
  /** 游戏未开始或结束 */
  stopped,
}

/** Global 接口，规范global对象及其property类型 */
interface Global {
  gameState: GameState;
  canPressSpace: boolean;
  historyRecord: number;
  dinoHealth: number;
}

/** global全局对象 */
const global: Global = {
  /** 游戏运行状态 */
  gameState: GameState.initial,
  /** 是否触发按键事件 */
  canPressSpace: true,
  /** 历史分数记录 */
  historyRecord: 0,
  /** 恐龙生命值 */
  dinoHealth: 3,
};

export default global;
