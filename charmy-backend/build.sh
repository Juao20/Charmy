#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Crée le compte admin s'il n'existe pas déjà (variables définies sur Render)
if [[ -n "$DJANGO_SUPERUSER_EMAIL" && -n "$DJANGO_SUPERUSER_PASSWORD" ]]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ['DJANGO_SUPERUSER_EMAIL']
password = os.environ['DJANGO_SUPERUSER_PASSWORD']

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(username=email, email=email, password=password)
    print(f'Superuser {email} créé.')
else:
    print(f'Superuser {email} existe déjà, on ne touche à rien.')
"
fi
