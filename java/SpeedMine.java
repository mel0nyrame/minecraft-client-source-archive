package net.ccbluex.liquidbounce.features.module.modules.world;

import net.ccbluex.liquidbounce.LiquidBounce;
import net.ccbluex.liquidbounce.event.EventTarget;
import net.ccbluex.liquidbounce.event.UpdateEvent;
import net.ccbluex.liquidbounce.features.module.Module;
import net.ccbluex.liquidbounce.features.module.ModuleCategory;
import net.ccbluex.liquidbounce.features.module.ModuleInfo;
import net.ccbluex.liquidbounce.value.*;
import net.minecraft.potion.Potion;
import net.minecraft.potion.PotionEffect;

@ModuleInfo(name = "SpeedMine", description = "Allows you to break blocks faster.", category = ModuleCategory.WORLD,name2 = "Speed Mine",name3 = "加速挖掘")
public class SpeedMine extends Module {

    public ListValue Mode = new ListValue("Mode",new String[]{"Normal","Potion"},"Normal");
    public FloatValue breakDamage = new FloatValue("BreakDamage", 0.8F, 0.1F, 1F);

    @EventTarget
    public void onUpdate(UpdateEvent event) {
        Fucker Fucker = (Fucker) LiquidBounce.moduleManager.getModule(Fucker.class);
        if(Mode.get().equals("Normal")) {
            mc.playerController.blockHitDelay = 0;

            if (mc.playerController.curBlockDamageMP > breakDamage.get())
                mc.playerController.curBlockDamageMP = 1F;

            if (Fucker.getCurrentDamage() > breakDamage.get())
                Fucker.setCurrentDamage(1f);
        }
        if(Mode.get().equals("Potion")) {
            mc.thePlayer.addPotionEffect(new PotionEffect(Potion.digSpeed.getId(), 100, 1));
        }
    }
    @Override
    public void onDisable() {
        mc.thePlayer.removePotionEffect(Potion.digSpeed.getId());
    }
    @Override
    public String getTag(){
        return Mode.get() + "";
    }
}