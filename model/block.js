class Block {
    constructor(x, y) {
        this.size = 50;
        this.x = x;
        this.y = y;
    }

    render(x,y) {
        let div = document.createElement('div');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.classList.add(this.className+'_block');
        div.style.top = y+'px';
        div.style.left = x+'px';
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    isCollapse(x,y,size) {
        if (((this.x + this.size > x) && (this.x < x + size))
            && ((this.y + this.size > y) && (this.y < y + size)))
        {
            return true;
        } else {
            return false;
        }
    }

    rotateLeft() {
        this.htmlElem.style.webkitTransform = `rotate(270deg)`;
    }

    rotateRight() {
        this.htmlElem.style.webkitTransform = `rotate(90deg)`;
    }

    rotateUp() {
        this.htmlElem.style.webkitTransform = `rotate(0deg)`;
    }

    rotateDown() {
        this.htmlElem.style.webkitTransform = `rotate(180deg)`;
    }

    collapse() {
        return
    }

    moveUp(speed) {
        let y = this.htmlElem.offsetTop;
        y = this.y - speed;
        this.y = y;
        this.htmlElem.style.top = this.y + 'px';
    }

    moveDown(speed) {
        let y = this.htmlElem.offsetTop;
        y = this.y + speed;
        this.y = y;
        this.htmlElem.style.top = this.y + 'px';
    }

    moveLeft(speed) {
        let x = this.htmlElem.offsetLeft;
        x = this.x - speed;
        this.x = x;
        this.htmlElem.style.left = this.x + 'px';
    }

    moveRight(speed) {
        let x = this.htmlElem.offsetLeft;
        x = this.x + Player.speed;
        this.x = x;
        this.htmlElem.style.left = this.x + 'px';
    }

    remove() {
        this.x = null;
        this.y = null;
        this.htmlElem.remove()
    }
}


class GrassBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.className = 'grass';
        this.id = this.render(x,y);
    }
}

class ConcreteWallBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.className = 'concrete_wall';
        this.id = this.render(x,y);
    }
}

class BreakWallBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.className = 'break_wall';
        this.id = this.render(x,y);
    }

    collapse(obj,field)
    {
        if(obj instanceof Bullet) {
            let id = this.htmlElem.id;
            let x = this.x;
            let y = this.y;
            const halfBlock = new HalfBreakWallBlock(x, y, obj.cource);
            field.collapsableObjectArray.push(halfBlock);
            field.removeCollapsableBlockById(id)
            this.htmlElem.remove();
        }
    }
}

class HalfBreakWallBlock extends Block {
    constructor(x,y, course = 'Up') {
        super(x,y);
        this.className = 'half_break_wall';
        this.id = this.render(x, y, course);
    }

    render(x, y, course) {
        let div = document.createElement('div');
        div.id = this.className + (Date.now() + Math.floor(Math.random() * 100000));
        div.classList.add(this.className+'_block');
        switch (course) {
            case 'Down' :
                div.style.top = (y + 25) +'px';
                div.style.left = x +'px';
                this.xSize = 50;
                this.ySize = 25;
                div.style.height = '25px';
                this.x = x;
                this.y = y;
                break;
            case 'Up' :
                div.style.top = y+'px';
                div.style.left = x+'px';
                this.xSize = 50;
                this.ySize = 25;
                div.style.height = '25px';
                this.x = x;
                this.y = y + 25;
                break;
            case 'Right' :
                div.style.top = y + 'px';
                div.style.left = (x + 25) + 'px';
                this.xSize = 25;
                this.ySize = 50;
                div.style.width = '25px';
                this.x = x + 25;
                this.y = y;
                break;
            case 'Left' :
                div.style.top = y + 'px';
                div.style.left = x + 'px';
                this.xSize = 25;
                this.ySize = 50;
                div.style.width = '25px';
                this.x = x;
                this.y = y;
                break;this.levelNum = 0;
        }
        playingField.append(div);
        this.htmlElem = div;
        return div.id;
    }

    isCollapse(x,y,size) {
        if (((this.x + this.xSize > x) && (this.x < x + size))
            && ((this.y + this.ySize > y) && (this.y < y + size)))
        {
            return true;
        } else {
            return false;
        }
    }

    collapse(obj,field)
    {
        if(obj instanceof Bullet) {
            let id = this.htmlElem.id;
            field.removeCollapsableBlockById(id)
            this.htmlElem.remove();
        }
    }
}

class WinnerBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.className = 'chicken';
        this.id = this.render(x,y);
    }

    collapse(obj) {
        if (obj instanceof Bullet) {
            const event = new Event('gameOver');
            document.dispatchEvent(event);
        }
    }
}

class PlayerBlock extends Block {
    constructor(x,y) {
        super(x,y);
        this.size = 48;
        this.className = 'player';
        this.id = this.render(x,y);
        this.spriteTimer = 0;
        this.sprite = 1;
    }

    render(x,y) {
        let div = document.createElement('div');
        div.id = 'player';
        div.classList.add(this.className+'_block');
        div.style.top = y+'px';
        div.style.left = x+'px';
        this.htmlElem = div;
        playingField.append(div);
        return div.id;
    }

    collapse(obj) {
        if(obj instanceof Bullet && obj.autor !== this.model) {
            this.model.inStart();
            this.move(this.model.startX, this.model.startY);
            window.playerLives--;
            if(window.playerLives < 0) {
                const event = new Event('gameOver');
                document.dispatchEvent(event);
            }
        }
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.htmlElem.style.top = y+'px';
        this.htmlElem.style.left = x+'px';
    }

    remove() {
        this.model.field.removeCollapsableBlockById(this.id);
        super.remove();
        let audioDest = new Audio('./audio/playerdest.wav');
        audioDest.autoplay = false;
        audioDest.play();
        const audioAttackTimer = setTimeout(function () {
            audioDest.pause();
            audioDest.remove();
            audioDest = null;
            clearTimeout(audioAttackTimer);
        }, 500)
    }

    animation() {
        if(this.spriteTimer == 5) {
            if(this.sprite == 1) {
                this.htmlElem.classList.remove('anim1');
                this.htmlElem.classList.add('anim2');
                this.sprite = 2;
            } else {
                this.htmlElem.classList.remove('anim2');
                this.htmlElem.classList.add('anim1');
                this.sprite = 1;
            }
                this.spriteTimer = 0;
        } else {
            this.spriteTimer++;
        }
    }
}

class BulletBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.className = 'bullet';
        this.id = this.render(x, y);
    }

    remove() {
        let self = this;
        let audioDest = new Audio('./audio/bulletdest.wav');
        audioDest.autoplay = false;
        audioDest.play();
        const audioAttackTimer = setTimeout(function () {
            audioDest.pause();
            audioDest.remove();
            audioDest = null;
            clearTimeout(audioAttackTimer);
        }, 200)

        self.htmlElem.classList.add('anim1');
        self.timer = setInterval(function (){
            self.htmlElem.classList.add('anim2');
            clearInterval(self.timer);
            self.timer = setInterval(function (){
                self.htmlElem.classList.add('anim3');
                clearInterval(self.timer);
                self.htmlElem.remove();
            },300)
        },300)
    }
}

class EnemyBlock extends Block {
    constructor(x, y, model) {
        super(x, y);
        this.model = model
        this.className = 'enemy';
        this.id = this.render(x, y);
        this.spriteTimer = 0;
        this.sprite = 1;
    }

    collapse(obj) {
        if(!(obj instanceof Bullet)) {
            const courceArray = ['Up', 'Left', 'Right']
            if (this.model.cource !== 'Down') {
                this.model.cource = 'Down'
            } else {
                this.model.cource = courceArray[Math.floor(Math.random() * courceArray.length)];
            }
            const funcName = 'rotate' + this.model.cource;
            this[funcName]();
        } else {
            if(!(obj.autor instanceof Enemy)) {
                window.score += 5;
                this.model.remove();
            }
        }
    }

    animation() {
        if(this.spriteTimer == 5) {
            if(this.sprite == 1) {
                this.htmlElem.classList.remove('anim1');
                this.htmlElem.classList.add('anim2');
                this.sprite = 2;
            } else {
                this.htmlElem.classList.remove('anim2');
                this.htmlElem.classList.add('anim1');
                this.sprite = 1;
            }
            this.spriteTimer = 0;
        } else {
            this.spriteTimer++;
        }
    }

    remove() {
        let audioDest = new Audio('./audio/enemydest.wav');
        audioDest.autoplay = false;
        audioDest.play();
        const audioAttackTimer = setTimeout(function () {
            audioDest.pause();
            audioDest.remove();
            audioDest = null;
            clearTimeout(audioAttackTimer);
        }, 500)

        let self = this;
        self.htmlElem.classList.add('dest1');
        self.timer = setInterval(function (){
            self.htmlElem.classList.add('dest2');
            clearInterval(self.timer);
            self.timer = setInterval(function (){
                clearInterval(self.timer);
                self.htmlElem.remove();
            },500)
        },500)
    }
}