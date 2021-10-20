@echo off
cd /d %~dp0

dir /b /s *.zip>%~dp0zips.txt

for /f %%a in (%~dp0zips.txt) do (
powershell -command "Expand-Archive -Path %%a -DestinationPath %%~na"
)