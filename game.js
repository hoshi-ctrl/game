const player = {
  hp: 100,
  attack: 10,
  level: 1,
  exp: 0,
  money: 0,
  expToNextLevel: 100,
};

let enemy = createEnemy();

function createEnemy() {
  const baseHP = 50 * player.level;
  const baseAttack = 5 * player.level;
  return { hp: baseHP, attack: baseAttack, exp: player.level * 20, money: player.level * 30 };
}

function updateStatus() {
  document.getElementById('status').innerText = `HP: ${player.hp}, 攻撃力: ${player.attack}, レベル: ${player.level}, EXP: ${player.exp}, お金: ${player.money}`;
  document.getElementById('enemy').innerText = `敵 HP: ${enemy.hp}, 攻撃力: ${enemy.attack}`;
}

function levelUp() {
  if (player.exp >= player.expToNextLevel) {
    player.level += 1;
    player.exp -= player.expToNextLevel;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.5); // 次のレベルまでのEXPを増加させる
    logMessage("レベルアップ！ レベル: " + player.level);
  }
}

function logMessage(message) {
  const log = document.getElementById('log');
  if (log) { // 要素が存在する場合だけ実行
    log.innerText += `${message}`;
  } else {
    console.error("log要素が見つかりません。");
  }
}

document.getElementById('fightButton').addEventListener('click', () => {
  while (player.hp > 0 && enemy.hp > 0) {
    enemy.hp -= player.attack;
    if (enemy.hp > 0) {
      player.hp -= enemy.attack;
    }
  }

  if (player.hp > 0) {
    player.exp += enemy.exp;
    player.money += enemy.money;
    logMessage("敵を倒した！ EXP: " + enemy.exp + ", お金: " + enemy.money);
    enemy = createEnemy();
    player.hp = 100; // 戦闘後にHPを最大値に回復
  } else {
    logMessage("プレイヤーは死亡しました。");
    // ゲームオーバー処理
    player.hp = 100;
    player.exp = 0;
    player.money = 0;
    player.level = 1;
    enemy = createEnemy(); // 敵をリセット
  }

  levelUp();
  updateStatus();
});

document.getElementById('buyWeaponButton').addEventListener('click', () => {
  if (player.money >= 100) {
    player.money -= 100;
    player.attack += 10;  // 武器購入で攻撃力 +10
    logMessage("攻撃力が 10 増加しました。");
  } else {
    logMessage("お金が足りません。");
  }
  updateStatus();
});

document.getElementById('buyArmorButton').addEventListener('click', () => {
  if (player.money >= 100) {
    player.money -= 100;
    player.hp += 20;  // 防具購入でHP +20
    logMessage("HP が 20 増加しましたが、HPの最大値は100です。");
    if (player.hp > 100) player.hp = 100; // HPの最大値を制限
  } else {
    logMessage("お金が足りません。");
  }
  updateStatus();
});

document.getElementById('saveButton').addEventListener('click', () => {
  const saveData = JSON.stringify(player);
  localStorage.setItem('gameSave', saveData);
  logMessage("ゲームデータが保存されました。");
});

function loadGame() {
  const saveData = localStorage.getItem('gameSave');
  if (saveData) {
    const savedPlayer = JSON.parse(saveData);
    Object.assign(player, savedPlayer);
    logMessage("ゲームデータがロードされました。");
    updateStatus();
  }
}

// 画面読み込み時に保存されたデータをロード
window.addEventListener('load', loadGame);
updateStatus();
// 画面読み込み時に保存されたデータをロード
window.addEventListener('load', loadGame);
updateStatus();
