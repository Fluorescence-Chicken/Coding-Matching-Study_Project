# make folder for virtual environment
mkdir .venv

# Install pipenv globally to initialize project venv
pip install pipenv --ignore-installed

# start the virtual environment and installs all dependencies
pipenv install

# create .env file
echo '# server basic settings' > ./apiserver/apiserver/.env
echo 'SECRET_KEY = "your_secret_key_here"' >> ./apiserver/apiserver/.env
echo 'TIME_ZONE = "Asia/Seoul"' >> ./apiserver/apiserver/.env
echo 'LANGUAGE_CODE = "ko-kr"' >> ./apiserver/apiserver/.env
echo '' >> ./apiserver/apiserver/.env
echo '# database connection settings' >> ./apiserver/apiserver/.env
echo 'DB_HOST = "your_db_host_here"' >> ./apiserver/apiserver/.env
echo 'DB_PORT = "3306"' >> ./apiserver/apiserver/.env
echo 'DB_USER = "your_db_username_here"' >> ./apiserver/apiserver/.env
echo 'DB_PASSWORD = "your_db_password_here"' >> ./apiserver/apiserver/.env
echo 'DB_NAME = "your_database_here"' >> ./apiserver/apiserver/.env
echo '' >> ./apiserver/apiserver/.env
echo '# production mode settings' >> ./apiserver/apiserver/.env
echo 'DEBUG = True' >> ./apiserver/apiserver/.env

# prints the instruction
Write-Output "The setting of [32mpipenv, package,[0m and [36m.env file[0m is done."
Write-Output "you can now run [33mpipenv shell[0m to enter the virtual environment."
Write-Output "please execute django after editing the [36m.env file[0m."
Write-Output "you should do the following steps to start [31mdjango[0m:"
Write-Output "1. execute [33mpipenv [34mshell[0m"
Write-Output "2. execute [33mpython [35m./apiserver/manage.py [34mmigrate [0mto migrate the database"
Write-Output "3. execute [33mpython [35m./apiserver/manage.py [34mrunserver [0mto start the server"