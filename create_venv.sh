#!/bin/bash

. CONFIG.sh

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    rm -rf venv/

    clear
    python -m venv venv/
    sleep 2
    source "./venv/bin/activate"

    ANSR="-1"
    while [[ $ANSR != "0" ]] && [[ $ANSR != "1" ]] &&  [[ $ANSR != "2" ]]; do
        clear
        menu_mesage
        read -p "--> : " ANSR
    done
    case $ANSR in
        "1" ) pip install -r linux-requirements.txt;;
        "2" ) pip install -r windows-requirements.txt;;
        "0" ) exit;;
        * ) echo "Don't know how you got here but that's a bad sign...";;
    esac
}

function menu_mesage() {
    echo "NOTE: Make sure to have Python 3 installed!"
    echo -e "\nWhat do you want to do?"
    echo -e "\t1) Generate Linux/Mac supported venv. (Installs Repuirements)"
    echo -e "\t2) Generate Windows supported venv. (Installs Repuirements)"
    echo -e "\t0) EXIT"
}

main $@;
