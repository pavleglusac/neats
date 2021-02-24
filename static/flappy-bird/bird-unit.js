class BirdUnit {

    constructor(id, data){
        this.id = id;
        this.data = data;
        this.nodes = [];
        this.nodes_dict = {};
        this.connections = {};
        this.decode_data();
        this.input_size = 5;
        this.output_size = 2;
        this.score = 0;
    }

    decode_data() {
        var node_data = this.data[0].split(";");
        for(var node of node_data) {
            node = node.split(":");
            var netNode = new NetNode(node[0], parseInt(node[1]))
            this.nodes.push(netNode);
            this.nodes_dict[node[0]] = netNode;
        }
        var con_data = this.data[1].split(";");
        for(var con of con_data) {
            con = con.split("x");
            if(con.length == 0)
                continue;
            if (!(con[0] in this.connections)){
                this.connections[con[0]] = []
            }
            this.connections[con[0]].push(new NetConnection(con[0], con[1], con[2]));
        }

        this.nodes.sort(function(a, b) {
            if(a.x >= b.x)
                return 1;
            else
                return -1;
        });
    }

    calculate(input) {
        for(var i = 0; i < this.input_size; i++)
        {
            this.nodes[i].value = input[i];
        }

        for(var node of this.nodes) {
            if(node.id in this.connections)
            {
                for(var tode of this.connections[node.id])
                {
                    var to_id = tode.to;
                    var weight = tode.weight;
                    var from_val = node.value;
                    var to_val = this.nodes_dict[parseInt(to_id)].value;
                    to_val += from_val * weight;
                    var activated_val = this.sigmoid(to_val);
                    this.nodes_dict[parseInt(to_id)].value = activated_val;
                }
            }
        }
        var exp_values = [];
        var normalized_output_values = [];
        for(var i = 0; i < this.output_size; i++){
            var node = this.nodes[this.nodes.length - i - 1];
            exp_values.push(Math.exp(node.value));
        }
        var sumica = exp_values.reduce((a, b) => a + b);
        for(var i = 0; i < this.output_size; i++)
        {
            var out = exp_values[i];
            normalized_output_values.push(out / sumica)
        }
        return normalized_output_values;
    }

    sigmoid(x) {  
        return 1 / (1 + Math.exp(-x));
    } 
      
}

class NetNode {
    constructor(id, x)
    {
        this.id = id;
        this.x = x;
        this.value = 0;
    }
}

class NetConnection {
    constructor(from, to, weight)
    {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}