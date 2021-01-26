var units_data = null;
var units = [];
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
    for(var i = 0; i < units_data.length; i++) {
        var obj = units_data[i];
        var bird = new BirdUnit(i, obj[i]);
        units.push(bird);
    }
    var input = [1, 2, 3, 4, 5];
    var b = units[0];
    console.log(b);
    console.log(b.calculate(input));
    
    //console.log(units_data);
}