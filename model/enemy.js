'use strict';

class Enemy {
    static speed = 1;

    constructor(x, y, field) {
        this.size = 48;
        this.block = new EnemyBlock(x, y, this);
        this.htmlElem = this.block.htmlElem;
        this.field = field;
        // this.htmlElem.offsetTop + this.htmlElem.offsetHeight
        this.x = x;
        this.y = y;
        this.canAttack = false;
        this.cource = 'Down';
        this.block.rotateDown();
        this.fire();
    }

    move()
    {
        let y = this.htmlElem.offsetTop;
        let x = this.htmlElem.offsetLeft;
        switch (this.cource) {
            case 'Up' :
                y = this.y - Enemy.speed;
                if(!this.field.isTopWall(y)
                    && !this.field.isCollapse(x,y,this.block)
                ) {
                    this.y = y;
                    this.block.moveUp(Enemy.speed);
                } else {
                    if(this.field.isTopWall(y)) {
                        this.block.collapse(this.field)
                    }
                }
                break;
            case 'Down' :
                y = this.y + Enemy.speed;
                if(!this.field.isDownWall(y + this.htmlElem.offsetHeight)
                    && !this.field.isCollapse(x,y,this.block)
                ) {
                    this.y = y;
                    this.block.moveDown(Enemy.speed);
                } else {
                    if(this.field.isDownWall(y + this.htmlElem.offsetHeight)) {
                        this.block.collapse(this.field)
                    }
                }
                break;
            case 'Left' :
                x = this.x - Enemy.speed;
                if (!this.field.isLeftWall(x)
                    && !this.field.isCollapse(x,y,this.block)
                ) {
                    this.x = x;
                    this.block.moveLeft(Enemy.speed);
                } else {
                    if(this.field.isLeftWall(x)) {
                        this.block.collapse(this.field)
                    }
                }
                break;
            case 'Right' :
                x = this.x + Enemy.speed;
                if (!this.field.isRightWall(x + this.htmlElem.offsetHeight)
                    && !this.field.isCollapse(x,y,this.block)
                ) {
                    this.x = x;
                    this.block.moveRight(Player.speed);
                } else {
                    if(this.field.isRightWall(x + this.htmlElem.offsetHeight)) {
                        this.block.collapse(this.field)
                    }
                }
                break;
        }
        this.block.animation();
    }

    remove() {
        clearTimeout(this.fireTimer);
        this.block.remove();
        let index = null;
        for(let i = 0; i < this.field.collapsableObjectArray.length; i++ ) {
            if(this.field.collapsableObjectArray[i].id === this.block.id) {
                index = i;
            }
        }

        let enemyIndex = null;
        for(let i = 0; i < this.field.enemyArray.length; i++ ) {
            if(this.field.enemyArray[i].block.id === this.block.id) {
                enemyIndex = i;
            }
        }
        if(index !== null) {
            if(enemyIndex !== null) {
                this.field.enemyArray.splice(enemyIndex,1)
            }
            this.field.collapsableObjectArray.splice(index,1)
        }

        if(this.field.enemyArray.length === 0) {
            const event = new Event('nextLevel');
            document.dispatchEvent(event);
        }
        this.size = null;
        this.block = null;
        this.htmlElem = null;
        this.field = null;
        this.x = null;
        this.y = null;
        this.canAttack = null;
        this.cource = null;
        this.fireTimer = null;

    }

    selfRemove() {
        clearTimeout(this.fireTimer);
        this.block.remove();
        this.size = null;
        this.block = null;
        this.htmlElem = null;
        this.field = null;
        this.x = null;
        this.y = null;
        this.canAttack = null;
        this.cource = null;
        this.fireTimer = null;
    }

    fire()
    {
        if(this.canAttack) {
            const x = this.x + (this.size / 2) - 5;
            const y = this.y + (this.size / 2) - 5;
            const bullet = new Bullet(x, y);
            bullet.autor = this;
            bullet.field = this.field;
            bullet.setCource(this.cource);
            this.field.bulletArray.push(bullet);
            this.canAttack = false;
        }

        let self = this;
        let timer = Math.floor(Math.random() * 1000)
        this.fireTimer = setTimeout(function () {
            self.canAttack = true;
            self.fire();
        }, 2500+timer)

        let audioAttack = new Audio('./audio/playerattack.wav');
        audioAttack.autoplay = false;
        audioAttack.play();
        const audioAttackTimer = setTimeout(function () {
            audioAttack.pause();
            audioAttack.remove();
            audioAttack = null;
            clearTimeout(audioAttackTimer);
        }, 500)
    }
}
