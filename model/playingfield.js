'use strict';

class PlayingField {
    static id = 'playingField';

    constructor(level, diff) {
        this.collapsableObjectArray = [];
        this.diff = diff;
        this.objectArray = [];
        this.bulletArray = [];
        this.enemyArray = [];
        this.enemyCount = 5 + (3 * this.diff);
        // this.enemyCount = 1;
        this.htmlElem = document.getElementById(PlayingField.id);
        this.level = level;
        this.run = true;
        this.enemyResetPoint = [
            { x: this.htmlElem.offsetLeft + 1, y :this.htmlElem.offsetTop + 1},
            { x: this.htmlElem.offsetLeft + 301 ,y: this.htmlElem.offsetTop + 1},
            { x: this.htmlElem.offsetLeft + 601 ,y : this.htmlElem.offsetTop + 1}
        ];
    }

    generateMap() {
        let level = JSON.parse(JSON.stringify(levelsArray[this.level]));
        level = this.parseLevel(level);
        for(let i = 0; i < level.length; i++) {
            for(let l = 0; l < level[i].length; l++) {
                this.objectGenerator(level[i][l],i,l);
            }
        }
        const self = this;
        // this.enemyGenerateTimer = setTimeout(function (){
        //     console.log(self.enemyArray);
        //     if (self.enemyCount > 0 && self.enemyArray.length < 6) {
        //         const rand = Math.floor(Math.random() * self.enemyResetPoint.length);
        //         console.log(rand);
        //         self.createEnenmy(self.enemyResetPoint[rand]['x'], self.enemyResetPoint[rand]['y'])
        //     }
        // }, 1500)
        self.createEnenmy(self.enemyResetPoint[0]['x'], self.enemyResetPoint[0]['y']);
        self.createEnenmy(self.enemyResetPoint[1]['x'], self.enemyResetPoint[1]['y']);
        self.createEnenmy(self.enemyResetPoint[2]['x'], self.enemyResetPoint[2]['y']);
    }

    objectGenerator(code,i,l) {
        let obj;
        let x = this.htmlElem.offsetLeft + (l * 50);
        let y = this.htmlElem.offsetTop + (i * 50);
        switch (code) {
            case 'g' :
                obj = new GrassBlock(x,y);
                this.objectArray.push(obj);
                break;
            case 'c' :
                obj = new BreakWallBlock(x,y);
                this.collapsableObjectArray.push(obj);
                break;
            case 'W' :
                obj = new WinnerBlock(x,y);
                this.objectArray.push(obj);
                this.collapsableObjectArray.push(obj);
                break;
            case 'p' :
                this.player = new Player(x, y, this);
                this.playerControl = new PlayerControl(this.player);
                break;
            case 's' :
                obj = new ConcreteWallBlock(x,y);
                this.collapsableObjectArray.push(obj);
                break;
        }
    }

    parseLevel(level) {
        for(let i = 0; i < level.length; i++) {
            level[i] = level[i][0].split('');
        }

        return level;
    }


    isLeftWall(x) {
        return x <  this.htmlElem.offsetLeft;
    }

    isRightWall(x) {
        return x >  this.htmlElem.offsetLeft + this.htmlElem.offsetWidth;
    }

    isTopWall(y) {
        return y < this.htmlElem.offsetTop;
    }

    isDownWall(y) {
        return y > this.htmlElem.offsetTop + this.htmlElem.offsetHeight;
    }

    isCollapse(x,y,obj) {
        try {
            for (let i = 0; i < this.collapsableObjectArray.length; i++) {
                if (obj !== this.collapsableObjectArray[i] && this.collapsableObjectArray[i].isCollapse(x, y, obj.size)) {
                    this.collapsableObjectArray[i].collapse(obj, this);
                    obj.collapse(this.collapsableObjectArray[i], this);

                    return true;
                }
            }
            return false;
        } catch (e) {
            return true;
        }
    }

    removeCollapsableBlockById(id) {
        let index = null;
        try {
            for (let i = 0; i < this.collapsableObjectArray.length; i++) {
                if (this.collapsableObjectArray[i].id === id) {
                    index = i;
                }
            }
            if (index !== null) {
                this.collapsableObjectArray.splice(index, 1)
            }
        } catch (e) {

        }
    }

    createEnenmy(x, y) {
        if(this.enemyCount > 0) {
            const enemy = new Enemy(x, y, this);
            this.enemyArray.push(enemy);
            this.collapsableObjectArray.push(enemy.block);
            --this.enemyCount;
        }
    }
}