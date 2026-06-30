# MineFactory

Website simples para publicar mods de Minecraft usando React, Vite, TailwindCSS e dados locais em JSON.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Editar mods

Os mods ficam em `src/data/mods.json`.

Arquivos de download devem ficar em `public/downloads` e ser referenciados no JSON com caminhos como:

```json
"/downloads/meu-mod-1.0.0-fabric.jar"
```

Imagens devem ficar em `public/images` e ser referenciadas com caminhos como:

```json
"/images/meu-mod-banner.png"
```

## Deploy

O projeto já inclui `vercel.json` para funcionar como SPA no Vercel ao abrir URLs internas diretamente.

## Admin com Discord

Crie um arquivo `.env` na raiz do projeto usando `.env.example` como base:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
VITE_ADMIN_DISCORD_ID=SEU_DISCORD_USER_ID
```

No Supabase, habilite o provider Discord em Authentication > Providers e configure a callback URL do projeto.

Rotas admin:

```txt
/admin/login
/admin/dashboard
/admin/unauthorized
```

O dashboard verifica a identidade OAuth do Discord via Supabase Auth. A permissao de admin nao e salva no localStorage.
