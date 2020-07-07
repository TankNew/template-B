# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
 
# Mvc
Set-Location $buildFolder
docker build -t docker.ednet.cn/template-b .
 
# 更新docker
Set-Location ~
docker-compose up --build --no-deps -d template-b
docker-compose up --build --no-deps -d yhxx
docker rmi $(docker images -f "dangling=true" -q)
## FINALIZE ###################################################################

Set-Location $buildFolder