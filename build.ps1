# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
 
# Mvc
Set-Location $buildFolder
docker build -t docker.ednet.cn/blue .
 
# 更新docker
Set-Location ~
docker-compose up --build --no-deps -d blue
docker rmi $(docker images -f "dangling=true" -q)
## FINALIZE ###################################################################

Set-Location $buildFolder