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
        changeJob(newJob) {
            this.job = newJob;
            this.hp = newJob.baseStats.hp;
            this.attack = newJob.baseStats.attack;
            this.defense = newJob.baseStats.defense;
            this.speed = newJob.baseStats.speed;
        }
    }

    class Job {
        constructor(name, baseStats) {
            this.name = name;
            this.baseStats = baseStats;
            this.abilities = abilities;
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
        villager: new Job('村人', { hp: 100, attack: 10, defense: 5, speed: 5 }),
        knight: new Job('騎士', { hp: 200, attack: 30, defense: 20, speed: 10 }),
        mage: new Job('魔法使い', { hp: 80, attack: 50, defense: 5, speed: 15 })
    };

    const items = [
        new Item('剣', 0, 10, 0, 0, 100),
        new Item('盾', 0, 0, 10, 0, 100),
        new Item('靴', 0, 0, 0, 10, 100)
    ];

    const monsters = [
        new Entity('スライム', 30, 5, 2, 3),
        new Entity('ゴブリン', 50, 8, 3, 6),
        new Entity('オーク', 80, 15, 10, 5),
        new Entity('ドラゴン', 150, 30, 20, 10)
    ];

    let currentMonsterIndex = 0;
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

    function showTemple() {
        const templeElem = document.getElementById('temple');
        const jobListElem = document.getElementById('jobList');
        jobListElem.innerHTML = '';
        for (const jobName in jobs) {
            const job = jobs[jobName];
            const li = document.createElement('li');
            li.textContent = `${job.name} (HP: ${job.baseStats.hp}, 攻撃力: ${job.baseStats.attack}, 防御力: ${job.baseStats.defense}, 素早さ: ${job.baseStats.speed})`;
            li.addEventListener('click', () => {
                if (player.exp >= 50) { // ここでは50EXPでジョブを変更できる例
                    player.exp -= 50;
                    player.changeJob(job);
                    updatePlayerStats();
                    logMessage(`${job.name}にジョブが変更された！`);
                    templeElem.style.display = 'none';
                } else {
                    logMessage('経験値が足りません！');
                }
            });
            jobListElem.appendChild(li);
        }
        templeElem.style.display = 'block';
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
    document.getElementById('closeTemple').addEventListener('click', () => {
        document.getElementById('temple').style.display = 'none';
    });

    function startAdventure() {
        if(currentMonsterIndex >= monsters.length) {
            logMessage("全てのモンスターを倒しました！");
            return;
        }

        const monster = monsters[currentMonsterIndex];
        logMessage(`${monster.name}が現れた！`);

        while(player.hp > 0 && monster.hp > 0) {
            const playerAttack = Math.max(player.attack - monster.defense, 0);
            const monsterAttack = Math.max(monster.attack - player.defense, 0);

            monster.hp -= playerAttack;
            if(monster.hp <= 0) {
                logMessage(`${monster.name}を倒した！ 経験値とお金を得た！`);
                player.exp += 10;
                player.money += 20;
                currentMonsterIndex++;

                // 次のモンスターがいる場合は次の冒険で出現
                if (currentMonsterIndex < monsters.length) {
                    logMessage(`${monsters[currentMonsterIndex].name}が次に出現します。`);
                }

                break;
            }

            player.hp -= monsterAttack;
            if(player.hp <= 0) {
                logMessage('プレイヤーは死んでしまった...');
                // プレイヤーのHPを回復
                player.hp = player.job.baseStats.hp;
                break;
            }
        }

        updatePlayerStats();
    }

    updatePlayerStats();
});
