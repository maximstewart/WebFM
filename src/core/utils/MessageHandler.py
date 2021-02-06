# Gtk imports

# Python imports

# Application imports


class MessageHandler:
    def __init__(self):
        print("MessageHandler initialized...")


    def createMessageJSON(self, type, text):
        return '{"message": { "type": "' + type +  '", "text": "' + text + '" } }'
