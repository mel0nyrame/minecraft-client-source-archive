var scriptName = "SpeedMine";
var scriptAuthor = "NULL";
var scriptVersion = 0.1;

var System = Java.type('java.lang.System');
var LiquidBounce = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var C07PacketPlayerDigging = Java.type('net.minecraft.network.play.client.C07PacketPlayerDigging');
var BlockPos = Java.type('net.minecraft.util.BlockPos');
var EnumFacing = Java.type('net.minecraft.util.EnumFacing');
var Block = Java.type('net.minecraft.block.Block');
var Blocks = Java.type('net.minecraft.init.Blocks');

function Example() {
    this.getName = function () {
        return "SpeedMine";
    }
    this.getDescription = function () {
        return "A script pack with many awesome render modules";
    }
    this.getCategory = function () {
        return "Player";
    }
    var bzs = false;
    var bzx = 0.0;
    var pos;
    var face;
    this.onPacket = function(event) {
        var p = event.getPacket();
        if(p instanceof C07PacketPlayerDigging && mc.playerController != null) {
            if(p.getStatus() == C07PacketPlayerDigging.Action.START_DESTROY_BLOCK) {
                bzs = true;
                pos = p.getPosition();
                face = p.getFacing();
                bzx = 0.0;
            }
            else if(p.getStatus() == C07PacketPlayerDigging.Action.ABORT_DESTROY_BLOCK || p.getStatus() == C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK) {
                bzs = false;
                pos = null;
                face = null;
            }
        }
    }
    
    this.onUpdate = function() {
        if(mc.playerController.extendedReach()) {
            mc.playerController.blockHitDelay = 0;
        } 
        else if(bzs) {
            var block = mc.theWorld.getBlockState(pos).getBlock();
            bzx += (block.getPlayerRelativeBlockHardness(mc.thePlayer, mc.theWorld, pos) * 1.4);
            if (bzx >= 1.0) {
                mc.theWorld.setBlockState(pos, Blocks.air.getDefaultState(), 11);
                mc.thePlayer.sendQueue.getNetworkManager().sendPacket(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK, pos, face));
                bzx = 0.0;
                bzs = false;
            }
        }
    }
}

var example = new Example();
var ExampleClient;

function onEnable() {
    ExampleClient = moduleManager.registerModule(example);
}

function onDisable() {
    moduleManager.unregisterModule(ExampleClient);
}
