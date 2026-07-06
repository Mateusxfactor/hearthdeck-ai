export const HearthstoneData = {
  async fetchLatestCards() {
    try {
      const response = await fetch('https://api.hearthstonejson.com/v1/latest/ptBR/cards.collectible.json');
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const cards = await response.json();
      localStorage.setItem('hs_cards_cache', JSON.stringify(cards));
      return cards;
    } catch (error) {
      console.error("Erro ao sincronizar cartas:", error);
      const cached = localStorage.getItem('hs_cards_cache');
      return cached ? JSON.parse(cached) : [];
    }
  },
  getCache() {
    const cached = localStorage.getItem('hs_cards_cache');
    return cached ? JSON.parse(cached) : null;
  },
  saveUserCollection(collectionMap) {
    localStorage.setItem('hs_user_collection', JSON.stringify(collectionMap));
  },
  getUserCollection() {
    const cached = localStorage.getItem('hs_user_collection');
    return cached ? JSON.parse(cached) : {};
  }
};