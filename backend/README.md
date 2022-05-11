# Cloud programming team assignments
After you cloned main project, you should run init.sh(in windows init.ps1) to initialize the project.

these shell script will install some dependencies for project, initialize virtual environment, and create .env file to save critical data.

Follow the instructions that script prints after initializtion ends.

## Required Dependencies
- Python(after version 3)
- Pyenv(to install the python version that might not be installed in your local environment)
- Pipenv(python's dependency/virtual environment manager. script will install automatically, but if PATH messed up you should install manually)

## manage.py command
check [Django's manage.py references](https://docs.djangoproject.com/en/4.0/ref/django-admin/) for available commands.

# 클라우드 프로그래밍 팀 프로젝트 과제
메인 프로젝트 clone 후에, 반드시 init.sh(windows 환경에서는 init.ps1)을 실행해서 프로젝트의 초기 설정을 완료하시기 바랍니다.

이 스크립트들은 프로젝트에 필요한 의존성을 설정하고, 가상 환경을 생성한 뒤 프로젝트에서 민감한 정보들을 저장할 .env 파일을 생성할 것입니다.

초기화가 끝난 뒤에는, 스크립트가 출력한 안내문을 따르십시오.

## 프로젝트 실행 전 필요한 의존성
- Python(버전 3 이상)
- Pyenv(로컬에 설치되어 있지 않을 수도 있는 Python 버전을 사용하기 위한 파이썬 버전 매니저)
- Pipenv(Python의 의존성 관리/가상환경 제어 프로그램. init 스크립트가 스스로 설치하지만, 만약에 PATH 환경 변수에 에러가 있다면 스스로 설치해줘야 함)

## manage.py 명령어
[Django manage.py 문서](https://docs.djangoproject.com/en/4.0/ref/django-admin/)에서 사용 가능한 명령어들을 찾아 보시기 바랍니다.