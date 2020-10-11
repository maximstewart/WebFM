# Gtk imports

# Python imports

# Application imports


class MessageHandler:
    def __init__(self):
        pass


    def createMessageJSON(self, type, text, id=None):
        print("Returning message...")
        try:
            int(id)
            return '{"message": { "type": "' + type +  '", "text": "' + text + '", "id":"' + str(id) + '" } }'
        except Exception as e:
            return '{"message": { "type": "' + type +  '", "text": "' + text + '" } }'
