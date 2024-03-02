
people = [
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Cho", "house": "Ravenclaw"},
    {"name": "Draco", "house": "Slytherin"},
]

# To sort list of dictionaries:
# And without function, with lambda use
# def f(person):
#     return person["name"]

# Lambda for above
people.sort(key=lambda person: person["name"])

print(people)