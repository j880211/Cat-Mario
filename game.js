var ground_height = 30;
var bg_speed = 4; // 背景移動速度
var player;
// [Todo-g]-1
// 如果是全新的重複物體，記得先全域定義過他的物件群和資訊欄 (eg. blocks, block_info)
var blocks, blue_blocks, question_blocks, monsters, blacks, stairs, grasses , yellows, no_lines;
var block_info, blue_block_info, question_block_info, monster_info, blacks_info, stair_info, grass_info, yellow_info, no_line_info;

var blueflag_time=0;
var step=0;

var state=0;
var life=4;
// 目前地圖左側的 x 值相對於整場遊戲是多少（因為 Mario 能向右邊無限前進，所以這裡要另外計算）
var current_map_left = 0;
var nowstate=0;
var is_moving = false;
var is_collide = false;
// 要新增單一物體（城堡、旗子）請看 [Todo-s]
// 要新增大量重複的物體（草叢、磚塊、怪物）請看 [Todo-g]

var menuState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background.png');
    game.load.image('ground', 'assets/image/ground.png');
    game.load.image('menu','assets/image/menu.png');
    game.load.image('s_btn', 'assets/image/start_button.png');
    game.load.audio('bg_music', 'assets/sound/background_music.mp3');
  },

  create: function() {
    game.add.image(0, 0, 'menu');
    life=4;
    startbutton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.bg_music = game.add.audio('bg_music', 10, true);
    this.bg_music.play();
    
    console.log('start');
    

  },

  update: function() {
    if(startbutton.isDown)
    {
      changeState('L1');
    }

  }
}

var firstState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background.jpg');
    game.load.image('bigface', 'assets/image/bigface.png');
    game.load.image('fly_monster', 'assets/image/fly_high_monster.png');
    game.load.image('green_mountain', 'assets/image/green_mountain.png');
    game.load.image('v_pipe', 'assets/image/pipe.png');
    game.load.spritesheet('me', 'assets/sprite/Mario.png', 40 , 51);
    game.load.spritesheet('block1', 'assets/image/brick.png', 50, 50);
    game.load.spritesheet('block2', 'assets/image/blue_brick.png', 50, 50);
    game.load.spritesheet('block3', 'assets/image/question_box.png', 50, 50);
    game.load.spritesheet('three_brick', 'assets/image/three_brick.png', 150, 50);
    game.load.spritesheet('no_line', 'assets/image/brick_with_no_black_line.png', 50, 50);
    game.load.spritesheet('ground', 'assets/image/floor_16.png');
    game.load.image('castle', 'assets/image/strangebox.png');
    game.load.image('long_flag', 'assets/image/long_flag.png');
    game.load.image('y_flag', 'assets/image/yellow_rectangle_stair.png');
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.is_shoot = false;

    // 創建鍵盤事件
    this.cursor = game.input.keyboard.createCursorKeys();

    // 創建背景與可以站上去的地板
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
    this.bigface = game.add.sprite(200, 60, 'bigface');
    this.green_mountain = game.add.sprite(30, 500, 'green_mountain');
    this.green_mountain.anchor.setTo(0, 1);
    this.move_block = game.add.sprite(425, 325, 'block3');
    this.move_block.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.move_block);
    this.move_block2 = game.add.sprite(675, 325, 'block3');
    this.move_block2.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.move_block2);
    this.three_brick = game.add.sprite(1400, 125, 'three_brick');
    this.three_brick.anchor.setTo(0, 0);
    game.physics.arcade.enable(this.three_brick);
    this.v_pipe = game.add.sprite(1800, 505, 'v_pipe');
    this.v_pipe.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(this.v_pipe);
    this.v_pipe.body.immovable = true;

    this.no_line1 = game.add.sprite(1575, 375, 'no_line');
    this.no_line1.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.no_line1);
    this.no_line1.body.immovable = true;
    this.no_line1.visible = false;
    this.no_line2 = game.add.sprite(1625, 375, 'no_line');
    this.no_line2.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.no_line2);
    this.no_line2.body.immovable = true;
    this.no_line2.visible = false;
    this.no_line3 = game.add.sprite(1675, 375, 'no_line');
    this.no_line3.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.no_line3);
    this.no_line3.body.immovable = true;
    this.no_line3.visible = false;
    this.no_line4 = game.add.sprite(1725, 375, 'no_line');
    this.no_line4.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.no_line4);
    this.no_line4.body.immovable = true;
    this.no_line4.visible = false;

    this.long_flag = game.add.sprite(2350, 150, 'long_flag');
    this.long_flag.scale.setTo(0.8, 0.8);

    this.floor = game.add.sprite(2000, 515, 'ground');
    this.floor.anchor.setTo(0, 0);
    game.physics.arcade.enable(this.floor);
    this.floor.body.immovable = true;

    this.castle = game.add.image(2500, 520, 'castle');
    this.castle.anchor.setTo(0, 1);

    // Set 所有 group 型態的背景物體
    blocks = game.add.group();
    create_things(blocks, 'block1', 0.5, 0.5, 1, 1, 100);
    blue_blocks = game.add.group();
    create_things(blue_blocks, 'block2', 0.5, 0.5, 1, 1, 100);
    question_blocks = game.add.group();
    create_things(question_blocks, 'block3', 0.5, 0.5, 1, 1, 100);
    // no_lines = game.add.group();
    // create_things(no_lines, 'no_line', 0.5, 0.5, 1, 1, 100);
    // no_lines.setAll('body.immovable', true);
    // no_lines.setAll('visible', false);

    this.create_map();
    this.is_create = false;

    // 創建 Mario
    create_mario();
    // Mario 移動相關的判斷
  },

  update: function() {
    // 創建 Mario 和地板的碰撞事件
    nowstate = 1;
    if (game.physics.arcade.collide(player, this.floor)) {
      console.log('floor');
    }
    if (this.move_block.body) {
      if (game.physics.arcade.collide(player, this.move_block)) this.move_block.body.velocity.y = -300;
      if (this.move_block.body.velocity.y != 0) this.move_block.body.velocity.y += 10;
      if (this.move_block.body.y < 0) this.move_block.destroy();
    }
    if (this.move_block2.body) {
      if (game.physics.arcade.collide(player, this.move_block2)) this.move_block2.body.velocity.y = 300;
      if (this.move_block2.body.y > 400 && this.move_block2.body.y + 100 > player.y && this.move_block2.body.y < player.y) die();
    }
    
    if (player.y > 600 || player.y < -100) die();
    if (this.three_brick.body) {
      if (game.physics.arcade.collide(player, this.three_brick)) die();
      if (player.x >= this.three_brick.x) {
        this.three_brick.body.velocity.y = 500;
      }
      if (this.three_brick.body.velocity.y != 0) {
        if (player.x < 1400 - current_map_left && player.x > 1100 - current_map_left && !this.is_create) {
          this.fly_monster = game.add.sprite(player.x - 40, 0, 'fly_monster');
          game.physics.arcade.enable(this.fly_monster);
          this.fly_monster.body.velocity.y = 900;
          this.is_create = true;
        }
      }
    }

    if (!this.is_shoot && Math.abs(this.long_flag.x - player.x) < 400) {
      this.is_shoot = true;
      this.y_flag = game.add.sprite(this.long_flag.x, 200, 'y_flag');
      this.y_flag.anchor.setTo(1, 1);
      game.physics.arcade.enable(this.y_flag);
      this.y_flag.body.velocity.x = -350;
    }

    if (this.y_flag && this.y_flag.body && game.physics.arcade.collide(player, this.y_flag)) die();

    if (this.fly_monster && this.fly_monster.body) {
      if (game.physics.arcade.collide(player, this.fly_monster)) {
        die();
      } else if (this.fly_monster.y > 600) {
        this.fly_monster.reset(player.x - 80, 600);
        this.fly_monster.body.velocity.y = -800;
      } else if (this.fly_monster.y < 0) this.fly_monster.destroy();
    }

    // game.physics.arcade.collide(player, this.v_pipe);

    // console.log(player.x + 20 + current_map_left, this.no_line1.x, this.no_line2.x, this.no_line3.x, this.no_line4.x)
    // console.log(this.no_line1.visible, this.no_line2.visible, this.no_line3.visible, this.no_line4.visible)

    if (player.body.velocity.y < 0 && player.x > this.no_line1.x  - 25 && player.x < this.no_line1.x  + 25 && player.y - 50 <= this.no_line1.y + 25 && player.y >= this.no_line1.y) {
      this.no_line1.visible = true;
      player.body.velocity.y = 0;
    }
    if (player.body.velocity.y < 0 && player.x > this.no_line2.x  - 25 && player.x < this.no_line2.x  + 25 && player.y - 50 <= this.no_line2.y + 25 && player.y >= this.no_line1.y) {
      this.no_line2.visible = true;
      player.body.velocity.y = 0;
    }
    if (player.body.velocity.y < 0 && player.x > this.no_line3.x  - 25 && player.x < this.no_line3.x  + 25 && player.y - 50 <= this.no_line3.y + 25 && player.y >= this.no_line1.y) {
      this.no_line3.visible = true;
      player.body.velocity.y = 0;
    }
    if (player.body.velocity.y < 0 && player.x > this.no_line4.x  - 25 && player.x < this.no_line4.x  + 25 && player.y - 50 <= this.no_line4.y + 25 && player.y >= this.no_line1.y) {
      this.no_line4.visible = true;
      player.body.velocity.y = 0;
    }
    if (this.no_line1.visible) game.physics.arcade.collide(player, this.no_line1);
    if (this.no_line2.visible) game.physics.arcade.collide(player, this.no_line2);
    if (this.no_line3.visible) game.physics.arcade.collide(player, this.no_line3);
    if (this.no_line4.visible) game.physics.arcade.collide(player, this.no_line4);

    if (this.v_pipe.body) {
      if (game.physics.arcade.collide(player, this.v_pipe) && player.body.velocity.y <= 0) {
        this.v_pipe.body.velocity.y = -200;
        if (this.v_pipe.y < -100) this.v_pipe.destroy();
      }
    }

    if (player.x  > this.castle.x && player.x < this.castle.x + 168) {
      console.log('enter');
      if (this.cursor.down.isDown) {
        console.log('down');
        changeState('L2');
      }
    }

    // 創建 MArio 和現有磚頭的碰撞事件
    blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    blue_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    question_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    // no_lines.forEachAlive(block => {
    //   game.physics.arcade.collide(player, block);
    //   console.log(block.visible);
    //   if (player.body.velocity.y < 0 && player.x + 20 > block.x - no_line_info.width / 2 && player.x + 20 < block.x + no_line_info.width / 2 && player.y - 50 <= block.y + no_line_info.width / 2) {
    //     console.log('vvv');
    //     block.visible = true;
    //   }
    // });

    // Mario 移動相關的判斷
    player_move(this.cursor, this.bg, [this.bigface, this.green_mountain, this.move_block, this.move_block2, this.three_brick, this.v_pipe, this.no_line1, this.no_line2, this.no_line3, , this.no_line4, this.floor, this.castle, this.long_flag]);

    generate_blocks(blocks, block_info);
    generate_blocks(blue_blocks, blue_block_info);
    generate_blocks(question_blocks, question_block_info);
    // generate_blocks(no_lines, no_line_info);
  },

  create_map() {
    // 普通磚塊的部分
    block_info = {
      block_x: [  25,   25,   75,   75,  125,  125,  175,  175,  225,  225, 275, 275, 325, 325, 375, 375, 425, 425, 475, 475,
                 525,  525,  575,  575,  625,  625,  625,  675,  675,  725, 725, 725, 775, 775, 825, 825, 825, 875, 875, 925, 925, 975, 975,
                1175, 1175, 1225, 1225, 1275, 1275, 1275, 1325, 1325, 1325, 1375, 1375, 1375, 1425, 1425, 1475, 1475, 1475, 1525, 1525, 1525, 1525,
                1575, 1575, 1575, 1575, 1575, 1625, 1625, 1675, 1675, 1775, 1775, 1825, 1825, 1875, 1875,
                2025, 2025, 2025, 2025, 2025, 2025, 2025], // 請依據 x 的大小排序
      block_y: [ 575, 525, 575, 525, 575, 525, 575, 525, 575, 525, 575, 525, 575, 525, 575, 525, 575, 525, 575, 525,
                 575, 525, 575, 525, 575, 525, 325, 575, 525, 575, 525, 325, 575, 525, 575, 525, 325, 575, 525, 575, 525, 575, 525,
                 575,  525,  575,  525,  575,  525,  325,  575,  525,  325,  575,  525,  325,  575,  525,  575,  525,  475,  575,  525,  475,  425,
                 575,  525,  475,  425,  375,  575,  525,  575,  525,  575,  525,  575,  525,  575,  525,
                 575,  525,  475,  425,  375,  325,  275],
      width: 50
    };

    // 藍磚塊的部分
    blue_block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 50
    };

    question_block_info = {
      block_x: [725, 775], // 請依據 x 的大小排序
      block_y: [125, 325],
      width: 50
    };

    no_line_info = {
      block_x: [1575, 1625, 1675, 1725], // 請依據 x 的大小排序
      block_y: [ 375,  375,  375,  375],
      width: 50
    }
    
    init_things([block_info, blue_block_info, question_block_info, no_line_info]);
  }
}

var secondState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background.jpg');
    game.load.image('ground', 'assets/image/floor_16.png');
    game.load.image('castle', 'assets/image/strangebox.png');
    game.load.image('fly_monster', 'assets/image/fly_high_monster.png');
    game.load.image('orange_block', 'assets/image/orange_box_between_strange_box.jpg');
    game.load.image('h_pipe', 'assets/image/horizontal_pipe.png');
    game.load.image('v_pipe', 'assets/image/pipe.png');
    game.load.spritesheet('me', 'assets/sprite/Mario.png', 40 , 51);
    game.load.spritesheet('block1', 'assets/image/brick.png', 28, 28);
    game.load.spritesheet('block2', 'assets/image/blue_brick.png', 28, 28);
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // 創建鍵盤事件
    this.cursor = game.input.keyboard.createCursorKeys();

    // 創建背景與可以站上去的地板
    // [Todo-s]0
    // 在這裡加入圖片與調整其他參數（中心點、縮放、不可移動之類的）
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
    this.castle = game.add.sprite(50, 395, 'castle');
    this.castle.scale.setTo(0.9,0.9);
    this.orange_block = game.add.sprite(185, 360, 'orange_block');
    this.h_pipe = game.add.sprite(580, 450, 'h_pipe');
    this.v_pipe = game.add.sprite(680, 350, 'v_pipe');
    this.fly_monster = game.add.sprite(700, 350, 'fly_monster');
    this.fly_monster.visible = false;
    this.floor = game.add.tileSprite(0, game.height - ground_height -35, game.width, ground_height+50, 'ground');
    this.floor.scale.setTo(1,0.8);
    game.physics.arcade.enable(this.floor);
    game.physics.arcade.enable(this.orange_block);
    game.physics.arcade.enable(this.h_pipe);
    game.physics.arcade.enable(this.v_pipe);
    game.physics.arcade.enable(this.fly_monster);
    this.floor.body.immovable = true;
    this.orange_block.body.immovable = true;
    this.h_pipe.body.immovable = true;
    this.v_pipe.body.immovable = true;

    // [Todo-g]0
    // 在這裡以 add.grop() 創建物件群，再以 create_things(物件群, 圖片名, arcade_x, arcade_y, scale_x, scale_y, 總數量）初始化
    blocks = game.add.group();
    create_things(blocks, 'block1', 0.5, 0.5, 1, 1, 100);
    blue_blocks = game.add.group();
    create_things(blue_blocks, 'block2', 0.5, 0.5, 1, 1, 100);

    this.create_map();

    // 創建 Mario
    create_mario();
  },

  update: function() {
    // [Todo-s]1
    // 如果是有碰撞效果的物體，在這邊加入碰撞
    nowstate=2;
    game.physics.arcade.collide(player, this.floor);
    game.physics.arcade.collide(player, this.orange_block);
    game.physics.arcade.collide(player, this.h_pipe);
    game.physics.arcade.collide(player, this.v_pipe);

    // [Todo-g]1
    // 在這裡用 forEachAlive() 把目前畫面中存在的物體都與 mario 加上碰撞
    blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    blue_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });

    // 創建 MArio 和enemy的碰撞事件
    game.physics.arcade.overlap(player, this.fly_monster, this.die);
    // Mario 移動相關的判斷
    // [Todo-s]2
    // player_move 的第三個參數是陣列，裡面存放的是所有會跟著地圖移動的單一物體，記得加進來
    player_move2(this.cursor, this.bg, [this.floor, this.orange_block, this.h_pipe, this.v_pipe, this.castle, this.fly_monster]);

    // [Todo-g]2
    // 用 generate_blocks(物件群, 物件資訊欄) 來畫出重複物體，記得加進來
    generate_blocks(blocks, block_info);
    generate_blocks(blue_blocks, blue_block_info);

    // 所有「Player 走到某處就觸發什麼事件」的判斷都能寫在這，這樣就不用特別獨立出不同的 player_move 了
    if (player.x + current_map_left >= 660) {
      console.log('done');
      this.fly_monster.visible = true;
      this.fly_monster.body.velocity.y = -800;
    }

  },

  create_map() {
    // [Todo-g]3
    // 把物件資訊欄按照註解填好

    // 普通磚塊的部分
    block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28    // 圖片寬度
    };


    blue_block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28
    };

    // [Todo-g]4
    // init_things 參數是一個陣列，裡面裝了 create_map() 裡每個資訊欄
    init_things([block_info, blue_block_info]);
  },
  
  die: function(){
    console.log('die');
    game.state.start('end');
  }
}
function player_move2(cursor, bg, others = []) {
  // 背景移動速度
  if (cursor.left.isDown) {
    if (player.x > player.body.width / 2) player.body.velocity.x = -200;
    else {
      player.body.velocity.x = 0;
      player.x = player.body.width / 2;
    }
    if (!cursor.up.isDown) player.animations.play('leftwalk');
    player.facingRight = false;
  }
  else if (cursor.right.isDown) {
     player.body.velocity.x = 200;
      things_moving();
    if (!cursor.up.isDown) player.animations.play('rightwalk');
    player.facingRight = true;
  }
  else if(cursor.down.isDown){
    if(player.x >= 670) changeState('L3');
  }
  else {
    player.body.velocity.x = 0;
    if (player.facingRight) player.frame = 1;
    else player.frame = 3;
    // 停止動畫
    // player.animations.stop();
  }

  if (cursor.up.isDown) {
    if(player.body.touching.down){
        // Move the player upward (jump)
        if (player.facingRight) player.animations.play('rightjump');
        else player.animations.play('leftjump');
        player.body.velocity.y = -750;
    }
  }
}

var thirdState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background2.jpg');
    game.load.image('bigcat', 'assets/image/character2.png');
    game.load.image('ground', 'assets/image/floor_second_kind_16.png');
    game.load.image('gmonster', 'assets/image/green_monster.png');
    game.load.spritesheet('monster', 'assets/image/monster3.png',100,100);
    game.load.spritesheet('monster2', 'assets/image/monster2.png',100,100);
    game.load.spritesheet('me', 'assets/sprite/Mario.png', 40 , 51);
    game.load.spritesheet('block1', 'assets/image/floor_second_kind_1.png', 50, 100);
    game.load.spritesheet('block2', 'assets/image/blue_brick.png', 28, 28);
    game.load.spritesheet('block3', 'assets/image/question_box.png', 42, 42);
    game.load.spritesheet('black', 'assets/image/one_blue_brick.png', 45, 45);
    game.load.spritesheet('flag', 'assets/image/flag.png', 100, 100);
    game.load.spritesheet('yellow', 'assets/image/yellow_rectangle_stair.png', 100, 100);
    game.load.spritesheet('no_line', 'assets/image/bluebrick_with_no_line.png', 100, 100);
    game.load.spritesheet('mushroom', 'assets/image/mushroom.png', 45, 45);
    game.load.image('v_pipe', 'assets/image/low_pipe.png');
    game.load.image('five_brick', 'assets/image/five_brick.png');
    game.load.image('five_bluebrick', 'assets/image/five_horizontal_bluebrick.png');
    game.load.spritesheet('green_question', 'assets/image/green_question.png', 52, 52);
    game.load.spritesheet('teacher', 'assets/image/teacher.png', 142, 162);
    game.load.spritesheet('25brick', 'assets/image/wholebluebrick.png', 250, 270);
    game.load.spritesheet('second_level_pipe', 'assets/image/second_level_pipe.png', 209, 334);
    game.load.spritesheet('penguin', 'assets/image/penguin.png', 255, 325);
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // 創建鍵盤事件
    this.cursor = game.input.keyboard.createCursorKeys();

    // 創建背景與可以站上去的地板
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
    // this.floor = game.add.tileSprite(0, game.height - ground_height -35, game.width, ground_height+50, 'ground');
    // this.floor.scale.setTo(1,0.8);
    // game.physics.arcade.enable(this.floor);
    // this.floor.body.immovable = true;

    // Set 所有非 group 型態的背景物體
    this.green_monster = game.add.sprite(1355, 400, 'gmonster');
    this.green_monster.scale.setTo(1,1);
    game.physics.arcade.enable(this.green_monster);

    this.monster2 = game.add.sprite(4100, 280, 'monster2');
    this.monster2.scale.setTo(1,1);
    game.physics.arcade.enable(this.monster2);

    this.mushroom = game.add.sprite(3855, 173, 'mushroom');
    this.mushroom.visible = false;
    game.physics.arcade.enable(this.mushroom);
    this.no_line1 = game.add.sprite(3855, 179, 'no_line');
    game.physics.arcade.enable(this.no_line1);
    this.no_line1.body.immovable = true;
    this.q_block = game.add.sprite(3855, 179, 'block3');
    game.physics.arcade.enable(this.q_block);
    this.q_block.body.immovable = true;
    this.mush_time=0;

    this.v_pipe = game.add.sprite(2650, 440, 'v_pipe');
    game.physics.arcade.enable(this.v_pipe);
    this.v_pipe.body.immovable = true;

    this.five_brick = game.add.sprite(3452, 20, 'five_brick');
    game.physics.arcade.enable(this.five_brick);

    this.five_bluebrick = game.add.sprite(3232, 20, 'five_bluebrick');
    game.physics.arcade.enable(this.five_bluebrick);

    this.bigcat = game.add.sprite(2650, 430, 'bigcat');
    game.physics.arcade.enable(this.bigcat);
    
    this.flag = game.add.sprite(2995, 450, 'flag');
    game.physics.arcade.enable(this.flag);

    this.no_line = game.add.sprite(2400, 350, 'no_line');
    game.physics.arcade.enable(this.no_line);
    this.no_line.body.immovable = true;
    this.no_line.visible = false;
    this.line_time=0;

    this.green_question = game.add.sprite(4750, 385, 'green_question');
    game.physics.arcade.enable(this.green_question);
    this.teacher = game.add.sprite(4750, 385, 'teacher');
    game.physics.arcade.enable(this.teacher);
    this.teacher.visible = false;
    this.teacher.outOfBoundsKill = true;
    this.brick_25 = game.add.sprite(5950, 334, '25brick');
    game.physics.arcade.enable(this.brick_25);
    this.brick25_time=0;
    this.f_pipe = game.add.sprite(6250, 0, 'second_level_pipe');
    game.physics.arcade.enable(this.f_pipe);
    this.f_pipe_time=0;

    this.penguin = game.add.sprite(4050, 0, 'penguin');
    game.physics.arcade.enable(this.penguin);
    this.penguin.visible = false;
    this.penguin.outOfBoundsKill = true;
    // Set 所有 group 型態背景物體的參數
    this.create_map();

    // Set 所有 group 型態的背景物體，參數分別為
    // 物體名稱（宣告在檔案最上方）、圖片名稱、anchor.x、anchor.y、scale.x、scale.y、group 總個數
    blocks = game.add.group();
    create_things(blocks, 'block1', 0.5, 0.5, 1, 0.8, 200);
    blue_blocks = game.add.group();
    create_things(blue_blocks, 'block2', 0.5, 0.5, 1.7, 1.7, 100);
    question_blocks = game.add.group();
    create_things(question_blocks, 'block3', 0.5, 0.5, 1, 1, 100);
    monsters = game.add.group();
    create_things(monsters, 'monster', 0.5, 0.5, 0.5, 0.5, 100);
    blacks = game.add.group();
    create_things(blacks, 'black', 0.5, 0.5, 1.111111, 1.111111, 200);
    yellows = game.add.group();
    create_things(yellows, 'yellow', 0.5, 0.5, 1, 1, 100);
    
    this.bigcat_time=0;
    this.bigcat.visible = false;

    this.monster_delay=0;
    this.monster_direction=-1;

    this.yellowspeed=1;

    this.monster2_delay=0;
    this.monster2_direction=-1;
    // 創建 Mario
    create_mario();
    player.y=0;
    player.x=100;
  },

  update: function() {
    // 創建 Mario 和地板的碰撞事件
    nowstate=3;
    if(player.y>=600) this.die();

    if (this.monster2.body) {
      if(this.monster2.x<=800 && this.monster2.x>=0){
        this.monster2.body.velocity.x = 100 * this.monster2_direction;
      }
      else this.monster2.body.velocity.x = 0;
      if(game.physics.arcade.overlap(this.monster2, this.mushroom)) {
        this.monster2.destroy();
        this.mushroom.destroy();
        this.penguin.visible = true;
        this.penguin.bringToTop();
        this.penguin.body.gravity.y = 100;
      }
    }
    
    if (this.green_question.body) {
      if(game.physics.arcade.collide(player, this.green_question)) {
        this.green_question.destroy();
        this.teacher.visible = true;
        this.teacher.body.velocity.x=50;
        this.teacher.body.velocity.y=-200;
      }
    }
    
    if(game.physics.arcade.collide(player, this.mushroom)) this.die();

    if (this.q_block.body) {
      if(game.physics.arcade.collide(player, this.q_block) && this.mush_time==0){
        this.mush_time=1;
        this.q_block.destroy();
        this.mushroom.visible = true;
        this.mushroom.body.velocity.y = -30;
      }
    }
    
    if (this.mushroom.body) {
      if(this.mushroom.y<134){
        this.mushroom.y=134;
        this.mushroom.body.velocity.x = 50;
      }
      if (this.mushroom.x>this.no_line1.x+110 && this.mushroom.y==134){
        this.mushroom.body.gravity.y = 500;
      }
    }
    
    if(game.physics.arcade.collide(player, this.green_monster)) this.die();
    if(game.physics.arcade.collide(player, this.monster2)) this.die();
    game.physics.arcade.collide(player, this.no_line);
    if(game.physics.arcade.collide(player, this.v_pipe) && this.bigcat_time==0) {
      this.bigcatjump(this.bigcat,this.v_pipe);
      this.bigcat_time=1;
    }
    if(game.physics.arcade.overlap(player, this.bigcat)) this.die();
    if(game.physics.arcade.overlap(player, this.five_brick)) this.die();
    if(game.physics.arcade.overlap(player, this.five_bluebrick)) this.die();


    if (player.body.x>=this.brick_25.x-30 && this.brick25_time==0){
      this.brick_25.body.gravity.y=300;
      this.brick25_time=1;
    }
    if (player.body.x>=this.f_pipe.x-30 && this.f_pipe_time==0){
      this.f_pipe_time=1;
      this.f_pipe.bringToTop();
    }
    if (player.body.x>=this.f_pipe.x+30){
      changeState('L4');
    }
    // 創建 MArio 和現有磚頭的碰撞事件
    blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    blue_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    question_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    yellows.forEachAlive(block => {
      block.body.velocity.y = 100*this.yellowspeed;
      if(game.physics.arcade.collide(player, block)){
        this.yellowspeed = 2;
      };
      if(block.y >= 590) block.y = 0;
    });
    monsters.forEachAlive(block => {
      if(game.physics.arcade.collide(player, block)) this.die();
      block.body.velocity.x= 100 * this.monster_direction;
      if(game.physics.arcade.collide(blue_blocks, block)){
        if(this.monster_delay < game.time.now){
          this.monster_direction *= -1;
          this.monster_delay = game.time.now+1000;
        }
      }
    });
    blacks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
      game.physics.arcade.collide(this.mushroom, block);
      if(game.physics.arcade.collide(this.monster2, block)||this.monster2.x>=800){
        if(this.monster2_delay < game.time.now){
          this.monster2_direction *= -1;
          this.monster2_delay += 1000;
        }
      }
    });

    if (player.body.x>=this.no_line.x-30 && player.body.y<=this.no_line.y+100 && this.line_time==0){
      this.line_time=1;
      this.no_line.visible = true;
    }
    if (this.line_time==1 && player.body.x>=this.no_line.x-10 && player.body.y<=this.no_line.y-30 && player.body.y>=this.no_line.y-80){
      this.no_line.y = -50;
      this.line_time=2;
    }
    // 所有 group 形式的背景物體都能用這個方式 generate 出來
    generate_blocks(blocks, block_info);
    generate_blocks(blue_blocks, blue_block_info);
    generate_blocks(question_blocks, question_block_info);
    generate_blocks(monsters, monster_info);
    generate_blocks(blacks, blacks_info);
    generate_blocks(yellows, yellow_info);

    // Mario 移動相關的判斷
    // 第三個參數是 array 形式，裡面裝了所有非 group 形式的背景物體
    // 只要這樣包好就能讓這些物體直接能跟著動了～
    player_move(this.cursor, this.bg, [this.five_bluebrick, this.five_brick, this.v_pipe, this.bigcat, this.green_monster,this.flag,this.no_line,this.monster2,this.q_block,this.no_line1,this.mushroom,this.green_question,this.teacher,this.brick_25,this.f_pipe,this.penguin]);

    // 所有「Player 走到某處就觸發什麼事件」的判斷都能寫在這，這樣就不用特別獨立出不同的 player_move 了
    if(player.x <= this.five_bluebrick.x + 200 && player.x >= this.five_bluebrick.x && this.five_brick.body.velocity.y == 500) this.five_bluebrick.body.velocity.y = 500;
    if(player.x >= this.five_brick.x) this.five_brick.body.velocity.y = 500;
  },

  create_map() {
    // 普通磚塊的部分
    block_info = {
      block_x: [25,75,125,175,225,275,325,375,425,475,525,575,625,675,725,775,825,875,925,975,1025,1075,1125,1175,1225,1275,1325,1375,1425,1475,1525,1575,1625,1675,1725,1775,1825,1875,1925,1975,2025,2075,2275,2325,2375,2575,2625,2675,2725,2775,2825,2975,3025,3275,3325,3375,3425,3475,3525,3725,3775,3825,3875,3925,3975,4025,4075,4125,4175,4225,4275,4325,4375,4425,4475,4525,4575,4625,4575,4625,4675,4725,4775,4825,4875,4925,4975,5025,5075,5125,5175,5225,5275,5325,5375], // 請依據 x 的大小排序
      block_y: [570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570,570],
      width: 50
    };

    // 藍磚塊的部分
    blue_block_info = {
      block_x: [680,780,780,880,880,880,980,980,980,980,1230,1230,1230,1230,1330,1330,1330,1430,1430,1530,3725,3775,3825,3875,3925,3975,4025,4075,4125,4225,4275,4325,4375,4425,4475,4525,4575,4625,4675,4725,4775,4825,4875,4925,4975,5025,5075,5125,5175,5225,5275,5325,5375], // 請依據 x 的大小排序
      block_y: [513,513,465,513,465,417,513,465,417,369, 513, 465, 417, 369, 513, 465, 417, 513, 465, 513,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25],
      width: 28
    };

    question_block_info = {
      block_x: [375,420,465,510,3920,3965], // 請依據 x 的大小排序
      block_y: [375,375,375,375,200,200],
      width: 42
    };

    monster_info = {
      block_x: [510,400,1100,1750,1800,1850], // 請依據 x 的大小排序
      block_y: [510,510, 510, 510, 510, 510],
      width: 50
    };

    blacks_info = {
      block_x: [25,25,25,25,25,25,25,25,25,225,275,325,375,425,475,525,575,625,675,725,775,825,875,925,975,1025,1075,1125,1175,1225,1275,1325,1375,1425,1475,1525,1575,1625,1675,1725,1775,1825,1875,1925,1975,2025,2075,2125,2175,2225,2275,2325,2375,2425,2475,2525,2625,2625,3875,3925,3925,3975,3975,3975,4025,4025,4025,4025,4025,4075,4075,4075,4075,4125,4125,4125,4125,4175,4175,4175,4175,4175,4175,4175,4175,4175,4225,4225,4225,4225,4275,4275,4275,4275,4275,4325,4325,4325,4325,4375,4375,4375,4425,4425,4475,4725,4775,4775,4825,5275,5325,5325,5375,5375,5375,5875,5875,5875,5875,5875,5875,5875,5925,5925,5925,5925,5925,5925,5925,5975,6025,6075,6125,6175,6225,6225,6225,6225,6225,6225,6225,6275,6275,6275,6275,6275,6275,6275,6325,6325,6325,6325,6325,6325,6325,6375,6375,6375,6375,6375,6375,6425,6425,6425,6425,6425,6425], // 請依據 x 的大小排序
      block_y: [25,75,125,175,225,275,325,375,425,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,75,510,510,460,510,460,410,510,460,410,360,310,510,460,410,360,510,460,410,360,25,75,125,175,225,510,460,410,360,510,460,410,360,510,460,410,360,310,510,460,410,360,510,460,410,510,460,510,510,460,510,510,510,460,510,410,460,510,25,610,560,510,460,410,360,25,610,560,510,460,410,360,25,25,25,25,25,25,610,560,510,460,410,360,25,610,560,510,460,410,360,25,610,560,510,460,410,360,610,560,510,460,410,360,610,560,510,460,410,360],
      width: 50
    };

    yellow_info = {
      block_x: [5525,5525,5725,5725], // 請依據 x 的大小排序
      block_y: [100,400,150,450],
      width: 150
    };
    
    // 以 array 形式包裝上述提到的所有 info，以將所有參數初始值設定好
    init_things([block_info, blue_block_info, question_block_info, monster_info, blacks_info,yellow_info]);
  },

  bigcatjump(bigcat,v_pipe){
    this.bigcat.visible = true;
    bigcat.reset(v_pipe.x+30, v_pipe.y-80);
    bigcat.body.velocity.x = -60;
    bigcat.body.velocity.y = -200;
    bigcat.body.gravity.y = 350;
  },

  die(){
    console.log('die');
    game.state.start('end');
  }
}

var fourthState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background.jpg');
    game.load.image('ground', 'assets/image/floor_16.png');
    game.load.image('stair', 'assets/image/stairs.png');
    game.load.image('bigface', 'assets/image/bigface.png');
    game.load.image('bigcat', 'assets/image/character2.png');
    game.load.image('grass', 'assets/image/grass.png');
    game.load.image('low_pipe', 'assets/image/low_pipe.png');
    game.load.image('blue_flag', 'assets/image/blue_flag.png');
    game.load.image('castle', 'assets/image/strangebox.png');
    game.load.image('long_flag', 'assets/image/long_flag.png');
    game.load.spritesheet('me', 'assets/sprite/Mario.png', 40 , 51);
    game.load.spritesheet('block1', 'assets/image/brick.png',50, 50);
    game.load.spritesheet('block2', 'assets/image/blue_brick.png', 28, 28);
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // 創建鍵盤事件
    this.cursor = game.input.keyboard.createCursorKeys();

    // 創建背景與可以站上去的地板
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
    this.low_pipe = game.add.sprite(80, 440, 'low_pipe');
    this.bigcat = game.add.sprite(115, 400, 'bigcat');
    this.longflag = game.add.sprite(1290, 50, 'long_flag');
    this.blueflag = game.add.sprite(930, 50, 'blue_flag');
    this.bigface = game.add.sprite(45, 25, 'bigface');
    this.bigface2 = game.add.sprite(1810, 25, 'bigface');
    this.floor = game.add.tileSprite(0, game.height - ground_height -35, game.width, ground_height+50, 'ground');
    this.floor.scale.setTo(1,0.8);
    this.block_last = game.add.sprite(1285, 485, 'block1');
    this.grass = game.add.sprite(1870, 500, 'grass');
    this.castle = game.add.sprite(1570, 390, 'castle');
    this.castle.scale.setTo(0.9,0.9);
    game.physics.arcade.enable(this.floor);
    game.physics.arcade.enable(this.block_last);
    game.physics.arcade.enable(this.low_pipe);
    game.physics.arcade.enable(this.bigcat);
    game.physics.arcade.enable(this.longflag);
    game.physics.arcade.enable(this.blueflag);
    this.bigcat.body.velocity.y = -800;
    this.bigcat.body.velocity.x = 100;
    this.floor.body.immovable = true;
    this.longflag.body.immovable = true;
    this.low_pipe.body.immovable = true;
    this.block_last.body.immovable = true;
    this.blueflag.body.immovable = true;
    this.blueflag.body.moves = true;
    this.longflag_time=0;
    this.game_end=0;
    blueflag_time=0;

    this.create_map();

    // 創建 Mario
    create_mario();
    stairs = game.add.group();
    create_things(stairs, 'stair', 0.5, 0.5, 1, 1, 100);
    blocks = game.add.group();
    create_things(blocks, 'block1', 0.5, 0.5, 1, 1, 100);
    blue_blocks = game.add.group();
    create_things(blue_blocks, 'block2', 0.5, 0.5, 1.7, 1.7, 100);
    player.y=0;
  },

  update: function() {
    nowstate=4;
    this.bigcat.body.gravity.y = 1300;

    // 創建 Mario 和地板的碰撞事件
    // game.physics.arcade.collide(player, this.longflag);
    game.physics.arcade.collide(player, this.floor);
    game.physics.arcade.collide(this.bigcat, this.floor);
    game.physics.arcade.collide(player, this.low_pipe);
    game.physics.arcade.collide(this.bigcat, this.low_pipe, this.catmove2(this.bigcat));
    if(game.physics.arcade.collide(player, this.bigcat))this.die(0, this.blueflag, this.bigcat);
    // if (game.physics.arcade.collide(player, this.blueflag)) this.collide_flag(this.blueflag, 1, this.block_last);
    if (game.physics.arcade.collide(this.block_last, this.blueflag)) this.collide_flag(this.blueflag, 2, this.block_last);

    // 創建 MArio 和現有磚頭的碰撞事件
    stairs.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
      game.physics.arcade.collide(this.bigcat, block, this.catmove(this.bigcat));
      // if (game.physics.arcade.collide(this.blueflag, block)) this.collide_flag(this.blueflag, 3, this.block_last);
    });
    blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
      // if (game.physics.arcade.collide(this.blueflag, block)) this.collide_flag(this.blueflag, 2, this.block_last);
    });
    blue_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });

    if (game.physics.arcade.collide(player, this.blueflag)){
      this.blueflag.body.velocity.y=0;
      if (blueflag_time==0) {
        this.blueflag.body.velocity.x = 100;
        console.log("dcfs");
      }
      if (blueflag_time > 0 && player.y > 100) this.die(1, this.blueflag, this.bigcat);
      
      blueflag_time=1;
      if (this.blueflag.body.velocity.x > 0) {
        is_moving = true;
      }
      console.log(player.body.velocity);
    } else {
      is_moving = false;
    }
    if (player.body.x>=this.longflag.body.x-30 && player.body.y>=this.longflag.body.x-30 && this.longflag_time==0){
      this.longflag_time=1;
      this.game_end=1;
      player.body.velocity.y=-100;
      console.log("xxxxxx");
      console.log(this.longflag_time);
    }

    if(blueflag_time==2 && this.block_last.x-this.blueflag.x>=260 ){
      // blueflag_time=3;
      //&& this.block_last.x-this.blueflag.x>=250
      this.blueflag.body.velocity.x=100;
      console.log("block");
    }


    if (player.x  > this.castle.x && player.x < this.castle.x + 168) {
      console.log('enter');
      if (this.cursor.down.isDown) {
        console.log('down');
        changeState('L5');
      }
    }

    generate_blocks(blocks, block_info);
    generate_blocks(stairs, stair_info);
    generate_blocks(blue_blocks, blue_block_info);

    // Mario 移動相關的判斷
    player_move1(this.cursor, this.bg, this.floor, [this.bigcat, this.low_pipe, this.bigface, this.blueflag, this.longflag, this.castle, this.bigface2, this.grass, this.block_last], this.game_end,this.floor);
  },

  create_map() {
    // 普通磚塊的部分
    block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28
    };

    stair_info = {
      block_x: [260,310,360,410,460,510,560,610,660,310,360,410,460,510,560,610,660,360,410,460,510,560,610,660,410,460,510,560,610,660,460,510,560,610,660,510,560,610,660,560,610,660,610,660,710,760,810,860,910,960,1010], // 請依據 x 的大小排序
      block_y: [510,510,510,510,510,510,510,510,510,460,460,460,460,460,460,460,460,410,410,410,410,410,410,410,360,360,360,360,360,360,310,310,310,310,310,260,260,260,260,210,210,210,160,160,510,510,510,510,510,510, 510],
      width: 50
    };

    // 藍磚塊的部分
    blue_block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28
    };

    init_things([block_info, blue_block_info, stair_info]);
  },
  
  die: function(input, blueflag, bigcat){
    if (input==0 && bigcat.body.x>=0) console.log(1);
    if (input==1) {
      blueflag.body.velocity.x=0;
      blueflag.body.immovable=true;
      console.log('die');
    }
    game.state.start('end');
  },

  catmove: function(bigcat){
    bigcat.body.velocity.x = 100;
  },
  catmove2: function(bigcat){
    bigcat.body.velocity.x = 100;
  },

  collide_flag: function(blueflag, input, block_last){
    if (input==2){
      blueflag_time=2;
      console.log("222");
      blueflag.body.velocity.x=-100;
    }
  }
}

function player_move1(cursor, bg, ground, others = [], game_end, floor) {
  // 背景移動速度
    if (cursor.left.isDown) {
      if (player.x > player.body.width / 2) player.body.velocity.x = -200;
      else {
        player.body.velocity.x = 0;
        player.x = player.body.width / 2;
      }
      if (!cursor.up.isDown) player.animations.play('leftwalk');
      player.facingRight = false;
    }
    else if (cursor.right.isDown) {
      if (player.x < game.width * 3 / 4) player.body.velocity.x = 200;
      else {
        player.body.velocity.x = 0;
        bg.tilePosition.x -= bg_speed;
        ground.tilePosition.x -= bg_speed;
        current_map_left += bg_speed;
        others.forEach(other => {
          other.centerX -= bg_speed;
        });
        things_moving();
      }
      if (!cursor.up.isDown) player.animations.play('rightwalk');
      player.facingRight = true;
    }
    else {
      player.body.velocity.x = 0;
      if (player.facingRight) player.frame = 1;
      else player.frame = 3;
      // 停止動畫
      // player.animations.stop();
    }
  
    if (cursor.up.isDown) {
      if(player.body.touching.down){
          // Move the player upward (jump)
          if (player.facingRight) player.animations.play('rightjump');
          else player.animations.play('leftjump');
          player.body.velocity.y = -750;
      }
    }

    if (is_moving) {
      player.body.velocity.x = 0;
      bg.tilePosition.x -= bg_speed;
      ground.tilePosition.x -= bg_speed;
      current_map_left += bg_speed;
      others.forEach(other => {
        other.centerX -= bg_speed;
      });
      things_moving();
    }
}


var fifthState = {
  preload: function() {
    game.load.image('bg', 'assets/image/background.jpg');
    game.load.image('ground', 'assets/image/floor_16.png');
    game.load.image('strangebox', 'assets/image/strangebox.png');
    game.load.image('grass', 'assets/image/grass.png');
    game.load.image('bigface', 'assets/image/bigface.png');
    game.load.image('gq', 'assets/image/green_question.png');
    game.load.spritesheet('me', 'assets/sprite/Mario.png', 40 , 51);
    game.load.spritesheet('block1', 'assets/image/brick.png', 28, 28);
    game.load.spritesheet('block2', 'assets/image/blue_brick.png', 28, 28);
    game.load.spritesheet('block3', 'assets/image/question_box.png', 42, 42);
    game.load.spritesheet('no_line', 'assets/image/bluebrick_with_no_line.png', 42, 42);
    game.load.spritesheet('mushroom', 'assets/image/mushroom.png', 45, 45);
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // 創建鍵盤事件
    this.cursor = game.input.keyboard.createCursorKeys();

    // 創建背景與可以站上去的地板
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
    this.floor = game.add.tileSprite(0, game.height - ground_height-35, game.width, ground_height+50, 'ground');
    this.floor.scale.setTo(1.0,0.8);
    this.strangebox = game.add.sprite(50, 395, 'strangebox');
    this.strangebox.scale.setTo(0.9,0.9);
    this.gq = game.add.sprite(475, 485, 'gq');
    game.physics.arcade.enable(this.floor);
    game.physics.arcade.enable(this.gq);
    this.floor.body.immovable = true;


    this.grass = game.add.sprite(300, 495, 'grass');
    this.grass2 = game.add.sprite(600, 495, 'grass');
    game.physics.arcade.enable(this.grass);
    game.physics.arcade.enable(this.grass2);
    this.grass.visible=false;
    this.grass2.visible=false;

    this.bigface = game.add.sprite(100, 100, 'bigface');
    this.bigface2 = game.add.sprite(350, 50, 'bigface');
    this.mushroom = game.add.sprite(595, 370, 'mushroom');
    this.mushroom.visible = false;
    game.physics.arcade.enable(this.mushroom);
    this.no_line1 = game.add.sprite(600, 375, 'no_line');
    game.physics.arcade.enable(this.no_line1);
    this.no_line1.visible = false;
    this.no_line1.body.immovable = true;
    this.q_block = game.add.sprite(600, 375, 'block3');
    game.physics.arcade.enable(this.q_block);
    this.q_block.body.immovable = true;
    this.mush_time=0;

    this.no_line = game.add.sprite(660, 220, 'no_line');
    game.physics.arcade.enable(this.no_line);
    this.no_line.body.immovable = true;
    this.no_line.visible = false;
    this.line_time=0;

    this.no_line2 = game.add.sprite(720, 65, 'no_line');
    game.physics.arcade.enable(this.no_line2);
    this.no_line2.body.immovable = true;
    this.no_line2.visible = false;
    this.line_time2=0;

    this.grassflag=0;
    this.create_map();

    nowstate=5;
    // 創建 Mario
    create_mario();
    
    blocks = game.add.group();
    create_things(blocks, 'block1', 0.5, 0.5, 1, 1, 100);
    blue_blocks = game.add.group();
    create_things(blue_blocks, 'block2', 0.5, 0.5, 1.7, 1.7, 100);
    question_blocks = game.add.group();
    create_things(question_blocks, 'block3', 0.5, 0.5, 1, 1, 100);
    grasses = game.add.group();
    create_things(question_blocks, 'grass', 0.5, 0.5, 1, 1, 100);
  },

  update: function() {
    // 創建 Mario 和地板的碰撞事件
    if(game.physics.arcade.collide(player, this.gq)) {
      console.log(1);
      this.gq.destroy();
      this.grass.visible=true;
      this.grass2.visible=true;
      this.grassflag=1;
    }
    game.physics.arcade.collide(player, this.floor);
    game.physics.arcade.collide(player, this.no_line);
    game.physics.arcade.collide(player, this.no_line2);
    if(this.no_line1.visible==true) game.physics.arcade.collide(player, this.no_line1);
    game.physics.arcade.collide(this.mushroom, this.floor)
    if(player.y>=600|| (this.grassflag==0&&(game.physics.arcade.collide(player, this.grass)||game.physics.arcade.collide(player, this.grass2)))) this.die();
    // 創建 MArio 和現有磚頭的碰撞事件
    blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    blue_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });
    question_blocks.forEachAlive(block => {
      game.physics.arcade.collide(player, block);
    });

    if(game.physics.arcade.collide(player, this.mushroom)) this.die();
    if (this.q_block.body) {
      if(game.physics.arcade.collide(player, this.q_block) && this.mush_time==0){
        this.mush_time=1;
        this.q_block.destroy();
        this.mushroom.visible = true;
        this.mushroom.body.velocity.y = -30;
        this.no_line1.visible = true;
      }
    }
    
    if (this.mushroom.body) {
      if(this.mushroom.y<330){
        this.mushroom.y=330;
        this.mushroom.body.velocity.x = 50;
      }
      if (this.mushroom.x>this.no_line1.x+35 && this.mushroom.y==330){
        this.mushroom.body.gravity.y = 500;
      }
    }

    if(player.y<=-50){
      changeState('win');
    }
    if (player.body.x>=this.no_line.x-30 && player.body.y<=this.no_line.y+100 && this.line_time==0){
      this.line_time=1;
      this.no_line.visible = true;
    }
    if (player.body.x>=this.no_line2.x-30 && player.body.y<=this.no_line2.y+100 && this.line_time2==0){
      this.line_time2=1;
      this.no_line2.visible = true;
    }
    

    // Mario 移動相關的判斷
    player_move(this.cursor, this.bg, [this.floor, this.strangebox, this.gq,this.grass,this.grass2,this.bigface,this.bigface2,this.mushroom, this.q_block, this.no_line1, this.no_line,this.no_line2]);

    generate_blocks(blocks, block_info);
    generate_blocks(blue_blocks, blue_block_info);
    generate_blocks(question_blocks, question_block_info);
    generate_blocks(grasses, grass_info);
  },
  create_map() {
    // 普通磚塊的部分
    block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28
    };

    // 藍磚塊的部分
    blue_block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 28 * 1.7
    };

    // 問號磚塊的部分
    question_block_info = {
      block_x: [], // 請依據 x 的大小排序
      block_y: [],
      width: 42
    };

    // 草地的部分
    grass_info = {
      block_x: [300], // 請依據 x 的大小排序
      block_y: [300], // 磚頭的編號
      width: 112
    };

    init_things([block_info, blue_block_info, question_block_info, grass_info]);
  },
  die(){
    console.log('die');
    game.state.start('end');
  }
}

var winState = {
  preload: function() {
    game.load.image('gameover', 'assets/image/gameover.jpg');
  },

  create: function() {
    this.delay=game.time.now+5000;
    var style = {font: "35px Arial", fill: "#ffffff"};
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'gameover');
    this.text = game.add.text(420, 290, "WIN!", style);
    this.IQ = game.add.text(220, 200, "Intelligence Quotient:", style);
    this.lifetext = game.add.text(560, 200, 300+(life*50), style);
    
  },

  update: function() {
    if(this.delay<=game.time.now) changeState('menu');
  }
}

var endState = {
  preload: function() {
    game.load.image('gameover', 'assets/image/gameover.jpg');
  },

  create: function() {
    life=life-1;
    this.delay=game.time.now+2000;
    var style = {font: "35px Arial", fill: "#ffffff"};
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'gameover');
    this.text = game.add.text(420, 290, "X", style);
    this.lifetext = game.add.text(460, 290, life, style);

  },

  update: function() {
    if(this.delay<=game.time.now) 
    {
      if(nowstate==1) 
      {
        changeState('L1');
      }
      else if (nowstate==2)
      {
        changeState('L2');
      }
      else if (nowstate==3)
      {
        changeState('L3');
      }
      else if (nowstate==4)
      {
       changeState('L4');
      }
      else if(nowstate==5)
      {
        changeState('L5');
      }
    }
  }
}

function create_things(thing, name, anchor_x, anchor_y, scale_x, scale_y, total) {
  thing.enableBody = true;
  thing.physicsBodyType = Phaser.Physics.ARCADE;
  thing.createMultiple(total, name);
  thing.setAll('anchor.x', anchor_x);
  thing.setAll('anchor.y', anchor_y);
  thing.setAll('outOfBoundsKill', true);
  thing.setAll('checkWorldBounds', true);
  thing.setAll('body.immovable', true);
  thing.setAll('scale.x', scale_x);
  thing.setAll('scale.y', scale_y);
}

function create_mario() {
  // 畫出 Mario
  player = game.add.sprite(game.width / 4, game.height - ground_height-150, 'me');
  player.anchor.setTo(0.5, 1); // 定位點在下方中間
  player.facingRight = true;   // 一開始都先面向右邊

  // Mario 的動畫創在這邊
  player.animations.add('rightwalk', [1, 2], 8, true);
  player.animations.add('leftwalk', [3, 4], 8, true);
  player.animations.add('rightjump', [5, 6], 16, false);
  player.animations.add('leftjump', [7, 8], 16, false);

  // Mario 的碰撞與重力
  game.physics.arcade.enable(player);
  player.body.gravity.y = 1200;
}

function player_move(cursor, bg, others = []) {
  // 背景移動速度
  if (cursor.left.isDown) {
    if (player.x > player.body.width / 2) player.body.velocity.x = -200;
    else {
      player.body.velocity.x = 0;
      player.x = player.body.width / 2;
    }
    if (!cursor.up.isDown) player.animations.play('leftwalk');
    player.facingRight = false;
  }
  else if (cursor.right.isDown) {
    things_checking();
    if (player.x < game.width * 3 / 4) player.body.velocity.x = 200;
    else {
      player.body.velocity.x = 0;
      if (!is_collide) {
        things_moving();
        bg.tilePosition.x -= bg_speed;
        current_map_left += bg_speed;
        others.forEach(other => {
          other.centerX -= bg_speed;
        });
      }
    }
    if (!cursor.up.isDown) player.animations.play('rightwalk');
    player.facingRight = true;
  }
  else {
    player.body.velocity.x = 0;
    if (player.facingRight) player.frame = 1;
    else player.frame = 3;
    // 停止動畫
    // player.animations.stop();
  }

  if (cursor.up.isDown) {
    if(player.body.touching.down){
        // Move the player upward (jump)
        if (player.facingRight) player.animations.play('rightjump');
        else player.animations.play('leftjump');
        player.body.velocity.y = -750;
    }
  }
  is_collide = false;
}

function init_things(array) {
  array.forEach(info => {
    info.max_display = 0;      // 目前不在螢幕中，且位置處於螢幕右方，且編號最小的磚頭的編號
    info.block_total = info.block_x.length;
    if (info.block_x.length !== info.block_y.length) console.log(info.block_x.length, info.block_y.length, "[ Error ]: 磚塊的兩個陣列數量不同，到後面會出錯啦");
  });
}

function is_overlap(center1, center1Y, w1, center2, center2Y, w2) {
  const left1 = center1 - w1;
  const right1 = center1 + w1;
  const left2 = center2 - w2;
  const right2 = center2 + w2;

  return ((left1 >= left2 && left1 <= right2) || (left2 >= left1 && left2 <= right1)) && center2Y < center1Y + w1 && center2Y > center1Y - w1;
}
function  die(){
  console.log('die');
  game.state.start('end');
}

function checking(things, things_info) {
  things.forEachAlive(block => {
    if (is_overlap(block.centerX, block.centerY, things_info.width / 2, player.centerX, player.centerY, 25)) {
    // if (block.centerX - things_info.width / 2 <= player.centerX + 20 && block.centerX - things_info.width / 2 >= player.centerX - 20) {
      player.body.velocity.centerX = 0;
      if (player.centerX < block.centerX) player.centerX = block.centerX - things_info.width / 2 - 25;
      else player.centerX = block.centerX + things_info.width / 2 + 26;
      is_collide = true;
      console.log('collide');
      return;
    }
  });
}

function moving(things, things_info) {
  things.forEachAlive(block => {
    block.centerX -= bg_speed;
    if (block.centerX + things_info.width / 2 < 0) things_info.min_display ++;
  });
}

function things_checking() {
  if (blocks && blocks.length > 1 &&!is_collide) checking(blocks, block_info);
  if (blue_blocks && blue_blocks.length > 1 &&!is_collide) checking(blue_blocks, blue_block_info);
  if (question_blocks &&  question_blocks.length > 1 &&!is_collide) checking(question_blocks, question_block_info);
  if (monsters && monsters.length > 1 &&!is_collide) checking(monsters, monster_info);
  if (blacks && blacks.length > 1 &&!is_collide) checking(blacks, blacks_info);
  if (stairs && stairs.length > 1 &&!is_collide) checking(stairs, stair_info);
  if (grasses && grasses.length > 1 &&!is_collide) checking(grasses, grass_info);
  // if (yellows && yellows.length > 1 &&!is_collide) checking(yellows, yellow_info);
  if (no_lines && no_lines.length > 1 &&!is_collide) checking(no_lines, no_line_info);
}

function things_moving() {
  // [Todo-g]5
  // 如果新增了一個全新的物件群，記得用跟下一面一樣的寫法再加上去ㄛ
  if (blocks && blocks.length > 1) moving(blocks, block_info);
  if (blue_blocks && blue_blocks.length > 1) moving(blue_blocks, blue_block_info);
  if (question_blocks &&  question_blocks.length > 1) moving(question_blocks, question_block_info);
  if (monsters && monsters.length > 1) moving(monsters, monster_info);
  if (blacks && blacks.length > 1) moving(blacks, blacks_info);
  if (stairs && stairs.length > 1) moving(stairs, stair_info);
  if (grasses && grasses.length > 1) moving(grasses, grass_info);
  if (yellows && yellows.length > 1) moving(yellows, yellow_info);
  if (no_lines && no_lines.length > 1) moving(no_lines, no_line_info);
}

function generate_blocks(things, things_info) {
  for (var i = things_info.max_display; i < things_info.block_total; i++) {
    if (things_info.block_x[i] - things_info.width / 2 < current_map_left + game.width) {
      var block = things.getFirstExists(false);
      if (block) {
        block.reset(things_info.block_x[i] - current_map_left, things_info.block_y[i]);
        game.physics.arcade.collide(player, block);
      }
      else console.log('預設物品數量不夠，把 createMultiple 的數值調大');
    } else break;
  }
  things_info.max_display = i;
}

function changeState(state) {
  current_map_left = 0;
  game.state.start(state);
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas');

// 使用 game.state.add([名字], [變數]) 將新的 state 增加在此
// 使用 game.state.start([名字]) 即可切換目前的 state
game.state.add('menu', menuState);
game.state.add('L1', firstState);
game.state.add('L2', secondState);
game.state.add('L3', thirdState);
game.state.add('L4', fourthState);
game.state.add('L5', fifthState);
game.state.add('end', endState);
game.state.add('win', winState);
game.state.start('menu');
