/**
 * zmzai.cloud 产品矩阵 — z·m·z·a·i 逐字母体系。
 * 五个字母是「知末智云」拼音首字母与 AI 的合成：每个字母挂一条 AI 产品线，
 * 既是产品索引，又是品牌拆解。命名体系见 BRAND.md §产品矩阵。
 */

export type ProductStatus = "live" | "building" | "planned";

export interface ProductLine {
  /** Stable identifier; letters are presentation-only and may repeat. */
  id: string;
  /** 字母标识：z · m · z · a · i，或本体 muzhi */
  letter: string;
  /** 中文产品名（单字，印章用） */
  hanzi: string;
  /** 产品线名 */
  name: string;
  /** 一句话 */
  tagline: string;
  /** 详细描述 */
  description: string;
  status: ProductStatus;
  href: string;
  supportsReturnUrl: boolean;
  /** 项目级强调色（design.md ## Variants），仅 sub-project 覆盖 */
  accent?: string;
}

/** muzhi 本体：博客 + 付费知识体系，第一个落地成员。 */
export const rootProduct: ProductLine = {
  id: "muzhi",
  letter: "M",
  hanzi: "牧之",
  name: "Muzhi",
  tagline: "牧之署名站的知识产品",
  description:
    "博客 + 付费知识体系。发布内容、注册、免费信任、支付或邀请码获得权益、安全观看与下载、保存进度、反馈改进——一条经过真实业务验证的闭环。",
  status: "live",
  href: "https://muzhi.zmzai.cloud",
  supportsReturnUrl: false,
};

/** z·m·z·a·i 五条字母产品线。 */
export const letterProducts: ProductLine[] = [
  {
    id: "sandbox",
    letter: "Z",
    hanzi: "沙箱",
    name: "Sandbox",
    tagline: "为 Agent 提供统一沙箱接入",
    description: "受限代码执行环境，提供开发者工作台、运行记录、取消与输出限制；Agent 任务的安全执行层。",
    status: "building",
    href: "https://z.zmzai.cloud",
    supportsReturnUrl: false,
  },
  {
    id: "relay",
    letter: "M",
    hanzi: "模型",
    name: "Relay",
    tagline: "所有模型的统一接口",
    description: "多模型路由与 API 网关，统一的接入、鉴权、计费和故障转移。",
    status: "live",
    href: "https://m.zmzai.cloud",
    supportsReturnUrl: false,
  },
  {
    id: "hub",
    letter: "H",
    hanzi: "枢纽",
    name: "Hub",
    tagline: "zmzai.cloud 产品入口",
    description: "你正在看的这个枢纽站：品牌首页 + 产品索引，所有子产品的统一入口。",
    status: "live",
    href: "https://zmzai.cloud",
    supportsReturnUrl: false,
  },
  {
    id: "agent",
    letter: "A",
    hanzi: "Agent",
    name: "Agent",
  tagline: "从对话开始完成真实任务",
  description: "Chat-first 通用智能体：从一句目标开始，持续执行、审批、恢复，并交付可预览或下载的成果。",
    status: "live",
    href: "https://a.zmzai.cloud",
    supportsReturnUrl: false,
  },
  {
    id: "workos",
    letter: "I",
    hanzi: "工作台",
    name: "WorkOS",
    tagline: "AI 时代的个人工作台",
    description: "面向个人创作者的一体化 AI 工作台：写作、检索、交付、运营一窗收齐。",
    status: "planned",
    href: "https://i.zmzai.cloud",
    supportsReturnUrl: false,
  },
];

export const allProducts: ProductLine[] = [rootProduct, ...letterProducts];

export function statusLabel(status: ProductStatus): string {
  switch (status) {
    case "live":
      return "LIVE";
    case "building":
      return "BUILDING";
    case "planned":
      return "PLANNED";
  }
}
