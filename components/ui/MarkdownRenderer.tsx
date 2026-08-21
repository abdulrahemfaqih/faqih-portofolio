"use client";

/**
 * Markdown renderer dengan syntax highlighting untuk code blocks
 * Dipakai di halaman detail blog
 * Wajib "use client" karena react-syntax-highlighter
 */

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  // Code block dengan syntax highlighting
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isBlock = !!(node?.position?.start?.line !== node?.position?.end?.line || match);

    if (isBlock && match) {
      return (
        <div className="my-6 overflow-hidden rounded-sm border border-[--ink-12]">
          {/* Header code block: label bahasa */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[--ink-12] bg-[#1a1a1a]">
            <span className="font-[family-name:var(--font-geist-mono)] text-[0.7rem] tracking-[0.1em] uppercase text-[rgba(255,255,255,0.4)]">
              {match[1]}
            </span>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              padding: "1rem 1.25rem",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code
        className="px-1.5 py-0.5 rounded-sm bg-[--surface-alt] font-[family-name:var(--font-geist-mono)] text-sm text-[--ink]"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Headings dengan font serif
  h1: ({ children }) => (
    <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink] mt-10 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-body-lg font-semibold text-[--ink] mt-6 mb-2">
      {children}
    </h3>
  ),

  // Paragraf
  p: ({ children }) => (
    <p className="text-body-lg text-[--ink-70] leading-[1.75] mb-5">
      {children}
    </p>
  ),

  // List
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-5 space-y-1 text-body-lg text-[--ink-70]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-5 space-y-1 text-body-lg text-[--ink-70]">
      {children}
    </ol>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[--ink] pl-5 my-6 text-[--ink-70] italic">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-8 border-[--ink-12]" />
  ),

  // Link
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-[--ink] underline underline-offset-2 decoration-[--ink-45] hover:decoration-[--ink] transition-colors"
    >
      {children}
    </a>
  ),

  // Strong
  strong: ({ children }) => (
    <strong className="font-semibold text-[--ink]">{children}</strong>
  ),
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
