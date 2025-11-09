var scriptName = "CleanAntiFall";
var scriptVersion = 1.0;
var scriptAuthor = "yorik100";
var C03PacketPlayer = Java.type('net.minecraft.network.play.client.C03PacketPlayer');
var C04PacketPlayerPosition = Java.type('net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition')
var C05PacketPlayerLook = Java.type('net.minecraft.network.play.client.C03PacketPlayer.C05PacketPlayerLook');
var C06PacketPlayerPosLook = Java.type('net.minecraft.network.play.client.C03PacketPlayer.C06PacketPlayerPosLook');
var S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");
var BlockPos = Java.type("net.minecraft.util.BlockPos");
 // Converts from degrees to radians.
 Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

var cleanAntiFall = new CleanAntiFall();

var client;

function CleanAntiFall() {
    this.getName = function() {
        return "AntiFall";
    };

    this.getDescription = function() {
        return "AntiFall thingy";
    };

    this.getCategory = function() {
        return "Player";
    };
	var Mode = value.createList("Mode", ["Basic", "Hypixel"], "Basic");
	var VoidOnly = value.createBoolean("VoidOnly", true);
	var MinFallenBlocks = value.createInteger("MinFallenBlocks", 10, 5, 30);
	this.addValues = function(values) {
		values.add(Mode);
		values.add(VoidOnly);
		values.add(MinFallenBlocks);		
	}
    this.onEnable = function() {
    }
	var mario = 0;
	var luigi = 1337;
	var AAAA = false;
	this.onUpdate = function() {
if (mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, 0, 0).expand(0, 0, 0)).isEmpty() && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, -10002.25, 0).expand(0, -10003.75, 0)).isEmpty()){
	//chat.print("Void!")
}
	}
    this.onPacket = function (event) {
        var packet = event.getPacket();
		if (packet instanceof C03PacketPlayer && mc.thePlayer.fallDistance >= MinFallenBlocks.get()){
				switch (Mode.get()) {
					case "Basic":
if (VoidOnly.get() && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, 0, 0).expand(0, 0, 0)).isEmpty() && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, -10002.25, 0).expand(0, -10003.75, 0)).isEmpty()){
packet.y += 11
}else{
if (!VoidOnly.get()){
packet.y += 11
}
}
						break;
				}
}
//luigi = (mario * 0.5)
//chat.print("Times it spoofed ground = " + luigi)
}
	this.onMove = function (event) {
				switch (Mode.get()) {
					case "Hypixel":
if (VoidOnly.get() && mc.thePlayer.fallDistance >= MinFallenBlocks.get() && mc.thePlayer.motionY <= 0 && (AAAA == false || mc.thePlayer.posY <= mario) && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, 0, 0).expand(0, 0, 0)).isEmpty() && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, mc.thePlayer.getEntityBoundingBox().offset(0, -10002.25, 0).expand(0, -10003.75, 0)).isEmpty()){
mc.thePlayer.motionY = 1.85;
mc.thePlayer.motionX = 0;
mc.thePlayer.motionZ = 0;
event.setX(0)
event.setZ(0)
mario = mc.thePlayer.posY;
AAAA = true;

}else{
if (!VoidOnly.get() && mc.thePlayer.fallDistance >= MinFallenBlocks.get() && mc.thePlayer.motionY <= 0 && (AAAA == false || mc.thePlayer.posY <= mario)){
mc.thePlayer.motionY = 1.85;
mc.thePlayer.motionX = 0;
mc.thePlayer.motionZ = 0;
event.setX(0)
event.setZ(0)
mario = mc.thePlayer.posY;
AAAA = true;
}
}
if (mc.thePlayer.onGround){
mario = 0;
AAAA = false;
}
						break;
				}
	}
    this.onDisable = function () {
	mario = 0;
	AAAA = false;
    }
}

function onLoad() {}

function onEnable() {
    client = moduleManager.registerModule(cleanAntiFall);
}

function onDisable() {
    moduleManager.unregisterModule(client);
}