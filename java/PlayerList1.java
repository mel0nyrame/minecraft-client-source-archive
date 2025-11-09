package net.Shmily.Mod.Render;

import com.darkmagician6.eventapi.EventTarget;
import net.Shmily.Events.Event2D;
import net.Shmily.Events.EventChatPrint;
import net.Shmily.Mod.Mod;
import net.Shmily.Other.Object.PlayerListObject;
import net.Shmily.Utils.RenderUtils;
import net.Shmily.Wrapper;
import net.minecraft.util.text.TextFormatting;

import java.awt.*;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/** Like astolfo client PlayerList Mod
 * @author Yalan
 */

public class PlayerList extends Mod {
    private List<PlayerListObject> players = new CopyOnWriteArrayList<>();
    private PlayerListObject no1Player;

    public PlayerList() {
        super("PlayerList",Category.Render);
        setHelp("Show players and their kills");
    }

    @Override
    public void onDisable() {
        players.clear();
        no1Player = null;
    }

    @EventTarget
    public void onChat(EventChatPrint e) {
        String playerName = e.getMessage().split(" foi morto por ")[1];

        if (players.isEmpty()) {
            players.add(new PlayerListObject(playerName, 1));
        } else {
            retry : {
                for (PlayerListObject player : players) {
                    if (player.name.equals(playerName)) {
                        player.kills += 1;
                        break retry;
                    }
                }
                players.add(new PlayerListObject(playerName, 1));
            }
        }
    }

    @EventTarget
    public void onRender2D(Event2D e) {
        float textY = 100;
        float x = 2;
        RenderUtils.drawRect(x,100,x + Wrapper.instance.fontManager.msyh18.getStringWidth("PlayerList") + 40,100 + mc.fontRendererObj.FONT_HEIGHT + 3,new Color(21,19,23).getRGB());
        Wrapper.instance.fontManager.msyh18.drawString("PlayerList",x + 3,99,new Color(255,255,255).getRGB());

        players.sort((o1,o2) -> o2.kills - o1.kills);

        for (PlayerListObject player : players) {
            if (player == players.get(0)) {
                no1Player = player;
            }
            RenderUtils.drawRect(x,textY + mc.fontRendererObj.FONT_HEIGHT + 3,x + Wrapper.instance.fontManager.msyh18.getStringWidth("PlayerList") + 40,textY + mc.fontRendererObj.FONT_HEIGHT + 13,new Color(30, 30, 35, 240).getRGB());
            if (player == no1Player) {
                Wrapper.instance.fontManager.arialunicodems16.drawString(TextFormatting.YELLOW + "\u2726",x + 3,mc.fontRendererObj.FONT_HEIGHT + 1.5f + textY,-1);
            }
            Wrapper.instance.fontManager.arialunicodems16.drawString(player.name,x + (player == no1Player ? 12 : 3),mc.fontRendererObj.FONT_HEIGHT + 1.5f + textY,-1);
            Wrapper.instance.fontManager.arialunicodems16.drawString(player.kills + " kills",x + Wrapper.instance.fontManager.msyh18.getStringWidth("PlayerList") + 40 - Wrapper.instance.fontManager.msyh16.getStringWidth(player.kills + " kills") - 2,mc.fontRendererObj.FONT_HEIGHT + 1.5f + textY,-1);
            textY += 10;
        }
    }
}
