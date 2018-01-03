import Config from "Config"
import Zombie from "Zombie"
cc.Class({
    extends: cc.Component,
    properties: {
        zombie:{
            default:null,
            type:Zombie
        }
    },
    // use this for initialization
    onLoad: function () {
        this.gameBox = null
        this.getGameBox()
        this.node.on(cc.Node.EventType.TOUCH_START,this.getFinger,this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.getFinger,this)
    },
    start(){
    },
    // 获取游戏盒边缘
    getGameBox(){
        let {width,height} = this.node
        this.gameBox = new cc.Rect(-width/2,-height/2,width,height)
        this._testBox(width,height)
    },
    // 在边缘描绘
    _testBox(width,height){
        //创建Graphics 组件: 由于不能在canvas中直接创建graphics组件，所以生成一个node来挂载这个组件
        let graphicsNode = new cc.Node('graphics')
        let gp = graphicsNode.addComponent(cc.Graphics)
        graphicsNode.parent = this.node
        gp.strokeColor = cc.hexToColor('#00ff00')
        gp.lineWidth = 10;
        // 左上角: 起点
        gp.moveTo(-width/2,height/2)
        // 左下角
        gp.lineTo(-width/2,-height/2)
        // 右下角
        gp.lineTo(width/2,-height/2)
        //右上角
        gp.lineTo(width/2,height/2)
        // 左上角: 终点
        gp.lineTo(-width/2,height/2)
        gp.stroke()
    },
    // 获取手指位置
    getFinger(event){
        let {width,height} = this.node
        let location = cc.v2(event.getLocation())
        let originPoint = cc.v2(width/2,height/2)
        let touchPoint = location.sub(originPoint)
        this.zombie.getVelocity(touchPoint)
    },
    // 僵尸碰到边缘，速度去相反值
    boundsCheck(){
        let {gameBox,zombie} = this
        let {width,height} = zombie.node
        let { x,y } = zombie.node.getPosition()
        let vx = zombie.velocity.x
        let vy = zombie.velocity.y
        if (x <= gameBox.xMin + width/2){
            x = gameBox.xMin + width/2
            vx = Math.abs(vx)
        }
        if (x >= gameBox.xMax - width/2){
            x = gameBox.xMax- width/2
            vx = - vx
        }
        if (y <= gameBox.yMin + height/2){
            y = gameBox.yMin+ height/2
            vy = Math.abs(vy)
        }
        if (y >= gameBox.yMax -  height/2){
            y = gameBox.yMax - height/2
            vy = -vy
        }
        zombie.node.setPosition(x,y)
        zombie.velocity = cc.v2(vx,vy)
    },
    update: function (dt) {
        this.zombie.move(dt)
        this.zombie.rotate(dt)
        this.boundsCheck()
    },
});
