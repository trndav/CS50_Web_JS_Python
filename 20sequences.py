#Sequence
name = "Harry"
print(name[0:3])

# List - sequence of mutable values
# Tuple - sequence of immutable values, tple = (10, 20)
# Set - collection of unique values
# Dictionary - collection of key -value

# List
lst = ["Harry", "Ron", "Hermione"]
print(lst[0:2])
lst.append("Bombadil")
lst.sort()
print(lst)

# Set
s = set()
# Add to set
s.add(1)
s.add(2)
s.add(3)
s.add(3)
s.add(4)
s.remove(2)
print(f"Set: {s} and length is {len(s)}")