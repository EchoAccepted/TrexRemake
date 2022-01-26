const { ccclass, property } = cc._decorator;

export enum GameState {
  initial,
  playing,
  stopped,
}

@ccclass
export default class GameController extends cc.Component {
  public static gameState: GameState = GameState.initial;

  onLoad() {
    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    cc.view.resizeWithBrowserSize(true);
    //cc.view.enableAutoFullScreen(true);
    cc.view.enableAntiAlias(true);
  }

  public static gameInitial() {
    GameController.gameState = GameState.initial;
  }

  public static gamePlaying() {
    GameController.gameState = GameState.playing;
  }

  public static gameStopped() {
    GameController.gameState = GameState.stopped;
  }
}
