import unittest
from prime import is_prime

class Tests(unittest.TestCase):
    # Docstrings are used in unittest to display message ???
    """Check that 1 is not prime."""
    def test_1(self):
        self.assertFalse(is_prime(1)) # Check if 1 is prime

    """Check that 2 is not prime."""
    def test_s(self):
        self.assertTrue(is_prime(2)) # Check if 2 is prime

    """Check that 8 is not prime."""
    def test_8(self):
        self.assertFalse(is_prime(8)) 

    """Check that 11 is not prime."""
    def test_11(self):
        self.assertTrue(is_prime(11))

    """Check that 25 is not prime."""
    def test_25(self):
        self.assertFalse(is_prime(25))

if __name__ == "__main__":
    unittest.main()