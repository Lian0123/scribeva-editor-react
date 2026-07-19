import { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ScribevaEditor,
  type EditorChange,
  type EditorLocale,
  type ScribevaEditorRef,
} from "../src";
import "../src/styles.css";
import "./demo.css";

const documents = {
  "zh-TW": `<p style="color: #2e7657; font-size: 13px"><strong>REACT 整合簡報 · 2026</strong></p>
<h1>讓內容狀態與<br>React 自然協作。</h1>
<p>Scribeva React 保留完整的專業 Ribbon、安全 HTML 管線與可攜式文件格式，並提供符合 React 生命週期的型別安全介面。</p>
<blockquote><p>核心專注內容，React 專注狀態；兩者之間維持清楚、可預測的契約。</p></blockquote>
<h2>整合重點</h2>
<ul><li><strong>受控與非受控</strong>兩種使用方式</li><li><strong>ref API</strong> 執行命令、聚焦與匯出</li><li><strong>Strict Mode</strong> 與卸載清理</li></ul>`,
  en: `<p style="color: #2e7657; font-size: 13px"><strong>REACT INTEGRATION BRIEF · 2026</strong></p>
<h1>Let document state<br>work naturally with React.</h1>
<p>Scribeva React preserves the professional Ribbon, safe HTML pipeline, and portable document format while adding a typed, lifecycle-aware React interface.</p>
<blockquote><p>The core owns content behavior. React owns application state. The contract between them stays explicit.</p></blockquote>
<h2>Integration essentials</h2>
<ul><li><strong>Controlled and uncontrolled</strong> usage</li><li><strong>Ref API</strong> for commands, focus, and export</li><li><strong>Strict Mode</strong> and deterministic cleanup</li></ul>`,
  ja: `<p style="color: #2e7657; font-size: 13px"><strong>REACT 統合概要 · 2026</strong></p>
<h1>文書の状態を React と<br>自然に連携。</h1>
<p>Scribeva React は、プロフェッショナルな Ribbon、安全な HTML 処理、移植可能な文書形式を維持しながら、型安全な React インターフェースを提供します。</p>
<blockquote><p>コアはコンテンツを、React は状態を担当し、明確な契約で接続します。</p></blockquote>
<h2>統合のポイント</h2>
<ul><li><strong>制御・非制御</strong>の両モード</li><li>コマンドと出力のための <strong>ref API</strong></li><li><strong>Strict Mode</strong> と確実なクリーンアップ</li></ul>`,
} as const;

type DemoLocale = keyof typeof documents;

function App() {
  const editorRef = useRef<ScribevaEditorRef>(null);
  const [locale, setLocale] = useState<DemoLocale>("zh-TW");
  const [readOnly, setReadOnly] = useState(false);
  const [html, setHTML] = useState<string>(documents["zh-TW"]);
  const [lastSource, setLastSource] = useState<EditorChange["source"]>("api");
  const [showOutput, setShowOutput] = useState<"html" | "json">("html");

  const output = useMemo(
    () =>
      showOutput === "html"
        ? html
        : JSON.stringify(editorRef.current?.getJSON() ?? {}, null, 2),
    [html, showOutput],
  );

  function changeLocale(next: DemoLocale) {
    setLocale(next);
    setHTML(documents[next]);
    document.documentElement.lang =
      next === "zh-TW" ? "zh-Hant" : next;
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Scribeva React home">
          <span className="brand-mark">S</span>
          <span><strong>Scribeva</strong><small>REACT</small></span>
        </a>
        <nav aria-label="主要導覽">
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href="#install">Install</a>
        </nav>
        <a className="github-link" href="https://github.com/Lian0123/scribeva-editor-react">
          GitHub ↗
        </a>
      </header>

      <main>
        <section className="hero">
          <aside><span>OFFICIAL BINDING</span><strong>React 18+</strong></aside>
          <div className="hero-copy">
            <p className="eyebrow">SCRIBEVA CORE · REACT LIFECYCLE</p>
            <h1>專業內容編輯，<em>自然融入 React。</em></h1>
            <p className="lede">
              保留 Scribeva 的安全、可攜與企業級介面，同時加入受控狀態、ref API 與可靠的元件清理。
            </p>
            <div className="hero-actions">
              <a className="primary" href="#playground">立即體驗</a>
              <a className="secondary" href="#install">查看安裝</a>
            </div>
          </div>
          <div className="code-card" aria-label="React 使用範例">
            <span>App.tsx</span>
            <pre><code>{`<ScribevaEditor
  value={html}
  locale="zh-TW"
  onChange={({ html }) =>
    setHTML(html)
  }
/>`}</code></pre>
          </div>
        </section>

        <section className="playground" id="playground">
          <header className="section-heading">
            <span>01 / LIVE</span>
            <h2>真正的 React 元件，完整的 Scribeva 體驗。</h2>
            <p>這個範例使用受控內容；每次編輯都同步回 React state。</p>
          </header>

          <div className="control-bar">
            <label>
              <span>介面語言</span>
              <select
                value={locale}
                onChange={(event) =>
                  changeLocale(event.target.value as DemoLocale)
                }
              >
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </label>
            <button
              type="button"
              aria-pressed={readOnly}
              onClick={() => setReadOnly((current) => !current)}
            >
              {readOnly ? "開啟編輯" : "唯讀模式"}
            </button>
            <button type="button" onClick={() => editorRef.current?.focus()}>
              聚焦編輯器
            </button>
            <span className="event-state">last source · {lastSource}</span>
          </div>

          <div className="editor-frame">
            <div className="editor-meta">
              <span>CONTROLLED REACT STATE</span>
              <span>HTML · JSON · COMMANDS</span>
            </div>
            <ScribevaEditor
              ref={editorRef}
              value={html}
              locale={locale as EditorLocale}
              readOnly={readOnly}
              ariaLabel="Scribeva React 線上範例編輯器"
              minHeight="560px"
              onChange={(change) => {
                setHTML(change.html);
                setLastSource(change.source);
              }}
            />
          </div>
        </section>

        <section className="api-section" id="api">
          <header>
            <span>02 / OUTPUT</span>
            <h2>React state 與可攜式內容，隨時保持一致。</h2>
          </header>
          <div className="output-panel">
            <div className="output-tabs" role="tablist" aria-label="輸出格式">
              <button
                role="tab"
                aria-selected={showOutput === "html"}
                onClick={() => setShowOutput("html")}
              >HTML</button>
              <button
                role="tab"
                aria-selected={showOutput === "json"}
                onClick={() => setShowOutput("json")}
              >JSON</button>
            </div>
            <pre><code>{output}</code></pre>
          </div>
          <div className="principles">
            <article><span>01</span><h3>薄封裝</h3><p>內容行為仍由經驗證的 Scribeva 核心負責。</p></article>
            <article><span>02</span><h3>型別完整</h3><p>Props、事件、文件與 ref 命令都有 TypeScript 型別。</p></article>
            <article><span>03</span><h3>生命週期可靠</h3><p>支援 Strict Mode，卸載時清除監聽器與 Blob URL。</p></article>
          </div>
        </section>

        <section className="install" id="install">
          <span>03 / INSTALL</span>
          <div><p className="eyebrow">TWO PACKAGES · ONE INTEGRATION</p><h2>幾分鐘內加入 React 專業編輯器。</h2></div>
          <pre><code>npm install scribeva-editor-react scribeva-editor</code></pre>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark">S</span><span><strong>Scribeva</strong><small>REACT</small></span></div>
        <p>MIT licensed · Content stays portable.</p>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>,
);
