# -*- coding: utf-8 -*-
"""
Created on Sun Sep  2 19:16:13 2018

@author: June

Title: PostgreSQL DB class. This class will connect to database and then
create, insert, and manipulate using multiple variables.
"""
import psycopg2
#%%
import numpy as np
import matplotlib.pyplot as plt
#%%
#Creating class for postgres database
class postgresDB:
    
    def __init__(self, user, password, dbname):
        
        #saving as class variables
        self.dbname = dbname
        self.user = user
        self.password = password
        
        #Connecting to the database as the user.
        self.conn = psycopg2.connect(dbname=self.dbname, user=self.user, password=self.password) 
        self.cursor = self.conn.cursor()
    
    def insert(self, table_name, variables, num_var, *args):
        
        #Adding database and variable name make SQL language
        sql_variables = table_name + " " + variables
        
        #Number of variables for SQL.
        sql_nvar = "("
        for i in range(num_var):
            sql_nvar += "%s, "
        sql_nvar = sql_nvar[:-2]
        sql_nvar += ")"
            
        #Translating into SQL language to insert variables.
        sql_lang = "INSERT INTO " + sql_variables + " VALUES " + sql_nvar
        self.cursor.execute(sql_lang, args)
    
    def select_all(self, table_name):
        
        #Selecting every variable from table
        sql_lang = 'SELECT * FROM "{0}";'.format(table_name)
        self.cursor.execute(sql_lang)
        
        return self.cursor.fetchall()
    
    def commit(self):
        
        #commiting
        self.conn.commit()
    
    def close(self):
        
        #Closing connect to the database.
        self.cursor.close()
        self.conn.close()
#%%

c_provinces = ['Incest_Alberta', 'Incest_British Columbia', 'Incest_Manitoba', 'Incest_New_Brunswick', 'Incest_Newfoundland_Labrador', 'Incest_Nova_Scotia', 'Incest_Ontario', 'Incest_Prince_Edward_Island', 'Incest_Quebec', 'Incest_Saskatchewan', 'Incest_Canada']
incest_data = {}
for i in range(len(c_provinces)):
    
    #Connecting to the database as postgres user
    Test = postgresDB('postgres', 'j10013500t95', 'Incident_Crime_Rate_CA')
    
    #Title of the graph
    title = c_provinces[i]
    
    #Save as a list
    incest_data[title] = Test.select_all(c_provinces[i])
#%%
#Sorting data from truple
yearly = {}
values = {}
for i in range(len(c_provinces)):
    
    #Dynamic variable name
    year = c_provinces[i] + " Year"
    charges = c_provinces[i] + " Charges"
    
    #Saving it as dictionary
    yearly[year] = list(zip(*incest_data[c_provinces[i]]))[0]
    values[charges] = list(zip(*incest_data[c_provinces[i]]))[4]
#%%
#Changing None value into integer 0.
for i in range(11):
    values[list(values)[i]] = [ 0 if v is None else v for v in values[list(values)[i]]]
#%%
#showing all 11 graphs on top of each others
plt.bar(yearly["Incest_Alberta Year"], values["Incest_Alberta Charges"], color='blue')
plt.bar(yearly["Incest_British Columbia Year"], values["Incest_British Columbia Charges"], color = 'red')
plt.show