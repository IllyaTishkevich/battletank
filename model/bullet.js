class Bullet
{
    htmlElem = null;

    constructor(x,y)
    {
        this.size = 10;
        this.speed = 2;
        this.x = x;
        this.y = y;
        this.block = new BulletBlock(x,y);
    }

    setCource(cource)
    {
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
        this.cource = cource;
    }

    issetCource()
    {
        return this.cource !== null;
    }

    move() {
        let y = this.block.htmlElem.offsetTop;
        let x = this.block.htmlElem.offsetLeft;
        if(this.issetCource()) {
            switch (this.cource) {
                case 'Up' :
                    y = this.y - this.speed;
                    if(!this.field.isTopWall(y)
                        && !this.field.isCollapse(x,y,this)
                    ) {
                        this.y = y;
                        this.block.htmlElem.style.top = this.y + 'px';
                    } else {
                        if(this.field.isTopWall(y)) {
                            this.remove()
                        }
                    }
                    break;
                case 'Down' :
                    y = this.y + this.speed;
                    if(!this.field.isDownWall(y + this.block.htmlElem.offsetHeight)
                        && !this.field.isCollapse(x,y,this)
                    ) {
                        this.y = y;
                        this.block.htmlElem.style.top = this.y+'px';
                    } else {
                        if(this.field.isDownWall(y + this.block.htmlElem.offsetHeight)) {
                            this.remove()
                        }
                    }
                    break;
                case 'Left' :
                    x = this.x - this.speed;
                    if (!this.field.isLeftWall(x)
                        && !this.field.isCollapse(x,y,this)
                    ) {
                        this.x = x;
                        this.block.htmlElem.style.left = this.x + 'px';
                    } else {
                        if(this.field.isLeftWall(x)) {
                            this.remove()
                        }
                    }
                    break;
                case 'Right' :
                    x = this.x + this.speed;
                    if (!this.field.isRightWall(x + this.block.htmlElem.offsetHeight)
                        && !this.field.isCollapse(x,y,this)
                    ) {
                        this.x = x;
                        this.block.htmlElem.style.left = this.x + 'px';
                    } else {
                        if(this.field.isRightWall(x + this.block.htmlElem.offsetHeight)) {
                            this.remove()
                        }
                    }
                    break;
            }
        }
    }

    remove() {
        let index = null;
        for(let i = 0; i < this.field.bulletArray.length; i++ ) {
            if(this.field.bulletArray[i].block.id === this.block.id) {
                index = i;
            }
        }
        if(index !== null) {
            this.field.bulletArray.splice(index,1)
            this.block.remove();
        }
    }

    selfRemove() {
        this.block.htmlElem.remove();
    }

    collapse(obj) {
        if(obj instanceof BreakWallBlock) {
            this.remove()
        } else {
            if (obj !== undefined && this.autor === obj.model) {
                switch (this.cource) {
                    case 'Up' :
                        this.y = this.y - this.speed;
                        this.block.htmlElem.style.top = this.y + 'px';
                        break;
                    case 'Down' :
                        this.y = this.y + this.speed;
                        this.block.htmlElem.style.top = this.y + 'px';
                        break;
                    case 'Left' :
                        this.x = this.x - this.speed;
                        this.block.htmlElem.style.left = this.x + 'px';
                        break;
                    case 'Right' :
                        this.x = this.x + this.speed;
                        this.block.htmlElem.style.left = this.x + 'px';
                        break;
                }
            } else {
                this.remove()
            }
        }
    }
}