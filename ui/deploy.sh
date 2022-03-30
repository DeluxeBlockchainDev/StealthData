rm .env.development
npm run build
cp envs/.env.prod .env
rm build.zip
zip -r build.zip build

sftp ubuntu@ec2-18-222-161-117.us-east-2.compute.amazonaws.com << 'ENDSFTP'
    put ./build.zip
ENDSFTP

ssh ubuntu@ec2-18-222-161-117.us-east-2.compute.amazonaws.com  << 'ENDSSH'

sudo su
rm -rf /var/www/build.zip
mv build.zip /var/www
cd /var/www
rm -rf html
unzip build.zip
mv build html

ENDSSH

cp envs/.env.local .env.development