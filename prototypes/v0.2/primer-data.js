/* 小壶宝 AmpuPal · 疾病概要数据（36 号）
 * 口径：docs/DISEASE-PRIMER.md；规范：starter docs/36-DISEASE-PRIMER.md。
 * 全部内容属第 ② 层（解释）：只写定义、文件、指南列举过的手段、已发生的变化。
 * 任何「你该怎么办」的判断都不在这里，固定出口是「这一句需要问你的医生」。
 *
 * 原件状态照实写：本项目未取得 NCCN / CSCO / AJCC / ISGPS 的任何原件。
 * 仅《胰腺癌诊疗指南（2022年版）》可从国家卫生健康委官网通知页取得（附件 PDF）。
 * 其余文件只写文件存在与版本记录，不引用具体条文，页码一律「页码待核」。
 * 链接均于 2026-10-27 用 verify-links.mjs 逐条验活（只收 OK）。
 */
window.DISEASE_PRIMER = {
  brand: '小壶宝 AmpuPal',
  name: '壶腹部腺癌',
  en: 'Ampullary Adenocarcinoma',
  updated: '2026-10-27',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: '壶腹部腺癌是发生在十二指肠大乳头（Vater 壶腹）区域的腺癌。这个位置是胆管、胰管与十二指肠三者交汇的地方，'
        + '所以它既不像胆管癌也不像胰腺癌，医学上单独列一类。这一点在中文资料里最容易被抹掉：'
        + '大量科普把它并进「胰腺癌」或「胆管癌」里讲，导致患者听到的解释与自己报告上的分期对不上。',
      points: [
        '壶腹的解剖位置：十二指肠降段内侧壁上的乳头状突起，胆总管与主胰管在此汇合并开口于肠腔。',
        '「壶腹周围癌」是一个更大的说法，包含壶腹癌、胰头癌、远端胆管癌与十二指肠癌四种；四者的分期表与手术方式不完全相同。',
        '病理上常分肠型、胰胆型与混合型三个亚型，由病理医生按镜下形态与免疫组化判定。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN Guidelines · Ampullary Adenocarcinoma', version: '版本未核实', original: false, secondaryUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1511', note: '官网目录页；全文需 NCCN 账号', page: '页码待核' },
        { org: 'AJCC', doc: 'Cancer Staging Manual, 8th ed.（壶腹章节）', version: '8th（2017）', original: false, secondaryUrl: 'https://store.facs.org/ajcc-8th-edition-cancer-staging-manual', note: '官方出版方书目页；书需购买', page: '页码待核' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '下面这张表只说明"有哪些文件、版本记录到哪一步、本台拿它们干什么"。'
        + '只有《胰腺癌诊疗指南（2022年版）》能从国家卫生健康委官网通知页取得全文（附件 PDF）；'
        + '其余原件未取得，链接指向官网目录页或出版方书目页，不引用具体条文。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'],
        rows: [
          ['NCCN', 'NCCN Guidelines · Ampullary Adenocarcinoma', '版本未核实', { text: '未取得原件 · 官网目录', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1511' }, '只作为"存在这一套规范"的范围参照'],
          ['AJCC / UICC', 'TNM 分期（壶腹章节）', '8th ed.（2017）', { text: '未取得原件 · 出版方页', url: 'https://store.facs.org/ajcc-8th-edition-cancer-staging-manual' }, '并列展示 T1a/T1b/T2/T3/T4 的界标原文'],
          ['CSCO', '胆道恶性肿瘤诊疗指南（含壶腹部分）', '2024 版', { text: '未取得原件 · 出版方页', url: 'https://www.pmphmall.com/gdsdetail/653359-331956' }, '只在"中国也有一份"这一层被提及'],
          ['国家卫生健康委', '胰腺癌诊疗指南（2022年版）（含壶腹周围癌章节）', '2022', { text: '原件已取得 · 官网通知', url: 'https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml' }, '同上，仅作范围参照'],
          ['ISGPS', '术后胰瘘定义与分级（2016 修订）', '2016（2017 发表）', { text: '未取得原件 · 书目页', url: 'https://mayoclinic.elsevierpure.com/en/publications/the-2016-update-of-the-international-study-group-isgps-definition/' }, '解释页引用其分级名称 A/B/C'],
          ['ISGPS', '胃排空延迟定义（2007）', '2007', { text: '未取得原件 · 书目页', url: 'https://mayoclinic.elsevierpure.com/en/publications/delayed-gastric-emptying-dge-after-pancreatic-surgery-a-suggested/' }, '解释页引用其分级名称 A/B/C']
        ]
      },
      points: [
        '中文资料的一个实情：壶腹癌几乎没有独立的中文科普或独立登记口径，多数内容挂在胰腺癌或胆管癌下面。',
        '本项目仅取得《胰腺癌诊疗指南（2022年版）》的官网通知页（附件 PDF），其余文件未取得原件，所以任何段落都不写具体条文编号，页码一律待核。',
        '指南写的是「通常怎么做」，不是「你该怎么做」。'
      ],
      sources: [
        { org: 'NCCN', doc: 'Ampullary Adenocarcinoma', version: '版本未核实', original: false, secondaryUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1511', note: '官网目录页；全文需 NCCN 账号', page: '页码待核' },
        { org: '国家卫生健康委', doc: '胰腺癌诊疗指南（2022年版）', version: '2022', original: true, url: 'https://www.nhc.gov.cn/yzygj/c100068/202204/0c1f7d3aca0545abbeb02030ce255930.shtml', note: '官网通知页，附件含 PDF 全文', page: '附件 PDF · 页码待核' },
        { org: 'ISGPS', doc: 'Postoperative pancreatic fistula 定义（2016 修订）', version: '2016', original: false, secondaryUrl: 'https://mayoclinic.elsevierpure.com/en/publications/the-2016-update-of-the-international-study-group-isgps-definition/', note: '出版方书目页（摘要）；全文需订阅', page: '页码待核' },
        { org: 'ISGPS', doc: 'Delayed gastric emptying 定义', version: '2007', original: false, secondaryUrl: 'https://mayoclinic.elsevierpure.com/en/publications/delayed-gastric-emptying-dge-after-pancreatic-surgery-a-suggested/', note: '出版方书目页（摘要）；全文需订阅', page: '页码待核' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: '按病程三段列出指南里出现过的手段类别。这是「世界上大致有哪些办法」的地图，不含剂量、疗程与适用条件。',
      groups: [
        {
          title: '术前（以梗阻性黄疸首发时）',
          items: [
            '胆道引流减黄：ERCP 途径（塑料支架 / 金属支架）或 PTCD 经皮经肝穿刺引流。',
            '术前评估：增强 CT / MRI、肝功能与营养状态、麻醉评估。',
            '活检：内镜下取活检或 EUS-FNA，用于术前取得组织学依据。'
          ]
        },
        {
          title: '手术（多数人走这一条）',
          items: [
            '胰十二指肠切除（PD，Whipple）或保留幽门的胰十二指肠切除（PPPD）。',
            '切除范围含胰头、十二指肠、胆囊、胆总管下段、部分胃或幽门；重建包括胰肠、胆肠、胃空肠三处吻合。',
            '区域淋巴结清扫；切缘状态按病理报告记 R0 / R1 / R2。'
          ]
        },
        {
          title: '术后与晚期',
          items: [
            '术后辅助治疗：以氟尿嘧啶类或吉西他滨类为基础的方案在指南中被列出（具体方案与适应证由医生判断）。',
            '不可切除或转移后：系统治疗（化疗、靶向、免疫），部分人进入临床试验。',
            '贯穿全程：胰酶替代、营养支持、血糖管理、疼痛与症状管理。'
          ]
        }
      ],
      points: [
        '上面这些是"类别"，不是"推荐顺序"；顺序由医生按分期、体力状态与器官功能决定。',
        '本台不记录剂量与疗程，也不评价方案优劣。',
        '以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
      ],
      sources: [
        { org: 'NCCN', doc: 'Ampullary Adenocarcinoma', version: '版本未核实', original: false, secondaryUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1511', note: '官网目录页；全文需 NCCN 账号', page: '页码待核' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '只写已经发生的事，带日期或版本。不对未来做预测。',
      points: [
        '分期体系：AJCC 第 8 版（2017）把壶腹单独设章，并按浸润深度把 T1 拆成 T1a / T1b 两个子级；这一拆分使"壶腹原发、早期"的记录比旧版更细。',
        '术后并发症语言：ISGPS 在 2007 年统一胃排空延迟（DGE）定义、2016 年修订术后胰瘘（CR-POPF）定义，使不同医院病历里的"胰瘘"可以互相对照。',
        '分子检测：MSI / dMMR 与 HER2 等标志物在壶腹癌中被检测，检测结果与是否有免疫或靶向治疗的入口相关；不同医院开展程度差异较大。',
        '试验组织方式：壶腹癌专属注册试验数量很少，更多以"胆道恶性肿瘤""罕见实体瘤""MSI-H 实体瘤"等 basket 形式登记。',
        '中文信息供给：截至本项目编写时，未检索到面向患者的壶腹癌独立中文科普体系，内容仍主要附属于胰腺癌与胆管癌。'
      ],
      sources: [
        { org: 'AJCC', doc: 'Cancer Staging Manual, 8th ed.', version: '8th（2017）', original: false, secondaryUrl: 'https://store.facs.org/ajcc-8th-edition-cancer-staging-manual', note: '官方出版方书目页；书需购买', page: '页码待核' },
        { org: 'ISGPS', doc: 'Gastric emptying 定义', version: '2007', original: false, secondaryUrl: 'https://mayoclinic.elsevierpure.com/en/publications/delayed-gastric-emptying-dge-after-pancreatic-surgery-a-suggested/', note: '出版方书目页（摘要）；全文需订阅', page: '页码待核' },
        { org: 'ISGPS', doc: 'Postoperative pancreatic fistula 定义', version: '2016', original: false, secondaryUrl: 'https://mayoclinic.elsevierpure.com/en/publications/the-2016-update-of-the-international-study-group-isgps-definition/', note: '出版方书目页（摘要）；全文需订阅', page: '页码待核' },
        { org: 'NCCN', doc: 'Ampullary Adenocarcinoma', version: '版本未核实', original: false, secondaryUrl: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1511', note: '官网目录页；全文需 NCCN 账号', page: '页码待核' }
      ]
    }
  ]
};
