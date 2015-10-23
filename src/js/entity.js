/**
 * Created by jack on 9/29/15.
 */
var app = app || {};
(function() {

    var __nextObjId = 1;

    function objectId(obj) {
        if (obj === null) {
            return null;
        }
        if (obj.__objId === null) {
            obj.__objId = __nextObjId++;
        }
        return obj.__objId;

    }

    /**
     * An Entity represents any object that can exist on the canvas.
     *
     * @param {Object} sprite object includes image, size, scale attributes
     * @param {Point} startingPosition Where the image will start on the canvas
     * @param {string} type Type of entity.
     * @constructor
     * @class
     */
    var Entity = function(sprite, startingPosition, type) {
        /**
         * @description Uniquely identify every entity on the game board.
         * @property __objId
         * @type {Number}
         */
        this.__objId = null;
        this.__objId = objectId(this);

        // Grab a local copy of app.Game or create a new instance
        this._game = game instanceof app.Game ? game : new app.Game();

        // Grab a local copy of app.EnemyManager or create a new instance.
        this._em = this._game.enemyManager instanceof app.EnemyManager ? game.enemyManager : new app.EnemyManager();


        this.sprite = sprite || '';
        this.hasSpriteSheet = (sprite.sprite) ? true : false;
        this.spriteFrame = 0;
        this.destroyed = false;
        this.startingPosition = new app.Point(startingPosition.x, startingPosition.y) || {};
        this.currentPosition = this.startingPosition.clone();

        this.x = this.startingPosition.x || 0;
        this.y = this.startingPosition.y || 0;
        var imgW = this.sprite.size.width * this.sprite.scale - 10;
        var imgH = this.sprite.size.height * this.sprite.scale;
        if (this.sprite.image !== '') {
            this.rect = {
                x: this.x + 5,
                y: this.y,
                width: imgW,
                height: imgH
            };
        } else {
            this.rect = {
                x: null,
                y: null,
                width: null,
                height: null
            };
        }
        this.frameCounter = 0;
        this.speed = 0;
        this.type = type || '';

        /**
         * @description Row entity resides in. Only set for enemy entities.
         * @property row
         * @type {Number}
         */
        this.row = null;

        /**
         * @description Column entity resides in. Only set for enemy entities.
         * @property column
         * @type {Number}
         */
        this.column = null;
    };
    /**
     * Sets the row enemy is located. Rows are numbered 1 - 5.
     *   - Row 1 - Green/Blue Enemies
     *   - Row 2 - Blue Enemies
     *   - Row 3 - Blue Enemies
     *   - Row 4 - Yellow Enemies
     *   - Row 5 - Yellow Enemies
     *
     * @method
     * @param {Number} inRow
     */
    Entity.prototype.setRow = function(inRow) {
        if (inRow.toString() === '' || (isNaN(inRow))) {
            throw 'inRow value is not a valid: ' + inRow.toString();
        } else {
            this.row = Number(inRow);
        }
    };

    /**
     * Sets the column enemy is located. Columns are numbered 1 - 10.
     * @method
     * @param {Number} col
     */
    Entity.prototype.setColumn = function(col) {
        if (col.toString() === '' || (isNaN(col))) {
            throw 'col value is not a valid: ' + col.toString();
        } else {
            this.column = Number(col);
        }
    };

    /**
     * Set destroy to true on entity.
     * @method
     */
    Entity.prototype.setDestroy = function() {
        this.destroyed = true;
    };

    /**
     * Renders the entity on the canvas context
     *
     * @param {object} ctx Canvas context
     */
    Entity.prototype.render = function(ctx) {
        if (this.hasSpriteSheet) {
            ctx.drawImage(Resources.get(this.sprite.image), this.sprite.sprite[this.spriteFrame].x, this.sprite.sprite[this.spriteFrame].y, this.sprite.sprite[this.spriteFrame].width, this.sprite.sprite[this.spriteFrame].h, this.currentPosition.x, this.currentPosition.y, this.sprite.sprite[this.spriteFrame].w * this.sprite.scale, this.sprite.sprite[this.spriteFrame].height * this.sprite.scale);
        } else {
            ctx.drawImage(Resources.get(this.sprite.image), this.currentPosition.x, this.currentPosition.y, this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
        }
    };
    /**
     * Exports to the app namespace
     *
     * @type {Function}
     */
    app.Entity = Entity;
})();
