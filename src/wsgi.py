import eventlet
eventlet.monkey_patch()
#
# import eventlet.debug
# from engineio.payload import Payload
#
# # Some fixers for Websockets
# eventlet.debug.hub_prevent_multiple_readers(False)
# Payload.max_decode_packets = 120   # Fix too many small packets causing error

from core import app

if __name__ == '__main__':
    app.run()
