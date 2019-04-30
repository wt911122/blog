---
title: Vue 原理剖析
date: 2018-02-23
author: "Wangtao"
image: "ui-and-code.png"
path: "/vue-pricipal"
draft: true
---

# Vue 原理剖析

### 1、模拟双向绑定

```javascript

class Dep {
    constructor(){
        this.subscibes = [];
    }
    depend(){
        this.subscibes.push(watcher.activeupdate)
    }
    notify(){
        this.subscibes.forEach((c) => c());
    }
}
function observe(ob){
    const dep = new Dep();
    Object.keys(ob).forEach(k => {
        let value = ob[k];
        Object.defineProperty(ob, k, {
            get(){
                if(watcher.activeupdate){
                    dep.depend();
                }
                return value
            },
            set(val){
                console.log('setob');
                value = val
                dep.notify()
            }
        })
    })
}



function watcher(update){
    const watch = function(){
        watcher.activeupdate = update;
        update();
        watcher.activeupdate = null;
    }

    watch();
}
watcher.activeupdate = null
```

```html
<!doctype html>
<html>
<head>
    <title>vue mode</title>
    <script src="index.js"></script>
</head>
<body>
<div id="test"></div>
<input id="input" />
<script>
const inputEl = document.getElementById('input');
const testEl = document.getElementById('test');

const data = {
    content: 'xxx',
}
observe(data)

watcher(() => {
    testEl.innerText = data.content;
    inputEl.value = data.content;
})

data.content = 'sssssss'
inputEl.oninput = function(){
    data.content = this.value;
}
</script>
</body>
</html>
```

### 2、双向绑定与页面刷新

Vue在初始化的时候，向Vue对象注入了多个mixin，其中包括了lifecycle mixin，这个mixin在视图数据绑定上起了至关重要的作用，因为当你写入`Vue.$mount(…)`方法时，魔法就开始发生了，这个方法是从lifecycle mixin中注入进来的，其作用在于向vue component对象中写入一个`_watcher`，这个`_watcher`相当于上面的watcher方法，其只负责在监视到数据变化的时候调用如下方法：

```javascript
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
```

`vm._render()`生成了一个Vnode，其中老的Vnode已经在上一次存入了vm对象中，所以通过_update方法来集中访问这个老的Vnode

```javascript
const prevVnode = vm._vnode
...
if (!prevVnode) {
	// initial render
	vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
} else {
	// updates
	vm.$el = vm.__patch__(prevVnode, vnode)
}
```

`__patch__`方法就是经常被与react的diff算法比较的存在。