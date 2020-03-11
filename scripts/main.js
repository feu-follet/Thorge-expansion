//require("blocks")
//require("nuclear-detonator")
//require("prismancer")
//require("effects-applier")


//DEFENSES

//Mending wall
/* Heals every half a second if the health is lower than its max*/
const cooldown = 30;

const MendHealSmall = newEffect(60, e => {
    Draw.color(Color.valueOf("6dff5d"), Color.valueOf("47a73d"), e.fslope());
    Draw.alpha(e.fout() * 0.5)
    Lines.stroke(2 * e.fslope());
    Draw.blend(Blending.additive);
    Lines.square(e.x, e.y, 5, e.fout());
    Draw.blend();
});


const MendHealLarge = newEffect(60, e => {
    Draw.color(Color.valueOf("6dff5d"), Color.valueOf("47a73d"), e.fout());
    Draw.alpha(e.fout() * 0.5)
    Lines.stroke(2 * e.fslope());
    Draw.blend(Blending.additive);
    Lines.square(e.x, e.y, 10, e.fout());
    Draw.blend();
});


const WallMending = extendContent(Wall, "mending-wall", {
    update(tile){
        //when health is lower than max health and cooldown reached
        if ( (tile.entity.health() < tile.entity.maxHealth()) && (tile.entity.timer.get(0, cooldown)) ) {

                   tile.entity.health += 6;
                   Effects.effect(MendHealSmall, tile);
                   
            }
      }
});

const WallMendingLarge = extendContent(Wall, "mending-wall-large", {
    update(tile){
         if ( (tile.entity.health() < tile.entity.maxHealth()) && (tile.entity.timer.get(0, cooldown)) ) {

                   tile.entity.health += 12;
                   Effects.effect(MendHealLarge, tile);
                   
            }
      }
});


//MISCELLANEOUS

//nuclear detonator
//Nuclear effect by trinity
const blastColorA = "ffa853";
const blastColorB = "ff8a17";
const effectLifeTime = 120;

const ExplosionPart = newEffect(effectLifeTime, e => {
        
    Effects.shake(3.2, 3.2, e.x, e.y)   
    Draw.color(Color.valueOf(blastColorA), Color.valueOf(blastColorB), e.fout());
    Draw.alpha(e.fout() * 0.4);
    Draw.blend(Blending.additive);
    Draw.rect("thorge-ex-smoke", e.x, e.y, 400, 400);
    Draw.blend();
  
});


const ExplosionPart2 = newEffect(effectLifeTime, e2 => {

      Draw.color(Color.valueOf(blastColorA), Color.valueOf(blastColorB), e2.fslope());
      Draw.alpha(e2.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-nuke", e2.x, e2.y, 200, 200);
      Draw.blend();
      
      });
      
const ExplosionPart3 = newEffect(effectLifeTime, e3 => {

      Draw.color(Color.valueOf(blastColorA), Color.valueOf(blastColorB), e3.fslope());
      Draw.alpha(e3.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-windWoosh", e3.x, e3.y, e3.fin() * 1200, e3.fin() * 1200);
      Draw.blend();
      
      });     
      

const ExplosionPart4 = newEffect(effectLifeTime, e2 => {

      Draw.color(Color.valueOf(blastColorA), Color.valueOf(blastColorB), e2.fslope());
      Draw.alpha(e2.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-FlareWhite", e2.x, e2.y, 900, 900);
      Draw.blend();
      
      });          
 
const ExplosionPart5 = newEffect(60, e2 => {

      Draw.color(Color.valueOf("ffffff"));
      Draw.alpha(e2.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-flash", e2.x, e2.y, 5000, 5000);
      Draw.blend();
      
      });  
 
 
const detonatorBullet = extend(BombBulletType, {});
detonatorBullet.speed = 0;
detonatorBullet.damage = 1;
detonatorBullet.splashDamageRadius = 1200;
detonatorBullet.splashDamage = 1200;
detonatorBullet.incendAmount = 120;
detonatorBullet.lifetime = 1;
//detonatorBullet.hitSound = sounds.Nuke;
//detonatorBullet.killShooter = true;
 

//create the block type
const silo = extendContent(Block, "nuclear-detonator", {
    //override the method to build configuration
    buildConfiguration(tile, table){
        table.addImageButton(Icon.upOpen, Styles.clearTransi, run(() => {
            //configure the tile to signal that it has been pressed (this sync on client to server)
            tile.configure(0)
        })).size(50).disabled(boolf(b => tile.entity != null && !tile.entity.cons.valid()))
    },

    //override configure event
    configured(tile, value){
        //make sure this silo has the items it needs to fire
        if(tile.entity.cons.valid()){
            //make this effect occur at the tile location
     
            Effects.effect(ExplosionPart, tile);
            Effects.effect(ExplosionPart2, tile);
            Effects.effect(ExplosionPart3, tile);
            Effects.effect(ExplosionPart4, tile); 
            Effects.effect(ExplosionPart5, tile);   
            

            //create 1 kill owner bullet
            for(var i = 0; i < 1; i++){
                Calls.createBullet(
                
                detonatorBullet,
                //tile.getTeam(), 
                Team.derelict,
                tile.drawx(), 
                tile.drawy(), 
                Mathf.random(1), 
                Mathf.random(0.5, 1.0), 
                Mathf.random(0.2, 1.0)
                )
            }
            //triggering consumption makes it use up the items it requires
            tile.entity.cons.trigger()
            tile.entity.kill()
        }
    }
})



//TURRETS

//Prismancer Turret
//by TrinityXyz 
const flare = newEffect(30, e => {

      Draw.color(Color.valueOf("77cbf909"));
      Draw.alpha(e.fout() * 0.3);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-smoke", e.x, e.y, e.fin()*800*Mathf.random(0.5, 1.0), e.fin()*800*Mathf.random(0.5, 1.0));
      Draw.blend();
      
      });       
      
const flare2 = newEffect(30, e => {

      Draw.color(Color.valueOf("77cbf909"));
      Draw.alpha(e.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-smoke", e.x, e.y, 50, 50);
      Draw.blend();
      
      });          
      
const flare3 = newEffect(30, e => {

      Draw.color(Color.valueOf("77cbf909"));
      Draw.alpha(e.fout() * 1);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-FlareWhite", e.x, e.y, 800*e.fin()*Mathf.random(0.5, 1.0), 800*e.fin()*Mathf.random(0.5, 1.0));
      Draw.blend();
      
      });      


//credits to Eye of darkness for the original laser bullet
//modified to have effects by TrinityXyz            
 const prismancerlaser = extend(BasicBulletType, {

    update: function(b){
                 
        Effects.shake(1.5, 1.5, b.x, b.y);
        if(b.timer.get(1, 8)){
            Effects.effect(flare, b.x, b.y, b.rot());
            Effects.effect(flare2, b.x, b.y, b.rot());
            Effects.effect(flare3, b.x, b.y, b.rot());
            Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 480.0, true);
        }
    },


    draw: function(b){

        const colors = [Color.valueOf("77cbf955"), Color.valueOf("77cbf9aa"), Color.valueOf("77cbf9"), Color.valueOf("ffffff")];
        const tscales = [1, 0.7, 0.5, 0.2];
        const strokes = [3.2, 2.1, 1.1, 0.8];
        const lenscales = [1, 1.12, 1.15, 1.17];
        for(var s = 0; s < 4; s++){
            Draw.color(colors[s]);
            for(var i = 0; i < 4; i++){
            
                Tmp.v1.trns(b.rot() + 180, (lenscales[i] - 1) * 35);
                Lines.stroke((9 + Mathf.absin(Time.time(), 0.8, 1.5)) * b.fout() * strokes[s] * tscales[i]);
                Lines.lineAngle(b.x + Tmp.v1.x , b.y + Tmp.v1.y, b.rot(), 480.0 * b.fout() * lenscales[i], CapStyle.none);
            }
        }
    }
});

prismancerlaser.speed = 0.001;
prismancerlaser.damage = 100;
prismancerlaser.lifetime = 60,
prismancerlaser.hitEffect = Fx.hitLancer;
prismancerlaser.despawnEffect = Fx.none;
prismancerlaser.hitSize = 5;
prismancerlaser.drawSize = 800;
prismancerlaser.pierce = true;


const prismancerTurret = extendContent(LaserTurret, "prismancer-turret", {
draw: function(tile){
		Draw.rect(Core.atlas.find("thorge-ex-block-7"), tile.drawx(), tile.drawy());
	},
});
prismancerTurret.shootType = prismancerlaser;



//Ballast TODO
/*
//Make the bullet pierce like a laser

const ballastThorium = extend(BasicBulletType, {

    update: function(b){
                 
        Effects.shake(1.5, 1.5, b.x, b.y);
        if(b.timer.get(1, 8)){
            Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x, b.y, b.rot(), 480.0, true);
        }
    },


    draw: function(b){

        const colors = [Color.valueOf("77cbf955"), Color.valueOf("77cbf9aa"), Color.valueOf("77cbf9"), Color.valueOf("ffffff")];
        const tscales = [1, 0.7, 0.5, 0.2];
        const strokes = [1.2, 1.1, 0.9, 0.8];
        const lenscales = [1, 1.12, 1.13, 1.14];
        for(var s = 0; s < 4; s++){
            Draw.color(colors[s]);
            for(var i = 0; i < 4; i++){
            
                Tmp.v1.trns(b.rot() + 180, (lenscales[i] - 1) * 35);
                Lines.stroke((9 + Mathf.absin(Time.time(), 0.8, 1.5)) * b.fout() * strokes[s] * tscales[i]);
                Lines.lineAngle(b.x + Tmp.v1.x , b.y + Tmp.v1.y, b.rot(), 480.0 * b.fout() * lenscales[i], CapStyle.none);
            }
        }
    }
});

ballastThorium.speed = 0.001;
ballastThorium.damage = 100;
ballastThorium.lifetime = 60,
ballastThorium.hitEffect = Fx.hitLancer;
ballastThorium.despawnEffect = Fx.none;
ballastThorium.hitSize = 1;
ballastThorium.drawSize = 100;
ballastThorium.pierce = true;

const ballastTurret = extendContent(ItemTurret, "ballast-turret", {
 ammo(
  
 )
});
*/


//PRODUCTION

//Quarry Drill
const ambientSmoke = newEffect(120, e => {

      Draw.color(Color.valueOf("777777"));
      Draw.alpha(e.fslope() * 0.4);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-smoke", e.x, e.y, e.fin()*150, e.fin()*150);
      Draw.blend();
      
      });       
      
const ambientBlueSmoke = newEffect(120, e => {

      Draw.color(Color.valueOf("7777dd"));
      Draw.alpha(e.fslope() * 0.4);
      Draw.blend(Blending.additive);
      Draw.rect("thorge-ex-smoke", e.x, e.y, e.fin()*80, e.fin()*80);
      Draw.blend();
      
      });       
            
      
const quarryDrill = extendContent(Drill, "quarry-drill", {});
quarryDrill.updateEffect = ambientSmoke;


const temperPress = extendContent(GenericSmelter, "temper-press", {});
temperPress.updateEffect = ambientBlueSmoke;



/*CORES TODO

const coreAtoma = extendContent(Block, "core-atom", {
    update(tile){}
});

const coreQuark = extendContent(Block, "core-quark", {
    update(tile){}
});

const coreElement = extendContent(Block, "core-element", {
    update(tile){}
});
