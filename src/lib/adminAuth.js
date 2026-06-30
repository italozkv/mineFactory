const ADMIN_DISCORD_ID = import.meta.env.VITE_ADMIN_DISCORD_ID;

export function getDiscordUserId(user) {
  if (!user) {
    return null;
  }

  const discordIdentity = user.identities?.find((identity) => identity.provider === 'discord');

  return (
    discordIdentity?.provider_id ||
    discordIdentity?.identity_data?.sub ||
    discordIdentity?.identity_data?.id ||
    null
  );
}

export function isAdminUser(user) {
  const discordId = getDiscordUserId(user);

  return Boolean(ADMIN_DISCORD_ID && discordId && discordId === ADMIN_DISCORD_ID);
}

export function getAdminEnvStatus() {
  return {
    hasSupabaseUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
    hasSupabaseAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
    hasAdminDiscordId: Boolean(ADMIN_DISCORD_ID),
  };
}
