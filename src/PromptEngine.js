import { HearthstoneData } from './HearthstoneData';

export const PromptEngine = {
  generateDeckBuildingPrompt(archetype, playerClass, format = 'Standard', useCollection = true) {
    const allCards = HearthstoneData.getCache() || [];
    const userCollection = HearthstoneData.getUserCollection();

    const availableCards = allCards.filter(card => {
      if (card.cardClass !== playerClass.toUpperCase() && card.cardClass !== 'NEUTRAL') return false;
      if (format === 'Standard' && card.set === 'WILD') return false; 
      if (useCollection) {
        return userCollection[card.id] && userCollection[card.id] > 0;
      }
      return true;
    });

    const cardListString = availableCards
      .map(c => `- ${c.name} (Custo: ${c.cost}, Tipo: ${c.type}${useCollection ? `, Possuo: ${userCollection[c.id]}` : ''})`)
      .join('\n');

    return `Você é um Especialista Lendário em Hearthstone.
    
CONTEXTO:
- Classe: ${playerClass}
- Arquétipo desejado: ${archetype}
- Formato: ${format}

CARTAS DISPONÍVEIS:
${cardListString || 'Nenhuma carta carregada.'}

SUA MISSÃO:
1. Monte um deck vitorioso com exatamente 30 cartas baseando-se no arquétipo "${archetype}".
2. Maximize curvas de mana eficientes e combos sinérgicos usando APENAS as cartas listadas acima.
3. Forneça: Nome do Deck, Lista das 30 cartas, principal condição de vitória e Guia de Mulligan.`;
  }
};