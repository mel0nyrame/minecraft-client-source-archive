var scriptName = "JitterVelocity";
var scriptVersion = 6.0;
var scriptAuthor = "WindComing&FunkNight"; 
var Random = Java.type('java.util.Random');
var JitterVelocity = new JitterVelocity();
var Client;
var Combating = false


function JitterVelocity() {
    this.getName = function() {
        return "JitterVelocity";
    };

    this.getDescription = function() {
        return "HYT Jitter velocity";
    };

    this.getTag = function() {
        return "JitterVelocity";
    };
   
    this.getCategory = function() {
        return "Fun";
    };
    this.onDisable = function() { 
     mc.timer.timerSpeed =1
    }
    this.onUpdate = function() { 
        if(mc.thePlayer.hurtTime <= 0 || mc.thePlayer.onGround) && !Combating) {
         mc.timer.timerSpeed =1
        }
        if(mc.thePlayer.hurtTime > 0 ) {
			Reduce()
        }
    }
	this.onAttack = function(event){
		Combating = true
	}
}

function Reduce() {
	var random = new Random();
	var QQ = random.nextInt(5); 
	if(Combating){
		mc.timer.timerSpeed =0.81286457875
		switch(QQ){
			case 1:
				mc.thePlayer.motionX *= 0.0087048710342 
				mc.thePlayer.motionZ *= 0.0087048710342 
				mc.thePlayer.motionY *= 0.659973236764689
			break;
			case 2:
				mc.thePlayer.motionX *= 0.0088041410129
				mc.thePlayer.motionZ *= 0.0088041410129
				mc.thePlayer.motionY *=  0.659973236764689
			break;
			case 3:
				mc.thePlayer.motionX *= 0.00951043207
				mc.thePlayer.motionZ *= 0.00951043207
				mc.thePlayer.motionY *=  0.659973236764689
			break;
			case 4:
				mc.thePlayer.motionX *= 0.009545643206
				mc.thePlayer.motionZ *= 0.009545643206
				mc.thePlayer.motionY *= 0.659973236764689
			break;
		}
	}
}

function onEnable() {
    exampleModuleClient = moduleManager.registerModule(JitterVelocity);
};

function onDisable() {
    moduleManager.unregisterModule(Client);
};