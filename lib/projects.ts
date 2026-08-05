export type ProjectStatus = "live" | "building" | "planned";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  href: string;
  /** Project-level accent override (design.md ## Variants). */
  accent?: string;
}

export const projects: Project[] = [
  {
    slug: "knowledge-kit",
    name: "mdldm knowledge kit",
    tagline: "自托管的知识产品交付与会员运营底座",
    description:
      "一条经过真实业务验证的闭环：发布内容 → 注册 → 免费信任 → 支付或邀请码获得权益 → 安全观看与下载 → 保存进度 → 反馈改进。面向个人创作者，Apache-2.0。",
    status: "live",
    href: "https://kit.zmzai.cloud",
  },
  {
    slug: "zmzai-cloud",
    name: "zmzai.cloud",
    tagline: "你正在看的这个枢纽站本身",
    description:
      "牧之的云的门牌号。极薄一层：品牌首页 + OPC 项目索引。继承印章品牌底盘，不展开子项目级强调色。",
    status: "live",
    href: "/",
    accent: "oklch(0.46 0.150 27)",
  },
];

export function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case "live":
      return "LIVE";
    case "building":
      return "BUILDING";
    case "planned":
      return "PLANNED";
  }
}
