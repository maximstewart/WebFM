#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    SCRIPTPATH="$( cd "$(dirname "")" >/dev/null 2>&1 ; pwd -P )"
    cd "${SCRIPTPATH}"
    echo "Working Dir: " $(pwd)
    source "./venv/bin/activate"
    mkdir /tmp/apps
    gunicorn --bind unix:/tmp/apps/webfm.sock wsgi:app -p app.pid

}
main $@;
