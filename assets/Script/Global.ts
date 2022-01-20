import TrexMove from "./ActionClass";

enum PlayStatus {
  playing,
  stoped,
}

enum LifeStatus {
  alive,
  dead,
}

interface Global {
  playStatus: PlayStatus;
  lifeStatus: LifeStatus;
  JumpAnimate: cc.Tween;
  valid: boolean;
  moveAction: TrexMove;
  historyRecord: number;
  initial: boolean;
}

const global: Global = {
  playStatus: PlayStatus.stoped,
  lifeStatus: LifeStatus.alive,
  JumpAnimate: null,
  valid: true,
  moveAction: null,
  historyRecord: 0,
  initial: true,
};

export default global;
export { PlayStatus, LifeStatus };
