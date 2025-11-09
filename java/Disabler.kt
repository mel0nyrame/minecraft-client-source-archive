package net.ccbluex.liquidbounce.features.module.modules.exploit

import net.ccbluex.liquidbounce.LiquidBounce
import net.ccbluex.liquidbounce.event.*
import net.ccbluex.liquidbounce.features.module.Module
import net.ccbluex.liquidbounce.features.module.ModuleCategory
import net.ccbluex.liquidbounce.features.module.ModuleInfo
import net.ccbluex.liquidbounce.features.module.modules.world.Scaffold
import net.ccbluex.liquidbounce.ui.client.hud.element.elements.Notification
import net.ccbluex.liquidbounce.ui.client.hud.element.elements.NotifyType
import net.ccbluex.liquidbounce.utils.ClientUtils
import net.ccbluex.liquidbounce.utils.PacketUtils
import net.ccbluex.liquidbounce.utils.PacketUtils.sendPacketNoEvent
import net.ccbluex.liquidbounce.utils.timer.MSTimer
import net.ccbluex.liquidbounce.utils.timer.TimeUtils
import net.ccbluex.liquidbounce.value.BoolValue
import net.ccbluex.liquidbounce.value.IntegerValue
import net.ccbluex.liquidbounce.value.ListValue
import net.minecraft.network.play.client.*
import net.minecraft.network.play.server.S08PacketPlayerPosLook
import net.minecraft.util.Vec3
import java.util.concurrent.ThreadLocalRandom
import net.minecraft.network.Packet
import net.minecraft.network.play.INetHandlerPlayServer
import java.util.*
import kotlin.collections.ArrayList
import kotlin.math.sqrt


@ModuleInfo(name = "Disabler", description = "Disable some anticheats' checks..", category = ModuleCategory.EXPLOIT)
class Disabler : Module() {

    private val modeValue = ListValue("Mode", arrayOf("Hypixel","Vulcan","Verus"), "Hypixel")

    private val verusSlientFlagApplyValue = BoolValue("VerusSlientFlagApply", false)
    private val verusBufferSizeValue = IntegerValue("VerusBufferSize", 300, 0, 1000)
    private val verusRepeatTimesValue = IntegerValue("Verus-RepeatTimes", 1, 1, 5)
    private val verusRepeatTimesFightingValue = IntegerValue("Verus-RepeatTimesFighting", 1, 1, 5)
    private val verusFlagDelayValue = IntegerValue("Verus-FlagDelay", 40, 35, 60)


    private var initPos: Vec3? = null
    private var counter = 0
    private var cancel = false
    private var verus2Stat = false
    private var modified = false
    private val repeatTimes: Int
    get() = if(LiquidBounce.combatManager.inCombat) { verusRepeatTimesFightingValue.get() } else { verusRepeatTimesValue.get() }
    private val packets = ArrayList<Packet<*>>()
    private val timer = TimeUtils()
    val packet = mutableListOf<Packet<*>>()
    private var currentTrans = 0
    private var vulTickCounterUID = 0
    private val packetBuffer = LinkedList<Packet<INetHandlerPlayServer>>()
    private val lagTimer = MSTimer()
    private val scaffold = LiquidBounce.moduleManager.getModule(Scaffold::class.java) as Scaffold

    override fun onEnable() {
        counter = 0
        timer.reset()
        vulTickCounterUID = -25767
        verus2Stat = false
        lagTimer.reset()
        modified = false
        packetBuffer.clear()
    }

    override fun onDisable() {
        when (modeValue.get().toLowerCase()) {
            "hypixel" -> {
                counter = 0
            }
        }

    }

    @EventTarget
    private fun onPacket(event: PacketEvent) {
        val packet = event.packet
        when (modeValue.get().toLowerCase()) {
            "hypixel" -> {
                if (mc.isSingleplayer()) {
                    return
                }
                if (event.packet is C03PacketPlayer) {
                    if (!event.packet.isMoving && !mc.thePlayer.isUsingItem) {
                        event.cancelEvent()
                    }
                    if (cancel) {
                        if (!timer.hasTimeElapsed(600)) {
                            if (!scaffold.state) {
                                event.cancelEvent()
                                packets.add(event.packet)
                            }
                        } else {
                            packets.forEach(PacketUtils::sendPacketNoEvent)
                            packets.clear()
                            cancel = false
                        }
                    }
                }

                if (event.packet is C03PacketPlayer.C05PacketPlayerLook && mc.thePlayer.isRiding()) {
                    sendPacketNoEvent(C0BPacketEntityAction(mc.thePlayer, C0BPacketEntityAction.Action.START_SPRINTING))
                } else if (event.packet is C0CPacketInput && mc.thePlayer.isRiding()) {
                    sendPacketNoEvent(event.packet)
                    sendPacketNoEvent(C0BPacketEntityAction(mc.thePlayer, C0BPacketEntityAction.Action.STOP_SNEAKING))
                    event.cancelEvent()
                }
                if (event.packet is C03PacketPlayer) {

                    if (mc.thePlayer.ticksExisted === 1) {
                        initPos = Vec3(
                            event.packet.x + getRandom(-1000000.0, 1000000.0),
                            event.packet.y + getRandom(-1000000.0, 1000000.0),
                            event.packet.z + getRandom(-1000000.0, 1000000.0)
                        )
                    } else if (mc.netHandler.doneLoadingTerrain && initPos != null && mc.thePlayer.ticksExisted < 100) {
                        event.packet.x = initPos!!.xCoord
                        event.packet.y = initPos!!.yCoord
                        event.packet.z = initPos!!.zCoord
                    }
                }
                if (event.packet is S08PacketPlayerPosLook) {
                    val packet = event.packet
                    mc.netHandler.addToSendQueue(
                        C03PacketPlayer.C04PacketPlayerPosition(
                            packet.x,
                            packet.y,
                            packet.z,
                            false
                        )
                    )
                    mc.thePlayer.motionZ = 0.0
                    mc.thePlayer.motionY = mc.thePlayer.motionZ
                    mc.thePlayer.motionX = mc.thePlayer.motionY
                    mc.thePlayer.setPosition(packet.x, packet.y, packet.z)
                    mc.thePlayer.prevPosX = mc.thePlayer.posX
                    mc.thePlayer.prevPosY = mc.thePlayer.posY
                    mc.thePlayer.prevPosZ = mc.thePlayer.posZ
                    mc.displayGuiScreen(null)
                    event.cancelEvent()
                }

                if (event.packet is C0BPacketEntityAction) {
                    event.cancelEvent()
                }

                if (mc.getNetHandler().doneLoadingTerrain) {
                    if (!event.isCancelled && (event.packet is C03PacketPlayer || event.packet is C0FPacketConfirmTransaction || event.packet is C00PacketKeepAlive)) {
                        event.cancelEvent()
                        packets.add(event.packet)
                    }
                }
            }

            "vulcan" -> {
                if (packet is C0FPacketConfirmTransaction) {
                    if (Math.abs((Math.abs((packet.uid).toInt()).toInt() - Math.abs(vulTickCounterUID.toInt()).toInt()).toInt()) <= 4) {
                        vulTickCounterUID = (packet.uid).toInt()
                        packetBuffer.add(packet)
                        event.cancelEvent()
                        ClientUtils.displayChatMessage("C0F-PingTickCounter IN ${packetBuffer.size}")
                    }else if (Math.abs((Math.abs((packet.uid).toInt()).toInt() - 25767).toInt()) <= 4) {
                        vulTickCounterUID = (packet.uid).toInt()
                        ClientUtils.displayChatMessage("C0F-PingTickCounter RESETED")
                    }
                }
            }

            "verus" -> {
                if(packet is C0FPacketConfirmTransaction) {
                    packetBuffer.add(packet)
                    event.cancelEvent()
                    if(packetBuffer.size > verusBufferSizeValue.get()) {
                        if(!verus2Stat) {
                            verus2Stat = true
                            LiquidBounce.hud.addNotification(Notification("Verus", "AntiCheat is disabled.", NotifyType.SUCCESS,800))
                        }
                        val packeted = packetBuffer.poll()
                        repeat(repeatTimes) {
                            PacketUtils.sendPacketNoEvent(packeted)
                        }
                    }
                    ClientUtils.displayChatMessage("Packet C0F IN ${packetBuffer.size}")
                } else if(packet is C03PacketPlayer) {
                    if((mc.thePlayer.ticksExisted % verusFlagDelayValue.get() == 0) && (mc.thePlayer.ticksExisted > verusFlagDelayValue.get() + 1) && !modified) {
                        ClientUtils.displayChatMessage("Packet C03")
                        modified = true
                        packet.y -= 11.4514 //
                        packet.onGround = false
                    }
                } else if (packet is S08PacketPlayerPosLook && verusSlientFlagApplyValue.get()) {
                    val x = packet.x - mc.thePlayer.posX
                    val y = packet.y - mc.thePlayer.posY
                    val z = packet.z - mc.thePlayer.posZ
                    val diff = sqrt(x * x + y * y + z * z)
                    if (diff <= 8) {
                        event.cancelEvent()
                        // why didnt they check flag apply delay? LMAO
                        ClientUtils.displayChatMessage("Silent Flag")
                        PacketUtils.sendPacketNoEvent(
                            C03PacketPlayer.C06PacketPlayerPosLook(
                                packet.x,
                                packet.y,
                                packet.z,
                                packet.getYaw(),
                                packet.getPitch(),
                                true
                            )
                        )
                    }
                }

                if (mc.thePlayer != null && mc.thePlayer.ticksExisted <= 7) {
                    lagTimer.reset()
                    packetBuffer.clear()
                }
            }
        }

    }

    @EventTarget
    fun onWorld(event: WorldEvent) {
        counter = 0
        timer.reset()
        currentTrans = 0
        packetBuffer.clear()
        lagTimer.reset()
        vulTickCounterUID = -25767
        verus2Stat = false
        packetBuffer.clear()
        lagTimer.reset()
    }

    @EventTarget
    fun onMotion(event: MotionEvent) {
        if (modeValue.get().equals("hypixel", true)) {
            if (mc.isSingleplayer()) {
                return
            }
            if (event.isPre()) {
                if (packet.size > 50) {
                    while (!packet.isEmpty()) {
                        sendPacketNoEvent(packet.removeAt(0))
                    }
                }
            }
        }
    }

    @EventTarget
    fun onUpdate(event: UpdateEvent) {
        when(modeValue.get()) {
            "vulcan" -> {
                if(lagTimer.hasTimePassed(5000L) && packetBuffer.size > 4) {
                    lagTimer.reset()
                    while (packetBuffer.size > 4) {
                        PacketUtils.sendPacketNoEvent(packetBuffer.poll())
                    }
                }
            }
            "verus" -> {
                modified = false
                if(lagTimer.hasTimePassed(490L)) {
                    lagTimer.reset()
                    if(packetBuffer.isNotEmpty()) {
                        val packet = packetBuffer.poll()
                        repeat(repeatTimes) {
                            PacketUtils.sendPacketNoEvent(packet)
                        }
                        ClientUtils.displayChatMessage("Send Packet Buff")
                    } else {
                        ClientUtils.displayChatMessage("Empty Packet Buff")
                    }
                }
            }
        }
    }

    @EventTarget
    fun onMove(event: MoveEvent) {
        if (!mc.isSingleplayer()) {
            if (timer.hasTimeElapsed(10000)) {
                cancel = true
                timer.reset()
            }
        }
    }

    fun getRandom(min: Double, max: Double): Double {
        var min = min
        var max = max
        if (min == max) {
            return min
        } else if (min > max) {
            val d = min
            min = max
            max = d
        }
        return ThreadLocalRandom.current().nextDouble(min, max)
    }
}