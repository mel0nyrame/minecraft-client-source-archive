/*
 * LiquidBounce Hacked Client
 * A free open source mixin-based injection hacked client for Minecraft using Minecraft Forge.
 * https://github.com/CCBlueX/LiquidBounce/
 */
package net.ccbluex.liquidbounce.features.module.modules.movement.speeds

import io.netty.util.internal.ThreadLocalRandom
import net.ccbluex.liquidbounce.LiquidBounce
import net.ccbluex.liquidbounce.event.EventPreUpdate
import net.ccbluex.liquidbounce.event.JumpEvent
import net.ccbluex.liquidbounce.event.MoveEvent
import net.ccbluex.liquidbounce.features.module.modules.movement.Speed
import net.ccbluex.liquidbounce.utils.MovementUtils.*
import net.minecraft.block.BlockStairs
import net.minecraft.entity.Entity
import net.minecraft.util.BlockPos
import kotlin.math.max


class CustomSpeed : SpeedMode("Custom") {
    override fun onMotion() {
        val speed = LiquidBounce.moduleManager.getModule(Speed::class.java) as Speed? ?: return
        if (isMoving()) {
            mc.timer.timerSpeed = speed.customTimerValue.get()
            if(mc.thePlayer.onGround) {
                setMotion(max(speed.customSpeedValue.get() + getSpeedEffect() * 0.1, getBaseMoveSpeed()))
                mc.thePlayer.motionY = getJumpBoostModifier(speed.customYValue.get().toDouble())
            }
        } else {
            mc.thePlayer.motionX *= 0
            mc.thePlayer.motionZ *= 0
            if (mc.gameSettings.keyBindJump.isKeyDown)
                mc.thePlayer.motionY = getJumpBoostModifier(0.42)
        }
    }
    override fun onJump(event: JumpEvent) {
        if(mc.thePlayer != null)
            event.cancelEvent()
    }
    override fun onPreUpdate(event: EventPreUpdate) {
        if (isMoving() && mc.thePlayer.isCollidedVertically && mc.thePlayer.onGround && mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer as Entity, mc.thePlayer.entityBoundingBox.offset(0.0, 0.5, 0.0)).isEmpty()) {
            event.y = event.y + ThreadLocalRandom.current().nextFloat().toDouble() / 1000.0
            event.isOnground = true
        }
    }
    override fun onEnable() {
        val speed = LiquidBounce.moduleManager.getModule(Speed::class.java) as Speed? ?: return
        if (speed.resetXZValue.get()) {
            mc.thePlayer.motionZ = 0.0
            mc.thePlayer.motionX = 0.0
        }
        if (speed.resetYValue.get())
            mc.thePlayer.motionY = 0.0
        super.onEnable()
    }

    override fun onDisable() {
        mc.timer.timerSpeed = 1f
        super.onDisable()
    }

    override fun onUpdate() {}
    override fun onMove(event: MoveEvent) {
    }
}