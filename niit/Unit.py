from niit.Genome import Genome


class Unit(object):

    def __init__(self, genome: Genome):
        self.genome = genome
        self.score = 0
        self.species = None

    def get_genome(self):
        return self.genome

    def set_genome(self, g):
        self.genome = g

    def get_score(self):
        return self.score

    def set_score(self, s):
        self.score = s

    def get_species(self):
        return self.species

    def set_species(self, sp):
        self.species = sp

    def distance(self, other):
        return self.genome.distance(other)

    def mutate(self):
        self.genome.mutate()
