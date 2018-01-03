const PI = Math.PI
export let shortestAngleBetween = (angle1,angle2)=>{
    let twoπ = 2 * PI
    let angle = (angle2 - angle1) % twoπ

    if(angle >= PI){
        angle = angle - twoπ
    }
    if(angle <= -PI){
        angle = angle + twoπ
    }
    return angle
}