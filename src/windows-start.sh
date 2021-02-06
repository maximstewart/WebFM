#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    source "../venv/Scripts/activate"
    # Note: Can replace 127.0.0.1 with 0.0.0.0 to make it 'network/internet' accessable...
    # Note 2: Keycloak uses 8080. Change it or keep this as is.
    waitress-serve --listen=127.0.0.1:6969  wsgi:app # <module>:<app>   IE <file>:<flask app variable>
}
main $@;
