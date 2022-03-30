yarn run prebuild
yarn run build
cd ..
rm api.zip
zip -r api.zip api -x "api/node_modules/*"

sftp root@140.82.4.60 << 'ENDSFTP'
    put ./api.zip
ENDSFTP

ssh root@140.82.4.60   << 'ENDSSH'

sudo su
source ~/.nvm/nvm.sh
pm2 delete stealth-api-1
mv api/uploads uploads
rm -rf api
unzip api.zip
rm -rf api.zip
mv uploads api/uploads
cd api
yarn install
pm2 start --name stealth-api-1 yarn --interpreter bash  -- "start:prod"

ENDSSH
