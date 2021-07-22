'use strict';

class PlayerControl {
    static ArrowArray = {
        ArrowUp: 'Up',
        ArrowDown: 'Down',
        ArrowRight: 'Right',
        ArrowLeft: 'Left'
    };

    constructor(player) {
        this.player = player;
        const self = this;

        this.keydownEvent = function (event) {
            self.changeCource(event,self.player);
        }
        document.addEventListener('keydown', this.keydownEvent);

        this.keyupEvent = function(event) {
            self.unsetCource(event, self.player);
        }
        document.addEventListener('keyup', this.keyupEvent);


        this.keypressEvent = function(event) {
            self.attack(event, self.player);
        };

        document.addEventListener('keypress', this.keypressEvent);

    }

    changeCource(event,player) {
        if (event.code in PlayerControl.ArrowArray
            && !player.isCource(PlayerControl.ArrowArray[event.code])
            && !player.issetCource()) {
            player.setCourse(PlayerControl.ArrowArray[event.code]);
        }
    }

    unsetCource(event,player) {
        if (event.code in PlayerControl.ArrowArray
            && this.player.issetCource() &&
            this.player.isCource(PlayerControl.ArrowArray[event.code])) {
            this.player.unsetCource();
        }
    }

    attack(event,player) {
        if(event.code === 'Space') {
            player.fire();
        }
    }

    remove() {
        document.removeEventListener('keydown', this.keydownEvent);
        document.removeEventListener('keyup', this.keyupEvent);
        document.removeEventListener('keypress', this.keypressEvent);

    }
}