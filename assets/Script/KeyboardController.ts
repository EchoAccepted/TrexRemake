/** 控制键盘事件 */
import global, { GameStatus, PlayerStatus } from "./Global";

/** 重置全局变量 */
function resetGlobalState() {
  global.canPressSpace = true;
  global.gameStatus = GameStatus.playing;
  global.playerStatus = PlayerStatus.alive;
  global.initial = true;
}

/** 重新开始游戏 */
export function restart(resetButton: cc.Button) {
  resetGlobalState();
  global.dinoActionController.dinoReborn();
  global.stageController.groundsRemoveChildren();
  global.scoreController.currentAnimationStart();
  resetButton.node.y = -500;
}

export default function KeyboardController(
  event: cc.Event.EventKeyboard,
  resetBtn: cc.Button
) {
  if (event.keyCode === cc.macro.KEY.space) {
    /** 游戏未开始，玩家存活 */
    if (
      global.gameStatus === GameStatus.stopped &&
      global.playerStatus === PlayerStatus.alive
    ) {
      global.gameStatus = GameStatus.playing;
      global.scoreController.currentAnimationStart();
      global.JumpAnimate = global.dinoActionController.dinoJump();
      global.JumpAnimate.call(() => {
        global.canPressSpace = true;
        global.dinoActionController.dinoMove();
      }).start();
    } 
    /** 游戏正在运行且玩家存活 */ 
    else if (
      global.gameStatus === GameStatus.playing &&
      global.playerStatus === PlayerStatus.alive
    ) {
      global.JumpAnimate = global.dinoActionController
        .dinoJump()
        .call(() => {
          global.canPressSpace = true;
        })
        .start();
    } 
    /** 游戏结束玩家死亡 */ 
    else if (
      global.gameStatus === GameStatus.stopped &&
      global.playerStatus === PlayerStatus.dead
    ) {
      restart(resetBtn);
    }
  }
}
