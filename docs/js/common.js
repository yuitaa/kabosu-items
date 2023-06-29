const ENCHANT_NAMES = {
  aqua_affinity: "水中採掘",
  bane_of_arthropods: "虫特効",
  binding_curse: "束縛の呪い",
  blast_protection: "爆発耐性",
  channeling: "召雷",
  depth_strider: "水中歩行",
  efficiency: "効率強化",
  feather_falling: "落下耐性",
  fire_aspect: "火属性",
  fire_protection: "火炎耐性",
  flame: "フレイム",
  fortune: "幸運",
  frost_walker: "氷渡り",
  impaling: "水生特効",
  infinity: "無限",
  knockback: "ノックバック",
  looting: "ドロップ増加",
  loyalty: "忠誠",
  luck_of_the_sea: "宝釣り",
  lure: "入れ食い",
  mending: "修繕",
  multishot: "拡散",
  piercing: "貫通",
  power: "射撃ダメージ増加",
  projectile_protection: "飛び道具耐性",
  protection: "ダメージ軽減",
  punch: "パンチ",
  quick_charge: "高速装填",
  respiration: "水中呼吸",
  riptide: "激流",
  sharpness: "ダメージ増加",
  silk_touch: "シルクタッチ",
  smite: "アンデッド特効",
  soul_speed: "ソウルスピード",
  sweeping: "範囲ダメージ増加",
  swift_sneak: "スニーク速度上昇",
  thorns: "棘の鎧",
  unbreaking: "耐久力",
  vanishing_curse: "消滅の呪い",
};

const ENCHANTS_AMBIGUOUS = ["火炎耐性", "幸運", "修繕", "水中呼吸"];

const EFFECTS_AMBIGUOUS = ["火炎耐性", "幸運", "水中呼吸"];

const ATTRIBUTE_NAMES = {
  "generic.armor": "防具",
  "generic.armor_toughness": "防具強度",
  "generic.attack_damage": "攻撃力",
  "generic.attack_knockback": "ノックバック",
  "generic.attack_speed": "攻撃速度",
  "generic.flying_speed": "飛行速度",
  "generic.follow_range": "Mobの追跡範囲",
  "generic.knockback_resistance": "ノックバック耐性",
  "generic.luck": "幸運",
  "generic.max_health": "最大体力",
  "generic.movement_speed": "移動速度",
};

const ATTRIBUTE_SLOT = {
  chest: "（胴体に装備したとき）",
  feet: "（足に装備したとき）",
  head: "（頭に装備したとき）",
  legs: "（脚に装備したとき）",
  mainhand: "（利き手に持ったとき）",
  offhand: "（オフハンドに持ったとき）",
};

const EFFECT_NAME = [
  "",
  "移動速度上昇",
  "移動速度低下",
  "採掘速度上昇",
  "採掘速度低下",
  "攻撃力上昇",
  "即時回復",
  "即時ダメージ",
  "跳躍力上昇",
  "吐き気",
  "再生能力",
  "耐性",
  "火炎耐性",
  "水中呼吸",
  "透明化",
  "盲目",
  "暗視",
  "空腹",
  "弱体化",
  "毒",
  "衰弱",
  "体力増強",
  "衝撃吸収",
  "満腹度回復",
  "発光",
  "浮遊",
  "幸運",
  "不運",
  "落下速度低下",
  "コンジットパワー",
  "イルカの好意",
  "不吉な予感",
  "村の英雄",
  "暗闇",
];

const NOT_FOUND_FALLBACK = {
  display: {
    Name: '{"text":"🔥 エラー！ 🔥","color":"red"}',
    Lore: ['{"text":"アイテムが見つかりませんでした！"}'],
  },
};

const DATABASE_URL =
  "https://script.google.com/macros/s/AKfycbwv5_oOOSN-YhI9_ZvdG4Webfd9vrOCrhoGuw7dPB90oXhLpqt3xx-Kye73a6EB1ZnrAQ/exec";

function fetchDataWithCache(url) {
  const cacheKey = `cache_${url}`;
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    return Promise.resolve(JSON.parse(cachedData));
  }
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    });
}
