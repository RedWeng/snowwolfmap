<script>
/* Snow Wolf Boy — global data store (localStorage + JSON catalogs) */
window.SWB = (function(){
  const KEY = 'swb_state_v1';
  const state = {
    stats: { C: 0, E: 0, T: 0 },   // Courage, Empathy, Truth
    outfit: null,                  // outfitId
    inventory: [],                 // array of itemIds (catalog ids)
    lang: 'zh'                     // 'zh' | 'en'
  };
  let items = [], outfits = [];
  const listeners = new Set();

  function loadState(){
    try{ const s = JSON.parse(localStorage.getItem(KEY)||'{}');
      Object.assign(state, s||{});
    }catch(e){}
  }
  function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function onChange(fn){ listeners.add(fn); }
  function emit(){ saveState(); listeners.forEach(fn=>fn(getState())); }

  function getState(){ return JSON.parse(JSON.stringify(state)); }
  function setLang(l){ state.lang = (l==='en'?'en':'zh'); emit(); }

  async function init(catalog={
    itemsUrl:'assets/items.json',
    outfitsUrl:'assets/outfits.json'
  }){
    loadState();
    items   = await fetch(catalog.itemsUrl).then(r=>r.json());
    outfits = await fetch(catalog.outfitsUrl).then(r=>r.json());
    // 首次給一點入門道具
    if(!state.inventory.length){
      state.inventory = ['navigation_crystal','magic_fruit','comfort_food','time_book','wolf_whistle'];
    }
    emit();
  }

  function getItems(){ return items.slice(); }
  function getOutfits(){ return outfits.slice(); }
  function getItemById(id){ return items.find(i=>i.id===id); }
  function getOutfitById(id){ return outfits.find(o=>o.id===id); }

  function addStat(eff={}){ ['C','E','T'].forEach(k=>{ if(eff[k]) state.stats[k]+=eff[k]; }); emit(); }
  function addItem(id){ if(!state.inventory.includes(id)){ state.inventory.push(id); emit(); } }
  function useItem(id){
    const idx = state.inventory.indexOf(id);
    if(idx>-1){
      const it = getItemById(id);
      if(it && it.effect) addStat(it.effect);
      // 消耗型：示範只有魔法果子與藥劑、料理、沙漏會消耗
      const consumable = ['magic_fruit','time_recall_potion','comfort_food','time_hourglass'];
      if(consumable.includes(id)) state.inventory.splice(idx,1);
      emit();
      return it;
    }
    return null;
  }

  function equip(outfitId){
    state.outfit = outfitId;
    const of = getOutfitById(outfitId);
    if(of && of.effect) addStat(of.effect);
    emit();
  }

  function statLabel(k){
    return {C:'勇氣 Courage',E:'同理 Empathy',T:'真實 Truth'}[k]||k;
  }

  return { init, onChange, getState, setLang,
           getItems, getOutfits, getItemById, getOutfitById,
           addItem, useItem, equip, addStat, statLabel };
})();
</script>
