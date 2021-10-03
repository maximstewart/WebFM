#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    SCRIPTPATH="$( cd "$(dirname "")" >/dev/null 2>&1 ; pwd -P )"
    echo "Working Dir: " $(pwd)
    source "../venv/bin/activate"

    LOG_LEVEL=warn
    WORKER_COUNT=1
    ADDR=127.0.0.1
    PORT=6969
    TIMEOUT=120

    # Note can replace 127.0.0.1 with 0.0.0.0 to make it 'network/internet' accessable...
    # Note: NEED -k eventlet for this to work! I spent too many hours on this...
    # <module>:<app>   IE <file>:<flask app variable>
    gunicorn wsgi:app -p app.pid -b $ADDR:$PORT \
                                -k eventlet \
                                -w $WORKER_COUNT \
                                --timeout $TIMEOUT \
                                --log-level $LOG_LEVEL
}
main $@;
