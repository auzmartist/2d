// Collision Decorator Pattern Abstraction

// These methods describe the attributes necessary for
// the resulting collision calculations

var Collision = {
    elastic: function(restitution) {
        this.restitution = restitution || .2;
    },

    displace: function() {
    }
};

// The physics entity will take on a shape, collision
// and type based on its parameters. These entities are
// built as functional objects so that they can be
// instantiated by using the 'new' keyword.

var PhysicsEntity = function(collisionName, type) {

    this.type = type || PhysicsEntity.DYNAMIC;

    this.collision = collisionName || PhysicsEntity.ELASTIC;

    this.width  = 20;
    this.height = 20;

    this.halfWidth = this.width * .5;
    this.halfHeight = this.height * .5;

    var collision = Collision[this.collision];
    collision.call(this);

    this.x = 0;
    this.y = 0;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.updateBounds();
};

// Physics entity calculations
PhysicsEntity.prototype = {

    // Update bounds includes the rect's
    // boundary updates
    updateBounds: function() {
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    },

    // Getters for the mid point of the rect
    getMidX: function() {
        return this.halfWidth + this.x;
    },

    getMidY: function() {
        return this.halfHeight + this.y;
    },

    // Getters for the top, left, right, and bottom
    // of the rectangle
    getTop: function() {
        return this.y;
    },
    getLeft: function() {
        return this.x;
    },
    getRight: function() {
        return this.x + this.width;
    },
    getBottom: function() {
        return this.y + this.height;
    }
};

// Constants

// Engine Constants

// These constants represent the 3 different types of
// entities acting in this engine
// These types are derived from Box2D's engine that
// model the behaviors of its own entities/bodies

// Kinematic entities are not affected by gravity, and
// will not allow the solver to solve these elements
// These entities will be our platforms in the stage
PhysicsEntity.KINEMATIC = 'kinematic';

// Dynamic entities will be completely changing and are
// affected by all aspects of the physics system
PhysicsEntity.DYNAMIC   = 'dynamic';

// Solver Constants

// These constants represent the different methods our
// solver will take to resolve collisions

// The displace resolution will only move an entity
// outside of the space of the other and zero the
// velocity in that direction
PhysicsEntity.DISPLACE = 'displace';

// The elastic resolution will displace and also bounce
// the colliding entity off by reducing the velocity by
// its restituion coefficient
PhysicsEntity.ELASTIC = 'elastic';

//COLLISION DETECTION
CollisionDetector.prototype.collideRect = function(collider, collidee){
    var l1 = collider.getLeft();
    var t1 = collider.getTop();
    var r1 = collider.getRight();
    var b1 = collider.getBottom();

    var l2 = collidee.getLeft();
    var t2 = collidee.getTop();
    var r2 = collidee.getRight();
    var b2 = collidee.getBottom();

    if( b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2){
        return false;
    }
    return true;
}

//COLLISION RESOLUTION
resolveElastic: function(player, entity){
    var pMidX = player.getMidX();
    var pMidX = player.getMidY();
    var aMidX = entity.getMidX();
    var aMidX = entity.getMidY();

    var dx = (aMidX - pMidX) / entity.halfWidth;
    var dy = (aMidY - pMidY) / entity.halfHeight;

    var absDX = abs(dx);
    var absDY = abs(dy);

    //aproaching from the corner
    if(abs(absDX - absDY) < 0.1){
        if(dx < 0){
            player.x = entity.getRight();
        }else{
            player.x = entity.getLeft() - player.width;
        }
        if(dy < 0){
            player.y = entity.getBottom();
        }else{
            player.y = entity.getTop() - player.height;
        }

        if(Math.random() < 0.5){
            player.vx = -player.vx * entity.restituion;

            if(abs(player.vx) < STICKY_THRESHOLD){
                player.vx = 0;
            }
        }else{
            player.vy = -player.vy * entity.restituion;
            if(abs(player.vy) <  STICKY_THRESHOLD){
                player.vy = 0;
            }
        }
    //collision from side
    }else if(absDX > absDY){
        if(dx < 0){
            player.x = entity.getRight();
        }else{
            player.x = entity.getLeft() - player.width;
        }

        player.vx = -player.vx * entity.restituion;

        if(abs(player.vx) < STICKY_THRESHOLD){
            player.vx = 0;
        }
    //collision from top or bottom
    }else{
        if(dy < 0){
            player.y = entity.getBottom();
        }else{
            player.y = entity.getTop() - player.height();
        }

        player.vy = -player.vy * entity.restituion;
        if(abs(player.vy) < STICKY_THRESHOLD){
            player.vy = 0;
        }
    }
};

//ENGINE
Engine.prototype.step = function(elapsed) {
    var gx = GRAVITY_X * elapsed;
    var gy = GRAVITY_Y * elapsed;
    var entity;
    var entities = this.entities;

    for(var i = 0, length = entities.length; i < length; i++){
        entity = entities[i];
        switch (entity.type){
            case PhysicsEntity.DYNAMIC:
                entity.vx += entity.ax * elapsed + gx;
                entity.vy += entity.ay * elapsed + gy;
                entity.x += entity.vx * elapsed;
                entity.y += entity.vy * elapsed;
                break;
            case PhysicsEntity.KINEMATIC:
                entity.vx += entity.ax * elapsed;
                entity.vy += entity.ay * elapsed;
                entity.x += entity.vx * elapsed;
                entity.y += entity.vy * elapsed;
                break;
        }
    }

    var collisions = this.collider.detectCollisions(this.player, this.collidables);

    if (collisions != null){
        this.solver.resolve(this.player, collisions);
    }
};


