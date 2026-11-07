const http = require('http');
const { spawn } = require('child_process');

function checkViteReady(callback) {
  const req = http.get('http://localhost:5173', (res) => {
    if (res.statusCode === 200 || res.statusCode === 304) {
      callback();
    } else {
      setTimeout(() => checkViteReady(callback), 500);
    }
  });

  req.on('error', () => {
    setTimeout(() => checkViteReady(callback), 500);
  });
}

console.log('Waiting for Vite development server on port 5173...');
checkViteReady(() => {
  console.log('Vite server detected! Launching Electron...');
  const electronProcess = spawn('npx', ['electron', '.'], {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  });

  electronProcess.on('close', (code) => {
    process.exit(code || 0);
  });
});
