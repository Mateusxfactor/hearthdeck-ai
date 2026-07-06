import React, { useState, useEffect } from 'react';
import { HearthstoneData } from './HearthstoneData';
import { PromptEngine } from './PromptEngine';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [classSelect, setClassSelect] = useState('HUNTER');
  const [archetype, setArchetype] = useState('Aggro / Face');
  const [mode, setMode] = useState('collection'); 
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    HearthstoneData.fetchLatestCards().then(() => {
      setLoading(false);
    });
  }, []);

  const handleImportCollection = () => {
    const lines = inputText.split('\n');
    const collectionMap = {};
    lines.forEach(line => {
      if (line.trim()) collectionMap[line.trim()] = 2;
    });
    HearthstoneData.saveUserCollection(collectionMap);
    alert('Coleção importada!');
  };

  const handleGenerate = () => {
    const prompt = PromptEngine.generateDeckBuildingPrompt(
      archetype, classSelect, 'Standard', mode === 'collection'
    );
    setGeneratedPrompt(prompt);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-white bg-gray-900 min-h-screen">Carregando cartas...</div>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">HearthDeck AI 🃏</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl mb-4">1. Configurar</h2>
          
          <select value={classSelect} onChange={(e) => setClassSelect(e.target.value)} className="w-full p-2 mb-4 bg-gray-700 rounded text-white">
            <option value="HUNTER">Caçador</option>
            <option value="MAGE">Mago</option>
            <option value="WARRIOR">Guerreiro</option>
          </select>

          <input type="text" value={archetype} onChange={(e) => setArchetype(e.target.value)} className="w-full p-2 mb-4 bg-gray-700 rounded text-white" placeholder="Arquétipo (Ex: Aggro)" />

          <div className="flex gap-4 mb-4">
            <label><input type="radio" checked={mode === 'collection'} onChange={() => setMode('collection')} className="mr-2"/> Coleção</label>
            <label><input type="radio" checked={mode === 'meta'} onChange={() => setMode('meta')} className="mr-2"/> Meta Completo</label>
          </div>

          {mode === 'collection' && (
            <div className="mb-4">
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows="3" className="w-full p-2 bg-gray-700 rounded text-xs" placeholder="Cole os IDs das suas cartas aqui (um por linha)" />
              <button onClick={handleImportCollection} className="bg-gray-700 px-3 py-1 mt-2 rounded">Salvar Cartas</button>
            </div>
          )}

          <button onClick={handleGenerate} className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded">Gerar Super Prompt</button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl">2. Copiar e Usar</h2>
            <button onClick={handleCopy} className={`px-4 py-1 rounded ${copied ? 'bg-green-600' : 'bg-blue-600'}`}>{copied ? 'Copiado!' : 'Copiar'}</button>
          </div>
          <textarea readOnly value={generatedPrompt} className="w-full flex-1 p-3 bg-gray-950 rounded text-sm text-gray-300 resize-none" />
        </div>
      </div>
    </div>
  );
}