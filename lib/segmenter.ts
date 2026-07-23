export class EnhancedSegmenter {
  private segmenter: Intl.Segmenter | null = null;
  private customWords: Set<string>;
  private maxWordLen: number;

  constructor(customWords: string[] = [], locale: string = "zh-TW") {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      this.segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    }
    // 將自訂詞整理成 Set 提高比對速度
    this.customWords = new Set(customWords);
    // 找出自訂詞中最長有幾個字
    this.maxWordLen = Math.max(...customWords.map((w) => w.length), 0);
  }

  segment(text: string): string[] {
    if (!text) return [];

    // 1. 先用原生 API 進行初次斷詞
    let rawTokens: string[] = [];
    if (this.segmenter) {
      rawTokens = Array.from(this.segmenter.segment(text)).map((s) => s.segment);
    } else {
      rawTokens = Array.from(text);
    }

    // 2. 後處理：將被誤切的詞合併回去
    const result: string[] = [];
    let i = 0;

    while (i < rawTokens.length) {
      let matched = false;

      // 試著向前組合多個 rawToken，看是否能拼成自訂詞
      for (let len = this.maxWordLen; len > 1; len--) {
        // 取出當前位置開始的 len 個 token 嘗試拼起來
        const candidate = rawTokens.slice(i, i + len).join("");

        if (this.customWords.has(candidate)) {
          result.push(candidate);
          i += len; // 成功匹配，一次跳過這些被合併的 Token
          matched = true;
          break;
        }
      }

      // 如果拼不出自訂詞，就保留原生的斷詞結果
      if (!matched) {
        result.push(rawTokens[i]);
        i++;
      }
    }

    return result;
  }
}

export const DEFAULT_IGNORE_DICT = [
  "神奇海螺",
  "海綿寶寶",
  "派大星",
  "章魚哥",
  "蟹老闆",
  "皮老闆",
  "珊迪",
  "小蝸",
  "蟹堡王",
  "美味蟹堡",
  "開發者",
  "輕量",
  "全棧",
  "生成式AI",
  "胖呆",
  "很嗆",
  "遜咖",
  "美好",
  "勁爆",
  "不對",
  "上班",
  "S3E03",
];
