const player = {
  hp: 100,
  attack: 10,
  level: 1,
  exp: 0,
  money: 0,
  expToNextLevel: 100,
  maxHp: 100
};

let enemy = createEnemy();

function createEnemy() {
  const baseHP = 50 * player.level;
  const baseAttack = 5 * player.level;
  return { 
    hp: baseHP, 
    attack: baseAttack, 
    exp: player.level * 20, 
    money: player.level * 30 
  };
}

function updateStatus() {
  document.getElementById('status').innerText = 
    `HP: ${player.hp}, 攻撃力: ${player.attack}, レベル: ${player.level}, EXP: ${player.exp}, お金: ${player.money}`;
  document.getElementById('enemy').innerText = 
    `敵 HP: ${enemy.hp}, 攻撃力: ${enemy.attack}`;
}

function levelUp() {
  if (player.exp >= player.expToNextLevel) {
    player.level += 1;
    player.exp -= player.expToNextLevel;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.5);
    player.attack += 5; // レベルアップ時の攻撃力増加
    player.maxHp += 20; // レベルアップ時の最大HP増加
    player.hp = player.maxHp;
    logMessage(`レベルアップ！ レベル: ${player.level}`);
  }
}

function logMessage(message) {
  const logContainer = document.getElementById('log');
  const log = document.createElement('p');
  log.innerText = message;
  logContainer.appendChild(log);

  // 10行以上のログがある場合、最も古いものを削除
  while (logContainer.children.length > 10) {
    logContainer.removeChild(logContainer.children[0]);
  }
}

document.getElementById('fightButton').addEventListener('click', () => {
  while (player.hp > 0 && enemy.hp > 0) {
    enemy.hp -= player.attack;
    logMessage(`プレイヤーが攻撃し、敵に ${player.attack} のダメージを与えた。`);
    if (enemy.hp > 0) {
      player.hp -= enemy.attack;
      logMessage(`敵が攻撃し、プレイヤーに ${enemy.attack} のダメージを与えた。`);
    }
  }

  if (player.hp > 0) {
    player.exp += enemy.exp;
    player.money += enemy.money;
    logMessage(`敵を倒した！ EXP: ${enemy.exp}, お金: ${enemy.money}`);
    enemy = createEnemy();
  } else {
    logMessage("プレイヤーは死亡しました。");
    // ゲームオーバー処理
    player.hp = player.maxHp;
    player.exp = 0;
    //player.money = 0;
    player.level = 1;
    player.attack = 10;
    player.maxHp = 100;
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
    player.maxHp += 20;  // 防具購入で最大HP +20
    logMessage("最大HPが 20 増加しました。");
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
