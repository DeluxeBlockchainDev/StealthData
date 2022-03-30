rm .env.development
npm run build
cp envs/.env.prod .env
rm build.zip
zip -r build.zip build

sftp root@140.82.4.60 << 'ENDSFTP'
    put ./build.zip
ENDSFTP

ssh root@140.82.4.60  << 'ENDSSH'

sudo su
rm -rf /var/www/build.zip
mv build.zip /var/www
cd /var/www
rm -rf html
unzip build.zip
mv build html

ENDSSH

cp envs/.env.local .env.development