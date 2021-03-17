var units_data = null;
var units = [];
let netCanvas;

var best_unit = null;

/*$(document).ready(function(){
    $("button").click(function(){
        $.post("/flappy-bird", {data:"postdata123"}, function(data, status){
            console.log("data "  + data + " status " + status);
        });    
    }
    );
  }
);*/

$(document).ready(function(){
    $.get("/flappy-bird?param=1", function(data, status){
            units_data = JSON.parse(data);
            create_units();
    });
});


function send_data()
{
    output_data = ""
    for(var i = 0; i < units.length; i++)
    {
        output_data += units[i].id + ":" + units[i].score + ";";
    }
    return $.post("/flappy-bird", {data:output_data}, function(data, status){
        units_data = JSON.parse(data);
        change_units();
    });
}


function change_units()
{
    units = [];
    for(var i = 0; i < units_data.length; i++) 
    {
        var obj = units_data[i];
        var bird = new BirdUnit(i, obj[i]);
        units.push(bird);
    }
}

function create_units(){
    for(var i = 0; i < units_data.length; i++) 
    {
        var obj = units_data[i];
        var bird = new BirdUnit(i, obj[i]);
        units.push(bird);
    }
    var input = [1, 2, 3, 4, 5];
    new p5(player_game_sketch);
    new p5(ai_game_sketch);
    new p5(network_sketch);
}


var network_sketch = function(sketch)
{

    sketch.setup = function(){
        netCanvas = sketch.createCanvas(300, 710);
        netCanvas.parent("network");
    }
    
    sketch.draw = function(){
        /*
        findBest = (arr) => {
            return arr.reduce( (p, v) => { return ( p.score > v.score ? p : v ) } );
        };
        best_unit = findBest(units);*/
        sketch.background('#293241');
        var nodes = best_unit.nodes;
        //
        var num_of_xs = find_num_of_xs(nodes);
        // console.log(num_of_xs);
        var prev_x = nodes[0].x;
        var x = 50;
        var y = -10;
        var r = 30;
        var mapka = {};
        
        sketch.fill('#e0fbfc');
        sketch.stroke(77, 210, 255);
        for(var i = 0; i < nodes.length; i++) 
        {    
            if(nodes[i].x > prev_x)
            {
                x += 90;
                if(x > sketch.width)
                {
                    sketch.resizeCanvas(sketch.width + 100, sketch.height);
                }
                y = 50 + (num_of_xs[-1] - num_of_xs[nodes[i].x])/2*60;
                // console.log(y);
                prev_x = nodes[i].x;
            }
            else
            {
                y += 60;
            }
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
                sketch.push()
                sketch.strokeWeight(Math.abs(10*item.weight));
                if(item.weight > 0)
                    sketch.stroke('#ee6c4d');
                else
                    sketch.stroke('#3d5a80');
                sketch.line(from_x, from_y, to_x, to_y);

                sketch.pop();
            }
        }

        sketch.strokeWeight(1);

        for(var [key, value] of Object.entries(mapka))
        {
            var x = value[0];
            var y = value[1];
            var c = sketch.circle(x, y, r);
        }

        sketch.redraw();
    }   

}

function find_num_of_xs(nodes)
{
    var maxx = 0;
    var cur_best = 0;
    var num_of_xs = {};
    var prev_x = nodes[0].x;
    for(var i = 0; i < nodes.length; i++)
    {   
        if(!(nodes[i].x in num_of_xs))
            num_of_xs[nodes[i].x] = 0;
        num_of_xs[nodes[i].x] = num_of_xs[nodes[i].x] + 1;

        if(nodes[i].x != prev_x)
        {
            if(cur_best > maxx)
                maxx = cur_best;
            cur_best = 1;
            prev_x = nodes[i].x;
        }
        else
        {
            cur_best++;
        }
    }
    num_of_xs[-1] = maxx;
    return num_of_xs;
}