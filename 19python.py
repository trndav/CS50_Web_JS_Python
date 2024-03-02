
print("CS50 Web Python")

var1 = 1
var2 = 1.5
var3 = "Hi"
var4 = True
var5 = None

name = "Bob" # input("Type your name \n")
print(f"You are {name}.")
print("You are: " + name)

x = -4
if x > 0:
    print(f"{x} is positive number")
elif x < 0:
    print(f"{x} is not positive number")
else:
    print(f"{x} is 0")

number: int = int(input("Type number: \n"))
y = 5
print(f"{number} + 5 is: {number + y}")