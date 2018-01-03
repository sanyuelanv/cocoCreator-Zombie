import {shortestAngleBetween } from './Utils'
const clipName = "run"
cc.Class({
    extends: cc.Component,

    properties: {
        frames:{
            default:[],
            type:[cc.SpriteFrame],
        },
        movePonitPerSec:400,
        rotatePersec:4.0 * Math.PI
    },
    onLoad () {
        this.anim = null
        this.lastTouchLocation = cc.Vec2.ZERO
        this.velocity = cc.Vec2.ZERO
        this._creater()
    },
    move(dt){
        let {velocity} = this
        let zombiePos = this.node.getPosition()
        let addMovePoint = velocity.mul(dt)
        this.node.setPosition(zombiePos.add(addMovePoint))
    },
    rotate(dt){
        let {velocity,rotatePersec} = this
        let angle = this.node.rotation * Math.PI /  180
        let shortTest = shortestAngleBetween(angle,Math.atan2(-velocity.y, velocity.x))
        let toRoate = Math.min(rotatePersec * dt,Math.abs(shortTest))
        this.node.rotation += (((shortTest > 0.0 ? 1.0 : -1.0)  * toRoate)*180/Math.PI)
    },
    stopMove(){
        this.anim.stop(clipName)
        this.velocity = cc.Vec2.ZERO
    },
    getVelocity(touchPoint){
        if(this.velocity.x == 0 && this.velocity.y == 0){
            this.anim.play(clipName)
        }
        let {movePonitPerSec} = this
        let zombiePos = this.node.getPosition()
        let offset = touchPoint.sub(zombiePos)
        let length = offset.mag()
        let direction = offset.div(length)
        this.velocity = direction.mul(movePonitPerSec)
    },
    
    _creater(){
        this.anim = this.node.addComponent(cc.Animation)
        let clip = cc.AnimationClip.createWithSpriteFrames(this.frames,10);
        clip.name = clipName
        clip.wrapMode = cc.WrapMode.Loop
        this.anim.addClip(clip)
    },
});
