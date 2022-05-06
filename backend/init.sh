# make folder for virtual environment
mkdir .venv

# Install pipenv globally to initialize project venv
pip3 install pipenv --ignore-installed

# start the virtual environment and installs all dependencies
pipenv install

# Create .env file
touch ./apiserver/apiserver/.env
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

# Prints the instruction
echo -e "The setting of \u001b[32mpipenv, package,\u001b[0m and \u001b[36m.env file\u001b[0m is done."
echo -e "you can now run \u001b[33mpipenv shell\u001b[0m to enter the virtual environment."
echo -e "please execute django after editing the \u001b[36m.env file\u001b[0m."
echo -e "If an \u001b[31merror occured\u001b[0m in installing \u001b[32mmysqlclient\u001b[0m library, check \u001b[36mhttps://stackoverflow.com/questions/51062920/pip-install-mysqlclient-error \u001b[0m."
echo -e "you should do the following steps to start \u001b[31mdjango\u001b[0m:"
echo -e "1. execute \u001b[33mpipenv \u001b[34mshell\u001b[0m"
echo -e "2. execute \u001b[33mpython \u001b[35m./apiserver/manage.py \u001b[34mmigrate \u001b[0mto migrate the database"
echo -e "3. execute \u001b[33mpython \u001b[35m./apiserver/manage.py \u001b[34mrunserver \u001b[0mto start the server"