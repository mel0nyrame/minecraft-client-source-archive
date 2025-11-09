var scriptName = "NoHurtPlus";
var scriptVersion = 1.1;
var scriptAuthor = "none";

var NoHurtPlus = new NoHurtPlus();

var client;

script.import("lib/timingFunctions.js");
var LiquidBounce = Java.type('net.ccbluex.liquidbounce.LiquidBounce');
var S02PacketChat = Java.type('net.minecraft.network.play.server.S02PacketChat')

var File = Java.type("java.io.File");
var FileReader = Java.type("java.io.FileReader");
var BufferedReader = Java.type("java.io.BufferedReader");
var FileWriter = Java.type("java.io.FileWriter");
var BufferedWriter = Java.type("java.io.BufferedWriter");
var Timer = Java.type("java.util.Timer");

var ticks = 0;
var spamIndex = 0;
var WordNumber = 0;
var guangGao = true;

function readFile(filePath) {
    try {
        var file = new File(filePath);
        var reader = new BufferedReader(new FileReader(file));
        var content = [];
        var line;

        while ((line = reader.readLine()) !== null) {
            content.push(line);
        }

        return content;
    } catch (err) {
        log("Unable to open file!", true);

        throw err;
    }
}
function writeFile(path, string) {
    try {
        writer = new BufferedWriter(new FileWriter(path));
        writer.write(string);

        writer.close();
    } catch (err) {}
}
function NoHurtPlus() {
	var spamInterval;
    this.getName = function() {
        return "NoHurtPlus";
    };

    this.getDescription = function() {
        return "By Insane";
    };

    this.getCategory = function() {
        return "Fun";
    };
    this.onEnable = function() {

		
    }
    this.onUpdate = function() {

		
}

	this.onPacket = function(event) {
	
	var packet = event.getPacket();

	if(packet instanceof S02PacketChat) {
		if (packet.getChatComponent().getUnformattedText().contains(":" ) == false ) {			
        if (packet.getChatComponent().getUnformattedText().contains("起床战争 >> " ) && packet.getChatComponent().getUnformattedText().contains("死了")) {
			var str1 = packet.getChatComponent().getUnformattedText();
			
				if(str1.contains("杀死了")){
					LiquidBounce.fileManager.friendsConfig.addFriend(str1.match(/杀死了 (\S*)\(/)[1])
					chat.print('§l§8[§a§lSadness§8]' + '§a§l' + '添加无敌人:' + '§c§l§3' + str1.match(/杀死了 (\S*)\(/)[1])					
					deleteuser(str1.match(/杀死了 (\S*)\(/)[1])
					
				}else{							
					LiquidBounce.fileManager.friendsConfig.addFriend(str1.match(/(\S*)\(/)[1])
					chat.print('§l§8[§a§lSadness§8]' + '§a§l' + '添加无敌人:' + '§c§l§3' + str1.match(/(\S*)\(/)[1])
					deleteuser(str1.match(/(\S*)\(/)[1])
				}
				
			}
		if(packet.getChatComponent().getUnformattedText().contains("起床战争>> ") && packet.getChatComponent().getUnformattedText().contains("死了"))	
			var str1 = packet.getChatComponent().getUnformattedText();
				if(str1.contains("杀死了")){
					LiquidBounce.fileManager.friendsConfig.addFriend(str1.match(/杀死了\s(\S*)\s\(/)[1])
					chat.print('§l§8[§a§lSadness§8]' + '§a§l' + '添加无敌人:' + '§c§l§3' + str1.match(/杀死了\s(\S*)\s\(/)[1])					
					deleteuser(str1.match(/杀死了\s(\S*)\s\(/)[1])
					
				}else{							
					LiquidBounce.fileManager.friendsConfig.addFriend(str1.match(/(\S*)\(/)[1])
					chat.print('§l§8[§a§lSadness§8]' + '§a§l' + '添加无敌人:' + '§c§l§3' + str1.match(/(\S*)\s\(/)[1])
					deleteuser(str1.match(/(\S*)\s\(/)[1])
				}			
		}
	}

		
		
	};
	
    this.onDisable = function () {
    }
}




function deleteuser(name) {
				setTimeout(function () {
					LiquidBounce.fileManager.friendsConfig.removeFriend(name)
					chat.print('§l§8[§a§lSadness§8]' + '§a§l' + '删除无敌人:' + '§c§l§9' + name )
				}, 6000);	
}

function onLoad() {}

function onEnable() {
    client = moduleManager.registerModule(NoHurtPlus);
}

function onDisable() {
    moduleManager.unregisterModule(client);

}