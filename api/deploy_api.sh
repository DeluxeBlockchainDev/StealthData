yarn run prebuild
yarn run build
cd ..
rm api.zip
zip -r api.zip api -x "api/node_modules/*"

sftp ubuntu@ec2-18-222-161-117.us-east-2.compute.amazonaws.com  << 'ENDSFTP'
    put ./api.zip
ENDSFTP

ssh ubuntu@ec2-18-222-161-117.us-east-2.compute.amazonaws.com   << 'ENDSSH'

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
pm2 start --name stealth-api-1 npm -- run start:prod
ENDSSH
