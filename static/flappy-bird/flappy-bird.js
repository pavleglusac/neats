var units_data = null;
var units = [];
let netCanvas;

$(document).ready(function(){
    $("button").click(function(){
        $.post("/flappy-bird", {data:"postdata123"}, function(data, status){
            console.log("data "  + data + " status " + status);
        });    
    }
    );
  }
);

$(document).ready(function(){
    $.get("/flappy-bird?param=1", function(data, status){
            units_data = JSON.parse(data);
            create_units();
    });
});

function create_units(){
    for(var i = 0; i < units_data.length; i++) 
    {
        var obj = units_data[i];
        var bird = new BirdUnit(i, obj[i]);
        units.push(bird);
    }
    var input = [1, 2, 3, 4, 5];
    var b = units[0];
    randomize_scores();
    console.log("Newest");
    new p5(player_game_sketch);
    new p5(ai_game_sketch);
    new p5(network_sketch);
}

function randomize_scores() {
    for(var i = 0; i < units_data.length; i++) 
    {
        units[i].score = Math.random();
    }
}

var network_sketch = function(sketch)
{

    sketch.setup = function(){
        netCanvas = sketch.createCanvas(300, 710);
        netCanvas.parent("network");
    }
    
    sketch.draw = function(){
        findBest = (arr) => {
            return arr.reduce( (p, v) => { return ( p.score > v.score ? p : v ) } );
        };
        best_unit = findBest(units);
        console.log(best_unit);
        netCanvas.background(255, 255, 255);
        var nodes = best_unit.nodes;
        var x = 50;
        var y = -10;
        var r = 50;
        var prev_x = nodes[0].x;
        var mapka = {};
        sketch.fill(77, 210, 255);
        sketch.stroke(77, 210, 255);
        for(var i = 0; i < nodes.length; i++) 
        {    
            if(nodes[i].x > prev_x)
            {
                x += 90;
                y = 50;
                prev_x = x;
            }
            else
            {
                y += 60;
            }
            var c = sketch.circle(x, y, r);
            mapka[nodes[i].id] = [x, y];
        }
        var cons = best_unit.connections;
        sketch.stroke(0);
        sketch.strokeWeight(4);
        for(var [key, value] of Object.entries(cons))
        {
            for(item of value)
            {
                var from_x = mapka[key][0];
                var from_y = mapka[key][1];
                var to = item.to;
                var to_x = mapka[to][0];
                var to_y = mapka[to][1];
                sketch.line(from_x, from_y, to_x, to_y);
            }
        }
        sketch.redraw();
    }   

}
