from niit.Gene import Gene


class NodeGene(Gene):
    """
    Attributes:
        innovation_num: innovation number
        x: represents x coordinate in network
        y: represents y coordinate in network
    Methods:
        get_innovation_number(self)
        get_x(self)->int, set_x(self, x)
        get_y(self)->int, set_y(self, y)
        __str__(self)->str
        __hash__(self)->str
    """
    def __init__(self, innovation_num=0):
        super().__init__(innovation_num)
        self.x = 0
        self.y = 0

    def get_innovation_number(self):
        return self.innovation_num

    def get_x(self):
        return self.x

    def get_y(self):
        return self.y

    def set_x(self, x):
        self.x = x

    def set_y(self, y):
        self.y = y

    def __str__(self):
        return str(self.innovation_num)

    def __hash__(self):
        return self.innovation_num
