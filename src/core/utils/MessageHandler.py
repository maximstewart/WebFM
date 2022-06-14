# Gtk imports

# Python imports

# Application imports


class MessageHandler:
    def __init__(self):
        print("MessageHandler initialized...")


    def create_JSON_message(self, type, text):
        return '{"message": { "type": "' + type +  '", "text": "' + text + '" } }'
