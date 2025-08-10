#!/bin/bash

# 脚本：使用 .env.example 启动开发服务器
# 使用方法：./scripts/start-with-example.sh

echo "🔧 使用 .env.example 配置启动开发服务器..."

# 检查 .env.example 是否存在
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example 文件不存在"
    exit 1
fi

# 备份现有的 .env 文件（如果存在）
if [ -f ".env" ]; then
    echo "📁 备份现有的 .env 文件到 .env.backup"
    cp .env .env.backup
fi

# 复制 .env.example 到 .env
echo "📋 复制 .env.example 到 .env"
cp .env.example .env

# 启动开发服务器
echo "🚀 启动开发服务器..."
npm start

# 可选：构建后恢复原始 .env 文件
# if [ -f ".env.backup" ]; then
#     echo "🔄 恢复原始 .env 文件"
#     mv .env.backup .env
# fi
