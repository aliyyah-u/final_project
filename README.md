# final_project
My final year project at university, a Django web application.

Folder structure: 
Front-end pages are coded on the html pages under the 'templates' folder
Back-end logic and logo image is under the 'static'folder
The rest of the files are django generated files which have been modified according to the project's required settings, or required scripts. Python files are important to setup APIs and project setup.

Note that this project was created in local virtual environment final_project_venv
Inside the venv is the my_final_project folder which has the 'biswas_agro' app inside

View hosted version of product at this URL: https://aliyyah.eu.pythonanywhere.com/admin/

    Admin dummy login: 
    Username: Aliyyah
    Password: Password

    Staff (basic user) dummy login:
    Username: Staff
    Password: Password

Use the dummy logins to test the hosted version.

Find github repo here: https://github.com/aliyyah-u/final_project

Local Installation Instructions (if required): 
This app was built and tested using a local Python virtual environment (final_project_venv) and uses a MariaDB/MySQL backend. Setting this up locally may require extra configuration.

1. Clone repo to local machine
2. Create and activate virtual env
3. Install required packages using requirements.txt
4. Apply migrations to setup database
5. Setup XAMPP and make sure to swap mariaDB file with most recent version. Then run the apache and mysql servers
6. Access the app in your browser at http://127.0.0.1:8000/admin/

If local setup fails, please use the hosted version and dummy logins to test features. This is challenging since the latest version of Django does not work on XAMPP without fixing the mariaDB inside the program file. A simple stack overflow search has the (extensive) solution.