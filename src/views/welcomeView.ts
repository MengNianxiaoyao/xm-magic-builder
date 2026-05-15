import * as vscode from 'vscode';

export function showWelcomePanel(context: vscode.ExtensionContext): void {
    const key = 'xm-magic-builder.welcomed';
    const hasWelcomed = context.globalState.get(key, false);

    if (hasWelcomed) { return; }

    context.globalState.update(key, true);

    const panel = vscode.window.createWebviewPanel(
        'xm-magic-builder-welcome',
        '欢迎使用 XMSeer 魔法编辑器',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    panel.webview.html = getWelcomeHtml();
}

function getWelcomeHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: var(--vscode-font-family);
                padding: 40px;
                color: var(--vscode-editor-foreground);
                background: var(--vscode-editor-background);
            }
            h1 { color: #4fc3f7; margin-bottom: 20px; }
            h2 { color: #81c784; margin-top: 30px; }
            .card {
                background: var(--vscode-editor-inactiveSelectionBackground);
                border-radius: 8px;
                padding: 16px;
                margin: 12px 0;
            }
            .code {
                background: var(--vscode-textCodeBlockBackground);
                padding: 8px 12px;
                border-radius: 4px;
                font-family: var(--vscode-editor-font-family);
            }
            .step { color: #ffb74d; font-weight: bold; }
            ul { line-height: 1.8; }
            a { color: #4fc3f7; }
        </style>
    </head>
    <body>
        <h1>🎮 欢迎使用 XMSeer 魔法编辑器</h1>
        
        <div class="card">
            <h2>快速开始</h2>
            <ol>
                <li><span class="step">第一步：</span>新建一个 <span class="code">.xm</span> 文件</li>
                <li><span class="step">第二步：</span>在侧边栏选择需要的功能面板</li>
                <li><span class="step">第三步：</span>填写参数并点击"添加"按钮</li>
                <li><span class="step">第四步：</span>在 .xm 文件中自动生成魔法脚本</li>
            </ol>
        </div>
        
        <div class="card">
            <h2>功能面板</h2>
            <ul>
                <li><strong>发包延时</strong> - 发包和延时操作</li>
                <li><strong>对战操作</strong> - 对战相关操作</li>
                <li><strong>精灵操作</strong> - 精灵相关操作</li>
                <li><strong>循环体</strong> - 出招/对战/判断/计次循环</li>
                <li><strong>变量</strong> - 定义变量</li>
                <li><strong>魔法管理</strong> - 魔法全局设置</li>
                <li><strong>自定义出招/魔法</strong> - 导入自定义</li>
            </ul>
        </div>
        
        <div class="card">
            <h2>输出格式</h2>
            <p>添加的内容会按照以下格式输出到 .xm 文件：</p>
            <div class="code">功能名=值</div>
            <p>例如：延时=1000</p>
        </div>

        <div class="card">
            <h2>功能详细说明</h2>
            <p>功能详细请看 <a href="https://www.yuque.com/xinranyimeng-zbrse/nbid0s/xf4ec40lsuwph5l0?singleDoc">XM Seer脱机日常使用说明文档</a></p>
        </div>
    </body>
    </html>`;
}