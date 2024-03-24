# def square(x):
#     return x + x
# print(square(4) == 16)
# assert square(4) == 16
# *************

# def is_prime(n):
#     if n<2:
#         return False
#     for i in range(2, n):
#         if n % i == 0:
#             return False
#     return True
# print(is_prime(4))
# ******
import math
def is_prime(n):
    if n<2:
        return False
    for i in range(2, int(math.sqrt(n)) +1): # Square root
        if n % i == 0:
            return False
    return True
x = 33
print(is_prime(x))
print(int(math.sqrt(x)))