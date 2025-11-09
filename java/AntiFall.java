package net.ccbluex.liquidbounce.features.module.modules.movement;

import net.ccbluex.liquidbounce.event.*;
import net.ccbluex.liquidbounce.features.module.Module;
import net.ccbluex.liquidbounce.features.module.ModuleCategory;
import net.ccbluex.liquidbounce.features.module.ModuleInfo;
import net.ccbluex.liquidbounce.value.*;
import net.minecraft.client.entity.EntityPlayerSP;
import net.minecraft.client.multiplayer.WorldClient;
import net.minecraft.network.play.client.C03PacketPlayer;
import net.ccbluex.liquidbounce.utils.timer.MSTimer;
import net.minecraft.util.AxisAlignedBB;

@ModuleInfo(name = "AntiFall", description = "Anti Void", category = ModuleCategory.MOVEMENT, name2 = "Anti Fall",name3 = "反虚空")
public class AntiFall extends Module {

	private FloatValue distance = new FloatValue("Distance", 2.5F, 1F, 30F);
	private IntegerValue Time = new IntegerValue("Time",200,100,1000);
	private MSTimer Timer = new MSTimer();

	@Override
	public String getTag () {
		return "" + distance.get();
	}

	@EventTarget
	public void onUpdate(UpdateEvent event) {
		EntityPlayerSP player = mc.thePlayer;
		if ((double) player.fallDistance > distance.get() && !player.capabilities.isFlying && Timer.hasReached(Time.get()) && !isBlockUnder()) {
			mc.getNetHandler().addToSendQueue(new C03PacketPlayer.C04PacketPlayerPosition(player.posX, player.posY + distance.get() + 1.0, player.posZ, false));
		}
	}
	public static boolean isBlockUnder() {
		EntityPlayerSP player = mc.thePlayer;
		WorldClient world = mc.theWorld;
		AxisAlignedBB pBb = player.getEntityBoundingBox();
		double height = player.posY + (double)player.getEyeHeight();
		int offset = 0;
		while ((double)offset < height) {
			if (!world.getCollidingBoundingBoxes(player, pBb.offset(0.0, -offset, 0.0)).isEmpty()) {
				return true;
			}
			offset += 2;
		}
		return false;
	}
}