import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1']) + ['.railway.app']

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
    'apps.accounts',
    'apps.relations',
    'apps.conversations',
    'apps.ai',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← fichiers statiques
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Base de données
DATABASES = {
    'default': env.db('DATABASE_URL')
}

# Auth
AUTH_USER_MODEL = 'accounts.User'
AUTHENTICATION_BACKENDS = ['apps.accounts.backends.EmailBackend']

# CORS
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    'http://localhost:5173',
])

# capacitor
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^capacitor://.*$',
    r'^https://localhost.*$',
]

# JWT
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CSRF_TRUSTED_ORIGINS = [
    'https://charmy-production.up.railway.app',
    'https://charmy-psi.vercel.app',
]

FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:5173')

# Fichiers statiques
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Médias — Cloudinary en prod, local en dev
# if env('CLOUDINARY_URL', default=None):
#     DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
#     CLOUDINARY_STORAGE = {'CLOUDINARY_URL': env('CLOUDINARY_URL')}
# else:
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# LEMONSQUEEZY
LEMONSQUEEZY_API_KEY = env('LEMONSQUEEZY_API_KEY')
LEMONSQUEEZY_STORE_ID = env('LEMONSQUEEZY_STORE_ID')
LEMONSQUEEZY_WEBHOOK_SECRET = env('LEMONSQUEEZY_WEBHOOK_SECRET')
LEMONSQUEEZY_VARIANT_MONTHLY = env('LEMONSQUEEZY_VARIANT_MONTHLY')
LEMONSQUEEZY_VARIANT_YEARLY = env('LEMONSQUEEZY_VARIANT_YEARLY')
LEMONSQUEEZY_VARIANT_PACK = env('LEMONSQUEEZY_VARIANT_PACK')

# Groq
GROQ_API_KEY = env('GROQ_API_KEY')

# Sécurité prod
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
PROJECT_NAME = 'Charmy'