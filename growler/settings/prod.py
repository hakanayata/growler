from .base import *

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config("SQL_DBNAME"),
        'USER': config("SQL_USERNAME"),
        'PASSWORD': config("SQL_PASSWORD"),
        'HOST': config("SQL_HOST"),
    }
}
