#!/bin/bash

if [ $1 = "dev" ]; then
	eval "python3 manage.py runserver"
	eval "npx webpack --watch"
fi
