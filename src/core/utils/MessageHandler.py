# Python imports
import json

# Lib imports

# Application imports



class MessageHandler:
    def __init__(self):
        print("MessageHandler initialized...")


    def create(self, type, text):
        return '{"message": { "type": "' + type +  '", "text": "' + text + '" } }'

    def backgrounds(self, files):
        return '{ "backgrounds": ' + json.dumps(files) + '}'

    def thumbnails(self, files):
        return '{ "thumbnails": ' + json.dumps(files) + '}'

    def faves_list(self, faves):
        return '{"faves_list":' + json.dumps(faves) + '}'
