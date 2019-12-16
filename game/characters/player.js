/**
 * game/character/player.js
 *
 * What it Does:
 *   This file is a basic player character
 *   it extends the Sprite class and adds two collision detections methods
 *
 * What to Change:
 *   Add any character specific methods
 *   eg. eat
 *
 */

import ImageSprite from '../objects/imageSprite.js';

class Player extends ImageSprite {
    constructor(options) {
        super(options);

        this.ctx = options.ctx;
        this.color = options.color;
        this.name = options.name;
        this.score = 0;
    }

    draw() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Player;