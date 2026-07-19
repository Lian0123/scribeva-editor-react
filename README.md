# Scribeva Editor React

Official React bindings for [`scribeva-editor`](https://www.npmjs.com/package/scribeva-editor).
The component keeps Scribeva's sanitized HTML pipeline and professional Ribbon
UI while adding controlled state, React lifecycle cleanup, and a typed ref API.

## Install

```bash
npm install scribeva-editor-react scribeva-editor
```

## Basic usage

```tsx
import { useState } from "react";
import { ScribevaEditor } from "scribeva-editor-react";
import "scribeva-editor-react/styles.css";

export function ArticleEditor() {
  const [html, setHTML] = useState("<h1>Hello, React</h1>");

  return (
    <ScribevaEditor
      value={html}
      locale="en"
      onChange={(change) => setHTML(change.html)}
    />
  );
}
```

Use `defaultValue` instead of `value` when React does not need to own every
document update:

```tsx
<ScribevaEditor defaultValue="<p>Uncontrolled document</p>" />
```

## Ref API

```tsx
import { useRef } from "react";
import {
  ScribevaEditor,
  type ScribevaEditorRef,
} from "scribeva-editor-react";

const editorRef = useRef<ScribevaEditorRef>(null);

<ScribevaEditor ref={editorRef} defaultValue="<p>Draft</p>" />;

editorRef.current?.focus();
editorRef.current?.exec("bold");
const html = editorRef.current?.getHTML();
const json = editorRef.current?.getJSON();
```

The ref also exposes `setHTML`, `setJSON`, `insertImageBlob`, and
`registerCommand`.

## Props

| Prop | Purpose |
|---|---|
| `value` | Controlled HTML |
| `defaultValue` | Initial uncontrolled HTML |
| `initialJSON` | Initial structured document when HTML is not provided |
| `locale` | `zh-TW`, `en`, `ja`, or a registered Scribeva locale |
| `theme` | `light`, `dark`, or `system` |
| `readOnly` | Toggle editing without remounting |
| `onChange` | Receive `{ html, json, source }` |
| `onReady` | Access the underlying Scribeva editor after mount |
| `plugins` | Register Scribeva plugins |
| `className` | Class on the React host |
| `editorClassName` | Class on the Scribeva shell |

Changing locale, theme, plugins, or shell-only configuration recreates the
underlying editor while preserving its current HTML. Memoize the `plugins`
array when it is created inside a component.

## Development

```bash
npm install
npm run dev
npm run check
npm pack --dry-run
```

The demo in `demo/` is both an integration example and the package website.
The package supports React 18 and 19 and requires Node.js 18 or newer for its
tooling.

## License

MIT
