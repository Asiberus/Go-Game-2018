from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import User




import json

class Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_name = self.scope['url_route']['kwargs']['user_name']
        await self.accept()

        if await database_sync_to_async(self.is_connected)(self.user_name):
            await self.send(text_data=json.dumps({
                'target': 'system',
                'type': 'name_already_taken'
            }))
        else:
            await self.channel_layer.group_add(
                'lobby',
                self.channel_name
            )

            await self.send(text_data=json.dumps({
                'target': 'system',
                'type': 'connect_succesful'
            }))

            await database_sync_to_async(self.add_user)(self.user_name, self.channel_name)
            list_user = await database_sync_to_async(self.get_all_users_connected)()
            await self.channel_layer.group_send('lobby', {
                'target': 'lobby',
                'type': 'lobby_connect',
                'userName': self.user_name,
                'listUser': list_user
            })


    async def disconnect(self, close_code):
        ##Close code 3000 : name already taken
        if close_code != 3000:
            await database_sync_to_async(self.remove_user)(self.user_name)
            list_user = await database_sync_to_async(self.get_all_users_connected)()
            await self.channel_layer.group_send('lobby', {
                    'target': 'lobby',
                    'type':'lobby_disconnect',
                    'userName': self.user_name,
                    'userID': self.channel_name,
                    'listUser': list_user
                }
            )

            await self.channel_layer.group_discard(
                'lobby',
                self.channel_name
            )

###################### Connect/Disconnect send functions ############################

    async def lobby_connect(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'notification',
            'notificationType': 'lobby_connect',
            'userName': event['userName'],
            'listUser': event['listUser']
        }))

    async def lobby_disconnect(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type':'notification',
            'notificationType': 'lobby_disconnect',
            'userName': event['userName'],
            'userID': event['userID'],
            'listUser': event['listUser']
        }))

######################################################################################
#################################  Receive function ##################################
######################################################################################

    async def receive(self, text_data):
        raw_data = json.loads(text_data)
        target_function = "receive_%s" % raw_data['target']

        if hasattr(self, target_function):
            await getattr(self, target_function)(raw_data)
        else:
            print("Error in target")

#####################################################################################
#########################   System receive function #################################

    async def receive_system(self, raw_data):
        function = raw_data['function_to_call']
        args = json.loads(raw_data['args'])

        if hasattr(self, function):
            await getattr(self, function)(args)
        else:
            print("Error in system function")


    async def set_bdd_in_game(self, args):
        await database_sync_to_async(self.set_is_in_game)(self.channel_name, bool(int(args['isInGame'])))


#####################################################################################
#########################   Lobby receive functions #################################

    async def receive_lobby(self, raw_data):
        is_group = raw_data['group']

        if bool(int(is_group)):
            await self.receive_lobby_group(raw_data)
        else:
            await self.receive_lobby_single(raw_data)


    async def receive_lobby_group(self, raw_data):
        type = raw_data['type']

        await self.channel_layer.group_send('lobby', {
            'target': 'lobby',
            'type': type,
            'data': raw_data['data']
        })

    async def receive_lobby_single(self, raw_data):
        destination_channel = raw_data['destination_channel']
        type = raw_data['type']

        await self.channel_layer.send(destination_channel, {
            'target': 'lobby',
            'type': type,
            'enemyID': self.channel_name,
            'data': raw_data['data']
        })

#########################   Lobby send functions #################################

    ######################### Group send functions

    async def lobby_chat_msg(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'lobby_chat_msg',
            'userName': data['userName'],
            'message': data['message']
        }))

    async def refresh_list_user(self, event):
        list_user = await database_sync_to_async(self.get_all_users_connected)()

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'refresh_list_user',
            'listUser': list_user
        }))

    async def game_started(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'game_started',
            'user1': data['user1'],
            'user2': data['user2']
        }))

    async def game_finished(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'game_finished',
            'winner': data['winner'],
            'loser': data['loser'],
            'draw': data['draw']
        }))

    ######################### Single send functions

    async def game_request(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type':'game_request',
            'enemyID': event['enemyID'],
            'enemyName': data['userName']
        }))

    async def accept_game_request(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'accept_game_request',
            'enemyID': event['enemyID']
        }))

    async def confirm_game_request(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'confirm_game_request',
        }))

    async def error_game_request(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'error_game_request',
            'errorType': data['errorType'],
            'enemyName' : data['userName']
        }))


#####################################################################################
#########################   Game receive functions ##################################

    async def receive_game(self, raw_data):
        destination_channel = raw_data['destination_channel']
        type = raw_data['type']

        await self.channel_layer.send(destination_channel, {
            'target': 'game',
            'type': type,
            'data': raw_data['data']
        })


############################   Game send functions ##################################

    async def game_chat_msg(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'game_chat_msg',
            'userName': data['userName'],
            'message': data['message']
        }))

    async def set_color(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'set_color',
            'color': data['color']
        }))

    async def end_of_turn(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'end_of_turn',
            'newBoard': data['newBoard']
        }))

    async def hover_cell(self, event):
        data = json.loads(event['data'])

        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': 'hover_cell',
            'i': data['i'],
            'j': data['j'],
            'color': data['color']
        }))

    async def enemy_pass(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': event['type']
        }))

    async def end_of_game(self, event):
        await self.send(text_data=json.dumps({
            'target': event['target'],
            'type': event['type']
        }))


######################################################################################
################################  Database function ##################################
######################################################################################


    def add_user(self, userName, channel_name):
        User(name = userName, channel_id=channel_name).save()

    def remove_user(self, userName):
        if bool(User.objects.filter(name=userName).count()):
            User.objects.get(name=userName).delete()

    def set_is_in_game(self, _channel_id, _isInGame):
        user = User.objects.get(channel_id=_channel_id)
        user.isInGame = _isInGame
        user.save()

    def is_connected(self, userName):
        return bool(User.objects.filter(name=userName).count())

    def get_all_users_connected(self):
        list = []
        for user in User.objects.filter(isInGame=False):
            list.append({'name':user.name, 'channel_id':user.channel_id})
        return list
