<template>
    <div class="container welcome">
        <h1>XMSeer 魔法编辑器</h1>

        <div class="input-group">
            <span class="label">快速开始</span>
            <ol class="welcome-list">
                <li>新建一个 <span class="code">.xm</span> 文件</li>
                <li>在侧边栏选择需要的功能面板</li>
                <li>填写参数并点击「添加」按钮</li>
                <li>脚本会写入当前 <span class="code">.xm</span> 文件</li>
            </ol>
        </div>

        <div class="input-group">
            <span class="label">功能面板</span>
            <ul class="welcome-list">
                <li>发包延时 — 发包和延时操作</li>
                <li>精灵操作 — 首发、切换、背包</li>
                <li>精灵培养 — 等级、技能、学习力、性格等</li>
                <li>对战操作 — 接管、技能、道具、战前准备</li>
                <li>循环体 — 出招、对战、判断、计次</li>
                <li>野怪操作 — 对战与捕捉</li>
                <li>变量 — 自定义变量与精灵属性查询</li>
                <li>自定义出招 / 自定义魔法 — 导入与变量复用</li>
                <li>魔法管理 — 端口、版本、黑名单等全局设置</li>
            </ul>
        </div>

        <div class="input-group">
            <span class="label">输出格式</span>
            <p class="hint">添加的内容会按下面的格式写入脚本：</p>
            <div class="code">功能名=值</div>
            <p class="hint">例如：<span class="code">延时=1000</span></p>
        </div>

        <div class="input-group">
            <span class="label">功能文档</span>
            <p class="hint">
                详细说明请看
                <a href="https://www.yuque.com/xinranyimeng-zbrse/nbid0s/xf4ec40lsuwph5l0?singleDoc">XM Seer 脱机日常使用说明文档</a>。
            </p>
        </div>
    </div>
</template>
