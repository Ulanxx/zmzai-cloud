import { Logo } from "@zmzai/theme";

export const metadata = {
  title: "为什么 · zmzai cloud",
};

export default function AboutPage() {
  return (
    <article className="flex flex-col gap-8">
      <p className="eyebrow">立场 · 反 AI slop</p>
      <h1 className="headline max-w-2xl text-4xl">
        为什么不是又一个 AI 站
      </h1>

      <div className="flex flex-col gap-6 max-w-2xl text-ink-2">
        <p>
          打开一个典型知识课程站，你看到的是：紫色渐变 hero、Inter 字体从
          标题灌到正文、四张图标方块功能卡、居中对齐的口号、荧光绿或靛蓝的
          强调色。这是 2024 年以来所有 AI 生成站共有的指纹。它没有作者，它
          有一个 prompt。
        </p>
        <p>
          <code className="font-mono text-accent">mdldm knowledge kit</code>{" "}
          最早也是这样长出来的：底色是对的，但 Geist + 荧光绿{" "}
          <code className="font-mono">#d8ff3e</code> + 方块里塞一个「牧」字，
          让它一眼就和一万个 AI 站混在一起。
        </p>
        <p>
          <code className="font-mono">zmzai cloud 牧之</code> 的回答是把
          “牧之”从 logo 里拿出来，放回署名的位置。logo 主体交给{" "}
          <code className="font-mono">zmzai</code> 这个可被占用的罗马化词；
          “牧之”作为署名，放在每个项目角落。像作者在书末签字，而不是像
          SaaS 在导航栏贴图标。
        </p>
      </div>

      <div className="rule-top mt-8 flex flex-col gap-6 pt-12 sm:flex-row sm:items-start sm:gap-12">
        <Logo size={56} />
        <div className="flex flex-col gap-3 max-w-xl">
          <h2 className="headline text-2xl">三不</h2>
          <ul className="flex flex-col gap-2 font-mono text-sm text-ink-2">
            <li>— 不用 Inter/Geist 当唯一正文字体</li>
            <li>— 不用荧光绿/靛蓝/紫色渐变 hero</li>
            <li>— 不做四张图标方块功能卡</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
