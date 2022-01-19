import global from './Global';


  // 实例化预制件
export default function instiatePrefab(ground: cc.Node,plantsArray:cc.Prefab[]) {
    if (ground.children.length > 0) {
        ground.removeAllChildren();
      }
      const randomNums = Math.floor(Math.random() * (6 - 3)) + 3;
      for (let i = 0; i < randomNums; i++) {
        const tempRandom = Math.floor(
          !global.initial ? Math.random() * 6 : Math.random() * 4
        );
        const tempNode = cc.instantiate(plantsArray[tempRandom]);
        tempNode.parent = ground;
        tempNode.setPosition(
          -(
            (2400 / randomNums) * (i + 1) +
            Math.random() * 100 * (Math.random() >= 0.5 ? -1 : 1)
          ),
          0
        );
      }
      global.initial = false;
}