const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * 使用 .env.example 文件启动 React 应用
 * 这个脚本会读取 .env.example 并将其作为环境变量传递给 React Scripts
 */

function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      // 跳过注释和空行
      if (line.trim() === '' || line.trim().startsWith('#')) {
        return;
      }
      
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // 移除引号
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error(`❌ 无法读取 ${filePath}:`, error.message);
    return {};
  }
}

function startWithEnvFile(envFile, command = 'start') {
  console.log(`🔧 使用 ${envFile} 配置运行 React 应用...`);
  
  // 检查文件是否存在
  if (!fs.existsSync(envFile)) {
    console.error(`❌ 文件 ${envFile} 不存在`);
    process.exit(1);
  }
  
  // 加载环境变量
  const envVars = loadEnvFile(envFile);
  console.log(`📋 已加载 ${Object.keys(envVars).length} 个环境变量`);
  
  // 合并环境变量
  const env = {
    ...process.env,
    ...envVars
  };
  
  // 启动 React Scripts
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  
  console.log(`🚀 执行命令: npm run ${command}`);
  
  const child = spawn(npmCmd, ['run', command], {
    env,
    stdio: 'inherit',
    shell: isWindows
  });
  
  child.on('close', (code) => {
    console.log(`\n✅ 进程退出，退出码: ${code}`);
    process.exit(code);
  });
  
  child.on('error', (error) => {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  });
}

// 命令行参数处理
const args = process.argv.slice(2);
const envFile = args[0] || '.env.example';
const command = args[1] || 'start';

// 支持的命令
const supportedCommands = ['start', 'build', 'test'];

if (!supportedCommands.includes(command)) {
  console.error(`❌ 不支持的命令: ${command}`);
  console.log(`支持的命令: ${supportedCommands.join(', ')}`);
  process.exit(1);
}

startWithEnvFile(envFile, command);
