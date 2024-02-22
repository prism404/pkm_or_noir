var config = {
    type: Phaser.AUTO,
    width: 1910,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var previousPosition;
var isJumping = false;
var ground;
var lastDirection = 'right';

function preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.spritesheet('player', 'assets/knuckles.png', { frameWidth: 52.5, frameHeight: 46 });
}

function create() {
    this.background = this.add.tileSprite(0, 0, this.sys.canvas.width * 3, this.sys.canvas.height, 'background');
    this.background.setScale(2);
    this.physics.world.bounds.width = this.sys.canvas.width * 2;
    
    player = this.physics.add.sprite(300, 500, 'player');
    player.setCollideWorldBounds(true);
    player.setVisible(true); // Rendre le personnage visible

    ground = this.physics.add.staticGroup();
    // Ici, on crée un rectangle qui s'étend sur toute la largeur
    var groundSprite = this.add.rectangle(1910, 572, 3820, 20, 0x0000ff);
    this.physics.add.existing(groundSprite, true); // 'true' rend l'objet statique
    ground.add(groundSprite);
    groundSprite.setVisible(false); // Rendre la plateforme invisible

    this.physics.add.collider(player, ground);

    this.cameras.main.startFollow(player, true, 0.05, 0.05);


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 11, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turnRight',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turnLeft',
        frames: [{ key: 'player', frame: 1 }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upRight',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'downRight',
        frames: this.anims.generateFrameNumbers('player', { start: 17, end: 18 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upLeft',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'downLeft',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 10}),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
}


function update() {
    if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.anims.play('right', true);
        this.background.tilePositionX += 1;
        lastDirection = 'right';
    } 
    else if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('left', true);
        this.background.tilePositionX -= 1;
        lastDirection = 'left';
    } 
    else {
        player.setVelocityX(0);
        if(lastDirection === 'left'){
            player.anims.play('turnLeft', true);
        }
        else{
            player.anims.play('turnRight', true);
        }
    }

    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    if (player.body.velocity.y < 0) {
        if(lastDirection === 'left'){
            player.anims.play('upLeft', true);
        } else {
            player.anims.play('upRight', true);
        }
    } 
    else if (player.body.velocity.y > 0) {
        if(lastDirection === 'left'){
            player.anims.play('downLeft', true);
        } else {
            player.anims.play('downRight', true);
        }
    }

    this.background.tilePositionX = player.x - this.sys.canvas.width / 2;
}