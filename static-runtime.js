// Universal Zero-Build Static Runtime v2 (Fast Boot + Stale-While-Revalidate + On-Demand Lazy Chunks)
// Automatically runs ONLY when raw source files (Download ZIP) are uploaded directly
// to ANY static hosting server (InfinityFree, cPanel, Apache, Nginx, IIS, GitHub Pages, etc.)
// without running `npm run build` or uploading `dist/` or `HTDOCS_UPLOAD/`.
(async function () {
  if (window.__PCN_STATIC_RUNTIME_STARTED__) return;
  window.__PCN_STATIC_RUNTIME_STARTED__ = true;

  var statusEl = document.getElementById('splash-status');
  var detailEl = document.getElementById('splash-detail');
  var actionsEl = document.getElementById('splash-actions');
  var rootEl = document.getElementById('root');

  function hasAppRendered() {
    return !!(rootEl && rootEl.childElementCount > 0);
  }

  function setStatus(msg) {
    if (!hasAppRendered() && statusEl) statusEl.textContent = msg;
  }

  function failRuntime(msg, detail) {
    if (hasAppRendered()) return;
    if (statusEl) statusEl.textContent = msg;
    if (detailEl && detail) {
      detailEl.textContent = detail;
      detailEl.classList.add('visible');
    }
    if (actionsEl) actionsEl.classList.add('visible');
  }

  // Exact base URL where index.html & static-runtime.js live (works on root / and subfolders /app/)
  var scriptEl = document.currentScript || document.querySelector('script[src*="static-runtime.js"]');
  var appBase = scriptEl && scriptEl.src
    ? new URL('./', scriptEl.src).href
    : new URL('./', window.location.href).href;

  window.__PCN_ASSET_BASE__ = appBase + 'public/';

  var EXTERNALS = {
    'react': 'https://esm.sh/react@19.0.1',
    'react/jsx-runtime': 'https://esm.sh/react@19.0.1/jsx-runtime',
    'react/jsx-dev-runtime': 'https://esm.sh/react@19.0.1/jsx-runtime',
    'react-dom': 'https://esm.sh/react-dom@19.0.1?deps=react@19.0.1',
    'react-dom/client': 'https://esm.sh/react-dom@19.0.1/client?deps=react@19.0.1',
    'firebase/app': 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js',
    'firebase/auth': 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js',
    'firebase/firestore': 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js',
    'lucide-react': 'https://esm.sh/lucide-react@0.546.0?deps=react@19.0.1',
    'recharts': 'https://esm.sh/recharts@3.10.1?deps=react@19.0.1,react-dom@19.0.1',
    'canvas-confetti': 'https://esm.sh/canvas-confetti@1.9.4',
    'motion/react': 'https://esm.sh/motion@12.23.24/react?deps=react@19.0.1,react-dom@19.0.1'
  };

  // Immediately preload core external ES modules in parallel with cache lookup & Tailwind CSS
  (function preloadCoreExternals() {
    var coreUrls = [
      EXTERNALS['react'],
      EXTERNALS['react/jsx-runtime'],
      EXTERNALS['react-dom/client'],
      EXTERNALS['firebase/app'],
      EXTERNALS['firebase/firestore'],
      EXTERNALS['lucide-react']
    ];
    for (var i = 0; i < coreUrls.length; i++) {
      try {
        var link = document.createElement('link');
        link.rel = 'modulepreload';
        link.crossOrigin = 'anonymous';
        link.href = coreUrls[i];
        document.head.appendChild(link);
      } catch {}
    }
  })();

  var MEDIA_RE = /\.(jpg|jpeg|png|gif|webp|svg|ico|mp3|wav|ogg|woff2?|ttf)(\?.*)?$/i;
  var injectedCssUrls = new Set();
  var tailwindScriptPromise = null;

  function looksLikeHtml(text, contentType) {
    var ct = (contentType || '').toLowerCase();
    if (ct.indexOf('text/html') !== -1) return true;
    var trimmed = (text || '').trimStart().slice(0, 40).toLowerCase();
    return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
  }

  function loadScriptTag(urls) {
    return new Promise(function (resolve, reject) {
      var idx = 0;
      function tryNext() {
        if (idx >= urls.length) {
          reject(new Error('Failed to load CDN script: ' + urls[0]));
          return;
        }
        var s = document.createElement('script');
        s.src = urls[idx++];
        s.crossOrigin = 'anonymous';
        s.onload = function () { resolve(); };
        s.onerror = function () { tryNext(); };
        document.head.appendChild(s);
      }
      tryNext();
    });
  }

  function ensureTailwindScript() {
    if (!tailwindScriptPromise) {
      tailwindScriptPromise = loadScriptTag([
        'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
        'https://unpkg.com/@tailwindcss/browser@4'
      ]).catch(function () {});
    }
    return tailwindScriptPromise;
  }

  function injectCssText(cssUrl, cssText) {
    if (!cssText || injectedCssUrls.has(cssUrl)) return;
    injectedCssUrls.add(cssUrl);
    var style = document.createElement('style');
    style.type = 'text/tailwindcss';
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  async function injectTailwindCss(cssUrl) {
    if (injectedCssUrls.has(cssUrl)) return '';
    try {
      var r = await fetch(cssUrl, { credentials: 'same-origin' });
      if (!r.ok) return '';
      var cssText = await r.text();
      if (looksLikeHtml(cssText, r.headers.get('content-type'))) return '';
      injectCssText(cssUrl, cssText);
      return cssText;
    } catch {
      return '';
    }
  }

  // Concurrency-limited fetch queue (max 8 in-flight requests: fast yet gentle on shared hosts)
  var MAX_CONCURRENT = 8;
  var activeFetches = 0;
  var fetchQueue = [];
  var loadedFileCount = 0;

  function queuedFetch(url, noStore) {
    return new Promise(function (resolve, reject) {
      var run = function () {
        activeFetches += 1;
        fetch(url, noStore ? { credentials: 'same-origin', cache: 'no-store' } : { credentials: 'same-origin' })
          .then(resolve, reject)
          .finally(function () {
            activeFetches -= 1;
            if (fetchQueue.length > 0) {
              var next = fetchQueue.shift();
              next();
            }
          });
      };
      if (activeFetches < MAX_CONCURRENT) {
        run();
      } else {
        fetchQueue.push(run);
      }
    });
  }

  // IndexedDB cache (v5: stores instant-boot bundle + CSS + per-chunk lazy builds)
  var CACHE_DB = 'pcn_static_runtime_cache_v5';
  var CACHE_STORE = 'bundles';
  var cacheDbPromise = null;

  // Clean up legacy v4 cache database silently to save mobile storage
  try {
    if (typeof indexedDB !== 'undefined') {
      setTimeout(function () {
        try { indexedDB.deleteDatabase('pcn_static_runtime_cache_v4'); } catch {}
      }, 4000);
    }
  } catch {}

  function openCacheDb() {
    if (cacheDbPromise) return cacheDbPromise;
    cacheDbPromise = new Promise(function (resolve) {
      try {
        if (typeof indexedDB === 'undefined') return resolve(null);
        var req = indexedDB.open(CACHE_DB, 1);
        req.onupgradeneeded = function () {
          try { req.result.createObjectStore(CACHE_STORE); } catch {}
        };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(null); };
      } catch {
        resolve(null);
      }
    });
    return cacheDbPromise;
  }

  async function cacheGet(key) {
    var db = await openCacheDb();
    if (!db) return null;
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction(CACHE_STORE, 'readonly');
        var req = tx.objectStore(CACHE_STORE).get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { resolve(null); };
      } catch {
        resolve(null);
      }
    });
  }

  async function cacheSet(key, val) {
    var db = await openCacheDb();
    if (!db) return;
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction(CACHE_STORE, 'readwrite');
        tx.objectStore(CACHE_STORE).put(val, key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      } catch {
        resolve();
      }
    });
  }

  async function cacheDelete(key) {
    var db = await openCacheDb();
    if (!db) return;
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction(CACHE_STORE, 'readwrite');
        tx.objectStore(CACHE_STORE).delete(key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      } catch {
        resolve();
      }
    });
  }

  function simpleHash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  var fileCache = new Map();
  var resolveCache = new Map();

  async function fetchFirstValid(candidates, noStore) {
    for (var i = 0; i < candidates.length; i++) {
      var url = candidates[i];
      if (!noStore && fileCache.has(url)) {
        return { url: url, text: fileCache.get(url) };
      }
      for (var attempt = 0; attempt < 2; attempt++) {
        try {
          var res = await queuedFetch(url, noStore);
          if (res.redirected && res.url && res.url.indexOf(appBase) !== 0) break;
          if (!res.ok) {
            if (res.status >= 500 || res.status === 429) {
              await new Promise(function (r) { setTimeout(r, 300); });
              continue;
            }
            break;
          }
          var text = await res.text();
          if (looksLikeHtml(text, res.headers.get('content-type'))) break;
          fileCache.set(url, text);
          loadedFileCount += 1;
          if (loadedFileCount > 3 && loadedFileCount % 5 === 0) {
            setStatus('অ্যাপ প্রথমবার প্রস্তুত হচ্ছে... (' + loadedFileCount + ' ফাইল)');
          }
          return { url: url, text: text };
        } catch {
          if (attempt === 0) {
            await new Promise(function (r) { setTimeout(r, 200); });
          }
        }
      }
    }
    return null;
  }

  function loaderForUrl(url) {
    var clean = url.split('?')[0].toLowerCase();
    if (clean.endsWith('.tsx')) return 'tsx';
    if (clean.endsWith('.ts')) return 'ts';
    if (clean.endsWith('.jsx')) return 'jsx';
    if (clean.endsWith('.json')) return 'json';
    return 'js';
  }

  async function resolveLocalUrl(rawUrl) {
    if (resolveCache.has(rawUrl)) return resolveCache.get(rawUrl);

    if (MEDIA_RE.test(rawUrl) || /\.css(\?.*)?$/i.test(rawUrl)) {
      resolveCache.set(rawUrl, rawUrl);
      return rawUrl;
    }

    var hasKnownExt = /\.(tsx|ts|jsx|js|mjs|json)(\?.*)?$/i.test(rawUrl);
    var candidates;
    if (hasKnownExt) {
      candidates = [rawUrl];
    } else {
      var prefersTs = /\/(utils|data|hooks)\//i.test(rawUrl) || /\/(types|categories)$/i.test(rawUrl);
      candidates = prefersTs
        ? [rawUrl + '.ts', rawUrl + '.tsx', rawUrl + '/index.ts', rawUrl + '/index.tsx', rawUrl + '.js']
        : [rawUrl + '.tsx', rawUrl + '.ts', rawUrl + '/index.tsx', rawUrl + '/index.ts', rawUrl + '.js'];
    }

    var found = await fetchFirstValid(candidates, false);
    if (!found) {
      throw new Error('Module not found on server: ' + rawUrl);
    }
    resolveCache.set(rawUrl, found.url);
    return found.url;
  }

  // Lazily initialized esbuild-wasm (skipped completely on cached repeat visits until a lazy chunk is opened!)
  var esbuildPromise = null;
  function getEsbuild() {
    if (esbuildPromise) return esbuildPromise;
    esbuildPromise = (async function () {
      var wasmCandidates = [
        {
          esm: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.25.0/esm/browser.min.js',
          wasm: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.25.0/esbuild.wasm'
        },
        {
          esm: 'https://unpkg.com/esbuild-wasm@0.25.0/esm/browser.min.js',
          wasm: 'https://unpkg.com/esbuild-wasm@0.25.0/esbuild.wasm'
        }
      ];
      var initErr = null;
      for (var c = 0; c < wasmCandidates.length; c++) {
        try {
          var mod = await import(wasmCandidates[c].esm);
          // worker: false avoids Blob Worker hangs across both http:// and https:// hosts
          await mod.initialize({ wasmURL: wasmCandidates[c].wasm, worker: false });
          return mod;
        } catch (err) {
          initErr = err;
        }
      }
      esbuildPromise = null;
      throw initErr || new Error('esbuild-wasm failed to initialize');
    })();
    return esbuildPromise;
  }

  function toRelPath(absUrl) {
    if (absUrl.indexOf(appBase) === 0) {
      return absUrl.slice(appBase.length).replace(/\?.*$/, '');
    }
    return absUrl;
  }

  function shouldDeferDynamicImport(relPath) {
    // Keep main App.tsx inside the initial boot bundle so login/home renders in 1 single pass
    if (/^src\/App(\.tsx?)?$/i.test(relPath)) return false;
    return /^src\/(components|portals)\//i.test(relPath);
  }

  function rewriteLazyImports(code) {
    return code.replace(
      /\bimport\s*\(\s*(["'])pcn-lazy:([^"']+)\1\s*\)/g,
      'window.__PCN_LOAD_CHUNK__("$2")'
    );
  }

  async function buildEntry(entryUrl, deferDynamicLocal) {
    var esbuildMod = await getEsbuild();

    var httpPlugin = {
      name: 'pcn-static-http-loader',
      setup: function (build) {
        build.onResolve({ filter: /.*/ }, async function (args) {
          var p = args.path;

          if (p === entryUrl) {
            return { path: entryUrl, namespace: 'pcn-http' };
          }

          if (/^https?:\/\//i.test(p)) {
            return { path: p, external: true };
          }

          if (p.startsWith('@/')) {
            var aliased = new URL(p.slice(2), appBase).href;
            var aliasRel = toRelPath(aliased);
            if (deferDynamicLocal && args.kind === 'dynamic-import' && shouldDeferDynamicImport(aliasRel)) {
              return { path: 'pcn-lazy:' + aliasRel, external: true };
            }
            var canonicalAlias = await resolveLocalUrl(aliased);
            return { path: canonicalAlias, namespace: 'pcn-http' };
          }

          if (p.startsWith('./') || p.startsWith('../') || p.startsWith('/')) {
            var rawResolved = p.startsWith('/')
              ? new URL(p.slice(1), appBase).href
              : new URL(p, args.importer || entryUrl).href;
            var rel = toRelPath(rawResolved);
            if (deferDynamicLocal && args.kind === 'dynamic-import' && shouldDeferDynamicImport(rel)) {
              return { path: 'pcn-lazy:' + rel, external: true };
            }
            var canonical = await resolveLocalUrl(rawResolved);
            return { path: canonical, namespace: 'pcn-http' };
          }

          if (EXTERNALS[p]) {
            return { path: EXTERNALS[p], external: true };
          }
          return {
            path: 'https://esm.sh/' + p + '?deps=react@19.0.1,react-dom@19.0.1',
            external: true
          };
        });

        build.onLoad({ filter: /.*/, namespace: 'pcn-http' }, async function (args) {
          var targetUrl = args.path;

          if (MEDIA_RE.test(targetUrl)) {
            return {
              contents: 'export default ' + JSON.stringify(targetUrl) + ';',
              loader: 'js'
            };
          }

          if (/\.css(\?.*)?$/i.test(targetUrl)) {
            await injectTailwindCss(targetUrl);
            return { contents: '', loader: 'js' };
          }

          var text = fileCache.get(targetUrl);
          if (typeof text !== 'string') {
            var found = await fetchFirstValid([targetUrl], false);
            if (!found) throw new Error('Could not load ' + targetUrl);
            text = found.text;
          }

          return {
            contents: text,
            loader: loaderForUrl(targetUrl)
          };
        });
      }
    };

    var result = await esbuildMod.build({
      entryPoints: [entryUrl],
      bundle: true,
      splitting: false,
      format: 'esm',
      jsx: 'automatic',
      target: ['es2020'],
      write: false,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      plugins: [httpPlugin]
    });

    if (!result.outputFiles || !result.outputFiles.length) {
      throw new Error('Empty bundle output from esbuild');
    }
    return rewriteLazyImports(result.outputFiles[0].text);
  }

  async function importCodeBlob(code) {
    var blob = new Blob([code], { type: 'application/javascript' });
    var blobUrl = URL.createObjectURL(blob);
    try {
      return await import(blobUrl);
    } finally {
      setTimeout(function () {
        try { URL.revokeObjectURL(blobUrl); } catch {}
      }, 15000);
    }
  }

  // Register on-demand lazy chunk loader so modals & sub-portals compile & cache only when opened!
  var activeVersionKey = 'v0';
  var chunkModulePromises = new Map();

  window.__PCN_LOAD_CHUNK__ = function (relPath) {
    var cleanRel = String(relPath || '').replace(/^\/+/, '');
    if (chunkModulePromises.has(cleanRel)) {
      return chunkModulePromises.get(cleanRel);
    }
    var promise = (async function () {
      var chunkCacheKey = 'chunk|' + appBase + '|' + activeVersionKey + '|' + cleanRel;
      var cachedChunk = await cacheGet(chunkCacheKey);
      var chunkCode = typeof cachedChunk === 'string' ? cachedChunk : null;
      if (!chunkCode) {
        var entryUrl = await resolveLocalUrl(new URL(cleanRel, appBase).href);
        chunkCode = await buildEntry(entryUrl, true);
        cacheSet(chunkCacheKey, chunkCode).catch(function () {});
      }
      return await importCodeBlob(chunkCode);
    })().catch(function (err) {
      chunkModulePromises.delete(cleanRel);
      throw err;
    });
    chunkModulePromises.set(cleanRel, promise);
    return promise;
  };

  try {
    var mainUrl = new URL('src/main.tsx', appBase).href;
    var versionTsUrl = new URL('src/utils/appVersion.ts', appBase).href;
    var indexCssUrl = new URL('src/index.css', appBase).href;
    var latestCacheKey = 'latest|' + appBase;

    // 1. Start Tailwind CDN script download immediately (non-blocking)
    var tailwindReady = ensureTailwindScript();

    // 2. FAST PATH: Check IndexedDB FIRST (zero network wait for repeat visitors!)
    var cachedEntry = await cacheGet(latestCacheKey);

    if (cachedEntry && cachedEntry.code && cachedEntry.versionKey) {
      activeVersionKey = cachedEntry.versionKey;
      if (cachedEntry.css) {
        injectCssText(indexCssUrl, cachedEntry.css);
      } else {
        void injectTailwindCss(indexCssUrl);
      }
      setStatus('অ্যাপ চালু হচ্ছে...');

      // Wait briefly for Tailwind (capped at 2s so a slow CDN never blocks mount)
      await Promise.race([
        tailwindReady,
        new Promise(function (r) { setTimeout(r, 2000); })
      ]);

      await importCodeBlob(cachedEntry.code);

      // Background Stale-While-Revalidate check: if a new ZIP version was uploaded, invalidate cache for next visit
      setTimeout(async function () {
        try {
          var freshVersion = await fetchFirstValid([versionTsUrl], true);
          if (freshVersion && simpleHash(freshVersion.text) !== cachedEntry.versionKey) {
            await cacheDelete(latestCacheKey);
          }
        } catch {}
      }, 2000);
      return;
    }

    // 3. COLD BOOT PATH (First visit or after ZIP update):
    // Run Tailwind CSS + esbuild-wasm init + entry probes IN PARALLEL, and defer 26 lazy modals & 2 portals!
    setStatus('অ্যাপ প্রথমবার প্রস্তুত হচ্ছে, কয়েক সেকেন্ড অপেক্ষা করুন...');

    var cssPromise = injectTailwindCss(indexCssUrl);
    var esbuildWarm = getEsbuild();

    var [mainProbe, versionProbe, cssText] = await Promise.all([
      fetchFirstValid([mainUrl], false),
      fetchFirstValid([versionTsUrl], false),
      cssPromise,
      esbuildWarm
    ]);

    if (!mainProbe) {
      throw new Error('Could not load ' + mainUrl);
    }

    activeVersionKey = simpleHash(
      (versionProbe ? versionProbe.text : '') + '|' + mainProbe.text.length
    );

    var bundledCode = await buildEntry(mainUrl, true);
    cacheSet(latestCacheKey, {
      versionKey: activeVersionKey,
      code: bundledCode,
      css: cssText || ''
    }).catch(function () {});

    await Promise.race([
      tailwindReady,
      new Promise(function (r) { setTimeout(r, 2500); })
    ]);

    setStatus('অ্যাপ চালু হচ্ছে...');
    await importCodeBlob(bundledCode);
  } catch (err) {
    console.error('[StaticRuntime] Boot failed:', err);
    failRuntime(
      'অ্যাপ চালু করতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করে পুনরায় লোড করুন।',
      'RUNTIME: ' + (err && err.message ? err.message : String(err))
    );
  }
})();
