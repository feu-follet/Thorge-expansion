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
detonatorBullet.lifetime = 0;
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

