import { act, createRef, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ScribevaEditor,
  type ScribevaEditorRef,
} from "../src/ScribevaEditor";

describe("ScribevaEditor", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it("mounts the editor and exposes the imperative API", async () => {
    const ref = createRef<ScribevaEditorRef>();
    const onReady = vi.fn();

    await act(async () => {
      root.render(
        <ScribevaEditor
          ref={ref}
          defaultValue="<h1>React document</h1>"
          locale="en"
          className="consumer-host"
          editorClassName="consumer-editor"
          onReady={onReady}
        />,
      );
    });

    expect(container.querySelector(".scribeva-react.consumer-host")).toBeTruthy();
    expect(container.querySelector(".scribeva.consumer-editor")).toBeTruthy();
    expect(ref.current?.getHTML()).toContain("React document");
    expect(ref.current?.getJSON().type).toBe("doc");
    expect(onReady).toHaveBeenCalledOnce();

    const api = ref.current!;
    act(() => api.setHTML("<p>Updated</p>"));
    expect(api.getHTML()).toBe("<p>Updated</p>");
    expect(api.exec("selectAll")).toBe(true);

    const document = api.getJSON();
    act(() => api.setJSON(document));
    act(() => api.focus());

    const command = vi.fn(() => true);
    const unregister = api.registerCommand("react:test", command);
    expect(api.exec("react:test", { source: "test" })).toBe(true);
    expect(command).toHaveBeenCalledOnce();
    unregister();

    expect(() =>
      api.insertImageBlob(new Blob(["text"], { type: "text/plain" })),
    ).toThrow("only accepts image");

    await act(async () => root.render(null));
    expect(api.getHTML()).toBe("<p>Updated</p>");
    expect(() => api.getJSON()).toThrow("not mounted");
  });

  it("synchronizes controlled HTML without reporting a user change", async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(
        <ScribevaEditor value="<p>One</p>" onChange={onChange} />,
      );
    });
    onChange.mockClear();

    await act(async () => {
      root.render(
        <ScribevaEditor value="<p>Two</p>" onChange={onChange} />,
      );
    });

    expect(container.querySelector("[data-scribeva-content]")?.innerHTML).toBe(
      "<p>Two</p>",
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("updates read-only state without remounting", async () => {
    const ref = createRef<ScribevaEditorRef>();

    await act(async () => {
      root.render(<ScribevaEditor ref={ref} readOnly={false} />);
    });
    const editor = ref.current?.editor;

    await act(async () => {
      root.render(<ScribevaEditor ref={ref} readOnly />);
    });

    expect(ref.current?.editor).toBe(editor);
    expect(
      container
        .querySelector("[data-scribeva-content]")
        ?.getAttribute("aria-readonly"),
    ).toBe("true");
    expect(container.querySelector(".scribeva")?.classList.contains("is-readonly")).toBe(
      true,
    );
  });

  it("recreates locale-dependent UI and survives React Strict Mode", async () => {
    const ref = createRef<ScribevaEditorRef>();

    await act(async () => {
      root.render(
        <StrictMode>
          <ScribevaEditor
            ref={ref}
            defaultValue="<p>Kept</p>"
            locale="zh-TW"
          />
        </StrictMode>,
      );
    });

    await act(async () => {
      root.render(
        <StrictMode>
          <ScribevaEditor
            ref={ref}
            defaultValue="<p>Kept</p>"
            locale="ja"
          />
        </StrictMode>,
      );
    });

    expect(ref.current?.getHTML()).toBe("<p>Kept</p>");
    expect(container.textContent).toContain("ホーム");
  });

  it("throws a useful error when commands run before mount", () => {
    const ref = createRef<ScribevaEditorRef>();
    expect(ref.current).toBeNull();
  });
});
