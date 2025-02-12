source /root/.bashrc

tar -zvxf dist.tar.gz
yes | cp -rf configs/production.js env.js

if $1 eq true
then
        npm install
fi


if [ "$2" = "" ]
then
        echo 'version commont needed'
        exit 1
else
        npm run build
        { # try
                pm2 restart wap_nuxt
        }||{ # catch
                pm2 start /root/.nvm/versions/node/v10.14.2/bin/npm --name="wap_nuxt" -- run start
        }
fi
