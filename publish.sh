#!/bin/sh
rsync -avzrP dist/* ~/www/renji/renji-api/public/web1/ --delete
