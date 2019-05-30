---
title: Webpack (v4.31.0) 源码阅读笔记
date: 2019-05-30
author: "Tony Wang"
path: "/webpack-note"
draft: true
---

webpack已经完全融入到了前端日常开发的方方面面，可以说现在的前端项目基本离不开webpack体系，因此了解webpack的实现原理对于日常开发会有很大的帮助。webpack已经不仅仅限于一款用于把node_modules中不同模块的代码与工程项目代码打包成块的工具，其意义在于整合编译项目中的不同资源，按需加载，它强大的可配置性赋予了项目极强的可延展性。

阅读webpack源码不可能像```npm i webpack```一样简单，所以我觉得可以遵从一个很简单的逻辑主线来阅读，这个也是官方文档中所介绍的webpack运行的一般顺序：

入口 -> 路径解析 -> 单个文件 loaders -> chunk 操作 。

从这条主线出发，可以提出几个问题：
1、webpack是如何从入口文件出发，收集到工程下所有项目文件的？
2、loader的编译阶段发生在什么时候？发生了什么？
3、打包编译出的代码和配置文件的映射关系是什么？

但当你打开源码之后，你会发现webpack的所有主流程类都是继承自Tapable，一个基于事件钩子插件库，该库提供了多种事件触发类型的钩子。所以在读源码之前，必须先简要了解下，What is this Tapable Capable~

Tapable的构造方法：
+ xxxHook(args: Array):Hook
    args代表了一连串的变量名，返回了一个Hook实例，

Hook实例的通用方法：
+ tap(options: string|object, fn: Function)
    向Hook中的taps数组中添加当前回调fn，添加方式取决于当前Hook的类型
+ call(...args)
    同步钩子调用，args为xxxHook构造时，编译出的函数中传入的参数，这串参数会经历所有实例上带有的钩子。
+ callAsync(...args, callback)
    异步钩子调用，args为xxxHook构造时，编译出的函数中传入的参数，这串参数会经历所有实例上带有的钩子。

Tapable提供了同步及异步的钩子，同步的钩子包括
+ SyncHook（同步顺序执行的钩子，钩子间的结果互不影响，出错时跳出）
+ SyncWaterfallHook（同步顺序执行，下一个钩子的接收参数是前一个钩子的返回，而非call时传入初始对象，出错时跳出）
+ SyncBailHook（同步顺序执行，前一个钩子出错或者没有返回，也就是调用了onError，之后的均不会被执行）
+ SyncLoopHook（同步顺序执行，如果一个钩子出错或者没有返回，就终止循环）

异步钩子包括
+ AsyncParallelHook （异步同时执行所有钩子，在每次运行回调时检查所有钩子是否执行完，执行完则抛出整体的回调）
+ AsyncParallelBailHook（异步同时执行所有钩子，在每次运行回调时检查所有钩子是否执行完，且检查执行是否有结果，没有结果则终止执行）
+ AsyncSeriesHook（异步顺序执行所有钩子，将所有钩子组成回调串，出错时跳出）
+ AsyncSeriesBailHook（异步顺序执行所有钩子，将所有钩子组成回调串，其中有个钩子没有返回值或者出错，则直接跳出）
+ AsyncSeriesWaterfallHook（异步顺序执行所有钩子，将所有钩子组成回调串，其中有个钩子没有返回值或者出错，则直接跳出，下一个钩子的接收参数是前一个钩子的返回，而非call时传入初始对象）x
+ AsyncSeriesLoopHook（异步顺序循环执行所有的钩子，出错或其中有个钩子的返回结果为undefined则跳出）

另外还提供HookMap工具，这个返回相当于一个 Map<key, value<xxxxHook>>
+ for(key).tap()
+ for(key).call()
+ for(key).callAsync()

Compiler所继承的Tapable还有一些实现方法，包括Apply和Plugin，这两个方法是旧版webpack在Compiler上注册插件的方式。

还有拦截器 Intercept，Intercept会应用于绑定在该Hook实例上所有的钩子运行之前。其具有一个需要实现的属性函数register，register把钩子tap时整理好的`options:{name:tap(name, fn), type: sync|async, context:Hook自带的运行环境, fn: tapFn}`带入然后返回处理好的options，webpack中多用作**追踪**和**计算打包进程**

以上对于Tapable的了解应该是够用了。另外还有一些概念包括Plugin，Webpack中的Plugin是什么？它必须实现一个apply方法，该方法传入一个compiler对象，这个对象就好比构建compilation的架子，compilation相当于依赖图，Compiler继承了Tapable并且暴露了自己所有的生命周期，因此Plugin要做的就是在该compiler对象的生命周期中挂载自己的所需执行的方法，Plugin可以有自己的状态，并且在compiler对象处于不同阶段时改变自己的状态。举个里面简单的例子：
```javascript
"use strict";

const JsonParser = require("./JsonParser");
const JsonGenerator = require("./JsonGenerator");

class JsonModulesPlugin {
	apply(compiler) {
        //  在 compilation 阶段注册 JsonModulesPlugin
        //  compilation 钩子具有两个参数
        //  /** @type {SyncHook<Compilation, CompilationParams>} */
        //  compilation: new SyncHook(["compilation", "params"]),

		compiler.hooks.compilation.tap(
			"JsonModulesPlugin",
			(compilation, { normalModuleFactory }) => {
                // normalModuleFactory 是 NormalModuleFactory 的实例，用于把不同的文件读入，通过loaders转化成别的形式用于加入chunk中
                // 这里是在 normalModuleFactory 构建解析器的阶段注入json的解析器
                normalModuleFactory.hooks.createParser
					.for("json")
					.tap("JsonModulesPlugin", () => {
						return new JsonParser();
                    });
                // 这里是在 normalModuleFactory 构建生成器的阶段注入json的生成器
				normalModuleFactory.hooks.createGenerator
					.for("json")
					.tap("JsonModulesPlugin", () => {
						return new JsonGenerator();
					});
			}
		);
	}
}

module.exports = JsonModulesPlugin;
```

下面可以着手来dive into webpack源码了。

首先来回答第一个问题，webpack在运行时，我们通常会执行一个函数`webpack(options)`，在就是读入webpack.config.js中的配置，然后返回一个`Compile`对象，然后运行这个对象的run()。run()在准备好一些文件缓存、计时器之类的之后，执行compile方法开始编译，complile方法的目的在于构建Compilation对象，该对象贯穿于整个打包周期中。
``` javascript
    compile(callback) {
        // 构建新的 Compulation 所需的参数
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

            this.hooks.compile.call(params);

            // 这里从webpack.config.js中读取了配置，并为 compilation 装配了用于解析 dependancies 所需要的 compilation.dependencyFactories 下
			const compilation = this.newCompilation(params);
            // 完成了所有的准备，此时开始 Compilation 阶段，就是真正的从入口处开始打包
			this.hooks.make.callAsync(compilation, err => {
                // 以下可以先不关心，不在第一个问题的范围之内
                if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
```
Compilation从入口，也就是我们通常写的webpack.config.js的entry属性开始读取文件，在读取文件内容之前，webpack必须确认文件的存在，如果不存在，就会出现webpack的日常报错 Module not found，为啥是Module node found呢？因为在webpack中，Module的概念相当于就是单个引用文件，接下来回到正题。

这里就会使用到了[enhance-resolver](https://github.com/webpack/enhanced-resolve)这个库，这个库会去寻找工程中的依赖位置，可能是项目目录下，也可能是node_modules中，也可能是alias中等，然后将文件的stats信息，绝对路径，以及这次解析的独立ID（重复的路径可以复用）。举个常见的栗子，单入口的SingleEntryPlugin中：

``` javascript
    apply(compiler) {
        ....
        // 这里接上一个代码块的 this.hooks.make.callAsync 调用
		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				debugger;
				const { entry, name, context } = this;

                const dep = SingleEntryPlugin.createDependency(entry, name);
                // 此处启动 compilation 的主流程， addEntry 中会开始构建 Module 的 主流程
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}
```
compilation的主流程是一个不断递归的过程，首先从entry出发，通过ModuleFactory创建一个Module(moduleFactory.create)，ModuleFactory的类型是在Resolve阶段就决定好了的。举个栗子，比如[NormalModuleFactory](https://github.com/webpack/webpack/blob/master/lib/NormalModuleFactory.js//#L369)

CODE 1

``` javascript
// addEntry 会调用到 ModuleFactory.create 方法创建Module
create(data, callback) {

    ...
    // Resolve前的准备，只是把
        //   {
        //     contextInfo,
        //     resolveOptions,
        //     context,
        //     request,
        //     dependencies
        //   }
        //   做了一些处理返回到回调的result当中去
    this.hooks.beforeResolve.callAsync(
        {
            contextInfo,
            resolveOptions,
            context,
            request,
            dependencies
        },
        (err, result) => {
            if (err) return callback(err);

            if (!result) return callback();
            // 这个hook执行之后，返回的一个factory(data, callback)函数，其执行顺序与tap进的顺序相反（SyncWaterfallHook）
            // 用于构建并执行factory
            const factory = this.hooks.factory.call(null);

            if (!factory) return callback();
            // 执行返回的 factory(data, callback)函数
            factory(result, (err, module) => {
                if (err) return callback(err);
                // 对这次的解析结果做了缓存，缓存的是module与dependency的对应关系
                if (module && this.cachePredicate(module)) {
                    for (const d of dependencies) {
                        dependencyCache.set(d, module);
                    }
                }

                callback(null, module);
            });
        }
    );
}
```
``` javascript

    this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {
        // 这里就是上面 this.hooks.factory.call(null) 真正执行的函数，result 对应了上面 传入的处理过的 result

        // 这个hook执行与之前的factory使用了同样的构建方式，返回的一个resolver(data, callback)函数，其执行顺序与tap进的顺序相反（SyncWaterfallHook）
        // 用于构建 resolver 函数
        let resolver = this.hooks.resolver.call(null);

        if (!resolver) return callback();
        // 执行 resolver
        // 这步的作用主要是收集可以解析这个文件所需loaders，及配置这些loader
        resolver(result, (err, data) => {
            if (err) return callback(err);
            if (!data) return callback();
            if (typeof data.source === "function") return callback(null, data);
            // 这有点像 koa 的洋葱圈 先执行完 afterResolve 之后又会跳回 factory 的回调之中
            this.hooks.afterResolve.callAsync(data, (err, result) => {
                if (err) return callback(err);
                if (!result) return callback();

                let createdModule = this.hooks.createModule.call(result);
                if (!createdModule) {
                    if (!result.request) {
                        return callback(new Error("Empty dependency (no request)"));
                    }

                    createdModule = new NormalModule(result);
                }

                createdModule = this.hooks.module.call(createdModule, result);
                // 现在构建这个 Module 的方法准备好了，回到工厂可以准备出厂了
                return callback(null, createdModule);
            });
        });
    });
```
Module创建后就会被构建，CODE 1的回调回到 compilation 的 _addModuleChain 函数，在做了一些处理后执行 buildModule 主方法，从而开始构建这个module，module在含义上其实就是工程内打包的不同文件。
```javascript
    buildModule(module, optional, origin, dependencies, thisCallback) {
        ...
        // 绑定 sourcemap, progress 到该module的生命周期
        this.hooks.buildModule.call(module);
        // module构建住方法 这里可以代入 NormalModule 来看
        module.build(
			this.options,
			this,
			this.resolverFactory.get("normal", module.resolveOptions),
			this.inputFileSystem,
			error => {
                ...

                const originalMap = module.dependencies.reduce((map, v, i) => {
					map.set(v, i);
					return map;
                }, new Map());
                // 依赖的对应表排序
				module.dependencies.sort((a, b) => {
					const cmp = compareLocations(a.loc, b.loc);
					if (cmp) return cmp;
					return originalMap.get(a) - originalMap.get(b);
				});
            }
        )
```
NormalModule在运行build方法的时候会先跑一遍loader（这是在之前loader resolver的时候就绑定好的），
``` javascript
    doBuild(options, compilation, resolver, fs, callback) {
		const loaderContext = this.createLoaderContext(
			resolver,
			options,
			compilation,
			fs
        );
        // loader-runner https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js#L251
        // 这里回答了第二个问题
		runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},
			(err, result) => {
                // err: 是否出错
                // result.result: Buffer | String
                // The result

                // result.resourceBuffer: Buffer
                // 源文件读入后生成的 Buffer (useful for SourceMaps)

                // result.cacheable: Bool
                // 这个可以缓存还是需要执行

                // result.fileDependencies: String[]
                // 这个结果是由哪些文件组成的

                // result.contextDependencies: String[]
                // 这个结果是由哪些文件目录组成的
                ...
                // 把结果存到当前 Module 当中
                this._source = this.createSource(
					this.binary ? asBuffer(source) : asString(source),
					resourceBuffer,
					sourceMap
				);
				this._ast =
					typeof extraInfo === "object" &&
					extraInfo !== null &&
					extraInfo.webpackAST !== undefined
						? extraInfo.webpackAST
						: null;
				return callback();
			}
		);
	}
```
然后将处理完的结果放入parser中解析。
```javascript
    // 这里的build 对应了向前第二个代码块的 module.build(
    build(options, compilation, resolver, fs, callback) {
        ...
        // doBuild 对应了上一个代码块
		return this.doBuild(options, compilation, resolver, fs, err => {
			...
			try {
                // 解析该文件内容
				const result = this.parser.parse(
					this._ast || this._source.source(),
					{
						current: this,
						module: this,
						compilation: compilation,
						options: options
					},
					(err, result) => {
						if (err) {
							handleParseError(err);
						} else {
							handleParseResult(result);
						}
					}
				);
				if (result !== undefined) {
					// 返回
					handleParseResult(result);
				}
			} catch (e) {
				handleParseError(e);
			}
		});
	}
```
在解析的过程中把文件中用到的import之类的信息解析出来，把引入的文件找到并匹配对应的Dependency放入Module当中
```javascript
// Parser.js
    parse(source, initialState) {
		...
        ast = Parser.parse(source, {
            sourceType: this.sourceType,
            onComment: comments
        });

        ...
        // 解析整个文件的声明句，解析出一个通过钩子抛出，钩子将其加入到 该 Module 的 dependancis 当中
			this.walkStatements(ast.body);
		...
	}
```
解析完之后回到 Compilation，根据这次的解析结果决定是否要继续继续解析该 Module 的依赖
``` javascript
    moduleFactory.create(
        {
            contextInfo: {
                issuer: "",
                compiler: this.compiler.name
            },
            context: context,
            dependencies: [dependency]
        },
        (err, module) => {
            ...

            const afterBuild = () => {
                if (currentProfile) {
                    const afterBuilding = Date.now();
                    currentProfile.building = afterBuilding - afterFactory;
                }
                // 如果当前加入的 Module 中具有依赖，则继续解析这个 Module 中的所有依赖，也就是回到了单个 Module 的resolve阶段，
                if (addModuleResult.dependencies) {
                    this.processModuleDependencies(module, err => {
                        if (err) return callback(err);
                        callback(null, module);
                    });
                } else {
                    return callback(null, module);
                }
            };

            ...

            if (addModuleResult.build) {
                this.buildModule(module, false, null, null, err => {
                    ...

                    afterBuild();
                });
            } else {
               ...
            }
        }
    );
```
这基本上回答了第一个问题，在所有的 Module 解析完毕之后，this.hooks.make走到了回调函数。

接下来，来回答第三个问题，第三个问题涉及到chunk，还是这段 Compile 的 compile 函数，现在运行到seal阶段
``` javascript
    compile(callback) {
            ...
			this.hooks.make.callAsync(compilation, err => {
                if (err) return callback(err);
                // 这里所有的 module 都生成好了，执行了 finishModules 钩子
                // webpack本身这里重新整理了一些exports，比如把 export * from '.../'
                //另外还有 webAssembly module 之类的不在本篇讨论范围之内，有兴趣可以自己研究
				compilation.finish(err => {
					if (err) return callback(err);
                    // 这边进入打成 chunk 的主流程
					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
```
下面来看seal方法
```javascript
    seal(callback) {
        // 这里 webpack 检查了一下所有 module 的绝对路径是否存在只是大小写区分。若存在会抛出 CaseSensitiveModulesWarning
		this.hooks.seal.call();

		while (
            // 这里的写法相当于
            /**
             * if(this.hooks.optimizeDependenciesBasic.call(this.modules))
             *   if(this.hooks.optimizeDependencies.call(this.modules))
             *      if(this.hooks.optimizeDependenciesAdvanced.call(this.modules)) { }
             **/
            // 这些都是 SyncBailHook
            this.hooks.optimizeDependenciesBasic.call(this.modules) ||
            // production mode下会启用的 FlagDependencyUsagePlugin SideEffectsFlagPlugin 在这里调用
            // 如果要disable这个plugin可以在 optimizeDependenciesBasic 返回一个非undefined的值
            // FlagDependencyUsagePlugin 应该是能够将 module 中 exports 的有效部分标记出来
			this.hooks.optimizeDependencies.call(this.modules) ||
			this.hooks.optimizeDependenciesAdvanced.call(this.modules)
		) {
			/* empty */
		}
		this.hooks.afterOptimizeDependencies.call(this.modules);

        this.hooks.beforeChunks.call();

        // 到此为止开始真正的合并chunk的过程
        // 按 webpack.config.js 中设置的 entry 打 chunk
        // 并加入到 chunkGroups
		for (const preparedEntrypoint of this._preparedEntrypoints) {
			const module = preparedEntrypoint.module;
            const name = preparedEntrypoint.name;
            // 如果有一致的 chunk 名则复用
			const chunk = this.addChunk(name);
			const entrypoint = new Entrypoint(name);
			entrypoint.setRuntimeChunk(chunk);
			entrypoint.addOrigin(null, name, preparedEntrypoint.request);
			this.namedChunkGroups.set(name, entrypoint);
			this.entrypoints.set(name, entrypoint);
			this.chunkGroups.push(entrypoint);
            // entrypoint 和 chunk 建立多对多的关系
            GraphHelpers.connectChunkGroupAndChunk(entrypoint, chunk);
            // chunk 和 module 建立多对多的关系
			GraphHelpers.connectChunkAndModule(chunk, module);

			chunk.entryModule = module;
			chunk.name = name;

			this.assignDepth(module);
        }
        // 生成 chunk图，
		this.processDependenciesBlocksForChunkGroups(this.chunkGroups.slice());

		...
	}
```
这里可以来研究下生成 chunk 图的方法。chunk图是个什么东西呢？chunk图其实建立在module图上，module图就是表示module之间的依赖关系，可能是同步依赖，也可能是异步依赖，这样在异步依赖的时候需对chunk分组来描述chunk之间的依赖关系，因此算法先生成了简单的module图，然后在这基础上做了两步chunk图的计算，下面简单分析下chunk图的生成方法。
```javascript
processDependenciesBlocksForChunkGroups(inputChunkGroups) {
		const chunkDependencies = new Map();
		const allCreatedChunkGroups = new Set();

		const blockInfoMap = new Map(); // 存放 module 图

		const iteratorDependency = d => {
			// We skip Dependencies without Reference
			const ref = this.getDependencyReference(currentModule, d);
			if (!ref) {
				return;
			}
			// We skip Dependencies without Module pointer
			const refModule = ref.module;
			if (!refModule) {
				return;
			}
			// We skip weak Dependencies
			if (ref.weak) {
				return;
			}

			blockInfoModules.add(refModule);
		};

		const iteratorBlockPrepare = b => {
			blockInfoBlocks.push(b);
			blockQueue.push(b);
		};

		/** @type {Module} */
		let currentModule;
		/** @type {DependenciesBlock} */
		let block;
		/** @type {DependenciesBlock[]} */
		let blockQueue;
		/** @type {Set<Module>} */
		let blockInfoModules; // 存放同步加载的module
		/** @type {AsyncDependenciesBlock[]} */
		let blockInfoBlocks;  // 存放异步加载的module

		// 整个是为了生成简单的 mudule 图
		/**
		 * 每个 module 都有两个分支，
		 * blocks: 存异步 module，
		 * modules: 存同步 module,
		 *
		 * blockInfoMap 用 module 做键值，构建module的属性依赖结构
		 * 类似这样
		 *                   A
		 *                 /  \
		 *	modules -> [B, C] [D]  <- blocks(异步)
		 *             /      /
		 * modules-> [E]    [F]  <- modules
		 *
		 **/

		for (const module of this.modules) {
			blockQueue = [module];
			currentModule = module;
			while (blockQueue.length > 0) {
				block = blockQueue.pop();
				blockInfoModules = new Set();
				blockInfoBlocks = [];

				if (block.variables) {
					iterationBlockVariable(block.variables, iteratorDependency);
				}

				if (block.dependencies) {
					// 普通模块加入 blockInfoModules 中
					iterationOfArrayCallback(block.dependencies, iteratorDependency);
				}

				if (block.blocks) {
					// 异步模块加入 blockInfoBlocks 中
					iterationOfArrayCallback(block.blocks, iteratorBlockPrepare);
				}

				const blockInfo = {
					modules: Array.from(blockInfoModules),
					blocks: blockInfoBlocks
				};
				// 当前 module 加入 module图中
				blockInfoMap.set(block, blockInfo);
			}
		}

		// PART1 开始分割简单的 chunk 图
		/** @type {Map<ChunkGroup, { index: number, index2: number }>} */

		const chunkGroupCounters = new Map();

		for (const chunkGroup of inputChunkGroups) {
			chunkGroupCounters.set(chunkGroup, { index: 0, index2: 0 });
		}

		let nextFreeModuleIndex = 0;
		let nextFreeModuleIndex2 = 0;

		/** @type {Map<DependenciesBlock, ChunkGroup>} */
		const blockChunkGroups = new Map();

		/** @type {Set<DependenciesBlock>} */
		const blocksWithNestedBlocks = new Set();

		const ADD_AND_ENTER_MODULE = 0;
		const ENTER_MODULE = 1;
		const PROCESS_BLOCK = 2;
		const LEAVE_MODULE = 3;

		/**
		 * @typedef {Object} QueueItem
		 * @property {number} action
		 * @property {DependenciesBlock} block
		 * @property {Module} module
		 * @property {Chunk} chunk
		 * @property {ChunkGroup} chunkGroup
		 */

		/**
		 * @param {ChunkGroup} chunkGroup chunk group
		 * @returns {QueueItem} queue item
		 */
		const chunkGroupToQueueItem = chunkGroup => ({
			action: ENTER_MODULE,
			block: chunkGroup.chunks[0].entryModule,
			module: chunkGroup.chunks[0].entryModule,
			chunk: chunkGroup.chunks[0],
			chunkGroup
		});

		// Start with the provided modules/chunks
		/** @type {QueueItem[]} */
		let queue = inputChunkGroups.map(chunkGroupToQueueItem).reverse();
		/** @type {QueueItem[]} */
		let queueDelayed = [];

		/** @type {Module} */
		let module;
		/** @type {Chunk} */
		let chunk;
		/** @type {ChunkGroup} */
		let chunkGroup;

		// For each async Block in graph
		/**
		 * @param {AsyncDependenciesBlock} b iterating over each Async DepBlock
		 * @returns {void}
		 */
		const iteratorBlock = b => {
			// 1. We create a chunk for this Block
			// but only once (blockChunkGroups map)
			// 如果 blockChunkGroups 中不存在这个module所属的chunk，为这个异步的 module 创建一个
			let c = blockChunkGroups.get(b);
			if (c === undefined) {
				c = this.namedChunkGroups.get(b.chunkName);
				if (c && c.isInitial()) {
					this.errors.push(
						new AsyncDependencyToInitialChunkError(b.chunkName, module, b.loc)
					);
					c = chunkGroup;
				} else {
					c = this.addChunkInGroup(
						b.groupOptions || b.chunkName,
						module,
						b.loc,
						b.request
					);
					chunkGroupCounters.set(c, { index: 0, index2: 0 });
					blockChunkGroups.set(b, c);
					allCreatedChunkGroups.add(c);
				}
			} else {
				// TODO webpack 5 remove addOptions check
				if (c.addOptions) c.addOptions(b.groupOptions);
				c.addOrigin(module, b.loc, b.request);
			}

			// 2. We store the Block+Chunk mapping as dependency for the chunk
			// chunkDependencies 就是这个 chunkGroup 所依赖的其他chunk
			let deps = chunkDependencies.get(chunkGroup);
			if (!deps) chunkDependencies.set(chunkGroup, (deps = []));
			deps.push({
				block: b,
				chunkGroup: c,
				couldBeFiltered: true
			});

			// 3. We enqueue the DependenciesBlock for traversal
			// 异步的模块放到同步模块走完再循环
			queueDelayed.push({
				action: PROCESS_BLOCK,
				block: b,
				module: module,
				chunk: c.chunks[0],
				chunkGroup: c
			});
		};

		// Iterative traversal of the Module graph
		// Recursive would be simpler to write but could result in Stack Overflows
		while (queue.length) {
			while (queue.length) {
				// 递归变循环的方法是构造一个栈来代替调用栈
				const queueItem = queue.pop();
				module = queueItem.module;
				block = queueItem.block;
				chunk = queueItem.chunk;
				chunkGroup = queueItem.chunkGroup;

				switch (queueItem.action) {
					case ADD_AND_ENTER_MODULE: {
						// We connect Module and Chunk when not already done
						if (chunk.addModule(module)) {
							module.addChunk(chunk);
						} else {
							// already connected, skip it
							break;
						}
					}
					// fallthrough
					case ENTER_MODULE: {
						// 从 entry 进入
						if (chunkGroup !== undefined) {
							// 入栈的时候带上 index
							const index = chunkGroup.getModuleIndex(module);
							if (index === undefined) {
								chunkGroup.setModuleIndex(
									module,
									chunkGroupCounters.get(chunkGroup).index++
								);
							}
						}

						if (module.index === null) {
							module.index = nextFreeModuleIndex++;
						}
						// 将退出队列的操作推入栈中
						queue.push({
							action: LEAVE_MODULE,
							block,
							module,
							chunk,
							chunkGroup
						});
					}
					// 直接进入对子module的遍历
					// fallthrough
					case PROCESS_BLOCK: {
						// get prepared block info
						const blockInfo = blockInfoMap.get(block);

						// Traverse all referenced modules
						// 处理所有的同步module引用
						for (let i = blockInfo.modules.length - 1; i >= 0; i--) {
							const refModule = blockInfo.modules[i];
							if (chunk.containsModule(refModule)) {
								// skip early if already connected
								continue;
							}
							// enqueue the add and enter to enter in the correct order
							// this is relevant with circular dependencies
							// 把所有的同步依赖 module 压入栈中处理
							queue.push({
								action: ADD_AND_ENTER_MODULE,
								block: refModule,
								module: refModule,
								chunk,
								chunkGroup
							});
						}

						// Traverse all Blocks
						// 再处理异步依赖module 到前面的 iteratorBlock 方法
						iterationOfArrayCallback(blockInfo.blocks, iteratorBlock);

						if (blockInfo.blocks.length > 0 && module !== block) {
							blocksWithNestedBlocks.add(block);
						}
						break;
					}
					case LEAVE_MODULE: {
						// 在出栈的时候带上 index2
						if (chunkGroup !== undefined) {
							const index = chunkGroup.getModuleIndex2(module);
							if (index === undefined) {
								chunkGroup.setModuleIndex2(
									module,
									chunkGroupCounters.get(chunkGroup).index2++
								);
							}
						}

						if (module.index2 === null) {
							module.index2 = nextFreeModuleIndex2++;
						}
						break;
					}
				}
			}
			// 外层循环是为了遍历异步依赖的 module
			const tempQueue = queue;
			queue = queueDelayed.reverse();
			queueDelayed = tempQueue;
		}

		// PART TWO
		// PART2 主要是针对第一步生成chunk图做了一些优化处理，有兴趣可以自行阅读，chunk分离的结果对应了最终输出的文件夹下的不同chunk文件
		...
	}
```
还是回到第三个问题，现在我们把这个问题定位到了一个个的chunk当中，那么chunk中的代码是怎么和你平时写的那些代码对应起来的呢，可能你读到这里已经有了答案，不过，还有一些细节性的问题可以仔细的研究一下。接着来看seal方法。
```javascript
seal(callback) {
	...
	this.processDependenciesBlocksForChunkGroups(this.chunkGroups.slice());
	...
	...
	this.hooks.optimizeTree.callAsync(this.chunks, this.modules, err => {
		...
		this.createModuleAssets(); // 获取到 module 下的 assets，比如图片之类的
		if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
			this.hooks.beforeChunkAssets.call();
			this.createChunkAssets(); // 套用不同模板针对chunk下的 files 生成整个chunk的source代码，主要是生成 chunk.files
		}

		this.hooks.additionalChunkAssets.call(this.chunks);
		this.summarizeDependencies();
		if (shouldRecord) {
			this.hooks.record.call(this, this.records);
		}

		this.hooks.additionalAssets.callAsync(err => {
			if (err) {
				return callback(err);
			}
			// 很多插件会对 chunk.files 做最终处理的钩子
			this.hooks.optimizeChunkAssets.callAsync(this.chunks, err => {
				if (err) {
					return callback(err);
				}
				// 内置的 sourcemap-dev-plugin
				this.hooks.afterOptimizeChunkAssets.call(this.chunks);
				this.hooks.optimizeAssets.callAsync(this.assets, err => {
					if (err) {
						return callback(err);
					}
					this.hooks.afterOptimizeAssets.call(this.assets);
					if (this.hooks.needAdditionalSeal.call()) {
						this.unseal();
						return this.seal(callback);
					}
					// 整个打chunk的流程走完
					return this.hooks.afterSeal.callAsync(callback);
				});
			});
		});
	}
```
到这里整个webpack打包的主流程走完，接下来会将打好的包输出到目标文件目录下，现在回到Compiler.js中
```javascript
		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);

			if (this.hooks.shouldEmit.call(compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stvats);
				});
				return;
			}

			// 此处输出文件到文件目录
			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);

						this.hooks.additionalPass.callAsync(err => {
							if (err) return finalCallback(err);
							this.compile(onCompiled);
						});
					});
					return;
				}

				this.emitRecords(err => {
					if (err) return finalCallback(err);

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);
						return finalCallback(null, stats);
					});
				});
			});
		};
```
这基本上是回答了第三个问题，打包出的文件按不同chunk输出文件，chunk中的module按引用顺序深度排列，具体写法依赖与模板套用的语法。

## 总结
到这里为止，我们基本梳理了一遍webpack的主流程，从入口到最后打包成文件。Compilation作为一条主线贯穿了整个webpack的生命周期之中，若要细抠每个流程的细节可以从Compilation中属性入手，了解每个属性的作用及在各个生命周期中的状态。Tapable给予了webpack强大的可配置性，结合Compilation可以发现，这是一个生产单一对象的过程，面向过程webpack通过Tapable开了多个不同的切面，切面可能具有自己游离的对象，贯穿于Compilation不同的生命周期之中，最终都是为了能够赋予chunks独特的特性。有了这条主线之后，无论对于之后开发webpack的插件，还是继续深挖webpack源码都具有指导意义。