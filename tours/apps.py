from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class ToursConfig(AppConfig):
    name = 'tours'

    def ready(self):
        import tours.signals
