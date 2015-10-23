var app = app || {};
(function () {
    'use strict';
    // Define enemy sprites and their attributes
    var states = {
        // attack the start point is currentPosition.
        attack: {
            controlPoints: {
                p1: new app.Point(70, -50),
                p2: new app.Point(0, 250),
                p3: new app.Point(140, 350),
                p4: new app.Point(140, 350),
                p5: new app.Point(500, 300),
                p6: new app.Point(100, 250)
            }
        }
    };

    /**
     * @description Represents a Game Enemy
     * @param {Point} startingPosition
     * @param {string} type
     * @constructor
     */
    var Enemy = function (startingPosition, type) {

        /**
         * @description The various sprites for each of the enemies available in the game.
         * @type {{green: {image: string, size: {width: number, height: number}, scale: number}, blue: {image: string, size: {width: number, height: number}, scale: number}, redblue: {image: string, size: {width: number, height: number}, scale: number}, blueyellow: {image: string, size: {width: number, height: number}, scale: number}, explosion: {image: string, size: {width: number, height: number}, scale: number, frames: {0: {width: number, height: number, x: number, y: number}, 1: {width: number, height: number, x: number, y: number}, 2: {width: number, height: number, x: number, y: number}, 3: {width: number, height: number, x: number, y: number}, 4: {width: number, height: number, x: number, y: number}, 5: {width: number, height: number, x: number, y: number}, 6: {width: number, height: number, x: number, y: number}, 7: {width: number, height: number, x: number, y: number}, 8: {width: number, height: number, x: number, y: number}, 9: {width: number, height: number, x: number, y: number}, 10: {width: number, height: number, x: number, y: number}}}}}
         */
        this.sprites = {
            green: {
                image: 'images/galaga-green-enemy.png',
                size: {
                    width: 160,
                    height: 145
                },
                scale: 0.25
            },
            blue: {
                image: 'images/galaga-blue-enemy.png',
                size: {
                    width: 160,
                    height: 145
                },
                scale: 0.25
            },
            redblue: {
                image: 'images/galaga-red-blue-pink-enemy.png',
                size: {
                    width: 160,
                    height: 145
                },
                scale: 0.25
            },
            blueyellow: {
                image: 'images/galaga-blue-yellow-red-enemy.png',
                size: {
                    width: 160,
                    height: 145
                },
                scale: 0.25
            },
            explosion: {
                image: 'images/explosion-sprite.png',
                size: {
                    width: 146,
                    height: 36
                },
                scale: 1,
                frames: {
                    0: {
                        width: 48,
                        height: 49,
                        x: 167,
                        y: 38
                    },
                    1: {
                        width: 50,
                        height: 48,
                        x: 293,
                        y: 42
                    },
                    2: {
                        width: 58,
                        height: 54,
                        x: 416,
                        y: 40
                    },
                    3: {
                        width: 66,
                        height: 61,
                        x: 28,
                        y: 166
                    },
                    4: {
                        width: 70,
                        height: 66,
                        x: 155,
                        y: 165
                    },
                    5: {
                        width: 66,
                        height: 63,
                        x: 284,
                        y: 165
                    },
                    6: {
                        width: 67,
                        height: 69,
                        x: 412,
                        y: 162
                    },
                    7: {
                        width: 72,
                        height: 73,
                        x: 26,
                        y: 289
                    },
                    8: {
                        width: 77,
                        height: 77,
                        x: 151,
                        y: 287
                    },
                    9: {
                        width: 83,
                        height: 80,
                        x: 276,
                        y: 287
                    },
                    10: {
                        width: 80,
                        height: 84,
                        x: 406,
                        y: 285
                    }
                }
            }
        };


        /**
         * Enemies have all attributes of an Entity, plus
         */
        app.Entity.call(this, this.sprites[type], startingPosition, type);

        /**
         * The current state for this enemy. Available states are:
         *   - ENTER - The flyin movement for this enemy
         *   - SLIDE - Slides enemy left and right.
         *   - PULSE - Enemies move away from the center of the canvas
         *             then return to startingPosition
         *   - ATTACK - Enemy launches an attack.
         *   - DESTROY - Enemy has been hit and destroyed.
         * @property state
         * @type {string}
         * @default ENTER
         */
        this.state = 'NONE';

        /**
         * Movement direction for this enemy.
         * @property direction
         * @type {number}
         * @default +1 (Positive X (right) or Negative X (left)
         */
        this.direction = +1;

        /**
         * Vertical movement direction for this enemy in pulse state.
         * @property vertDirection
         * @type {number}
         * @default +1 (Positive Y (down) or Negative Y (up)
         */
        this.vertDirection = +1;

        /**
         * @property attackStart
         * @type {boolean}
         * @default false
         */
        this.attackStart = false;

        /**
         * @property attackPoints Holds the Point objects for an enemy flight path during attack
         * @type {Array}
         */
        this.attackPoints = [];

        /**
         * @property {Array} attackAngles Holds the angles associated with the enemy flight path during attack
         * @type {Array}
         */
        this.attackAngles = [];

        /**
         * @description Tracks current location within the attackPoints and attackAngles arrays.
         * @property attackIndex
         * @type Array
         */
        this.attackIndex = 0;

        /**
         * @description Used to limit the movement.
         */
        this.attackTimer = 0;
        this.attackMovementSpacing = 50;
        this.attackMissileCounter = 0;

        this.missileFireTimer = 0;
        this.missileFireDelay = 500;
        this.maxMissilesToFire = 5;

        /**
         * The row the enemy exists, within the Brigade.
         * @property row
         * @type {Number}
         */
        this.row = null;

        /**
         * The column the enemy exists, within the Brigade.
         * @property column
         * @type {Number}
         */
        this.column = null;

        this.explosionTimer = 0;
        this.explosionDelay = 2;


        this.scoreValue = 200;

        this.pulseSide = null;
        this.previousstate = null;

        this.enterCoords = [];
        this.enterAngles = [];
        this.enterTimer = 0;
        this.enterDelay = 20;
        this.enterIndex = 0;

        this.group = null;
    };

    Enemy.prototype = Object.create(app.Entity.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.getPointValue = function () {
        var pointReturn = this.scoreValue;
        if (this.previousstate === 'attacking') {
            pointReturn = 1000;
        }
        return pointReturn;
    };

    Enemy.prototype.reset = function () {
        this.destroyed = false;
        this.sprite = this.sprites[this.type];
        this.frameCounter = 0;
        this.enterIndex = 0;
        this.currentPosition.x = -100;
        this.currentPosition.y = -100;
        this.current = 'removed';
    };

    Enemy.prototype.setState = function (state) {
        this.state = 'PULSE';
    };

    /**
     * Set sprite image URL
     *
     * @param {string} sprite
     * @throws {error} If sprite is not string
     */
    Enemy.prototype.setSprite = function (sprite) {
        if (typeof sprite !== 'string') {
            throw new Error('sprite must be string type');
        }
        this.sprite = this.sprites[sprite];
    };


    /**
     * Update location of enemy object.
     * @method
     * @param {number} dt
     * @param {Number} lastTime description
     */
    Enemy.prototype.update = function (dt, lastTime) {
        var points = [];
        if (this.destroyed) {
            this.sprite = this.sprites.explosion;
            if (this.frameCounter === null) {
                this.frameCounter = 0;
                this.explosionTimer = lastTime + this.explosionDelay;
            }
            else {
                if (lastTime > this.explosionTimer) {
                    this.frameCounter++;
                    this.explosionTimer = lastTime + this.explosionDelay;
                }
            }

            if (this.frameCounter >= (Object.keys(this.sprite.frames).length - 1)) {
                // console.log('Entity id: ' + this.__objId + '  frameCounter: ' + this.frameCounter);
                if (this.destroyed && this.current === 'destroyed') {
                    this.leave();
                }
            }
        }
        else {
            // In the original game, the enemies would spread out

            if (this.current === 'removed') {
                // Enemy hasn't entered the scene yet or has been destroyed
                // thus locate off the canvas.
                this.currentPosition = new app.Point(-100, -100);
            }
            else if (this.current === 'entering') {
                // console.log('I will fly in.');

                if (this.enterCoords.length === 0) {
                    points = null;
                    if (this.group === 1) {
                        this.currentPosition.x = this._game.canvasSize.width / 2;
                        this.currentPosition.y = -50;
                        points = calculateControlPoints('triangle', 'ccw', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 5) * this._game.cellSize));
                    }
                    else if (this.group === 2) {
                        this.currentPosition.x = this._game.canvasSize.width / 2;
                        this.currentPosition.y = -50;
                        points = calculateControlPoints('triangle', 'cw', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 4) * this._game.cellSize));
                    }
                    else if (this.group === 3) {
                        this.currentPosition.x = -50;
                        this.currentPosition.y = this._game.canvasSize.height * 0.80;
                        points = calculateControlPoints('sideentry', 'left', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 4) * this._game.cellSize));
                    }
                    else if (this.group === 4) {
                        this.currentPosition.x = this._game.canvasSize.width + 50;
                        this.currentPosition.y = this._game.canvasSize.height * 0.80;
                        points = calculateControlPoints('sideentry', 'right', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 6) * this._game.cellSize));
                    }
                    else if (this.group === 5) {
                        this.currentPosition.x = this._game.canvasSize.width / 2;
                        this.currentPosition.y = -50;
                        points = calculateControlPoints('triangle', 'ccw', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 6) * this._game.cellSize));
                    }
                    else if (this.group === 6) {
                        this.currentPosition.x = this._game.canvasSize.width / 2;
                        this.currentPosition.y = -50;
                        points = calculateControlPoints('triangle', 'cw', this.currentPosition, new app.Point(this._game.canvasSize.width / 2, (this._em.brigadeStartRow + 5) * this._game.cellSize));
                    }
                    //         // console.log(states.attack);
                    this.enterCoords.pushArrayMembers(calculateBezierCurvePoints(points[0], points[1], points[2], points[3]));
                    this.enterAngles.pushArrayMembers(calculateBezierCurveAngles(points[0], points[1], points[2], points[3]));
                }
                else {
                    if (this.enterCoords.length !== 0) {
                        if (lastTime > this.enterTimer) {
                            this.currentPosition.x = this.enterCoords[this.enterIndex].x;
                            this.currentPosition.y = this.enterCoords[this.enterIndex].y;
                            this.enterIndex++;
                            if (this.enterIndex === this.enterCoords.length) {
                                this.attackIndex = 0;
                                this.lineup();
                            }
                            this.enterTimer = lastTime + this.enterDelay;
                        }
                    }

                }

            }
            else if (this.current === 'brigade') {
                var xMove = null;
                var yMove = null;
                if (this.atHome()) {

                    if (game.enemyManager.brigadeState === 'SLIDE') {
                        xMove = this._em.brigadeCurrentPoint.x + (this.column - game.enemyManager.brigadeStartColumn) * game.cellSize;
                        yMove = this._em.brigadeCurrentPoint.y + (this.row - game.enemyManager.brigadeStartRow) * game.cellSize;
                        this.currentPosition.x = xMove;
                        this.currentPosition.y = yMove;
                    }
                    else if (game.enemyManager.brigadeState === 'PULSE') {
                        var colRatio = (this.column - game.enemyManager.brigadeStartColumn) / 5;
                        if (colRatio <= 1) {
                            this.pulseSide = 'left';
                        }
                        else if (colRatio > 1) {
                            this.pulseSide = 'right';
                        }
                        this._pulseEnemy(this);

                        xMove = dt * 1 * Math.abs((7.5 - this.column)) * this.direction;

                        this.currentPosition.x += xMove;

                        if (this.type !== 'green' || this.type !== 'blue') {
                            yMove = dt * 2 * Math.abs(game.enemyManager.brigadeStartRow - this.row + 1) * this.vertDirection;
                            this.currentPosition.y += yMove;
                        }
                    }
                }
                else {
                    // Not at home, therefore, ease enemy into Home position.
                    var xDistance = (this._em.brigadeCurrentPoint.x + (this.column - game.enemyManager.brigadeStartColumn) * game.cellSize) - this.currentPosition.x;
                    var yDistance = (this._em.brigadeCurrentPoint.y + (this.row - game.enemyManager.brigadeStartRow) * game.cellSize) - this.currentPosition.y;
                    var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
                    if (distance > 1) {
                        this.currentPosition.x += xDistance * 0.05;
                        this.currentPosition.y += yDistance * 0.05;
                    }
                }
            }
            else if (this.current === 'attacking') {

                if (this.attackStart) {
                    points = calculateControlPoints('triangle', 'cw', this.currentPosition);
                    this.attackStart = false;
                    // console.log(states.attack);
                    this.attackPoints.pushArrayMembers(calculateBezierCurvePoints(points[0], points[1], points[2], points[3]));
                    this.attackAngles.pushArrayMembers(calculateBezierCurveAngles(points[0], points[1], points[2], points[3]));
                }
                else {
                    if (this.attackPoints.length !== 0) {
                        if (lastTime > this.attackTimer) {
                            this.currentPosition.x = this.attackPoints[this.attackIndex].x;
                            this.currentPosition.y = this.attackPoints[this.attackIndex].y;
                            this.attackIndex++;
                            if (this.attackIndex === this.attackPoints.length) {
                                this.attackPoints = [];
                                this.attackAngles = [];
                                this.attackIndex = 0;
                                this.lineup();
                            }
                            if (lastTime > this.missileFireTimer && this.attackMissileCounter < this.maxMissilesToFire) {
                                game.fireMissile('enemy', this.currentPosition);
                                this.missileFireTimer = lastTime + this.missileFireDelay;
                                this.attackMissileCounter += 1;
                            }
                            this.attackTimer = lastTime + this.attackMovementSpacing;
                        }
                    }
                }
            }
        }
    };

    Enemy.prototype.render = function (ctx) {
        // console.log(this.currentPosition);
        if (this.destroyed && this.current === 'destroyed') {

            renderDestroyed(this, ctx);
        }
        else if (this.current === 'entering') {
            ctx.translate(this.currentPosition.x, this.currentPosition.y);
            ctx.rotate(this.enterAngles[this.enterIndex]);
            ctx.drawImage(Resources.get(this.sprite.image), -((this.sprite.size.width * this.sprite.scale) / 2), -((this.sprite.size.height * this.sprite.scale) / 2), this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if (this.current === 'attacking') {
            ctx.translate(this.currentPosition.x, this.currentPosition.y);
            ctx.rotate(this.attackAngles[this.attackIndex]);
            ctx.drawImage(Resources.get(this.sprite.image), -((this.sprite.size.width * this.sprite.scale) / 2), -((this.sprite.size.height * this.sprite.scale) / 2), this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        }
        else if (this.current === 'removed') {
            return;
        }
        else {// if (this.current === 'brigade') {
            app.Entity.prototype.render.call(this, ctx);
        }
    };

    var renderDestroyed = function (enemy, ctx) {
        var frmCnt = enemy.frameCounter;
        var sp = enemy.sprite;
        var spF = sp.frames;
        var cp = enemy.currentPosition;
        // console.log('Enemy: 323:  Entity id: ' + enemy.__objId + '  frameCounter: ' + enemy.frameCounter);
        if (spF === 'undefined') {
            // The frameCounter was incremented so need to go back a step
            enemy.frameCounter--;
            app.Entity.prototype.render.call(this, ctx);
        }
        else {
            ctx.drawImage(Resources.get(sp.image), spF[frmCnt].x, spF[frmCnt].y, spF[frmCnt].width, spF[frmCnt].height, cp.x, cp.y, spF[frmCnt].width, spF[frmCnt].height);
        }
    };

    Enemy.prototype._pulseEnemy = function () {
        // console.log(enemy.type);
        switch (this.pulseSide) {
            case 'left':
            {
                if (game.enemyManager.brigadePulseDirection === 'out') {
                    this.direction = -1;
                }
                else {
                    this.direction = 1;
                }
                break;
            }
            case 'right':
            {
                if (game.enemyManager.brigadePulseDirection === 'out') {
                    this.direction = 1;
                }
                else {
                    this.direction = -1;
                }
                break;
            }
        }
        if (game.enemyManager.brigadePulseDirection === 'out') {
            this.vertDirection = +1;
        }
        else {
            this.vertDirection = -1;
        }
    };

    /**
     * @description Determines if the enemy is at home in it's brigade column/row.
     * @method
     * @returns {boolean}
     */
    Enemy.prototype.atHome = function() {
        var atHome = false;
        if (game.enemyManager.brigadeState === 'PULSE') {
            atHome = true;
        }
        else {
            var xHome = this._em.brigadeCurrentPoint.x + (this.column - game.enemyManager.brigadeStartColumn) * game.cellSize;
            var yHome = this._em.brigadeCurrentPoint.y + (this.row - game.enemyManager.brigadeStartRow) * game.cellSize;

            if ((xHome < (this.currentPosition.x + 5) && xHome > (this.currentPosition.x - 5)) && (yHome < (this.currentPosition.y + 5) && yHome > (this.currentPosition.y - 5))) {
                atHome = true;
            }
        }
        return atHome;
    };

    Enemy.prototype.isAlive = function() {
        return (this.current === 'brigade' || this.current === 'entering' || this.current === 'attacking');
    };

    /**
     * Define Callbacks for the various states an enemy can enter.
     * @type {Function}
     */

    Enemy.prototype.onenterstate = function(event, from, to) {
        // console.log('objId: ' + this.__objId + ' event: ' + event + '  from: ' + from + '  to: ' + to);
        this.previousstate = from;

    };
    /**
     * When an enemy is in the 'enter' state, they will fly a defined pattern
     * on to the canvas.
     *
     * An enemy will transition to the 'enter' state at the beginning of each level.
     * Once their entrance is complete, the enemy can only enter the 'BRIGADE' state.
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onstart = function(event, from, to) {
        this.currentPosition = new app.Point(-100, -100);
        this.destroyed = false;
    };

    Enemy.prototype.onleaveentering = function() {

    };

    /**
     * The 'brigade' state will place the enemy in it's defined row/column within the brigade.
     * The enemy will 'fly' to their location from wherever they are located on the canvas.
     * The brigade is stationary.
     *
     * Typically, this state will be entered from: [FLY, ENTER, ATTACK]
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onlineup = function(event, from, to) {

    };

    Enemy.prototype.onbrigadeslide = function(event, from, to) {

        var xMove = game.enemyManager.brigadeCurrentPoint.x + (this.column - game.enemyManager.brigadeStartColumn) * game.cellSize;
        var yMove = game.enemyManager.brigadeCurrentPoint.y + (this.row - game.enemyManager.brigadeStartRow) * game.cellSize;
        this.currentPosition.x = xMove;
        this.currentPosition.y = yMove;
    };

    /**
     * The 'attack' state will cause the enemy to leave the 'brigade' and attack the fighter.
     *
     * This state will be entered from 'BRIGADE' only.
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onattack = function(event, from, to) {
        this.attackMissileCounter = 0;
        this.attackStart = true;
        this.missileFireTimer = Date.now();

    };

    /**
     * The 'fly' state will cause the enemy to fly around the canvas randomly. No missiles will be fired.
     *
     * This state will be entered from: [BRIGADE, ATTACK]
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onfly = function(event, from, to) {

    };

    /**
     * The 'destroy' state will cause the enemy to 'explode'.
     *
     * This state can be entered from: [ENTER, BRIGADE, ATTACK, FLY]
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onkilled = function(event, from, to) {
        this.setDestroy();
        this.sprite = this.sprites.explosion;
        this.frameCounter = 0;

    };

    /**
     * The 'remove' state will place the enemy in the destroyed array. To be resurrected
     * once the level is complete.
     *
     * This state can ONLY be entered from the 'DESTROY' state.
     *
     * @param event
     * @param from
     * @param to
     */
    Enemy.prototype.onleave = function(event, from, to) {
        this.currentPosition.x = -100;
        this.currentPosition.y = -100;
        // console.log('onleave event: ' + event + ' from: ' + from + ' to: ' + to);
    };

    Enemy.prototype.onrestart = function() {
        this.enterIndex = 0;
        this.reset();
    };


    app.Enemy = Enemy;
})();

StateMachine.create({
    target: app.Enemy.prototype,
    initial: 'removed',
    events: [
        { name: 'leave',        from: 'destroyed',   to: 'removed' },
        { name: 'start',        from: 'removed',     to: 'entering' }, // entering is bringing enemy on to the scene.
        { name: 'lineup',       from: 'entering',    to: 'brigade' }, // brigade is all things when enemies are lined up.
        { name: 'killed',       from: 'entering',    to: 'destroyed' },
        { name: 'attack',       from: 'brigade',     to: 'attacking' }, // this action is independent of the brigade movement.
        { name: 'fly',          from: 'brigade',     to: 'flying' }, // this action is independent of the brigade movement.
        { name: 'killed',       from: 'brigade',     to: 'destroyed' },
        { name: 'lineup',       from: 'attacking',   to: 'brigade' },
        { name: 'killed',       from: 'attacking',   to: 'destroyed' },
        { name: 'lineup',       from: 'flying',      to: 'brigade' },
        { name: 'killed',       from: 'flying',      to: 'destroyed' },
        { name: 'restart',      from: ['destroyed', 'entering', 'brigade', 'attacking', 'flying', 'removed'],           to: 'removed' }
    ]
});

