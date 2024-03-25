import os
import pathlib
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

def file_uri(filename):
    return pathlib.Path(os.path.abspath(filename)).as_uri()

driver = webdriver.Chrome()

class WebpageTests(unittest.TestCase):
    def test_title(self):
        driver.get(file_uri("counter.html"))
        self.assertEqual(driver.title, "Counter") # Check title

    def test_increase(self):
        driver.get(file_uri("counter.html"))
        increase = driver.find_element("id", "increase")
        increase.click()
        idd = driver.find_element(By.TAG_NAME, 'h1')
        self.assertEqual(idd.text, "1") # Check increase click

    def test_decrease(self):
        driver.get(file_uri("counter.html"))
        decrease = driver.find_element("id", "decrease")
        decrease.click()
        idd = driver.find_element(By.TAG_NAME, "h1")
        self.assertEqual(idd.text, "-1" )

    def test_multiple_increase(self):
        driver.get(file_uri("counter.html"))
        increase = driver.find_element("id", "increase")
        for i in range(5):
            increase.click()
        idd = driver.find_element(By.TAG_NAME, "h1")
        self.assertEqual(idd.text, "5")

if __name__ == "__main__":
    unittest.main()
