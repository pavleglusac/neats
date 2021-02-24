
var ai_game_sketch = function(sketch)
{
    var c;

    const NUMBER_OF_BIRDS = units.length;

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

    var font_flappy;

    //EVENTS
    var mousePress = false;
    var mousePressEvent = false;
    var mouseReleaseEvent = false;
    var keyPress = false;
    var keyPressEvent = false;
    var keyReleaseEvent = false;

    var pipes = [];

    // GAME VARS
    var fixed_width = 400;
    var fixed_height = 710;

    var image_scaling = 1.42;
    var score = 0;
    var highscore = 0;
    var speed = 5;
    var gravity = 0.45;
    var gap = 85;

    var overflowX = 0;

    // GAME FLOW
    var gameover = false;
    var page = "MENU";

    var startgame = false;
    var all_dead = true;

    // NEAT VARS
    var player_count = units.length;

    var generation = 1;
    var all_birds = [];

    var best_bird = null;

    class Bird{
        constructor(unit=null, frames=blue_bird_frames)
        {
            this.x = 100;
            this.y = 0;
            this.target = 0;
            this.velocityY = 0;
            this.fly = false;
            this.angle = 0;
            this.falls = false;
            this.flashAnim = 0;
            this.flashReturn =  false;
            this.kinematicAnim = 0;

            this.is_alive = true;
            this.points = 0;
            
            this.h_distance_to_pipe_left = 0;
            this.h_distance_to_pipe_right = 0;
            this.v_distance_to_top_pipe = 0;
            this.v_distance_to_bottom_pipe = 0;

            this.bird_index = 1;
            this.frames = frames;
            this.sprite_bird = this.frames[this.bird_index];
            this.bird_unit = unit;
        }

        display() {
            this.sprite_bird = this.frames[this.bird_index];
            if (this.is_alive) {
                if (parseInt(sketch.frameCount) % 10 === 0) {
                    this.bird_index += 1;
                    this.bird_index %= 3;
                }
            }
            if ((!mousePress) || !this.is_alive) {
                sketch.push();
                sketch.translate(this.x, this.y);
                sketch.rotate(sketch.radians(this.angle));
                sketch.image(this.sprite_bird, 0, 0, this.sprite_bird.width * image_scaling, this.sprite_bird.height * image_scaling);
                sketch.pop();
                sketch.redraw();
            }
            else {
                sketch.push();
                sketch.translate(this.x, this.y);
                sketch.rotate(sketch.radians(this.angle));
                sketch.image(this.sprite_bird, 0, 0, this.sprite_bird.width * image_scaling, this.sprite_bird.height * image_scaling);
                sketch.pop();
                sketch.redraw();
            }
            sketch.redraw();
        }

        update() {
            if (!this.is_alive) {
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
                var network_output = this.bird_unit.calculate(this.inputs());
                if (network_output[0] > network_output[1]) {
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

                if (this.y > sketch.height - sprite_floor.height * image_scaling/2 - 12 && this.is_alive) {
                    this.is_alive = false;
                    player_count--;
                }
            }
            this.y = clamp(this.y, -20, sketch.height - 50);
            sketch.redraw();
        }

        look() {
            if (pipes.length > 0) {
                var reference;
                for (var pipe of pipes) {
                    if (pipe.x + sprite_pipe.width * image_scaling/2 > this.x) {
                        reference = pipe;
                        break;
                    }
                }
                this.h_distance_to_pipe_left = this.x + this.sprite_bird.width * image_scaling / 2 - (reference.x - sprite_pipe.width * image_scaling / 2);
                this.h_distance_to_pipe_right = this.x - this.sprite_bird.width * image_scaling / 2 - (reference.x + sprite_pipe.width * image_scaling / 2);
                this.v_distance_to_top_pipe = this.y - this.sprite_bird.height * image_scaling / 2 - (reference.y - reference.gapSize);
                this.v_distance_to_bottom_pipe = this.y + this.sprite_bird.height * image_scaling / 2 -(reference.y + reference.gapSize);
            }
            // console.log(this.h_distance_to_pipe_left, this.h_distance_to_pipe_right, this.v_distance_to_top_pipe, this.v_distance_to_bottom_pipe);
        }

        inputs() {
            this.look();
            return [this.h_distance_to_pipe_left, this.h_distance_to_pipe_right, this.v_distance_to_top_pipe, this.v_distance_to_bottom_pipe, this.velocityY];
            //return [this.h_distance_to_pipe_left, this.h_distance_to_pipe_right, this.v_distance_to_top_pipe, this.v_distance_to_bottom_pipe, this.velocityY]
        }

        kinematicMove() {
            if (gameover) {
                this.x = sketch.width / 2;
                this.y = sketch.height / 2;

                gameover = false;
                score = 0;
            }
            this.y = sketch.height / 2 + sketch.map(sketch.sin(sketch.frameCount * 0.1), 0, 1, -2, 2);

            this.sprite_bird = this.frames[this.bird_index];
            if (this.is_alive) {
                if (parseInt(sketch.frameCount) % 10 === 0) {
                    this.bird_index += 1;
                    this.bird_index %= 3;
                }
            }

            sketch.push();
            sketch.translate(this.x, this.y);
            sketch.image(this.sprite_bird, 0, 0, this.sprite_bird.width * image_scaling, this.sprite_bird.height * image_scaling);
            sketch.pop();
            sketch.redraw();
        }
    }

    sketch.setup = function() {
        if (mobile()) {
            c = sketch.createCanvas(windowWidth, windowHeight);
            c.parent("ai");
        }
        else {
            c = sketch.createCanvas(fixed_width, fixed_height);
            c.parent("ai");
        }

        c.mousePressed(mPress);
        c.mouseReleased(mRelease);
        
        console.log("Hey dude I'm here");
        sketch.imageMode(sketch.CENTER);
        sketch.rectMode(sketch.CENTER);
        sketch.ellipseMode(sketch.CENTER);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);

        sketch.noSmooth();

        pipes[0] = new Pipe();

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
        
        start_next_generation();
        for(i of Array(all_birds.length).keys()) {
            all_birds[i].y = sketch.height / 2;
        }
        best_unit = all_birds[0].bird_unit;

        sprite_pipe = sketch.loadImage('static/flappy-bird/assets/pipe-green.png');
        sprite_city = sketch.loadImage('static/flappy-bird/assets/background-day-ns.png');
        sprite_floor = sketch.loadImage('static/flappy-bird/assets/base.png');
        sprite_title = sketch.loadImage('static/flappy-bird/assets/title.png');
        sprite_game_over = sketch.loadImage('static/flappy-bird/assets/gameover.png');

        font_flappy = sketch.loadFont('static/flappy-bird/font/04B_19.TTF');

        // * POINT 0001

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

    function start_next_generation() {
        console.log(">>> GENERATION: ", generation, " <<<");
        // if (generation > 1) { call neat.evolve() }
        new_birds = [];
        for (var unit of units) {
            new_birds.push(new Bird(unit));
        }
        all_birds = new_birds;
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

    //PAGES
    function page_game() {
        all_dead = true;
        overflowX += speed;
        if (overflowX > sprite_city.width / image_scaling) {
            overflowX = 0;
        }

        //City
        sketch.image(sprite_city, sprite_city.width/image_scaling, sprite_city.height/image_scaling, sprite_city.width * image_scaling, sprite_city.height * image_scaling);

        //creator
        if (parseInt(sketch.frameCount) % 66 === 0) {
            pipes.push(new Pipe());
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

        for (i of Array(all_birds.length).keys()) {
            if (all_birds[i].is_alive) {
                all_dead = false;
                all_birds[i].display();
                all_birds[i].update();
                all_birds[i].x = smoothMove(all_birds[i].x, 90, 0.02);
            }
        }

        sketch.redraw();
        
        if (all_dead) {
            generation++;
            send_data();
            resetGame();
        }

        if (!best_bird.is_alive) {
            for (var i = all_birds.length-1; i >= 0; i--) {
                if (all_birds[i].is_alive) {
                    best_bird = all_birds[i];
                    best_bird.frames = red_bird_frames;
                    best_unit = best_bird.bird_unit;
                    break;
                }
            }
        }
        
        // Score
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

        // Generation
        if (!gameover) {
            sketch.push();
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.fill(255);
            sketch.textSize(26);
            sketch.text("Generation: " + generation, sketch.width / 2, sketch.height - 50);
            sketch.pop();
            sketch.redraw();

            sketch.push();
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.fill(255);
            sketch.textSize(26);
            sketch.text("Birds left: " + player_count, sketch.width / 2, sketch.height - 25);
            sketch.pop();
            sketch.redraw();
        }
        
        sketch.push();
        sketch.noStroke();
        for (i of Array(all_birds.length).keys()) {
            sketch.fill(255, all_birds[i].flashAnim);
        }
        sketch.rect(sketch.width / 2, sketch.height / 2, sketch.width, sketch.height);
        sketch.pop();
        sketch.redraw();
        if (gameover) {
            menu_gameover.display();
            menu_gameover.update();
        }
        sketch.redraw();
    }

    placeholder_bird = new Bird();
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
        sketch.text("AI's bird", sketch.width / 2, sketch.height /  2 - 150);
        sketch.pop();
        
        
        placeholder_bird.kinematicMove();

        sketch.push();
        sketch.fill(230, 97, 29);
        sketch.stroke(255);
        sketch.strokeWeight(3);
        sketch.textSize(30);
        sketch.text('Tap to run', sketch.width / 2, sketch.height / 2 - 90);
        sketch.pop();
        sketch.redraw();
        
        if (mousePressEvent || (keyPressEvent && key == ' ')) {
            page = "GAME";
            resetGame();
            best_bird = all_birds[all_birds.length - 1];
            best_bird.frames = red_bird_frames;
            best_unit = best_bird.bird_unit;
            
            for (i of Array(all_birds.length).keys()) {
                console.log(i);
                all_birds[i].velocityY = 0;
                all_birds[i].fly = true;
                all_birds[i].target = clamp(this.y - 60, -19, sketch.height);
                all_birds[i].angle = -45;
                all_birds[i].update();
            }
            sketch.redraw();
        }

        placeholder_bird.x = sketch.width / 2;
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
            //Score
            

            //Pipes collisions
            var random_bird = get_random_alive_bird();
            if (random_bird) {
                if (this.potential && (random_bird.x > this.x - random_bird.sprite_bird.width * image_scaling / 2 - 10 && random_bird.x < this.x + random_bird.sprite_bird.width * image_scaling / 2 + 10)) {
                    score++;
                    this.potential = false;
                    for (var b of all_birds) {
                        if (b.is_alive) {
                            b.bird_unit.score += score;
                        }
                    }
                }
            }
            for (i of Array(all_birds.length).keys()) {
                bird = all_birds[i];
                
                if ((
                    (bird.x + bird.sprite_bird.width * image_scaling / 2 > this.x - bird.sprite_bird.width * image_scaling / 2 - 15 && bird.x - bird.sprite_bird.width * image_scaling / 2  < this.x + bird.sprite_bird.width * image_scaling / 2 + 15) &&
                    (bird.y + bird.sprite_bird.height * image_scaling + 15 > (this.y - this.gapSize - sprite_pipe.height * image_scaling / 2) - 200 && bird.y - bird.sprite_bird.height * image_scaling -15 < (this.y - this.gapSize - sprite_pipe.height * image_scaling / 2) + 200)
                )
    
                    ||
    
                    (
                        (bird.x + bird.sprite_bird.width * image_scaling / 2 > this.x - bird.sprite_bird.width * image_scaling / 2 - 5 && bird.x - 20 < this.x + bird.sprite_bird.width * image_scaling / 2 + 5) &&
                        (bird.y + bird.sprite_bird.height * image_scaling + 15 > (this.y + this.gapSize + sprite_pipe.height * image_scaling / 2) - 200 && bird.y - bird.sprite_bird.height * image_scaling - 15 < (this.y + this.gapSize + sprite_pipe.height * image_scaling / 2) + 200)
                    )
    
                ) {
                    if (bird.is_alive) {
                        player_count--;
                        bird.is_alive = false;
                    }
                }
            }
            
        }

        update() {
            this.x -= speed;
        }
    }

    function get_random_alive_bird() {
        var bird;
        for (i of Array(all_birds.length).keys()) {
            bird = all_birds[i];
            if (bird.is_alive) {
                return bird;
            }
        }
        return null;
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
        speed = 5;
        score = 0;
        player_count = NUMBER_OF_BIRDS;

        start_next_generation();
        for (i of Array(all_birds.length).keys()) {
            bird = all_birds[i];
            bird.y = sketch.height / 2
            bird.is_alive = true;
            bird.velocityY = 0;
            bird.angle = 0;
            bird.flashAnim = 0;
            bird.flashReturn = false;
            bird.target = 10000;
        }
        
        pipes = [];
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
