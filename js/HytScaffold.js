var scriptName = 'McYcScaffold'
var scriptAuthor = 'Puppet'
var scriptVersion = 1.0

function ScaffoldAddon() {
	var RotationUtils = Java.type('net.ccbluex.liquidbounce.utils.RotationUtils')
	var Rotation = Java.type('net.ccbluex.liquidbounce.utils.Rotation')
	var Scaffold = moduleManager.getModule('Scaffold')
	function isMoving() {
        return mc.thePlayer.movementInput.moveForward || mc.thePlayer.movementInput.moveStrafe;
    }
	this.getName = function () {
		return 'HytScaffold'
	}

	this.getDescription = function () {
		return 'ScaffoldAddon By As丶One'
	}

	this.getCategory = function () {
		return 'Fun'
	}
	this.onUpdate = function () {
		if(Scaffold.getState()) {
			if(isMoving()){
				Scaffold.getValue('Rotations').set(false)
				DiffYaw = 0
				if(mc.thePlayer.movementInput.moveForward > 0) DiffYaw = 180
				if(mc.thePlayer.movementInput.moveForward < 0) DiffYaw = 0
				RotationUtils.setTargetRotation(new Rotation(mc.thePlayer.rotationYaw + DiffYaw, 86))
				
			}else{
				Scaffold.getValue('Rotations').set(true)
			}
		}
	}
}

var ScaffoldAddon = new ScaffoldAddon()
var ScaffoldAddonClient

function onEnable() {
	ScaffoldAddonClient = moduleManager.registerModule(ScaffoldAddon)
}

function onDisable() {
	moduleManager.unregisterModule(ScaffoldAddonClient)
}