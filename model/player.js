'use strict';

class Player {
    static id = 'player';
    static speed = 1;
    cource = null;
    htmlElem = null;
    position = 'Up';

    constructor(x, y, field) {
        this.size = 48;
        this.field = field;
        const obj = new PlayerBlock(x,y);
        this.field.collapsableObjectArray.push(obj);
        this.block = obj;
        this.block.model = this;
        this.htmlElem = this.block.htmlElem;
        // this.htmlElem.offsetTop + this.htmlElem.offsetHeight
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.canAttack = true;
        this.audioRun = new Audio('./audio/playermove.wav');
    }

    inStart(){
        this.x = this.startX;
        this.y = this.startY;

        this.block.remove();
        const obj = new PlayerBlock(this.x, this.y);
        this.field.collapsableObjectArray.push(obj);
        this.block = obj;
        this.block.model = this;
        this.htmlElem = this.block.htmlElem;
    }

    setCourse(cource) {
        switch (cource) {
            case 'Up' :
                this.block.rotateUp();
                break;
            case 'Down' :
                this.block.rotateDown();
                break;
            case 'Left' :
                this.block.rotateLeft();
                break;
            case 'Right' :
                this.block.rotateRight();
                break;
        }
        this.position = cource;
        this.cource = cource;
            this.audioRun.play();
    }

    unsetCource() {
        this.cource = null;
        this.audioRun.pause();
    }

    issetCource() {
        return this.cource !== null;
    }

    isCource(cource) {
        return this.cource === cource;
    }

    fire()
    {
        if(this.canAttack) {
            const x = this.x + (this.size / 2) - 5;
            const y = this.y + (this.size / 2) - 5;
            const bullet = new Bullet(x, y);
            bullet.autor = this;
            bullet.field = this.field;
            bullet.setCource(this.position);
            this.field.bulletArray.push(bullet);
            this.canAttack = false;
            let self = this;
            let audioAttack = new Audio('./audio/playerattack.wav');
            audioAttack.play();
            this.audioAttackTimer = setTimeout(function () {
                audioAttack.pause();
                audioAttack = null;
                clearTimeout(self.audioAttackTimer);
            }, 490)
            this.fireTimer = setTimeout(function () {
                self.canAttack = true;
            }, 500)
        }
    }

    move()
    {
        let y = this.htmlElem.offsetTop;
        let x = this.htmlElem.offsetLeft;
        if(this.issetCource()) {
            switch (this.cource) {
                case 'Up' :
                    y = this.y - Player.speed;
                    if(!this.field.isTopWall(y)
                        && !this.field.isCollapse(x,y,this.block)
                    ) {
                        this.y = y;
                        this.block.move(this.x, this.y);
                    }
                    break;
                case 'Down' :
                    y = this.y + Player.speed;
                    if(!this.field.isDownWall(y + this.htmlElem.offsetHeight)
                        && !this.field.isCollapse(x,y,this.block)
                    ) {
                        this.y = y;
                        this.block.move(this.x, this.y);
                    }
                    break;
                case 'Left' :
                    x = this.x - Player.speed;
                    if (!this.field.isLeftWall(x)
                        && !this.field.isCollapse(x,y,this.block)
                    ) {
                        this.x = x;
                        this.block.move(this.x, this.y);
                    }
                    break;
                case 'Right' :
                    x = this.x + Player.speed;
                    if (!this.field.isRightWall(x + this.htmlElem.offsetHeight)
                        && !this.field.isCollapse(x,y,this.block)
                    ) {
                        this.x = x;
                        this.block.move(this.x, this.y);
                    }
                    break;
            }
            this.block.animation();
        }
    }

    remove() {
        this.size = null;
        this.block.remove();
        this.block = null;
        this.field = null;
        this.x = null;
        this.y = null;
        this.canAttack = null;
        clearTimeout(this.fireTimer);
    }

}