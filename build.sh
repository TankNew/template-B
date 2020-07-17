#!/bin/zsh
echo "Start Build !"
work_path=$(dirname $(readlink -f $0))
cd ${work_path}

# 生成最新的主题
node theme.js
# 编译成CSS

for theme in ${work_path}/assets/css/theme*
do
    # echo $theme
    lessc $theme static/css/${${theme%.*}##*/}.css
done

docker build -t docker.ednet.cn/template-b .
 
# 更新docker
docker-compose up --build --no-deps -d template-b
docker-compose up --build --no-deps -d yhxx
docker-compose up --build --no-deps -d tjhxcw
docker rmi $(docker images -f "dangling=true" -q)
