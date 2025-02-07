const { exec } = require('child_process');

// Script de pós-deploy
exec('npm install && pm2 restart seu-app || pm2 start server.js --name seu-app', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
}); 