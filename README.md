# d3-allstars-wins
INFO 474 Assignment 3:  
Creates an interactive visualization comparing all Major Leage Baseball teams' wins and the number of all stars they have. The data used is sourced from http://www.seanlahman.com/baseball-archive/statistics/

## Database setup for your local machine

1. Start up mysql  
  `$ mysql -u root -p`
2. Create the database  
  `mysql> CREATE DATABASE baseball`
3. Add the data into the database  
  `$ mysql -u root -p baseball < baseball.sql `  
  Be sure that you are in the project directory for the specified path to work.
