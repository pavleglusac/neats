import math


class Network:
    """
    Attributes:
        genome
        nodes
        input_size, output_size
        nodes_dict, cons_dict
        input
    Methods:
        set_input(self, input_val)
        sort_by_x(self)
        create_cons(self)
        calculate(self)
        @staticmethod
        sigmoid(x)

    """
    def __init__(self, genome, input_size, output_size):
        self.genome = genome
        self.nodes = []
        self.input = None
        self.cons_dict = {}
        self.nodes_dict = {}
        self.input_size = input_size
        self.output_size = output_size
        self.sort_by_x()
        self.create_cons()

    def set_input(self, input_val):
        self.input = input_val
        for i in range(len(input_val)):
            self.nodes[i].set_value(input_val[i])

    def sort_by_x(self):
        for node in self.genome.get_nodes_list():
            net_node = NetNode(node)
            self.nodes.append(net_node)
            self.nodes_dict[net_node.get_innovation_number()] = net_node
        self.nodes = sorted(self.nodes)
        # self.print_nodes()

    def print_nodes(self):
        print("Net nodes: ")
        for node in self.nodes:
            print("Node: ", node.get_innovation_number(), " x: ", node.get_x(), "|| ", end="")
        print()
        print()

    def create_cons(self):
        for con in self.genome.get_connections_list():
            from_id = con.get_from().get_innovation_number()
            to_id = con.get_to().get_innovation_number()
            self.cons_dict[from_id] = [to_id, con.get_weight()]

    def calculate(self):
        for node in self.nodes:
            if node.get_innovation_number() in self.cons_dict.keys():
                to_id, weight = self.cons_dict[node.get_innovation_number()]
                from_val = node.get_value()
                to_val = self.nodes_dict[to_id].get_value()
                to_val += from_val * weight
                activated_val = Network.sigmoid(to_val)
                self.nodes_dict[to_id].set_value(activated_val)

        output_values = []
        exp_values = []
        normalized_output_values = []
        for node in self.nodes[-1:-self.output_size-1:-1]:
            output_values.append(node.get_value())
            exp_values.append(math.exp(node.get_value()))
        for out in exp_values:
            normalized_output_values.append(out / sum(exp_values))

        # return self.nodes[-1].get_value()
        return normalized_output_values

    @staticmethod
    def sigmoid(x):
        try:
            exp_val = math.exp(-x)
        except OverflowError:
            exp_val = float('inf')
        return 1 / (1 + exp_val)

    def __str__(self):
        s = ""
        sep1 = ";"
        sep2 = "|"
        for n in self.nodes:
            s += str(n.get_innovation_number()) + sep1 + str(n.get_x()) + sep1
        s += sep2

        for item in self.cons_dict.items():
            from_ = item[0]
            to_ = item[1][0]
            w = item[1][1]
            s += str(from_) + sep1 + str(to_) + sep1 + str(w) + sep1
        return s


class NetNode:
    """
    Attributes:
        value
        innovation_number
        x
    Methods:
        getters and setters for attributes
         __lt__(self, other) : compares by x
    """
    def __init__(self, node_gene):
        self.value = 0
        self.x = node_gene.get_x()
        self.innovation_number = node_gene.get_innovation_number()

    def get_innovation_number(self):
        return self.innovation_number

    def set_value(self, val):
        self.value = val

    def get_value(self):
        return self.value

    def get_x(self):
        return self.x

    def __lt__(self, other):
        return self.x < other.get_x()
