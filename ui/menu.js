'use strict';

class GameLabel {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.className = 'game_label';
        this.id = this.render(this.x,this.y);
    }

    render(x,y) {
        let div = document.createElement('span');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.innerHTML = `BATTLE <br/> CITY`;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class ButtonPlay {
    constructor() {
        this.x = 0;
        this.y = 300;
        this.className = 'play_button';
        this.id = this.render(this.x,this.y);
        this.htmlElem.addEventListener('click', function () {
            let audioClick = new Audio('./audio/click.wav');
            audioClick.autoplay = false;
            audioClick.play();
            const audioAttackTimer = setTimeout(function () {
                audioClick.pause();
                audioClick.remove();
                audioClick = null;
                clearTimeout(audioAttackTimer);
            }, 500)

            const event = new Event('runGame');
            document.dispatchEvent(event);
        });
    }

    render(x,y) {
        let div = document.createElement('span');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.innerHTML = `play game`;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class LevelSplash {
    constructor(num) {
        this.x = 0;
        this.y = 300;
        this.className = 'level_splash';
        this.id = this.render(this.x,this.y, num);
    }

    render(x,y, num) {
        let div = document.createElement('span');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.innerHTML = `${num + 1} LEVEL`;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class NextLevelSplash {
    constructor(num, diff) {
        this.x = 0;
        this.y = 300;
        this.className = 'level_splash';
        this.id = this.render(this.x,this.y, num);
    }

    render(x,y, num) {
        let div = document.createElement('span');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.innerHTML = `${num + 1} LEVEL <br/> SCORE:${window.score}`;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class GameOverSplash {
    constructor() {
        this.x = 0;
        this.y = 300;
        this.className = 'game_over';
        this.id = this.render(this.x,this.y);
    }

    render(x,y) {
        let div = document.createElement('span');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.innerHTML = `GAME OVER <br/> SCORE:${window.score}`;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class Bar {
    constructor(x, y) {
        this.x = x;
        this.y = 603 + y;
        this.className = 'gameBar';
        this.id = this.render(this.x,this.y);
    }

    render(x,y) {
        let div = document.createElement('div');
        div.id = this.className;
        div.classList.add(this.className+'_ui');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        this.playerLives = new PlayerLives(this.htmlElem);
        this.score = new ScoreBlock(this.htmlElem);
        this.bestScore = new BestScoreBlock(this.htmlElem);
        return div.id;
    }

    reset() {
        this.playerLives.remove();
        this.score.remove();
        this.bestScore.remove();
        this.playerLives = new PlayerLives(this.htmlElem);
        this.score = new ScoreBlock(this.htmlElem);
        this.bestScore = new BestScoreBlock(this.htmlElem);
    }

    remove() {
        this.htmlElem.remove();
    }
}

class PlayerLives {
    constructor(parent) {
        this.className = 'players_ives';
        this.id = this.render(parent);
    }

    render(parent) {
        let div = document.createElement('div');
        div.id = this.className;
        div.innerHTML = `<img src="./style/pic/player.png" class="img"> X ${window.playerLives}`;
        div.classList.add(this.className+'_ui');
        parent.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class ScoreBlock {
    constructor(parent) {
        this.className = 'score';
        this.id = this.render(parent);
    }

    render(parent) {
        let div = document.createElement('div');
        div.id = this.className;
        div.innerHTML = `SCORE = ${window.score}`;
        div.classList.add(this.className+'_ui');
        parent.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}

class BestScoreBlock {
    constructor(parent) {
        this.className = 'score';
        this.id = this.render(parent);
    }

    render(parent) {
        let div = document.createElement('div');
        div.id = 'best_'+this.className;
        const best = star.bestScore;
        div.innerHTML = `BEST SCORE = ${best}`;
        div.classList.add(this.className+'_ui');
        parent.append(div);
        this.htmlElem = div;
        return div.id;
    }

    remove() {
        this.htmlElem.remove();
    }
}