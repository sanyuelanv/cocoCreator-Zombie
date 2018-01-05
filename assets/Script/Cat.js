import {rand } from './Utils'
cc.Class({
    extends: cc.Component,

    properties: {
        maxCatCount:10,
        catPrefab:{
            default:null,
            type:cc.Prefab,
        }
    },
    onLoad () {
        this.catPool = new cc.NodePool()
        this.catAppear = []

        this._createPool()
        // this.spawnCat()
        
        // this.node.runAction(
        //     cc.repeatForever(
        //         cc.sequence(
        //             cc.callFunc(()=>{
        //                 this.spawnCat()
        //             }),
        //             cc.delayTime(10)
        //         )
        //     )
        // )
    },
    // 创建猫对象池
    _createPool(){
        for(let i=0;i<this.maxCatCount;i++){
            let cat = cc.instantiate(this.catPrefab)
            this.catPool.put(cat)
        }
    },
    spawnCat(width, height){
        let cat = null
        //从对象池取出，没有的话重新创建
        if(this.catPool.size() > 0){
            cat = this.catPool.get()
        }
        else{
            cat = cc.instantiate(this.catPrefab)
        }
        let maxX = width/2 - cat.width/2
        let minX = -width/2 + cat.width/2
        let maxY = height/2 - cat.height/2
        let minY = -height/2 + cat.height/2
        let randX = rand(maxX,minX)
        let randY = rand(maxY,minY)
        cat.setPosition(randX,randY)
        cat.parent = this.node
        
        let actionAppear = cc.scaleTo(0.5,1,1)
        
        let actionLeftWiggle = cc.rotateTo(0.5,180/8+90)
        let actionLeftWiggleReversed = cc.rotateTo(0.5,90)
        let actionSeq1 = cc.sequence(actionLeftWiggle,actionLeftWiggleReversed)
        
        let actionScaleUp = cc.scaleTo(0.5,1.2,1.2)
        let actionScaleUpReversed = cc.scaleTo(0.5,1,1)
        let actionSeq2 = cc.sequence(actionScaleUp,actionScaleUpReversed)
        
        let actionGroup = cc.spawn(actionSeq1,actionSeq2)
        let actionRep = cc.repeat(actionGroup,10)
        let actionDisAppear = cc.scaleTo(0.5,0,0)
        let actionRemove = cc.removeSelf()

        let actionCb = cc.callFunc(()=>{
            this.catPool.put(cat)
        })

        cat.runAction(cc.sequence(actionAppear,actionRep,actionDisAppear,actionRemove,actionCb))
    },
});
