#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    SCRIPTPATH="$( cd "$(dirname "")" >/dev/null 2>&1 ; pwd -P )"
    cd "${SCRIPTPATH}"
    echo "Working Dir: " $(pwd)
    source "./venv/bin/activate"
    gunicorn wsgi:app -b 0.0.0.0:8080 -p app.pid # <module>:<app>   IE <file>:<flask app variable>
}
main $@;
