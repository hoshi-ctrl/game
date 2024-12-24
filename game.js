document.addEventListener('DOMContentLoaded', () => {
    // 基本のプレイヤー/ジョブ/モンスタークラス
    class Entity {
        constructor(name, hp, attack, defense, speed) {
            this.name = name;
            this.hp = hp;
            this.attack = attack;
            this.defense = defense;
            this.speed = speed;
        }
    }

    class Player extends Entity {
        constructor(name, job, hp, attack, defense, speed, money = 0, exp = 0) {
            super(name, hp, attack, defense, speed);
            this.job = job;
            this.money = money;
            this.exp = exp;
            this.inventory = [];
            this.level = 1;
        }
    }

    class Monster extends Entity {
        constructor(name, hp, attack, defense, speed) {
            super(name, hp, attack, defense, speed);
        }
    }

    class Job {
        constructor(name, baseStats, abilities = []) {
            this.name = name;
            this.baseStats = baseStats;
            this.abilities = abilities;
        }
    }

    class Item {
        constructor(name, hp, attack, defense, speed, ability = null) {
            this.name = name;
            this.hp = hp;
            this.attack = attack;
            this.defense = defense;
            this.speed = speed;
            this.ability = ability;
        }
    }

    // ジョブ定義
    const jobs = {
        villager: new Job('村人', {hp: 100, attack: 10, defense: 5, speed: 5}),
        knight: new Job('騎士', {hp: 200, attack: 30, defense: 20, speed: 10}),
        // 他のジョブも追加可能
    };

    // 初期プレイヤーの生成
    const player = new Player('プレイヤー', jobs.villager, 100, 10, 5, 5);

    // ゲームの初期化
    function initGame() {
        updatePlayerStats();
        addEventListeners();
    }

    // プレイヤー情報の更新
    function updatePlayerStats() {
        const playerStatsElem = document.getElementById('playerStats');
        playerStatsElem.textContent = `
            名前: ${player.name}

            ジョブ: ${player.job.name}

            HP: ${player.hp}

            攻撃力: ${player.attack}

            防御力: ${player.defense}

            素早さ: ${player.speed}

            お金: ${player.money}

            経験値: ${player.exp}

            レベル: ${player.level}
        `;
    }

    // イベントリスナーの追加
    function addEventListeners() {
        document.getElementById('store').addEventListener('click', () => {
            showStore();
        });

        document.getElementById('temple').addEventListener('click', () => {
            showTemple();
        });

        document.getElementById('adventure').addEventListener('click', () => {
            startAdventure();
        });

        document.getElementById('save').addEventListener('click', () => {
            saveGame();
        });
    }

    // お店の表示
    function showStore() {
        // 実装例
        const inventoryElem = document.getElementById('inventory');
        inventoryElem.textContent = `
            お店の商品一覧:

            1. 剣 (+10 攻撃力)

            2. 盾 (+5 防御力)

        `;
    }

    // 冒険の開始（基本的な例）
    function startAdventure() {
        const logElem = document.getElementById('battleLog');
        logElem.textContent = `冒険に出た！
`;
        // 他のイベントもここに追加可能 (モンスターとの戦闘、宝箱など)
    }

    // ゲームの保存 (テキストの例)
    function saveGame() {
        const saveData = JSON.stringify(player);
        localStorage.setItem('rpgGameSave', saveData);
        alert('ゲームを保存しました！');
    }

    // ゲームの初期化を実行
    initGame();
});

// Start the drawing loop
drawHamster();
