from niit.Unit import Unit
import random


class Species(object):

    def __init__(self, rep: Unit):
        self.units = set({})
        self.units.add(rep)
        self.representative = rep
        self.score = 0  # average of all of clients' scores
        self.representative.set_species(self)

    def put(self, unit: Unit):
        if unit.get_genome().distance(self.representative.get_genome()) < \
                self.representative.get_genome().get_neat().get_species_threshold():
            unit.set_species(self)
            self.units.add(unit)
            return True
        return False

    def force_put(self, offspring: Unit):
        offspring.set_species(self)
        self.units.add(offspring)

    def die_out(self):
        for unit in self.units:
            unit.set_species(None)

    def eval_score(self):
        score_sum = 0
        for unit in self.units:
            score_sum += unit.get_score()
        self.score = score_sum/len(self.units)

    def reset(self):
        self.representative = random.choice(list(self.units))
        for unit in self.units:
            unit.set_species(None)
        self.units.clear()
        self.units.add(self.representative)
        self.representative.set_species(self)
        self.score = 0

    def kill(self, percentage):
        sorted_units = sorted(list(self.units), key=lambda x: x.score, reverse=False)
        amount = percentage*len(self.units)
        for i in range(int(amount)):
            sorted_units[0].set_species(None)
            self.units.remove(sorted_units[0])
            del sorted_units[0]

    def breed(self):
        unit1 = random.choice(list(self.units))
        unit2 = random.choice(list(self.units))

        if unit1.get_score() > unit2.get_score():
            return unit1.get_genome().crossover(unit2.get_genome())
        return unit2.get_genome().crossover(unit1.get_genome())

    def size(self):
        return len(self.units)

    def get_units(self):
        return self.units

    def get_score(self):
        return self.score

    def get_representative(self):
        return self.representative
