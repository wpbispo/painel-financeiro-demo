/* Deixa o site instalável como aplicativo e abrindo sem internet.
   - Com internet: sempre busca a página e a planilha novas (os números ficam sempre atualizados).
   - Sem internet: mostra a última planilha guardada, e a página avisa que pode estar desatualizada.
   Nome do guardado é exclusivo deste site (os outros sites da loja ficam no mesmo endereço). */
var PREFIXO = 'demo-financeiro-';
var VERSAO = PREFIXO + 'v1';
var BASE = ['./', 'app/manifest.webmanifest', 'app/icone-192.png', 'app/icone-512.png', 'app/icone-180.png'];
var EXTERNOS = ["https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSAO).then(function(c){
    return Promise.all(BASE.map(function(u){ return c.add(u).catch(function(){}); }).concat(
      EXTERNOS.map(function(u){
        return fetch(u, {mode:'no-cors'}).then(function(r){ return c.put(u, r); }).catch(function(){});
      })));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k.indexOf(PREFIXO) === 0 && k !== VERSAO; })
      .map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function chave(url){ var u = new URL(url); u.search = ''; u.hash = ''; return u.href; }

/* planilha: tenta a internet; se falhar, devolve a guardada marcada como "sem internet" */
function planilha(req){
  var k = chave(req.url);
  return fetch(req, {cache:'no-store'}).then(function(res){
    if (res.ok) {
      var copia = res.clone();
      copia.arrayBuffer().then(function(b){
        var h = new Headers(copia.headers);
        h.set('X-Guardado-Em', new Date().toISOString());
        return caches.open(VERSAO).then(function(c){ return c.put(k, new Response(b, {status:200, headers:h})); });
      }).catch(function(){});
    }
    return res;
  }).catch(function(){
    return caches.open(VERSAO).then(function(c){ return c.match(k); }).then(function(g){
      if (!g) return Response.error();
      return g.arrayBuffer().then(function(b){
        var h = new Headers(g.headers);
        h.set('X-Sem-Internet', '1');
        return new Response(b, {status:200, headers:h});
      });
    });
  });
}

/* página e arquivos do próprio site: internet primeiro, guardado se falhar */
function paginaOuArquivo(req){
  var k = req.mode === 'navigate' ? chave(new URL('./', self.registration.scope).href) : chave(req.url);
  return fetch(req).then(function(res){
    if (res.ok && res.type === 'basic') {
      var copia = res.clone();
      caches.open(VERSAO).then(function(c){ c.put(k, copia); });
    }
    return res;
  }).catch(function(){
    return caches.open(VERSAO).then(function(c){ return c.match(k, {ignoreSearch:true}); })
      .then(function(g){ return g || Response.error(); });
  });
}

/* bibliotecas de fora (versão fixa): usa a guardada, busca só se não tiver */
function externo(req){
  return caches.open(VERSAO).then(function(c){
    return c.match(req.url).then(function(g){
      return g || fetch(req).then(function(res){ c.put(req.url, res.clone()); return res; });
    });
  });
}

self.addEventListener('fetch', function(e){
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin === location.origin) {
    if (!u.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
    if (/\.xlsx$/i.test(u.pathname)) e.respondWith(planilha(r));
    else e.respondWith(paginaOuArquivo(r));
  } else if (EXTERNOS.indexOf(r.url) >= 0) {
    e.respondWith(externo(r));
  }
});
