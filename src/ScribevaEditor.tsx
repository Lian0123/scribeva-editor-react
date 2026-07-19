import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import {
  createEditor,
  type EditorChange,
  type EditorCommand,
  type EditorLocale,
  type EditorPlugin,
  type EditorTheme,
  type ScribevaDocument,
  type ScribevaEditor as CoreScribevaEditor,
} from "scribeva-editor";

export interface ScribevaEditorProps {
  /** Controlled HTML. Prefer `defaultValue` when the parent does not own the document. */
  value?: string;
  /** Initial HTML for an uncontrolled editor. */
  defaultValue?: string;
  /** Initial JSON document. Ignored when `value` or `defaultValue` is provided. */
  initialJSON?: ScribevaDocument;
  locale?: EditorLocale;
  theme?: EditorTheme;
  placeholder?: string;
  readOnly?: boolean;
  autofocus?: boolean;
  ariaLabel?: string;
  minHeight?: string;
  plugins?: EditorPlugin[];
  /** Class applied to the React host element. */
  className?: string;
  /** Class forwarded to the framework-independent Scribeva shell. */
  editorClassName?: string;
  style?: CSSProperties;
  id?: string;
  onChange?: (change: EditorChange) => void;
  onReady?: (editor: CoreScribevaEditor) => void;
}

export interface ScribevaEditorRef {
  readonly editor: CoreScribevaEditor | null;
  getHTML(): string;
  getJSON(): ScribevaDocument;
  setHTML(html: string): void;
  setJSON(document: ScribevaDocument): void;
  focus(): void;
  exec(command: string, value?: unknown): boolean;
  insertImageBlob(blob: Blob, alt?: string): string;
  registerCommand(name: string, command: EditorCommand): () => void;
}

function requireEditor(
  editor: CoreScribevaEditor | null,
): CoreScribevaEditor {
  if (!editor) {
    throw new Error("Scribeva editor is not mounted.");
  }
  return editor;
}

export const ScribevaEditor = forwardRef<
  ScribevaEditorRef,
  ScribevaEditorProps
>(function ScribevaEditor(
  {
    value,
    defaultValue,
    initialJSON,
    locale = "zh-TW",
    theme = "light",
    placeholder,
    readOnly = false,
    autofocus = false,
    ariaLabel,
    minHeight,
    plugins,
    className,
    editorClassName,
    style,
    id,
    onChange,
    onReady,
  },
  forwardedRef,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CoreScribevaEditor | null>(null);
  const initialJSONRef = useRef(initialJSON);
  const latestHTMLRef = useRef<string | undefined>(value ?? defaultValue);
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  const controlledRef = useRef(value);
  const syncingValueRef = useRef(false);

  onChangeRef.current = onChange;
  onReadyRef.current = onReady;
  controlledRef.current = value;

  useImperativeHandle(
    forwardedRef,
    () => ({
      get editor() {
        return editorRef.current;
      },
      getHTML: () =>
        editorRef.current?.getHTML() ?? latestHTMLRef.current ?? "",
      getJSON: () => requireEditor(editorRef.current).getJSON(),
      setHTML: (html) => requireEditor(editorRef.current).setHTML(html),
      setJSON: (document) =>
        requireEditor(editorRef.current).setJSON(document),
      focus: () => requireEditor(editorRef.current).focus(),
      exec: (command, commandValue) =>
        requireEditor(editorRef.current).exec(command, commandValue),
      insertImageBlob: (blob, alt) =>
        requireEditor(editorRef.current).insertImageBlob(blob, alt),
      registerCommand: (name, command) =>
        requireEditor(editorRef.current).registerCommand(name, command),
    }),
    [],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const currentHTML = controlledRef.current ?? latestHTMLRef.current;
    const editor = createEditor(host, {
      initialHTML: currentHTML,
      initialJSON: currentHTML === undefined ? initialJSONRef.current : undefined,
      locale,
      theme,
      placeholder,
      readOnly,
      autofocus,
      ariaLabel,
      minHeight,
      className: editorClassName,
      plugins,
      onChange: (change) => {
        latestHTMLRef.current = change.html;
        if (!syncingValueRef.current) onChangeRef.current?.(change);
      },
    });

    editorRef.current = editor;
    latestHTMLRef.current = editor.getHTML();
    onReadyRef.current?.(editor);

    return () => {
      latestHTMLRef.current = editor.getHTML();
      editor.destroy();
      if (editorRef.current === editor) editorRef.current = null;
    };
  }, [
    ariaLabel,
    autofocus,
    editorClassName,
    locale,
    minHeight,
    placeholder,
    plugins,
    theme,
  ]);

  useEffect(() => {
    editorRef.current?.setReadOnly(readOnly);
  }, [readOnly]);

  useEffect(() => {
    const editor = editorRef.current;
    if (value === undefined || !editor || editor.getHTML() === value) return;
    syncingValueRef.current = true;
    try {
      editor.setHTML(value);
      latestHTMLRef.current = editor.getHTML();
    } finally {
      syncingValueRef.current = false;
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      id={id}
      className={["scribeva-react", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
});
