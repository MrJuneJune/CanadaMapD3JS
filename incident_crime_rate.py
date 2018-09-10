# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.

Author: June Park

Description: Understanding correlation between weathter and crime or different variables using 
goverment published data of canadian crime statstics.
"""
#%%
#Importing Libs
import pandas as pd
import requests
from bs4 import BeautifulSoup
#%%
#Importing Data
ICR_data = pd.read_csv('ICR.csv', low_memory=False, encoding="utf-8-sig")
#%%
#Show pandas options
pd.set_option('display.max_rows',1000)
pd.set_option('display.max_column', 1000)
pd.set_option('display.max_colwidth', 1000)
pd.set_option('display.width', None)
#%%
#google search location weather
class Weather:
    def __init__(self, location):
        self.location = location        
        self.url = "https://www.google.com/search?q={0}+{1}&sorce=lnms&sa=x".format(self.location,'yearly+temperature')
    def get_table (self):
        response = requests.get(self.url)
        self.soup = BeautifulSoup(response.text, "html.parser")
        self.table = self.soup.find_all("div", {"aria-label": "Weather averages by month"})
    def get_content (self):
        for row in self.table:
            self.M_T_R = row.find_all("div", {"class": "wClspb"})
#%%
#Reading Data
#Actual incident by province
AC_by_province = ICR_data[(ICR_data['Statistics'] == 'Actual incidents')&(ICR_data['GEO'] != 'Canada')]
#%%
#From actual incident getting Criminal Code violations including traffics
CCV_bp = AC_by_province[AC_by_province['Violations'] == 'Total, all Criminal Code violations (including traffic)']
#From actual incident getting Criminal Code violations excluding traffics
CCVET_bp = AC_by_province[AC_by_province['Violations'] == 'Total, all Criminal Code violations (excluding traffic)']
#%%
#Creating new dataset for temperature.
#Grabbing GEO column
All_GEO = CCV_bp[['GEO']]
row, col = All_GEO.shape
locations = []
exclude = "0123456789[]/"
for i in range(row):
    location = All_GEO.iloc[i]
    location_str = location[0]
    for char in exclude:
        location_str = location_str.replace(char,"")
    locations.append(location_str)

#Eliminate repetitions    
locations = set(locations)
#Change back to list.
locations = list(locations)
#%%

#%%

