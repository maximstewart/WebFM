#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    SCRIPTPATH="$( cd "$(dirname "")" >/dev/null 2>&1 ; pwd -P )"
    echo "Working Dir: " $(pwd)
    source "../venv/bin/activate"

    LOG_LEVEL=error
    WORKER_COUNT=1
    TIMEOUT=120

    # <module>:<app>   IE <file>:<flask app variable>
    gunicorn wsgi:app -p app.pid -b unix:/tmp/app.sock \
                                -k eventlet \
                                -w $WORKER_COUNT \
                                --timeout $TIMEOUT \
                                --log-level $LOG_LEVEL
}
main $@;
