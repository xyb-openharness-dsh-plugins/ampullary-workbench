/* 小壶宝 AmpuPal · 演示数据唯一来源（G2 原型阶段）
 *
 * 规矩（LESSONS L30）：数据只有一个来源。原型不自己写死数值，
 * 一律由 scripts/build-prototype-data.mjs 从这里生成 prototypes/v0.2/demo-data.js；
 * G3 落库时同一个文件再生成 demo/demo-data.sqlite，两处逐点 deepStrictEqual。
 *
 * 全部为合成资料，不含任何真实患者信息。试验条目一律用 DEMO-* 编号并显式标注
 * 「演示条目，不是真实登记」——绝不编造 NCT 号。
 */

export const demoData = {
  today: '2026-10-26',
  stage: '阶段 2 · HTML 原型（G2 未签）',

  profile: {
    name: '陈慧兰',
    initial: '陈',
    age: 63,
    sex: '女',
    dx: '壶腹部腺癌',
    tag: '肠型 · 报告原文 pT2N1M0 · 2026-02-11 胰十二指肠切除',
    note: '术后 8 个月 · 正在随访'
  },

  /* 指标线：cat 只用于分组显示，不是等级 */
  catOrder: ['术前减黄段', '肿瘤与营养', '代谢'],
  metricOrder: ['tbil', 'dbil', 'ca199', 'alb', 'weight', 'glu', 'hba1c'],
  metrics: {
    tbil: {
      id: 'tbil', name: '总胆红素', short: 'TBIL', cat: '术前减黄段', unit: 'μmol/L',
      color: '#a9761c', dec: 0, refHigh: 21, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 198 }, { d: '2026-01-14', v: 156 }, { d: '2026-01-17', v: 122 },
        { d: '2026-01-20', v: 96 }, { d: '2026-01-23', v: 74 }, { d: '2026-01-26', v: 62 },
        { d: '2026-02-09', v: 34 }, { d: '2026-03-05', v: 24 }, { d: '2026-04-20', v: 18 },
        { d: '2026-06-15', v: 15 }, { d: '2026-08-10', v: 16 }, { d: '2026-10-20', v: 19 }
      ]
    },
    dbil: {
      id: 'dbil', name: '直接胆红素', short: 'DBIL', cat: '术前减黄段', unit: 'μmol/L',
      color: '#c98a2e', dec: 0, refHigh: 7, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 152 }, { d: '2026-01-17', v: 92 }, { d: '2026-01-26', v: 43 },
        { d: '2026-03-05', v: 12 }, { d: '2026-06-15', v: 6 }, { d: '2026-10-20', v: 8 }
      ]
    },
    ca199: {
      id: 'ca199', name: 'CA19-9', short: 'CA19-9', cat: '肿瘤与营养', unit: 'U/mL',
      color: '#8b5e83', dec: 0, refHigh: 37, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 88 }, { d: '2026-02-09', v: 54 }, { d: '2026-03-05', v: 31 },
        { d: '2026-04-20', v: 27 }, { d: '2026-06-15', v: 24 }, { d: '2026-08-10', v: 26 },
        { d: '2026-09-15', v: 38 }, { d: '2026-10-20', v: 61 }
      ]
    },
    alb: {
      id: 'alb', name: '白蛋白', short: 'ALB', cat: '肿瘤与营养', unit: 'g/L',
      color: '#2f6f66', dec: 1, refLow: 40, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 36.2 }, { d: '2026-02-09', v: 34.8 }, { d: '2026-03-05', v: 31.4 },
        { d: '2026-04-20', v: 34.1 }, { d: '2026-06-15', v: 36.6 }, { d: '2026-08-10', v: 38.2 },
        { d: '2026-10-20', v: 37.4 }
      ]
    },
    weight: {
      id: 'weight', name: '体重', short: '体重', cat: '肿瘤与营养', unit: 'kg',
      color: '#4a7a9b', dec: 1, kind: 'num',
      source: '家里体脂秤 / 门诊体重（用户自测）',
      points: [
        { d: '2026-01-08', v: 58.5 }, { d: '2026-02-09', v: 58.0 }, { d: '2026-03-05', v: 52.0 },
        { d: '2026-03-26', v: 53.2 }, { d: '2026-04-20', v: 54.8 }, { d: '2026-05-25', v: 55.6 },
        { d: '2026-07-02', v: 56.4 }, { d: '2026-08-10', v: 57.0 }, { d: '2026-09-15', v: 57.2 },
        { d: '2026-10-20', v: 56.8 }
      ]
    },
    glu: {
      id: 'glu', name: '空腹血糖', short: 'FPG', cat: '代谢', unit: 'mmol/L',
      color: '#a3241b', dec: 1, refHigh: 6.1, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 5.4 }, { d: '2026-03-05', v: 5.8 }, { d: '2026-06-15', v: 6.4 },
        { d: '2026-08-10', v: 7.1 }, { d: '2026-10-20', v: 7.6 }
      ]
    },
    hba1c: {
      id: 'hba1c', name: 'HbA1c', short: 'HbA1c', cat: '代谢', unit: '%',
      color: '#8a5a0c', dec: 1, refHigh: 6.0, kind: 'num',
      source: '化验单原件（外院检验科）',
      points: [
        { d: '2026-01-08', v: 5.7 }, { d: '2026-06-15', v: 6.4 }, { d: '2026-10-20', v: 6.9 }
      ]
    }
  },

  /* 治疗条：独立成行；关掉不影响任何指标线的路径（R8） */
  bands: [
    { kind: 'drain', from: '2026-01-12', to: '2026-02-10', label: 'ERCP 塑料支架（10 cm 直型）' },
    { kind: 'surgery', from: '2026-02-11', to: '2026-02-11', label: '胰十二指肠切除（PD）' },
    { kind: 'recovery', from: '2026-02-12', to: '2026-03-01', label: '术后住院' }
  ],

  /* 事件竖线：只写「哪天发生了什么」，不写判读 */
  marks: [
    { d: '2026-01-12', label: 'ERCP 支架置入' },
    { d: '2026-02-11', label: '手术日' },
    { d: '2026-02-17', label: '报告记录胰瘘 B 级' },
    { d: '2026-06-18', label: '术后 4 个月 CT' },
    { d: '2026-10-20', label: '最近一次复查' }
  ],

  /* 定性依据 */
  evidence: [
    { id: 'E1', kind: '内镜 + 活检', date: '2026-01-06', org: '外院消化内科',
      quote: '十二指肠主乳头处见菜花样肿物，约 2.0 cm，取活检 4 块。',
      path: '病理号 A26-0113' },
    { id: 'E2', kind: '病理（活检）', date: '2026-01-09', org: '外院病理科',
      quote: '（十二指肠乳头）腺癌，中分化。免疫组化：CK7(+)，CK20(+)，CDX2(+)，MUC2(+)，MUC5AC(-)。',
      path: '病理号 A26-0113' },
    { id: 'E3', kind: '影像（增强 CT）', date: '2026-01-05', org: '外院放射科',
      quote: '壶腹部见软组织密度影，约 2.3 cm，胆总管及胰管扩张（双管征）。',
      path: '影像号 CT260105-771' },
    { id: 'E4', kind: '病理（术后）', date: '2026-02-18', org: '外院病理科',
      quote: '（胰十二指肠切除标本）壶腹部腺癌，中分化，肠型；侵及十二指肠固有肌层，未累及胰腺；切缘未见癌；淋巴结 3/18 见癌转移。',
      path: '病理号 S26-0402' }
  ],

  pathology: {
    subtype: 'intestinal',
    subtypeLabel: '肠型（报告原文写"肠型"）',
    grade: '中分化',
    invasion: '侵及十二指肠固有肌层，未累及胰腺',
    margin: 'R0（报告原文："切缘未见癌"）',
    nodes: '3/18（报告原文）',
    ihc: [
      { name: 'CK7', value: '+', note: '报告原文' },
      { name: 'CK20', value: '+', note: '报告原文' },
      { name: 'CDX2', value: '+', note: '报告原文' },
      { name: 'MUC1', value: '未做', note: '本份报告未列' },
      { name: 'MUC2', value: '+', note: '报告原文' },
      { name: 'MUC5AC', value: '−', note: '报告原文' }
    ],
    source: '病理号 S26-0402 · 2026-02-18 · 外院病理科'
  },

  /* 三套分期并列：只存医生写的原文，不换算 */
  stages: [
    { system: 'AJCC 8th · 壶腹（Ampulla of Vater）', written: 'pT2 N1 M0', who: '病理科报告（2026-02-18）',
      basis: '报告原文"侵及十二指肠固有肌层"对应 T2 行；本台只并列，不代填',
      original: '该体系 T1a 限于壶腹或 Vater 壶腹；T1b 越过括约肌进入十二指肠黏膜下层；T2 侵及十二指肠固有肌层；T3 侵及胰腺 ≤0.5 cm；T4 侵及胰腺 >0.5 cm 或胰周其他组织。',
      cite: 'AJCC Cancer Staging Manual, 8th ed. · 壶腹章节 · 未取得原件，据二次来源 · 页码待核' },
    { system: 'AJCC 8th · 远端胆管', written: '未记录', who: '', basis: '医生未按这一套记录', original: '', cite: '' },
    { system: 'AJCC 8th · 胰腺', written: '未记录', who: '', basis: '医生未按这一套记录', original: '', cite: '' }
  ],

  /* 术前引流 */
  drains: [
    { id: 'D1', modality: 'ERCP 塑料支架', date: '2026-01-12', detail: '10 cm 直型塑料支架，主乳头置入',
      by: '外院消化内科', note: '术后当天腹痛，予观察', status: '手术时取出' },
    { id: 'D2', modality: 'PTCD', date: '', detail: '', by: '', note: '未做过', status: '' }
  ],

  surgery: {
    date: '2026-02-11',
    type: '胰十二指肠切除（PD，未保留幽门）',
    team: '外院肝胆胰外科',
    margin: 'R0（报告原文："切缘未见癌"）',
    nodes: '清扫 18 枚，阳性 3 枚（报告原文）',
    recon: '胰肠吻合（黏膜对黏膜）、胆肠吻合、胃空肠吻合',
    tubes: [
      { site: '胰肠吻合口旁引流', day3: '85 mL', day5: '40 mL', removed: '2026-02-24' },
      { site: '胆肠吻合口旁引流', day3: '30 mL', day5: '10 mL', removed: '2026-02-20' },
      { site: '胃管', day3: '留置', day5: '留置', removed: '2026-02-25' }
    ],
    los: '2026-02-11 → 2026-03-01（18 天）'
  },

  complications: [
    { id: 'C1', type: '胰瘘（CR-POPF）', grade: 'B 级', date: '2026-02-17', by: '外科主管医生（病程记录）',
      detail: '引流液淀粉酶 1 240 U/L（报告原文），继续引流 + 肠外营养',
      scale: 'ISGPS 2016 定义与分级（Bassi C, et al. Surgery 2017）',
      scaleText: '该标准把术后胰瘘分为生化漏与 B、C 两级临床相关胰瘘：B 级需调整临床处理、引流持续 >3 周或需经皮/内镜穿刺；C 级需再次手术或出现器官衰竭。具体判定由外科按病历记录。',
      cite: 'ISGPS 2016 修订版 · 未取得原件，据二次来源 · 页码待核' },
    { id: 'C2', type: '胃排空延迟（DGE）', grade: 'B 级', date: '2026-02-24', by: '外科主管医生（病程记录）',
      detail: '术后第 13 天仍需胃管减压，进食流质后呕吐 1 次',
      scale: 'ISGPS 2007 DGE 定义（Wente MN, et al. Surgery 2007）',
      scaleText: '该标准按"胃管留置天数 / 是否需再次置管 / 是否呕吐 / 能否恢复固体饮食"分 A、B、C 三级，并需排除机械性梗阻。具体判定由外科按病历记录。',
      cite: 'ISGPS 2007 · 未取得原件，据二次来源 · 页码待核' },
    { id: 'C3', type: '胆肠吻合口狭窄', grade: '未记录', date: '', by: '',
      detail: '截至 2026-10-26 无该记录', scale: '', scaleText: '', cite: '' }
  ],

  imaging: [
    { id: 'I1', date: '2026-01-05', modality: '增强 CT（腹盆）', org: '外院放射科',
      quote: '壶腹部见软组织密度影，约 2.3 cm，胆总管及胰管扩张（双管征）；肝内未见明确占位。',
      lesions: [{ site: '壶腹部', size: '2.3 cm' }] },
    { id: 'I2', date: '2026-06-18', modality: '增强 CT（腹盆）', org: '外院放射科',
      quote: '胰十二指肠切除术后改变；术区未见明确肿瘤复发征象；肝内 S6 见 4 mm 低密度影，建议随访。',
      lesions: [{ site: '肝 S6', size: '4 mm' }] },
    { id: 'I3', date: '2026-10-20', modality: '增强 CT（腹盆）', org: '外院放射科',
      quote: '肝内 S6 低密度影 8 mm，较 2026-06-18 片增大；术区未见明确异常强化。',
      lesions: [{ site: '肝 S6', size: '8 mm' }] }
  ],

  visits: [
    { on: '2026-03-26', dept: '肝胆胰外科', planned: false, what: '术后 6 周复查，拆线后首次门诊' },
    { on: '2026-06-18', dept: '肝胆胰外科', planned: false, what: '术后 4 个月复查（CT + 化验）' },
    { on: '2026-09-15', dept: '肝胆胰外科', planned: false, what: '术后 7 个月复查' },
    { on: '2026-11-05', dept: '肝胆胰外科', planned: true, what: '按上次医嘱的下一次复查（日期由医嘱原文推算，未改）' },
    { on: '2026-11-12', dept: '营养科', planned: true, what: '体重与饮食评估' }
  ],

  questions: [
    { id: 'Q1', text: '肝内那个影子从 4 mm 到 8 mm，下一次复查安排在什么时候？', from: 'S7 生成', done: false },
    { id: 'Q2', text: 'CA19-9 从 26 到 38 再到 61，除了抽血还需要做什么检查？', from: 'S8 生成', done: false },
    { id: 'Q3', text: '现在吃的胰酶是随餐两粒，我该怎么判断够不够？', from: 'S6 生成', done: false },
    { id: 'Q4', text: '血糖从 5.8 到 7.6，要不要看内分泌科？', from: 'S6 生成', done: true }
  ],

  /* 试验匹配档案：只有「已确认入库」的字段才在这里（35 号 §二.1） */
  matchProfile: [
    { key: 'dx', label: '诊断', value: '壶腹部腺癌', confirmed: true, on: true, layer: 'struct' },
    { key: 'site', label: '原发部位', value: '十二指肠大乳头（Vater 壶腹）', confirmed: true, on: true, layer: 'struct' },
    { key: 'subtype', label: '病理亚型', value: '肠型', confirmed: true, on: true, layer: 'text' },
    { key: 'stage', label: '病理分期（报告原文）', value: 'pT2 N1 M0（AJCC 8th 壶腹）', confirmed: true, on: true, layer: 'struct' },
    { key: 'margin', label: '切缘', value: 'R0', confirmed: true, on: true, layer: 'struct' },
    { key: 'lines', label: '既往系统治疗线数', value: '0（术后未做辅助治疗）', confirmed: true, on: true, layer: 'struct' },
    { key: 'msi', label: 'MSI / dMMR', value: '未检测', confirmed: false, on: false, layer: 'struct' },
    { key: 'her2', label: 'HER2', value: '未检测', confirmed: false, on: false, layer: 'struct' },
    { key: 'ecog', label: 'ECOG', value: '医生记录 1 分（2026-09-15）', confirmed: true, on: true, layer: 'struct' },
    { key: 'organs', label: '器官功能', value: '总胆红素 19 μmol/L、白蛋白 37.4 g/L（2026-10-20）', confirmed: true, on: true, layer: 'text' },
    { key: 'age', label: '年龄', value: '63 岁', confirmed: true, on: true, layer: 'struct' },
    { key: 'prior', label: '既往手术', value: '2026-02-11 胰十二指肠切除', confirmed: true, on: true, layer: 'text' }
  ],

  /* 试验条目：全部演示条目，绝不编造 NCT 号 */
  trials: [
    {
      key: 'DEMO-AMP-001', title: '壶腹来源腺癌术后辅助治疗观察（演示条目）',
      sponsor: '演示用虚构申办方', phase: 'III 期', status: '招募中（演示）',
      tumor: '壶腹部腺癌', tumorScope: 'specific',
      url: 'https://example.invalid/demo/amp-001',
      criteria: [
        { key: 'dx', text: '病理确诊壶腹部腺癌', expect: 'contain:壶腹部腺癌', layer: 'struct' },
        { key: 'stage', text: '术后病理分期 pT2–T4 或 N+', expect: 'stage_pT2N1', layer: 'struct' },
        { key: 'margin', text: '切缘 R0', expect: 'contain:R0', layer: 'struct' },
        { key: 'lines', text: '未接受过系统治疗', expect: 'contain:0', layer: 'struct' },
        { key: 'ecog', text: 'ECOG 0–1', expect: 'contain:1 分', layer: 'struct' },
        { key: 'age', text: '年龄 ≥18 岁', expect: 'age_ge_18', layer: 'struct' },
        { key: 'msi', text: '需提供 MSI 检测结果', expect: 'have:msi', layer: 'struct' },
        { key: 'text', text: '研究者判断预期生存 ≥12 周', expect: 'text:生存', layer: 'text' }
      ]
    },
    {
      key: 'DEMO-BTC-014', title: '晚期胆道恶性肿瘤联合治疗研究（含壶腹来源，演示条目）',
      sponsor: '演示用虚构申办方', phase: 'II 期', status: '招募中（演示）',
      tumor: '胆道恶性肿瘤（含壶腹来源）', tumorScope: 'basket',
      basketText: '该项入组要求里写的是：胆道恶性肿瘤（含壶腹来源腺癌）',
      url: 'https://example.invalid/demo/btc-014',
      criteria: [
        { key: 'dx', text: '组织学确诊胆道恶性肿瘤（含壶腹来源）', expect: 'contain:壶腹', layer: 'struct' },
        { key: 'lines', text: '既往系统治疗 ≤1 线', expect: 'contain:0', layer: 'struct' },
        { key: 'organs', text: '总胆红素 ≤1.5×ULN', expect: 'tbil_le_1_5uln', layer: 'struct' },
        { key: 'ecog', text: 'ECOG 0–1', expect: 'contain:1 分', layer: 'struct' },
        { key: 'her2', text: '需提供 HER2 状态', expect: 'have:her2', layer: 'struct' },
        { key: 'text', text: '可测量病灶（RECIST 1.1）', expect: 'text:可测量', layer: 'text' }
      ]
    },
    {
      key: 'DEMO-SBA-007', title: '小肠腺癌二线治疗研究（演示条目）',
      sponsor: '演示用虚构申办方', phase: 'II 期', status: '招募中（演示）',
      tumor: '小肠腺癌', tumorScope: 'basket',
      basketText: '该项入组要求里写的是：小肠腺癌（原发部位为小肠）',
      url: 'https://example.invalid/demo/sba-007',
      criteria: [
        { key: 'dx', text: '病理确诊小肠腺癌', expect: 'contain:小肠腺癌', layer: 'struct' },
        { key: 'lines', text: '既往至少 1 线系统治疗', expect: 'lines_ge_1', layer: 'struct' },
        { key: 'ecog', text: 'ECOG 0–2', expect: 'contain:1 分', layer: 'struct' }
      ]
    },
    {
      key: 'DEMO-RARE-021', title: 'MSI-H 罕见实体瘤免疫治疗研究（演示条目）',
      sponsor: '演示用虚构申办方', phase: 'II 期', status: '尚未开始招募（演示）',
      tumor: 'MSI-H / dMMR 实体瘤', tumorScope: 'basket',
      basketText: '该项入组要求里写的是：MSI-H 或 dMMR 的实体瘤（不限瘤种）',
      url: 'https://example.invalid/demo/rare-021',
      criteria: [
        { key: 'msi', text: '当地检测证实 MSI-H 或 dMMR', expect: 'have:msi_h', layer: 'struct' },
        { key: 'age', text: '年龄 ≥18 岁', expect: 'age_ge_18', layer: 'struct' }
      ]
    }
  ],

  /* 检索通道终态（35 号 §二.2：FAILED / DENIED 不算查过） */
  channels: [
    { id: 'local', name: '本地快照', state: 'OK', at: '2026-10-24 21:10', detail: '快照版本 2026-10 第 3 批 · 4 条' },
    { id: 'online', name: '在线检索（unified-trial-mcp）', state: 'DENIED', at: '2026-10-26 08:02', detail: '未授权，本次没有查到任何在线结果' }
  ]
};

export default demoData;
