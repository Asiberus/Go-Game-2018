
from django.conf.urls import url
from . import consumers
# from consumers import LobbyConsumer

websocket_urlpatterns = [
    url(r'^ws/lobby/(?P<user_name>[^/]+)/$', consumers.Consumer),
]
