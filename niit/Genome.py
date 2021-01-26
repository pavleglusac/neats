import random
from niit.ConnectionGene import ConnectionGene
import niit.NodeGene as NodeGene


class Genome(object):
    """
    Attributes:
        connections: all connections
        nodes: all nodes
        id: genome id
        neat: base neat class
    Methods:
        get_random_connection(self)
        get_random_node(self) -> NodeGene
        crossover(self, other)
        distance(self, other)
        mutate(self)
        mutate_node(self)
        mutate_connection(self)
        mutate_connection_enabled(self)
        mutate_weight_random(self)
        mutate_weight_shift(self)
    """
    def __init__(self, neat, g_id):
        self.connections = set({})
        self.nodes = set({})
        self.neat = neat
        self.id = g_id

    def get_random_connection(self):
        if not self.connections:
            return None
        return random.choice(list(self.connections))

    def get_random_node(self) -> NodeGene:
        return random.choice(list(self.nodes))

    def crossover(self, other):
        ind1 = 0
        ind2 = 0
        child = self.neat.create_new_genome()
        neat = self.neat
        genome1 = self
        genome2 = other
        end1 = len(genome1.connections)
        end2 = len(genome2.get_connections())
        while ind1 < end1 and ind2 < end2:
            gene1 = genome1.get_connections_list()[ind1]
            gene2 = genome2.get_connections_list()[ind2]
            in_id1 = gene1.get_innovation_number()
            in_id2 = gene2.get_innovation_number()
            if in_id1 == in_id2:
                # similar
                if random.random() > 0.5:
                    child.add_connection(neat.copy_connection(gene1))
                else:
                    child.add_connection(neat.copy_connection(gene2))
                ind1 += 1
                ind2 += 1
            if in_id1 > in_id2:
                # disjoint b
                ind2 += 1
            else:
                child.add_connection(neat.copy_connection(gene1))
                ind1 += 1

        while ind1 < len(genome1.connections):
            gene1 = genome1.get_connections_list()[ind1]
            child.add_connection(neat.copy_connection(gene1))
            ind1 += 1

        for con in child.get_connections():
            to_node = con.get_to()
            from_node = con.get_from()
            # SELF.NODES MUST BE A SET, BECAUSE THIS LOOP PRODUCES DUPLICATE NODES
            child.add_node(to_node)
            child.add_node(from_node)
        return child

    def distance(self, other):
        genome1 = self
        genome2 = other
        ind1 = 0
        ind2 = 0
        disjoint = 0
        weight_diff = 0
        similar = 0

        connections1 = self.get_connections_list()
        connections2 = other.get_connections_list()

        highest_innovation_gene1 = 0
        if len(connections1) != 0:
            highest_innovation_gene1 = connections1[-1].get_innovation_number()

        highest_innovation_gene2 = 0
        if len(connections2) != 0:
            highest_innovation_gene2 = connections2[-1].get_innovation_number()

        if highest_innovation_gene1 < highest_innovation_gene2:
            genome1 = other
            genome2 = self

        while ind1 < len(genome1.get_connections_list()) and ind2 < len(genome2.get_connections_list()):
            gene1 = genome1.get_connections_list()[ind1]
            gene2 = genome2.get_connections_list()[ind2]
            in_id1 = gene1.get_innovation_number()
            in_id2 = gene2.get_innovation_number()
            if in_id1 == in_id2:
                # similar
                ind1 += 1
                ind2 += 1
                weight_diff = abs(gene1.get_weight() - gene2.get_weight())
                similar += 1
            if in_id1 > in_id2:
                # disjoint b
                disjoint += 1
                ind2 += 1
            else:
                # disjoint a
                disjoint += 1
                ind1 += 1

        if similar:
            weight_diff /= similar
        else:
            weight_diff = 1
        excess = len(genome1.get_connections()) - ind1
        N = max(len(genome1.get_connections()), len(genome2.get_connections()))
        if N < 20:
            N = 1
        neat = self.neat
        delta = neat.get_C1() * disjoint / N + neat.get_C2() * excess / N + neat.get_C3() * weight_diff / N
        return delta

    def mutate(self):
        if self.neat.get_mutate_weight_shift_probability() > random.random():
            self.mutate_weight_shift()
        if self.neat.get_mutate_weight_random_probability() > random.random():
            self.mutate_weight_random()
        if self.neat.get_mutate_connection_enabled_probability() > random.random():
            self.mutate_connection_enabled()
        if self.neat.get_mutate_connection_probability() > random.random():
            self.mutate_connection()
        if self.neat.get_mutate_node_probability() > random.random():
            self.mutate_node()

    def mutate_node(self):
        con = self.get_random_connection()
        if not con:
            return

        ng_from = con.get_from()
        ng_to = con.get_to()

        ng_middle = self.neat.create_new_node()
        ng_middle.set_x((ng_from.get_x() + ng_to.get_x())/2)

        con1 = self.neat.create_new_connection(ng_from, ng_middle, 1, True)
        con2 = self.neat.create_new_connection(ng_middle, ng_to, con.get_weight(), con.is_enabled())
        self.connections.remove(con)
        self.connections.add(con1)
        self.connections.add(con2)

        self.add_node(ng_middle)

    def mutate_connection(self):
        neat = self.neat
        for i in range(50):
            a = self.get_random_node()
            b = self.get_random_node()

            if a.get_x() == b.get_x():
                continue
            if a.get_x() > b.get_x():
                t = a
                a = b
                b = t
            connection = ConnectionGene(a, b)
            exists = False
            for con in self.get_connections():
                if con.get_to() == connection.get_to() and con.get_from() == connection.get_from():
                    exists = True
            if exists:
                continue
            rnd_weight = (random.random() * 2 - 1) * neat.get_weight_random_strength()
            connection = neat.create_new_connection(connection.get_from(), connection.get_to(), rnd_weight, True)
            self.connections.add(connection)
            return

    def mutate_weight_shift(self):
        con = self.get_random_connection()
        if con:
            con.set_weight(con.get_weight() + (random.random() * 2 - 1) * self.neat.get_weight_shift_strength())

    def mutate_weight_random(self):
        con = self.get_random_connection()
        if con:
            con.set_weight((random.random() * 2 - 1) * self.neat.get_weight_random_strength())

    def mutate_connection_enabled(self):
        con = self.get_random_connection()
        if con:
            con.set_enabled(not con.is_enabled())

    def add_node(self, node):
        self.nodes.add(node)

    def get_neat(self):
        return self.neat

    def get_connections(self):
        return self.connections

    def get_connections_list(self):
        return list(self.connections)

    def add_connection(self, con):
        return self.connections.add(con)

    def get_nodes(self):
        return self.nodes

    def get_nodes_list(self):
        return list(self.nodes)

    def print_genome(self):
        print("Genome ID: ", self.id)
        for node in self.nodes:
            print("Node: ", node.get_innovation_number(), "|| ", end="")
        print()
        for con in self.connections:
            print("Con. : ", con.get_innovation_number(), con.get_id(), " w: ", "{:.3f}".format(con.get_weight()),
                  "|| ", end="")
        if len(self.connections) == 0:
            print("Con. : Empty", end="")
        print()
        print()
    
    def get_data(self):
        vals = [None, None]
        data = ""
        for node in self.nodes:
            data += str(node.get_innovation_number()) + ":" + str(node.get_x()) +  ";"
        data = data[:-1]
        vals[0] = data
        data = ""
        for con in self.connections:
            from_ = con.get_from().get_innovation_number()
            to_ = con.get_to().get_innovation_number()
            w = con.get_weight()
            data += str(from_) + "x" + str(to_) + "x" + str(w) + ";"
        data = data[:-1]
        vals[1] = data
        return (vals[0], vals[1])

    def __eq__(self, other):
        if len(self.get_connections()) != len(other.get_connections()):
            return False
        if len(self.get_nodes()) != len(other.get_nodes()):
            return False
        if set(self.get_nodes()) != set(other.get_nodes()):
            return False
        if set(self.get_connections()) != set(other.get_connections()):
            return False
        return True

    def __hash__(self):
        return self.id
