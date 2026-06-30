export const supportedLanguages = ['pt-BR', 'en', 'es'];

export const translations = {
  'pt-BR': {
    header: {
      siteName: 'MineFactory',
      siteTag: 'Mods para Minecraft',
      mods: 'Mods',
      downloads: 'Downloads',
      github: 'GitHub',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
    },
    theme: {
      light: 'Modo claro',
      dark: 'Modo escuro',
    },
    language: {
      label: 'Traduções',
    },
    home: {
      heroBadge: 'Mods, versoes e downloads em um so lugar',
      heroTitle: 'MineFactory',
      heroCopy:
        'Um catalogo simples, rapido e responsivo para publicar seus mods, changelogs, dependencias e arquivos de download usando apenas JSON local.',
      stats: {
        mods: 'mods publicados',
        versions: 'versoes suportadas',
        loaders: 'loaders disponiveis',
      },
      cta: 'Ver catalogo',
      catalogLabel: 'Catalogo',
      catalogTitle: 'Mods disponiveis',
      results: (shown, total) => `${shown} de ${total} mods`,
    },
    search: {
      placeholder: 'Buscar mod pelo nome',
      clear: 'Limpar busca',
    },
    filters: {
      title: 'Filtros',
      allLoaders: 'Todos os loaders',
      allVersions: 'Todas as versoes',
      versionLabel: 'Filtrar por versao do Minecraft',
      clear: 'Limpar',
    },
    modCard: {
      view: 'Ver Mod',
      noResultsTitle: 'Nenhum mod encontrado',
      noResultsCopy: 'Ajuste a busca ou remova algum filtro para ver mais resultados.',
    },
    modPage: {
      backCatalog: 'Voltar ao catálogo',
      backMods: 'Voltar aos mods',
      versionsTitle: 'Versões disponíveis',
      versionPrefix: 'Versão',
      changelogTitle: 'Changelog',
      compatibilityTitle: 'Compatibilidade',
      dependenciesTitle: 'Dependências',
      noDependencies: 'Este mod não exige dependências.',
    },
    footer: {
      note: 'Dados locais em JSON, pronto para GitHub ou Vercel.',
    },
    adminLogin: {
      title: 'MineFactory',
      subtitle: 'Entre com Discord para acessar o painel administrativo.',
      button: 'Entrar com Discord',
      loading: 'Aguarde...',
      envWarning: 'Configure as variáveis do Supabase e do Discord admin no arquivo .env.',
      accessNote:
        'O painel libera acesso somente quando o Discord ID autenticado for igual ao VITE_ADMIN_DISCORD_ID configurado no ambiente.',
      adminLabel: 'Admin',
    },
    adminDashboard: {
      title: 'Dashboard',
      subtitle: 'Visao geral local do catalogo. A edicao dos mods pode entrar em uma proxima etapa.',
      panel: 'Painel admin',
      discordConnected: 'Discord conectado',
      logout: 'Sair',
      recentMods: 'Mods recentes',
      cards: {
        published: 'Mods publicados',
        downloads: 'Downloads',
        updates: 'Atualizacoes',
        projects: 'Projetos',
      },
    },
    unauthorized: {
      title: 'Acesso negado',
      copy: 'Este Discord nao esta autorizado a acessar o painel admin do MineFactory.',
      detectedId: 'Discord ID detectado',
      logout: 'Sair',
      back: 'Voltar ao site',
    },
  },
  en: {
    header: {
      siteName: 'MineFactory',
      siteTag: 'Minecraft Mods',
      mods: 'Mods',
      downloads: 'Downloads',
      github: 'GitHub',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode',
    },
    language: {
      label: 'Translations',
    },
    home: {
      heroBadge: 'Mods, versions, and downloads in one place',
      heroTitle: 'MineFactory',
      heroCopy:
        'A simple, fast, and responsive catalog for publishing your mods, changelogs, dependencies, and download files using only local JSON.',
      stats: {
        mods: 'published mods',
        versions: 'supported versions',
        loaders: 'available loaders',
      },
      cta: 'View catalog',
      catalogLabel: 'Catalog',
      catalogTitle: 'Available mods',
      results: (shown, total) => `${shown} of ${total} mods`,
    },
    search: {
      placeholder: 'Search mod by name',
      clear: 'Clear search',
    },
    filters: {
      title: 'Filters',
      allLoaders: 'All loaders',
      allVersions: 'All versions',
      versionLabel: 'Filter by Minecraft version',
      clear: 'Clear',
    },
    modCard: {
      view: 'View Mod',
      noResultsTitle: 'No mods found',
      noResultsCopy: 'Adjust the search or remove a filter to see more results.',
    },
    modPage: {
      backCatalog: 'Back to catalog',
      backMods: 'Back to mods',
      versionsTitle: 'Available versions',
      versionPrefix: 'Version',
      changelogTitle: 'Changelog',
      compatibilityTitle: 'Compatibility',
      dependenciesTitle: 'Dependencies',
      noDependencies: 'This mod does not require dependencies.',
    },
    footer: {
      note: 'Local JSON data, ready for GitHub or Vercel.',
    },
    adminLogin: {
      title: 'MineFactory',
      subtitle: 'Sign in with Discord to access the admin panel.',
      button: 'Sign in with Discord',
      loading: 'Please wait...',
      envWarning: 'Set the Supabase and admin Discord variables in your .env file.',
      accessNote:
        'The panel only unlocks when the authenticated Discord ID matches VITE_ADMIN_DISCORD_ID from the environment.',
      adminLabel: 'Admin',
    },
    adminDashboard: {
      title: 'Dashboard',
      subtitle: 'Local overview of the catalog. Mod editing can come in a later step.',
      panel: 'Admin panel',
      discordConnected: 'Discord connected',
      logout: 'Logout',
      recentMods: 'Recent mods',
      cards: {
        published: 'Published mods',
        downloads: 'Downloads',
        updates: 'Updates',
        projects: 'Projects',
      },
    },
    unauthorized: {
      title: 'Access denied',
      copy: 'This Discord account is not authorized to access the MineFactory admin panel.',
      detectedId: 'Detected Discord ID',
      logout: 'Logout',
      back: 'Back to site',
    },
  },
  es: {
    header: {
      siteName: 'MineFactory',
      siteTag: 'Mods para Minecraft',
      mods: 'Mods',
      downloads: 'Descargas',
      github: 'GitHub',
      openMenu: 'Abrir menu',
      closeMenu: 'Cerrar menu',
    },
    theme: {
      light: 'Modo claro',
      dark: 'Modo oscuro',
    },
    language: {
      label: 'Traducciones',
    },
    home: {
      heroBadge: 'Mods, versiones y descargas en un solo lugar',
      heroTitle: 'MineFactory',
      heroCopy:
        'Un catalogo simple, rapido y responsivo para publicar tus mods, changelogs, dependencias y archivos de descarga usando solo JSON local.',
      stats: {
        mods: 'mods publicados',
        versions: 'versiones compatibles',
        loaders: 'loaders disponibles',
      },
      cta: 'Ver catalogo',
      catalogLabel: 'Catalogo',
      catalogTitle: 'Mods disponibles',
      results: (shown, total) => `${shown} de ${total} mods`,
    },
    search: {
      placeholder: 'Buscar mod por nombre',
      clear: 'Limpiar busqueda',
    },
    filters: {
      title: 'Filtros',
      allLoaders: 'Todos los loaders',
      allVersions: 'Todas las versiones',
      versionLabel: 'Filtrar por version de Minecraft',
      clear: 'Limpiar',
    },
    modCard: {
      view: 'Ver mod',
      noResultsTitle: 'No se encontraron mods',
      noResultsCopy: 'Ajusta la busqueda o quita un filtro para ver mas resultados.',
    },
    modPage: {
      backCatalog: 'Volver al catalogo',
      backMods: 'Volver a los mods',
      versionsTitle: 'Versiones disponibles',
      versionPrefix: 'Version',
      changelogTitle: 'Changelog',
      compatibilityTitle: 'Compatibilidad',
      dependenciesTitle: 'Dependencias',
      noDependencies: 'Este mod no requiere dependencias.',
    },
    footer: {
      note: 'Datos locales en JSON, listo para GitHub o Vercel.',
    },
    adminLogin: {
      title: 'MineFactory',
      subtitle: 'Inicia sesion con Discord para acceder al panel admin.',
      button: 'Entrar con Discord',
      loading: 'Espera...',
      envWarning: 'Configura las variables de Supabase y del Discord admin en tu archivo .env.',
      accessNote:
        'El panel solo se desbloquea cuando el ID de Discord autenticado coincide con VITE_ADMIN_DISCORD_ID del entorno.',
      adminLabel: 'Admin',
    },
    adminDashboard: {
      title: 'Panel',
      subtitle: 'Resumen local del catalogo. La edicion de mods puede llegar en un paso posterior.',
      panel: 'Panel admin',
      discordConnected: 'Discord conectado',
      logout: 'Salir',
      recentMods: 'Mods recientes',
      cards: {
        published: 'Mods publicados',
        downloads: 'Descargas',
        updates: 'Actualizaciones',
        projects: 'Proyectos',
      },
    },
    unauthorized: {
      title: 'Acceso denegado',
      copy: 'Esta cuenta de Discord no esta autorizada para acceder al panel admin de MineFactory.',
      detectedId: 'ID de Discord detectado',
      logout: 'Salir',
      back: 'Volver al sitio',
    },
  },
};

export function getTranslation(language) {
  return translations[language] || translations['pt-BR'];
}
