const gameText = document.querySelector('.gameText');
const narration = document.getElementById('narration');
const menu = document.querySelector('.menu');
const startButton = document.getElementById('startButton');
const map = document.querySelector('.grid-container');
const playerOnMap = document.getElementById('playerOnMap');
const form = document.getElementById('form');
const userInput = document.getElementById('userInput');
const a1 = document.getElementById('a1');
const a2 = document.getElementById('a2');
const a3 = document.getElementById('a3');
const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const b3 = document.getElementById('b3');
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const locations = [
    [a1, a2, a3],
    [b1, b2, b3],
    [c1, c2, c3]
];
const music = new Audio('assets/music.mp3');
const walking = new Audio('assets/walking.wav');
const attack = new Audio('assets/attack.wav');
const breakLock = new Audio('assets/break-lock.wav');
const doorOpen = new Audio('assets/door-open.wav');
const flashlight = new Audio('assets/flashlight.wav');
const key = new Audio('assets/key.wav');
const locked = new Audio('assets/locked.wav');
const match = new Audio('assets/match.wav');
const mystery = new Audio('assets/mystery.wav');
const can = new Audio('assets/can.wav');
const crowbar = new Audio('assets/crowbar.wav');
const swallow = new Audio('assets/swallow.wav')
const growl = new Audio('assets/growl.wav');
const paper = new Audio('assets/paper.wav');
const bat = new Audio('assets/bat.wav');
const ending = new Audio('assets/game-over.wav');
const killingBlow = new Audio('assets/killing-blow.wav');
const button = new Audio('assets/button-press.wav');
const takeKey = new Audio('assets/take-key.wav');
const zombie = new Audio('assets/zombie.wav');

currentLocation = locations[1][1];

const player = {
    alive: true,
    health: 10,
    stamina: 5,
    location: currentLocation,
    matchUsed: false,
    fed: false,
    usedCrowbar: false,
    usedCode: false,
    inventory: {
        match: false,
        flashlight: false,
        key: false,
        fed: false,
        crowbar: false,
    }
}

const boss = {
    health: 10,
    alive: true,
}

const rooms = ['up', 'bedroom', 'office',
    'foyer', 'living', 'kitchen', 'outside', 'leave',
    'basement', 'down', 'garage', 'front',
];

const stopInputs = ["window", "break", "tools", "screwdriver", "door", "unlock"];

const itemsArray = ["match", "flashlight", "key", "food", "number", "code", "combination", "crowbar", "bat", "button", "under"];

const bossFight = ["dodge", "move", "run", "escape", "hit", "attack", "swing", "kill"];

const validInputs = stopInputs.concat(rooms, itemsArray, bossFight);

const checkInput = (e) => {
    e.preventDefault();
    checkValidInput();
    for (const room of rooms) {
        if (userInput.value.includes(room)) {
            playerMove(room);
        }
    }
    for (const item of itemsArray) {
        if (userInput.value.includes(item)) {
            equipItem(item);
        }
    }
    for (const stop of stopInputs) {
        if (userInput.value.includes(stop)) {
            playerStop(stop);
        }
    }
    for (const action of bossFight) {
        if (userInput.value.includes(action)) {
            fightBoss(action);
        }
    }
    form.reset();
}

const playerMove = (room) => {
    switch (room) {
        case 'foyer': {
            if (player.inventory.flashlight === true) {
                currentLocation = locations[0][1];
                narration.innerText = 'You see the garage door, stairs leading up, and the living room.';
                showPlayer();
            } else if (player.matchUsed !== true) {
                narration.innerText = 'It is too dark to leave this room.';
            } else {
                currentLocation = locations[0][1];
                narration.innerText = 'You see a small flashlight on a table near the front door.';
                showPlayer();
            } break;
        }
        case 'living': {
            if (player.inventory.flashlight === true) {
                currentLocation = locations[1][1];
                narration.innerText = 'You see the foyer, a set of stairs leading down, and the kitchen.';
                showPlayer();
            } else {
                currentLocation = locations[1][1];
                narration.innerText = 'You are back in the dark living room.';
                showPlayer();
            } break;
        }
        case 'up': {
            if (currentLocation === locations[1][2] || currentLocation === locations[2][2]) {
                currentLocation = locations[1][1];
                narration.innerText = 'You return to the living room. The kitchen is to the right. The left, the foyer.';
                showPlayer();
            } else {
                if (player.inventory.flashlight === true) {
                    currentLocation = locations[0][0];
                    narration.innerText = 'You ascend the stairs. Ahead is what appears to be the master bedroom.';
                    showPlayer();
                } else if (currentLocation === locations[0][1] && player.inventory.flashlight !== true) {
                    narration.innerText = 'It would be too dangerous to take the stairs in the dark.';
                } else {
                    narration.innerText = 'You do not see any stairs.';
                }
            } break;
        }
        case 'bedroom': {
            if (player.inventory.flashlight !== true) {
                narration.innerText = `You can't see a bedroom from here.`
            } else {
                if (player.inventory.key === true) {
                    currentLocation = locations[0][0];
                    narration.innerText = 'The door to the bedroom stands before you. It is locked.';
                    showPlayer();
                } else {
                    tryLockedDoor();
                    setTimeout(function () {
                        growl.play();
                    }, 2500);
                    currentLocation = locations[0][0];
                    narration.innerText = 'You try the door. It is locked...you hear something on the other side.';
                    showPlayer();
                }
            } break;
        }
        case 'office': {
            if (player.inventory.key === true) {
                narration.innerText = `You probably don't need a broken computer.`;
            } else {
                if (player.usedCode === true) {
                    openDoor();
                    currentLocation = locations[2][0];
                    narration.innerText = 'You are back in the office';
                    showPlayer();
                } else if (player.inventory.combination === true) {
                    tryLockedDoor();
                    currentLocation = locations[2][1];
                    narration.innerText = 'You arrive at the door to the office. It is locked';
                    showPlayer();
                } else if (player.inventory.flashlight === true) {
                    tryLockedDoor();
                    currentLocation = locations[2][1];
                    narration.innerText = 'The door has a combination lock. You cannot enter. Maybe the combination is written on something.'
                    showPlayer();
                } else {
                    narration.innerText = 'If an office is near, it is too dark to find.';
                }
            } break;
        }
        case 'kitchen': {
            if (player.inventory.flashlight !== true) {
                currentLocation = locations[1][1];
                narration.innerText = 'It is dark and you are out of matches.';
                showPlayer();
            } else if (player.inventory.flashlight === true && player.fed !== true) {
                currentLocation = locations[2][1];
                narration.innerText = 'You see a door on the other side of the room. Maybe an office? The kitchen looks bare but there may be something edible here.';
                showPlayer();
            } else {
                currentLocation = locations[2][1];
                narration.innerText = 'You see the door to the office and the living room.';
                showPlayer();
            } break;
        }
        case 'garage': {
            if (player.inventory.flashlight !== true) {
                narration.innerText = 'It is too dark to find your way to the garage.';
            } else if (player.inventory.flashlight === true && player.inventory.crowbar === false) {
                openDoor();
                currentLocation = locations[0][2];
                narration.innerText = 'Inside the garage, you see lots of clutter. Under a pizza box in the corner you see a crowbar';
                showPlayer();
            } else if (player.inventory.combination !== true && player.inventory.crowbar === true) {
                openDoor();
                currentLocation = locations[0][2];
                narration.innerText = 'Maybe there is something else under all of this junk?';
                showPlayer();
            } else if (player.inventory.crowbar === true && player.inventory.combination === true) {
                openDoor();
                currentLocation = locations[0][2];
                narration.innerText = 'Nothing left but garbage.';
                showPlayer();
            } break;
        }
        case 'down': {
            if (currentLocation === locations[0][0] || currentLocation === locations[1][0]) {
                currentLocation = locations[0][1];
                narration.innerText = 'You go back down the stairs into the foyer again.';
                showPlayer();
            } else {
                if (player.inventory.flashlight === true) {
                    currentLocation = locations[1][2];
                    narration.innerText = 'You go downstairs. Before you is the basement door.';
                    showPlayer();
                } else {
                    currentLocation = locations[1][1];
                    narration.innerText = 'Better not risk falling down the stairs. Find some light.';
                    showPlayer();
                }
            } break;
        }
        case 'basement': {
            if (player.inventory.bat === true) {
                openDoor();
                currentLocation = locations[2][2];
                narration.innerText = 'Now is not the time to look for baseball cards.';
                showPlayer();
            } else {
                if (player.usedCrowbar === true) {
                    openDoor();
                    narration.innerText = 'You return to apprectiate the sports memorabilia.'
                    currentLocation = locations[2][2];
                    showPlayer();
                }
                if (player.inventory.flashlight === true && player.usedCrowbar === false) {
                    tryLockedDoor();
                    currentLocation = locations[1][2]
                    narration.innerText = 'The door is stuck shut. The lock is broken.';
                    showPlayer();
                } else if (player.inventory.flashlight === false) {
                    narration.innerText = 'You can not navigate this house in the dark.';
                    showPlayer();
                }
            } break;
        }
        case 'front':
        case 'leave':
        case 'outside': {
            if (boss.alive === true) {
                tryLockedDoor();
                narration.innerText = 'The front door is electronically locked with a heavy deadbolt. You can not open it.';
            } else if (boss.alive === false) {
                currentLocation = locations[0][1];
                showPlayer();
                openDoor();
                narration.innerText = 'You open the door and nothing is familiar. This is not the world you remember. This is chaos...';
                setTimeout(function () {
                    gameOver();
                }, 2000);
            } break;
        }
        default:
            narration.innerText = 'Nothing happened.';
    }
}

const equipItem = (item) => {
    switch (item) {
        case 'match': {
            if (currentLocation !== locations[1][1]) {
                narration.innerText = 'There are not any matches in this room.';
            } else {
                if (player.matchUsed === true) {
                    narration.innerText = 'You have already used the last match.';
                } else {
                    match.play();
                    player.inventory.match = true;
                    player.matchUsed = true;
                    narration.innerText = 'You strike the last match. Before the match fades you see the foyer and a darkened kitchen in the distance. The dying flame reflects off of what appears to be a flashlight by the front door.';
                }
            } break;
        }
        case 'flashlight': {
            if (player.matchUsed === false) {
                narration.innerText = 'It is dark. You see nothing around you.';
            } else {
                if (currentLocation === locations[1][1] && player.inventory.flashlight === false) {
                    walking.play();
                    setTimeout(function () {
                        flashlight.play();
                    }, 2000);
                    player.inventory.flashlight = true;
                    currentLocation = locations[0][1];
                    narration.innerText = 'You enter the foyer and take the flashlight. As you turn on the light, you see the door to a garage, a set of stairs leading up, and the living room from which you just came.';
                    showPlayer();
                } else if (currentLocation === locations[0][1] && player.inventory.flashlight === false) {
                    flashlight.play();
                    player.inventory.flashlight = true;
                    narration.innerText = 'You take the flashlight. As you turn on the light, you see the door to a garage, a set of stairs leading up, and the living room from which you just came.';
                } else {
                    narration.innerText = 'You already have the flashlight.';
                }
            } break;
        }
        case 'key': {
            if (currentLocation === locations[0][0] && player.inventory.key === true) {
                currentLocation = locations[1][0];
                narration.innerText = 'As you turn the key, the noise from inside goes silent. You cautiously enter the room. With a gasping roar, a maniacal man lunges for you from the other side of the bed!';
                key.play();
                setTimeout(function () {
                    zombie.play();
                }, 1500);
                showPlayer();
            } else {
                if (currentLocation === locations[2][0] && player.inventory.key === false) {
                    player.inventory.key = true;
                    takeKey.play();
                    narration.innerText = 'You pocket the key.';
                } else {
                    narration.innerText = 'You do not see a key.';
                }
            } break;
        }
        case 'food': {
            if (currentLocation != locations[2][1]) {
                narration.innerText = 'There is no food in here.';
            } else {
                swallow.play();
                setTimeout(function () {
                    can.play();
                }, 2000);
                player.fed = true;
                narration.innerText = 'You eat a can of peaches. Millions of peaches. You feel better.';
            } break;
        }
        case 'code':
        case 'number':
        case 'under':
        case 'combination': {
            if (currentLocation === locations[2][1] && player.inventory.combination === true) {
                currentLocation = locations[2][0];
                player.usedCode = true;
                narration.innerText = 'The combination works! Inside the office is a disheveled desk; a smashed computer lies in a heap on the side of the room. You see a key on the desk.';
                showPlayer();
            } else {
                if (currentLocation != locations[0][2]) {
                    narration.innerText = 'You do not find anything resembling a combination number.';
                } else {
                    paper.play();
                    player.inventory.combination = true;
                    narration.innerText = 'You find a sliver of paper in a pile of empty soda cases. Who lives here? Written on it are three numbers. You keep the paper.';
                }
            } break;
        }
        case 'bat': {
            if (currentLocation != locations[2][2]) {
                narration.innerText = 'This room does not contain sports equipment.';
            } else {
                bat.play();
                player.inventory.bat = true;
                narration.innerText = 'You grab the baseball bat.';
            } break;
        }
        case 'crowbar': {
            if (currentLocation === locations[1][2] && player.fed === true) {
                currentLocation = locations[2][2];
                narration.innerText = 'You loudly break the lock free and the basement door swings open. Was that a crashing upstairs? The owner has baseball equipment stored here.';
                player.usedCrowbar = true;
                breakLock.play();
                setTimeout(function () {
                    mystery.play();
                }, 1500);
                showPlayer();
            } else if (currentLocation === locations[1][2]) {
                locked.play();
                narration.innerText = 'You try to force the lock open but in your weakened state, you fail.';
            } else if (currentLocation === locations[0][2]) {
                crowbar.play();
                player.inventory.crowbar = true;
                narration.innerText = 'You now have a crowbar.';
            } else {
                narration.innerText = 'There is no crowbar in sight.';
            } break;
        }
        case 'button': {
            if (currentLocation != locations[1][0]) {
                narration.innerText = 'What button?';
            } else if (boss.alive === false) {
                button.play();
                narration.innerText = 'You hear a loud click downstairs. This must unlock the front door. What is out there?';
            } break;
        }
        default: {
            narration.innerText = 'What do you want to do?';
        }
    }
}

const playerStop = (stop) => {
    switch (stop) {
        case 'window': {
            narration.innerText = 'All the windows are securely boarded shut.';
            break;
        }
        case 'break': {
            if (currentLocation === locations[1][2] && player.inventory.crowbar === true && player.fed === true) {
                currentLocation = locations[2][2];
                narration.innerText = 'You loudly break the frozen lock and the basement door swings open. Was that a crashing upstairs? The owner has baseball equipment stored here.';
                player.usedCrowbar = true;
                breakLock.play();
                setTimeout(function () {
                    mystery.play();
                }, 1500);
                showPlayer();
            } else {
                narration.innerText = 'It does not break.';
            } break;
        }
        case 'tools': {
            narration.innerText = `You don't see any useful tools.`;
            break;
        }
        case 'screwdriver': {
            narration.innerText = 'The screwdriver does not exist.';
            break;
        }
        case 'door': {
            if (boss.alive === true) {
                narration.innerText = 'Which room are you trying to enter?';
            } break;
        }
        case 'unlock': {
            if (currentLocation === locations[0][0] || currentLocation === locations[2][1]) {
                narration.innerText = 'How do you attempt to unlock this?';
            } else {
                narration.innerText = 'What do you want to unlock?';
            } break;
        }
        case 'inside': {
            narration.innerText = 'Which room would you like to enter?';
        }
    }
}

const fightBoss = (action) => {
    switch (action) {
        case 'hit':
        case 'attack':
        case 'swing':
        case 'kill': {
            if (currentLocation !== locations[1][0]) {
                narration.innerText = 'There is nothing to attack.';
            } else {
                if (player.inventory.bat !== true && player.fed !== true) {
                    unarmedAttack();
                    checkBossHealth();
                    checkPlayerHealth();
                } else if (player.inventory.bat !== true && player.fed === true) {
                    strongUnarmedAttack();
                    checkBossHealth();
                    checkPlayerHealth();
                } else if (player.inventory.bat === true && player.fed !== true) {
                    armedAttack();
                    checkBossHealth();
                    checkPlayerHealth();
                } else if (player.inventory.bat === true && player.fed === true) {
                    strongArmedAttack();
                    checkBossHealth();
                    checkPlayerHealth();
                }
            } break;
        }
        case 'run':
        case 'escape': {
            if (currentLocation !== locations[1][0]) {
                narration.innerText = 'Where would you like to run?';
            }
            break;
        }
        case 'dodge':
        case 'move': {
            if (currentLocation !== locations[1][0]) {
                narration.innerText = 'Where do you want to go?';
            } else {
                if (player.stamina > 0) {
                    player.stamina -= 1; ``
                    narration.innerText = 'You manage to get out of the way as he tries to grab you!';
                } else if (player.stamina === 0) {
                    player.alive = false;
                    gameOver();
                }
            }
            break;
        }
    }
}

const checkValidInput = () => {
    let array = userInput.value.split(' ');
    if (array.some(v => validInputs.includes(v)) !== true) {
        narration.innerText = 'Maybe you should try something else?';
    }
}

const showPlayer = () => {
    currentLocation.appendChild(playerOnMap);
    walking.play();
}

const openDoor = () => {
    setTimeout(function () {
        doorOpen.play();
    }, 1500);
}

const tryLockedDoor = () => {
    setTimeout(function () {
        locked.play();
    }, 1500);
}

const unarmedAttack = () => {
    boss.health -= 1;
    player.health -= 3;
}
const armedAttack = () => {
    boss.health -= 2;
    player.health -= 3;
}

const strongUnarmedAttack = () => {
    boss.health -= 2;
    player.health -= 2;
}

const strongArmedAttack = () => {
    boss.health -= 3;
    player.health -= 2;
}

checkPlayerHealth = () => {
    if (player.health <= 0) {
        player.alive = false;
        narration.innerText = 'The crazed man overpowers you. Game Over...';
        gameOver();
    } else {
        player.alive = true;
    }
}

const checkBossHealth = () => {
    if (boss.health > 7) {
        boss.alive = true;
        attack.play();
        narration.innerText = 'The man absorbs the attack, but does not go down.';
    } else if (boss.health > 5) {
        boss.alive = true;
        attack.play();
        narration.innerText = 'He has taken some damage, but he still comes forward.';
    } else if (boss.health > 3) {
        boss.alive = true;
        attack.play();
        narration.innerText = 'This guy just will not go down! He runs at you again!';
    } else if (boss.health > 1) {
        boss.alive = true;
        attack.play();
        narration.innerText = 'He should have fallen by now! One more should do it.';
    } else {
        boss.alive = false;
        killingBlow.play();
        narration.innerText = `You smash the man's head in and he falls. It looks like he has been dead for days. What is going on? You see a glowing red light on the wall above a button.`;
    }
}

const gameOver = () => {
    if (player.alive !== true || boss.alive === false) {
        form.style.display = 'none';
    }
    music.pause();
    ending.play();
}

form.addEventListener('submit', checkInput);

startButton.addEventListener('click', function () {
    menu.style.display = 'none';
    map.style.display = 'grid';
    gameText.style.display = 'flex';
    toggleFade();

    music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    music.play();
})

const toggleFade = () => {
    if (narration.classList === "fade-out") {
        setTimeout(function () {
            narration.classList.remove("fade-out");
            narration.classList.add("fade-in");
        }, 501);
    } else if (narration.classList === "fade-out") {
        narration.classList.remove("fade-out");
        narration.classList.add("fade-in");
    } else {
        narration.classList.add("fade-in");
    }
}