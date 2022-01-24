/** 实例化植物预制件 */
import Global, { GameState } from "./Global";
export default function instiatePrefab(
  ground: cc.Node,
  plantsArray: cc.Prefab[]
) {
  if (ground.children.length > 0) {
    ground.removeAllChildren();
  }
  /**
   * 生成随机节点数量
   */
  const randomNums = Math.floor(Math.random() * (6 - 3)) + 3;
  for (let i = 0; i < randomNums; i++) {
    /**
     * 生成随机的植物节点index：
     * 若是初始化则生成一个0-4的整数
     * 若不是则生成一个0-6的整数
     */
    const tempRandom = Math.floor(
      Global.gameState === GameState.initial
        ? Math.random() * 6
        : Math.random() * 4
    );
    const tempNode = cc.instantiate(plantsArray[tempRandom]);
    tempNode.parent = ground;
    /**
     * 对生成的节点位置进行控制：
     * 获取随机生成的节点数量，得到平均的每个节点距离，再通过随机生成-100～100的数值对距离赋予一定的差值
     */
    tempNode.setPosition(
      -(
        (2400 / randomNums) * (i + 1) +
        Math.random() * 100 * (Math.random() >= 0.5 ? -1 : 1)
      ),
      0
    );
  }
}
