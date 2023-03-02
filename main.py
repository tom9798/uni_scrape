from selenium import webdriver
import pandas as pd
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


###in the future the inputs will from the interface
name = input("Enter your username: ")
Id = input("Enter your id: ")
pswrd = input("Enter your password: ")

####sign in to the uni website
def sign_in(name, Id, pswrd):
    driver = webdriver.Firefox()
    driver.get("https://www.ims.tau.ac.il/Tal")
    username = driver.find_element(By.NAME, "txtUser")
    username.clear()
    username.send_keys(name)
    #username.send_keys(Keys.RETURN)
    id = driver.find_element(By.NAME, "txtId")
    id.clear()
    id.send_keys(Id)
    #id.send_keys(Keys.RETURN)
    password = driver.find_element(By.NAME, "txtPass")
    password.clear()
    password.send_keys(pswrd)
    #password.send_keys(Keys.RETURN)
    enter = driver.find_element(By.NAME, "enter")
    enter.click()
    return driver

####get the grades dictionary
def get_grades(driver):
    ###create a dict with all the grades and average
    dict = {}

    ###get to the grades table page
    grades_button = driver.find_element(By.ID, "li1")
    grades_button.click()
    driver.switch_to.frame(driver.find_element(By.ID, 'jordan'))
    ishur = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="btnishur"]')))
    # ishur = driver.find_element(By.XPATH, '//*[@id="btnishur"]')
    ishur.click()

    ###get the average and add to the dict
    average = driver.find_element(By.XPATH, '/html/body/div/form/table[1]/tbody/tr[1]/td/table/tbody/tr[1]/td[2]/b')
    dict['average'] = average.text

    ###try to implement with pandas
    # grades_data = driver.find_element(By.XPATH, '/html/body/div/form/table[2]/tbody').get_attribute("outerHTML")
    # df  = pd.read_html(grades_data)

    ###get the grades and add to the dict
    grades_table = driver.find_element(By.XPATH, '/html/body/div/form/table[2]/tbody')
    rows = grades_table.find_elements(By.TAG_NAME, "tr")
    for row in range(len(rows)):
        index = row + 3
        if rows[row].find_element(By.XPATH, f'/html/body/div/form/table[1]/tbody/tr[{index}]/td[6]').text == ' ':
            add = 'no grade yet'
        else:
            add = rows[row].find_element(By.XPATH, f'/html/body/div/form/table[1]/tbody/tr[{index}]/td[6]').text
        dict[rows[row].find_element(By.XPATH, f'/html/body/div/form/table[1]/tbody/tr[{index}]/td[3]').text] = add
    return dict


####the dict will be used in the interface to display the grades
####similar functions will be used to get the schedule and the exams
####the functions will be called from the interface
####the interface will be created with fluuterflow? pretty easy to use (no code, just drag and drop basicly)
print(get_grades(sign_in(name, Id, pswrd)))
