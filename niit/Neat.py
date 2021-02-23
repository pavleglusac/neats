from niit.NodeGene import NodeGene
from niit.ConnectionGene import ConnectionGene
from niit.Genome import Genome
from niit.Unit import Unit
from niit.Species import Species
import random, os


class Neat(object):
    """
    Attributes:
        all_nodes, all_connections
        units
        species
        max_units
        input_size, output_size
        C1, C2, C3
        species_threshold
        death_row
        mutate_weight_shift_probability
        mutate_weight_random_probability
        mutate_connection_enabled_probability
        mutate_connection_probability
        mutate_node_probability
    Methods:
        getters for all attributes and setters for some
        create_new_node(self, x=0)
        create_new_genome(self)
        create_new_connection(self, from_node: NodeGene, to_node: NodeGene, weight, enabled)
        copy_connection(self, connection: ConnectionGene)
        evolve(self)
        generate_species(self)
        kill_some(self)
        remove_extinct_species(self)
        reproduce(self)
        mutate(self)
        select_random_species(self)
    """

    def __init__(self, input_size, output_size, num_units):
        self.all_connections = {}
        self.all_nodes = {}
        self.units = set({})
        self.species = set({})
        self.max_units = num_units
        self.input_size = input_size
        self.output_size = output_size
        self.reset(input_size, output_size, num_units)

        self.C1, self.C2, self.C3 = 1, 1, 1
        self.species_threshold = 4
        self.death_row = 0.9  # percentage of units that get clapped

        self.weight_shift_strength = 0.3
        self.weight_random_strength = 1

        self.mutate_weight_shift_probability = 0.05
        self.mutate_weight_random_probability = 0.05
        self.mutate_connection_enabled_probability = 0.02
        self.mutate_connection_probability = 0.3
        self.mutate_node_probability = 0.01


        self.setters = {
                    "set_species_threshold" : self.set_species_threshold,
                    "set_mutate_weight_shift_probability" : self.set_mutate_weight_shift_probability,
                    "set_mutate_connection_enabled_probability" : self.set_mutate_connection_enabled_probability,
                    "set_mutate_connection_probability" : self.set_mutate_connection_probability,
                    "set_mutate_node_probability" : self.set_mutate_node_probability,
                    "set_weight_shift_strength" : self.set_weight_shift_strength,
                    "set_weight_random_strength" : self.set_weight_random_strength,
                    "set_death_row" : self.set_death_row,
                    "set_species_threshold" : self.set_species_threshold,
                    "set_mutate_weight_random_probability" : self.set_mutate_weight_random_probability
        }

    def get_species_threshold(self):
        return self.species_threshold

    def set_species_threshold(self, val):
        self.species_threshold = val

    def get_mutate_weight_shift_probability(self):
        return self.mutate_weight_shift_probability

    def set_mutate_weight_shift_probability(self, probability):
        self.mutate_weight_shift_probability = probability

    def get_mutate_weight_random_probability(self):
        return self.mutate_weight_random_probability

    def set_mutate_weight_random_probability(self, probability):
        self.mutate_weight_random_probability = probability

    def get_mutate_connection_enabled_probability(self):
        return self.mutate_connection_enabled_probability

    def set_mutate_connection_enabled_probability(self, probability):
        self.mutate_connection_enabled_probability = probability

    def get_mutate_connection_probability(self):
        return self.mutate_connection_probability

    def set_mutate_connection_probability(self, probability):
        self.mutate_connection_probability = probability

    def get_mutate_node_probability(self):
        return self.mutate_node_probability

    def set_mutate_node_probability(self, probability):
        self.mutate_node_probability = probability

    def get_weight_shift_strength(self):
        return self.weight_shift_strength

    def set_weight_shift_strength(self, strength):
        self.weight_shift_strength = strength

    def get_weight_random_strength(self):
        return self.weight_random_strength

    def set_weight_random_strength(self, strength):
        self.weight_random_strength = strength
        
    def set_death_row(self, percentage):
        self.death_row = percentage

    def set_species_threshold(self, threshold):
        self.species_threshold = threshold
    
    def get_units(self):
        return self.units

    def reset(self, input_size, output_size, num_units):
        self.input_size = input_size
        self.output_size = output_size
        self.max_units = num_units

        self.units.clear()

        for i in range(input_size):
            self.create_new_node(x=1)
        for i in range(output_size):
            self.create_new_node(x=10)
        for i in range(num_units):
            unit = Unit(self.create_new_genome())
            self.units.add(unit)

    def create_new_node(self, x=0):
        node = NodeGene(len(self.all_nodes) + 1)
        node.set_x(x)
        self.all_nodes[len(self.all_nodes) + 1] = node
        return node

    def create_new_genome(self):
        g = Genome(self, 2)
        for i in range(self.input_size + self.output_size):
            g.add_node(self.get_node(i + 1))
        return g

    def create_new_connection(self, from_node: NodeGene, to_node: NodeGene, weight, enabled):
        c_id = ConnectionGene.get_connection_id(from_node, to_node)
        if c_id in self.all_connections:
            return self.copy_connection(self.all_connections[c_id])
        con = ConnectionGene(from_node, to_node, len(self.all_connections) + 1)
        con.set_enabled(enabled)
        con.set_weight(weight)
        self.all_connections[c_id] = con
        return con

    def get_connection(self, c_id):
        return self.all_connections[c_id]

    @staticmethod
    def copy_connection(connection: ConnectionGene):
        con = ConnectionGene(connection.get_from(), connection.get_to())
        con.set_weight(connection.get_weight())
        con.set_enabled(connection.is_enabled())
        con.set_innovation_number(connection.get_innovation_number())
        return con

    def get_node(self, n_id):
        return self.all_nodes[n_id]

    def get_C1(self):
        return self.C1

    def get_C2(self):
        return self.C2

    def get_C3(self):
        return self.C3

    def print_nodes(self):
        print("All nodes: ")
        for node in self.all_nodes.values():
            print("Node: ", node.get_innovation_number(), "|| ", end="")
        print()
        print()

    def print_genomes(self):
        print("Genomes: ")
        print()
        for unit in self.units:
            unit.get_genome().print_genome()
        print()

    def evolve(self):
        self.generate_species()
        self.kill_some()
        self.remove_extinct_species()
        self.reproduce()
        self.mutate()

    def generate_species(self):
        for species in self.species:
            species.reset()
        for unit in self.units:
            if unit.get_species():
                continue
            for species in self.species:
                if species.put(unit):
                    break
            else:
                self.species.add(Species(unit))

        for species in self.species:
            species.eval_score()

    def kill_some(self):
        for species in self.species:
            species.kill(self.death_row)

    def remove_extinct_species(self):
        for i in range(len(self.species) - 1, -1, -1):
            chosen = list(self.species)[i]
            if chosen.size() <= 1:
                chosen.die_out()
                self.species.remove(chosen)

    def reproduce(self):
        for unit in self.units:
            if not unit.get_species():
                selected: Species = self.select_random_species()
                if not selected:
                    continue
                unit.set_genome(selected.breed())
                selected.force_put(unit)

    def select_random_species(self):
        considered_species = []
        scores = []
        total_score = 0
        for species in self.species:
            considered_species.append(species)
            scores.append(species.get_score())
            total_score += species.get_score()

        val = random.random() * total_score
        c = 0
        for i in range(len(considered_species)):
            c += scores[i]
            if c > val:
                return considered_species[i]
        return None

    def mutate(self):
        for unit in self.units:
            unit.mutate()

    def load_settings(self, path):
        dirname = os.path.dirname(os.path.dirname(__file__)) + path
        f = open(dirname)
        for line in f:
            line = line.split("=")
            attr = ("set_" + line[0]).rstrip()            
            val = eval(line[1])
            self.setters[attr](val)

if __name__ == "__main__":
    pass
