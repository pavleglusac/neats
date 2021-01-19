from niit.Gene import Gene


class ConnectionGene(Gene):
    """
    Attributes:
        innovation_num: innovation number
        from_node: connected from node
        to_node: connected to node
        weight: weight of the connection
        enabled: is connection enabled
    Methods:
        get_weight(self), set_weight(self, weight)
        is_enabled(self), set_enabled(self, enabled)
        get_innovation_number(self), set_innovation_number(self, innovation_number)
        get_from(self), get_to(self)
        get_id(self)
        @staticmethod
        get_connection_id(from_node, to_node)
    """

    def __init__(self, from_node, to_node, innovation_num=0):
        super().__init__(innovation_num)
        self.from_node = from_node
        self.to_node = to_node
        self.weight = 0
        self.enabled = 0

    def set_weight(self, weight):
        self.weight = weight

    def set_enabled(self, enabled):
        self.enabled = enabled

    def get_weight(self):
        return self.weight

    def is_enabled(self):
        return self.enabled

    def set_innovation_number(self, innovation_number):
        self.innovation_num = innovation_number

    def get_innovation_number(self):
        return self.innovation_num

    def get_id(self):
        return self.get_connection_id(self.from_node, self.to_node)

    def get_from(self):
        return self.from_node

    def get_to(self):
        return self.to_node

    @staticmethod
    def get_connection_id(from_node, to_node):
        id1 = str(from_node.get_innovation_number())
        id2 = str(to_node.get_innovation_number())
        return id1 + "x" + id2

    def __hash__(self):
        return self.innovation_num

    def __eq__(self, other):
        if not isinstance(other, ConnectionGene):
            return False
        return self.innovation_num == other.get_innovation_number()
