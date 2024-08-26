// ssh root@82.112.238.74
// W3CoinHosting@2024

// sudo apt update && sudo apt upgrade -y

//  curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
//  sudo apt install -y nodejs

// sudo npm install pm2 -g

// git clone https://github.com/KawsarAlHasan/bright-future-it-server.git

// cd bright-futureit-server
// npm install

// sudo nano /etc/nginx/sites-available/api.bright-futureit.com

// server {
//     listen 80;
//     server_name api.bright-futureit.com;

//     location / {
//         proxy_pass http://localhost:3000;
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection 'upgrade';
//         proxy_set_header Host $host;
//         proxy_cache_bypass $http_upgrade;
//     }
// }

// pm2 restart index.js
// pm2 reload index.js
// sudo systemctl restart nginx

// sudo ln -s /etc/nginx/sites-available/subdomain.yourdomain.com /etc/nginx/sites-enabled/
// sudo nginx -t
// sudo systemctl restart nginx

// error
// e: WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
// s: nano /c/Users/ASUS/.ssh/known_hosts
// এরপর, 82.112.238.74 সার্ভারের পুরানো কীটি ফাইল থেকে মুছে ফেলুন। এই ক্ষেত্রে, লাইনে উল্লেখ করা আছে Offending ECDSA key in /c/Users/ASUS/.ssh/known_hosts:6, অর্থাৎ, লাইনের ৬ নম্বরটি মুছে ফেলতে হবে।
