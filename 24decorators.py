
# Decorator takes function as input and outputs modified function
# Functional programming

# decorator
def announce(f):
    def wrapper():
        print("About to run a function...")
        f()
        print("Done with the function.")
    return wrapper

@announce
def hi():
    print("Hi world!")

hi()