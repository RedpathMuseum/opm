"""
Import shared settings
"""
try:
    from .shared_settings import *
except ImportError as e:
    pass

"""
Define development settings
"""

from os import path
BASE_DIR = path.dirname(path.abspath(path.dirname(__file__)))

DEBUG = True


MEDIA_ROOT = os.path.join(BASE_DIR, "media/")

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'collected_static/')
# Note different secret key for dev and prod
SECRET_KEY = '#^7e0hqlf+antm=8r0_fo7n3!fqhl__4hzqzy+#lk^zt81ooba'

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': path.join(BASE_DIR, 'db.sqlite3'),
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}