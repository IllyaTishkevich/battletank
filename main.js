'use strict';

class GameRoom {
    constructor(levelNum, diff) {
        this.diff = diff;
        this.field = new PlayingField(levelNum, diff);
        this.field.generateMap();
        let self = this;
        this.gameTimer = window.requestAnimationFrame(function (){
            self.globalTimer();
        });

        this.enemyGenerateTimer = 0;
        this.bar = new Bar(playingField.offsetLeft, playingField.offsetTop);
    }

    createEnenmy() {
        if (this.field.enemyCount > 0 && this.field.enemyArray.length < (4 * this.diff)) {
            const rand = Math.floor(Math.random() * this.field.enemyResetPoint.length);
            this.field.createEnenmy(this.field.enemyResetPoint[rand]['x'], this.field.enemyResetPoint[rand]['y'])
        }
    }

    globalTimer() {
        if(this.field.run === false) {
            return
        }
        this.field.player.move();
        if(this.field.bulletArray.length > 0) {
            for(let i = 0; i < this.field.bulletArray.length; i++) {
                this.field.bulletArray[i].move();
            }
        }

        if(this.field.enemyArray.length > 0) {
            for(let i = 0; i < this.field.enemyArray.length; i++) {
                this.field.enemyArray[i].move();
            }
        }
        let self = this;

        if(this.enemyGenerateTimer == 60) {
            this.createEnenmy();
            this.enemyGenerateTimer = 0;
        } else {
            this.enemyGenerateTimer++;
        }

        this.bar.reset();

        this.gameTimer = window.requestAnimationFrame(function () {
            self.globalTimer();
        });
    }

    stopTimer() {
        window.cancelAnimationFrame(this.gameTimer);
        this.gameTimer = null;
    }

    remove() {
        this.stopTimer();
        const self = this;

        for(let i = 0; i < self.field.enemyArray.length; i++) {
            self.field.enemyArray[i].selfRemove();
            self.field.enemyArray[i] = null;
        }
        self.field.enemyArray = [];

        for(let i = 0; i < self.field.collapsableObjectArray.length; i++) {
            self.field.collapsableObjectArray[i].remove();
            self.field.collapsableObjectArray[i] = null;
        }
        self.field.collapsableObjectArray = [];

        for(let i = 0; i < self.field.bulletArray.length; i++) {
            self.field.bulletArray[i].selfRemove();
            self.field.bulletArray[i] = null;
        }
        self.field.bulletArray = [];

        self.field.objectArray = [];
        self.field.htmlElem.innerHTML = '';

        this.field.player.audioRun.pause();
        this.field.player.audioRun.remove();
        this.field.player.remove;
        this.field.playerControl.remove();
        this.field.playerControl = null;
        this.field.player = null;
        this.field.run = false;
    }
}

class StartMenu {
    constructor() {
        this.label = new GameLabel();
        this.playButton = new ButtonPlay();
        this.score = new ScoreBlock(playingField);
        this.score.htmlElem.classList.add('main_menu');
    }

    remove() {
        this.label.remove();
        this.playButton.remove()
        this.score.remove();
        this.label = null;
        this.playButton = null;
    }
}

class Main {
    constructor() {
        window.score = 0;
        this.room = new StartMenu();
        const self = this;
        this.levelNum = 0;
        this.diff = 1;
        this.uid = this.getUid();
        this.storage = new Storage(this.uid);

        document.addEventListener('runGame', function () {
            self.runGame()
        });

        document.addEventListener('gameOver', function () {
            self.gameOver()
        });

        document.addEventListener('nextLevel', function () {
            self.nextLevel()
        })
        this.getBestScore();
    }


    getBestScore() {
       this.storage.ajaxGet(this);
       console.log(this.bestScore)
    }

    getUid() {
        let uid = window.localStorage.getItem('uid');
        if (uid === null) {
            uid = 'BATTLE_CITY_'+this.makeid();
            window.localStorage.setItem('uid', uid)
        }
        return uid;
    }

    makeid() {
        var text = "";
        var possible = "QWERTYUIOPASDFGHJKLZXCVBNM";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    runGame() {
        this.room.remove();
        this.room = null;
        this.runLevelSplash()
        window.playerLives = 3;
        window.score = 0;
    }

    nextLevel() {
        this.room.stopTimer();
        this.room.remove();
        this.room = null;
        if(this.levelNum < 4) {
            this.levelNum++;
        } else {
            this.levelNum = 0;
            this.diff++;
        }
        this.room = new NextLevelSplash(this.levelNum);
        let self = this;
        self.splashTimer = setTimeout(function () {
            self.room.remove();
            self.room = null;
            self.runLevel();
            clearTimeout(self.splashTimer);
        },1000)
    }


    runLevelSplash() {
        this.room = new LevelSplash(this.levelNum);
        let self = this;
        self.splashTimer = setTimeout(function () {
            self.room.remove();
            self.room = null;
            self.runLevel();
            clearTimeout(self.splashTimer);
        },1000)
    }

    runLevel() {
       this.room = new GameRoom(this.levelNum, this.diff)
    }

    gameOver() {
        let audioGameOver = new Audio('./audio/gameover.wav');
        audioGameOver.autoplay = false;
        audioGameOver.play();
        const audioAttackTimer = setTimeout(function () {
            audioGameOver.pause();
            audioGameOver.remove();
            audioGameOver = null;
            clearTimeout(audioAttackTimer);
        }, 500)

        let self = this;
        this.room.stopTimer();
        this.room.remove();
        this.room = null;
        this.room = new GameOverSplash();
        self.splashTimer = setTimeout(function () {
            self.room.remove();
            self.room = null;
            self.room = new StartMenu();
            self.levelNum = 0;
            clearTimeout(self.splashTimer);
        },3000)

        self.scoreTimer = setTimeout(function () {
            if (window.score > 0 && self.bestScore < window.score) {
                if(self.bestScore == 0) {
                    self.storage.ajaxInsert(window.score);
                } else {
                    self.storage.updateData(window.score);
                }
                self.bestScore = window.score;
            }
            clearTimeout(self.scoreTimer);
        }, 0)
    }

}

const star = new Main()