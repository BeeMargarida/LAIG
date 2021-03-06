/**
	Animates the camera from one point to another, updating its position
*/
function CameraAnimation(scene, type, ori, dest){
	this.scene = scene;
	this.type = type;
	this.origin = ori;
	this.dest = dest;
	this.timeTotal = 1;

	this.originPos = this.origin.position;
	this.destPos = this.dest.position;

	if(this.type === 0){
		this.positionDist = vec3.create();
		vec3.subtract(this.positionDist, this.destPos, this.originPos);

		this.velPosition = vec3.create();
		this.velPosition[0] = this.positionDist[0] / this.timeTotal;
		this.velPosition[1] = this.positionDist[1] / this.timeTotal;
		this.velPosition[2] = this.positionDist[2] / this.timeTotal;

		this.travelledDisPos = vec3.create(0, 0, 0);

		this.originTarget = this.origin.target;
		this.destTarget = this.dest.target;

		this.targetDist = vec3.create();
		vec3.subtract(this.targetDist, this.destTarget, this.originTarget);

		this.velTarget = vec3.create();
		this.velTarget[0] = this.targetDist[0] / this.timeTotal;
		this.velTarget[1] = this.targetDist[1] / this.timeTotal;
		this.velTarget[2] = this.targetDist[2] / this.timeTotal;

		this.travelledDisTar = vec3.create(0, 0, 0);
	}	
	else if(this.type === 1){
		this.radius = Math.abs(this.originPos[2] - this.destPos[2])/2;
		this.totalDistance = Math.PI * this.radius;
		this.w = (this.totalDistance / this.timeTotal)/this.radius;
		this.deltaAngle = 0;
	}
	this.endAnimation = false;

}

CameraAnimation.prototype = Object.create(CameraAnimation.prototype);
CameraAnimation.prototype.constructor = CameraAnimation;
/**
	Checks if the animation is not over, comparing the starting position and target with the final one
*/
CameraAnimation.prototype.stillNotOver = function() {
	return (Math.abs(this.travelledDisPos[0]) < Math.abs(this.positionDist[0]) || 
			Math.abs(this.travelledDisPos[1]) < Math.abs(this.positionDist[1]) || 
			Math.abs(this.travelledDisPos[2]) < Math.abs(this.positionDist[2]) || 
			Math.abs(this.travelledDisTar[0]) < Math.abs(this.targetDist[0]) || 
			Math.abs(this.travelledDisTar[1]) < Math.abs(this.targetDist[1]) || 
			Math.abs(this.travelledDisTar[2]) < Math.abs(this.targetDist[2]))
}
/**
	Updates the camera according to the correct type of camera animation
*/
CameraAnimation.prototype.update = function(deltaTime){
	if(this.type === 0){
		this.updateFirstType(deltaTime);
	}
	else{
		this.updateSecondType(deltaTime);
	}
	
}
/**
	Updates the camera position and target. Used in animations from and to the beggining camera and to the end
	camera
*/
CameraAnimation.prototype.updateFirstType = function(deltaTime){
	if(this.stillNotOver()){
		var distX = this.velPosition[0] * deltaTime;
		var distY = this.velPosition[1] * deltaTime;
		var distZ = this.velPosition[2] * deltaTime;

		if(Math.abs(this.travelledDisPos[0]) < Math.abs(this.positionDist[0])){
			this.origin.position[0] += distX;
			this.travelledDisPos[0] += distX;
		}
		if(Math.abs(this.travelledDisPos[1]) < Math.abs(this.positionDist[1])){
			this.origin.position[1] += distY;
			this.travelledDisPos[1] += distY;
		}
		if(Math.abs(this.travelledDisPos[2]) < Math.abs(this.positionDist[2])){
			this.origin.position[2] += distZ;
			this.travelledDisPos[2] += distZ;
		}

		distX = this.velTarget[0] * deltaTime;
		distY = this.velTarget[1] * deltaTime;
		distZ = this.velTarget[2] * deltaTime;

		if(Math.abs(this.travelledDisTar[0]) < Math.abs(this.targetDist[0])){
			this.origin.target[0] += distX;
			this.travelledDisTar[0] += distX;
		}
		if(Math.abs(this.travelledDisTar[1]) < Math.abs(this.targetDist[1])){
			this.origin.target[1] += distY;
			this.travelledDisTar[1] += distY;
		}
		if(Math.abs(this.travelledDisTar[2]) < Math.abs(this.targetDist[2])){
			this.origin.target[2] += distZ;
			this.travelledDisTar[2] += distZ;
		}
	}
	else {
		vec3.copy(this.origin.position, this.destPos);
		vec3.copy(this.origin.target, this.destTarget);
		this.endAnimation = true;
	}
}
/**
	Updates the position of the camera. Used between the players cameras
*/
CameraAnimation.prototype.updateSecondType = function(deltaTime){
	if(this.deltaAngle < Math.PI){
		this.deltaAngle += this.w * deltaTime;
		this.origin.orbit(1, this.w * deltaTime);
	}
	else {
		vec3.copy(this.origin.position, this.destPos);
		this.endAnimation = true;
	}
}