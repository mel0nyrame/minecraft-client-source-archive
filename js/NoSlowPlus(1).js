var script = registerScript({
    name: "NoSlowPlus",
    version: "1.1",
    authors: ["Insane"]
});
var BlockPos = Java.type("net.minecraft.util.BlockPos")
var C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement")
var KillAuraClass = Java.type("net.ccbluex.liquidbounce.LiquidBounce").moduleManager.getModule(Java.type("net.ccbluex.liquidbounce.features.module.modules.combat.KillAura").class);
function isBlocking() {
	if (mc.thePlayer.isUsingItem()) return true;
    return mc.thePlayer && (mc.thePlayer.isBlocking() || KillAuraClass.blockingStatus)
}
script.registerModule({
    name: "NoSlowPlus",
    description: "NoSlow Bypass HYT without any lag",
    category: "Movement",
    settings: {
    }
}, function (module) {
    module.on("slowDown", function (event) {
        event.forward = 1.0
        event.strafe = 1.0
    });
    module.on("motion", function (event) { try {
        module.tag = "AAC5";
        var heldItem = mc.thePlayer.getHeldItem()
        if (isBlocking() && heldItem) {
            switch (event.getEventState().getStateName()) {
                case "PRE":
                    break;
                case "POST":
                    mc.thePlayer.sendQueue.addToSendQueue(new C08PacketPlayerBlockPlacement(new BlockPos(-1,-1,-1),-1,mc.thePlayer.inventory.getCurrentItem(),0,0,0));
                    break;
            }
        }
	}catch(err){
		Chat.print(err);
	};
    });
});