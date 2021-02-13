
var player_game_sketch = function(sketch)
{
    let c;

    var sprite_red_bird_downflap;
    var sprite_red_bird_midflap;
    var sprite_red_bird_upflap;
    var red_bird_frames = [];

    var sprite_blue_bird_downflap;
    var sprite_blue_bird_midflap;
    var sprite_blue_bird_upflap;
    var blue_bird_frames = [];

    var sprite_pipe;
    var sprite_city;
    var sprite_floor;
    var sprite_title;

    var sound_point;
    var sound_wing;
    var sound_hit;
    var sound_die;
    var sound_sweetwing;

    var font_flappy;

    //EVENTS
    var mousePress = false;
    var mousePressEvent = false;
    var mouseReleaseEvent = false;
    var keyPress = false;
    var keyPressEvent = false;
    var keyReleaseEvent = false;

    var pipes = [];

    //GAME VARS
    var fixed_width = 400;
    var fixed_height = 710;

    var image_scaling = 1.42;
    var score = 0;
    var highscore = 0;
    var speed = 5;
    var gravity = 0.45;
    var gap = 80;

    var gameover = false;
    var page = "MENU";

    var overflowX = 0;

    var startgame = false;

    var bird_index = 1;
    var sprite_bird;

    var flappy_bird = {

        x: 100,
        y: 0,

        target: 0,

        velocityY: 0,

        fly: false,

        angle: 0,

        falls: false,
        flashAnim: 0,
        flashReturn: false,
        kinematicAnim: 0,

        display: function () {
            sprite_bird = blue_bird_frames[bird_index];
            if (!flappy_bird.falls) {
                if (parseInt(sketch.frameCount) % 10 === 0) {
                    bird_index += 1;
                    bird_index %= 3;
                }
            }
            if ((!mousePress) || this.falls) {
                sketch.push();
                sketch.translate(this.x, this.y);
                sketch.rotate(sketch.radians(this.angle));
                sketch.image(sprite_bird, 0, 0, sprite_bird.width * image_scaling, sprite_bird.height * image_scaling);
                sketch.pop();
                sketch.redraw();
            }
            else {
                sketch.push();
                sketch.translate(this.x, this.y);
                sketch.rotate(sketch.radians(this.angle));
                sketch.image(sprite_bird, 0, 0, sprite_bird.width * image_scaling, sprite_bird.height * image_scaling);
                sketch.pop();
                sketch.redraw();
            }
            sketch.redraw();
        },

        update: function () {
            if (this.falls) {
                if (this.flashAnim > 255) {
                    this.flashReturn = true;
                }

                if (this.flashReturn) {
                    this.flashAnim -= 60;
                }
                else {
                    this.flashAnim += 60;
                }

                if (this.flashReturn && this.flashAnim === 0) {
                    gameover = true;
                    menu_gameover.easein();
                    try { sound_die.play(); } catch (e) { }

                    if (score > highscore) { highscore = score; }
                }

                this.y += this.velocityY;
                this.velocityY += gravity;
                this.angle += 4;

                if (speed > 0) {
                    speed = 0;
                }

                if (this.angle > 90) {
                    this.angle = 90;
                }
            }
            else {
                this.y += this.velocityY;
                this.angle += 1.5;

                if (this.angle > 90) {
                    this.angle = 90;
                }

                if (mousePressEvent || (keyPressEvent && key == ' ')) {
                    try { sound_wing.play(); } catch (e) { }

                    this.velocityY = 0;
                    this.fly = true;
                    this.target = clamp(this.y - 60, -19, sketch.height);
                    this.angle = -30;
                }


                if (this.y < this.target) {
                    this.fly = false;
                    this.target = 10000;
                }


                if (!this.fly) {
                    this.velocityY += gravity;
                }
                else {
                    this.velocityY = -5;
                    this.y -= 3;
                }

                if (this.y > sketch.height - sprite_floor.height * image_scaling/2 - 12) {
                    if (!flappy_bird.falls) { try { sound_hit.play(); } catch (e) { } }
                    this.falls = true;
                }
            }
            this.y = clamp(this.y, -20, sketch.height - 50);
            sketch.redraw();
        },

        kinematicMove: function () {
            if (gameover) {
                this.x = sketch.width / 2;
                this.y = sketch.height / 2;

                gameover = false;
                score = 0;
                gap = 90;
            }


            this.y = sketch.height / 2 + sketch.map(sketch.sin(sketch.frameCount * 0.1), 0, 1, -2, 2);

            sprite_bird = blue_bird_frames[bird_index];
            if (!flappy_bird.falls) {
                if (parseInt(sketch.frameCount) % 10 === 0) {
                    bird_index += 1;
                    bird_index %= 3;
                }
            }

            sketch.push();
            sketch.translate(this.x, this.y);
            sketch.image(sprite_bird, 0, 0, sprite_bird.width * image_scaling, sprite_bird.height * image_scaling);
            sketch.pop();
            sketch.redraw();
        }
    }

    //var font = new Font();

    //var audio = new Audio('data/Assets/sound/sfx_point.wav');

    sketch.setup = function() {
        if (mobile()) {
            c = sketch.createCanvas(windowWidth, windowHeight);
            c.parent("player");
        }
        else {
            c = sketch.createCanvas(fixed_width, fixed_height);
            c.parent("player");
        }

        c.mousePressed(mPress);
        c.mouseReleased(mRelease);

        sketch.imageMode(sketch.CENTER);
        sketch.rectMode(sketch.CENTER);
        sketch.ellipseMode(sketch.CENTER);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);

        //disableScroll();

        sketch.noSmooth();

        pipes[0] = new Pipe();


        //load
        sprite_red_bird_downflap = sketch.loadImage('static/flappy-bird/assets/redbird-downflap.png');
        sprite_red_bird_midflap = sketch.loadImage('static/flappy-bird/assets/redbird-midflap.png');
        sprite_red_bird_upflap = sketch.loadImage('static/flappy-bird/assets/redbird-upflap.png');
        red_bird_frames.push(sprite_red_bird_downflap);
        red_bird_frames.push(sprite_red_bird_midflap);
        red_bird_frames.push(sprite_red_bird_upflap);

        sprite_blue_bird_downflap = sketch.loadImage('static/flappy-bird/assets/bluebird-downflap.png');
        sprite_blue_bird_midflap = sketch.loadImage('static/flappy-bird/assets/bluebird-midflap.png');
        sprite_blue_bird_upflap = sketch.loadImage('static/flappy-bird/assets/bluebird-upflap.png');
        blue_bird_frames.push(sprite_blue_bird_downflap);
        blue_bird_frames.push(sprite_blue_bird_midflap);
        blue_bird_frames.push(sprite_blue_bird_upflap);
        sprite_bird = blue_bird_frames[bird_index];

        sprite_pipe = sketch.loadImage('static/flappy-bird/assets/pipe-green.png');
        sprite_city = sketch.loadImage('static/flappy-bird/assets/background-day-ns.png');
        sprite_floor = sketch.loadImage('static/flappy-bird/assets/base.png');
        sprite_title = sketch.loadImage('static/flappy-bird/assets/title.png');
        sprite_game_over = sketch.loadImage('static/flappy-bird/assets/gameover.png');

        sound_point = sketch.loadSound('static/flappy-bird/sound/point.wav');
        sound_hit = sketch.loadSound('static/flappy-bird/sound/hit.wav');
        sound_die = sketch.loadSound('static/flappy-bird/sound/die.wav');
        //sound_wing = loadSound('http://flappybird.netlify.com/data/Assets/sound/sfx_wing.wav');
        sound_wing = sketch.loadSound('static/flappy-bird/sound/wing.wav');
        sound_sweetwing = sketch.loadSound('static/flappy-bird/sound/swoosh.wav');


        font_flappy = sketch.loadFont('static/flappy-bird/font/04B_19.TTF');
        flappy_bird.y = sketch.height / 2;

        try { sketch.textFont(font_flappy); } catch (e) { }

        sketch.redraw();
    }

    sketch.draw = function() {
        sketch.background(255, 255, 255);

        switch (page) {
            case 'GAME':
                page_game();
                break;
            case 'MENU':
                page_menu();
                break;
        }
        //FRAMERATE
        //fill(0);
        //text(int(frameRate()),20,35);

        //EVENT
        mousePressEvent = false;
        mouseReleaseEvent = false;
        keyPressEvent = false;
        keyReleaseEvent = false;
        sketch.redraw();
    }

    //EVENT
    function mPress() {
        mousePress = true;
        mousePressEvent = true;
    }
    function mRelease(){
        mousePress = false;
        mouseReleaseEvent = true;
    }
    function kPress() {
        keyPress = true;
        keyPressEvent = true;
    }
    function kRelease(){
        keyPress = false;
        keyReleaseEvent = true;
    }

    //PAGES
    function page_game() {
        overflowX += speed;
        if (overflowX > sprite_city.width / image_scaling) {
            overflowX = 0;
        }

        //City
        sketch.image(sprite_city, sprite_city.width/image_scaling, sprite_city.height/image_scaling, sprite_city.width * image_scaling, sprite_city.height * image_scaling);

        //creator
        if (!flappy_bird.falls) {
            if (parseInt(sketch.frameCount) % 66 === 0) {
                pipes.push(new Pipe());
            }
        }

        for (var i = 0; i < pipes.length; i++) {
            if (pipes[i].x < -50) {
                pipes.splice(i, 1);
            }

            try {
                pipes[i].display();
                pipes[i].update();
            } catch (e) { }
        }
        //Floor
        sketch.image(sprite_floor, sprite_floor.width/image_scaling - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);
        sketch.image(sprite_floor, sprite_floor.width/image_scaling + sprite_floor.width/image_scaling - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);
        sketch.image(sprite_floor, sprite_floor.width/image_scaling + sprite_floor.width/image_scaling * 2 - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);

        flappy_bird.display();
        flappy_bird.update();
        flappy_bird.x = smoothMove(flappy_bird.x, 90, 0.02);
        sketch.redraw();
        //Score
        if (!gameover) {
            sketch.push();
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.fill(255);
            sketch.textSize(40);
            sketch.text(score, sketch.width / 2, 50);
            sketch.pop();
            sketch.redraw();
        }
        
        sketch.push();
        sketch.noStroke();
        sketch.fill(255, flappy_bird.flashAnim);
        sketch.rect(sketch.width / 2, sketch.height / 2, sketch.width, sketch.height);
        sketch.pop();
        sketch.redraw();
        if (gameover) {
            menu_gameover.display();
            menu_gameover.update();
        }
        sketch.redraw();
    }

    function page_menu() {
        overflowX += speed;
        if (overflowX > sprite_city.width / image_scaling) {
            overflowX = 0;
        }
        sketch.redraw();
        //City
        sketch.image(sprite_city, sprite_city.width/image_scaling, sprite_city.height/image_scaling, sprite_city.width * image_scaling, sprite_city.height * image_scaling);

        //Floor
        sketch.image(sprite_floor, sprite_floor.width/image_scaling - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);
        sketch.image(sprite_floor, sprite_floor.width/image_scaling + sprite_floor.width/image_scaling - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);
        sketch.image(sprite_floor, sprite_floor.width/image_scaling + sprite_floor.width/image_scaling * 2 - overflowX, sketch.height - 18, sprite_floor.width * image_scaling, sprite_floor.height * image_scaling);
        
        sketch.push();
        sketch.fill(255, 255, 255);
        sketch.stroke(50);
        sketch.strokeWeight(5);
        sketch.textSize(50);
        sketch.text("Player's bird", sketch.width / 2, sketch.height /  2 - 150);
        sketch.pop();


        flappy_bird.kinematicMove();

        sketch.push();
        sketch.fill(230, 97, 29);
        sketch.stroke(255);
        sketch.strokeWeight(3);
        sketch.textSize(30);
        sketch.text('Tap to play', sketch.width / 2, sketch.height / 2 - 90);
        sketch.pop();
        sketch.redraw();

        if (mousePressEvent || (keyPressEvent && key == ' ')) {
            page = "GAME";
            resetGame();

            flappy_bird.velocityY = 0;
            flappy_bird.fly = true;
            flappy_bird.target = clamp(this.y - 60, -19, sketch.height);
            flappy_bird.angle = -45;
            flappy_bird.update();
            sketch.redraw();
        }
        flappy_bird.x = sketch.width / 2;
        sketch.redraw();
    }

    class Pipe {

        constructor()
        {
            this.gapSize = gap;
            this.y = sketch.random(250, sketch.height - 300);
            this.x = sketch.width + 50;
            this.potential = true;

        };
        
        display() {
            sketch.push();
            sketch.translate(this.x, this.y + this.gapSize + sprite_pipe.height / image_scaling);
            sketch.image(sprite_pipe, 0, 0, sprite_pipe.width * image_scaling, sprite_pipe.height * image_scaling);
            sketch.pop();
            sketch.push();
            sketch.translate(this.x, this.y - this.gapSize - sprite_pipe.height / image_scaling);
            sketch.rotate(sketch.radians(180));
            sketch.scale(-1, 1);
            sketch.image(sprite_pipe, 0, 0, sprite_pipe.width * image_scaling, sprite_pipe.height * image_scaling);
            sketch.pop();
            
            if (this.potential && (flappy_bird.x > this.x - sprite_bird.width * image_scaling / 2 - 5 && flappy_bird.x < this.x + sprite_bird.width * image_scaling / 2 + 5)) {
                score++;
                try { sound_point.play(); } catch (e) { }

                if (gap > 60) { gap--; }

                this.potential = false;
            }

            //Pipes collisions
            if ((
                (flappy_bird.x + sprite_bird.width * image_scaling / 2 > this.x - sprite_bird.width * image_scaling / 2 - 10 && flappy_bird.x - sprite_bird.width * image_scaling / 2  < this.x + sprite_bird.width * image_scaling / 2 + 10) &&
                (flappy_bird.y + sprite_bird.height * image_scaling + 15 > (this.y - this.gapSize - sprite_pipe.height * image_scaling / 2) - 200 && flappy_bird.y - sprite_bird.height * image_scaling - 15 < (this.y - this.gapSize - sprite_pipe.height * image_scaling / 2) + 200)
            )

                ||

                (
                    (flappy_bird.x + sprite_bird.width * image_scaling / 2 > this.x - sprite_bird.width * image_scaling / 2 - 10 && flappy_bird.x - 20 < this.x + sprite_bird.width * image_scaling / 2 + 10) &&
                    (flappy_bird.y + sprite_bird.height * image_scaling + 15 > (this.y + this.gapSize + sprite_pipe.height * image_scaling / 2) - 200 && flappy_bird.y - sprite_bird.height * image_scaling - 15 < (this.y + this.gapSize + sprite_pipe.height * image_scaling / 2) + 200)
                )

            ) {

                if (!flappy_bird.falls) { try { sound_hit.play(); } catch (e) { } }
                flappy_bird.falls = true;
            }
        }

        update() {
            this.x -= speed;
        }
    }

    //utility
    function clamp(value, min, max) {

        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }

        return value;
    }

    function resetGame() {
        gameover = false;
        gap = 80;
        speed = 5;
        score = 0;
        flappy_bird.y = sketch.height / 2
        flappy_bird.falls = false;
        flappy_bird.velocityY = 0;
        flappy_bird.angle = 0;
        flappy_bird.flashAnim = 0;
        flappy_bird.flashReturn = false;
        pipes = [];
        flappy_bird.target = 10000;
        menu_gameover.ease = 0;
        sketch.redraw();
    }

    //Menu Gameover
    var menu_gameover = {

        ease: 0,
        easing: false,
        open: false,

        display: function () {

            sketch.push();
            sketch.translate(sketch.width / 2, sketch.height / 2);
            sketch.scale(this.ease);

            sketch.image(sprite_game_over, 0, -145, sprite_game_over.width * image_scaling, sprite_game_over.height * image_scaling);

            //Info
            sketch.push();
            sketch.textAlign(sketch.CENTER);
            sketch.strokeWeight(3);
            sketch.stroke(0);
            sketch.textSize(34);
            sketch.fill(255, 255, 255);
            sketch.text('score: ' + score, 0, -sketch.height/2 + 32);
            sketch.text('highscore: ' + highscore, 0, sketch.height/2 - 130);
            sketch.redraw();

            if (sketch.press('restart', 0, -60, sketch.width / 2, sketch.height / 2)) {
                resetGame();
                sketch.redraw();
            }

            if (sketch.press(' menu ', 0, -10, sketch.width / 2, sketch.height / 2)) { page = 'MENU'; }
            sketch.pop();
            sketch.redraw();
        },

        update: function () {
            if (this.easing) {
                this.ease += 0.1;
                if (this.ease > 1) {
                    this.open = true;
                    this.ease = 1;
                    this.easing = false;
                }
            }
        },

        easein: function () {
            this.easing = true;
        }
    }

    sketch.press = function(txt, x, y, tX, tY) {
        var this_h = false;

        if (sketch.mouseX > tX + x - sketch.textWidth(txt) / 2 - 10 && sketch.mouseX < tX + x + sketch.textWidth(txt) / 2 + 10 && sketch.mouseY > tY + y - sketch.textAscent() / 2 - 10 && sketch.mouseY < tY + y + sketch.textAscent() / 2 + 10) {
            this_h = true;
        }

        sketch.push();
        sketch.textSize(16);
        sketch.redraw();
        if (this_h && mousePress) {
            sketch.noStroke();
            sketch.fill(83, 56, 71);
            sketch.rect(x, y + 3, sketch.textWidth(txt) + 25 + 10, sketch.textAscent() + 10 + 10);

            sketch.fill(250, 117, 49);
            sketch.stroke(255);
            sketch.strokeWeight(3);
            sketch.rect(x, y + 2, sketch.textWidth(txt) + 25, sketch.textAscent() + 10);

            sketch.noStroke();
            sketch.fill(255);
            sketch.text(txt, x, y + 2);
            sketch.redraw();
        }
        else {
            sketch.noStroke();
            sketch.fill(83, 56, 71);
            sketch.rect(x, y + 2, sketch.textWidth(txt) + 25 + 10, sketch.textAscent() + 10 + 12);

            if (this_h) {
                sketch.fill(250, 117, 49);
            }
            else {
                sketch.fill(230, 97, 29);
            }
            sketch.stroke(255);
            sketch.strokeWeight(3);
            sketch.rect(x, y, sketch.textWidth(txt) + 25, sketch.textAscent() + 10);
            sketch.noStroke();
            sketch.fill(255);
            sketch.text(txt, x, y);
            sketch.redraw();
        }
        sketch.pop();
        sketch.redraw();
        if (this_h && mouseReleaseEvent) { try { sound_sweetwing.play(); } catch (e) { } }

        return (this_h && mouseReleaseEvent);
    }

    function smoothMove(pos, target, speed) {
        return pos + (target - pos) * speed;
    }

    // js utility

    /*
    function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null; 
        window.onwheel = null; 
        window.ontouchmove = null;  
        document.onkeydown = null;  
    }*/

    function mobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }

}
