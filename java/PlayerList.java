package Core.C08Packet.modules.render;

import net.ccbluex.liquidbounce.LiquidBounce;
import net.ccbluex.liquidbounce.event.PacketEvent;
import net.ccbluex.liquidbounce.event.EventTarget;
import net.ccbluex.liquidbounce.event.Render2DEvent;
import net.ccbluex.liquidbounce.event.UpdateEvent;
import net.ccbluex.liquidbounce.features.module.Module;
import net.ccbluex.liquidbounce.features.module.ModuleCategory;
import net.ccbluex.liquidbounce.features.module.ModuleInfo;
import net.ccbluex.liquidbounce.ui.font.Fonts;
import net.ccbluex.liquidbounce.utils.render.RenderUtils;
import net.ccbluex.liquidbounce.value.IntegerValue;
import net.minecraft.client.gui.ScaledResolution;
import net.minecraft.network.Packet;
import net.minecraft.network.play.server.S02PacketChat;
import net.minecraft.util.EnumChatFormatting;
import net.minecraft.util.ResourceLocation;

import java.awt.*;
import java.util.concurrent.CopyOnWriteArrayList;

@ModuleInfo(name = "PlayerList", description = "PlayerList.", category = ModuleCategory.RENDER)
public class PlayerList extends Module {
    private final IntegerValue x1 = new IntegerValue("xCoord", 1, 1, 1000);
    private final IntegerValue y1 = new IntegerValue("yCoord", 50, 1, 1000);
    public PlayerListObject king;
    public java.util.List<PlayerListObject> players = new CopyOnWriteArrayList<>();
    private static final String[] messages = new String[]{"was shot by","took the L to","was filled full of lead by","was crushed into moon dust by","was killed by ","was thrown into the void by ","be sent to Davy Jones' locker by","was turned to dust by","was thrown off a cliff by ","was deleted by ","was purified by ","was turned into space dust by","was given the cold shoulder by","was socked by","was oinked by"};

    @Override
    public void onDisable() {
        players.clear();
        king = null;
    }

    public class PlayerListObject {
        public String name;

        public int kills;

        public PlayerListObject(String name, int kills) {
            this.name = name;
            this.kills = kills;
        }
    }

    @EventTarget
    public void onChat(PacketEvent event) {
        block14:
        {
            if (mc.thePlayer == null) {
                return;
            }
            String playerName = null;
            try {
                for (String s : messages) {
                    if(event.getPacket() instanceof S02PacketChat) {
                        String message = ((S02PacketChat) event.getPacket()).getChatComponent().getUnformattedText();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (playerName == null || playerName.isEmpty()) {
                return;
            }

            if (!players.isEmpty()) {
                for (PlayerListObject player : players) {
                    if (!player.name.equals(playerName)) continue;
                    ++player.kills;
                    break block14;
                }
            }
            players.add(new PlayerListObject(playerName, 1));
        }
    }
    @EventTarget
    public void onUpdate(UpdateEvent e) {
        if(mc.thePlayer.ticksExisted<= 1) {
            players.clear();
            king = null;
        }
    }
    @EventTarget
    public void onRender2D(Render2DEvent e) {
        if (mc.thePlayer.isDead) {
            players.clear();
            king = null;
        }
        float textY = y1.get();
        float x = x1.get();
        float y = y1.get();
        RenderUtils.drawRect(x, y, x + mc.fontRendererObj.getStringWidth("PlayerList") + 84, y + mc.fontRendererObj.FONT_HEIGHT + 3, new Color(21, 19, 23,220).getRGB());
        mc.fontRendererObj.drawString("Player List", (int)x + 3, (int)y +2, new Color(255, 255, 255).getRGB());
        players.sort((o1, o2) -> o2.kills - o1.kills);
        for (PlayerListObject player : players) {
            if (player == players.get(0)) {
                king = player;
            }
            RenderUtils.drawRect(x, textY + (float)mc.fontRendererObj.FONT_HEIGHT + 3.0f, x + mc.fontRendererObj.getStringWidth("PlayerList") + 84, textY + (float)mc.fontRendererObj.FONT_HEIGHT + 13.0f, new Color(30, 30, 35, 170).getRGB());
            if (player == king) {
                RenderUtils.drawImage(new ResourceLocation("liquidbounce/PlayerList.png"),(int) (x+1), (int)y+11, 10,10);
                mc.fontRendererObj.drawString(EnumChatFormatting.YELLOW + player.name, (int) (x + (player == king ? 13 : 3)), (int) (mc.fontRendererObj.FONT_HEIGHT + 2f + textY) + 2, -1);
            } else {
                mc.fontRendererObj.drawString(player.name, (int) (x + (player == king ? 12 : 3)), (int) (mc.fontRendererObj.FONT_HEIGHT + 2f + textY) + 2, -1);
            }
            String killString;
            switch (player.kills) {
                case 0:
                case 1:
                case -1:
                    killString = "kill";
                    break;
                default:
                    killString = "kills";
                    break;
            }
            mc.fontRendererObj.drawString(player.kills + " " + killString, (int)(float)(x + mc.fontRendererObj.getStringWidth("PlayerList") + 83 -mc.fontRendererObj.getStringWidth(player.kills + killString) - 2 - (killString.equalsIgnoreCase("kill") ? 3 : 1)), (int) ((int)mc.fontRendererObj.FONT_HEIGHT + 2.5f + textY) + 3, -1);
            textY += 10.0f;
        }
    }
}
