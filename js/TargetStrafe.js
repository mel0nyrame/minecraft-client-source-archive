var scriptName = "TargetStrafe"
var scriptAuthor = "je5442804"
var scriptVersion = 1.6

var RotationUtils = Java.type("net.ccbluex.liquidbounce.utils.RotationUtils")
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils")
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');
var AntiBot = Java.type("net.ccbluex.liquidbounce.features.module.modules.misc.AntiBot")
var Teams = Java.type("net.ccbluex.liquidbounce.features.module.modules.misc.Teams"); //Thank Nvaros
var KillAuraClass = Java.type("net.ccbluex.liquidbounce.LiquidBounce").moduleManager.getModule(Java.type("net.ccbluex.liquidbounce.features.module.modules.combat.KillAura").class);
var KillauraModule = moduleManager.getModule('Killaura');
var Color = Java.type("java.awt.Color");
var LiquidBounce = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var directionection = 0
var target
var direction = 1
/*var KillAuraClass = Java.type("net.ccbluex.liquidbounce.LiquidBounce").moduleManager.getModule(Java.type("net.ccbluex.liquidbounce.features.module.modules.combat.KillAura").class);
var MSTimer = Java.type("net.ccbluex.liquidbounce.utils.timer.MSTimer")
var KillauraModule = moduleManager.getModule('Killaura');*/
// function getClosestEntity() { //Function by Scorpion3013
// 	var filteredEntites = []
// 	for (var i in mc.theWorld.loadedEntityList) {
// 		var entity = mc.theWorld.loadedEntityList[i]
// 		if ( /*entity instanceof EntityPlayer && */ entity != mc.thePlayer) {
// 			filteredEntites.push(entity)
// 		}
// 	}
// 	filteredEntites.sort(function(a, b) {
// 		var distanceA = mc.thePlayer.getDistanceToEntity(a)
// 		var distanceB = mc.thePlayer.getDistanceToEntity(b)
// 		return distanceB < distanceA;
// 	})
// 	return filteredEntites[0];
// }

function canStrafe() {
	return KillauraModule.getState() && KillAuraClass.target != null && !mc.gameSettings.keyBindSneak.pressed;
}

function checkVoid() {
	for (var x = -1; x < 0; ++x)
		for (var z = -1; z < 0; ++z)
			if (isVoid(x, z))
				return true;
	return false;
}

function isVoid(xPos, zPos) {
	if (mc.thePlayer.posY < 0) {
		return true;
	}
	var off = 0;
	while (off < mc.thePlayer.posY + 2) {
		if (mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(xPos, off, zPos)).isEmpty()) {
			off += 2;
			continue;
		}
		return false;
	}
	return true;
}

/*
    private boolean isVoid(int xPos,int zPos) {
        if (mc.thePlayer.posY < 0.0) {
            return true;
        }
        int off = 0;
        while (off < (int) mc.thePlayer.posY + 2) {
            AxisAlignedBB bb = mc.thePlayer.getEntityBoundingBox().offset(xPos, (-off), zPos);
            if (mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, bb).isEmpty()) {
                off += 2;
                continue;
            }
            return false;
        }
        return true;
    }
*/
function isVoid(xPos, zPos) {
	if (mc.thePlayer.posY < 0.0) {
		return true;
	}
	var off = 0;
	while (off < mc.thePlayer.posY + 2) {
		if (mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(xPos, (-off), zPos)).isEmpty()) {
			off += 2;
			continue;
		}
		return false;
	}
	return true;
}
var GL11 = Java.type("org.lwjgl.opengl.GL11");

function TargetStrafe() {
	var radiusValue = value.createFloat("Radius", 0.1, 0.05, 8)
	var sprintValue = value.createBoolean("Sprint", false)
	// var renderValue = value.createBoolean("Render", false)
	this.getName = function() {
		return "TargetStrafe2"
	}
	this.getDescription = function() {
		return "Piao Piao Piao!!!"
	}
	this.getCategory = function() {
		return "Movement"
	}
	this.onEnable = function() {}
	this.onDisable = function() {

	}
	this.addValues = function(values) {
		values.add(radiusValue)
		values.add(sprintValue)
	}
	var player;
	this.onRender3D = function() {
		//if (render.get()) {
		/*					if (KillAuraClass.target == null)
								return;
							target = KillAuraClass.target;
							GL11.glPushMatrix();
							GL11.glDisable(3553);
							GL11.glEnable(2848);
							GL11.glEnable(2881);
							GL11.glEnable(2832);
							GL11.glEnable(3042);
							GL11.glBlendFunc(770, 771);
							GL11.glHint(3154, 4354);
							GL11.glHint(3155, 4354);
							GL11.glHint(3153, 4354);
							GL11.glDisable(2929);
							GL11.glDepthMask(false);
							GL11.glLineWidth(1.0);
							GL11.glBegin(3);
							var x = target.lastTickPosX + (target.posX - target.lastTickPosX) * mc.timer.renderPartialTicks - mc.getRenderManager().viewerPosX;
							var y = target.lastTickPosY + (target.posY - target.lastTickPosY) * mc.timer.renderPartialTicks - mc.getRenderManager().viewerPosY;
							var z = target.lastTickPosZ + (target.posZ - target.lastTickPosZ) * mc.timer.renderPartialTicks - mc.getRenderManager().viewerPosZ;
							for (var i = 0; i < 360; ++i) {
								var rainbow = new Color(Color.HSBtoRGB(((mc.thePlayer.ticksExisted / 70.0 + Math.sin(i / 50.0 * 1.75)) % 1.0), 0.7, 1.0));
								GL11.glColor3f(rainbow.getRed() / 255.0, rainbow.getGreen() / 255.0, rainbow.getBlue() / 255.0);
								GL11.glVertex3d(x + radiusValue.get() * Math.cos(i * 6.283185307179586 / 45.0), y, z + radiusValue.get() * Math.sin(i * 6.283185307179586 / 45.0));
							}
							GL11.glEnd();
							GL11.glDepthMask(true);
							GL11.glEnable(2929);
							GL11.glDisable(2848);
							GL11.glDisable(2881);
							GL11.glEnable(2832);
							GL11.glEnable(3553);
							GL11.glPopMatrix();*/
		//}
		//   if (renderValue.get()) {
		//     if(KillAuraClass.target == null)
		//         return;
		//     var target = KillAuraClass.target;
		//     GL11.glPushMatrix();
		//     GL11.glDisable(3553);
		//     GL11.glEnable(2848);
		//     GL11.glEnable(2881);
		//     GL11.glEnable(2832);
		//     GL11.glEnable(3042);
		//     GL11.glBlendFunc(770, 771);
		//     GL11.glHint(3154, 4354);
		//     GL11.glHint(3155, 4354);
		//     GL11.glHint(3153, 4354);
		//     GL11.glDisable(2929);
		//     GL11.glDepthMask(false);
		//     GL11.glLineWidth(1.0);
		//     GL11.glBegin(3);
		//     var x = target.lastTickPosX + (target.posX - target.lastTickPosX) * event.getPartialTicks() - mc.getRenderManager().viewerPosX;
		//     var y = target.lastTickPosY + (target.posY - target.lastTickPosY) * event.getPartialTicks() - mc.getRenderManager().viewerPosY;
		//     var z = target.lastTickPosZ + (target.posZ - target.lastTickPosZ) * event.getPartialTicks() - mc.getRenderManager().viewerPosZ;
		//     for (var i = 0; i < 360; ++i) {
		//         var rainbow = new Color(Color.HSBtoRGB(((mc.thePlayer.ticksExisted / 70.0 + Math.sin(i / 50.0 * 1.75)) % 1.0), 0.7, 1.0));
		//         GL11.glColor3f(rainbow.getRed() / 255.0, rainbow.getGreen() / 255.0, rainbow.getBlue() / 255.0);
		//         GL11.glVertex3d(x + radiusValue.get() * Math.cos(i * 6.283185307179586 / 45.0), y, z + radiusValue.get() * Math.sin(i * 6.283185307179586 / 45.0));
		//     }
		//     GL11.glEnd();
		//     GL11.glDepthMask(true);
		//     GL11.glEnable(2929);
		//     GL11.glDisable(2848);
		//     GL11.glDisable(2881);
		//     GL11.glEnable(2832);
		//     GL11.glEnable(3553);
		//     GL11.glPopMatrix();
		// }

	}
	this.onMove = function(e) {


		/*		if (mc.thePlayer.isCollidedHorizontally || checkVoid())
					directionection = directionection == 1 ? -1 : 1;
				if (mc.gameSettings.keyBindLeft.isKeyDown()) {
					directionection = 1;
				}
				if (mc.gameSettings.keyBindRight.isKeyDown()) {
					directionection = -1;
				}
				if (!isVoid(0, 0) && canStrafe()){
					if(!sprintValue) mc.thePlayer.setSprinting(false);
					MovementUtils.setSpeed(e, Math.sqrt(Math.pow(e.getX(), 2) + Math.pow(e.getZ(), 2)), RotationUtils.getRotationsEntity(LiquidBounce.moduleManager.getModule(KillAura.class).target).getYaw(), directionection, (mc.thePlayer.getDistanceToEntity(LiquidBounce.moduleManager.getModule(KillAura.class).target)) <= radiusValue.get() ? 0.0 : 1.0);
				}*/

		if (mc.thePlayer.isCollidedHorizontally || checkVoid()) {
			direction = -direction;
		}
		if (mc.gameSettings.keyBindLeft.isKeyDown()) {
			direction = 1;
		}
		if (mc.gameSettings.keyBindRight.isKeyDown()) {
			direction = -1;
		}
		target = KillAuraClass.target;
		if (target != null) {

			// if (((Boolean) spaceDown.get()).booleanValue() && canStrafe()) {
			if (canStrafe()) {
				if (!sprintValue.get()) mc.thePlayer.setSprinting(false);

				// strafe(MovementUtils.getSpeed());
				if (!isVoid(0, 0)) {
/*					if (mc.thePlayer.getDistanceToEntity(target) <= radiusValue.get() + 0.1) {
						MovementUtils.setSpeed(e, Math.round((Math.sqrt(Math.pow(e.getX(), 2) + Math.pow(e.getZ(), 2))) / 0.015625) * 0.015625, RotationUtils.getRotationsEntity(target).getYaw(), direction, 0.0);
					} else {
						MovementUtils.setSpeed(e, Math.round((Math.sqrt(Math.pow(e.getX(), 2) + Math.pow(e.getZ(), 2))) / 0.015625) * 0.015625, RotationUtils.getRotationsEntity(target).getYaw(), direction, 1.0);
					}*/
					if (mc.thePlayer.getDistanceToEntity(target) <= radiusValue.get()) {
						MovementUtils.setSpeed(e, Math.pow(e.getX(), 2) + Math.pow(e.getZ(), 2), RotationUtils.getRotationsEntity(target).getYaw(), direction, 0.0);
					} else {
						MovementUtils.setSpeed(e, Math.pow(e.getX(), 2) + Math.pow(e.getZ(), 2), RotationUtils.getRotationsEntity(target).getYaw(), direction, 1.0);
					}
				}
			}
		}
	}

	this.onStrafe = function(event) {
		if (RotationUtils.targetRotation != null && KillAuraClass.target) {
			RotationUtils.targetRotation.applyStrafeToPlayer(event)
		}
	}
}
var TargetStrafe = new TargetStrafe()
var TargetStrafeClient

function onLoad() {}

function onEnable() {
	TargetStrafeClient = moduleManager.registerModule(TargetStrafe)
}

function onDisable() {
	moduleManager.unregisterModule(TargetStrafeClient)
}