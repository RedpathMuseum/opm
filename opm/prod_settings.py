"""
Import shared settings
"""
try:
    from .shared_settings import *
except ImportError as e:
    pass

"""
Define production settings
"""

DEBUG = False

# Note different secret key for dev and prod
SECRET_KEY = '#^7e0hqlf+antm=8r0_fo7n3!fqhl__4hzqzy+#lk^zt81ooba'

STATIC_ROOT = "/var/www/3d.redpath.mamss.ca/public/static/"
MEDIA_ROOT = '/var/www/opm/public/media/'


ALLOWED_HOSTS = [
    '.3d.redpath.mamss.ca',
    '.3d.redpath.mamss.ca',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'the_mamss_redpath_db',                         # Or path to database file, if using sqlite3.
        'USER': 'tfmenard',                               # Not used in sqlite3.
        'PASSWORD': 'outremont',                         # Not used in sqlite3.
        'HOST': 'mysql.db.mamss.ca',                    # Set to empty string for localhost. Not used in sqlite3.
        'PORT': '',                                     # Set to empty string for default. Not used in sqlite3.
    }
}

# TODO: Change to actual admin.
ADMINS = (('Thomas', 'thomas.faribault-menard@mail.mcgill.ca'),)
MANAGERS = ADMINS