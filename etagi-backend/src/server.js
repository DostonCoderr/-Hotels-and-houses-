const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/db');

async function start() {
  try {
    // Baza ulanishini tekshirish
    await prisma.$connect();
    console.log('✅ База подключена');

    app.listen(env.port, () => {
      console.log(`\n🚀 Сервер запущен: http://localhost:${env.port}`);
      console.log(`📊 Режим: ${env.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${env.port}/api`);
      console.log(`💚 Health: http://localhost:${env.port}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Сервер не запустился:', err.message);
    process.exit(1);
  }
}

start();