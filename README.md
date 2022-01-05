<div id="top"></div>
Live Project Link: https://oddamwdobrereceapp.herokuapp.com/


# Oddam-W-Dobre-Rece
A place where everyone can share their goods with trusted institutions
 
 
 ## Table of contents
* [Introduction](#introduction)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)

## Introduction
Create a space through the user
will be able to return easily and quickly
unwanted things to trusted institutions.
There are many solutions available, but 
many of them require additional effort or are 
mistrusted. You have to go to verified places, 
and the containers which are unverified and it is not known whether these things 
will actually go to those in need
	
![](demo/homepage.gif)
![](demo/profile-settings.gif)
![](demo/donation.gif)


## Technologies Used
* Python 3.8
* JavaScript
* Django 4.0
* PostgreSQL 2.9.2
* HTML
* CSS
* AWS RDS
* AWS S3
* Heroku
<p align="right">(<a href="#top">back to top</a>)</p>

## Features
A few of the things you can do with Oddam w Dobre Rece:
* Landing page to encourage the use of the application


* Administrator profile


* User profile
  - registration
  - logging in (the same form as for the administrator)
  - adding gifts
  - browsing, complex gifts


* Indication that the gift has been transferred (archiving)


* Editing your own profile
  - confirmation / activation of the account via a message to the e-mail address provided during registration
  - support for forgotten passwords
  - validation of correct input of two identical passwords
  - handling the contact form
  

<p align="right">(<a href="#top">back to top</a>)</p>

## Setup
- _To run this project, you need to install [Django](https://docs.djangoproject.com/en/4.0/intro/) then create and active virtual environment_
```
$ python3 -m venv env
```
- _Clone repo and install packages in requirements.txt_ 
```
$ git clone https://github.com/fortyfortyy/Oddam-W-Dobre-Rece.git
$ cd ../Oddam-W-Dobre-Rece
$ pip install requirements.txt
```
<p align="right">(<a href="#top">back to top</a>)</p>

- _Next_
1. Get a free Security Key at [https://djecrety.ir/](https://djecrety.ir/)
   
2. Enter your SECRET_KEY in `settings.py`
   ```py
   SECRET_KEY = 'ENTER YOUR API'
   ```
3. Run the project in project terminal
   ```
   python3 manage.py runserver
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Email -  d.pacek1@gmail.com

Live Project Link: https://oddamwdobrereceapp.herokuapp.com/

<p align="right">(<a href="#top">back to top</a>)</p>
