$(document).ready(function(){
        $("button").click(function(){
            $.post("/flappy-bird", {data:"postdata123"}, function(data, status){
                console.log("data "  + data + " status " + status);
            });    
        }
        );
      
    }
);
