document.addEventListener('DOMContentLoaded', () => {
    class Entity {
        constructor(name, hp, attack, defense, speed) {
            this.name = name;
            this.hp = hp;
            this.fullHp = hp; // モンスターのHPを保存
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
            this.abilities = job.abilities;
        }

        changeJob(newJob) {
            this.job = newJob;
            this.hp = newJob.baseStats.hp;
            this.attack = newJob.baseStats.attack;
            this.defense = newJob.baseStats.defense;
            this.speed = newJob.baseStats.speed;
            this.abilities = newJob.abilities;
        }

        useAbility(ability, target) {
            if (this.abilities.includes(ability) && typeof ability.use === 'function') {
                ability.use(this, target);
                logMessage(`${this.name}は${ability.name}を使った！`);
            }
        }

        chooseAction(target) {
            const useAbilityChance = 0.3; // 30%の確率でアビリティを使用
            if (this.abilities.length > 0 && Math.random() < useAbilityChance) {
                const ability = this.abilities[Math.floor(Math.random() * this.abilities.length)];
                this.useAbility(ability, target);
            } else {
                const damage = Math.max(this.attack - target.defense, 0);
                target.hp -= damage;
                logMessage(`${this.name}の攻撃！${target.name}に${damage}のダメージ！`);
            }
        }
    }

    class Job {
        constructor(name, baseStats, abilities = []) {
            this.name = name;
            this.baseStats = baseStats;
            this.abilities = abilities;
        }
    }

    class Ability {
        constructor(name, use) {
            this.name = name;
            this.use = use;
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

    const heal = new Ability('回復', (user, target) => {
        target.hp = Math.min(target.hp + 50, user.job.baseStats.hp);
    });

    const fireball = new Ability('ファイアボール', (user, target) => {
        target.hp -= Math.max(user.attack * 2 - target.defense, 0);
    });

    const jobs = {
        villager: new Job('村人', { hp: 100, attack: 10, defense: 5, speed: 5 }),
        knight: new Job('騎士', { hp: 200, attack: 30, defense: 20, speed: 10 }, [heal]),
        mage: new Job('魔法使い', { hp: 80, attack: 50, defense: 5, speed: 15 }, [fireball])
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

    function showElement(elementId) {
        const elements = document.querySelectorAll('#store, #temple');
        elements.forEach(element => {
            if (element.id === elementId) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    function showStore() {
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
        showElement('store');
    }

    function showTemple() {
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
                    showElement(null); // 非表示にする
                } else {
                    logMessage('経験値が足りません！');
                }
            });
            jobListElem.appendChild(li);
        }
        showElement('temple');
    }

    function logMessage(message) {
        const logElem = document.getElementById('battleLog');
        const newLogEntry = document.createElement('div');
        newLogEntry.textContent = message;
        logElem.appendChild(newLogEntry);

        // ログが10行を超えたら最古のエントリを削除
        while (logElem.children.length > 10) {
            logElem.removeChild(logElem.firstChild);
        }
    }

    document.getElementById('storeButton').addEventListener('click', showStore);
    document.getElementById('adventureButton').addEventListener('click', startAdventure);
    document.getElementById('templeButton').addEventListener('click', showTemple);
    document.getElementById('closeStore').addEventListener('click', () => {
        showElement(null); // 非表示にする
    });
    document.getElementById('closeTemple').addEventListener('click', () => {
        showElement(null); // 非表示にする
    });
    document.getElementById('saveButton').addEventListener('click', saveGame);
    document.getElementById('loadButton').addEventListener('click', loadGame);

    function startAdventure() {
        if (currentMonsterIndex >= monsters.length) {
            logMessage("全てのモンスターを倒しました！");
            return;
        }

        const monster = monsters[currentMonsterIndex];
        monster.hp = monster.fullHp; // モンスターのHPをリセット
        logMessage(`${monster.name}が現れた！`);

        while (player.hp > 0 && monster.hp > 0) {
            player.chooseAction(monster);

            if (monster.hp <= 0) {
                logMessage(`${monster.name}を倒した！経験値とお金を得た！`);
                player.exp += 10;
                player.money += 20;
                currentMonsterIndex++;

                if (currentMonsterIndex < monsters.length) {
                    logMessage(`${monsters[currentMonsterIndex].name}が次に出現します。`);
                }
                break;
            }

            const damage = Math.max(monster.attack - player.defense, 0);
            player.hp -= damage;
            logMessage(`${monster.name}の攻撃！${player.name}に${damage}のダメージ！`);

            if (player.hp <= 0) {
                logMessage('プレイヤーは死んでしまった...');
                // プレイヤーのHPを回復し、モンスターリストをリセット
                player.hp = player.job.baseStats.hp;
                currentMonsterIndex = 0;
                logMessage('最初のモンスターから再挑戦します！');
                break;
            }
        }

        updatePlayerStats();
    }

    function saveGame() {
        const gameState = {
            player: {
                name: player.name,
                job: player.job.name,
                hp: player.hp,
                attack: player.attack,
                defense: player.defense,
                speed: player.speed,
                money: player.money,
                exp: player.exp,
                inventory: player.inventory.map(item => item.name)
            },
            currentMonsterIndex
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        logMessage('ゲームを保存しました。');
    }

    function loadGame() {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);

            player.name = gameState.player.name;
            player.changeJob(jobs[gameState.player.job]);
            player.hp = gameState.player.hp;
            player.attack = gameState.player.attack;
            player.defense = gameState.player.defense;
            player.speed = gameState.player.speed;
            player.money = gameState.player.money;
            player.exp = gameState.player.exp;
            player.inventory = gameState.player.inventory.map(itemName => items.find(item => item.name === itemName));
            currentMonsterIndex = gameState.currentMonsterIndex;

            updatePlayerStats();
            logMessage('ゲームをロードしました。');
        } else {
            logMessage('保存されたゲームがありません。');
        }
    }

    updatePlayerStats();

    // プル・トゥ・リフレッシュの防止
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        const touchMoveY = e.touches[0].clientY;
        const touchDiff = touchMoveY - touchStartY;

        if (window.scrollY === 0 && touchDiff > 0) {
            e.preventDefault();
        }
    }, { passive: false });

    document.body.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) { return; }
        const startY = event.touches[0].clientY;
        let prevent = false;

        document.body.addEventListener('touchmove', (eventMove) => {
            const y = eventMove.touches[0].clientY;
            const yDiff = y - startY;

            if (yDiff > 0 && document.documentElement.scrollTop === 0) {
                prevent = true;
                eventMove.preventDefault();
            }
        }, { passive: false });

        document.body.addEventListener('touchend', (eventEnd) => {
            if (prevent) {
                eventEnd.preventDefault();
                prevent = false;
            }
        });
    }, { passive: false });
});
