document.addEventListener('DOMContentLoaded', () => {
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
        }
    }

    class Job {
        constructor(name, baseStats) {
            this.name = name;
            this.baseStats = baseStats;
        }
    }

    class Item {
        constructor(name, hp, attack, defense, speed, price) {
            this.name = name;
            this.hp = hp;
            this.attack = attack;
            this.defense = defense;
            this.speed = speed;
            this.price = price;
        }
    }

    const jobs = {
        villager: new Job('村人', { hp: 100, attack: 10, defense: 5, speed: 5 })
    };

    const items = [
        new Item('剣', 0, 10, 0, 0, 100),
        new Item('盾', 0, 0, 10, 0, 100),
        new Item('靴', 0, 0, 0, 10, 100)
    ];

    const player = new Player('プレイヤー', jobs.villager, 100, 10, 5, 5);

    function updatePlayerStats() {
        const playerStatsElem = document.getElementById('playerStats');
        playerStatsElem.innerHTML = `
            名前: ${player.name}<br>
            ジョブ: ${player.job.name}<br>
            HP: ${player.hp}<br>
            攻撃力: ${player.attack}<br>
            防御力: ${player.defense}<br>
            素早さ: ${player.speed}<br>
            お金: ${player.money}<br>
            経験値: ${player.exp}
        `;
    }

    function showStore() {
        const storeElem = document.getElementById('store');
        const storeItemsElem = document.getElementById('storeItems');
        storeItemsElem.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} (+HP: ${item.hp}, +攻撃力: ${item.attack}, +防御力: ${item.defense}, +素早さ: ${item.speed}) - ${item.price}G`;
            li.addEventListener('click', () => {
                if (player.money >= item.price) {
                    player.money -= item.price;
                    player.hp += item.hp;
                    player.attack += item.attack;
                    player.defense += item.defense;
                    player.speed += item.speed;
                    player.inventory.push(item);
                    updatePlayerStats();
                    logMessage(`${item.name}を購入した！`);
                } else {
                    logMessage('お金が足りません！');
                }
            });
            storeItemsElem.appendChild(li);
        });
        storeElem.style.display = 'block';
    }

    function logMessage(message) {
        const logElem = document.getElementById('battleLog');
        logElem.innerHTML += `<div>${message}</div>`;
    }

    document.getElementById('storeButton').addEventListener('click', showStore);
    document.getElementById('adventureButton').addEventListener('click', startAdventure);
    document.getElementById('closeStore').addEventListener('click', () => {
        document.getElementById('store').style.display = 'none';
    });

    function startAdventure() {
        const monster = new Entity('ゴブリン', 50, 8, 3, 6);
        logMessage(`${monster.name}が現れた！`);

        const playerAttack = player.attack - monster.defense;
        const monsterAttack = monster.attack - player.defense;

        if (playerAttack > 0) {
            monster.hp -= playerAttack;
        }
        if (monsterAttack > 0) {
            player.hp -= monsterAttack;
        }

        if (monster.hp <= 0) {
            logMessage(`${monster.name}を倒した！ 経験値とお金を得た！`);
            player.exp += 10;
            player.money += 20;
        }

        if (player.hp <= 0) {
            logMessage('プレイヤーは死んでしまった...');
            player.hp = player.job.baseStats.hp;
        }

        updatePlayerStats();
    }

    updatePlayerStats();
});
