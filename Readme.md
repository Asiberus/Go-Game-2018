# Go Game
## Web Project ESIEA - 2018
-----

Go Game Project est une Web Application permettant de jouer au jeu de plateau GO en ligne.
Le projet utilise les langages suivants :
- Python (Django framework)
- HTML/CSS
- JavaScript (Native)

### BACKEND : Django Python
Le choix du framework n'est pas très important dans l'utilisation d'une web app. L'ensemble des opérations se font en JS coté clients. J'ai choisi Django car, l'ayant déjà utilisé, j'ai pu créer un serveur Backend très rapidement.
La communication client-serveur se fait grâce au package Django Channels 2.
Trois types de communications sont présentes :
- System : pour les appels en BDD
- Lobby : pour la recherche d'adversaires en ligne
- Game : pour la transmission des données du jeu de Go

### FRONTEND : Native JavaScript
J'ai fait le choix de travailler sans framework pour deux raisons. La rapidité de l'application. Pas d'angular, pas de React, pas de JQuery qui ralentissent fortement l'expérience utilisateur. Seule les fonctions utiles à l'application sont présentes.
Travailler en Native JS permet de controller plus précisement son application. Je controle chaque partie de l'application et les erreur sont  débugués plus rapidement.

L'application suit une logique MVC. Voici un rapide descriptif de chaque fichier présent :
##### Controller
- Traite les informations à envoyer et à recevoir du serveur
- Traite les actions de l'utilsateur
- Communique avec le model
- Transmet les informations à afficher à la vue
##### Kommunicator
- Initialise la communication avec le serveur (WebSocket)
- Envois les données au serveur
- Reçois les données du serveur et appelle les fonctions du controller correspondantes
##### Model/Board Model
- Contient la logique du jeu de Go
##### View
Le fichier View communique avec chaque composants de l'application : Lobby, Chat, Board, Board Notification, etc
- Transmets les informations reçus du controller aux bons composants
- Récupère les actions utilisateurs : souris et clavier
 -----
# Comment configurer l'application
## Mise en place de l'environnement Backend
Il est nécessaire de posséder le logiciel Docker.
Il est ensuite nécessaire de posséder une version de Python supérieur à 3.0
#### Installation de Django

```
$ pip3 install django
```
#### Installation de Django-Channels 2
```
$ pip3 install -U channels
$ pip3 install channels_redis
```
#### Installation de Sass-Processeur
```
$ pip3 install libsass django-compressor django-sass-processor
```
## Lancement de l'application
Se placer dans le dossier contenant le fichier `manage.py`
Lancer la commande suivante :
```
$ docker run -p 6379:6379 -d redis:2.8
```
Puis
```
$ python3 manage.py runserver
```
Le serveur est bien lancé et vous pouvez accéder au site à l'adresse suivante `localhost:8000`

-----
Crédit : Raphael Beekmann | Version : 1.0 | 2018
