@echo off
title Dead End Survival v0.3.4
cd /d "%~dp0"
start "" http://localhost:8080
python -m http.server 8080
