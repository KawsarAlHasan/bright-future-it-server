// ssh root@82.112.238.74
// W3CoinHosting@2024

// sudo apt update && sudo apt upgrade -y

// sudo apt install git -y

//  curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
//  sudo apt install -y nodejs

// sudo npm install -g pm2

// git clone https://github.com/KawsarAlHasan/bright-future-it-server.git

// cd bright-futureit-server
// npm install

// pm2 start index.js --name "bright-future-it-server"

// sudo nano /etc/nginx/sites-available/bright-futureit.com

// server {
//     listen 80;
//     server_name api.bright-futureit.com;

//     location / {
// proxy_pass http://localhost:3000;
// proxy_http_version 1.1;
// proxy_set_header Upgrade $http_upgrade;
// proxy_set_header Connection 'upgrade';
// proxy_set_header Host $host;
// proxy_cache_bypass $http_upgrade;
//     }
// }

// server {
//     listen 80;
//     root /var/www/html;

//     index index.html index.htm index.nginx-debian.html;

//             server_name api.bright-futureit.com www.api.bright-futureit.com;

//             location / {

//                     proxy_pass http://localhost:4173;

//                     proxy_http_version 1.1;

//                     proxy_set_header Upgrade $http_upgrade;

//                     proxy_set_header Connection 'upgrade';

//                     proxy_set_header Host $host;

//                 proxy_cache_bypass $http_upgrade;

//             }

// }

// pm2 restart index.js
// pm2 reload index.js
// sudo systemctl restart nginx
// /root/bright-future-it-fontend/dist
// ln -s /etc/nginx/sites-available/yourDomain.com /etc/nginx/sites-enabled/yourDomain.com

// sudo ln -s /etc/nginx/sites-available/bright-futureit.com /etc/nginx/sites-enabled/bright-futureit.com
// sudo nginx -t
// sudo systemctl restart nginx

// npm run preview -- --host
// pm2 start npm --name "bright-futer-it-fontend" -- run preview

// error
// e: WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
// s: nano /c/Users/ASUS/.ssh/known_hosts
// এরপর, 82.112.238.74 সার্ভারের পুরানো কীটি ফাইল থেকে মুছে ফেলুন। এই ক্ষেত্রে, লাইনে উল্লেখ করা আছে Offending ECDSA key in /c/Users/ASUS/.ssh/known_hosts:6, অর্থাৎ, লাইনের ৬ নম্বরটি মুছে ফেলতে হবে।
