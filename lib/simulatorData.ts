export type InterestLevel = 'Low' | 'Medium' | 'High';
export type DebtLevel = 'Low' | 'Medium' | 'High';
export type Verdict = 'halal' | 'haram';
export type FailureReason = 'sector' | 'debt' | 'riba';

export interface SimulatorCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  mainIncomeSource: string;
  interestIncomeLevel: InterestLevel;
  debtLevel: DebtLevel;
  verdict: Verdict;
  failureReasons?: FailureReason[];
  hintText: string;
  islamicPrinciple: string;
  lessonCallback: {
    lessonNumber: number;
    sectionNumber: number;
    label: string;
    href: string;
  };
  explanation: string;
}

export type PublicCompany = Pick<
  SimulatorCompany,
  | 'id'
  | 'name'
  | 'industry'
  | 'description'
  | 'mainIncomeSource'
  | 'interestIncomeLevel'
  | 'debtLevel'
>;

export const COMPANIES: SimulatorCompany[] = [
  // ─── Category A: Clearly Halal (15 companies) ───────────────────────────────

  {
    id: 'aquapure-tech',
    name: 'AquaPure Technologies',
    industry: 'Water Purification',
    description:
      'AquaPure builds clean-water filtration systems for homes and schools in developing countries. The company sells hardware and charges a monthly maintenance subscription.',
    mainIncomeSource: 'Water filter hardware sales and subscriptions',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'AquaPure passes all three checks: its business (clean water) is fully permissible, its debt is low, and it earns almost no interest income.',
    islamicPrinciple:
      'Providing clean water is one of the most valued acts in Islamic ethics — companies that serve this purpose are a clear example of a permissible investment.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'AquaPure Technologies is halal. Its core business — water purification — is entirely permissible, its debt-to-assets ratio is low, and it earns negligible interest income. All three screening criteria pass.',
  },
  {
    id: 'solarpath-energy',
    name: 'SolarPath Energy',
    industry: 'Renewable Energy',
    description:
      'SolarPath installs solar panels on rooftops and community buildings, then sells the electricity produced back to households and small businesses.',
    mainIncomeSource: 'Electricity sales from solar installations',
    interestIncomeLevel: 'Low',
    debtLevel: 'Medium',
    verdict: 'halal',
    hintText:
      'SolarPath passes all checks: solar energy is a clean sector, medium debt is within the permissible range, and interest income is very low.',
    islamicPrinciple:
      'Stewardship of the earth (khalifa) is a core Islamic value — investing in renewable energy companies aligns with this responsibility.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'SolarPath Energy is halal. Renewable energy is a fully permissible sector. Medium debt is acceptable under Islamic screening rules (the threshold is High, meaning above 33% of assets). Interest income is negligible.',
  },
  {
    id: 'meddiag-systems',
    name: 'MedDiag Systems',
    industry: 'Healthcare Diagnostics',
    description:
      'MedDiag makes portable diagnostic devices that help doctors in rural clinics detect diseases early without needing a full hospital lab.',
    mainIncomeSource: 'Medical device sales to hospitals and clinics',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'MedDiag passes all three checks: healthcare equipment is a permissible sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Islam places great importance on preserving life and health — companies that genuinely improve healthcare outcomes are strongly permissible investments.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'MedDiag Systems is halal. Medical diagnostics equipment is a clean sector with no haram activities. Debt is low and interest income is negligible — all three criteria pass.',
  },
  {
    id: 'learnly-edu',
    name: 'Learnly Education',
    industry: 'Online Education',
    description:
      'Learnly runs an online learning platform for students aged 10-18, offering video lessons, quizzes, and live tutoring in maths, science, and languages.',
    mainIncomeSource: 'Monthly student subscriptions',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'Learnly passes all checks: education is a clearly permissible sector, debt is low, and interest income is very low.',
    islamicPrinciple:
      "Seeking knowledge is one of Islam's highest values — companies that make education accessible are ideal permissible investments.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Learnly Education is halal. Online education is entirely permissible, debt is low, and interest income is negligible. This company passes all three screening checks.',
  },
  {
    id: 'greenfields-organic',
    name: 'Greenfields Organic',
    industry: 'Organic Food Production',
    description:
      'Greenfields grows and packages certified organic vegetables and fruits, selling them to supermarkets and directly to families through a weekly delivery box service.',
    mainIncomeSource: 'Organic produce sales to retailers and direct consumers',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'Greenfields passes all three checks: organic food production is permissible, debt is low, and interest income is negligible.',
    islamicPrinciple:
      "Producing wholesome, clean food is strongly encouraged in Islam — halal food businesses are a natural fit for a Muslim investor's portfolio.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Greenfields Organic is halal. Producing organic food is a fully permissible business with no haram elements. Debt is low and interest income is negligible.',
  },
  {
    id: 'shieldwall-cyber',
    name: 'ShieldWall Cybersecurity',
    industry: 'Cybersecurity Software',
    description:
      'ShieldWall builds software that protects companies and schools from hackers and data theft, charging businesses a yearly licence fee to use their security tools.',
    mainIncomeSource: 'Annual software licence fees',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'ShieldWall passes all checks: cybersecurity software is a clean sector, debt is low, and interest income is minimal.',
    islamicPrinciple:
      'Protecting people from harm and fraud aligns with the Islamic principle of preventing harm (dar al-mafasid) — cybersecurity is a permissible and beneficial business.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'ShieldWall Cybersecurity is halal. Cybersecurity is a clean sector providing a genuine protective service. Debt is low and interest income is negligible — all criteria pass.',
  },
  {
    id: 'terrablock-build',
    name: 'TerraBlock Sustainable Construction',
    industry: 'Sustainable Construction',
    description:
      'TerraBlock builds eco-friendly homes and offices using recycled materials and energy-efficient designs, selling completed buildings and construction management services.',
    mainIncomeSource: 'Construction contracts and property sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Medium',
    verdict: 'halal',
    hintText:
      'TerraBlock passes all checks: sustainable construction is permissible, medium debt is within range, and interest income is very low.',
    islamicPrinciple:
      "Building homes and community spaces is one of the most honoured professions in Islamic tradition — sustainable construction companies align well with a Muslim investor's values.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'TerraBlock Sustainable Construction is halal. Construction is a permissible sector, medium debt is acceptable under Islamic screening rules, and interest income is negligible.',
  },
  {
    id: 'zamzam-eats',
    name: 'ZamZam Eats',
    industry: 'Halal Restaurant Chain',
    description:
      'ZamZam Eats is a fast-growing halal-certified restaurant chain serving Middle Eastern and South Asian food across 120 locations. All ingredients are fully halal-certified.',
    mainIncomeSource: 'Restaurant food and beverage sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'ZamZam Eats passes all checks: selling halal food is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Halal food businesses are among the clearest examples of permissible investments — they serve the community while operating entirely within Islamic guidelines.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'ZamZam Eats is halal. A halal-certified restaurant chain is a fully permissible business. Debt is low and interest income is negligible — all three criteria pass easily.',
  },
  {
    id: 'modestthread-apparel',
    name: 'ModestThread Apparel',
    industry: 'Ethical Clothing',
    description:
      'ModestThread designs and sells ethical, modest clothing for young adults, sourcing all fabrics from fair-trade suppliers and using sustainable manufacturing.',
    mainIncomeSource: 'Online and in-store clothing sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'ModestThread passes all checks: clothing retail is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Providing permissible clothing is a straightforward and honourable business — ethical clothing companies with no haram activities are excellent permissible investments.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'ModestThread Apparel is halal. Clothing retail is a fully permissible sector with no haram products or activities. Debt is low and interest income is negligible.',
  },
  {
    id: 'swiftdeliver-logistics',
    name: 'SwiftDeliver Logistics',
    industry: 'Last-Mile Delivery',
    description:
      'SwiftDeliver runs a last-mile parcel delivery service for online retailers, using an app-based network of local couriers to deliver packages within two hours.',
    mainIncomeSource: 'Delivery fees charged to retailers and consumers',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'SwiftDeliver passes all checks: delivery logistics is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      "Facilitating trade and commerce is encouraged in Islam — Prophet Muhammad (peace be upon him) was himself a trader, and logistics businesses support honest commerce.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'SwiftDeliver Logistics is halal. Delivery and logistics is a clean sector supporting legitimate trade. Debt is low and interest income is negligible — all criteria pass.',
  },
  {
    id: 'brainwave-ai',
    name: 'Brainwave Educational AI',
    industry: 'Educational AI Tools',
    description:
      'Brainwave builds AI-powered tutoring tools that adapt to each student\'s learning pace, helping teachers in under-resourced schools provide personalised support.',
    mainIncomeSource: 'School district and government licence contracts',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'Brainwave passes all checks: educational AI tools are a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Technology that increases access to knowledge serves one of the most celebrated goals in Islam — making education tools is a clearly permissible business.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Brainwave Educational AI is halal. AI tools designed for education are a clean, beneficial sector. Debt is low and interest income is negligible — all three criteria pass.',
  },
  {
    id: 'ecobrick-materials',
    name: 'EcoBrick Building Materials',
    industry: 'Eco-Friendly Building Materials',
    description:
      'EcoBrick manufactures low-carbon bricks and insulation panels made from recycled industrial waste, selling to construction companies building green-certified buildings.',
    mainIncomeSource: 'Sales of eco-friendly bricks and insulation products',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'EcoBrick passes all checks: eco-friendly building materials is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Islamic ethics require us to care for the environment — companies reducing industrial waste and carbon emissions embody this responsibility.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'EcoBrick Building Materials is halal. Manufacturing eco-friendly construction materials is a fully permissible business. Debt is low and interest income is negligible.',
  },
  {
    id: 'caredoor-homehealth',
    name: 'CareDoor Home Healthcare',
    industry: 'Home Healthcare Services',
    description:
      'CareDoor connects trained nurses and caregivers with elderly patients who need daily support at home, billing families and insurance plans for care hours provided.',
    mainIncomeSource: 'Care hour fees from families and insurance plans',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'CareDoor passes all checks: home healthcare is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Caring for the elderly is one of the highest obligations in Islam — businesses that facilitate this care are particularly honourable permissible investments.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'CareDoor Home Healthcare is halal. Home healthcare is a fully permissible sector providing essential support to vulnerable people. Debt is low and interest income is negligible.',
  },
  {
    id: 'appforge-mobile',
    name: 'AppForge Mobile Development',
    industry: 'Mobile App Development',
    description:
      'AppForge is a software studio that builds mobile apps for businesses — things like booking systems, productivity tools, and customer apps — charging project fees and retainers.',
    mainIncomeSource: 'App development project fees and monthly retainers',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'AppForge passes all checks: software development is a clean sector, debt is low, and interest income is negligible.',
    islamicPrinciple:
      'Building useful tools that serve businesses and communities is a form of beneficial work (amal salih) — permissible software development companies are straightforward halal investments.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'AppForge Mobile Development is halal. Software development for businesses is a clean sector with no haram activities. Debt is low and interest income is negligible.',
  },
  {
    id: 'vitaresearch-pharma',
    name: 'VitaResearch Pharmaceuticals',
    industry: 'Pharmaceutical Research',
    description:
      'VitaResearch develops new medicines for common conditions like diabetes, asthma, and high blood pressure, selling its approved drugs to hospitals and pharmacies worldwide.',
    mainIncomeSource: 'Drug sales to hospitals, pharmacies, and health systems',
    interestIncomeLevel: 'Low',
    debtLevel: 'Medium',
    verdict: 'halal',
    hintText:
      'VitaResearch passes all checks: general health pharmaceuticals is a clean sector, medium debt is acceptable, and interest income is low.',
    islamicPrinciple:
      'Healthcare and medicine are encouraged in Islam — companies producing permissible medicines for genuine health needs are generally halal to invest in.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'VitaResearch Pharmaceuticals is halal. General health medicine research and production is a fully permissible sector. Medium debt is within the acceptable range, and interest income is low.',
  },

  // ─── Category B: Clearly Haram — sector violations (10 companies) ───────────

  {
    id: 'golden-brew',
    name: 'Golden Brew Co.',
    industry: 'Alcohol — Beer Brewing',
    description:
      'Golden Brew is one of the largest beer manufacturers in the country, producing over 30 brands of beer and lager sold in supermarkets, pubs, and restaurants.',
    mainIncomeSource: 'Beer and lager sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'This company\'s main business is producing alcohol — that alone makes it impermissible, regardless of its financial ratios.',
    islamicPrinciple:
      'Alcohol (khamr) is explicitly forbidden in the Quran. Investing in a company whose primary business is producing or selling alcohol makes you a partner in that forbidden activity.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Golden Brew Co. is haram. The entire business is built on producing alcohol, which is explicitly prohibited in Islam. No matter how clean its financial ratios are, a beer company cannot pass halal screening.',
  },
  {
    id: 'jackpot-palace',
    name: 'Jackpot Palace Group',
    industry: 'Gambling — Casinos',
    description:
      'Jackpot Palace operates a chain of 45 casinos across the country, offering slot machines, poker tables, and sports betting lounges to millions of customers.',
    mainIncomeSource: 'Casino gaming and slot machine revenue',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'This company\'s core business is gambling — that alone makes it impermissible under Islamic finance rules.',
    islamicPrinciple:
      'Gambling (maysir) is forbidden in the Quran because it creates wealth through pure chance rather than real effort or exchange, causing financial and social harm.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Jackpot Palace Group is haram. Casinos and slot machines are gambling (maysir), which is explicitly forbidden in Islam. The company fails the sector check regardless of debt or interest levels.',
  },
  {
    id: 'cloudpuff-tobacco',
    name: 'CloudPuff Tobacco',
    industry: 'Tobacco Manufacturing',
    description:
      'CloudPuff is a major cigarette and tobacco manufacturer that sells its products in over 60 countries through supermarkets, petrol stations, and duty-free shops.',
    mainIncomeSource: 'Cigarette and tobacco product sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'This company\'s main business is making tobacco products — that alone makes it impermissible because it causes clear harm to human health.',
    islamicPrinciple:
      "Islam forbids causing harm to oneself or others (la darar). Tobacco products are proven to cause serious disease and death — investing in their production directly funds this harm.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'CloudPuff Tobacco is haram. Tobacco manufacturing fails the sector screen because it causes widespread harm to human health, which is prohibited in Islam regardless of financial ratios.',
  },
  {
    id: 'velvet-stream',
    name: 'Velvet Stream Entertainment',
    industry: 'Adult Entertainment',
    description:
      'Velvet Stream operates a subscription-based adult entertainment streaming platform with millions of paying subscribers worldwide.',
    mainIncomeSource: 'Adult content subscriptions',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'This company\'s entire business is adult entertainment — that makes it impermissible from the very first screening check.',
    islamicPrinciple:
      "Modesty and the protection of moral character (hifz al-ird) are core Islamic values — businesses built on explicit content directly contradict these principles.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Velvet Stream Entertainment is haram. The company is entirely built around adult content, which is impermissible in Islam. It fails the sector screen immediately.',
  },
  {
    id: 'pigprime-foods',
    name: 'PigPrime Foods',
    industry: 'Pork Processing',
    description:
      'PigPrime processes and distributes pork products — including ham, bacon, sausages, and lard — to supermarkets, restaurants, and food manufacturers across the country.',
    mainIncomeSource: 'Pork product processing and wholesale distribution',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'The company\'s core product is pork, which is explicitly forbidden in Islam — this fails the sector check immediately.',
    islamicPrinciple:
      'Pork (khinzir) is explicitly prohibited in the Quran. Investing in a company whose entire business is processing and selling pork makes you a partner in a haram activity.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'PigPrime Foods is haram. Processing and distributing pork products is explicitly forbidden in Islam. This company fails the sector screen with no need to check financial ratios.',
  },
  {
    id: 'ironshield-arms',
    name: 'IronShield Arms Manufacturing',
    industry: 'Weapons Manufacturing',
    description:
      'IronShield manufactures assault rifles, artillery systems, and military-grade explosives, selling primarily to national governments and private security contractors.',
    mainIncomeSource: 'Military weapons and munitions sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'This company\'s main product is weapons designed to cause harm — that makes it impermissible under Islamic ethics regardless of its financial ratios.',
    islamicPrinciple:
      "Islam prohibits causing unjust harm (la darar wa la dirar). Companies whose entire purpose is producing weapons used to kill people fail the sector screen under most Islamic finance frameworks.",
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'IronShield Arms Manufacturing is haram. Military weapons manufacturing is screened out under Islamic finance because the primary product is designed to cause harm to human life.',
  },
  {
    id: 'betzone-sports',
    name: 'BetZone Sports Betting',
    industry: 'Online Sports Betting',
    description:
      'BetZone runs an online platform where users can bet real money on sports events — from football and cricket to horse racing — using their phone or computer.',
    mainIncomeSource: 'Sports betting margin revenue from customer wagers',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'Sports betting is gambling — the company makes money from people placing real-money bets, which is forbidden in Islam.',
    islamicPrinciple:
      'Gambling (maysir) is forbidden in the Quran because it creates wealth through chance and causes people to lose money they cannot afford to lose, leading to social harm.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'BetZone Sports Betting is haram. Online sports betting is gambling (maysir), which is explicitly forbidden in Islam. The business model depends entirely on people placing money bets, so it fails the sector screen.',
  },
  {
    id: 'vinoroute-wine',
    name: 'VinoRoute Wine Imports',
    industry: 'Alcohol — Wine Retail',
    description:
      'VinoRoute imports premium wines from France, Italy, and Spain, selling them through its chain of 80 specialist wine shops and a home-delivery subscription service.',
    mainIncomeSource: 'Wine sales through retail shops and subscriptions',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'Wine is an alcoholic drink — importing and selling alcohol fails the sector check immediately regardless of other financial metrics.',
    islamicPrinciple:
      'All intoxicants (khamr) are forbidden in Islam, not just beer. A company whose entire business is selling wine fails the sector screen for the same reason as any other alcohol business.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'VinoRoute Wine Imports is haram. The business is entirely built on importing and selling wine, which is alcohol (khamr) — explicitly forbidden in Islam. Clean financial ratios cannot override a haram sector.',
  },
  {
    id: 'firstcredit-bank',
    name: 'FirstCredit Commercial Bank',
    industry: 'Conventional Banking',
    description:
      'FirstCredit is a national commercial bank that takes deposits from customers and lends money to individuals and businesses, charging interest on all loans.',
    mainIncomeSource: 'Interest income on loans and mortgages',
    interestIncomeLevel: 'High',
    debtLevel: 'Medium',
    verdict: 'haram',
    failureReasons: ['sector', 'riba'],
    hintText:
      'A conventional bank\'s entire business model is based on lending money and charging interest — that is riba, which is forbidden in Islam.',
    islamicPrinciple:
      'Riba (interest) is one of the most seriously prohibited things in Islam — the Quran explicitly warns against it. Conventional banks earn almost all their income from interest, making them impermissible on both the sector and income screens.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'FirstCredit Commercial Bank is haram. Conventional banking is built entirely on charging and paying interest (riba), which is one of the most explicitly forbidden acts in Islamic finance. It fails both the sector check and the interest income check.',
  },
  {
    id: 'luckystar-lottery',
    name: 'LuckyStar National Lottery',
    industry: 'Gambling — Lottery',
    description:
      'LuckyStar operates the national lottery, selling scratch cards and weekly draw tickets in thousands of shops and online, with jackpots of up to $50 million.',
    mainIncomeSource: 'Lottery ticket sales',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['sector'],
    hintText:
      'The lottery is a form of gambling — customers pay money for a random chance to win, which is exactly what maysir means in Islamic finance.',
    islamicPrinciple:
      'The lottery is a textbook example of maysir (gambling) — participants pay money and win or lose based purely on chance, with no real economic exchange of value.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'LuckyStar National Lottery is haram. Lotteries are gambling (maysir), which is forbidden in Islam. The business exists entirely to sell chances of winning money by random draw — that is the definition of forbidden gambling.',
  },

  // ─── Category C: Haram due to High debt (8 companies) ──────────────────────

  {
    id: 'centrapark-mall',
    name: 'CentraPark Developments',
    industry: 'Commercial Property Development',
    description:
      'CentraPark builds and manages large shopping malls and commercial properties, earning money from rent charged to retailers and office tenants.',
    mainIncomeSource: 'Rental income from commercial properties and malls',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'CentraPark Developments fails the debt screen. Its sector (property development) is permissible, but its debt exceeds 33% of total assets — a threshold set by Islamic scholars to avoid excessive interest-bearing borrowing. High debt = haram under Islamic screening rules.',
  },
  {
    id: 'skybudget-airlines',
    name: 'SkyBudget Airlines',
    industry: 'Budget Aviation',
    description:
      'SkyBudget is a low-cost airline serving 120 routes across Europe and the Middle East, selling cheap tickets and charging fees for luggage, seats, and in-flight meals.',
    mainIncomeSource: 'Passenger ticket and ancillary fee revenue',
    interestIncomeLevel: 'Medium',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'SkyBudget Airlines fails the debt screen. Aviation is a permissible sector, but airlines typically carry huge debt to finance their aircraft fleets — here it exceeds the 33% threshold. The sector is clean but the balance sheet is not.',
  },
  {
    id: 'grandlux-hotels',
    name: 'GrandLux Hotel Group',
    industry: 'Luxury Hotels',
    description:
      'GrandLux owns and operates a chain of 60 five-star hotels in major cities worldwide, offering premium rooms, conference facilities, and spa services.',
    mainIncomeSource: 'Hotel room bookings and hospitality services',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'GrandLux Hotel Group fails the debt screen. Running luxury hotels is a permissible business, but the company has financed its properties with heavy borrowing that exceeds the 33% threshold. High debt makes it haram under Islamic screening.',
  },
  {
    id: 'roadspan-infra',
    name: 'RoadSpan Infrastructure',
    industry: 'Road Construction',
    description:
      'RoadSpan designs and builds major roads, bridges, and tunnels under long-term government contracts, earning revenue as construction milestones are completed.',
    mainIncomeSource: 'Government infrastructure construction contracts',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'RoadSpan Infrastructure fails the debt screen. Building roads and bridges for the public is a permissible activity, but large infrastructure projects are typically financed with enormous borrowing — here the debt exceeds the 33% threshold.',
  },
  {
    id: 'voltrise-ev',
    name: 'VoltRise Electric Vehicles',
    industry: 'Electric Vehicle Manufacturing',
    description:
      'VoltRise designs and manufactures electric cars and vans, selling them to consumers and fleet operators across North America and Europe.',
    mainIncomeSource: 'Electric vehicle sales to consumers and businesses',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'VoltRise Electric Vehicles fails the debt screen. Electric vehicles are a clean, permissible sector — but building a car manufacturing business requires massive capital investment, and VoltRise has borrowed heavily beyond the 33% threshold to fund its factories.',
  },
  {
    id: 'megamart-retail',
    name: 'MegaMart Retail Group',
    industry: 'Major Retail Chain',
    description:
      'MegaMart operates 300 large retail stores selling groceries, electronics, clothing, and home goods at competitive prices to millions of shoppers each week.',
    mainIncomeSource: 'Retail product sales across store network',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'MegaMart Retail Group fails the debt screen. General retail is a permissible sector, but MegaMart has used heavy borrowing to expand its store network — debt now exceeds 33% of total assets, taking it past the Islamic screening threshold.',
  },
  {
    id: 'streamflix-video',
    name: 'StreamFlix Video Platform',
    industry: 'Video Streaming',
    description:
      'StreamFlix is a subscription-based video streaming service offering movies, TV shows, and original content to 80 million subscribers worldwide.',
    mainIncomeSource: 'Monthly subscriber fees',
    interestIncomeLevel: 'Low',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'StreamFlix Video Platform fails the debt screen. Video streaming (permissible content) is a clean sector, but StreamFlix has borrowed billions of dollars to fund content production — its debt exceeds the 33% threshold, making it haram under Islamic financial screening.',
  },
  {
    id: 'netwave-telecom',
    name: 'NetWave Telecoms',
    industry: 'Telecommunications',
    description:
      'NetWave is a national telecoms company that runs mobile phone networks, home broadband, and fibre internet services for millions of residential and business customers.',
    mainIncomeSource: 'Mobile, broadband, and fibre subscription revenue',
    interestIncomeLevel: 'Medium',
    debtLevel: 'High',
    verdict: 'haram',
    failureReasons: ['debt'],
    hintText:
      'Look closely at the debt level — High means the company owes more than 33% of its assets in borrowed money, which typically involves interest obligations.',
    islamicPrinciple:
      'In Islamic finance, excessive borrowing is discouraged because it creates financial instability and usually involves interest-bearing loans.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'NetWave Telecoms fails the debt screen. Telecommunications is a permissible sector, but building a national network requires enormous infrastructure investment. NetWave has borrowed heavily to fund this, pushing debt above the 33% threshold.',
  },

  // ─── Category D: Haram due to High interest income (5 companies) ────────────

  {
    id: 'payswift-fintech',
    name: 'PaySwift Payment Processing',
    industry: 'Fintech — Payment Processing',
    description:
      'PaySwift processes card payments for thousands of online and offline retailers, but also earns significant income by lending out the cash it holds between transactions.',
    mainIncomeSource: 'Payment processing fees plus interest earned on float',
    interestIncomeLevel: 'High',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['riba'],
    hintText:
      'Check the interest income level — High means more than 5% of the company\'s revenue comes from interest, which is riba.',
    islamicPrinciple:
      'Riba — earning or paying interest — is prohibited in Islam because it creates an unjust transfer of wealth without real risk or effort.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'PaySwift Payment Processing is haram. Although payment processing itself is a permissible service, PaySwift earns a substantial portion of its revenue from interest on the cash it holds — more than 5% of total revenue. That interest income (riba) makes it impermissible.',
  },
  {
    id: 'equiplease-rental',
    name: 'EquiLease Equipment Rentals',
    industry: 'Equipment Leasing',
    description:
      'EquiLease provides industrial machinery and equipment to construction companies on multi-year lease agreements, earning a return that includes both rental and interest-equivalent charges built into the lease price.',
    mainIncomeSource: 'Equipment lease payments including interest components',
    interestIncomeLevel: 'High',
    debtLevel: 'Medium',
    verdict: 'haram',
    failureReasons: ['riba'],
    hintText:
      'Check the interest income level — High means more than 5% of the company\'s revenue comes from interest, which is riba.',
    islamicPrinciple:
      'Riba — earning or paying interest — is prohibited in Islam because it creates an unjust transfer of wealth without real risk or effort.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'EquiLease Equipment Rentals is haram. The company\'s lease agreements are structured to include significant interest charges — more than 5% of total revenue. Even though the underlying activity (renting equipment) is permissible, the interest-laden contracts make this a riba-generating business.',
  },
  {
    id: 'propreit-trust',
    name: 'PropREIT Property Trust',
    industry: 'Property Investment Trust (REIT)',
    description:
      'PropREIT is a real estate investment trust that owns and rents out office buildings and warehouses, but also holds a large portfolio of corporate bonds that pay regular interest.',
    mainIncomeSource: 'Rental income plus interest from bond portfolio',
    interestIncomeLevel: 'High',
    debtLevel: 'Medium',
    verdict: 'haram',
    failureReasons: ['riba'],
    hintText:
      'Check the interest income level — High means more than 5% of the company\'s revenue comes from interest, which is riba.',
    islamicPrinciple:
      'Riba — earning or paying interest — is prohibited in Islam because it creates an unjust transfer of wealth without real risk or effort.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'PropREIT Property Trust is haram. While owning and renting properties can be permissible, this REIT derives more than 5% of its revenue from interest earned on a corporate bond portfolio. That riba income disqualifies it from halal screening.',
  },
  {
    id: 'treasurycorp-mgmt',
    name: 'TreasuryCorp Management',
    industry: 'Corporate Treasury Management',
    description:
      'TreasuryCorp manages cash and short-term investments for large companies, placing their money in interest-bearing deposits and bonds to maximise returns.',
    mainIncomeSource: 'Fees from treasury management plus interest on managed assets',
    interestIncomeLevel: 'High',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['riba'],
    hintText:
      'Check the interest income level — High means more than 5% of the company\'s revenue comes from interest, which is riba.',
    islamicPrinciple:
      'Riba — earning or paying interest — is prohibited in Islam because it creates an unjust transfer of wealth without real risk or effort.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'TreasuryCorp Management is haram. The company\'s core service is placing other companies\' money into interest-bearing accounts and bonds. Interest income makes up well over 5% of revenue — this is a riba-generating business by design.',
  },
  {
    id: 'invoiceflex-factoring',
    name: 'InvoiceFlex Factoring',
    industry: 'Invoice Factoring',
    description:
      'InvoiceFlex buys unpaid invoices from small businesses at a discount, then collects the full amount from customers — effectively charging an interest-equivalent fee for advancing the cash early.',
    mainIncomeSource: 'Discount fees on purchased invoices (interest equivalent)',
    interestIncomeLevel: 'High',
    debtLevel: 'Low',
    verdict: 'haram',
    failureReasons: ['riba'],
    hintText:
      'Check the interest income level — High means more than 5% of the company\'s revenue comes from interest, which is riba.',
    islamicPrinciple:
      'Riba — earning or paying interest — is prohibited in Islam because it creates an unjust transfer of wealth without real risk or effort.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 2,
      label: 'Lesson 4, Section 2 — Financial ratio screening',
      href: '/learn/4',
    },
    explanation:
      'InvoiceFlex Factoring is haram. Invoice factoring is structured as a discount on money owed — in practice this functions as interest (riba) because the company profits by advancing money and taking back more than it gave. Over 5% of revenue comes from this mechanism.',
  },

  // ─── Category E: Tricky halal (students might mistakenly block, 2 companies) ─

  {
    id: 'pixelquest-games',
    name: 'PixelQuest Game Studio',
    industry: 'Video Game Development',
    description:
      'PixelQuest creates and sells action-adventure and puzzle video games for consoles and mobile phones. All games are sold for a one-time purchase or subscription — no real-money gambling.',
    mainIncomeSource: 'Game sales and in-app purchase revenue (no real-money bets)',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'Video games that do not involve real-money gambling are generally permissible. The concern is specifically real-money betting, not entertainment games.',
    islamicPrinciple:
      'Entertainment games without real-money gambling are generally permissible — the issue is specifically maysir, which requires real financial stakes.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'PixelQuest Game Studio is halal. This is a common misconception — video games are not the same as gambling. Maysir requires real financial stakes. PixelQuest makes entertainment games with no real-money betting, so it passes the sector check. Debt is low and interest income is negligible.',
  },
  {
    id: 'helix-pharma',
    name: 'Helix Pharmaceutical Group',
    industry: 'Pharmaceutical Research',
    description:
      'Helix researches and manufactures medicines for conditions like cancer, heart disease, and infections. All products are for general health — no alcohol-based formulations or haram inputs.',
    mainIncomeSource: 'Prescription medicine sales to hospitals and pharmacies',
    interestIncomeLevel: 'Low',
    debtLevel: 'Low',
    verdict: 'halal',
    hintText:
      'Pharmaceutical companies that make medicines for general health are generally permissible — the concern is specifically companies producing haram substances.',
    islamicPrinciple:
      'Healthcare and medicine are encouraged in Islam — companies producing permissible medicines are generally halal to invest in.',
    lessonCallback: {
      lessonNumber: 4,
      sectionNumber: 1,
      label: 'Lesson 4, Section 1 — Business type screening',
      href: '/learn/4',
    },
    explanation:
      'Helix Pharmaceutical Group is halal. General health medicines are fully permissible under Islamic screening. Some students confuse all pharma with companies that produce haram substances — but unless the company makes alcohol-based products or other haram items, general medicines are encouraged. Debt is low and interest income is negligible.',
  },
];

export function getAllCompanies(): SimulatorCompany[] {
  return COMPANIES;
}

export function getCompanyById(id: string): SimulatorCompany | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function getPublicCompanies(): PublicCompany[] {
  return COMPANIES.map(
    ({ id, name, industry, description, mainIncomeSource, interestIncomeLevel, debtLevel }) => ({
      id,
      name,
      industry,
      description,
      mainIncomeSource,
      interestIncomeLevel,
      debtLevel,
    })
  );
}
