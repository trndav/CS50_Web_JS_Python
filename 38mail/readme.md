### Send emails app - Single Page App

mail_user table does not create without first:
* python manage.py makemigrations mail
* python manage.py migrate --run-syncdb
Now all tables should work properly.