import { uuid } from "@sanity/uuid";
import { SpinnerIcon, CheckmarkIcon, RemoveIcon, ChevronDownIcon, CloseIcon, LaunchIcon, HelpCircleIcon, ChevronLeftIcon, ChevronRightIcon } from "@sanity/icons";
import * as React from "react";
import React__default, { useLayoutEffect, createContext, useRef, useEffect, useId, useContext, useInsertionEffect, useMemo, useCallback, Children, isValidElement, useState, createElement, Fragment as Fragment$1, forwardRef, Component, useImperativeHandle, cloneElement, useDebugValue, useSyncExternalStore, lazy, Suspense, useReducer, startTransition } from "react";
import { defineDocumentInspector, PreviewCard, SanityDefaultPreview, definePlugin } from "sanity";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { styled, useTheme, css, ThemeProvider as ThemeProvider$1, keyframes as keyframes$1, createGlobalStyle } from "styled-components";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StateLink, useStateLink, useRouterState, route } from "sanity/router";
class UserGuideNodeBuilder {
  node;
  constructor(node) {
    this.node = { ...node, _key: uuid() };
  }
}
class DividerBuilder extends UserGuideNodeBuilder {
  constructor() {
    super({ _type: "divider" });
  }
  build() {
    return this.node;
  }
}
function slugify(string) {
  const a = "\xE0\xE1\xE2\xE4\xE6\xE3\xE5\u0101\u0103\u0105\xE7\u0107\u010D\u0111\u010F\xE8\xE9\xEA\xEB\u0113\u0117\u0119\u011B\u011F\u01F5\u1E27\xEE\xEF\xED\u012B\u012F\xEC\u0131\u0130\u0142\u1E3F\xF1\u0144\u01F9\u0148\xF4\xF6\xF2\xF3\u0153\xF8\u014D\xF5\u0151\u1E55\u0155\u0159\xDF\u015B\u0161\u015F\u0219\u0165\u021B\xFB\xFC\xF9\xFA\u016B\u01D8\u016F\u0171\u0173\u1E83\u1E8D\xFF\xFD\u017E\u017A\u017C\xB7/_,:;", b = "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------", p = new RegExp(a.split("").join("|"), "g");
  return string.toString().toLowerCase().replace(/\s+/g, "-").replace(p, (c) => b.charAt(a.indexOf(c))).replace(/&/g, "-and-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "").slice(0, 200);
}
class UserGuideError extends Error {
  url;
  constructor(msg2, url) {
    super(msg2), this.url = url;
  }
}
function defineUserGuide(structure) {
  try {
    return structure.map((builder) => builder.build());
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred");
  }
}
class MultiPageBuilder extends UserGuideNodeBuilder {
  pageBuilders = [];
  constructor() {
    super({ _type: "multiPage" });
  }
  title(title) {
    return this.node.title = title, this.node.slug ? this : this.slug(slugify(title));
  }
  pages(pages) {
    return this.pageBuilders = pages, this;
  }
  slug(slug) {
    return this.node.slug = slug, this;
  }
  icon(icon) {
    return this.node.icon = icon, this;
  }
  build() {
    const { slug, title } = this.node, helpUrl = "https://github.com/Q42/sanity-plugin-user-guide/tree/main?tab=readme-ov-file#multi-page";
    if (!this.pageBuilders || !this.pageBuilders.length)
      throw new UserGuideError("'MultiPage' must have at least one page", helpUrl);
    if (!title || !title.trim())
      throw new UserGuideError("'MultiPage' must have a valid title", helpUrl);
    if (!slug)
      throw new UserGuideError("'MultiPage' must have a slug", helpUrl);
    const pages = this.pageBuilders.map((pageBuilder) => pageBuilder.build());
    return {
      ...this.node,
      pages,
      slug,
      title
    };
  }
}
class PageBuilder extends UserGuideNodeBuilder {
  constructor() {
    super({ _type: "jsxPage" });
  }
  slug(slug) {
    return this.node.slug = slug, this;
  }
  title(title) {
    return this.node.title = title, this.node.slug ? this : this.slug(slugify(title));
  }
  markdown(markdown) {
    return this.node = { ...this.node, _type: "markdownPage", markdown }, this;
  }
  component(component) {
    return this.node = { ...this.node, _type: "jsxPage", component }, this;
  }
  icon(icon) {
    return this.node.icon = icon, this;
  }
  documentType(documentType) {
    return this.node.documentType = documentType, this;
  }
  documentId(documentId) {
    return this.node.documentId = documentId, this;
  }
  build(parentSlug) {
    const { _type, slug, title } = this.node, helpUrl = "https://github.com/Q42/sanity-plugin-user-guide/tree/main?tab=readme-ov-file#page";
    if (!title || !title.trim())
      throw new UserGuideError("'Page' must have a valid title", helpUrl);
    if (!slug)
      throw new UserGuideError("'Page' must have a slug", helpUrl);
    if (_type === "jsxPage") {
      const component = this.node.component;
      if (component)
        return { ...this.node, slug, title, component, parentSlug };
    }
    if (_type === "markdownPage") {
      const markdown = this.node.markdown;
      if (markdown)
        return { ...this.node, slug, title, markdown, parentSlug };
    }
    throw new UserGuideError("'Page' must have a markdown or page component", helpUrl);
  }
}
const divider = () => new DividerBuilder(), page = () => new PageBuilder(), multiPage = () => new MultiPageBuilder(), COLOR_HUES = [
  "gray",
  "blue",
  "purple",
  "magenta",
  "red",
  "orange",
  "yellow",
  "green",
  "cyan"
], COLOR_TINTS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950"
], black = {
  title: "Black",
  hex: "#0d0e12"
}, white = {
  title: "White",
  hex: "#ffffff"
}, gray = {
  50: {
    title: "Gray 50",
    hex: "#f6f6f8"
  },
  100: {
    title: "Gray 100",
    hex: "#eeeef1"
  },
  200: {
    title: "Gray 200",
    hex: "#e3e4e8"
  },
  300: {
    title: "Gray 300",
    hex: "#bbbdc9"
  },
  400: {
    title: "Gray 400",
    hex: "#9499ad"
  },
  500: {
    title: "Gray 500",
    hex: "#727892"
  },
  600: {
    title: "Gray 600",
    hex: "#515870"
  },
  700: {
    title: "Gray 700",
    hex: "#383d51"
  },
  800: {
    title: "Gray 800",
    hex: "#252837"
  },
  900: {
    title: "Gray 900",
    hex: "#1b1d27"
  },
  950: {
    title: "Gray 950",
    hex: "#13141b"
  }
}, blue = {
  50: {
    title: "Blue 50",
    hex: "#f5f8ff"
  },
  100: {
    title: "Blue 100",
    hex: "#e5edff"
  },
  200: {
    title: "Blue 200",
    hex: "#dbe5ff"
  },
  300: {
    title: "Blue 300",
    hex: "#a8bfff"
  },
  400: {
    title: "Blue 400",
    hex: "#7595ff"
  },
  500: {
    title: "Blue 500",
    hex: "#556bfc"
  },
  600: {
    title: "Blue 600",
    hex: "#4043e7"
  },
  700: {
    title: "Blue 700",
    hex: "#2927aa"
  },
  800: {
    title: "Blue 800",
    hex: "#192457"
  },
  900: {
    title: "Blue 900",
    hex: "#161a41"
  },
  950: {
    title: "Blue 950",
    hex: "#101228"
  }
}, purple = {
  50: {
    title: "Purple 50",
    hex: "#f8f5ff"
  },
  100: {
    title: "Purple 100",
    hex: "#f1ebff"
  },
  200: {
    title: "Purple 200",
    hex: "#ece1fe"
  },
  300: {
    title: "Purple 300",
    hex: "#ccb1fc"
  },
  400: {
    title: "Purple 400",
    hex: "#b087f7"
  },
  500: {
    title: "Purple 500",
    hex: "#8f57ef"
  },
  600: {
    title: "Purple 600",
    hex: "#721fe5"
  },
  700: {
    title: "Purple 700",
    hex: "#4c1a9e"
  },
  800: {
    title: "Purple 800",
    hex: "#2f1862"
  },
  900: {
    title: "Purple 900",
    hex: "#23173f"
  },
  950: {
    title: "Purple 950",
    hex: "#181128"
  }
}, magenta = {
  50: {
    title: "Magenta 50",
    hex: "#fef6f9"
  },
  100: {
    title: "Magenta 100",
    hex: "#fde8ef"
  },
  200: {
    title: "Magenta 200",
    hex: "#fcdee9"
  },
  300: {
    title: "Magenta 300",
    hex: "#f7abc5"
  },
  400: {
    title: "Magenta 400",
    hex: "#f0709b"
  },
  500: {
    title: "Magenta 500",
    hex: "#e72767"
  },
  600: {
    title: "Magenta 600",
    hex: "#b11651"
  },
  700: {
    title: "Magenta 700",
    hex: "#7c1342"
  },
  800: {
    title: "Magenta 800",
    hex: "#4b1130"
  },
  900: {
    title: "Magenta 900",
    hex: "#341325"
  },
  950: {
    title: "Magenta 950",
    hex: "#1f0f14"
  }
}, red = {
  50: {
    title: "Red 50",
    hex: "#fff6f5"
  },
  100: {
    title: "Red 100",
    hex: "#ffe7e5"
  },
  200: {
    title: "Red 200",
    hex: "#ffdedc"
  },
  300: {
    title: "Red 300",
    hex: "#fdada5"
  },
  400: {
    title: "Red 400",
    hex: "#f77769"
  },
  500: {
    title: "Red 500",
    hex: "#ef4434"
  },
  600: {
    title: "Red 600",
    hex: "#cc2819"
  },
  700: {
    title: "Red 700",
    hex: "#8b2018"
  },
  800: {
    title: "Red 800",
    hex: "#4d1714"
  },
  900: {
    title: "Red 900",
    hex: "#321615"
  },
  950: {
    title: "Red 950",
    hex: "#1e1011"
  }
}, orange = {
  50: {
    title: "Orange 50",
    hex: "#fff7f0"
  },
  100: {
    title: "Orange 100",
    hex: "#ffeadb"
  },
  200: {
    title: "Orange 200",
    hex: "#ffddc7"
  },
  300: {
    title: "Orange 300",
    hex: "#ffb685"
  },
  400: {
    title: "Orange 400",
    hex: "#ff8e42"
  },
  500: {
    title: "Orange 500",
    hex: "#fa6400"
  },
  600: {
    title: "Orange 600",
    hex: "#b14802"
  },
  700: {
    title: "Orange 700",
    hex: "#7c3404"
  },
  800: {
    title: "Orange 800",
    hex: "#461e07"
  },
  900: {
    title: "Orange 900",
    hex: "#32160b"
  },
  950: {
    title: "Orange 950",
    hex: "#21120d"
  }
}, yellow = {
  50: {
    title: "Yellow 50",
    hex: "#fefae1"
  },
  100: {
    title: "Yellow 100",
    hex: "#fcf3bb"
  },
  200: {
    title: "Yellow 200",
    hex: "#f9e994"
  },
  300: {
    title: "Yellow 300",
    hex: "#f7d455"
  },
  400: {
    title: "Yellow 400",
    hex: "#f9bc15"
  },
  500: {
    title: "Yellow 500",
    hex: "#d28a04"
  },
  600: {
    title: "Yellow 600",
    hex: "#965908"
  },
  700: {
    title: "Yellow 700",
    hex: "#653a0b"
  },
  800: {
    title: "Yellow 800",
    hex: "#3b220c"
  },
  900: {
    title: "Yellow 900",
    hex: "#271a11"
  },
  950: {
    title: "Yellow 950",
    hex: "#181410"
  }
}, green = {
  50: {
    title: "Green 50",
    hex: "#e7fef5"
  },
  100: {
    title: "Green 100",
    hex: "#c5fce8"
  },
  200: {
    title: "Green 200",
    hex: "#a9f9dc"
  },
  300: {
    title: "Green 300",
    hex: "#59f3ba"
  },
  400: {
    title: "Green 400",
    hex: "#0ff0a1"
  },
  500: {
    title: "Green 500",
    hex: "#04b97a"
  },
  600: {
    title: "Green 600",
    hex: "#01794f"
  },
  700: {
    title: "Green 700",
    hex: "#015133"
  },
  800: {
    title: "Green 800",
    hex: "#023120"
  },
  900: {
    title: "Green 900",
    hex: "#06231a"
  },
  950: {
    title: "Green 950",
    hex: "#071715"
  }
}, cyan = {
  50: {
    title: "Cyan 50",
    hex: "#e7fefe"
  },
  100: {
    title: "Cyan 100",
    hex: "#c5fcfc"
  },
  200: {
    title: "Cyan 200",
    hex: "#96f8f8"
  },
  300: {
    title: "Cyan 300",
    hex: "#62efef"
  },
  400: {
    title: "Cyan 400",
    hex: "#18e2e2"
  },
  500: {
    title: "Cyan 500",
    hex: "#04b8be"
  },
  600: {
    title: "Cyan 600",
    hex: "#037782"
  },
  700: {
    title: "Cyan 700",
    hex: "#024950"
  },
  800: {
    title: "Cyan 800",
    hex: "#042f34"
  },
  900: {
    title: "Cyan 900",
    hex: "#072227"
  },
  950: {
    title: "Cyan 950",
    hex: "#0d181c"
  }
}, hues = { gray, blue, purple, magenta, red, orange, yellow, green, cyan }, color$1 = { black, white, ...hues }, defaultThemeConfig = {
  avatar: {
    sizes: [{
      distance: -4,
      size: 19
    }, {
      distance: -4,
      size: 25
    }, {
      distance: -8,
      size: 33
    }, {
      distance: -12,
      size: 49
    }],
    focusRing: {
      offset: 1,
      width: 1
    }
  },
  button: {
    textWeight: "medium",
    border: {
      width: 1
    },
    focusRing: {
      offset: -1,
      width: 1
    }
  },
  card: {
    border: {
      width: 1
    },
    focusRing: {
      offset: -1,
      width: 1
    },
    shadow: {
      outline: 0.5
    }
  },
  container: [320, 640, 960, 1280, 1600, 1920],
  media: [360, 600, 900, 1200, 1800, 2400],
  layer: {
    dialog: {
      zOffset: 600
    },
    popover: {
      zOffset: 400
    },
    tooltip: {
      zOffset: 200
    }
  },
  radius: [0, 1, 3, 6, 9, 12, 21],
  shadow: [null, {
    umbra: [0, 0, 0, 0],
    penumbra: [0, 0, 0, 0],
    ambient: [0, 0, 0, 0]
  }, {
    umbra: [0, 3, 5, -2],
    penumbra: [0, 6, 10, 0],
    ambient: [0, 1, 18, 1]
  }, {
    umbra: [0, 7, 8, -4],
    penumbra: [0, 12, 17, 2],
    ambient: [0, 5, 22, 4]
  }, {
    umbra: [0, 9, 11, -5],
    penumbra: [0, 18, 28, 2],
    ambient: [0, 7, 34, 6]
  }, {
    umbra: [0, 11, 15, -7],
    penumbra: [0, 24, 38, 3],
    ambient: [0, 9, 46, 8]
  }],
  space: [0, 4, 8, 12, 20, 32, 52, 84, 136, 220],
  input: {
    border: {
      width: 1
    },
    checkbox: {
      size: 17,
      focusRing: {
        offset: -1,
        width: 1
      }
    },
    radio: {
      size: 17,
      markSize: 9,
      focusRing: {
        offset: -1,
        width: 1
      }
    },
    switch: {
      width: 25,
      height: 17,
      padding: 5,
      transitionDurationMs: 150,
      transitionTimingFunction: "ease-out",
      focusRing: {
        offset: 1,
        width: 1
      }
    },
    select: {
      focusRing: {
        offset: -1,
        width: 1
      }
    },
    text: {
      focusRing: {
        offset: -1,
        width: 1
      }
    }
  },
  style: {
    button: {
      root: {
        transition: "background-color 100ms,border-color 100ms,color 100ms"
      }
    }
    // card: {
    //   root: {
    //     transition: 'background-color 100ms,border-color 100ms,color 100ms',
    //   },
    // },
  }
}, defaultThemeFonts = {
  code: {
    family: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    sizes: [{
      ascenderHeight: 4,
      descenderHeight: 4,
      fontSize: 10,
      iconSize: 17,
      lineHeight: 15,
      letterSpacing: 0
    }, {
      ascenderHeight: 5,
      descenderHeight: 5,
      fontSize: 13,
      iconSize: 21,
      lineHeight: 19,
      letterSpacing: 0
    }, {
      ascenderHeight: 6,
      descenderHeight: 6,
      fontSize: 16,
      iconSize: 25,
      lineHeight: 23,
      letterSpacing: 0
    }, {
      ascenderHeight: 7,
      descenderHeight: 7,
      fontSize: 19,
      iconSize: 29,
      lineHeight: 27,
      letterSpacing: 0
    }, {
      ascenderHeight: 8,
      descenderHeight: 8,
      fontSize: 22,
      iconSize: 33,
      lineHeight: 31,
      letterSpacing: 0
    }]
  },
  heading: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Liberation Sans", Helvetica, Arial, system-ui, sans-serif',
    weights: {
      regular: 700,
      medium: 800,
      semibold: 900,
      bold: 900
    },
    sizes: [{
      ascenderHeight: 5,
      descenderHeight: 5,
      fontSize: 13,
      iconSize: 17,
      lineHeight: 19,
      letterSpacing: 0
    }, {
      ascenderHeight: 6,
      descenderHeight: 6,
      fontSize: 16,
      iconSize: 25,
      lineHeight: 23,
      letterSpacing: 0
    }, {
      ascenderHeight: 7,
      descenderHeight: 7,
      fontSize: 21,
      iconSize: 33,
      lineHeight: 29,
      letterSpacing: 0
    }, {
      ascenderHeight: 8,
      descenderHeight: 8,
      fontSize: 27,
      iconSize: 41,
      lineHeight: 35,
      letterSpacing: 0
    }, {
      ascenderHeight: 9.5,
      descenderHeight: 8.5,
      fontSize: 33,
      iconSize: 49,
      lineHeight: 41,
      letterSpacing: 0
    }, {
      ascenderHeight: 10.5,
      descenderHeight: 9.5,
      fontSize: 38,
      iconSize: 53,
      lineHeight: 47,
      letterSpacing: 0
    }]
  },
  label: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Liberation Sans", system-ui, sans-serif',
    weights: {
      regular: 600,
      medium: 700,
      semibold: 800,
      bold: 900
    },
    sizes: [{
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 8.1,
      iconSize: 13,
      lineHeight: 10,
      letterSpacing: 0.5
    }, {
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 9.5,
      iconSize: 15,
      lineHeight: 11,
      letterSpacing: 0.5
    }, {
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 10.8,
      iconSize: 17,
      lineHeight: 12,
      letterSpacing: 0.5
    }, {
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 12.25,
      iconSize: 19,
      lineHeight: 13,
      letterSpacing: 0.5
    }, {
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 13.6,
      iconSize: 21,
      lineHeight: 14,
      letterSpacing: 0.5
    }, {
      ascenderHeight: 2,
      descenderHeight: 2,
      fontSize: 15,
      iconSize: 23,
      lineHeight: 15,
      letterSpacing: 0.5
    }]
  },
  text: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Liberation Sans", Helvetica, Arial, system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    sizes: [{
      ascenderHeight: 4,
      descenderHeight: 4,
      fontSize: 10,
      iconSize: 17,
      lineHeight: 15,
      letterSpacing: 0
    }, {
      ascenderHeight: 5,
      descenderHeight: 5,
      fontSize: 13,
      iconSize: 21,
      lineHeight: 19,
      letterSpacing: 0
    }, {
      ascenderHeight: 6,
      descenderHeight: 6,
      fontSize: 15,
      iconSize: 25,
      lineHeight: 23,
      letterSpacing: 0
    }, {
      ascenderHeight: 7,
      descenderHeight: 7,
      fontSize: 18,
      iconSize: 29,
      lineHeight: 27,
      letterSpacing: 0
    }, {
      ascenderHeight: 8,
      descenderHeight: 8,
      fontSize: 21,
      iconSize: 33,
      lineHeight: 31,
      letterSpacing: 0
    }]
  }
}, cache$4 = /* @__PURE__ */ new WeakMap();
function themeColor_v0_v2(color_v0) {
  const cached_v2 = cache$4.get(color_v0);
  if (cached_v2) return cached_v2;
  const base = stateThemeColor_v0_v2(color_v0, color_v0.card.enabled), color_v2 = {
    _blend: color_v0._blend || (color_v0.dark ? "screen" : "multiply"),
    _dark: color_v0.dark,
    accent: base.accent,
    avatar: base.avatar,
    backdrop: color_v0.base.shadow.ambient,
    badge: base.badge,
    bg: color_v0.base.bg,
    border: color_v0.base.border,
    button: {
      default: stateTonesThemeColor_v0_v2(color_v0, color_v0.button.default),
      ghost: stateTonesThemeColor_v0_v2(color_v0, color_v0.button.ghost),
      bleed: stateTonesThemeColor_v0_v2(color_v0, color_v0.button.bleed)
    },
    code: base.code,
    fg: color_v0.base.fg,
    focusRing: color_v0.base.focusRing,
    icon: base.muted.fg,
    input: {
      default: inputStatesThemeColor_v0_v2(color_v0.input.default),
      invalid: inputStatesThemeColor_v0_v2(color_v0.input.invalid)
    },
    kbd: base.kbd,
    link: base.link,
    muted: {
      ...base.muted,
      bg: color_v0.selectable?.default.enabled.bg2 || color_v0.base.bg
    },
    selectable: stateTonesThemeColor_v0_v2(color_v0, color_v0.selectable || color_v0.muted),
    shadow: color_v0.base.shadow,
    skeleton: {
      from: color_v0.skeleton?.from || color_v0.base.border,
      to: color_v0.skeleton?.to || color_v0.base.border
    },
    syntax: color_v0.syntax
  };
  return cache$4.set(color_v0, color_v2), color_v2;
}
function stateTonesThemeColor_v0_v2(v0, t) {
  return {
    default: {
      enabled: stateThemeColor_v0_v2(v0, t.default.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.default.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.default.pressed),
      selected: stateThemeColor_v0_v2(v0, t.default.selected),
      disabled: stateThemeColor_v0_v2(v0, t.default.disabled)
    },
    neutral: {
      enabled: stateThemeColor_v0_v2(v0, t.default.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.default.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.default.pressed),
      selected: stateThemeColor_v0_v2(v0, t.default.selected),
      disabled: stateThemeColor_v0_v2(v0, t.default.disabled)
    },
    primary: {
      enabled: stateThemeColor_v0_v2(v0, t.primary.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.primary.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.primary.pressed),
      selected: stateThemeColor_v0_v2(v0, t.primary.selected),
      disabled: stateThemeColor_v0_v2(v0, t.primary.disabled)
    },
    suggest: {
      enabled: stateThemeColor_v0_v2(v0, t.primary.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.primary.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.primary.pressed),
      selected: stateThemeColor_v0_v2(v0, t.primary.selected),
      disabled: stateThemeColor_v0_v2(v0, t.primary.disabled)
    },
    positive: {
      enabled: stateThemeColor_v0_v2(v0, t.positive.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.positive.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.positive.pressed),
      selected: stateThemeColor_v0_v2(v0, t.positive.selected),
      disabled: stateThemeColor_v0_v2(v0, t.positive.disabled)
    },
    caution: {
      enabled: stateThemeColor_v0_v2(v0, t.caution.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.caution.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.caution.pressed),
      selected: stateThemeColor_v0_v2(v0, t.caution.selected),
      disabled: stateThemeColor_v0_v2(v0, t.caution.disabled)
    },
    critical: {
      enabled: stateThemeColor_v0_v2(v0, t.critical.enabled),
      hovered: stateThemeColor_v0_v2(v0, t.critical.hovered),
      pressed: stateThemeColor_v0_v2(v0, t.critical.pressed),
      selected: stateThemeColor_v0_v2(v0, t.critical.selected),
      disabled: stateThemeColor_v0_v2(v0, t.critical.disabled)
    }
  };
}
function stateThemeColor_v0_v2(v0, state) {
  return {
    ...state,
    avatar: {
      gray: {
        bg: v0.spot.gray,
        fg: v0.base.bg
      },
      blue: {
        bg: v0.spot.blue,
        fg: v0.base.bg
      },
      purple: {
        bg: v0.spot.purple,
        fg: v0.base.bg
      },
      magenta: {
        bg: v0.spot.magenta,
        fg: v0.base.bg
      },
      red: {
        bg: v0.spot.red,
        fg: v0.base.bg
      },
      orange: {
        bg: v0.spot.orange,
        fg: v0.base.bg
      },
      yellow: {
        bg: v0.spot.yellow,
        fg: v0.base.bg
      },
      green: {
        bg: v0.spot.green,
        fg: v0.base.bg
      },
      cyan: {
        bg: v0.spot.cyan,
        fg: v0.base.bg
      }
    },
    badge: {
      default: {
        bg: v0.muted.default.enabled.bg,
        fg: v0.muted.default.enabled.fg,
        dot: v0.muted.default.enabled.muted.fg,
        icon: v0.muted.default.enabled.muted.fg
      },
      neutral: {
        bg: v0.muted.transparent.enabled.bg,
        fg: v0.muted.transparent.enabled.fg,
        dot: v0.muted.transparent.enabled.muted.fg,
        icon: v0.muted.transparent.enabled.muted.fg
      },
      primary: {
        bg: v0.muted.primary.enabled.bg,
        fg: v0.muted.primary.enabled.fg,
        dot: v0.muted.primary.enabled.muted.fg,
        icon: v0.muted.primary.enabled.muted.fg
      },
      suggest: {
        bg: v0.muted.primary.enabled.bg,
        fg: v0.muted.primary.enabled.fg,
        dot: v0.muted.primary.enabled.muted.fg,
        icon: v0.muted.primary.enabled.muted.fg
      },
      positive: {
        bg: v0.muted.positive.enabled.bg,
        fg: v0.muted.positive.enabled.fg,
        dot: v0.muted.positive.enabled.muted.fg,
        icon: v0.muted.positive.enabled.muted.fg
      },
      caution: {
        bg: v0.muted.caution.enabled.bg,
        fg: v0.muted.caution.enabled.fg,
        dot: v0.muted.caution.enabled.muted.fg,
        icon: v0.muted.caution.enabled.muted.fg
      },
      critical: {
        bg: v0.muted.critical.enabled.bg,
        fg: v0.muted.critical.enabled.fg,
        dot: v0.muted.critical.enabled.muted.fg,
        icon: v0.muted.critical.enabled.muted.fg
      }
    },
    kbd: {
      bg: v0.muted.default.enabled.bg,
      fg: v0.muted.default.enabled.fg,
      border: v0.muted.default.enabled.border
    },
    muted: {
      ...v0.muted.default.enabled.muted,
      bg: state.bg2 || state.bg
    },
    skeleton: {
      from: state.skeleton?.from || state.border,
      to: state.skeleton?.to || state.border
    }
  };
}
function inputStatesThemeColor_v0_v2(states) {
  return {
    enabled: inputStateThemeColor_v0_v2(states.enabled),
    disabled: inputStateThemeColor_v0_v2(states.disabled),
    readOnly: inputStateThemeColor_v0_v2(states.readOnly),
    hovered: inputStateThemeColor_v0_v2(states.hovered)
  };
}
function inputStateThemeColor_v0_v2(state) {
  return {
    bg: state.bg,
    border: state.border,
    fg: state.fg,
    muted: {
      bg: state.bg2
    },
    placeholder: state.placeholder
  };
}
const cache$3 = /* @__PURE__ */ new WeakMap();
function getTheme_v2(theme) {
  if (theme.sanity.v2?._resolved) return theme.sanity.v2;
  const cached_v2 = cache$3.get(theme);
  if (cached_v2) return cached_v2;
  const v2 = {
    _version: 2,
    _resolved: !0,
    avatar: {
      ...defaultThemeConfig.avatar,
      ...theme.sanity.avatar
    },
    button: {
      ...defaultThemeConfig.button,
      ...theme.sanity.button
    },
    card: defaultThemeConfig.card,
    color: themeColor_v0_v2(theme.sanity.color),
    container: theme.sanity.container,
    font: theme.sanity.fonts,
    input: {
      ...defaultThemeConfig.input,
      ...theme.sanity.input,
      checkbox: {
        ...defaultThemeConfig.input.checkbox,
        ...theme.sanity.input.checkbox
      },
      radio: {
        ...defaultThemeConfig.input.radio,
        ...theme.sanity.input.radio
      },
      switch: {
        ...defaultThemeConfig.input.switch,
        ...theme.sanity.input.switch
      }
    },
    layer: theme.sanity.layer ?? defaultThemeConfig.layer,
    media: theme.sanity.media,
    radius: theme.sanity.radius,
    shadow: theme.sanity.shadows,
    space: theme.sanity.space,
    style: theme.sanity.styles
  };
  return cache$3.set(theme, v2), v2;
}
function is_v2(themeProp) {
  return themeProp._version === 2;
}
const cache$2 = /* @__PURE__ */ new WeakMap();
function v0_v2(v0) {
  if (v0.v2) return v0.v2;
  const cached_v2 = cache$2.get(v0);
  if (cached_v2) return cached_v2;
  const {
    avatar,
    button,
    color: color2,
    container,
    fonts: font,
    input,
    layer,
    media,
    radius,
    shadows: shadow,
    space,
    styles: style
  } = v0, v2 = {
    _version: 2,
    avatar: {
      ...defaultThemeConfig.avatar,
      ...avatar
    },
    button: {
      ...defaultThemeConfig.button,
      ...button
    },
    card: defaultThemeConfig.card,
    color: {
      light: {
        transparent: themeColor_v0_v2(color2.light.transparent),
        default: themeColor_v0_v2(color2.light.default),
        neutral: themeColor_v0_v2(color2.light.transparent),
        primary: themeColor_v0_v2(color2.light.primary),
        suggest: themeColor_v0_v2(color2.light.primary),
        positive: themeColor_v0_v2(color2.light.positive),
        caution: themeColor_v0_v2(color2.light.caution),
        critical: themeColor_v0_v2(color2.light.critical)
      },
      dark: {
        transparent: themeColor_v0_v2(color2.dark.transparent),
        default: themeColor_v0_v2(color2.dark.default),
        neutral: themeColor_v0_v2(color2.dark.transparent),
        primary: themeColor_v0_v2(color2.dark.primary),
        suggest: themeColor_v0_v2(color2.dark.primary),
        positive: themeColor_v0_v2(color2.dark.positive),
        caution: themeColor_v0_v2(color2.dark.caution),
        critical: themeColor_v0_v2(color2.dark.critical)
      }
    },
    container,
    font,
    input: {
      ...defaultThemeConfig.input,
      ...input,
      checkbox: {
        ...defaultThemeConfig.input.checkbox,
        ...input.checkbox
      },
      radio: {
        ...defaultThemeConfig.input.radio,
        ...input.radio
      },
      switch: {
        ...defaultThemeConfig.input.switch,
        ...input.switch
      }
    },
    layer: layer ?? defaultThemeConfig.layer,
    media,
    radius,
    shadow,
    space,
    style
  };
  return cache$2.set(v0, v2), v2;
}
const cache$1 = /* @__PURE__ */ new WeakMap();
function v2_v0(v2) {
  const cachedTheme = cache$1.get(v2);
  if (cachedTheme) return cachedTheme;
  const {
    avatar,
    button,
    color: color2,
    container,
    font: fonts,
    input,
    media,
    radius,
    shadow: shadows,
    space,
    style: styles
  } = v2;
  return {
    _version: 0,
    avatar,
    button,
    container,
    color: {
      light: {
        transparent: themeColor_v2_v0(color2.light.transparent),
        default: themeColor_v2_v0(color2.light.default),
        primary: themeColor_v2_v0(color2.light.primary),
        positive: themeColor_v2_v0(color2.light.positive),
        caution: themeColor_v2_v0(color2.light.caution),
        critical: themeColor_v2_v0(color2.light.critical)
      },
      dark: {
        transparent: themeColor_v2_v0(color2.dark.transparent),
        default: themeColor_v2_v0(color2.dark.default),
        primary: themeColor_v2_v0(color2.dark.primary),
        positive: themeColor_v2_v0(color2.dark.positive),
        caution: themeColor_v2_v0(color2.dark.caution),
        critical: themeColor_v2_v0(color2.dark.critical)
      }
    },
    focusRing: input.text.focusRing,
    fonts,
    input,
    media,
    radius,
    shadows,
    space,
    styles,
    v2
  };
}
function themeColor_v2_v0(color_v2) {
  return {
    base: {
      bg: color_v2.bg,
      fg: color_v2.fg,
      border: color_v2.border,
      focusRing: color_v2.focusRing,
      shadow: color_v2.shadow
    },
    button: color_v2.button,
    card: color_v2.selectable.default,
    dark: color_v2._dark,
    input: {
      default: inputStatesThemeColor_v2_v0(color_v2.input.default),
      invalid: inputStatesThemeColor_v2_v0(color_v2.input.invalid)
    },
    muted: {
      ...color_v2.button.ghost,
      transparent: color_v2.button.ghost.default
    },
    solid: {
      ...color_v2.button.default,
      transparent: color_v2.button.default.default
    },
    selectable: color_v2.selectable,
    spot: {
      gray: color_v2.avatar.gray.bg,
      blue: color_v2.avatar.blue.bg,
      purple: color_v2.avatar.purple.bg,
      magenta: color_v2.avatar.magenta.bg,
      red: color_v2.avatar.red.bg,
      orange: color_v2.avatar.orange.bg,
      yellow: color_v2.avatar.yellow.bg,
      green: color_v2.avatar.green.bg,
      cyan: color_v2.avatar.cyan.bg
    },
    syntax: color_v2.syntax
  };
}
function inputStatesThemeColor_v2_v0(t) {
  return {
    enabled: inputStateThemeColor_v2_v0(t.enabled),
    disabled: inputStateThemeColor_v2_v0(t.disabled),
    readOnly: inputStateThemeColor_v2_v0(t.readOnly),
    hovered: inputStateThemeColor_v2_v0(t.hovered)
  };
}
function inputStateThemeColor_v2_v0(t) {
  return {
    bg: t.bg,
    bg2: t.muted.bg,
    border: t.border,
    fg: t.fg,
    placeholder: t.placeholder
  };
}
const THEME_COLOR_BLEND_MODES = ["multiply", "screen"], THEME_COLOR_CARD_TONES = [
  "transparent",
  "default",
  "neutral",
  "primary",
  // deprecated
  "suggest",
  "positive",
  "caution",
  "critical"
], THEME_COLOR_STATE_TONES = [
  "default",
  "neutral",
  "primary",
  // deprecated
  "suggest",
  "positive",
  "caution",
  "critical"
], THEME_COLOR_STATES = ["enabled", "hovered", "pressed", "selected", "disabled"], THEME_COLOR_BUTTON_MODES = ["default", "ghost", "bleed"], THEME_COLOR_INPUT_MODES = ["default", "invalid"], THEME_COLOR_INPUT_STATES = ["enabled", "hovered", "readOnly", "disabled"];
function isColorBlendModeValue(str) {
  return THEME_COLOR_BLEND_MODES.includes(str);
}
function isColorHueKey(str) {
  return COLOR_HUES.includes(str);
}
function isColorTintKey(str) {
  return COLOR_TINTS.includes(str);
}
function isColorMixPercentValue(str) {
  return /^\d+%$/.test(str);
}
function parseTokenValue(str) {
  const segments = str.split("/");
  let nextSegment = segments.shift() || "";
  const [segment0, segment0mix] = nextSegment.split(" ");
  if (isColorTintKey(segment0)) {
    const tint = segment0, segment1 = segments.shift() || "";
    if (isColorMixPercentValue(segment0mix)) {
      const mix2 = Number(segment0mix.slice(0, -1)) / 100;
      return {
        type: "color",
        tint,
        mix: mix2
      };
    }
    if (isColorOpacityValue(segment1)) {
      const opacity = Number(segment1);
      return {
        type: "color",
        tint,
        opacity
      };
    }
    return {
      type: "color",
      tint
    };
  }
  if (isColorValue(segment0)) {
    const key2 = segment0, segment1 = segments.shift() || "";
    if (isColorMixPercentValue(segment0mix)) {
      const mix2 = Number(segment0mix.slice(0, -1)) / 100;
      return {
        type: "color",
        key: key2,
        mix: mix2
      };
    }
    if (isColorOpacityValue(segment1)) {
      const opacity = Number(segment1);
      return {
        type: "color",
        key: key2,
        opacity
      };
    }
    return {
      type: "color",
      key: key2
    };
  }
  if (isColorHueKey(segment0)) {
    const hue = segment0;
    nextSegment = segments.shift() || "";
    const [segment1, segment1mix] = nextSegment.split(" ");
    if (isColorTintKey(segment1)) {
      const tint = segment1, segment2 = segments.shift() || "";
      if (isColorMixPercentValue(segment1mix)) {
        const mix2 = Number(segment1mix.slice(0, -1)) / 100;
        return {
          type: "color",
          hue,
          tint,
          mix: mix2
        };
      }
      if (isColorOpacityValue(segment2)) {
        const opacity = Number(segment2);
        return {
          type: "color",
          hue,
          tint,
          opacity
        };
      }
      return {
        type: "color",
        hue,
        tint
      };
    }
    return {
      type: "hue",
      value: hue
    };
  }
  if (isColorBlendModeValue(segment0))
    return {
      type: "blendMode",
      value: segment0
    };
}
function isColorValue(str) {
  return str === "black" || str === "white";
}
function isColorOpacityValue(str) {
  return str === "0" || /^0\.[0-9]+$/.test(str) || str === "1";
}
function compileColorTokenValue(node) {
  let key2 = "";
  return node.key === "black" || node.key === "white" ? key2 = node.key : key2 = `${node.hue}/${node.tint}`, node.mix !== void 0 ? `${key2} ${node.mix * 100}%` : (node.opacity !== void 0 && (key2 += `/${node.opacity}`), key2);
}
const DEFAULT_COLOR_TOKEN_VALUE = ["500", "500"];
function resolveColorTokenValue(context2, value = DEFAULT_COLOR_TOKEN_VALUE) {
  const {
    hue,
    scheme
  } = context2, node = parseTokenValue(value[scheme === "light" ? 0 : 1]);
  if (!node || node.type !== "color")
    throw new Error(`Invalid color token: ${value[0]}`);
  return compileColorTokenValue({
    ...node,
    hue: node.hue || hue
  });
}
const defaultColorTokens = {
  base: {
    "*": {
      _blend: ["multiply", "screen"],
      accent: {
        fg: ["purple/600", "purple/400"]
      },
      avatar: {
        "*": {
          _blend: ["screen", "multiply"],
          bg: ["500", "400"],
          fg: ["white", "black"]
        }
      },
      backdrop: ["gray/200/0.5", "black/0.5"],
      badge: {
        "*": {
          bg: ["100", "900"],
          fg: ["600", "400"],
          icon: ["500", "500"],
          dot: ["500", "500"]
        },
        positive: {
          bg: ["200 50%", "900"],
          fg: ["600", "500"]
        },
        caution: {
          bg: ["200 50%", "900"],
          fg: ["600", "500"]
        }
      },
      bg: ["50", "950"],
      border: ["200", "800"],
      code: {
        bg: ["50", "950"],
        fg: ["600", "400"]
      },
      fg: ["800", "200"],
      focusRing: ["blue/500", "blue/500"],
      icon: ["600", "400"],
      kbd: {
        bg: ["white", "black"],
        fg: ["600", "400"],
        border: ["200", "800"]
      },
      link: {
        fg: ["blue/600", "blue/300"]
      },
      muted: {
        bg: ["50", "950"],
        fg: ["700 75%", "300 75%"]
      },
      shadow: {
        outline: ["500/0.3", "500/0.4"],
        umbra: ["gray/500/0.1", "black/0.2"],
        penumbra: ["gray/500/0.07", "black/0.14"],
        ambient: ["gray/500/0.06", "black/0.12"]
      },
      skeleton: {
        from: ["100", "900"],
        to: ["100 50%", "900 50%"]
      }
    },
    transparent: {
      bg: ["50", "black"]
    },
    default: {
      bg: ["white", "950"],
      fg: ["800", "200"],
      muted: {
        fg: ["600", "400"]
      }
    },
    primary: {
      _hue: "blue"
    },
    suggest: {
      _hue: "purple"
    },
    positive: {
      _hue: "green",
      shadow: {
        outline: ["500/0.4", "500/0.4"]
      }
    },
    caution: {
      _hue: "yellow",
      shadow: {
        outline: ["600/0.3", "500/0.4"]
      }
    },
    critical: {
      _hue: "red"
    }
  },
  button: {
    default: {
      "*": {
        "*": {
          _blend: ["screen", "multiply"],
          accent: {
            fg: ["purple/300", "purple/700"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["500", "400"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              bg: ["900", "100"],
              fg: ["400", "600"],
              dot: ["500", "500"],
              icon: ["500", "500"]
            }
          },
          bg: ["500", "400"],
          border: ["500/0", "400/0"],
          code: {
            bg: ["500 20%", "400 20%"],
            fg: ["200", "600"]
          },
          fg: ["white", "black"],
          icon: ["100 70%", "900 70%"],
          kbd: {
            bg: ["black", "white"],
            fg: ["200", "600"],
            border: ["800", "200"]
          },
          link: {
            fg: ["blue/200", "blue/600"]
          },
          muted: {
            bg: ["950", "50"],
            fg: ["100 70%", "900 70%"]
          },
          skeleton: {
            from: ["900", "100"],
            to: ["900 50%", "100 50%"]
          }
        },
        hovered: {
          bg: ["600", "300"],
          border: ["700/0", "300/0"]
        },
        pressed: {
          bg: ["700", "300"]
        },
        selected: {
          bg: ["700", "300"]
        },
        disabled: {
          _hue: "gray",
          accent: {
            fg: ["100 70%", "900 70%"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["gray/500", "gray/400"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              bg: ["gray/700", "gray/300"],
              fg: ["white", "black"],
              dot: ["white", "black"],
              icon: ["white", "black"]
            }
          },
          bg: ["300", "600"],
          code: {
            bg: ["950", "50"],
            fg: ["300", "600"]
          },
          fg: ["300", "600"],
          muted: {
            bg: ["950", "50"],
            fg: ["300", "600"]
          },
          kbd: {
            bg: ["black", "white"],
            fg: ["white", "black"],
            border: ["700", "300"]
          },
          link: {
            fg: ["100 70%", "900 70%"]
          }
        }
      },
      default: {
        "*": {
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["500", "400"],
              fg: ["white", "black"]
            }
          },
          bg: ["800", "200"],
          muted: {
            bg: ["950", "50"],
            fg: ["400", "600"]
          }
        },
        hovered: {
          bg: ["900", "100"]
        },
        pressed: {
          bg: ["black", "white"]
        },
        selected: {
          bg: ["black", "white"]
        }
      }
    },
    ghost: {
      "*": {
        "*": {
          _blend: ["multiply", "screen"],
          accent: {
            fg: ["purple/700 60%", "purple/300 70%"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["500", "400"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              bg: ["100", "900"],
              fg: ["600", "400"],
              dot: ["500", "500"],
              icon: ["500", "500"]
            }
          },
          bg: ["50", "950"],
          border: ["100", "900"],
          code: {
            bg: ["500 10%", "400 10%"],
            fg: ["700 60%", "400 60%"]
          },
          fg: ["600", "400"],
          icon: ["700 60%", "300 60%"],
          kbd: {
            bg: ["white", "black"],
            fg: ["600", "400"],
            border: ["200", "800"]
          },
          link: {
            fg: ["blue/700 60%", "blue/300 60%"]
          },
          muted: {
            bg: ["100", "950"],
            fg: ["700 60%", "300 60%"]
          },
          skeleton: {
            from: ["100", "900"],
            to: ["100 50%", "900 50%"]
          }
        },
        hovered: {
          bg: ["100", "900"],
          fg: ["700", "300"]
        },
        pressed: {
          bg: ["200", "800"],
          fg: ["800", "200"]
        },
        selected: {
          bg: ["200", "800"],
          fg: ["800", "200"]
        },
        disabled: {
          _hue: "gray",
          accent: {
            fg: ["200", "800"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["gray/100", "gray/900"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              _hue: "gray",
              bg: ["50", "950"],
              fg: ["gray/200", "gray/800"],
              dot: ["gray/200", "gray/800"],
              icon: ["gray/200", "gray/800"]
            }
          },
          border: ["100", "900"],
          code: {
            bg: ["50", "950"],
            fg: ["200", "800"]
          },
          fg: ["400", "600"],
          icon: ["300", "700"],
          muted: {
            fg: ["300", "700"]
          },
          kbd: {
            bg: ["white", "black"],
            fg: ["200", "800"],
            border: ["100", "900"]
          },
          link: {
            fg: ["200", "800"]
          }
        }
      },
      positive: {
        "*": {
          border: ["600 20%", "800"]
        }
      },
      caution: {
        "*": {
          border: ["600 20%", "800"]
        }
      }
    },
    bleed: {
      "*": {
        "*": {
          _blend: ["multiply", "screen"],
          accent: {
            fg: ["purple/700 70%", "purple/300 70%"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["500", "400"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              bg: ["100", "900"],
              fg: ["600", "400"],
              dot: ["500", "500"],
              icon: ["500", "500"]
            }
          },
          bg: ["white", "black"],
          border: ["white/0", "black/0"],
          code: {
            bg: ["50", "950"],
            fg: ["700 75%", "300 75%"]
          },
          fg: ["700", "300"],
          icon: ["700 75%", "300 75%"],
          kbd: {
            bg: ["white", "black"],
            fg: ["700", "300"],
            border: ["200", "800"]
          },
          link: {
            fg: ["blue/700 70%", "blue/300 70%"]
          },
          muted: {
            bg: ["100", "950"],
            fg: ["700 75%", "300 75%"]
          },
          skeleton: {
            from: ["100", "900"],
            to: ["100 50%", "900 50%"]
          }
        },
        hovered: {
          bg: ["50", "900"],
          fg: ["800", "200"],
          icon: ["800 70%", "300 70%"]
        },
        pressed: {
          bg: ["100", "800"],
          fg: ["800", "200"],
          icon: ["800 70%", "200 70%"]
        },
        selected: {
          bg: ["100", "900"],
          fg: ["800", "200"],
          icon: ["800 60%", "200 60%"]
        },
        disabled: {
          _hue: "gray",
          accent: {
            fg: ["200", "800"]
          },
          avatar: {
            "*": {
              _blend: ["screen", "multiply"],
              bg: ["gray/100", "gray/900"],
              fg: ["white", "black"]
            }
          },
          badge: {
            "*": {
              _hue: "gray",
              bg: ["50", "950"],
              fg: ["gray/200", "gray/800"],
              dot: ["gray/200", "gray/800"],
              icon: ["gray/200", "gray/800"]
            }
          },
          code: {
            bg: ["50", "950"],
            fg: ["200", "800"]
          },
          fg: ["400", "600"],
          icon: ["300", "700"],
          muted: {
            fg: ["400", "600"]
          },
          kbd: {
            bg: ["white", "black"],
            fg: ["200", "800"],
            border: ["100", "900"]
          },
          link: {
            fg: ["200", "800"]
          }
        }
      }
    }
  },
  input: {
    "*": {
      "*": {
        _blend: ["multiply", "screen"],
        bg: ["white", "black"],
        border: ["200", "700"],
        fg: ["black", "200"],
        muted: {
          bg: ["50", "950"]
        },
        placeholder: ["400", "600"]
      },
      hovered: {
        border: ["300", "700"]
      },
      readOnly: {
        bg: ["50", "950"],
        border: ["200", "800"],
        fg: ["800", "200"]
      },
      disabled: {
        bg: ["50", "950"],
        fg: ["400", "600"],
        border: ["100", "900"],
        placeholder: ["200", "800 50%"]
      }
    },
    invalid: {
      "*": {
        _hue: "red",
        bg: ["100", "950"]
      }
    }
  },
  selectable: {
    "*": {
      "*": {
        _blend: ["multiply", "screen"],
        accent: {
          fg: ["purple/700 70%", "purple/300 70%"]
        },
        avatar: {
          "*": {
            _blend: ["screen", "multiply"],
            bg: ["500", "400"],
            fg: ["white", "black"]
          }
        },
        badge: {
          "*": {
            bg: ["100", "900"],
            fg: ["600", "400"],
            dot: ["500", "500"],
            icon: ["500", "500"]
          }
        },
        bg: ["white", "black"],
        border: ["200", "800"],
        code: {
          bg: ["50", "950"],
          fg: ["600", "400"]
        },
        fg: ["700", "300"],
        icon: ["700 75%", "300 75%"],
        kbd: {
          bg: ["white", "black"],
          fg: ["600", "400"],
          border: ["200", "800"]
        },
        link: {
          fg: ["blue/700 70%", "blue/300 70%"]
        },
        muted: {
          bg: ["50", "950"],
          fg: ["700 75%", "300 75%"]
        },
        skeleton: {
          from: ["100", "900"],
          to: ["100 50%", "900 50%"]
        }
      },
      hovered: {
        bg: ["50", "950"]
      },
      pressed: {
        bg: ["100", "900"]
      },
      selected: {
        _blend: ["screen", "multiply"],
        accent: {
          fg: ["purple/300", "purple/700"]
        },
        avatar: {
          "*": {
            _blend: ["multiply", "screen"],
            bg: ["white", "black"],
            fg: ["black", "white"]
          }
        },
        badge: {
          "*": {
            bg: ["900", "100"],
            fg: ["400", "600"],
            dot: ["500", "500"],
            icon: ["500", "500"]
          }
        },
        bg: ["500", "400"],
        border: ["500 20%", "400 20%"],
        code: {
          bg: ["500 20%", "400 20%"],
          fg: ["200", "600"]
        },
        fg: ["white", "black"],
        icon: ["100 70%", "900 70%"],
        kbd: {
          bg: ["black", "white"],
          fg: ["200", "600"],
          border: ["800", "200"]
        },
        link: {
          fg: ["blue/200", "blue/600"]
        },
        muted: {
          bg: ["500 10%", "400 10%"],
          fg: ["100 70%", "900 70%"]
        },
        skeleton: {
          from: ["900", "100"],
          to: ["900 50%", "100 50%"]
        }
      },
      disabled: {
        _hue: "gray",
        accent: {
          fg: ["200", "800"]
        },
        avatar: {
          "*": {
            _blend: ["screen", "multiply"],
            bg: ["gray/100", "gray/900"],
            fg: ["white", "black"]
          }
        },
        badge: {
          "*": {
            _hue: "gray",
            bg: ["50", "950"],
            fg: ["gray/200", "gray/800"],
            dot: ["gray/200", "gray/800"],
            icon: ["gray/200", "gray/800"]
          }
        },
        border: ["100", "900"],
        code: {
          bg: ["50", "950"],
          fg: ["200", "800"]
        },
        fg: ["200", "800"],
        icon: ["200", "800"],
        kbd: {
          bg: ["white", "black"],
          fg: ["200", "800"],
          border: ["100", "900"]
        },
        link: {
          fg: ["200", "800"]
        },
        muted: {
          bg: ["50 50%", "950 50%"],
          fg: ["200", "800"]
        }
      }
    },
    default: {
      selected: {
        _hue: "blue"
      }
    },
    critical: {
      disabled: {
        bg: ["50 50%", "950 50%"]
      }
    }
  },
  syntax: {
    atrule: ["purple/600", "purple/400"],
    attrName: ["green/600", "green/400"],
    attrValue: ["yellow/600", "yellow/400"],
    attribute: ["yellow/600", "yellow/400"],
    boolean: ["purple/600", "purple/400"],
    builtin: ["purple/600", "purple/400"],
    cdata: ["yellow/600", "yellow/400"],
    char: ["yellow/600", "yellow/400"],
    class: ["orange/600", "orange/400"],
    className: ["cyan/600", "cyan/400"],
    comment: ["gray/400", "gray/600"],
    constant: ["purple/600", "purple/400"],
    deleted: ["red/600", "red/400"],
    entity: ["red/600", "red/400"],
    function: ["green/600", "green/400"],
    hexcode: ["blue/600", "blue/400"],
    id: ["purple/600", "purple/400"],
    important: ["purple/600", "purple/400"],
    inserted: ["yellow/600", "yellow/400"],
    keyword: ["magenta/600", "magenta/400"],
    number: ["purple/600", "purple/400"],
    operator: ["magenta/600", "magenta/400"],
    property: ["blue/600", "blue/400"],
    pseudoClass: ["yellow/600", "yellow/400"],
    pseudoElement: ["yellow/600", "yellow/400"],
    punctuation: ["gray/600", "gray/400"],
    regex: ["blue/600", "blue/400"],
    selector: ["red/600", "red/400"],
    string: ["yellow/600", "yellow/400"],
    symbol: ["purple/600", "purple/400"],
    tag: ["red/600", "red/400"],
    unit: ["orange/600", "orange/400"],
    url: ["red/600", "red/400"],
    variable: ["red/600", "red/400"]
  }
};
function isRecord$1(value) {
  return !!(value && typeof value == "object" && !Array.isArray(value));
}
function merge(...records) {
  const _records = records.filter(Boolean);
  return _records.length === 0 ? {} : _records.reduce(_merge, {});
}
function _merge(acc, source) {
  for (const key2 of Object.keys(source)) {
    const prevValue = acc[key2], nextValue = source[key2];
    isRecord$1(prevValue) && isRecord$1(nextValue) ? acc[key2] = merge(prevValue, nextValue) : acc[key2] = nextValue;
  }
  return acc;
}
function resolveColorTokens(inputTokens) {
  const tokens = merge(defaultColorTokens, inputTokens);
  return {
    base: resolveBaseColorTokens(tokens),
    button: resolveButtonColorTokens(tokens),
    input: resolveInputColorTokens(tokens),
    selectable: resolveSelectableColorTokens(tokens),
    syntax: tokens.syntax
  };
}
function resolveBaseColorTokens(sparseTokens) {
  const tokens = {};
  for (const tone of THEME_COLOR_CARD_TONES)
    tokens[tone] = resolveBaseColorTones(sparseTokens, tone);
  return tokens;
}
function resolveBaseColorTones(inputTokens, tone) {
  const spec = merge(inputTokens?.base?.["*"], inputTokens?.base?.[tone]), hue = spec._hue || inputTokens?.base?.[tone]?._hue || "gray";
  return {
    ...spec,
    _hue: hue,
    avatar: COLOR_HUES.reduce((acc, hue2) => ({
      ...acc,
      [hue2]: merge({
        _hue: hue2
      }, spec.avatar?.["*"], spec.avatar?.[hue2])
    }), {}),
    badge: THEME_COLOR_STATE_TONES.reduce((acc, tone2) => ({
      ...acc,
      [tone2]: {
        _hue: inputTokens?.base?.[tone2]?._hue || hue,
        ...spec.badge?.["*"],
        ...spec.badge?.[tone2]
      }
    }), {})
  };
}
function resolveButtonColorTokens(inputTokens) {
  const tokens = {};
  for (const mode of THEME_COLOR_BUTTON_MODES)
    tokens[mode] = resolveButtonToneColorTokens(inputTokens, mode);
  return tokens;
}
function resolveButtonToneColorTokens(inputTokens, mode) {
  const tokens = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    tokens[tone] = resolveButtonModeColorTokens(inputTokens, mode, tone);
  return tokens;
}
function resolveButtonModeColorTokens(inputTokens, mode, tone) {
  const tokens = {};
  for (const state of THEME_COLOR_STATES)
    tokens[state] = resolveButtonStateColorTokens(inputTokens, tone, mode, state);
  return tokens;
}
function resolveButtonStateColorTokens(inputTokens, tone, mode, state) {
  const spec = merge(inputTokens?.button?.[mode]?.["*"]?.["*"], inputTokens?.button?.[mode]?.[tone]?.["*"], inputTokens?.button?.[mode]?.["*"]?.[state], inputTokens?.button?.[mode]?.[tone]?.[state]), hue = spec._hue || inputTokens?.base?.[tone]?._hue;
  return {
    ...spec,
    _hue: hue,
    avatar: COLOR_HUES.reduce((acc, hue2) => ({
      ...acc,
      [hue2]: merge({
        _hue: hue2
      }, spec.avatar?.["*"], spec.avatar?.[hue2])
    }), {}),
    badge: THEME_COLOR_STATE_TONES.reduce((acc, tone2) => ({
      ...acc,
      [tone2]: {
        _hue: inputTokens?.base?.[tone2]?._hue || hue,
        ...spec.badge?.["*"],
        ...spec.badge?.[tone2]
      }
    }), {})
  };
}
function resolveInputColorTokens(inputTokens) {
  const tokens = {};
  for (const mode of THEME_COLOR_INPUT_MODES)
    tokens[mode] = resolveInputModeColorTokens(inputTokens, mode);
  return tokens;
}
function resolveInputModeColorTokens(inputTokens, mode) {
  const states = {};
  for (const state of THEME_COLOR_INPUT_STATES)
    states[state] = resolveInputStateColorTokens(inputTokens, mode, state);
  return states;
}
function resolveInputStateColorTokens(inputTokens, mode, state) {
  const spec = merge(inputTokens?.input?.["*"]?.["*"], inputTokens?.input?.[mode]?.["*"], inputTokens?.input?.["*"]?.[state], inputTokens?.input?.[mode]?.[state]), hue = spec._hue || inputTokens?.input?.[mode]?._hue;
  return {
    ...spec,
    _hue: hue
  };
}
function resolveSelectableColorTokens(inputTokens) {
  const tokens = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    tokens[tone] = resolveSelectableToneColorTokens(inputTokens, tone);
  return tokens;
}
function resolveSelectableToneColorTokens(inputTokens, tone) {
  const states = {
    _hue: inputTokens?.selectable?.[tone]?._hue || inputTokens?.base?.[tone]?._hue
  };
  for (const state of THEME_COLOR_STATES)
    states[state] = resolveSelectableStateColorTokens(inputTokens, tone, state);
  return states;
}
function resolveSelectableStateColorTokens(inputTokens, tone, state) {
  const spec = merge(inputTokens?.selectable?.["*"]?.["*"], inputTokens?.selectable?.[tone]?.["*"], inputTokens?.selectable?.["*"]?.[state], inputTokens?.selectable?.[tone]?.[state]), hue = spec._hue || inputTokens?.base?.[tone]?._hue;
  return {
    ...spec,
    _hue: hue,
    avatar: COLOR_HUES.reduce((acc, hue2) => ({
      ...acc,
      [hue2]: merge({
        _hue: hue2
      }, spec.avatar?.["*"], spec.avatar?.[hue2])
    }), {}),
    badge: THEME_COLOR_STATE_TONES.reduce((acc, tone2) => ({
      ...acc,
      [tone2]: {
        _hue: inputTokens?.base?.[tone2]?._hue || hue,
        ...spec.badge?.["*"],
        ...spec.badge?.[tone2]
      }
    }), {})
  };
}
function buildColorTheme(config) {
  const resolvedConfig = {
    color: resolveColorTokens(config?.color)
  };
  return {
    light: buildColorScheme({
      scheme: "light"
    }, resolvedConfig),
    dark: buildColorScheme({
      scheme: "dark"
    }, resolvedConfig)
  };
}
function buildColorScheme(options, config) {
  const {
    scheme
  } = options, colorScheme = {};
  for (const tone of THEME_COLOR_CARD_TONES)
    colorScheme[tone] = buildCardColorTheme({
      scheme,
      tone
    }, config);
  return colorScheme;
}
function buildCardColorTheme(options, config) {
  const {
    scheme,
    tone
  } = options, tokens = config?.color?.base?.[tone], context2 = {
    hue: tokens?._hue || "gray",
    scheme
  };
  return {
    _blend: (tokens?._blend || ["multiply", "screen"])[scheme === "light" ? 0 : 1],
    _dark: scheme === "dark",
    accent: {
      fg: resolveColorTokenValue(context2, tokens?.accent?.fg)
    },
    avatar: buildAvatarColorTheme({
      scheme
    }, tokens),
    backdrop: resolveColorTokenValue(context2, tokens?.backdrop),
    badge: buildBadgeColorTheme(tokens?.badge, {
      scheme
    }, config),
    bg: resolveColorTokenValue(context2, tokens?.bg),
    border: resolveColorTokenValue(context2, tokens?.border),
    button: buildButtonColorTheme({
      scheme,
      tone
    }, config),
    code: {
      bg: resolveColorTokenValue(context2, tokens?.code?.bg),
      fg: resolveColorTokenValue(context2, tokens?.code?.fg)
    },
    fg: resolveColorTokenValue(context2, tokens?.fg),
    focusRing: resolveColorTokenValue(context2, tokens?.focusRing),
    icon: resolveColorTokenValue(context2, tokens?.icon),
    input: buildInputColorTheme({
      scheme,
      tone
    }, config),
    kbd: {
      bg: resolveColorTokenValue(context2, tokens?.kbd?.bg),
      fg: resolveColorTokenValue(context2, tokens?.kbd?.fg),
      border: resolveColorTokenValue(context2, tokens?.kbd?.border)
    },
    link: {
      fg: resolveColorTokenValue(context2, tokens?.link?.fg)
    },
    muted: {
      bg: resolveColorTokenValue(context2, tokens?.muted?.bg),
      fg: resolveColorTokenValue(context2, tokens?.muted?.fg)
    },
    selectable: buildSelectableColorTheme({
      scheme,
      tone
    }, config),
    shadow: buildShadowColorTheme({
      scheme,
      tone
    }, config),
    skeleton: {
      from: resolveColorTokenValue(context2, tokens?.skeleton?.from),
      to: resolveColorTokenValue(context2, tokens?.skeleton?.to)
    },
    syntax: buildSyntaxColorTheme({
      scheme
    }, config)
  };
}
function buildShadowColorTheme(options, config) {
  const {
    scheme,
    tone
  } = options, tokens = config?.color?.base?.[tone], context2 = {
    hue: tokens?._hue || "gray",
    scheme
  };
  return {
    outline: resolveColorTokenValue(context2, tokens?.shadow?.outline),
    umbra: resolveColorTokenValue(context2, tokens?.shadow?.umbra),
    penumbra: resolveColorTokenValue(context2, tokens?.shadow?.penumbra),
    ambient: resolveColorTokenValue(context2, tokens?.shadow?.ambient)
  };
}
function buildAvatarColorTheme(options, stateTokens) {
  const {
    scheme
  } = options;
  return {
    gray: _buildAvatarColorTheme({
      color: "gray",
      scheme
    }, stateTokens),
    blue: _buildAvatarColorTheme({
      color: "blue",
      scheme
    }, stateTokens),
    purple: _buildAvatarColorTheme({
      color: "purple",
      scheme
    }, stateTokens),
    magenta: _buildAvatarColorTheme({
      color: "magenta",
      scheme
    }, stateTokens),
    red: _buildAvatarColorTheme({
      color: "red",
      scheme
    }, stateTokens),
    orange: _buildAvatarColorTheme({
      color: "orange",
      scheme
    }, stateTokens),
    yellow: _buildAvatarColorTheme({
      color: "yellow",
      scheme
    }, stateTokens),
    green: _buildAvatarColorTheme({
      color: "green",
      scheme
    }, stateTokens),
    cyan: _buildAvatarColorTheme({
      color: "cyan",
      scheme
    }, stateTokens)
  };
}
function _buildAvatarColorTheme(options, stateTokens) {
  const {
    color: color2,
    scheme
  } = options, tokens = stateTokens?.avatar?.[color2], context2 = {
    hue: tokens?._hue || "gray",
    scheme
  };
  return {
    _blend: (tokens?._blend || ["screen", "multiply"])[scheme === "light" ? 0 : 1],
    bg: resolveColorTokenValue(context2, tokens?.bg),
    fg: resolveColorTokenValue(context2, tokens?.fg)
  };
}
function buildBadgeColorTheme(tokens, options, config) {
  const {
    scheme
  } = options, colorBadge = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    colorBadge[tone] = _buildBadgeColorTheme(tokens, {
      scheme,
      tone
    }, config);
  return colorBadge;
}
function _buildBadgeColorTheme(parentTokens, options, config) {
  const {
    scheme,
    tone
  } = options, tokens = parentTokens?.[tone], context2 = {
    hue: tokens?._hue || config?.color?.base?.[tone]?._hue || "gray",
    scheme
  };
  return {
    bg: resolveColorTokenValue(context2, tokens?.bg),
    fg: resolveColorTokenValue(context2, tokens?.fg),
    dot: resolveColorTokenValue(context2, tokens?.dot),
    icon: resolveColorTokenValue(context2, tokens?.icon)
  };
}
function buildButtonColorTheme(options, config) {
  const {
    scheme,
    tone: cardTone
  } = options, modes = {};
  for (const mode of THEME_COLOR_BUTTON_MODES)
    modes[mode] = buildButtonTonesColorTheme({
      cardTone,
      scheme,
      mode
    }, config);
  return modes;
}
function buildButtonTonesColorTheme(options, config) {
  const {
    cardTone,
    mode,
    scheme
  } = options, tones2 = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    tones2[tone] = buildButtonStatesColorTheme({
      cardTone,
      mode,
      scheme,
      tone
    }, config);
  return tones2;
}
function buildButtonStatesColorTheme(options, config) {
  const {
    cardTone,
    mode,
    scheme,
    tone
  } = options, states = {};
  for (const state of THEME_COLOR_STATES)
    states[state] = buildButtonStateColorTheme({
      cardTone,
      mode,
      tone,
      scheme,
      state
    }, config);
  return states;
}
function buildButtonStateColorTheme(options, config) {
  const {
    cardTone,
    mode,
    tone,
    scheme,
    state
  } = options, cardTokens = config?.color?.base?.[cardTone], tokens = config?.color?.button?.[mode]?.[tone]?.[state], hue = tokens?._hue || cardTokens?._hue || "gray", blendMode = tokens?._blend || ["screen", "multiply"], context2 = {
    hue,
    scheme
  };
  return {
    _blend: blendMode[scheme === "light" ? 0 : 1],
    accent: {
      fg: resolveColorTokenValue(context2, tokens?.accent?.fg)
    },
    avatar: buildAvatarColorTheme({
      scheme
    }, tokens),
    badge: buildBadgeColorTheme(tokens?.badge, {
      scheme
    }, config),
    bg: resolveColorTokenValue(context2, tokens?.bg),
    border: resolveColorTokenValue(context2, tokens?.border),
    code: {
      bg: resolveColorTokenValue(context2, tokens?.code?.bg),
      fg: resolveColorTokenValue(context2, tokens?.code?.fg)
    },
    fg: resolveColorTokenValue(context2, tokens?.fg),
    icon: resolveColorTokenValue(context2, tokens?.icon),
    muted: {
      bg: resolveColorTokenValue(context2, tokens?.muted?.bg),
      fg: resolveColorTokenValue(context2, tokens?.muted?.fg)
    },
    kbd: {
      bg: resolveColorTokenValue(context2, tokens?.kbd?.bg),
      fg: resolveColorTokenValue(context2, tokens?.kbd?.fg),
      border: resolveColorTokenValue(context2, tokens?.kbd?.border)
    },
    link: {
      fg: resolveColorTokenValue(context2, tokens?.link?.fg)
    },
    skeleton: {
      from: resolveColorTokenValue(context2, tokens?.skeleton?.from),
      to: resolveColorTokenValue(context2, tokens?.skeleton?.to)
    }
  };
}
function buildInputColorTheme(options, config) {
  const {
    scheme,
    tone
  } = options;
  return {
    default: buildInputStatesColorTheme({
      mode: "default",
      scheme,
      tone
    }, config),
    invalid: buildInputStatesColorTheme({
      mode: "invalid",
      scheme,
      tone
    }, config)
  };
}
function buildInputStatesColorTheme(options, config) {
  const {
    mode,
    scheme,
    tone
  } = options;
  return {
    enabled: buildInputStateColorTheme({
      mode,
      scheme,
      state: "enabled",
      cardTone: tone
    }, config),
    hovered: buildInputStateColorTheme({
      mode,
      scheme,
      state: "hovered",
      cardTone: tone
    }, config),
    readOnly: buildInputStateColorTheme({
      mode,
      scheme,
      state: "readOnly",
      cardTone: tone
    }, config),
    disabled: buildInputStateColorTheme({
      mode,
      scheme,
      state: "disabled",
      cardTone: tone
    }, config)
  };
}
function buildInputStateColorTheme(options, config) {
  const {
    cardTone,
    mode,
    scheme,
    state
  } = options, cardTokens = config?.color?.base?.[cardTone], tokens = config?.color?.input?.[mode]?.[state], hue = tokens?._hue || cardTokens?._hue || "gray", blendMode = tokens?._blend || ["screen", "multiply"], context2 = {
    hue,
    scheme
  };
  return {
    _blend: blendMode[scheme === "light" ? 0 : 1],
    bg: resolveColorTokenValue(context2, tokens?.bg),
    border: resolveColorTokenValue(context2, tokens?.border),
    fg: resolveColorTokenValue(context2, tokens?.fg),
    muted: {
      bg: resolveColorTokenValue(context2, tokens?.muted?.bg)
    },
    placeholder: resolveColorTokenValue(context2, tokens?.placeholder)
  };
}
function buildSelectableColorTheme(options, config) {
  const {
    scheme,
    tone: cardTone
  } = options, tones2 = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    tones2[tone] = buildSelectableStatesColorTheme({
      cardTone,
      scheme,
      tone
    }, config);
  return tones2;
}
function buildSelectableStatesColorTheme(options, config) {
  const {
    cardTone,
    scheme,
    tone
  } = options, states = {};
  for (const state of THEME_COLOR_STATES)
    states[state] = buildSelectableStateColorTheme({
      cardTone,
      tone,
      scheme,
      state
    }, config);
  return states;
}
function buildSelectableStateColorTheme(options, config) {
  const {
    cardTone,
    scheme,
    state,
    tone
  } = options, cardTokens = config?.color?.base?.[cardTone], tokens = config?.color?.selectable?.[tone]?.[state], hue = tokens?._hue || cardTokens?._hue || "gray", blendMode = tokens?._blend || ["screen", "multiply"], context2 = {
    hue,
    scheme
  };
  return {
    _blend: blendMode[scheme === "light" ? 0 : 1],
    accent: {
      fg: resolveColorTokenValue(context2, tokens?.accent?.fg)
    },
    avatar: buildAvatarColorTheme({
      scheme
    }, tokens),
    badge: buildBadgeColorTheme(tokens?.badge, {
      scheme
    }, config),
    bg: resolveColorTokenValue(context2, tokens?.bg),
    border: resolveColorTokenValue(context2, tokens?.border),
    code: {
      bg: resolveColorTokenValue(context2, tokens?.code?.bg),
      fg: resolveColorTokenValue(context2, tokens?.code?.fg)
    },
    fg: resolveColorTokenValue(context2, tokens?.fg),
    icon: resolveColorTokenValue(context2, tokens?.icon),
    muted: {
      bg: resolveColorTokenValue(context2, tokens?.muted?.bg),
      fg: resolveColorTokenValue(context2, tokens?.muted?.fg)
    },
    kbd: {
      bg: resolveColorTokenValue(context2, tokens?.kbd?.bg),
      fg: resolveColorTokenValue(context2, tokens?.kbd?.fg),
      border: resolveColorTokenValue(context2, tokens?.kbd?.border)
    },
    link: {
      fg: resolveColorTokenValue(context2, tokens?.link?.fg)
    },
    skeleton: {
      from: resolveColorTokenValue(context2, tokens?.skeleton?.from),
      to: resolveColorTokenValue(context2, tokens?.skeleton?.to)
    }
  };
}
function buildSyntaxColorTheme(options, config) {
  const {
    scheme
  } = options, tokens = config?.color?.syntax, context2 = {
    hue: "gray",
    scheme
  };
  return {
    atrule: resolveColorTokenValue(context2, tokens?.atrule),
    attrName: resolveColorTokenValue(context2, tokens?.attrName),
    attrValue: resolveColorTokenValue(context2, tokens?.attrValue),
    attribute: resolveColorTokenValue(context2, tokens?.attribute),
    boolean: resolveColorTokenValue(context2, tokens?.boolean),
    builtin: resolveColorTokenValue(context2, tokens?.builtin),
    cdata: resolveColorTokenValue(context2, tokens?.cdata),
    char: resolveColorTokenValue(context2, tokens?.char),
    class: resolveColorTokenValue(context2, tokens?.class),
    className: resolveColorTokenValue(context2, tokens?.className),
    comment: resolveColorTokenValue(context2, tokens?.comment),
    constant: resolveColorTokenValue(context2, tokens?.constant),
    deleted: resolveColorTokenValue(context2, tokens?.deleted),
    doctype: resolveColorTokenValue(context2, tokens?.doctype),
    entity: resolveColorTokenValue(context2, tokens?.entity),
    function: resolveColorTokenValue(context2, tokens?.function),
    hexcode: resolveColorTokenValue(context2, tokens?.hexcode),
    id: resolveColorTokenValue(context2, tokens?.id),
    important: resolveColorTokenValue(context2, tokens?.important),
    inserted: resolveColorTokenValue(context2, tokens?.inserted),
    keyword: resolveColorTokenValue(context2, tokens?.keyword),
    number: resolveColorTokenValue(context2, tokens?.number),
    operator: resolveColorTokenValue(context2, tokens?.operator),
    prolog: resolveColorTokenValue(context2, tokens?.prolog),
    property: resolveColorTokenValue(context2, tokens?.property),
    pseudoClass: resolveColorTokenValue(context2, tokens?.pseudoClass),
    pseudoElement: resolveColorTokenValue(context2, tokens?.pseudoElement),
    punctuation: resolveColorTokenValue(context2, tokens?.punctuation),
    regex: resolveColorTokenValue(context2, tokens?.regex),
    selector: resolveColorTokenValue(context2, tokens?.selector),
    string: resolveColorTokenValue(context2, tokens?.string),
    symbol: resolveColorTokenValue(context2, tokens?.symbol),
    tag: resolveColorTokenValue(context2, tokens?.tag),
    unit: resolveColorTokenValue(context2, tokens?.unit),
    url: resolveColorTokenValue(context2, tokens?.url),
    variable: resolveColorTokenValue(context2, tokens?.variable)
  };
}
const defaultColorPalette = color$1;
function mixChannel(b, s, weight) {
  const delta = (s - b) * weight;
  return b + delta;
}
function mix$1(b, s, weight) {
  return {
    r: mixChannel(b.r, s.r, weight),
    g: mixChannel(b.g, s.g, weight),
    b: mixChannel(b.b, s.b, weight)
  };
}
function multiplyChannel(b, s) {
  return b * s;
}
function multiply(b, s) {
  return {
    r: multiplyChannel(b.r / 255, s.r / 255) * 255,
    g: multiplyChannel(b.g / 255, s.g / 255) * 255,
    b: multiplyChannel(b.b / 255, s.b / 255) * 255
  };
}
function screenChannel(b, s) {
  return b + s - b * s;
}
function screen(b, s) {
  return {
    r: screenChannel(b.r / 255, s.r / 255) * 255,
    g: screenChannel(b.g / 255, s.g / 255) * 255,
    b: screenChannel(b.b / 255, s.b / 255) * 255
  };
}
function lerp(x, y, a) {
  return x * (1 - a) + y * a;
}
function invlerp(x, y, a) {
  return clamp$3((a - x) / (y - x));
}
function clamp$3(a, min2 = 0, max2 = 1) {
  return Math.min(max2, Math.max(min2, a));
}
function range(x1, y1, x2, y2, a) {
  return lerp(x2, y2, invlerp(x1, y1, a));
}
function round$1(value) {
  return Math.round(value);
}
function hexToRgb(hex2) {
  if (hex2.length === 4) {
    const hexR = hex2.slice(1, 2), hexG = hex2.slice(2, 3), hexB = hex2.slice(3, 4);
    return {
      r: parseInt(hexR + hexR, 16),
      g: parseInt(hexG + hexG, 16),
      b: parseInt(hexB + hexB, 16)
    };
  }
  return {
    r: parseInt(hex2.slice(1, 3), 16),
    g: parseInt(hex2.slice(3, 5), 16),
    b: parseInt(hex2.slice(5, 7), 16)
  };
}
function rgbaToRGBA(rgba2) {
  const values = rgba2.replace(/rgba\(|\)/g, "").split(",");
  return {
    r: parseInt(values[0]),
    g: parseInt(values[1]),
    b: parseInt(values[2]),
    a: parseFloat(values[3])
  };
}
function rgbToHex(color2) {
  const r = round$1(clamp$3(Math.round(color2.r), 0, 255)), g = round$1(clamp$3(Math.round(color2.g), 0, 255)), b = round$1(clamp$3(Math.round(color2.b), 0, 255));
  return "a" in color2 ? `rgba(${r},${g},${b},${color2.a})` : "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function hslToRgb(hsl) {
  const s = hsl.s / 100, l = hsl.l / 100, c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(hsl.h / 60 % 2 - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  return 0 <= hsl.h && hsl.h < 60 ? (r = c, g = x, b = 0) : 60 <= hsl.h && hsl.h < 120 ? (r = x, g = c, b = 0) : 120 <= hsl.h && hsl.h < 180 ? (r = 0, g = c, b = x) : 180 <= hsl.h && hsl.h < 240 ? (r = 0, g = x, b = c) : 240 <= hsl.h && hsl.h < 300 ? (r = x, g = 0, b = c) : 300 <= hsl.h && hsl.h < 360 && (r = c, g = 0, b = x), {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}
const HEX_CHARS = "0123456789ABCDEFabcdef", HSL_RE = /hsl\(\s*(\d+)\s*,\s*((\d+(?:\.\d+)?)%)\s*,\s*((\d+(?:\.\d+)?)%)\s*\)/i;
function isHexChars(str) {
  for (const c of str)
    if (HEX_CHARS.indexOf(c) === -1)
      return !1;
  return !0;
}
function isHex(str) {
  return str[0] !== "#" || !(str.length === 4 || str.length === 7) ? !1 : isHexChars(str.slice(1));
}
function parseHsl(str) {
  const res = HSL_RE.exec(str);
  if (!res)
    throw new Error(`parseHsl: string is not a HSL color: "${str}"`);
  return {
    h: parseInt(res[1]),
    s: parseFloat(res[3]),
    l: parseFloat(res[5])
  };
}
function parseColor(color2) {
  if (!color2) return {
    r: 0,
    g: 0,
    b: 0
  };
  if (typeof color2 != "string")
    throw new Error("parseColor: expected a string");
  if (isHex(color2))
    return hexToRgb(color2);
  if (color2.startsWith("hsl("))
    return hslToRgb(parseHsl(color2));
  if (color2.startsWith("rgba("))
    return rgbaToRGBA(color2);
  throw new Error(`parseColor: unexpected color format: "${color2}"`);
}
function rgba$1(color2, a) {
  const rgb = parseColor(color2);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}
const RGB_RANGE = [0, 255];
function mixThemeColor(value, options) {
  const {
    blendMode
  } = options, color2 = parseColor(value), black2 = parseColor(options.black), white2 = parseColor(options.white), bg = options.bg ? parseColor(options.bg) : blendMode === "multiply" ? white2 : black2, paletteRange = {
    r: [black2.r, white2.r],
    g: [black2.g, white2.g],
    b: [black2.b, white2.b]
  }, convertedBgColor = {
    r: clamp$3(range(...paletteRange.r, ...RGB_RANGE, bg.r), ...RGB_RANGE),
    g: clamp$3(range(...paletteRange.g, ...RGB_RANGE, bg.g), ...RGB_RANGE),
    b: clamp$3(range(...paletteRange.b, ...RGB_RANGE, bg.b), ...RGB_RANGE)
  }, convertedColor = {
    r: clamp$3(range(...paletteRange.r, ...RGB_RANGE, color2.r), ...RGB_RANGE),
    g: clamp$3(range(...paletteRange.g, ...RGB_RANGE, color2.g), ...RGB_RANGE),
    b: clamp$3(range(...paletteRange.b, ...RGB_RANGE, color2.b), ...RGB_RANGE)
  }, resultColor = blendMode === "multiply" ? multiply(convertedBgColor, convertedColor) : screen(convertedBgColor, convertedColor), v = {
    r: clamp$3(range(...RGB_RANGE, ...paletteRange.r, resultColor.r), ...paletteRange.r),
    g: clamp$3(range(...RGB_RANGE, ...paletteRange.g, resultColor.g), ...paletteRange.g),
    b: clamp$3(range(...RGB_RANGE, ...paletteRange.b, resultColor.b), ...paletteRange.b)
  };
  return rgbToHex(v);
}
function renderColorValue(str, options) {
  const {
    bg,
    blendMode,
    colorPalette
  } = options;
  if (bg === "white")
    throw new Error("Cannot blend with white background");
  const node = parseTokenValue(str);
  if (!node || node.type !== "color")
    throw new Error(`Invalid color token value: ${str}`);
  let hex2 = "";
  if (node.key === "black" && (hex2 = renderColorHex(colorPalette.black)), node.key === "white" && (hex2 = renderColorHex(colorPalette.white)), node.hue && node.tint && (hex2 = renderColorHex(colorPalette[node.hue][node.tint])), !hex2)
    throw new Error(`Invalid color token value: ${str}`);
  const hexBeforeMix = hex2, mixOptions = {
    blendMode,
    bg,
    black: renderColorHex(colorPalette.black),
    // opacity: node.opacity,
    white: renderColorHex(colorPalette.white)
  };
  try {
    if (hex2 = mixThemeColor(hex2, mixOptions), bg && node.mix !== void 0) {
      const from = hexToRgb(bg), to = hexToRgb(hex2);
      hex2 = rgbToHex(mix$1(from, to, node.mix));
    }
  } catch (err) {
    throw console.warn("could not blend", hex2, mixOptions), err;
  }
  return hex2 === "#aN" && (console.warn(`invalid color token value: ${str}`), hex2 = hexBeforeMix), node.opacity !== void 0 && (hex2 = rgba$1(hex2, node.opacity)), hex2;
}
function renderColorHex(color2) {
  return typeof color2 == "string" ? color2 : color2.hex;
}
function renderThemeColorSchemes(value, config) {
  const colorPalette = defaultColorPalette;
  return {
    light: renderThemeColorScheme(colorPalette, value.light),
    dark: renderThemeColorScheme(colorPalette, value.dark)
  };
}
function renderThemeColorScheme(colorPalette, value) {
  const toneEntries = Object.entries(value), [, transparentTone] = toneEntries.find(([k]) => k === "transparent"), [, defaultTone] = toneEntries.find(([k]) => k === "default"), renderedTransparentTone = renderThemeColor(transparentTone, {
    colorPalette
  }), renderedDefaultTone = renderThemeColor(defaultTone, {
    colorPalette
  }), bg = renderedDefaultTone.bg;
  if (bg === "white")
    throw new Error("Cannot blend with white background");
  return Object.fromEntries([["transparent", renderedTransparentTone], ["default", renderedDefaultTone], ...toneEntries.filter(([k]) => k !== "default" && k !== "transparent").map(([k, v]) => [k, renderThemeColor(v, {
    bg,
    colorPalette
  })])]);
}
function renderThemeColor(value, options) {
  const {
    colorPalette,
    bg
  } = options, blendMode = value._blend || "multiply", baseBg = renderColorValue(value.bg, {
    colorPalette,
    bg,
    blendMode
  }), colorOptions = {
    colorPalette,
    bg: baseBg,
    blendMode
  }, button = renderThemeColorButton(value.button, {
    baseBg,
    blendMode,
    colorPalette
  }), selectable = renderThemeColorSelectable(value.selectable, {
    colorPalette,
    baseBg,
    blendMode
  }), shadow = {
    outline: renderColorValue(value.shadow.outline, colorOptions),
    umbra: renderColorValue(value.shadow.umbra, {
      ...colorOptions,
      bg: void 0,
      colorPalette: {
        ...colorPalette,
        black: "#000000"
      }
    }),
    penumbra: renderColorValue(value.shadow.penumbra, {
      ...colorOptions,
      bg: void 0,
      colorPalette: {
        ...colorPalette,
        black: "#000000"
      }
    }),
    ambient: renderColorValue(value.shadow.ambient, {
      ...colorOptions,
      bg: void 0,
      colorPalette: {
        ...colorPalette,
        black: "#000000"
      }
    })
  };
  return {
    _blend: blendMode,
    _dark: value._dark,
    accent: {
      fg: renderColorValue(value.accent.fg, colorOptions)
    },
    avatar: renderThemeColorAvatar(value.avatar, {
      baseBg,
      colorPalette,
      blendMode
    }),
    backdrop: renderColorValue(value.backdrop, colorOptions),
    badge: renderThemeColorBadge(value.badge, {
      baseBg,
      colorPalette,
      blendMode
    }),
    bg: baseBg,
    border: renderColorValue(value.border, colorOptions),
    button,
    code: {
      bg: renderColorValue(value.code.bg, colorOptions),
      fg: renderColorValue(value.code.fg, colorOptions)
    },
    fg: renderColorValue(value.fg, colorOptions),
    focusRing: renderColorValue(value.focusRing, colorOptions),
    icon: renderColorValue(value.icon, colorOptions),
    input: renderThemeColorInput(value.input, {
      baseBg,
      colorPalette,
      blendMode
    }),
    kbd: renderThemeColorKBD(value.kbd, {
      baseBg,
      colorPalette,
      blendMode
    }),
    link: {
      fg: renderColorValue(value.link.fg, colorOptions)
    },
    muted: {
      bg: renderColorValue(value.muted.bg, colorOptions),
      fg: renderColorValue(value.muted.fg, colorOptions)
    },
    shadow,
    skeleton: {
      from: renderColorValue(value.skeleton.from, colorOptions),
      to: renderColorValue(value.skeleton.to, colorOptions)
    },
    syntax: renderSyntaxColorTheme(value.syntax, {
      baseBg,
      colorPalette,
      blendMode
    }),
    selectable
  };
}
function renderThemeColorKBD(value, options) {
  const {
    baseBg,
    blendMode,
    colorPalette
  } = options, rootOptions = {
    bg: baseBg,
    blendMode,
    colorPalette
  }, bg = renderColorValue(value.bg, rootOptions), colorOptions = {
    bg,
    blendMode,
    colorPalette
  };
  return {
    bg,
    fg: renderColorValue(value.fg, colorOptions),
    border: renderColorValue(value.border, colorOptions)
  };
}
function renderThemeColorAvatar(value, options) {
  const colorAvatar = {};
  for (const hue of COLOR_HUES)
    colorAvatar[hue] = renderThemeColorAvatarColor(value[hue], options);
  return colorAvatar;
}
function renderThemeColorAvatarColor(value, options) {
  const {
    baseBg,
    blendMode: rootBlendMode,
    colorPalette
  } = options, blendMode = value._blend || "multiply", rootOptions = {
    bg: baseBg,
    blendMode: rootBlendMode,
    colorPalette
  }, bg = renderColorValue(value.bg, rootOptions), colorOptions = {
    bg,
    blendMode,
    colorPalette
  };
  return {
    _blend: blendMode,
    bg,
    fg: renderColorValue(value.fg, colorOptions)
  };
}
function renderThemeColorBadge(value, options) {
  const colorBadge = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    colorBadge[tone] = renderThemeColorBadgeColor(value[tone], options);
  return colorBadge;
}
function renderThemeColorBadgeColor(value, options) {
  const {
    baseBg,
    blendMode: rootBlendMode,
    colorPalette
  } = options, blendMode = rootBlendMode, rootOptions = {
    bg: baseBg,
    blendMode: rootBlendMode,
    colorPalette
  }, bg = renderColorValue(value.bg, rootOptions), colorOptions = {
    bg,
    blendMode,
    colorPalette
  };
  return {
    bg,
    dot: renderColorValue(value.dot, colorOptions),
    fg: renderColorValue(value.fg, colorOptions),
    icon: renderColorValue(value.icon, colorOptions)
  };
}
function renderThemeColorButton(value, options) {
  return {
    default: renderThemeColorButtonTones(value.default, options),
    ghost: renderThemeColorButtonTones(value.ghost, options),
    bleed: renderThemeColorButtonTones(value.bleed, options)
  };
}
function renderThemeColorButtonTones(value, options) {
  const colorButtonMode = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    colorButtonMode[tone] = renderThemeColorButtonStates(value[tone], options);
  return colorButtonMode;
}
function renderThemeColorButtonStates(value, options) {
  return {
    enabled: renderThemeColorState(value.enabled, options),
    hovered: renderThemeColorState(value.hovered, options),
    pressed: renderThemeColorState(value.pressed, options),
    selected: renderThemeColorState(value.selected, options),
    disabled: renderThemeColorState(value.disabled, options)
  };
}
function renderThemeColorState(value, options) {
  const {
    baseBg,
    blendMode: rootBlendMode,
    colorPalette
  } = options, blendMode = value._blend || "multiply", rootOptions = {
    bg: baseBg,
    blendMode: rootBlendMode,
    colorPalette
  }, bg = renderColorValue(value.bg, rootOptions), colorOptions = {
    bg,
    blendMode,
    colorPalette
  };
  return {
    _blend: blendMode,
    accent: {
      fg: renderColorValue(value.accent.fg, colorOptions)
    },
    avatar: renderThemeColorAvatar(value.avatar, {
      baseBg: bg,
      colorPalette,
      blendMode
    }),
    badge: renderThemeColorBadge(value.badge, {
      baseBg: bg,
      colorPalette,
      blendMode
    }),
    bg,
    border: renderColorValue(value.border, colorOptions),
    code: {
      bg: renderColorValue(value.code.bg, colorOptions),
      fg: renderColorValue(value.code.fg, colorOptions)
    },
    fg: renderColorValue(value.fg, colorOptions),
    icon: renderColorValue(value.icon, colorOptions),
    link: {
      fg: renderColorValue(value.link.fg, colorOptions)
    },
    muted: {
      bg: renderColorValue(value.muted.bg, colorOptions),
      fg: renderColorValue(value.muted.fg, colorOptions)
    },
    kbd: {
      bg: renderColorValue(value.kbd.bg, colorOptions),
      fg: renderColorValue(value.kbd.fg, colorOptions),
      border: renderColorValue(value.kbd.border, colorOptions)
    },
    skeleton: {
      from: renderColorValue(value.skeleton?.from, colorOptions),
      to: renderColorValue(value.skeleton?.to, colorOptions)
    }
  };
}
function renderThemeColorInput(value, options) {
  return {
    default: renderInputStatesColorTheme(value.default, options),
    invalid: renderInputStatesColorTheme(value.invalid, options)
  };
}
function renderInputStatesColorTheme(value, options) {
  return {
    enabled: renderInputStateColorTheme(value.enabled, options),
    hovered: renderInputStateColorTheme(value.hovered, options),
    readOnly: renderInputStateColorTheme(value.readOnly, options),
    disabled: renderInputStateColorTheme(value.disabled, options)
  };
}
function renderInputStateColorTheme(value, options) {
  const {
    baseBg,
    blendMode: rootBlendMode,
    colorPalette
  } = options, blendMode = value._blend || "multiply", rootOptions = {
    colorPalette,
    bg: baseBg,
    blendMode: rootBlendMode
  }, bg = renderColorValue(value.bg, rootOptions), colorOptions = {
    colorPalette,
    bg,
    blendMode
  };
  return {
    _blend: blendMode,
    bg,
    border: renderColorValue(value.border, colorOptions),
    fg: renderColorValue(value.fg, colorOptions),
    muted: {
      bg: renderColorValue(value.muted.bg, colorOptions)
    },
    placeholder: renderColorValue(value.placeholder, colorOptions)
  };
}
function renderThemeColorSelectable(value, options) {
  const colorSelectable = {};
  for (const tone of THEME_COLOR_STATE_TONES)
    colorSelectable[tone] = renderThemeColorSelectableStates(value[tone], options);
  return colorSelectable;
}
function renderThemeColorSelectableStates(value, options) {
  return {
    enabled: renderThemeColorState(value.enabled, options),
    hovered: renderThemeColorState(value.hovered, options),
    pressed: renderThemeColorState(value.pressed, options),
    selected: renderThemeColorState(value.selected, options),
    disabled: renderThemeColorState(value.disabled, options)
  };
}
function renderSyntaxColorTheme(value, options) {
  const {
    colorPalette,
    baseBg,
    blendMode
  } = options, colorOptions = {
    colorPalette,
    bg: baseBg,
    blendMode
  };
  return {
    atrule: renderColorValue(value.atrule, colorOptions),
    attrName: renderColorValue(value.attrName, colorOptions),
    attrValue: renderColorValue(value.attrValue, colorOptions),
    attribute: renderColorValue(value.attribute, colorOptions),
    boolean: renderColorValue(value.boolean, colorOptions),
    builtin: renderColorValue(value.builtin, colorOptions),
    cdata: renderColorValue(value.cdata, colorOptions),
    char: renderColorValue(value.char, colorOptions),
    class: renderColorValue(value.class, colorOptions),
    className: renderColorValue(value.className, colorOptions),
    comment: renderColorValue(value.comment, colorOptions),
    constant: renderColorValue(value.constant, colorOptions),
    deleted: renderColorValue(value.deleted, colorOptions),
    doctype: renderColorValue(value.doctype, colorOptions),
    entity: renderColorValue(value.entity, colorOptions),
    function: renderColorValue(value.function, colorOptions),
    hexcode: renderColorValue(value.hexcode, colorOptions),
    id: renderColorValue(value.id, colorOptions),
    important: renderColorValue(value.important, colorOptions),
    inserted: renderColorValue(value.inserted, colorOptions),
    keyword: renderColorValue(value.keyword, colorOptions),
    number: renderColorValue(value.number, colorOptions),
    operator: renderColorValue(value.operator, colorOptions),
    prolog: renderColorValue(value.prolog, colorOptions),
    property: renderColorValue(value.property, colorOptions),
    pseudoClass: renderColorValue(value.pseudoClass, colorOptions),
    pseudoElement: renderColorValue(value.pseudoElement, colorOptions),
    punctuation: renderColorValue(value.punctuation, colorOptions),
    regex: renderColorValue(value.regex, colorOptions),
    selector: renderColorValue(value.selector, colorOptions),
    string: renderColorValue(value.string, colorOptions),
    symbol: renderColorValue(value.symbol, colorOptions),
    tag: renderColorValue(value.tag, colorOptions),
    unit: renderColorValue(value.unit, colorOptions),
    url: renderColorValue(value.url, colorOptions),
    variable: renderColorValue(value.variable, colorOptions)
  };
}
function buildTheme(config) {
  const colorTheme = buildColorTheme(config), v2 = {
    _version: 2,
    avatar: defaultThemeConfig.avatar,
    button: defaultThemeConfig.button,
    card: defaultThemeConfig.card,
    // How colors are generated:
    // 1. Merge custom tokens with default tokens
    // 2. Generate tree of color keys (gray/500, black, white, etc.)
    // 3. Apply mixing and render to hex values
    // render(build(mergeWithDefaults()))
    color: renderThemeColorSchemes(colorTheme),
    container: defaultThemeConfig.container,
    font: defaultThemeFonts,
    input: defaultThemeConfig.input,
    layer: defaultThemeConfig.layer,
    media: defaultThemeConfig.media,
    radius: defaultThemeConfig.radius,
    shadow: defaultThemeConfig.shadow,
    space: defaultThemeConfig.space,
    style: defaultThemeConfig.style
  };
  return v2_v0(v2);
}
function themeColor_v0_v2_9(color2) {
  if ("neutral" in color2.badge)
    return color2;
  const colors2 = color2;
  return {
    ...colors2,
    badge: {
      ...colors2.badge,
      neutral: colors2.badge.default,
      suggest: colors2.badge.primary
    },
    button: {
      bleed: {
        ...colors2.button.bleed,
        neutral: colors2.button.bleed.default,
        suggest: colors2.button.bleed.primary
      },
      default: {
        ...colors2.button.default,
        neutral: colors2.button.default.default,
        suggest: colors2.button.default.primary
      },
      ghost: {
        ...colors2.button.ghost,
        neutral: colors2.button.ghost.default,
        suggest: colors2.button.ghost.primary
      }
    },
    selectable: {
      ...colors2.selectable,
      neutral: colors2.selectable.default,
      suggest: colors2.selectable.primary
    }
  };
}
const cache$5 = /* @__PURE__ */ new Map();
function getScopedTheme(themeProp, scheme, tone) {
  const cachedTheme = _getCachedTheme(themeProp, scheme, tone);
  if (cachedTheme) return cachedTheme;
  const v0 = is_v2(themeProp) ? v2_v0(themeProp) : themeProp, v2 = is_v2(themeProp) ? themeProp : v0_v2(themeProp), colorScheme_v0 = v0.color[scheme] || v0.color.light, color_v0 = colorScheme_v0[tone] || colorScheme_v0.default, layer_v0 = v0.layer || defaultThemeConfig.layer, colorScheme_v2 = v2.color[scheme] || v2.color.light, color_v2 = colorScheme_v2[tone] || colorScheme_v2.default, color_v2_9 = themeColor_v0_v2_9(color_v2), layer_v2 = v2.layer || defaultThemeConfig.layer, theme = {
    sanity: {
      ...v0,
      color: color_v0,
      layer: layer_v0,
      v2: {
        ...v2,
        _resolved: !0,
        color: color_v2_9,
        layer: layer_v2
      }
    }
  };
  return _setCachedTheme(themeProp, scheme, tone, theme), theme;
}
function _getCachedTheme(rootTheme, scheme, tone) {
  const schemeCache = cache$5.get(scheme);
  if (!schemeCache) return;
  const toneCache = schemeCache.get(tone);
  if (toneCache)
    return toneCache.get(rootTheme);
}
function _setCachedTheme(rootTheme, scheme, tone, theme) {
  cache$5.has(scheme) || cache$5.set(scheme, /* @__PURE__ */ new Map());
  const schemeCache = cache$5.get(scheme);
  schemeCache.has(tone) || schemeCache.set(tone, /* @__PURE__ */ new WeakMap()), schemeCache.get(tone).set(rootTheme, theme);
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @lightSyntaxTransform
 * @noflow
 * @nolint
 * @preventMunge
 * @preserve-invariant-messages
 */
var dist, hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  var __create = Object.create, __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __getOwnPropNames = Object.getOwnPropertyNames, __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty, __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: !0 });
  }, __copyProps = (to, from, except, desc) => {
    if (from && typeof from == "object" || typeof from == "function")
      for (let key2 of __getOwnPropNames(from))
        !__hasOwnProp.call(to, key2) && key2 !== except && __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    return to;
  }, __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
    mod
  )), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod), index_exports = {};
  __export(index_exports, {
    $dispatcherGuard: () => $dispatcherGuard,
    $makeReadOnly: () => $makeReadOnly,
    $reset: () => $reset,
    $structuralCheck: () => $structuralCheck,
    c: () => c,
    clearRenderCounterRegistry: () => clearRenderCounterRegistry,
    renderCounterRegistry: () => renderCounterRegistry,
    useRenderCounter: () => useRenderCounter
  }), dist = __toCommonJS(index_exports);
  var React2 = __toESM(React__default), { useRef: useRef2, useEffect: useEffect2, isValidElement: isValidElement2 } = React2, _a, ReactSecretInternals = (
    //@ts-ignore
    (_a = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) != null ? _a : React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  ), $empty = Symbol.for("react.memo_cache_sentinel"), _a2, c = (
    // @ts-expect-error
    typeof ((_a2 = React2.__COMPILER_RUNTIME) == null ? void 0 : _a2.c) == "function" ? (
      // @ts-expect-error
      React2.__COMPILER_RUNTIME.c
    ) : function(size2) {
      return React2.useMemo(() => {
        const $ = new Array(size2);
        for (let ii = 0; ii < size2; ii++)
          $[ii] = $empty;
        return $[$empty] = !0, $;
      }, []);
    }
  ), LazyGuardDispatcher = {};
  [
    "readContext",
    "useCallback",
    "useContext",
    "useEffect",
    "useImperativeHandle",
    "useInsertionEffect",
    "useLayoutEffect",
    "useMemo",
    "useReducer",
    "useRef",
    "useState",
    "useDebugValue",
    "useDeferredValue",
    "useTransition",
    "useMutableSource",
    "useSyncExternalStore",
    "useId",
    "unstable_isNewReconciler",
    "getCacheSignal",
    "getCacheForType",
    "useCacheRefresh"
  ].forEach((name) => {
    LazyGuardDispatcher[name] = () => {
      throw new Error(
        `[React] Unexpected React hook call (${name}) from a React compiled function. Check that all hooks are called directly and named according to convention ('use[A-Z]') `
      );
    };
  });
  var originalDispatcher = null;
  LazyGuardDispatcher.useMemoCache = (count) => {
    if (originalDispatcher == null)
      throw new Error(
        "React Compiler internal invariant violation: unexpected null dispatcher"
      );
    return originalDispatcher.useMemoCache(count);
  };
  function setCurrent(newDispatcher) {
    return ReactSecretInternals.ReactCurrentDispatcher.current = newDispatcher, ReactSecretInternals.ReactCurrentDispatcher.current;
  }
  var guardFrames = [];
  function $dispatcherGuard(kind) {
    const curr = ReactSecretInternals.ReactCurrentDispatcher.current;
    if (kind === 0) {
      if (guardFrames.push(curr), guardFrames.length === 1 && (originalDispatcher = curr), curr === LazyGuardDispatcher)
        throw new Error(
          "[React] Unexpected call to custom hook or component from a React compiled function. Check that (1) all hooks are called directly and named according to convention ('use[A-Z]') and (2) components are returned as JSX instead of being directly invoked."
        );
      setCurrent(LazyGuardDispatcher);
    } else if (kind === 1) {
      const lastFrame = guardFrames.pop();
      if (lastFrame == null)
        throw new Error(
          "React Compiler internal error: unexpected null in guard stack"
        );
      guardFrames.length === 0 && (originalDispatcher = null), setCurrent(lastFrame);
    } else if (kind === 2)
      guardFrames.push(curr), setCurrent(originalDispatcher);
    else if (kind === 3) {
      const lastFrame = guardFrames.pop();
      if (lastFrame == null)
        throw new Error(
          "React Compiler internal error: unexpected null in guard stack"
        );
      setCurrent(lastFrame);
    } else
      throw new Error("React Compiler internal error: unreachable block" + kind);
  }
  function $reset($) {
    for (let ii = 0; ii < $.length; ii++)
      $[ii] = $empty;
  }
  function $makeReadOnly() {
    throw new Error("TODO: implement $makeReadOnly in react-compiler-runtime");
  }
  var renderCounterRegistry = /* @__PURE__ */ new Map();
  function clearRenderCounterRegistry() {
    for (const counters of renderCounterRegistry.values())
      counters.forEach((counter) => {
        counter.count = 0;
      });
  }
  function registerRenderCounter(name, val) {
    let counters = renderCounterRegistry.get(name);
    counters == null && (counters = /* @__PURE__ */ new Set(), renderCounterRegistry.set(name, counters)), counters.add(val);
  }
  function removeRenderCounter(name, val) {
    const counters = renderCounterRegistry.get(name);
    counters?.delete(val);
  }
  function useRenderCounter(name) {
    const val = useRef2(null);
    val.current != null && (val.current.count += 1), useEffect2(() => {
      if (val.current == null) {
        const counter = { count: 0 };
        registerRenderCounter(name, counter), val.current = counter;
      }
      return () => {
        val.current !== null && removeRenderCounter(name, val.current);
      };
    });
  }
  var seenErrors = /* @__PURE__ */ new Set();
  function $structuralCheck(oldValue, newValue, variableName, fnName, kind, loc) {
    function error(l, r, path, depth) {
      const str = `${fnName}:${loc} [${kind}] ${variableName}${path} changed from ${l} to ${r} at depth ${depth}`;
      seenErrors.has(str) || (seenErrors.add(str), console.error(str));
    }
    const depthLimit = 2;
    function recur(oldValue2, newValue2, path, depth) {
      if (!(depth > depthLimit)) {
        if (oldValue2 === newValue2)
          return;
        if (typeof oldValue2 != typeof newValue2)
          error(`type ${typeof oldValue2}`, `type ${typeof newValue2}`, path, depth);
        else if (typeof oldValue2 == "object") {
          const oldArray = Array.isArray(oldValue2), newArray = Array.isArray(newValue2);
          if (oldValue2 === null && newValue2 !== null)
            error("null", `type ${typeof newValue2}`, path, depth);
          else if (newValue2 === null)
            error(`type ${typeof oldValue2}`, "null", path, depth);
          else if (oldValue2 instanceof Map)
            if (!(newValue2 instanceof Map))
              error("Map instance", "other value", path, depth);
            else if (oldValue2.size !== newValue2.size)
              error(
                `Map instance with size ${oldValue2.size}`,
                `Map instance with size ${newValue2.size}`,
                path,
                depth
              );
            else
              for (const [k, v] of oldValue2)
                newValue2.has(k) ? recur(v, newValue2.get(k), `${path}.get(${k})`, depth + 1) : error(
                  `Map instance with key ${k}`,
                  `Map instance without key ${k}`,
                  path,
                  depth
                );
          else if (newValue2 instanceof Map)
            error("other value", "Map instance", path, depth);
          else if (oldValue2 instanceof Set)
            if (!(newValue2 instanceof Set))
              error("Set instance", "other value", path, depth);
            else if (oldValue2.size !== newValue2.size)
              error(
                `Set instance with size ${oldValue2.size}`,
                `Set instance with size ${newValue2.size}`,
                path,
                depth
              );
            else
              for (const v of newValue2)
                oldValue2.has(v) || error(
                  `Set instance without element ${v}`,
                  `Set instance with element ${v}`,
                  path,
                  depth
                );
          else if (newValue2 instanceof Set)
            error("other value", "Set instance", path, depth);
          else if (oldArray || newArray)
            if (oldArray !== newArray)
              error(
                `type ${oldArray ? "array" : "object"}`,
                `type ${newArray ? "array" : "object"}`,
                path,
                depth
              );
            else if (oldValue2.length !== newValue2.length)
              error(
                `array with length ${oldValue2.length}`,
                `array with length ${newValue2.length}`,
                path,
                depth
              );
            else
              for (let ii = 0; ii < oldValue2.length; ii++)
                recur(oldValue2[ii], newValue2[ii], `${path}[${ii}]`, depth + 1);
          else if (isValidElement2(oldValue2) || isValidElement2(newValue2))
            isValidElement2(oldValue2) !== isValidElement2(newValue2) ? error(
              `type ${isValidElement2(oldValue2) ? "React element" : "object"}`,
              `type ${isValidElement2(newValue2) ? "React element" : "object"}`,
              path,
              depth
            ) : oldValue2.type !== newValue2.type ? error(
              `React element of type ${oldValue2.type}`,
              `React element of type ${newValue2.type}`,
              path,
              depth
            ) : recur(
              oldValue2.props,
              newValue2.props,
              `[props of ${path}]`,
              depth + 1
            );
          else {
            for (const key2 in newValue2)
              key2 in oldValue2 || error(
                `object without key ${key2}`,
                `object with key ${key2}`,
                path,
                depth
              );
            for (const key2 in oldValue2)
              key2 in newValue2 ? recur(oldValue2[key2], newValue2[key2], `${path}.${key2}`, depth + 1) : error(
                `object with key ${key2}`,
                `object without key ${key2}`,
                path,
                depth
              );
          }
        } else {
          if (typeof oldValue2 == "function")
            return;
          isNaN(oldValue2) || isNaN(newValue2) ? isNaN(oldValue2) !== isNaN(newValue2) && error(
            `${isNaN(oldValue2) ? "NaN" : "non-NaN value"}`,
            `${isNaN(newValue2) ? "NaN" : "non-NaN value"}`,
            path,
            depth
          ) : oldValue2 !== newValue2 && error(oldValue2, newValue2, path, depth);
        }
      }
    }
    recur(oldValue, newValue, "", 0);
  }
  return dist;
}
var distExports = requireDist(), reactIs = { exports: {} }, reactIs_production = {};
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_production;
function requireReactIs_production() {
  if (hasRequiredReactIs_production) return reactIs_production;
  hasRequiredReactIs_production = 1;
  var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
  function typeOf(object) {
    if (typeof object == "object" && object !== null) {
      var $$typeof = object.$$typeof;
      switch ($$typeof) {
        case REACT_ELEMENT_TYPE:
          switch (object = object.type, object) {
            case REACT_FRAGMENT_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_STRICT_MODE_TYPE:
            case REACT_SUSPENSE_TYPE:
            case REACT_SUSPENSE_LIST_TYPE:
            case REACT_VIEW_TRANSITION_TYPE:
              return object;
            default:
              switch (object = object && object.$$typeof, object) {
                case REACT_CONTEXT_TYPE:
                case REACT_FORWARD_REF_TYPE:
                case REACT_LAZY_TYPE:
                case REACT_MEMO_TYPE:
                  return object;
                case REACT_CONSUMER_TYPE:
                  return object;
                default:
                  return $$typeof;
              }
          }
        case REACT_PORTAL_TYPE:
          return $$typeof;
      }
    }
  }
  return reactIs_production.ContextConsumer = REACT_CONSUMER_TYPE, reactIs_production.ContextProvider = REACT_CONTEXT_TYPE, reactIs_production.Element = REACT_ELEMENT_TYPE, reactIs_production.ForwardRef = REACT_FORWARD_REF_TYPE, reactIs_production.Fragment = REACT_FRAGMENT_TYPE, reactIs_production.Lazy = REACT_LAZY_TYPE, reactIs_production.Memo = REACT_MEMO_TYPE, reactIs_production.Portal = REACT_PORTAL_TYPE, reactIs_production.Profiler = REACT_PROFILER_TYPE, reactIs_production.StrictMode = REACT_STRICT_MODE_TYPE, reactIs_production.Suspense = REACT_SUSPENSE_TYPE, reactIs_production.SuspenseList = REACT_SUSPENSE_LIST_TYPE, reactIs_production.isContextConsumer = function(object) {
    return typeOf(object) === REACT_CONSUMER_TYPE;
  }, reactIs_production.isContextProvider = function(object) {
    return typeOf(object) === REACT_CONTEXT_TYPE;
  }, reactIs_production.isElement = function(object) {
    return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }, reactIs_production.isForwardRef = function(object) {
    return typeOf(object) === REACT_FORWARD_REF_TYPE;
  }, reactIs_production.isFragment = function(object) {
    return typeOf(object) === REACT_FRAGMENT_TYPE;
  }, reactIs_production.isLazy = function(object) {
    return typeOf(object) === REACT_LAZY_TYPE;
  }, reactIs_production.isMemo = function(object) {
    return typeOf(object) === REACT_MEMO_TYPE;
  }, reactIs_production.isPortal = function(object) {
    return typeOf(object) === REACT_PORTAL_TYPE;
  }, reactIs_production.isProfiler = function(object) {
    return typeOf(object) === REACT_PROFILER_TYPE;
  }, reactIs_production.isStrictMode = function(object) {
    return typeOf(object) === REACT_STRICT_MODE_TYPE;
  }, reactIs_production.isSuspense = function(object) {
    return typeOf(object) === REACT_SUSPENSE_TYPE;
  }, reactIs_production.isSuspenseList = function(object) {
    return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
  }, reactIs_production.isValidElementType = function(type) {
    return typeof type == "string" || typeof type == "function" || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || type.getModuleId !== void 0);
  }, reactIs_production.typeOf = typeOf, reactIs_production;
}
var reactIs_development = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_development;
function requireReactIs_development() {
  return hasRequiredReactIs_development || (hasRequiredReactIs_development = 1, process.env.NODE_ENV !== "production" && (function() {
    function typeOf(object) {
      if (typeof object == "object" && object !== null) {
        var $$typeof = object.$$typeof;
        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            switch (object = object.type, object) {
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
              case REACT_SUSPENSE_LIST_TYPE:
              case REACT_VIEW_TRANSITION_TYPE:
                return object;
              default:
                switch (object = object && object.$$typeof, object) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                    return object;
                  case REACT_CONSUMER_TYPE:
                    return object;
                  default:
                    return $$typeof;
                }
            }
          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
    reactIs_development.ContextConsumer = REACT_CONSUMER_TYPE, reactIs_development.ContextProvider = REACT_CONTEXT_TYPE, reactIs_development.Element = REACT_ELEMENT_TYPE, reactIs_development.ForwardRef = REACT_FORWARD_REF_TYPE, reactIs_development.Fragment = REACT_FRAGMENT_TYPE, reactIs_development.Lazy = REACT_LAZY_TYPE, reactIs_development.Memo = REACT_MEMO_TYPE, reactIs_development.Portal = REACT_PORTAL_TYPE, reactIs_development.Profiler = REACT_PROFILER_TYPE, reactIs_development.StrictMode = REACT_STRICT_MODE_TYPE, reactIs_development.Suspense = REACT_SUSPENSE_TYPE, reactIs_development.SuspenseList = REACT_SUSPENSE_LIST_TYPE, reactIs_development.isContextConsumer = function(object) {
      return typeOf(object) === REACT_CONSUMER_TYPE;
    }, reactIs_development.isContextProvider = function(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }, reactIs_development.isElement = function(object) {
      return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }, reactIs_development.isForwardRef = function(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }, reactIs_development.isFragment = function(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }, reactIs_development.isLazy = function(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }, reactIs_development.isMemo = function(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }, reactIs_development.isPortal = function(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }, reactIs_development.isProfiler = function(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }, reactIs_development.isStrictMode = function(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }, reactIs_development.isSuspense = function(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }, reactIs_development.isSuspenseList = function(object) {
      return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
    }, reactIs_development.isValidElementType = function(type) {
      return typeof type == "string" || typeof type == "function" || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || type.getModuleId !== void 0);
    }, reactIs_development.typeOf = typeOf;
  })()), reactIs_development;
}
var hasRequiredReactIs;
function requireReactIs() {
  return hasRequiredReactIs || (hasRequiredReactIs = 1, process.env.NODE_ENV === "production" ? reactIs.exports = requireReactIs_production() : reactIs.exports = requireReactIs_development()), reactIs.exports;
}
var reactIsExports = /* @__PURE__ */ requireReactIs(), ReactIs = /* @__PURE__ */ getDefaultExportFromCjs(reactIsExports);
const sides = ["top", "right", "bottom", "left"], alignments = ["start", "end"], placements = /* @__PURE__ */ sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []), min = Math.min, max = Math.max, round = Math.round, floor = Math.floor, createCoords = (v) => ({
  x: v,
  y: v
}), oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp$2(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value == "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
const yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  rtl === void 0 && (rtl = !1);
  const alignment = getAlignment(placement), alignmentAxis = getAlignmentAxis(placement), length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  return rects.reference[length] > rects.floating[length] && (mainAlignmentSide = getOppositePlacement(mainAlignmentSide)), [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ["left", "right"], rlPlacement = ["right", "left"], tbPlacement = ["top", "bottom"], btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      return rtl ? isStart ? rlPlacement : lrPlacement : isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  return alignment && (list = list.map((side) => side + "-" + alignment), flipAlignment && (list = list.concat(list.map(getOppositeAlignmentPlacement)))), list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding != "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement), alignmentAxis = getAlignmentAxis(placement), alignLength = getAxisLength(alignmentAxis), side = getSide(placement), isVertical = sideAxis === "y", commonX = reference.x + reference.width / 2 - floating.width / 2, commonY = reference.y + reference.height / 2 - floating.height / 2, commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config, validMiddleware = middleware.filter(Boolean), rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  }), {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl), statefulPlacement = placement, middlewareData = {}, resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i], {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX ?? x, y = nextY ?? y, middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    }, reset && resetCount <= 50 && (resetCount++, typeof reset == "object" && (reset.placement && (statefulPlacement = reset.placement), reset.rects && (rects = reset.rects === !0 ? await platform2.getElementRects({
      reference,
      floating,
      strategy
    }) : reset.rects), {
      x,
      y
    } = computeCoordsFromPlacement(rects, statefulPlacement, rtl)), i = -1);
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow$1(state, options) {
  var _await$platform$isEle;
  options === void 0 && (options = {});
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state, {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = !1,
    padding = 0
  } = evaluate(options, state), paddingObject = getPaddingObject(padding), element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext], clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: (_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) == null || _await$platform$isEle ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  })), rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference, offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating)), offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$3 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state, {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null)
      return {};
    const paddingObject = getPaddingObject(padding), coords = {
      x,
      y
    }, axis = getAlignmentAxis(placement), length = getAxisLength(axis), arrowDimensions = await platform2.getDimensions(element), isYAxis = axis === "y", minProp = isYAxis ? "top" : "left", maxProp = isYAxis ? "bottom" : "right", clientProp = isYAxis ? "clientHeight" : "clientWidth", endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length], startDiff = coords[axis] - rects.reference[axis], arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) && (clientSize = elements.floating[clientProp] || rects.floating[length]);
    const centerToReference = endDiff / 2 - startDiff / 2, largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1, minPadding = min(paddingObject[minProp], largestPossiblePadding), maxPadding = min(paddingObject[maxProp], largestPossiblePadding), min$1 = minPadding, max2 = clientSize - arrowDimensions[length] - maxPadding, center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference, offset2 = clamp$2(min$1, center, max2), shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0, alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  return (alignment ? [...allowedPlacements.filter((placement) => getAlignment(placement) === alignment), ...allowedPlacements.filter((placement) => getAlignment(placement) !== alignment)] : allowedPlacements.filter((placement) => getSide(placement) === placement)).filter((placement) => alignment ? getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : !1) : !0);
}
const autoPlacement$2 = function(options) {
  return options === void 0 && (options = {}), {
    name: "autoPlacement",
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform: platform2,
        elements
      } = state, {
        crossAxis = !1,
        alignment,
        allowedPlacements = placements,
        autoAlignment = !0,
        ...detectOverflowOptions
      } = evaluate(options, state), placements$1 = alignment !== void 0 || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements, overflow = await detectOverflow$1(state, detectOverflowOptions), currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0, currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null)
        return {};
      const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)));
      if (placement !== currentPlacement)
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]], allOverflows = [...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [], {
        placement: currentPlacement,
        overflows: currentOverflows
      }], nextPlacement = placements$1[currentIndex + 1];
      if (nextPlacement)
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      const placementsSortedByMostSpace = allOverflows.map((d) => {
        const alignment2 = getAlignment(d.placement);
        return [d.placement, alignment2 && crossAxis ? (
          // Check along the mainAxis and main crossAxis side.
          d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0)
        ) : (
          // Check only the mainAxis.
          d.overflows[0]
        ), d.overflows];
      }).sort((a, b) => a[1] - b[1]), resetPlacement = ((_placementsThatFitOnE = placementsSortedByMostSpace.filter((d) => d[2].slice(
        0,
        // Aligned placements should not check their opposite crossAxis
        // side.
        getAlignment(d[0]) ? 2 : 3
      ).every((v) => v <= 0))[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      return resetPlacement !== placement ? {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows
        },
        reset: {
          placement: resetPlacement
        }
      } : {};
    }
  };
}, flip$2 = function(options) {
  return options === void 0 && (options = {}), {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state, {
        mainAxis: checkMainAxis = !0,
        crossAxis: checkCrossAxis = !0,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = !0,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset)
        return {};
      const side = getSide(placement), initialSideAxis = getSideAxis(initialPlacement), isBasePlacement = getSide(initialPlacement) === initialPlacement, rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)), fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement)), hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      !specifiedFallbackPlacements && hasFallbackAxisSideDirection && fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      const placements2 = [initialPlacement, ...fallbackPlacements], overflow = await detectOverflow$1(state, detectOverflowOptions), overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis && overflows.push(overflow[side]), checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      if (overflowsData = [...overflowsData, {
        placement,
        overflows
      }], !overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1, nextPlacement = placements2[nextIndex];
        if (nextPlacement && (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : !0)))
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement)
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return !0;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              placement2 && (resetPlacement = placement2);
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        if (placement !== resetPlacement)
          return {
            reset: {
              placement: resetPlacement
            }
          };
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$2 = function(options) {
  return options === void 0 && (options = {}), {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects
      } = state, {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await detectOverflow$1(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          }), offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await detectOverflow$1(state, {
            ...detectOverflowOptions,
            altBoundary: !0
          }), offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state, rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)), side = getSide(placement), alignment = getAlignment(placement), isVertical = getSideAxis(placement) === "y", mainAxisMulti = originSides.has(side) ? -1 : 1, crossAxisMulti = rtl && isVertical ? -1 : 1, rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue == "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  return alignment && typeof alignmentAxis == "number" && (crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis), isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$2 = function(options) {
  return options === void 0 && (options = 0), {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state, diffCoords = await convertValueToCoords(state, options);
      return placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset ? {} : {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
}, shift$2 = function(options) {
  return options === void 0 && (options = {}), {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state, {
        mainAxis: checkMainAxis = !0,
        crossAxis: checkCrossAxis = !1,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state), coords = {
        x,
        y
      }, overflow = await detectOverflow$1(state, detectOverflowOptions), crossAxis = getSideAxis(getSide(placement)), mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis], crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left", maxSide = mainAxis === "y" ? "bottom" : "right", min2 = mainAxisCoord + overflow[minSide], max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp$2(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left", maxSide = crossAxis === "y" ? "bottom" : "right", min2 = crossAxisCoord + overflow[minSide], max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp$2(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window < "u";
}
function getNodeName(node) {
  return isNode(node) ? (node.nodeName || "").toLowerCase() : "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return hasWindow() ? value instanceof Node || value instanceof getWindow(value).Node : !1;
}
function isElement$1(value) {
  return hasWindow() ? value instanceof Element || value instanceof getWindow(value).Element : !1;
}
function isHTMLElement$2(value) {
  return hasWindow() ? value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement : !1;
}
function isShadowRoot(value) {
  return !hasWindow() || typeof ShadowRoot > "u" ? !1 : value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /* @__PURE__ */ new Set(["inline", "contents"]);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /* @__PURE__ */ new Set(["table", "td", "th"]);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [":popover-open", ":modal"];
function isTopLayer(element) {
  return topLayerSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch {
      return !1;
    }
  });
}
const transformProperties = ["transform", "translate", "scale", "rotate", "perspective"], willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"], containValues = ["paint", "layout", "strict", "content"];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit(), css2 = isElement$1(elementOrCss) ? getComputedStyle$2(elementOrCss) : elementOrCss;
  return transformProperties.some((value) => css2[value] ? css2[value] !== "none" : !1) || (css2.containerType ? css2.containerType !== "normal" : !1) || !webkit && (css2.backdropFilter ? css2.backdropFilter !== "none" : !1) || !webkit && (css2.filter ? css2.filter !== "none" : !1) || willChangeValues.some((value) => (css2.willChange || "").includes(value)) || containValues.some((value) => (css2.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  for (; isHTMLElement$2(currentNode) && !isLastTraversableNode(currentNode); ) {
    if (isContainingBlock(currentNode))
      return currentNode;
    if (isTopLayer(currentNode))
      return null;
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const lastTraversableNodeNames = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle$2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  return isElement$1(element) ? {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  } : {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html")
    return node;
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  return isLastTraversableNode(parentNode) ? node.ownerDocument ? node.ownerDocument.body : node.body : isHTMLElement$2(parentNode) && isOverflowElement(parentNode) ? parentNode : getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  list === void 0 && (list = []), traverseIframes === void 0 && (traverseIframes = !0);
  const scrollableAncestor = getNearestOverflowAncestor(node), isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body), win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css2 = getComputedStyle$2(element);
  let width = parseFloat(css2.width) || 0, height = parseFloat(css2.height) || 0;
  const hasOffset = isHTMLElement$2(element), offsetWidth = hasOffset ? element.offsetWidth : width, offsetHeight = hasOffset ? element.offsetHeight : height, shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  return shouldFallback && (width = offsetWidth, height = offsetHeight), {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return isElement$1(element) ? element : element.contextElement;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement$2(domElement))
    return createCoords(1);
  const rect = domElement.getBoundingClientRect(), {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width, y = ($ ? round(rect.height) : rect.height) / height;
  return (!x || !Number.isFinite(x)) && (x = 1), (!y || !Number.isFinite(y)) && (y = 1), {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  return !isWebKit() || !win.visualViewport ? noOffsets : {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  return isFixed === void 0 && (isFixed = !1), !floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element) ? !1 : isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  includeScale === void 0 && (includeScale = !1), isFixedStrategy === void 0 && (isFixedStrategy = !1);
  const clientRect = element.getBoundingClientRect(), domElement = unwrapElement(element);
  let scale2 = createCoords(1);
  includeScale && (offsetParent ? isElement$1(offsetParent) && (scale2 = getScale(offsetParent)) : scale2 = getScale(element));
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale2.x, y = (clientRect.top + visualOffsets.y) / scale2.y, width = clientRect.width / scale2.x, height = clientRect.height / scale2.y;
  if (domElement) {
    const win = getWindow(domElement), offsetWin = offsetParent && isElement$1(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win, currentIFrame = getFrameElement(currentWin);
    for (; currentIFrame && offsetParent && offsetWin !== currentWin; ) {
      const iframeScale = getScale(currentIFrame), iframeRect = currentIFrame.getBoundingClientRect(), css2 = getComputedStyle$2(currentIFrame), left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css2.paddingLeft)) * iframeScale.x, top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css2.paddingTop)) * iframeScale.y;
      x *= iframeScale.x, y *= iframeScale.y, width *= iframeScale.x, height *= iframeScale.y, x += left, y += top, currentWin = getWindow(currentIFrame), currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  return rect ? rect.left + leftScroll : getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect(), x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect), y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed", documentElement = getDocumentElement(offsetParent), topLayer = elements ? isTopLayer(elements.floating) : !1;
  if (offsetParent === documentElement || topLayer && isFixed)
    return rect;
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  }, scale2 = createCoords(1);
  const offsets = createCoords(0), isOffsetParentAnElement = isHTMLElement$2(offsetParent);
  if ((isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) && ((getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) && (scroll = getNodeScroll(offsetParent)), isHTMLElement$2(offsetParent))) {
    const offsetRect = getBoundingClientRect(offsetParent);
    scale2 = getScale(offsetParent), offsets.x = offsetRect.x + offsetParent.clientLeft, offsets.y = offsetRect.y + offsetParent.clientTop;
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale2.x,
    height: rect.height * scale2.y,
    x: rect.x * scale2.x - scroll.scrollLeft * scale2.x + offsets.x + htmlOffset.x,
    y: rect.y * scale2.y - scroll.scrollTop * scale2.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element), scroll = getNodeScroll(element), body = element.ownerDocument.body, width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth), height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  return getComputedStyle$2(body).direction === "rtl" && (x += max(html.clientWidth, body.clientWidth) - width), {
    width,
    height,
    x,
    y
  };
}
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = getWindow(element), html = getDocumentElement(element), visualViewport = win.visualViewport;
  let width = html.clientWidth, height = html.clientHeight, x = 0, y = 0;
  if (visualViewport) {
    width = visualViewport.width, height = visualViewport.height;
    const visualViewportBased = isWebKit();
    (!visualViewportBased || visualViewportBased && strategy === "fixed") && (x = visualViewport.offsetLeft, y = visualViewport.offsetTop);
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument, body = doc.body, bodyStyles = getComputedStyle(body), bodyMarginInline = doc.compatMode === "CSS1Compat" && parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0, clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    clippingStableScrollbarWidth <= SCROLLBAR_MAX && (width -= clippingStableScrollbarWidth);
  } else windowScrollbarX <= SCROLLBAR_MAX && (width += windowScrollbarX);
  return {
    width,
    height,
    x,
    y
  };
}
const absoluteOrFixed = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, !0, strategy === "fixed"), top = clientRect.top + element.clientTop, left = clientRect.left + element.clientLeft, scale2 = isHTMLElement$2(element) ? getScale(element) : createCoords(1), width = element.clientWidth * scale2.x, height = element.clientHeight * scale2.y, x = left * scale2.x, y = top * scale2.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport")
    rect = getViewportRect(element, strategy);
  else if (clippingAncestor === "document")
    rect = getDocumentRect(getDocumentElement(element));
  else if (isElement$1(clippingAncestor))
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  return parentNode === stopNode || !isElement$1(parentNode) || isLastTraversableNode(parentNode) ? !1 : getComputedStyle$2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache2) {
  const cachedResult = cache2.get(element);
  if (cachedResult)
    return cachedResult;
  let result = getOverflowAncestors(element, [], !1).filter((el) => isElement$1(el) && getNodeName(el) !== "body"), currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$2(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  for (; isElement$1(currentNode) && !isLastTraversableNode(currentNode); ) {
    const computedStyle = getComputedStyle$2(currentNode), currentNodeIsContaining = isContainingBlock(currentNode);
    !currentNodeIsContaining && computedStyle.position === "fixed" && (currentContainingBlockComputedStyle = null), (elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode)) ? result = result.filter((ancestor) => ancestor !== currentNode) : currentContainingBlockComputedStyle = computedStyle, currentNode = getParentNode(currentNode);
  }
  return cache2.set(element, result), result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary], firstClippingAncestor = clippingAncestors[0], clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    return accRect.top = max(rect.top, accRect.top), accRect.right = min(rect.right, accRect.right), accRect.bottom = min(rect.bottom, accRect.bottom), accRect.left = max(rect.left, accRect.left), accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement$2(offsetParent), documentElement = getDocumentElement(offsetParent), isFixed = strategy === "fixed", rect = getBoundingClientRect(element, !0, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed)
    if ((getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) && (scroll = getNodeScroll(offsetParent)), isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, !0, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft, offsets.y = offsetRect.y + offsetParent.clientTop;
    } else documentElement && setLeftRTLScrollbarOffset();
  isFixed && !isOffsetParentAnElement && documentElement && setLeftRTLScrollbarOffset();
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0), x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x, y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$2(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement$2(element) || getComputedStyle$2(element).position === "fixed")
    return null;
  if (polyfill)
    return polyfill(element);
  let rawOffsetParent = element.offsetParent;
  return getDocumentElement(element) === rawOffsetParent && (rawOffsetParent = rawOffsetParent.ownerDocument.body), rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element))
    return win;
  if (!isHTMLElement$2(element)) {
    let svgOffsetParent = getParentNode(element);
    for (; svgOffsetParent && !isLastTraversableNode(svgOffsetParent); ) {
      if (isElement$1(svgOffsetParent) && !isStaticPositioned(svgOffsetParent))
        return svgOffsetParent;
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  for (; offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent); )
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  return offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent) ? win : offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent, getDimensionsFn = this.getDimensions, floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$2(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: isElement$1,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null, timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId), (_io = io) == null || _io.disconnect(), io = null;
  }
  function refresh(skip, threshold) {
    skip === void 0 && (skip = !1), threshold === void 0 && (threshold = 1), cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect(), {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (skip || onMove(), !width || !height)
      return;
    const insetTop = floor(top), insetRight = floor(root.clientWidth - (left + width)), insetBottom = floor(root.clientHeight - (top + height)), insetLeft = floor(left), options = {
      rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = !0;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate)
          return refresh();
        ratio ? refresh(!1, ratio) : timeoutId = setTimeout(() => {
          refresh(!1, 1e-7);
        }, 1e3);
      }
      ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect()) && refresh(), isFirstUpdate = !1;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  return refresh(!0), cleanup;
}
function autoUpdate(reference, floating, update, options) {
  options === void 0 && (options = {});
  const {
    ancestorScroll = !0,
    ancestorResize = !0,
    elementResize = typeof ResizeObserver == "function",
    layoutShift = typeof IntersectionObserver == "function",
    animationFrame = !1
  } = options, referenceEl = unwrapElement(reference), ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: !0
    }), ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1, resizeObserver = null;
  elementResize && (resizeObserver = new ResizeObserver((_ref) => {
    let [firstEntry] = _ref;
    firstEntry && firstEntry.target === referenceEl && resizeObserver && (resizeObserver.unobserve(floating), cancelAnimationFrame(reobserveFrame), reobserveFrame = requestAnimationFrame(() => {
      var _resizeObserver;
      (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
    })), update();
  }), referenceEl && !animationFrame && resizeObserver.observe(referenceEl), resizeObserver.observe(floating));
  let frameId, prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  animationFrame && frameLoop();
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect) && update(), prevRefRect = nextRefRect, frameId = requestAnimationFrame(frameLoop);
  }
  return update(), () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update), ancestorResize && ancestor.removeEventListener("resize", update);
    }), cleanupIo?.(), (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect(), resizeObserver = null, animationFrame && cancelAnimationFrame(frameId);
  };
}
const detectOverflow = detectOverflow$1, offset$1 = offset$2, autoPlacement$1 = autoPlacement$2, shift$1 = shift$2, flip$1 = flip$2, hide$1 = hide$2, arrow$2 = arrow$3, computePosition = (reference, floating, options) => {
  const cache2 = /* @__PURE__ */ new Map(), mergedOptions = {
    platform,
    ...options
  }, platformWithCache = {
    ...mergedOptions.platform,
    _c: cache2
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
var reactDom = { exports: {} }, reactDom_production = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React2 = React__default;
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop3() {
  }
  var Internals = {
    d: {
      f: noop3,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop3,
      C: noop3,
      L: noop3,
      m: noop3,
      X: noop3,
      S: noop3,
      M: noop3
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE = Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key2 = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: key2 == null ? null : "" + key2,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if (as === "font") return "";
    if (typeof input == "string")
      return input === "use-credentials" ? input : "";
  }
  return reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals, reactDom_production.createPortal = function(children, container) {
    var key2 = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!container || container.nodeType !== 1 && container.nodeType !== 9 && container.nodeType !== 11)
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key2);
  }, reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  }, reactDom_production.preconnect = function(href, options) {
    typeof href == "string" && (options ? (options = options.crossOrigin, options = typeof options == "string" ? options === "use-credentials" ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  }, reactDom_production.prefetchDNS = function(href) {
    typeof href == "string" && Internals.d.D(href);
  }, reactDom_production.preinit = function(href, options) {
    if (typeof href == "string" && options && typeof options.as == "string") {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = typeof options.integrity == "string" ? options.integrity : void 0, fetchPriority = typeof options.fetchPriority == "string" ? options.fetchPriority : void 0;
      as === "style" ? Internals.d.S(
        href,
        typeof options.precedence == "string" ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : as === "script" && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0
      });
    }
  }, reactDom_production.preinitModule = function(href, options) {
    if (typeof href == "string")
      if (typeof options == "object" && options !== null) {
        if (options.as == null || options.as === "script") {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: typeof options.integrity == "string" ? options.integrity : void 0,
            nonce: typeof options.nonce == "string" ? options.nonce : void 0
          });
        }
      } else options == null && Internals.d.M(href);
  }, reactDom_production.preload = function(href, options) {
    if (typeof href == "string" && typeof options == "object" && options !== null && typeof options.as == "string") {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0,
        type: typeof options.type == "string" ? options.type : void 0,
        fetchPriority: typeof options.fetchPriority == "string" ? options.fetchPriority : void 0,
        referrerPolicy: typeof options.referrerPolicy == "string" ? options.referrerPolicy : void 0,
        imageSrcSet: typeof options.imageSrcSet == "string" ? options.imageSrcSet : void 0,
        imageSizes: typeof options.imageSizes == "string" ? options.imageSizes : void 0,
        media: typeof options.media == "string" ? options.media : void 0
      });
    }
  }, reactDom_production.preloadModule = function(href, options) {
    if (typeof href == "string")
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: typeof options.as == "string" && options.as !== "script" ? options.as : void 0,
          crossOrigin,
          integrity: typeof options.integrity == "string" ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  }, reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  }, reactDom_production.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
  }, reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  }, reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  }, reactDom_production.version = "19.2.3", reactDom_production;
}
var reactDom_development = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_development;
function requireReactDom_development() {
  return hasRequiredReactDom_development || (hasRequiredReactDom_development = 1, process.env.NODE_ENV !== "production" && (function() {
    function noop3() {
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function createPortal$1(children, containerInfo, implementation) {
      var key2 = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      try {
        testStringCoercion(key2);
        var JSCompiler_inline_result = !1;
      } catch {
        JSCompiler_inline_result = !0;
      }
      return JSCompiler_inline_result && (console.error(
        "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
        typeof Symbol == "function" && Symbol.toStringTag && key2[Symbol.toStringTag] || key2.constructor.name || "Object"
      ), testStringCoercion(key2)), {
        $$typeof: REACT_PORTAL_TYPE,
        key: key2 == null ? null : "" + key2,
        children,
        containerInfo,
        implementation
      };
    }
    function getCrossOriginStringAs(as, input) {
      if (as === "font") return "";
      if (typeof input == "string")
        return input === "use-credentials" ? input : "";
    }
    function getValueDescriptorExpectingObjectForWarning(thing) {
      return thing === null ? "`null`" : thing === void 0 ? "`undefined`" : thing === "" ? "an empty string" : 'something with type "' + typeof thing + '"';
    }
    function getValueDescriptorExpectingEnumForWarning(thing) {
      return thing === null ? "`null`" : thing === void 0 ? "`undefined`" : thing === "" ? "an empty string" : typeof thing == "string" ? JSON.stringify(thing) : typeof thing == "number" ? "`" + thing + "`" : 'something with type "' + typeof thing + '"';
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      return dispatcher === null && console.error(
        `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
      ), dispatcher;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React2 = React__default, Internals = {
      d: {
        f: noop3,
        r: function() {
          throw Error(
            "Invalid form element. requestFormReset must be passed a form that was rendered by React."
          );
        },
        D: noop3,
        C: noop3,
        L: noop3,
        m: noop3,
        X: noop3,
        S: noop3,
        M: noop3
      },
      p: 0,
      findDOMNode: null
    }, REACT_PORTAL_TYPE = Symbol.for("react.portal"), ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
    ), reactDom_development.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals, reactDom_development.createPortal = function(children, container) {
      var key2 = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!container || container.nodeType !== 1 && container.nodeType !== 9 && container.nodeType !== 11)
        throw Error("Target container is not a DOM element.");
      return createPortal$1(children, container, null, key2);
    }, reactDom_development.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn)
          return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f() && console.error(
          "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
        );
      }
    }, reactDom_development.preconnect = function(href, options) {
      typeof href == "string" && href ? options != null && typeof options != "object" ? console.error(
        "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
        getValueDescriptorExpectingEnumForWarning(options)
      ) : options != null && typeof options.crossOrigin != "string" && console.error(
        "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
        getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
      ) : console.error(
        "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        getValueDescriptorExpectingObjectForWarning(href)
      ), typeof href == "string" && (options ? (options = options.crossOrigin, options = typeof options == "string" ? options === "use-credentials" ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    }, reactDom_development.prefetchDNS = function(href) {
      if (typeof href != "string" || !href)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
      else if (1 < arguments.length) {
        var options = arguments[1];
        typeof options == "object" && options.hasOwnProperty("crossOrigin") ? console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          getValueDescriptorExpectingEnumForWarning(options)
        ) : console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          getValueDescriptorExpectingEnumForWarning(options)
        );
      }
      typeof href == "string" && Internals.d.D(href);
    }, reactDom_development.preinit = function(href, options) {
      if (typeof href == "string" && href ? options == null || typeof options != "object" ? console.error(
        "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
        getValueDescriptorExpectingEnumForWarning(options)
      ) : options.as !== "style" && options.as !== "script" && console.error(
        'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
        getValueDescriptorExpectingEnumForWarning(options.as)
      ) : console.error(
        "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        getValueDescriptorExpectingObjectForWarning(href)
      ), typeof href == "string" && options && typeof options.as == "string") {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = typeof options.integrity == "string" ? options.integrity : void 0, fetchPriority = typeof options.fetchPriority == "string" ? options.fetchPriority : void 0;
        as === "style" ? Internals.d.S(
          href,
          typeof options.precedence == "string" ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : as === "script" && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: typeof options.nonce == "string" ? options.nonce : void 0
        });
      }
    }, reactDom_development.preinitModule = function(href, options) {
      var encountered = "";
      if (typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options !== void 0 && typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && options.as !== "script" && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingEnumForWarning(options.as) + "."), encountered)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          encountered
        );
      else
        switch (encountered = options && typeof options.as == "string" ? options.as : "script", encountered) {
          case "script":
            break;
          default:
            encountered = getValueDescriptorExpectingEnumForWarning(encountered), console.error(
              'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
              encountered,
              href
            );
        }
      typeof href == "string" && (typeof options == "object" && options !== null ? (options.as == null || options.as === "script") && (encountered = getCrossOriginStringAs(
        options.as,
        options.crossOrigin
      ), Internals.d.M(href, {
        crossOrigin: encountered,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0,
        nonce: typeof options.nonce == "string" ? options.nonce : void 0
      })) : options == null && Internals.d.M(href));
    }, reactDom_development.preload = function(href, options) {
      var encountered = "";
      if (typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options == null || typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : typeof options.as == "string" && options.as || (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + "."), encountered && console.error(
        'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
        encountered
      ), typeof href == "string" && typeof options == "object" && options !== null && typeof options.as == "string") {
        encountered = options.as;
        var crossOrigin = getCrossOriginStringAs(
          encountered,
          options.crossOrigin
        );
        Internals.d.L(href, encountered, {
          crossOrigin,
          integrity: typeof options.integrity == "string" ? options.integrity : void 0,
          nonce: typeof options.nonce == "string" ? options.nonce : void 0,
          type: typeof options.type == "string" ? options.type : void 0,
          fetchPriority: typeof options.fetchPriority == "string" ? options.fetchPriority : void 0,
          referrerPolicy: typeof options.referrerPolicy == "string" ? options.referrerPolicy : void 0,
          imageSrcSet: typeof options.imageSrcSet == "string" ? options.imageSrcSet : void 0,
          imageSizes: typeof options.imageSizes == "string" ? options.imageSizes : void 0,
          media: typeof options.media == "string" ? options.media : void 0
        });
      }
    }, reactDom_development.preloadModule = function(href, options) {
      var encountered = "";
      typeof href == "string" && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + "."), options !== void 0 && typeof options != "object" ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && typeof options.as != "string" && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + "."), encountered && console.error(
        'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
        encountered
      ), typeof href == "string" && (options ? (encountered = getCrossOriginStringAs(
        options.as,
        options.crossOrigin
      ), Internals.d.m(href, {
        as: typeof options.as == "string" && options.as !== "script" ? options.as : void 0,
        crossOrigin: encountered,
        integrity: typeof options.integrity == "string" ? options.integrity : void 0
      })) : Internals.d.m(href));
    }, reactDom_development.requestFormReset = function(form) {
      Internals.d.r(form);
    }, reactDom_development.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    }, reactDom_development.useFormState = function(action, initialState, permalink) {
      return resolveDispatcher().useFormState(action, initialState, permalink);
    }, reactDom_development.useFormStatus = function() {
      return resolveDispatcher().useHostTransitionStatus();
    }, reactDom_development.version = "19.2.3", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), reactDom_development;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (checkDCE(), reactDom.exports = requireReactDom_production()) : reactDom.exports = requireReactDom_development(), reactDom.exports;
}
var reactDomExports = requireReactDom(), isClient = typeof document < "u", noop$1 = function() {
}, index = isClient ? useLayoutEffect : noop$1;
function deepEqual(a, b) {
  if (a === b)
    return !0;
  if (typeof a != typeof b)
    return !1;
  if (typeof a == "function" && a.toString() === b.toString())
    return !0;
  let length, i, keys;
  if (a && b && typeof a == "object") {
    if (Array.isArray(a)) {
      if (length = a.length, length !== b.length) return !1;
      for (i = length; i-- !== 0; )
        if (!deepEqual(a[i], b[i]))
          return !1;
      return !0;
    }
    if (keys = Object.keys(a), length = keys.length, length !== Object.keys(b).length)
      return !1;
    for (i = length; i-- !== 0; )
      if (!{}.hasOwnProperty.call(b, keys[i]))
        return !1;
    for (i = length; i-- !== 0; ) {
      const key2 = keys[i];
      if (!(key2 === "_owner" && a.$$typeof) && !deepEqual(a[key2], b[key2]))
        return !1;
    }
    return !0;
  }
  return a !== a && b !== b;
}
function getDPR(element) {
  return typeof window > "u" ? 1 : (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
  const ref = React.useRef(value);
  return index(() => {
    ref.current = value;
  }), ref;
}
function useFloating(options) {
  options === void 0 && (options = {});
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = !0,
    whileElementsMounted,
    open
  } = options, [data, setData] = React.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: !1
  }), [latestMiddleware, setLatestMiddleware] = React.useState(middleware);
  deepEqual(latestMiddleware, middleware) || setLatestMiddleware(middleware);
  const [_reference, _setReference] = React.useState(null), [_floating, _setFloating] = React.useState(null), setReference = React.useCallback((node) => {
    node !== referenceRef.current && (referenceRef.current = node, _setReference(node));
  }, []), setFloating = React.useCallback((node) => {
    node !== floatingRef.current && (floatingRef.current = node, _setFloating(node));
  }, []), referenceEl = externalReference || _reference, floatingEl = externalFloating || _floating, referenceRef = React.useRef(null), floatingRef = React.useRef(null), dataRef = React.useRef(data), hasWhileElementsMounted = whileElementsMounted != null, whileElementsMountedRef = useLatestRef(whileElementsMounted), platformRef = useLatestRef(platform2), openRef = useLatestRef(open), update = React.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current)
      return;
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    platformRef.current && (config.platform = platformRef.current), computePosition(referenceRef.current, floatingRef.current, config).then((data2) => {
      const fullData = {
        ...data2,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== !1
      };
      isMountedRef.current && !deepEqual(dataRef.current, fullData) && (dataRef.current = fullData, reactDomExports.flushSync(() => {
        setData(fullData);
      }));
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    open === !1 && dataRef.current.isPositioned && (dataRef.current.isPositioned = !1, setData((data2) => ({
      ...data2,
      isPositioned: !1
    })));
  }, [open]);
  const isMountedRef = React.useRef(!1);
  index(() => (isMountedRef.current = !0, () => {
    isMountedRef.current = !1;
  }), []), index(() => {
    if (referenceEl && (referenceRef.current = referenceEl), floatingEl && (floatingRef.current = floatingEl), referenceEl && floatingEl) {
      if (whileElementsMountedRef.current)
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = React.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]), elements = React.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]), floatingStyles = React.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating)
      return initialStyles;
    const x = roundByDPR(elements.floating, data.x), y = roundByDPR(elements.floating, data.y);
    return transform ? {
      ...initialStyles,
      transform: "translate(" + x + "px, " + y + "px)",
      ...getDPR(elements.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return React.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}
const arrow$1 = (options) => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, "current");
  }
  return {
    name: "arrow",
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options == "function" ? options(state) : options;
      return element && isRef(element) ? element.current != null ? arrow$2({
        element: element.current,
        padding
      }).fn(state) : {} : element ? arrow$2({
        element,
        padding
      }).fn(state) : {};
    }
  };
}, offset = (options, deps) => ({
  ...offset$1(options),
  options: [options, deps]
}), shift = (options, deps) => ({
  ...shift$1(options),
  options: [options, deps]
}), flip = (options, deps) => ({
  ...flip$1(options),
  options: [options, deps]
}), autoPlacement = (options, deps) => ({
  ...autoPlacement$1(options),
  options: [options, deps]
}), hide = (options, deps) => ({
  ...hide$1(options),
  options: [options, deps]
}), arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
}), LayoutGroupContext = createContext({});
function useConstant(init) {
  const ref = useRef(null);
  return ref.current === null && (ref.current = init()), ref.current;
}
const isBrowser = typeof window < "u", useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect, PresenceContext = /* @__PURE__ */ createContext(null);
function addUniqueItem(arr, item) {
  arr.indexOf(item) === -1 && arr.push(item);
}
function removeItem(arr, item) {
  const index2 = arr.indexOf(item);
  index2 > -1 && arr.splice(index2, 1);
}
const clamp$1 = (min2, max2, v) => v > max2 ? max2 : v < min2 ? min2 : v;
function formatErrorMessage(message, errorCode) {
  return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}
let warning = () => {
}, invariant = () => {
};
process.env.NODE_ENV !== "production" && (warning = (check, message, errorCode) => {
  !check && typeof console < "u" && console.warn(formatErrorMessage(message, errorCode));
}, invariant = (check, message, errorCode) => {
  if (!check)
    throw new Error(formatErrorMessage(message, errorCode));
});
const MotionGlobalConfig = {}, isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
function isObject(value) {
  return typeof value == "object" && value !== null;
}
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => (result === void 0 && (result = callback()), result);
}
const noop2 = /* @__NO_SIDE_EFFECTS__ */ (any) => any, combineFunctions = (a, b) => (v) => b(a(v)), pipe = (...transformers) => transformers.reduce(combineFunctions), progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    return addUniqueItem(this.subscriptions, handler), () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (numSubscriptions)
      if (numSubscriptions === 1)
        this.subscriptions[0](a, b, c);
      else
        for (let i = 0; i < numSubscriptions; i++) {
          const handler = this.subscriptions[i];
          handler && handler(a, b, c);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3, millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
const warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, errorCode) {
  condition || warned.has(message) || (console.warn(formatErrorMessage(message, errorCode)), warned.add(message));
}
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t, subdivisionPrecision = 1e-7, subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX, currentT, i = 0;
  do
    currentT = lowerBound + (upperBound - lowerBound) / 2, currentX = calcBezier(currentT, mX1, mX2) - x, currentX > 0 ? upperBound = currentT : lowerBound = currentT;
  while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop2;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2, reverseEasing = (easing) => (p) => 1 - easing(1 - p), backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99), backIn = /* @__PURE__ */ reverseEasing(backOut), backInOut = /* @__PURE__ */ mirrorEasing(backIn), anticipate = (p) => (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1))), circIn = (p) => 1 - Math.sin(Math.acos(p)), circOut = reverseEasing(circIn), circInOut = mirrorEasing(circIn), easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1), easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1), easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1), isEasingArray = (ease2) => Array.isArray(ease2) && typeof ease2[0] != "number", isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] == "number", easingLookup = {
  linear: noop2,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
}, isValidEasing = (easing) => typeof easing == "string", easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition))
    return invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`, "invalid-easing-type"), easingLookup[definition];
  return definition;
}, stepsOrder = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = /* @__PURE__ */ new Set(), nextFrame = /* @__PURE__ */ new Set(), isProcessing = !1, flushNextFrame = !1;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function triggerCallback(callback) {
    toKeepAlive.has(callback) && (step.schedule(callback), runNextFrame()), callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = !1, immediate = !1) => {
      const queue = immediate && isProcessing ? thisFrame : nextFrame;
      return keepAlive && toKeepAlive.add(callback), queue.has(callback) || queue.add(callback), callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback), toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      if (latestFrameData = frameData2, isProcessing) {
        flushNextFrame = !0;
        return;
      }
      isProcessing = !0, [thisFrame, nextFrame] = [nextFrame, thisFrame], thisFrame.forEach(triggerCallback), thisFrame.clear(), isProcessing = !1, flushNextFrame && (flushNextFrame = !1, step.process(frameData2));
    }
  };
  return step;
}
const maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = !1, useDefaultElapsed = !0;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, flagRunNextFrame = () => runNextFrame = !0, steps = stepsOrder.reduce((acc, key2) => (acc[key2] = createRenderStep(flagRunNextFrame), acc), {}), { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps, processBatch = () => {
    const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
    runNextFrame = !1, MotionGlobalConfig.useManualTiming || (state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1)), state.timestamp = timestamp, state.isProcessing = !0, setup.process(state), read.process(state), resolveKeyframes.process(state), preUpdate.process(state), update.process(state), preRender.process(state), render.process(state), postRender.process(state), state.isProcessing = !1, runNextFrame && allowKeepAlive && (useDefaultElapsed = !1, scheduleNextBatch(processBatch));
  }, wake = () => {
    runNextFrame = !0, useDefaultElapsed = !0, state.isProcessing || scheduleNextBatch(processBatch);
  };
  return { schedule: stepsOrder.reduce((acc, key2) => {
    const step = steps[key2];
    return acc[key2] = (process2, keepAlive = !1, immediate = !1) => (runNextFrame || wake(), step.schedule(process2, keepAlive, immediate)), acc;
  }, {}), cancel: (process2) => {
    for (let i = 0; i < stepsOrder.length; i++)
      steps[stepsOrder[i]].cancel(process2);
  }, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame < "u" ? requestAnimationFrame : noop2, !0);
let now;
function clearTime() {
  now = void 0;
}
const time$1 = {
  now: () => (now === void 0 && time$1.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now()), now),
  set: (newTime) => {
    now = newTime, queueMicrotask(clearTime);
  }
}, checkStringStartsWith = (token) => (key2) => typeof key2 == "string" && key2.startsWith(token), isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--"), startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--"), isCSSVariableToken = (value) => startsAsVariableToken(value) ? singleCssVariableRegex.test(value.split("/*")[0].trim()) : !1, singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, number = {
  test: (v) => typeof v == "number",
  parse: parseFloat,
  transform: (v) => v
}, alpha = {
  ...number,
  transform: (v) => clamp$1(0, 1, v)
}, scale = {
  ...number,
  default: 1
}, sanitize = (v) => Math.round(v * 1e5) / 1e5, floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v) {
  return v == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, isColorString = (type, testProp) => (v) => !!(typeof v == "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp)), splitColor = (aName, bName, cName) => (v) => {
  if (typeof v != "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
}, clampRgbUnit = (v) => clamp$1(0, 255, v), rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
}, rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red: red2, green: green2, blue: blue2, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red2) + ", " + rgbUnit.transform(green2) + ", " + rgbUnit.transform(blue2) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "", g = "", b = "", a = "";
  return v.length > 5 ? (r = v.substring(1, 3), g = v.substring(3, 5), b = v.substring(5, 7), a = v.substring(7, 9)) : (r = v.substring(1, 2), g = v.substring(2, 3), b = v.substring(3, 4), a = v.substring(4, 5), r += r, g += g, b += b, a += a), {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
}, createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
  test: (v) => typeof v == "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
}), degrees = /* @__PURE__ */ createUnitType("deg"), percent = /* @__PURE__ */ createUnitType("%"), px = /* @__PURE__ */ createUnitType("px"), vh = /* @__PURE__ */ createUnitType("vh"), vw = /* @__PURE__ */ createUnitType("vw"), progressPercentage = {
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
}, hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
}, color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => rgba.test(v) ? rgba.parse(v) : hsla.test(v) ? hsla.parse(v) : hex.parse(v),
  transform: (v) => typeof v == "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v),
  getAnimatableNone: (v) => {
    const parsed = color.parse(v);
    return parsed.alpha = 0, color.transform(parsed);
  }
}, colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v) {
  return isNaN(v) && typeof v == "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
}
const NUMBER_TOKEN = "number", COLOR_TOKEN = "color", VAR_TOKEN = "var", VAR_FUNCTION_TOKEN = "var(", SPLIT_TOKEN = "${}", complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString(), values = [], indexes = {
    color: [],
    number: [],
    var: []
  }, types = [];
  let i = 0;
  const split = originalValue.replace(complexRegex, (parsedValue) => (color.test(parsedValue) ? (indexes.color.push(i), types.push(COLOR_TOKEN), values.push(color.parse(parsedValue))) : parsedValue.startsWith(VAR_FUNCTION_TOKEN) ? (indexes.var.push(i), types.push(VAR_TOKEN), values.push(parsedValue)) : (indexes.number.push(i), types.push(NUMBER_TOKEN), values.push(parseFloat(parsedValue))), ++i, SPLIT_TOKEN)).split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function createTransformer(source) {
  const { split, types } = analyseComplexValue(source), numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0; i < numSections; i++)
      if (output += split[i], v[i] !== void 0) {
        const type = types[i];
        type === NUMBER_TOKEN ? output += sanitize(v[i]) : type === COLOR_TOKEN ? output += color.transform(v[i]) : output += v[i];
      }
    return output;
  };
}
const convertNumbersToZero = (v) => typeof v == "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
function getAnimatableNone$1(v) {
  const parsed = parseComplexValue(v);
  return createTransformer(v)(parsed.map(convertNumbersToZero));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
function hueToRgb(p, q, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360, saturation /= 100, lightness /= 100;
  let red2 = 0, green2 = 0, blue2 = 0;
  if (!saturation)
    red2 = green2 = blue2 = lightness;
  else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation, p = 2 * lightness - q;
    red2 = hueToRgb(p, q, hue + 1 / 3), green2 = hueToRgb(p, q, hue), blue2 = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red2 * 255),
    green: Math.round(green2 * 255),
    blue: Math.round(blue2 * 255),
    alpha: alpha2
  };
}
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}
const mixNumber$1 = (from, to, progress2) => from + (to - from) * progress2, mixLinearColor = (from, to, v) => {
  const fromExpo = from * from, expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
}, colorTypes = [hex, rgba, hsla], getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color2) {
  const type = getColorType(color2);
  if (warning(!!type, `'${color2}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !type)
    return !1;
  let model = type.parse(color2);
  return type === hsla && (model = hslaToRgba(model)), model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from), toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA)
    return mixImmediate(from, to);
  const blended = { ...fromRGBA };
  return (v) => (blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v), blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v), blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v), blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v), rgba.transform(blended));
}, invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin2, target) {
  return invisibleValues.has(origin2) ? (p) => p <= 0 ? origin2 : target : (p) => p >= 1 ? target : origin2;
}
function mixNumber(a, b) {
  return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
  return typeof a == "number" ? mixNumber : typeof a == "string" ? isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex : Array.isArray(a) ? mixArray : typeof a == "object" ? color.test(a) ? mixColor : mixObject : mixImmediate;
}
function mixArray(a, b) {
  const output = [...a], numValues = output.length, blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
  return (p) => {
    for (let i = 0; i < numValues; i++)
      output[i] = blendValue[i](p);
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b }, blendValue = {};
  for (const key2 in output)
    a[key2] !== void 0 && b[key2] !== void 0 && (blendValue[key2] = getMixer(a[key2])(a[key2], b[key2]));
  return (v) => {
    for (const key2 in blendValue)
      output[key2] = blendValue[key2](v);
    return output;
  };
}
function matchOrder(origin2, target) {
  const orderedOrigin = [], pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i], originIndex = origin2.indexes[type][pointers[type]], originValue = origin2.values[originIndex] ?? 0;
    orderedOrigin[i] = originValue, pointers[type]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin2, target) => {
  const template = complex.createTransformer(target), originStats = analyseComplexValue(origin2), targetStats = analyseComplexValue(target);
  return originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length ? invisibleValues.has(origin2) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length ? mixVisibility(origin2, target) : pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template) : (warning(!0, `Complex values '${origin2}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), mixImmediate(origin2, target));
};
function mix(from, to, p) {
  return typeof from == "number" && typeof to == "number" && typeof p == "number" ? mixNumber$1(from, to, p) : getMixer(from)(from, to);
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = !0) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time$1.now()
  };
}, generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++)
    points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${points.substring(0, points.length - 2)})`;
}, maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  for (; !state.done && duration < maxGeneratorDuration; )
    duration += timeStep, state = generator.next(duration);
  return duration >= maxGeneratorDuration ? 1 / 0 : duration;
}
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] }), duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => generator.next(duration * progress2).value / scale2,
    duration: /* @__PURE__ */ millisecondsToSeconds(duration)
  };
}
const velocitySampleDuration = 5;
function calcGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope, derivative;
  warning(duration <= /* @__PURE__ */ secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp$1(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio), duration = clamp$1(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration)), dampingRatio < 1 ? (envelope = (undampedFreq2) => {
    const exponentialDecay = undampedFreq2 * dampingRatio, delta = exponentialDecay * duration, a = exponentialDecay - velocity, b = calcAngularFreq(undampedFreq2, dampingRatio), c = Math.exp(-delta);
    return safeMin - a / b * c;
  }, derivative = (undampedFreq2) => {
    const delta = undampedFreq2 * dampingRatio * duration, d = delta * velocity + velocity, e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration, f = Math.exp(-delta), g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
    return (-envelope(undampedFreq2) + safeMin > 0 ? -1 : 1) * ((d - e) * f) / g;
  }) : (envelope = (undampedFreq2) => {
    const a = Math.exp(-undampedFreq2 * duration), b = (undampedFreq2 - velocity) * duration + 1;
    return -safeMin + a * b;
  }, derivative = (undampedFreq2) => {
    const a = Math.exp(-undampedFreq2 * duration), b = (velocity - undampedFreq2) * (duration * duration);
    return a * b;
  });
  const initialGuess = 5 / duration, undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  if (duration = /* @__PURE__ */ secondsToMilliseconds(duration), isNaN(undampedFreq))
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++)
    result = result - envelope(result) / derivative(result);
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const durationKeys = ["duration", "bounce"], physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key2) => options[key2] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: !1,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys))
    if (options.visualDuration) {
      const visualDuration = options.visualDuration, root = 2 * Math.PI / (visualDuration * 1.2), stiffness = root * root, damping = 2 * clamp$1(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring(options);
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      }, springOptions.isResolvedFromDuration = !0;
    }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration != "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin2 = options.keyframes[0], target = options.keyframes[options.keyframes.length - 1], state = { done: !1, value: origin2 }, { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  }), initialVelocity = velocity || 0, dampingRatio = damping / (2 * Math.sqrt(stiffness * mass)), initialDelta = target - origin2, undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass)), isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default), restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  if (dampingRatio < 1) {
    const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1)
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
  else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t), freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration && duration || null,
    next: (t) => {
      const current = resolveSpring(t);
      if (isResolvedFromDuration)
        state.done = t >= duration;
      else {
        let currentVelocity = t === 0 ? initialVelocity : 0;
        dampingRatio < 1 && (currentVelocity = t === 0 ? /* @__PURE__ */ secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current));
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed, isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      }
      return state.value = state.done ? target : current, state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration), easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {
    }
  };
  return generator;
}
spring.applyToOptions = (options) => {
  const generatorOptions = createGeneratorEasing(options, 100, spring);
  return options.ease = generatorOptions.ease, options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration), options.type = "keyframes", options;
};
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min: min2, max: max2, restDelta = 0.5, restSpeed }) {
  const origin2 = keyframes2[0], state = {
    done: !1,
    value: origin2
  }, isOutOfBounds = (v) => min2 !== void 0 && v < min2 || max2 !== void 0 && v > max2, nearestBoundary = (v) => min2 === void 0 ? max2 : max2 === void 0 || Math.abs(min2 - v) < Math.abs(max2 - v) ? min2 : max2;
  let amplitude = power * velocity;
  const ideal = origin2 + amplitude, target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  target !== ideal && (amplitude = target - origin2);
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant), calcLatest = (t) => target + calcDelta(t), applyFriction = (t) => {
    const delta = calcDelta(t), latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta, state.value = state.done ? target : latest;
  };
  let timeReachedBoundary, spring$1;
  const checkCatchBoundary = (t) => {
    isOutOfBounds(state.value) && (timeReachedBoundary = t, spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: calcGeneratorVelocity(calcLatest, t, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    }));
  };
  return checkCatchBoundary(0), {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = !1;
      return !spring$1 && timeReachedBoundary === void 0 && (hasUpdatedFrame = !0, applyFriction(t), checkCatchBoundary(t)), timeReachedBoundary !== void 0 && t >= timeReachedBoundary ? spring$1.next(t - timeReachedBoundary) : (!hasUpdatedFrame && applyFriction(t), state);
    }
  };
}
function createMixers(output, ease2, customMixer) {
  const mixers = [], mixerFactory = customMixer || MotionGlobalConfig.mix || mix, numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop2 : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = !0, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  if (invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length"), inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  input[0] > input[inputLength - 1] && (input = [...input].reverse(), output = [...output].reverse());
  const mixers = createMixers(output, ease2, mixer), numMixers = mixers.length, interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1)
      for (; i < input.length - 2 && !(v < input[i + 1]); i++)
        ;
    const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp$1(input[0], input[inputLength - 1], v)) : interpolator;
}
function fillOffset(offset2, remaining) {
  const min2 = offset2[offset2.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
    offset2.push(mixNumber$1(min2, 1, offsetProgress));
  }
}
function defaultOffset(arr) {
  const offset2 = [0];
  return fillOffset(offset2, arr.length - 1), offset2;
}
function convertOffsetToTimes(offset2, duration) {
  return offset2.map((o) => o * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2), state = {
    done: !1,
    value: keyframeValues[0]
  }, absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  ), mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => (state.value = mapTimeToKeyframe(t), state.done = t >= duration, state)
  };
}
const isNotNull$1 = (value) => value !== null;
function getFinalKeyframe$1(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull$1), index2 = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
  return !index2 || finalKeyframe === void 0 ? resolvedKeyframes[index2] : finalKeyframe;
}
const transitionTypeMap = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
function replaceTransitionType(transition) {
  typeof transition.type == "string" && (transition.type = transitionTypeMap[transition.type]);
}
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
const percentToProgress = (percent2) => percent2 / 100;
class JSAnimation extends WithPromise {
  constructor(options) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      const { motionValue: motionValue2 } = this.options;
      motionValue2 && motionValue2.updatedAt !== time$1.now() && this.tick(time$1.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = options, this.initAnimation(), this.play(), options.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options } = this;
    replaceTransitionType(options);
    const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
    let { keyframes: keyframes$12 } = options;
    const generatorFactory = type || keyframes;
    process.env.NODE_ENV !== "production" && generatorFactory !== keyframes && invariant(keyframes$12.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$12}`, "spring-two-frames"), generatorFactory !== keyframes && typeof keyframes$12[0] != "number" && (this.mixKeyframes = pipe(percentToProgress, mix(keyframes$12[0], keyframes$12[1])), keyframes$12 = [0, 100]);
    const generator = generatorFactory({ ...options, keyframes: keyframes$12 });
    repeatType === "mirror" && (this.mirroredGenerator = generatorFactory({
      ...options,
      keyframes: [...keyframes$12].reverse(),
      velocity: -velocity
    })), generator.calculatedDuration === null && (generator.calculatedDuration = calcGeneratorDuration(generator));
    const { calculatedDuration } = generator;
    this.calculatedDuration = calculatedDuration, this.resolvedDuration = calculatedDuration + repeatDelay, this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay, this.generator = generator;
  }
  updateTime(timestamp) {
    const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = animationTime;
  }
  tick(timestamp, sample = !1) {
    const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, timestamp) : this.speed < 0 && (this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime)), sample ? this.currentTime = timestamp : this.updateTime(timestamp);
    const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1), isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = totalDuration);
    let elapsed = this.currentTime, frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2), iterationProgress = progress2 % 1;
      !iterationProgress && progress2 >= 1 && (iterationProgress = 1), iterationProgress === 1 && currentIteration--, currentIteration = Math.min(currentIteration, repeat + 1), !!(currentIteration % 2) && (repeatType === "reverse" ? (iterationProgress = 1 - iterationProgress, repeatDelay && (iterationProgress -= repeatDelay / resolvedDuration)) : repeatType === "mirror" && (frameGenerator = mirroredGenerator)), elapsed = clamp$1(0, 1, iterationProgress) * resolvedDuration;
    }
    const state = isInDelayPhase ? { done: !1, value: keyframes2[0] } : frameGenerator.next(elapsed);
    mixKeyframes && (state.value = mixKeyframes(state.value));
    let { done } = state;
    !isInDelayPhase && calculatedDuration !== null && (done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0);
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    return isAnimationFinished && type !== inertia && (state.value = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed)), onUpdate && onUpdate(state.value), isAnimationFinished && this.finish(), state;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve, reject) {
    return this.finished.then(resolve, reject);
  }
  get duration() {
    return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime), this.currentTime = newTime, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = newTime : this.driver && (this.startTime = this.driver.now() - newTime / this.playbackSpeed), this.driver?.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    this.updateTime(time$1.now());
    const hasChanged = this.playbackSpeed !== newSpeed;
    this.playbackSpeed = newSpeed, hasChanged && (this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, startTime } = this.options;
    this.driver || (this.driver = driver((timestamp) => this.tick(timestamp))), this.options.onPlay?.();
    const now2 = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = now2) : this.holdTime !== null ? this.startTime = now2 - this.holdTime : this.startTime || (this.startTime = startTime ?? now2), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(time$1.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(sampleTime) {
    return this.startTime = 0, this.tick(sampleTime, !0);
  }
  attachTimeline(timeline) {
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), timeline.observe(this);
  }
}
function fillWildcards(keyframes2) {
  for (let i = 1; i < keyframes2.length; i++)
    keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
}
const radToDeg = (rad) => rad * 180 / Math.PI, rotate$2 = (v) => {
  const angle = radToDeg(Math.atan2(v[1], v[0]));
  return rebaseAngle(angle);
}, matrix2dParsers = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
  rotate: rotate$2,
  rotateZ: rotate$2,
  skewX: (v) => radToDeg(Math.atan(v[1])),
  skewY: (v) => radToDeg(Math.atan(v[2])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
}, rebaseAngle = (angle) => (angle = angle % 360, angle < 0 && (angle += 360), angle), rotateZ = rotate$2, scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]), scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]), matrix3dParsers = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX,
  scaleY,
  scale: (v) => (scaleX(v) + scaleY(v)) / 2,
  rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
  rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
  rotateZ,
  rotate: rotateZ,
  skewX: (v) => radToDeg(Math.atan(v[4])),
  skewY: (v) => radToDeg(Math.atan(v[1])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
  if (!transform || transform === "none")
    return defaultTransformValue(name);
  const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers, match;
  if (matrix3dMatch)
    parsers = matrix3dParsers, match = matrix3dMatch;
  else {
    const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers, match = matrix2dMatch;
  }
  if (!match)
    return defaultTransformValue(name);
  const valueParser = parsers[name], values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser == "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
  const { transform = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform, name);
};
function convertTransformToNumber(value) {
  return parseFloat(value.trim());
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], transformProps = new Set(transformPropOrder), isNumOrPxType = (v) => v === number || v === px, transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]), nonTranslationalTransformKeys = transformPropOrder.filter((key2) => !transformKeys.has(key2));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  return nonTranslationalTransformKeys.forEach((key2) => {
    const value = visualElement.getValue(key2);
    value !== void 0 && (removedTransforms.push([key2, value.get()]), value.set(key2.startsWith("scale") ? 1 : 0));
  }), removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
  height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
  y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = !1, anyNeedsMeasurement = !1, isForced = !1;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement), elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element)), transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      removedTransforms.length && (transformsToRestore.set(element, removedTransforms), element.render());
    }), resolversToMeasure.forEach((resolver) => resolver.measureInitialState()), elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      restore && restore.forEach(([key2, value]) => {
        element.getValue(key2)?.set(value);
      });
    }), resolversToMeasure.forEach((resolver) => resolver.measureEndState()), resolversToMeasure.forEach((resolver) => {
      resolver.suspendedScrollY !== void 0 && window.scrollTo(0, resolver.suspendedScrollY);
    });
  }
  anyNeedsMeasurement = !1, isScheduled = !1, toResolve.forEach((resolver) => resolver.complete(isForced)), toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes(), resolver.needsMeasurement && (anyNeedsMeasurement = !0);
  });
}
function flushKeyframeResolvers() {
  isForced = !0, readAllKeyframes(), measureAllKeyframes(), isForced = !1;
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...unresolvedKeyframes], this.onComplete = onComplete, this.name = name, this.motionValue = motionValue2, this.element = element, this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (toResolve.add(this), isScheduled || (isScheduled = !0, frame.read(readAllKeyframes), frame.resolveKeyframes(measureAllKeyframes))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue2?.get(), finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== void 0)
        unresolvedKeyframes[0] = currentValue;
      else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        valueAsRead != null && (unresolvedKeyframes[0] = valueAsRead);
      }
      unresolvedKeyframes[0] === void 0 && (unresolvedKeyframes[0] = finalKeyframe), motionValue2 && currentValue === void 0 && motionValue2.set(unresolvedKeyframes[0]);
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(isForcedComplete = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete), toResolve.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (toResolve.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const isCSSVar = (name) => name.startsWith("--");
function setStyle(element, name, value) {
  isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
const supportsScrollTimeline = /* @__PURE__ */ memo(() => window.ScrollTimeline !== void 0), supportsFlags = {};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`, supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (easing)
    return typeof easing == "function" ? supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out" : isBezierDefinition(easing) ? cubicBezierAsString(easing) : Array.isArray(easing) ? easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut) : supportedWaapiEasing[easing];
}
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  times && (keyframeOptions.offset = times);
  const easing = mapEasingToNativeEasing(ease2, duration);
  Array.isArray(easing) && (keyframeOptions.easing = easing);
  const options = {
    delay: delay2,
    duration,
    easing: Array.isArray(easing) ? "linear" : easing,
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  return pseudoElement && (options.pseudoElement = pseudoElement), element.animate(keyframeOptions, options);
}
function isGenerator(type) {
  return typeof type == "function" && "applyToOptions" in type;
}
function applyGeneratorOptions({ type, ...options }) {
  return isGenerator(type) && supportsLinearEasing() ? type.applyToOptions(options) : (options.duration ?? (options.duration = 300), options.ease ?? (options.ease = "easeOut"), options);
}
class NativeAnimation extends WithPromise {
  constructor(options) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !options)
      return;
    const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = !1, finalKeyframe, onComplete } = options;
    this.isPseudoElement = !!pseudoElement, this.allowFlatten = allowFlatten, this.options = options, invariant(typeof options.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const transition = applyGeneratorOptions(options);
    this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement), transition.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !pseudoElement) {
        const keyframe2 = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
        this.updateMotionValue ? this.updateMotionValue(keyframe2) : setStyle(element, name, keyframe2), this.animation.cancel();
      }
      onComplete?.(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state } = this;
    state === "idle" || state === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    this.isPseudoElement || this.animation.commitStyles?.();
  }
  get duration() {
    const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
  }
  set time(newTime) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(newSpeed) {
    newSpeed < 0 && (this.finishedTime = null), this.animation.playbackRate = newSpeed;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(newStartTime) {
    this.animation.startTime = newStartTime;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline, observe }) {
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, timeline && supportsScrollTimeline() ? (this.animation.timeline = timeline, noop2) : observe(this);
  }
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key2) {
  return key2 in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  typeof transition.ease == "string" && isUnsupportedEase(transition.ease) && (transition.ease = unsupportedEasingFunctions[transition.ease]);
}
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options), replaceTransitionType(options), super(options), options.startTime && (this.startTime = options.startTime), this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value) {
    const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue2)
      return;
    if (value !== void 0) {
      motionValue2.set(value);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: !1
    }), sampleTime = /* @__PURE__ */ secondsToMilliseconds(this.finishedTime ?? this.time);
    motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta), sampleAnimation.stop();
  }
}
const isAnimatable = (value, name) => name === "zIndex" ? !1 : !!(typeof value == "number" || Array.isArray(value) || typeof value == "string" && // It's animatable if we have a string
(complex.test(value) || value === "0") && // And it contains numbers and/or colors
!value.startsWith("url("));
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return !0;
  for (let i = 0; i < keyframes2.length; i++)
    if (keyframes2[i] !== current)
      return !0;
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null)
    return !1;
  if (name === "display" || name === "visibility")
    return !0;
  const targetKeyframe = keyframes2[keyframes2.length - 1], isOriginAnimatable = isAnimatable(originKeyframe, name), isTargetAnimatable = isAnimatable(targetKeyframe, name);
  return warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable"), !isOriginAnimatable || !isTargetAnimatable ? !1 : hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
function makeAnimationInstant(options) {
  options.duration = 0, options.type = "keyframes";
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
  const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type } = options;
  if (!(motionValue2?.owner?.current instanceof HTMLElement))
    return !1;
  const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
  return supportsWaapi() && name && acceleratedValues.has(name) && (name !== "transform" || !transformTemplate) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}
const MAX_RESOLVE_DELAY = 40;
class AsyncMotionValueAnimation extends WithPromise {
  constructor({ autoplay = !0, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = time$1.now();
    const optionsWithDefaults = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      name,
      motionValue: motionValue2,
      element,
      ...options
    }, KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
    this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
    this.keyframeResolver = void 0;
    const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
    this.resolvedAt = time$1.now(), canAnimate(keyframes2, name, type, velocity) || ((MotionGlobalConfig.instantAnimations || !delay2) && onUpdate?.(getFinalKeyframe$1(keyframes2, options, finalKeyframe)), keyframes2[0] = keyframes2[keyframes2.length - 1], makeAnimationInstant(options), options.repeat = 0);
    const resolvedOptions = {
      startTime: sync ? this.resolvedAt ? this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe,
      ...options,
      keyframes: keyframes2
    }, animation2 = !isHandoff && supportsBrowserAnimation(resolvedOptions) ? new NativeAnimationExtended({
      ...resolvedOptions,
      element: resolvedOptions.motionValue.owner.current
    }) : new JSAnimation(resolvedOptions);
    animation2.finished.then(() => this.notifyFinished()).catch(noop2), this.pendingTimeline && (this.stopTimeline = animation2.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = animation2;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), flushKeyframeResolvers()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(newTime) {
    this.animation.time = newTime;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(newSpeed) {
    this.animation.speed = newSpeed;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(timeline) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(timeline) : this.pendingTimeline = timeline, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
  }
}
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
const maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
  invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
function getValueTransition(transition, key2) {
  return transition?.[key2] ?? transition?.default ?? transition;
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]), auto = {
  test: (v) => v === "auto",
  parse: (v) => v
}, testValueType = (v) => (type) => type.test(v), dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto], findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
function isNone(value) {
  return typeof value == "number" ? value === 0 : value !== null ? value === "none" || value === "0" || isZeroValueString(value) : !0;
}
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  return number2 !== value && (defaultValue *= 100), name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu, filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
}, int = {
  ...number,
  transform: Math.round
}, transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
}, numberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px,
  ...transformValueTypes,
  zIndex: int,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
}, defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter
}, getDefaultValueType = (key2) => defaultValueTypes[key2];
function getAnimatableNone(key2, value) {
  let defaultValueType = getDefaultValueType(key2);
  return defaultValueType !== filter && (defaultValueType = complex), defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0, animatableTemplate;
  for (; i < unresolvedKeyframes.length && !animatableTemplate; ) {
    const keyframe2 = unresolvedKeyframes[i];
    typeof keyframe2 == "string" && !invalidTemplates.has(keyframe2) && analyseComplexValue(keyframe2).values.length && (animatableTemplate = unresolvedKeyframes[i]), i++;
  }
  if (animatableTemplate && name)
    for (const noneIndex of noneKeyframeIndexes)
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
}
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe2 = unresolvedKeyframes[i];
      if (typeof keyframe2 == "string" && (keyframe2 = keyframe2.trim(), isCSSVariableToken(keyframe2))) {
        const resolved = getVariableValue(keyframe2, element.current);
        resolved !== void 0 && (unresolvedKeyframes[i] = resolved), i === unresolvedKeyframes.length - 1 && (this.finalKeyframe = keyframe2);
      }
    }
    if (this.resolveNoneKeyframes(), !positionalKeys.has(name) || unresolvedKeyframes.length !== 2)
      return;
    const [origin2, target] = unresolvedKeyframes, originType = findDimensionValueType(origin2), targetType = findDimensionValueType(target);
    if (originType !== targetType)
      if (isNumOrPxType(originType) && isNumOrPxType(targetType))
        for (let i = 0; i < unresolvedKeyframes.length; i++) {
          const value = unresolvedKeyframes[i];
          typeof value == "string" && (unresolvedKeyframes[i] = parseFloat(value));
        }
      else positionalValues[name] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this, noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++)
      (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) && noneKeyframeIndexes.push(i);
    noneKeyframeIndexes.length && makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    name === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current)), unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    measureKeyframe !== void 0 && element.getValue(name, measureKeyframe).jump(measureKeyframe, !1);
  }
  measureEndState() {
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, !1);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1, finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current)), finalKeyframe !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = finalKeyframe), this.removedTransforms?.length && this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
      element.getValue(unsetTransformName).set(unsetTransformValue);
    }), this.resolveNoneKeyframes();
  }
}
function resolveElements(elementOrSelector, scope, selectorCache) {
  if (elementOrSelector instanceof EventTarget)
    return [elementOrSelector];
  if (typeof elementOrSelector == "string") {
    let root = document;
    const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector);
}
const getValueAsType = (value, type) => type && typeof value == "number" ? type.transform(value) : value;
function isHTMLElement$1(element) {
  return isObject(element) && "offsetHeight" in element;
}
const MAX_VELOCITY_DELTA = 30, isFloat = (value) => !isNaN(parseFloat(value));
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init, options = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (v) => {
      const currentTime = time$1.now();
      if (this.updatedAt !== currentTime && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(v), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const dependent of this.dependents)
          dependent.dirty();
    }, this.hasAnimated = !1, this.setCurrent(init), this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current, this.updatedAt = time$1.now(), this.canTrackVelocity === null && current !== void 0 && (this.canTrackVelocity = isFloat(this.current));
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    return process.env.NODE_ENV !== "production" && warnOnce(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", subscription);
  }
  on(eventName, callback) {
    this.events[eventName] || (this.events[eventName] = new SubscriptionManager());
    const unsubscribe = this.events[eventName].add(callback);
    return eventName === "change" ? () => {
      unsubscribe(), frame.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events)
      this.events[eventManagers].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect, this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v) {
    this.passiveEffect ? this.passiveEffect(v, this.updateAndNotify) : this.updateAndNotify(v);
  }
  setWithVelocity(prev, current, delta) {
    this.set(current), this.prev = void 0, this.prevFrameValue = prev, this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = !0) {
    this.updateAndNotify(v), this.prev = v, this.prevUpdatedAt = this.prevFrameValue = void 0, endAnimation && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(dependent) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    this.dependents && this.dependents.delete(dependent);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time$1.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA)
      return 0;
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation) {
    return this.stop(), new Promise((resolve) => {
      this.hasAnimated = !0, this.animation = startAnimation(resolve), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
const { schedule: microtask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, !1), isDragging = {
  x: !1,
  y: !1
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  return axis === "x" || axis === "y" ? isDragging[axis] ? null : (isDragging[axis] = !0, () => {
    isDragging[axis] = !1;
  }) : isDragging.x || isDragging.y ? null : (isDragging.x = isDragging.y = !0, () => {
    isDragging.x = isDragging.y = !1;
  });
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector), gestureAbortController = new AbortController(), eventOptions = {
    passive: !0,
    ...options,
    signal: gestureAbortController.signal
  };
  return [elements, eventOptions, () => gestureAbortController.abort()];
}
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options), onPointerEnter = (enterEvent) => {
    if (!isValidHover(enterEvent))
      return;
    const { target } = enterEvent, onHoverEnd = onHoverStart(target, enterEvent);
    if (typeof onHoverEnd != "function" || !target)
      return;
    const onPointerLeave = (leaveEvent) => {
      isValidHover(leaveEvent) && (onHoverEnd(leaveEvent), target.removeEventListener("pointerleave", onPointerLeave));
    };
    target.addEventListener("pointerleave", onPointerLeave, eventOptions);
  };
  return elements.forEach((element) => {
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
  }), cancel;
}
const isNodeOrChild = (parent, child) => child ? parent === child ? !0 : isNodeOrChild(parent, child.parentElement) : !1, isPrimaryPointer = (event) => event.pointerType === "mouse" ? typeof event.button != "number" || event.button <= 0 : event.isPrimary !== !1, focusableElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return focusableElements.has(element.tagName) || element.tabIndex !== -1;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    event.key === "Enter" && callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: !0, bubbles: !0 }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    }), handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions), element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions), element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options), startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    isPressing.add(target);
    const onPressEnd = onPressStart(target, startEvent), onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp), window.removeEventListener("pointercancel", onPointerCancel), isPressing.has(target) && isPressing.delete(target), isValidPressEvent(endEvent) && typeof onPressEnd == "function" && onPressEnd(endEvent, { success });
    }, onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    }, onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, !1);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions), window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  return targets.forEach((target) => {
    (options.useGlobalTarget ? window : target).addEventListener("pointerdown", startPress, eventOptions), isHTMLElement$1(target) && (target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions)), !isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex") && (target.tabIndex = 0));
  }), cancelEvents;
}
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
const isMotionValue = (value) => !!(value && value.getVelocity), valueTypes = [...dimensionValueTypes, color, complex], findValueType = (v) => valueTypes.find(testValueType(v)), MotionConfigContext = createContext({
  transformPagePoint: (p) => p,
  isStatic: !1,
  reducedMotion: "never"
});
function setRef(ref, value) {
  if (typeof ref == "function")
    return ref(value);
  ref != null && (ref.current = value);
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = !1;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      return !hasCleanup && typeof cleanup == "function" && (hasCleanup = !0), cleanup;
    });
    if (hasCleanup)
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          typeof cleanup == "function" ? cleanup() : setRef(refs[i], null);
        }
      };
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (element && prevProps.isPresent && !this.props.isPresent) {
      const parent = element.offsetParent, parentWidth = isHTMLElement$1(parent) && parent.offsetWidth || 0, size2 = this.props.sizeRef.current;
      size2.height = element.offsetHeight || 0, size2.width = element.offsetWidth || 0, size2.top = element.offsetTop, size2.left = element.offsetLeft, size2.right = parentWidth - size2.width - size2.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, root }) {
  const id2 = useId(), ref = useRef(null), size2 = useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce } = useContext(MotionConfigContext), composedRef = useComposedRefs(ref, children?.ref);
  return useInsertionEffect(() => {
    const { width, height, top, left, right } = size2.current;
    if (isPresent || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    nonce && (style.nonce = nonce);
    const parent = root ?? document.head;
    return parent.appendChild(style), style.sheet && style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            top: ${top}px !important;
          }
        `), () => {
      parent.contains(style) && parent.removeChild(style);
    };
  }, [isPresent]), jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size2, children: React.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, root }) => {
  const presenceChildren = useConstant(newChildrenMap), id2 = useId();
  let isReusedContext = !0, context2 = useMemo(() => (isReusedContext = !1, {
    id: id2,
    initial,
    isPresent,
    custom,
    onExitComplete: (childId) => {
      presenceChildren.set(childId, !0);
      for (const isComplete of presenceChildren.values())
        if (!isComplete)
          return;
      onExitComplete && onExitComplete();
    },
    register: (childId) => (presenceChildren.set(childId, !1), () => presenceChildren.delete(childId))
  }), [isPresent, presenceChildren, onExitComplete]);
  return presenceAffectsLayout && isReusedContext && (context2 = { ...context2 }), useMemo(() => {
    presenceChildren.forEach((_, key2) => presenceChildren.set(key2, !1));
  }, [isPresent]), React.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]), mode === "popLayout" && (children = jsx(PopChild, { isPresent, anchorX, root, children })), jsx(PresenceContext.Provider, { value: context2, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
function usePresence(subscribe = !0) {
  const context2 = useContext(PresenceContext);
  if (context2 === null)
    return [!0, null];
  const { isPresent, onExitComplete, register } = context2, id2 = useId();
  useEffect(() => {
    if (subscribe)
      return register(id2);
  }, [subscribe]);
  const safeToRemove = useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [!1, safeToRemove] : [!0];
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  return Children.forEach(children, (child) => {
    isValidElement(child) && filtered.push(child);
  }), filtered;
}
const AnimatePresence = ({ children, custom, initial = !0, onExitComplete, presenceAffectsLayout = !0, mode = "sync", propagate = !1, anchorX = "left", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate), presentChildren = useMemo(() => onlyElements(children), [children]), presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey), isInitialRender = useRef(!0), pendingPresentChildren = useRef(presentChildren), exitComplete = useConstant(() => /* @__PURE__ */ new Map()), [diffedChildren, setDiffedChildren] = useState(presentChildren), [renderedChildren, setRenderedChildren] = useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = !1, pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key2 = getChildKey(renderedChildren[i]);
      presentKeys.includes(key2) ? exitComplete.delete(key2) : exitComplete.get(key2) !== !0 && exitComplete.set(key2, !1);
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i], key2 = getChildKey(child);
      presentKeys.includes(key2) || (nextChildren.splice(i, 0, child), exitingChildren.push(child));
    }
    return mode === "wait" && exitingChildren.length && (nextChildren = exitingChildren), setRenderedChildren(onlyElements(nextChildren)), setDiffedChildren(presentChildren), null;
  }
  process.env.NODE_ENV !== "production" && mode === "wait" && renderedChildren.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  const { forceRender } = useContext(LayoutGroupContext);
  return jsx(Fragment, { children: renderedChildren.map((child) => {
    const key2 = getChildKey(child), isPresent = propagate && !isParentPresent ? !1 : presentChildren === renderedChildren || presentKeys.includes(key2), onExit = () => {
      if (exitComplete.has(key2))
        exitComplete.set(key2, !0);
      else
        return;
      let isEveryExitComplete = !0;
      exitComplete.forEach((isExitComplete) => {
        isExitComplete || (isEveryExitComplete = !1);
      }), isEveryExitComplete && (forceRender?.(), setRenderedChildren(pendingPresentChildren.current), propagate && safeToRemove?.(), onExitComplete && onExitComplete());
    };
    return jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : !1, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, children: child }, key2);
  }) });
}, LazyContext = createContext({ strict: !1 }), featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, featureDefinitions = {};
for (const key2 in featureProps)
  featureDefinitions[key2] = {
    isEnabled: (props) => featureProps[key2].some((name) => !!props[name])
  };
function loadFeatures(features) {
  for (const key2 in features)
    featureDefinitions[key2] = {
      ...featureDefinitions[key2],
      ...features[key2]
    };
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key2) {
  return key2.startsWith("while") || key2.startsWith("drag") && key2 !== "draggable" || key2.startsWith("layout") || key2.startsWith("onTap") || key2.startsWith("onPan") || key2.startsWith("onLayout") || validMotionProps.has(key2);
}
let shouldForward = (key2) => !isValidMotionProp(key2);
function loadExternalIsValidProp(isValidProp) {
  typeof isValidProp == "function" && (shouldForward = (key2) => key2.startsWith("on") ? !isValidMotionProp(key2) : isValidProp(key2));
}
try {
  loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
} catch {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key2 in props)
    key2 === "values" && typeof props.values == "object" || (shouldForward(key2) || forwardMotionProps === !0 && isValidMotionProp(key2) || !isDom && !isValidMotionProp(key2) || // If trying to use native HTML drag events, forward drag listeners
    props.draggable && key2.startsWith("onDrag")) && (filteredProps[key2] = props[key2]);
  return filteredProps;
}
const MotionContext = /* @__PURE__ */ createContext({});
function isAnimationControls(v) {
  return v !== null && typeof v == "object" && typeof v.start == "function";
}
function isVariantLabel(v) {
  return typeof v == "string" || Array.isArray(v);
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return !!(isControllingVariants(props) || props.variants);
}
function getCurrentTreeVariants(props, context2) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === !1 || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== !1 ? context2 : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, useContext(MotionContext));
  return useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
function pixelsToPercent(pixels, axis) {
  return axis.max === axis.min ? 0 : pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest == "string")
      if (px.test(latest))
        latest = parseFloat(latest);
      else
        return latest;
    const x = pixelsToPercent(latest, node.target.x), y = pixelsToPercent(latest, node.target.y);
    return `${x}% ${y}%`;
  }
}, correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest, shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest), offset2 = typeof shadow[0] != "number" ? 1 : 0, xScale = projectionDelta.x.scale * treeScale.x, yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset2] /= xScale, shadow[1 + offset2] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    return typeof shadow[2 + offset2] == "number" && (shadow[2 + offset2] /= averageScale), typeof shadow[3 + offset2] == "number" && (shadow[3 + offset2] /= averageScale), template(shadow);
  }
}, scaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function isForcedMotionValue(key2, { layout: layout2, layoutId }) {
  return transformProps.has(key2) || key2.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key2] || key2 === "opacity");
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform, transformTemplate) {
  let transformString = "", transformIsDefault = !0;
  for (let i = 0; i < numTransforms; i++) {
    const key2 = transformPropOrder[i], value = latestValues[key2];
    if (value === void 0)
      continue;
    let valueIsDefault = !0;
    if (typeof value == "number" ? valueIsDefault = value === (key2.startsWith("scale") ? 1 : 0) : valueIsDefault = parseFloat(value) === 0, !valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key2]);
      if (!valueIsDefault) {
        transformIsDefault = !1;
        const transformName = translateAlias[key2] || key2;
        transformString += `${transformName}(${valueAsType}) `;
      }
      transformTemplate && (transform[key2] = valueAsType);
    }
  }
  return transformString = transformString.trim(), transformTemplate ? transformString = transformTemplate(transform, transformIsDefault ? "" : transformString) : transformIsDefault && (transformString = "none"), transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = !1, hasTransformOrigin = !1;
  for (const key2 in latestValues) {
    const value = latestValues[key2];
    if (transformProps.has(key2)) {
      hasTransform2 = !0;
      continue;
    } else if (isCSSVariableName(key2)) {
      vars[key2] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key2]);
      key2.startsWith("origin") ? (hasTransformOrigin = !0, transformOrigin[key2] = valueAsType) : style[key2] = valueAsType;
    }
  }
  if (latestValues.transform || (hasTransform2 || transformTemplate ? style.transform = buildTransform(latestValues, state.transform, transformTemplate) : style.transform && (style.transform = "none")), hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function copyRawValuesOnly(target, source, props) {
  for (const key2 in source)
    !isMotionValue(source[key2]) && !isForcedMotionValue(key2, props) && (target[key2] = source[key2]);
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return useMemo(() => {
    const state = createHtmlRenderState();
    return buildHTMLStyles(state, visualState, transformTemplate), Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {}, style = {};
  return copyRawValuesOnly(style, styleProp, props), Object.assign(style, useInitialMotionValues(props, visualState)), style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {}, style = useStyle(props, visualState);
  return props.drag && props.dragListener !== !1 && (htmlProps.draggable = !1, style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none", style.touchAction = props.drag === !0 ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`), props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap) && (htmlProps.tabIndex = 0), htmlProps.style = style, htmlProps;
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset2 = 0, useDashCase = !0) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = px.transform(-offset2);
  const pathLength = px.transform(length), pathSpacing = px.transform(spacing);
  attrs[keys.array] = `${pathLength} ${pathSpacing}`;
}
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate, styleProp) {
  if (buildHTMLStyles(state, latest, transformTemplate), isSVGTag2) {
    state.style.viewBox && (state.attrs.viewBox = state.style.viewBox);
    return;
  }
  state.attrs = state.style, state.style = {};
  const { attrs, style } = state;
  attrs.transform && (style.transform = attrs.transform, delete attrs.transform), (style.transform || attrs.transformOrigin) && (style.transformOrigin = attrs.transformOrigin ?? "50% 50%", delete attrs.transformOrigin), style.transform && (style.transformBox = styleProp?.transformBox ?? "fill-box", delete attrs.transformBox), attrX !== void 0 && (attrs.x = attrX), attrY !== void 0 && (attrs.y = attrY), attrScale !== void 0 && (attrs.scale = attrScale), pathLength !== void 0 && buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, !1);
}
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
}), isSVGTag = (tag) => typeof tag == "string" && tag.toLowerCase() === "svg";
function useSVGProps(props, visualState, _isStatic, Component2) {
  const visualProps = useMemo(() => {
    const state = createSvgRenderState();
    return buildSVGAttrs(state, visualState, isSVGTag(Component2), props.transformTemplate, props.style), {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props), visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component2) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component2 != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component2.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(lowercaseSVGElements.indexOf(Component2) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(Component2))
    )
  );
}
function useRender(Component2, props, ref, { latestValues }, isStatic, forwardMotionProps = !1) {
  const visualProps = (isSVGComponent(Component2) ? useSVGProps : useHTMLProps)(props, latestValues, isStatic, Component2), filteredProps = filterProps(props, typeof Component2 == "string", forwardMotionProps), elementProps = Component2 !== Fragment$1 ? { ...filteredProps, ...visualProps, ref } : {}, { children } = props, renderedChildren = useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return createElement(Component2, {
    ...elementProps,
    children: renderedChildren
  });
}
function getValueState(visualElement) {
  const state = [{}, {}];
  return visualElement?.values.forEach((value, key2) => {
    state[0][key2] = value.get(), state[1][key2] = value.getVelocity();
  }), state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition == "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition == "string" && (definition = props.variants && props.variants[definition]), typeof definition == "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context2, presenceContext) {
  return {
    latestValues: makeLatestValues(props, context2, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
}
function makeLatestValues(props, context2, presenceContext, scrapeMotionValues) {
  const values = {}, motionValues = scrapeMotionValues(props, {});
  for (const key2 in motionValues)
    values[key2] = resolveMotionValue(motionValues[key2]);
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props), isVariantNode$1 = isVariantNode(props);
  context2 && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== !1 && (initial === void 0 && (initial = context2.initial), animate === void 0 && (animate = context2.animate));
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === !1 : !1;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === !1;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet != "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key2 in target) {
          let valueTarget = target[key2];
          if (Array.isArray(valueTarget)) {
            const index2 = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index2];
          }
          valueTarget !== null && (values[key2] = valueTarget);
        }
        for (const key2 in transitionEnd)
          values[key2] = transitionEnd[key2];
      }
    }
  }
  return values;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context2 = useContext(MotionContext), presenceContext = useContext(PresenceContext), make = () => makeState(config, props, context2, presenceContext);
  return isStatic ? make() : useConstant(make);
};
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  const { style } = props, newValues = {};
  for (const key2 in style)
    (isMotionValue(style[key2]) || prevProps.style && isMotionValue(prevProps.style[key2]) || isForcedMotionValue(key2, props) || visualElement?.getValue(key2)?.liveStyle !== void 0) && (newValues[key2] = style[key2]);
  return newValues;
}
const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
});
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key2 in props)
    if (isMotionValue(props[key2]) || isMotionValue(prevProps[key2])) {
      const targetKey = transformPropOrder.indexOf(key2) !== -1 ? "attr" + key2.charAt(0).toUpperCase() + key2.substring(1) : key2;
      newValues[targetKey] = props[key2];
    }
  return newValues;
}
const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState
}), motionComponentSymbol = Symbol.for("motionComponentSymbol");
function isRefObject(ref) {
  return ref && typeof ref == "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useMotionRef(visualState, visualElement, externalRef) {
  return useCallback(
    (instance) => {
      instance && visualState.onMount && visualState.onMount(instance), visualElement && (instance ? visualElement.mount(instance) : visualElement.unmount()), externalRef && (typeof externalRef == "function" ? externalRef(instance) : isRefObject(externalRef) && (externalRef.current = instance));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [visualElement]
  );
}
const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), optimizedAppearDataId = "framerAppearId", optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId), SwitchLayoutGroupContext = createContext({});
function useVisualElement(Component2, visualState, props, createVisualElement, ProjectionNodeConstructor) {
  const { visualElement: parent } = useContext(MotionContext), lazyContext = useContext(LazyContext), presenceContext = useContext(PresenceContext), reducedMotionConfig = useContext(MotionConfigContext).reducedMotion, visualElementRef = useRef(null);
  createVisualElement = createVisualElement || lazyContext.renderer, !visualElementRef.current && createVisualElement && (visualElementRef.current = createVisualElement(Component2, {
    visualState,
    parent,
    props,
    presenceContext,
    blockInitialAnimation: presenceContext ? presenceContext.initial === !1 : !1,
    reducedMotionConfig
  }));
  const visualElement = visualElementRef.current, initialLayoutGroupConfig = useContext(SwitchLayoutGroupContext);
  visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg") && createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  const isMounted = useRef(!1);
  useInsertionEffect(() => {
    visualElement && isMounted.current && visualElement.update(props, presenceContext);
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute], wantsHandoff = useRef(!!optimisedAppearId && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
  return useIsomorphicLayoutEffect(() => {
    visualElement && (isMounted.current = !0, window.MotionIsMounted = !0, visualElement.updateFeatures(), visualElement.scheduleRenderMicrotask(), wantsHandoff.current && visualElement.animationState && visualElement.animationState.animateChanges());
  }), useEffect(() => {
    visualElement && (!wantsHandoff.current && visualElement.animationState && visualElement.animationState.animateChanges(), wantsHandoff.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
    }), wantsHandoff.current = !1), visualElement.enteringChildren = void 0);
  }), visualElement;
}
function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent)), visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: !!drag2 || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 == "string" ? layout2 : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot
  });
}
function getClosestProjectingNode(visualElement) {
  if (visualElement)
    return visualElement.options.allowProjection !== !1 ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createMotionComponent(Component2, { forwardMotionProps = !1 } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const useVisualState = isSVGComponent(Component2) ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    }, { isStatic } = configAndProps, context2 = useCreateMotionContext(props), visualState = useVisualState(props, isStatic);
    if (!isStatic && isBrowser) {
      useStrictMode(configAndProps, preloadedFeatures);
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout, context2.visualElement = useVisualElement(Component2, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
    }
    return jsxs(MotionContext.Provider, { value: context2, children: [MeasureLayout2 && context2.visualElement ? jsx(MeasureLayout2, { visualElement: context2.visualElement, ...configAndProps }) : null, useRender(Component2, props, useMotionRef(visualState, context2.visualElement, externalRef), visualState, isStatic, forwardMotionProps)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component2 == "string" ? Component2 : `create(${Component2.displayName ?? Component2.name ?? ""})`}`;
  const ForwardRefMotionComponent = forwardRef(MotionDOMComponent);
  return ForwardRefMotionComponent[motionComponentSymbol] = Component2, ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  const isStrict = useContext(LazyContext).strict;
  if (process.env.NODE_ENV !== "production" && preloadedFeatures && isStrict) {
    const strictMessage = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    configAndProps.ignoreStrict ? warning(!1, strictMessage, "lazy-strict-mode") : invariant(!1, strictMessage, "lazy-strict-mode");
  }
}
function getProjectionFunctionality(props) {
  const { drag: drag2, layout: layout2 } = featureDefinitions;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy > "u")
    return createMotionComponent;
  const componentCache = /* @__PURE__ */ new Map(), factory = (Component2, options) => createMotionComponent(Component2, options, preloadedFeatures, createVisualElement), deprecatedFactoryFunction = (Component2, options) => (process.env.NODE_ENV !== "production" && warnOnce(!1, "motion() is deprecated. Use motion.create() instead."), factory(Component2, options));
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key2) => key2 === "create" ? factory : (componentCache.has(key2) || componentCache.set(key2, createMotionComponent(key2, void 0, preloadedFeatures, createVisualElement)), componentCache.get(key2))
  });
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top }), bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint, scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  return boxScale !== void 0 && (point = scalePoint(point, boxScale, originPoint)), scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale), axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint), applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999, TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = !1) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node, delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i], delta = node.projectionDelta;
    const { visualElement } = node.options;
    visualElement && visualElement.props.style && visualElement.props.style.display === "contents" || (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root && transformBox(box, {
      x: -node.scroll.offset.x,
      y: -node.scroll.offset.y
    }), delta && (treeScale.x *= delta.x.scale, treeScale.y *= delta.y.scale, applyBoxDelta(box, delta)), isSharedTransition && hasTransform(node.latestValues) && transformBox(box, node.latestValues));
  }
  treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN && (treeScale.x = 1), treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN && (treeScale.y = 1);
}
function translateAxis(axis, distance2) {
  axis.min = axis.min + distance2, axis.max = axis.max + distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function transformBox(box, transform) {
  transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX), transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint), { scroll } = rootProjectionNode2;
  return scroll && (translateAxis(viewportBox.x, scroll.offset.x), translateAxis(viewportBox.y, scroll.offset.y)), viewportBox;
}
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
}), createAxis = () => ({ min: 0, max: 0 }), createBox = () => ({
  x: createAxis(),
  y: createAxis()
}), prefersReducedMotion = { current: null }, hasReducedMotionListener = { current: !1 };
function initPrefersReducedMotion() {
  if (hasReducedMotionListener.current = !0, !!isBrowser)
    if (window.matchMedia) {
      const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)"), setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
      motionMediaQuery.addEventListener("change", setReducedMotionPreferences), setReducedMotionPreferences();
    } else
      prefersReducedMotion.current = !1;
}
const visualElementStore = /* @__PURE__ */ new WeakMap();
function updateMotionValuesFromProps(element, next, prev) {
  for (const key2 in next) {
    const nextValue = next[key2], prevValue = prev[key2];
    if (isMotionValue(nextValue))
      element.addValue(key2, nextValue);
    else if (isMotionValue(prevValue))
      element.addValue(key2, motionValue(nextValue, { owner: element }));
    else if (prevValue !== nextValue)
      if (element.hasValue(key2)) {
        const existingValue = element.getValue(key2);
        existingValue.liveStyle === !0 ? existingValue.jump(nextValue) : existingValue.hasAnimated || existingValue.set(nextValue);
      } else {
        const latestValue = element.getStaticValue(key2);
        element.addValue(key2, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
  }
  for (const key2 in prev)
    next[key2] === void 0 && element.removeValue(key2);
  return next;
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = KeyframeResolver, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const now2 = time$1.now();
      this.renderScheduledAt < now2 && (this.renderScheduledAt = now2, frame.render(this.render, !1, !0));
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues, this.baseTarget = { ...latestValues }, this.initialValues = props.initial ? { ...latestValues } : {}, this.renderState = renderState, this.parent = parent, this.props = props, this.presenceContext = presenceContext, this.depth = parent ? parent.depth + 1 : 0, this.reducedMotionConfig = reducedMotionConfig, this.options = options, this.blockInitialAnimation = !!blockInitialAnimation, this.isControllingVariants = isControllingVariants(props), this.isVariantNode = isVariantNode(props), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key2 in initialMotionValues) {
      const value = initialMotionValues[key2];
      latestValues[key2] !== void 0 && isMotionValue(value) && value.set(latestValues[key2]);
    }
  }
  mount(instance) {
    this.current = instance, visualElementStore.set(instance, this), this.projection && !this.projection.instance && this.projection.mount(instance), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((value, key2) => this.bindToMotionValue(key2, value)), hasReducedMotionListener.current || initPrefersReducedMotion(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : prefersReducedMotion.current, process.env.NODE_ENV !== "production" && warnOnce(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), this.parent?.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), cancelFrame(this.notifyUpdate), cancelFrame(this.render), this.valueSubscriptions.forEach((remove) => remove()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
    for (const key2 in this.events)
      this.events[key2].clear();
    for (const key2 in this.features) {
      const feature = this.features[key2];
      feature && (feature.unmount(), feature.isMounted = !1);
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child), this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key2, value) {
    this.valueSubscriptions.has(key2) && this.valueSubscriptions.get(key2)();
    const valueIsTransform = transformProps.has(key2);
    valueIsTransform && this.onBindTransform && this.onBindTransform();
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key2] = latestValue, this.props.onUpdate && frame.preRender(this.notifyUpdate), valueIsTransform && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let removeSyncCheck;
    window.MotionCheckAppearSync && (removeSyncCheck = window.MotionCheckAppearSync(this, key2, value)), this.valueSubscriptions.set(key2, () => {
      removeOnChange(), removeSyncCheck && removeSyncCheck(), value.owner && value.stop();
    });
  }
  sortNodePosition(other) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== other.type ? 0 : this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key2 = "animation";
    for (key2 in featureDefinitions) {
      const featureDefinition = featureDefinitions[key2];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key2] && FeatureConstructor && isEnabled(this.props) && (this.features[key2] = new FeatureConstructor(this)), this.features[key2]) {
        const feature = this.features[key2];
        feature.isMounted ? feature.update() : (feature.mount(), feature.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key2) {
    return this.latestValues[key2];
  }
  setStaticValue(key2, value) {
    this.latestValues[key2] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    (props.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = props, this.prevPresenceContext = this.presenceContext, this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key2 = propEventHandlers[i];
      this.propEventSubscriptions[key2] && (this.propEventSubscriptions[key2](), delete this.propEventSubscriptions[key2]);
      const listenerName = "on" + key2, listener = props[listenerName];
      listener && (this.propEventSubscriptions[key2] = this.on(key2, listener));
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode)
      return closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child), () => closestVariantNode.variantChildren.delete(child);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key2, value) {
    const existingValue = this.values.get(key2);
    value !== existingValue && (existingValue && this.removeValue(key2), this.bindToMotionValue(key2, value), this.values.set(key2, value), this.latestValues[key2] = value.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key2) {
    this.values.delete(key2);
    const unsubscribe = this.valueSubscriptions.get(key2);
    unsubscribe && (unsubscribe(), this.valueSubscriptions.delete(key2)), delete this.latestValues[key2], this.removeValueFromRenderState(key2, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key2) {
    return this.values.has(key2);
  }
  getValue(key2, defaultValue) {
    if (this.props.values && this.props.values[key2])
      return this.props.values[key2];
    let value = this.values.get(key2);
    return value === void 0 && defaultValue !== void 0 && (value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this }), this.addValue(key2, value)), value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key2, target) {
    let value = this.latestValues[key2] !== void 0 || !this.current ? this.latestValues[key2] : this.getBaseTargetFromProps(this.props, key2) ?? this.readValueFromInstance(this.current, key2, this.options);
    return value != null && (typeof value == "string" && (isNumericalString(value) || isZeroValueString(value)) ? value = parseFloat(value) : !findValueType(value) && complex.test(target) && (value = getAnimatableNone(key2, target)), this.setBaseTarget(key2, isMotionValue(value) ? value.get() : value)), isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key2, value) {
    this.baseTarget[key2] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key2) {
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial == "string" || typeof initial == "object") {
      const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
      variant && (valueFromInitial = variant[key2]);
    }
    if (initial && valueFromInitial !== void 0)
      return valueFromInitial;
    const target = this.getBaseTargetFromProps(this.props, key2);
    return target !== void 0 && !isMotionValue(target) ? target : this.initialValues[key2] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key2];
  }
  on(eventName, callback) {
    return this.events[eventName] || (this.events[eventName] = new SubscriptionManager()), this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    this.events[eventName] && this.events[eventName].notify(...args);
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments), this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key2) {
    return props.style ? props.style[key2] : void 0;
  }
  removeValueFromRenderState(key2, { vars, style }) {
    delete vars[key2], delete style[key2];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children } = this.props;
    isMotionValue(children) && (this.childSubscription = children.on("change", (latest) => {
      this.current && (this.current.textContent = `${latest}`);
    }));
  }
}
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key2;
  for (key2 in style)
    elementStyle[key2] = style[key2];
  projection?.applyProjectionStyles(elementStyle, styleProp);
  for (key2 in vars)
    elementStyle.setProperty(key2, vars[key2]);
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key2) {
    if (transformProps.has(key2))
      return this.projection?.isProjecting ? defaultTransformValue(key2) : readTransformValue(instance, key2);
    {
      const computedStyle = getComputedStyle$1(instance), value = (isCSSVariableName(key2) ? computedStyle.getPropertyValue(key2) : computedStyle[key2]) || 0;
      return typeof value == "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key2 in renderState.attrs)
    element.setAttribute(camelCaseAttributes.has(key2) ? key2 : camelToDash(key2), renderState.attrs[key2]);
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key2) {
    return props[key2];
  }
  readValueFromInstance(instance, key2) {
    if (transformProps.has(key2)) {
      const defaultType = getDefaultValueType(key2);
      return defaultType && defaultType.default || 0;
    }
    return key2 = camelCaseAttributes.has(key2) ? key2 : camelToDash(key2), instance.getAttribute(key2);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName), super.mount(instance);
  }
}
const createDomVisualElement = (Component2, options) => isSVGComponent(Component2) ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
  allowProjection: Component2 !== Fragment$1
});
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
const isKeyframesTarget = (v) => Array.isArray(v);
function setMotionValue(visualElement, key2, value) {
  visualElement.hasValue(key2) ? visualElement.getValue(key2).set(value) : visualElement.addValue(key2, motionValue(value));
}
function resolveFinalValueInKeyframes(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key2 in target) {
    const value = resolveFinalValueInKeyframes(target[key2]);
    setMotionValue(visualElement, key2, value);
  }
}
function isWillChangeMotionValue(value) {
  return !!(isMotionValue(value) && value.add);
}
function addValueToWillChange(visualElement, key2) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange))
    return willChange.add(key2);
  if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange), newWillChange.add(key2);
  }
}
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
  const resolvedKeyframes = keyframes2.filter(isNotNull), index2 = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
  return resolvedKeyframes[index2];
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), keyframesTransition = {
  type: "keyframes",
  duration: 0.8
}, ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => keyframes2.length > 2 ? keyframesTransition : transformProps.has(valueKey) ? valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring : ease;
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
  return !!Object.keys(transition).length;
}
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {}, delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v), valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete(), valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  isTransitionDefined(valueTransition) || Object.assign(options, getDefaultTransition(name, options)), options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration)), options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay)), options.from !== void 0 && (options.keyframes[0] = options.from);
  let shouldSkip = !1;
  if ((options.type === !1 || options.duration === 0 && !options.repeatDelay) && (makeAnimationInstant(options), options.delay === 0 && (shouldSkip = !0)), (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations) && (shouldSkip = !0, makeAnimationInstant(options), options.delay = 0), options.allowFlatten = !valueTransition.type && !valueTransition.ease, shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe), options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key2) {
  const shouldBlock = protectedKeys.hasOwnProperty(key2) && needsAnimating[key2] !== !0;
  return needsAnimating[key2] = !1, shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
  transitionOverride && (transition = transitionOverride);
  const animations2 = [], animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key2 in target) {
    const value = visualElement.getValue(key2, visualElement.latestValues[key2] ?? null), valueTarget = target[key2];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key2))
      continue;
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key2)
    }, currentValue = value.get();
    if (currentValue !== void 0 && !value.isAnimating && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity)
      continue;
    let isHandoff = !1;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key2, frame);
        startTime !== null && (valueTransition.startTime = startTime, isHandoff = !0);
      }
    }
    addValueToWillChange(visualElement, key2), value.start(animateMotionValue(key2, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key2) ? { type: !1 } : valueTransition, visualElement, isHandoff));
    const animation2 = value.animation;
    animation2 && animations2.push(animation2);
  }
  return transitionEnd && Promise.all(animations2).then(() => {
    frame.update(() => {
      transitionEnd && setTarget(visualElement, transitionEnd);
    });
  }), animations2;
}
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index2 = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child), numChildren = children.size, maxStaggerDuration = (numChildren - 1) * staggerChildren;
  return typeof delayChildren == "function" ? delayChildren(index2, numChildren) : staggerDirection === 1 ? index2 * staggerChildren : maxStaggerDuration - index2 * staggerChildren;
}
function animateVariant(visualElement, variant, options = {}) {
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  options.transitionOverride && (transition = options.transitionOverride);
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve(), getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve(), { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
}
function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  for (const child of visualElement.variantChildren)
    child.notify("AnimationStart", variant), animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delay2 + (typeof delayChildren == "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  return Promise.all(animations2);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation2;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation2 = Promise.all(animations2);
  } else if (typeof definition == "string")
    animation2 = animateVariant(visualElement, definition, options);
  else {
    const resolvedDefinition = typeof definition == "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation2 = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation2.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return !1;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return !1;
  for (let i = 0; i < prevLength; i++)
    if (prev[i] !== next[i])
      return !1;
  return !0;
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return;
  if (!visualElement.isControllingVariants) {
    const context3 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    return visualElement.props.initial !== void 0 && (context3.initial = visualElement.props.initial), context3;
  }
  const context2 = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i], prop = visualElement.props[name];
    (isVariantLabel(prop) || prop === !1) && (context2[name] = prop);
  }
  return context2;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse(), numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
  return (animations2) => Promise.all(animations2.map(({ animation: animation2, options }) => animateVisualElement(visualElement, animation2, options)));
}
function createAnimationState(visualElement) {
  let animate = animateList(visualElement), state = createState(), isInitialRender = !0;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement, context2 = getVariantContext(visualElement.parent) || {}, animations2 = [], removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {}, removedVariantIndex = 1 / 0;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i], typeState = state[type], prop = props[type] !== void 0 ? props[type] : context2[type], propIsVariant = isVariantLabel(prop), activeDelta = type === changedActiveType ? typeState.isActive : null;
      activeDelta === !1 && (removedVariantIndex = i);
      let isInherited = prop === context2[type] && prop !== props[type] && propIsVariant;
      if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount && (isInherited = !1), typeState.protectedKeys = { ...encounteredKeys }, // If it isn't active and hasn't *just* been set as inactive
      !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
      !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
      isAnimationControls(prop) || typeof prop == "boolean")
        continue;
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant, handledRemovedValues = !1;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      activeDelta === !1 && (resolvedValues = {});
      const { prevResolvedValues = {} } = typeState, allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      }, markToAnimate = (key2) => {
        shouldAnimateType = !0, removedKeys.has(key2) && (handledRemovedValues = !0, removedKeys.delete(key2)), typeState.needsAnimating[key2] = !0;
        const motionValue2 = visualElement.getValue(key2);
        motionValue2 && (motionValue2.liveStyle = !1);
      };
      for (const key2 in allKeys) {
        const next = resolvedValues[key2], prev = prevResolvedValues[key2];
        if (encounteredKeys.hasOwnProperty(key2))
          continue;
        let valueHasChanged = !1;
        isKeyframesTarget(next) && isKeyframesTarget(prev) ? valueHasChanged = !shallowCompare(next, prev) : valueHasChanged = next !== prev, valueHasChanged ? next != null ? markToAnimate(key2) : removedKeys.add(key2) : next !== void 0 && removedKeys.has(key2) ? markToAnimate(key2) : typeState.protectedKeys[key2] = !0;
      }
      typeState.prevProp = prop, typeState.prevResolvedValues = resolvedValues, typeState.isActive && (encounteredKeys = { ...encounteredKeys, ...resolvedValues }), isInitialRender && visualElement.blockInitialAnimation && (shouldAnimateType = !1);
      const willAnimateViaParent = isInherited && variantDidChange;
      shouldAnimateType && (!willAnimateViaParent || handledRemovedValues) && animations2.push(...definitionList.map((animation2) => {
        const options = { type };
        if (typeof animation2 == "string" && isInitialRender && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
          const { parent } = visualElement, parentVariant = resolveVariant(parent, animation2);
          if (parent.enteringChildren && parentVariant) {
            const { delayChildren } = parentVariant.transition || {};
            options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
          }
        }
        return {
          animation: animation2,
          options
        };
      }));
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial != "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        initialTransition && initialTransition.transition && (fallbackAnimation.transition = initialTransition.transition);
      }
      removedKeys.forEach((key2) => {
        const fallbackTarget = visualElement.getBaseTarget(key2), motionValue2 = visualElement.getValue(key2);
        motionValue2 && (motionValue2.liveStyle = !0), fallbackAnimation[key2] = fallbackTarget ?? null;
      }), animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = !!animations2.length;
    return isInitialRender && (props.initial === !1 || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount && (shouldAnimate = !1), isInitialRender = !1, shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    if (state[type].isActive === isActive)
      return Promise.resolve();
    visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive)), state[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key2 in state)
      state[key2].protectedKeys = {};
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
    }
  };
}
function checkVariantsDidChange(prev, next) {
  return typeof next == "string" ? next !== prev : Array.isArray(next) ? !shallowCompare(next, prev) : !1;
}
function createTypeState(isActive = !1) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(!0),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
class Feature {
  constructor(node) {
    this.isMounted = !1, this.node = node;
  }
  update() {
  }
}
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node), node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    isAnimationControls(animate) && (this.unmountControls = animate.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps(), { animate: prevAnimate } = this.node.prevProps || {};
    animate !== prevAnimate && this.updateAnimationControlsSubscription();
  }
  unmount() {
    this.node.animationState.reset(), this.unmountControls?.();
  }
}
let id$1 = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments), this.id = id$1++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext, { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent)
      return;
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    onExitComplete && !isPresent && exitAnimation.then(() => {
      onExitComplete(this.id);
    });
  }
  mount() {
    const { register, onExitComplete } = this.node.presenceContext || {};
    onExitComplete && onExitComplete(this.id), register && (this.unmount = register(this.id));
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
function addDomEvent(target, eventName, handler, options = { passive: !0 }) {
  return target.addEventListener(eventName, handler, options), () => target.removeEventListener(eventName, handler);
}
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const SCALE_PRECISION = 1e-4, SCALE_MIN = 1 - SCALE_PRECISION, SCALE_MAX = 1 + SCALE_PRECISION, TRANSLATE_PRECISION = 0.01, TRANSLATE_MIN = 0 - TRANSLATE_PRECISION, TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin2 = 0.5) {
  delta.origin = origin2, delta.originPoint = mixNumber$1(source.min, source.max, delta.origin), delta.scale = calcLength(target) / calcLength(source), delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint, (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) && (delta.scale = 1), (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) && (delta.translate = 0);
}
function calcBoxDelta(delta, source, target, origin2) {
  calcAxisDelta(delta.x, source.x, target.x, origin2 ? origin2.originX : void 0), calcAxisDelta(delta.y, source.y, target.y, origin2 ? origin2.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
  target.min = parent.min + relative.min, target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
  calcRelativeAxis(target.x, relative.x, parent.x), calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout2, parent) {
  target.min = layout2.min - parent.min, target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x), calcRelativeAxisPosition(target.y, layout2.y, parent.y);
}
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
const getContextWindow = ({ current }) => current ? current.ownerDocument.defaultView : null, distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x), yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = !1, distanceThreshold = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history), isPanStarted = this.startEvent !== null, isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2, { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      isPanStarted || (onStart && onStart(this.lastMoveEvent, info2), this.startEvent = this.lastMoveEvent), onMove && onMove(this.lastMoveEvent, info2);
    }, this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2, this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint), frame.update(this.updatePoint, !0);
    }, this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin && resumeAnimation && resumeAnimation(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      this.startEvent && onEnd && onEnd(event2, panInfo), onSessionEnd && onSessionEnd(event2, panInfo);
    }, !isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin, this.handlers = handlers, this.transformPagePoint = transformPagePoint, this.distanceThreshold = distanceThreshold, this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event), initialInfo = transformPoint(info, this.transformPagePoint), { point } = initialInfo, { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history)), this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners(), cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2)
    return { x: 0, y: 0 };
  let i = history.length - 1, timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  for (; i >= 0 && (timestampedPoint = history[i], !(lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta))); )
    i--;
  if (!timestampedPoint)
    return { x: 0, y: 0 };
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0)
    return { x: 0, y: 0 };
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  return currentVelocity.x === 1 / 0 && (currentVelocity.x = 0), currentVelocity.y === 1 / 0 && (currentVelocity.y = 0), currentVelocity;
}
function applyConstraints(point, { min: min2, max: max2 }, elastic) {
  return min2 !== void 0 && point < min2 ? point = elastic ? mixNumber$1(min2, point, elastic.min) : Math.max(point, min2) : max2 !== void 0 && point > max2 && (point = elastic ? mixNumber$1(max2, point, elastic.max) : Math.min(point, max2)), point;
}
function calcRelativeAxisConstraints(axis, min2, max2) {
  return {
    min: min2 !== void 0 ? axis.min + min2 : void 0,
    max: max2 !== void 0 ? axis.max + max2 - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min2 = constraintsAxis.min - layoutAxis.min, max2 = constraintsAxis.max - layoutAxis.max;
  return constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min && ([min2, max2] = [max2, min2]), { min: min2, max: max2 };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin2 = 0.5;
  const sourceLength = calcLength(source), targetLength = calcLength(target);
  return targetLength > sourceLength ? origin2 = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min) : sourceLength > targetLength && (origin2 = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min)), clamp$1(0, 1, origin2);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  return constraints.min !== void 0 && (relativeConstraints.min = constraints.min - layout2.min), constraints.max !== void 0 && (relativeConstraints.max = constraints.max - layout2.min), relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  return dragElastic === !1 ? dragElastic = 0 : dragElastic === !0 && (dragElastic = defaultElastic), {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic == "number" ? dragElastic : dragElastic[label] || 0;
}
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = createBox(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = !1, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === !1)
      return;
    const onSessionStart = (event) => {
      const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
      dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation(), snapToCursor && this.snapToCursor(extractEventInfo(event).point);
    }, onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation && (this.openDragLock && this.openDragLock(), this.openDragLock = setDragLock(drag2), !this.openDragLock))
        return;
      this.latestPointerEvent = event, this.latestPanInfo = info, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            measuredAxis && (current = calcLength(measuredAxis) * (parseFloat(current) / 100));
          }
        }
        this.originPoint[axis] = current;
      }), onDragStart && frame.postRender(() => onDragStart(event, info)), addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", !0);
    }, onMove = (event, info) => {
      this.latestPointerEvent = event, this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset: offset2 } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset2), this.currentDirection !== null && onDirectionLock && onDirectionLock(this.currentDirection);
        return;
      }
      this.updateAxis("x", info.point, offset2), this.updateAxis("y", info.point, offset2), this.visualElement.render(), onDrag && onDrag(event, info);
    }, onSessionEnd = (event, info) => {
      this.latestPointerEvent = event, this.latestPanInfo = info, this.stop(event, info), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, resumeAnimation = () => eachAxis((axis) => this.getAnimationState(axis) === "paused" && this.getAxisMotionValue(axis).animation?.play()), { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent, finalPanInfo = panInfo || this.latestPanInfo, isDragging2 = this.isDragging;
    if (this.cancel(), !isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    onDragEnd && frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection, animationState } = this.visualElement;
    projection && (projection.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation } = this.getProps();
    !dragPropagation && this.openDragLock && (this.openDragLock(), this.openDragLock = null), animationState && animationState.setActive("whileDrag", !1);
  }
  updateAxis(axis, _point, offset2) {
    const { drag: drag2 } = this.getProps();
    if (!offset2 || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset2[axis];
    this.constraints && this.constraints[axis] && (next = applyConstraints(next, this.constraints[axis], this.elastic[axis])), axisValue.set(next);
  }
  resolveConstraints() {
    const { dragConstraints, dragElastic } = this.getProps(), layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, prevConstraints = this.constraints;
    dragConstraints && isRefObject(dragConstraints) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : dragConstraints && layout2 ? this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints) : this.constraints = !1, this.elastic = resolveDragElastic(dragElastic), prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints && eachAxis((axis) => {
      this.constraints !== !1 && this.getAxisMotionValue(axis) && (this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return !1;
    const constraintsElement = constraints.current;
    invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return !1;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints, userConstraints && (measuredConstraints = convertBoundingBoxToBox(userConstraints));
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps(), constraints = this.constraints || {}, momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      let transition = constraints && constraints[axis] || {};
      dragSnapToOrigin && (transition = { min: 0, max: 0 });
      const bounceStiffness = dragElastic ? 200 : 1e6, bounceDamping = dragElastic ? 40 : 1e7, inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    return addValueToWillChange(this.visualElement, axis), axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, !1));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  pauseAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
  }
  getAnimationState(axis) {
    return this.getAxisMotionValue(axis).animation?.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`, props = this.visualElement.getProps(), externalMotionValue = props[dragKey];
    return externalMotionValue || this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement, axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min: min2, max: max2 } = projection.layout.layoutBox[axis];
        axisValue.set(point[axis] - mixNumber$1(min2, max2, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps(), { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== !1) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none", projection.root && projection.root.updateScroll(), projection.updateLayout(), this.resolveConstraints(), eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis), { min: min2, max: max2 } = this.constraints[axis];
      axisValue.set(mixNumber$1(min2, max2, boxProgress[axis]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current, stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = !0 } = this.getProps();
      drag2 && dragListener && this.start(event);
    }), measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      isRefObject(dragConstraints) && dragConstraints.current && (this.constraints = this.resolveRefConstraints());
    }, { projection } = this.visualElement, stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    projection && !projection.layout && (projection.root && projection.root.updateScroll(), projection.updateLayout()), frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints()), stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
      this.isDragging && hasLayoutChanged && (eachAxis((axis) => {
        const motionValue2 = this.getAxisMotionValue(axis);
        motionValue2 && (this.originPoint[axis] += delta[axis].translate, motionValue2.set(motionValue2.get() + delta[axis].translate));
      }), this.visualElement.render());
    }));
    return () => {
      stopResizeListener(), stopPointerListener(), stopMeasureLayoutListener(), stopLayoutUpdateListener && stopLayoutUpdateListener();
    };
  }
  getProps() {
    const props = this.visualElement.getProps(), { drag: drag2 = !1, dragDirectionLock = !1, dragPropagation = !1, dragConstraints = !1, dragElastic = defaultElastic, dragMomentum = !0 } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === !0 || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset2, lockThreshold = 10) {
  let direction = null;
  return Math.abs(offset2.y) > lockThreshold ? direction = "y" : Math.abs(offset2.x) > lockThreshold && (direction = "x"), direction;
}
class DragGesture extends Feature {
  constructor(node) {
    super(node), this.removeGroupControls = noop2, this.removeListeners = noop2, this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    dragControls && (this.removeGroupControls = dragControls.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || noop2;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const asyncHandler = (handler) => (event, info) => {
  handler && frame.postRender(() => handler(event, info));
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments), this.removePointerDownListener = noop2;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: onPan,
      onEnd: (event, info) => {
        delete this.session, onPanEnd && frame.postRender(() => onPanEnd(event, info));
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
let hasTakenAnySnapshot = !1;
class MeasureLayoutWithContext extends Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props, { projection } = visualElement;
    projection && (layoutGroup.group && layoutGroup.group.add(projection), switchLayoutGroup && switchLayoutGroup.register && layoutId && switchLayoutGroup.register(projection), hasTakenAnySnapshot && projection.root.didUpdate(), projection.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), projection.setOptions({
      ...projection.options,
      onExitComplete: () => this.safeToRemove()
    })), globalProjectionState.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props, { projection } = visualElement;
    return projection && (projection.isPresent = isPresent, hasTakenAnySnapshot = !0, drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent ? projection.willUpdate() : this.safeToRemove(), prevProps.isPresent !== isPresent && (isPresent ? projection.promote() : projection.relegate() || frame.postRender(() => {
      const stack = projection.getStack();
      (!stack || !stack.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection } = this.props.visualElement;
    projection && (projection.root.didUpdate(), microtask.postRender(() => {
      !projection.currentAnimation && projection.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props, { projection } = visualElement;
    hasTakenAnySnapshot = !0, projection && (projection.scheduleCheckAfterUnmount(), layoutGroup && layoutGroup.group && layoutGroup.group.remove(projection), promoteContext && promoteContext.deregister && promoteContext.deregister(projection));
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence(), layoutGroup = useContext(LayoutGroupContext);
  return jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  return motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options)), motionValue$1.animation;
}
const compareByDepth = (a, b) => a.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(child) {
    addUniqueItem(this.children, child), this.isDirty = !0;
  }
  remove(child) {
    removeItem(this.children, child), this.isDirty = !0;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth), this.isDirty = !1, this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time$1.now(), checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    elapsed >= timeout && (cancelFrame(checkElapsed), callback(elapsed - timeout));
  };
  return frame.setup(checkElapsed, !0), () => cancelFrame(checkElapsed);
}
const borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], numBorders = borders.length, asNumber = (value) => typeof value == "string" ? parseFloat(value) : value, isPx = (value) => typeof value == "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  shouldCrossfadeOpacity ? (target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2)), target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2))) : isOnlyMember && (target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2));
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = `border${borders[i]}Radius`;
    let followRadius = getRadius(follow, borderLabel), leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0), leadRadius || (leadRadius = 0), followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius) ? (target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0), (percent.test(leadRadius) || percent.test(followRadius)) && (target[borderLabel] += "%")) : target[borderLabel] = leadRadius;
  }
  (follow.rotate || lead.rotate) && (target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2));
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut), easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop2);
function compress(min2, max2, easing) {
  return (p) => p < min2 ? 0 : p > max2 ? 1 : easing(/* @__PURE__ */ progress(min2, max2, p));
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min, axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x), copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate, delta.scale = originDelta.scale, delta.originPoint = originDelta.originPoint, delta.origin = originDelta.origin;
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  return point -= translate, point = scalePoint(point, 1 / scale2, originPoint), boxScale !== void 0 && (point = scalePoint(point, 1 / boxScale, originPoint)), point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin2 = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate) && (translate = parseFloat(translate), translate = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100) - sourceAxis.min), typeof translate != "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin2);
  axis === originAxis && (originPoint -= translate), axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale), axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key2, scaleKey, originKey], origin2, sourceAxis) {
  removeAxisDelta(axis, transforms[key2], transforms[scaleKey], transforms[originKey], transforms.scale, origin2, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"], yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0), removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node), node.scheduleRender();
  }
  remove(node) {
    if (removeItem(this.members, node), node === this.prevLead && (this.prevLead = void 0), node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      prevLead && this.promote(prevLead);
    }
  }
  relegate(node) {
    const indexOfNode = this.members.findIndex((member) => node === member);
    if (indexOfNode === 0)
      return !1;
    let prevLead;
    for (let i = indexOfNode; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== !1) {
        prevLead = member;
        break;
      }
    }
    return prevLead ? (this.promote(prevLead), !0) : !1;
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node !== prevLead && (this.prevLead = prevLead, this.lead = node, node.show(), prevLead)) {
      prevLead.instance && prevLead.scheduleRender(), node.scheduleRender(), node.resumeFrom = prevLead, preserveFollowOpacity && (node.resumeFrom.preserveOpacity = !0), prevLead.snapshot && (node.snapshot = prevLead.snapshot, node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues), node.root && node.root.isUpdating && (node.isLayoutDirty = !0);
      const { crossfade } = node.options;
      crossfade === !1 && prevLead.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((node) => {
      const { options, resumingFrom } = node;
      options.onExitComplete && options.onExitComplete(), resumingFrom && resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((node) => {
      node.instance && node.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  const xTranslate = delta.x.translate / treeScale.x, yTranslate = delta.y.translate / treeScale.y, zTranslate = latestTransform?.z || 0;
  if ((xTranslate || yTranslate || zTranslate) && (transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `), (treeScale.x !== 1 || treeScale.y !== 1) && (transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `), latestTransform) {
    const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
    transformPerspective && (transform = `perspective(${transformPerspective}px) ${transform}`), rotate2 && (transform += `rotate(${rotate2}deg) `), rotateX && (transform += `rotateX(${rotateX}deg) `), rotateY && (transform += `rotateY(${rotateY}deg) `), skewX && (transform += `skewX(${skewX}deg) `), skewY && (transform += `skewY(${skewY}deg) `);
  }
  const elementScaleX = delta.x.scale * treeScale.x, elementScaleY = delta.y.scale * treeScale.y;
  return (elementScaleX !== 1 || elementScaleY !== 1) && (transform += `scale(${elementScaleX}, ${elementScaleY})`), transform || "none";
}
const transformAxes = ["", "X", "Y", "Z"], animationTarget = 1e3;
let id = 0;
function resetDistortingTransform(key2, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  latestValues[key2] && (values[key2] = latestValues[key2], visualElement.setStaticValue(key2, 0), sharedAnimationValues && (sharedAnimationValues[key2] = 0));
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  if (projectionNode.hasCheckedOptimisedAppear = !0, projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  parent && !parent.hasCheckedOptimisedAppear && cancelTreeOptimisedTransformAnimations(parent);
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class {
    constructor(latestValues = {}, parent = defaultParent?.()) {
      this.id = id++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(propagateDirtyNodes), this.nodes.forEach(resolveTargetDelta), this.nodes.forEach(calcProjection), this.nodes.forEach(cleanDirtyNodes);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = latestValues, this.root = parent ? parent.root || parent : this, this.path = parent ? [...parent.path, parent] : [], this.parent = parent, this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++)
        this.path[i].shouldResetTransform = !0;
      this.root === this && (this.nodes = new FlatTree());
    }
    addEventListener(name, handler) {
      return this.eventHandlers.has(name) || this.eventHandlers.set(name, new SubscriptionManager()), this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance), this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current && visualElement.mount(instance), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (layout2 || layoutId) && (this.isLayoutDirty = !0), attachResizeListener) {
        let cancelDelay, innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = !1;
        frame.read(() => {
          innerWidth = window.innerWidth;
        }), attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          newInnerWidth !== innerWidth && (innerWidth = newInnerWidth, this.root.updateBlockedByResize = !0, cancelDelay && cancelDelay(), cancelDelay = delay(resizeUnblockUpdate, 250), globalProjectionState.hasAnimatedSinceResize && (globalProjectionState.hasAnimatedSinceResize = !1, this.nodes.forEach(finishAnimation)));
        });
      }
      layoutId && this.root.registerSharedNode(layoutId, this), this.options.animate !== !1 && visualElement && (layoutId || layout2) && this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition, { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps(), hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout), hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
        if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const animationOptions = {
            ...getValueTransition(layoutTransition, "layout"),
            onPlay: onLayoutAnimationStart,
            onComplete: onLayoutAnimationComplete
          };
          (visualElement.shouldReduceMotion || this.options.layoutRoot) && (animationOptions.delay = 0, animationOptions.type = !1), this.startAnimation(animationOptions), this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
        } else
          hasLayoutChanged || finishAnimation(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = newLayout;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(resetSkewAndRotation), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && cancelTreeOptimisedTransformAnimations(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = !0, node.updateScroll("snapshot"), node.options.layoutRoot && node.willUpdate(!1);
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0, this.updateSnapshot(), shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(resetTransformStyle), this.nodes.forEach(updateLayout), this.nodes.forEach(notifyLayoutUpdate)) : this.nodes.forEach(clearIsLayoutDirty), this.clearAllSnapshots();
      const now2 = time$1.now();
      frameData.delta = clamp$1(0, 1e3 / 60, now2 - frameData.timestamp), frameData.timestamp = now2, frameData.isProcessing = !0, frameSteps.update.process(frameData), frameSteps.preRender.process(frameData), frameSteps.render.process(frameData), frameData.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, microtask.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot), this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, frame.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let i = 0; i < this.path.length; i++)
          this.path[i].updateScroll();
      const prevLayout = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected = createBox(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase && (needsMeasurement = !1), needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta), transformTemplate = this.getTransformTemplate(), transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0, transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged) && (resetTransform(this.instance, transformTemplateValue), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(removeTransform = !0) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      return removeTransform && (layoutBox = this.removeTransform(layoutBox)), roundBox(layoutBox), {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot))) {
        const { scroll } = this.root;
        scroll && (translateAxis(box.x, scroll.offset.x), translateAxis(box.y, scroll.offset.y));
      }
      return box;
    }
    removeElementScroll(box) {
      const boxWithoutScroll = createBox();
      if (copyBoxInto(boxWithoutScroll, box), this.scroll?.wasRoot)
        return boxWithoutScroll;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i], { scroll, options } = node;
        node !== this.root && scroll && options.layoutScroll && (scroll.wasRoot && copyBoxInto(boxWithoutScroll, box), translateAxis(boxWithoutScroll.x, scroll.offset.x), translateAxis(boxWithoutScroll.y, scroll.offset.y));
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = !1) {
      const withTransforms = createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        !transformOnly && node.options.layoutScroll && node.scroll && node !== node.root && transformBox(withTransforms, {
          x: -node.scroll.offset.x,
          y: -node.scroll.offset.y
        }), hasTransform(node.latestValues) && transformBox(withTransforms, node.latestValues);
      }
      return hasTransform(this.latestValues) && transformBox(withTransforms, this.latestValues), withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!node.instance || !hasTransform(node.latestValues))
          continue;
        hasScale(node.latestValues) && node.updateSnapshot();
        const sourceBox = createBox(), nodeBox = node.measurePageBox();
        copyBoxInto(sourceBox, nodeBox), removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
      }
      return hasTransform(this.latestValues) && removeBoxTransforms(boxWithoutTransform, this.latestValues), boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(forceRecalculation = !1) {
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = !!this.resumingFrom || this !== lead;
      if (!(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      const relativeParent = this.getClosestProjectingParent();
      relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (relativeParent && relativeParent.layout ? this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = createBox(), this.targetWithTransforms = createBox()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : copyBoxInto(this.target, this.layout.layoutBox), applyBoxDelta(this.target, this.targetDelta)) : copyBoxInto(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, relativeParent && !!relativeParent.resumingFrom == !!this.resumingFrom && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1 ? this.createRelativeTarget(relativeParent, this.target, relativeParent.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(relativeParent, layout2, parentLayout) {
      this.relativeParent = relativeParent, this.linkedParentVersion = relativeParent.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = createBox(), this.relativeTargetOrigin = createBox(), calcRelativePosition(this.relativeTargetOrigin, layout2, parentLayout), copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const lead = this.getLead(), isShared = !!this.resumingFrom || this !== lead;
      let canSkip = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (canSkip = !1), isShared && (this.isSharedProjectionDirty || this.isTransformDirty) && (canSkip = !1), this.resolvedRelativeTargetAt === frameData.timestamp && (canSkip = !1), canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x, prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared), lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (lead.target = lead.layout.layoutBox, lead.targetWithTransforms = createBox());
      const { target } = lead;
      if (!target) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x), copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y)), calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues), (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", target));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(notifyAll = !0) {
      if (this.options.visualElement?.scheduleRender(), notifyAll) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta(), this.projectionDelta = createDelta(), this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = !1) {
      const snapshot = this.snapshot, snapshotLatestValues = snapshot ? snapshot.latestValues : {}, mixedValues = { ...this.latestValues }, targetDelta = createDelta();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox(), snapshotSource = snapshot ? snapshot.source : void 0, layoutSource = this.layout ? this.layout.source : void 0, isSharedLayoutAnimation = snapshotSource !== layoutSource, stack = this.getStack(), isOnlyMember = !stack || stack.members.length <= 1, shouldCrossfadeOpacity = !!(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === !0 && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2), mixAxisDelta(targetDelta.y, delta.y, progress2), this.setTargetDelta(targetDelta), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox), mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2), prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget) && (this.isProjectionDirty = !1), prevRelativeTarget || (prevRelativeTarget = createBox()), copyBoxInto(prevRelativeTarget, this.relativeTarget)), isSharedLayoutAnimation && (this.animationValues = mixedValues, mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = progress2;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (cancelFrame(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = motionValue(0)), this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
          ...options,
          velocity: 0,
          isSync: !0,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest), options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
          },
          onComplete: () => {
            options.onComplete && options.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const stack = this.getStack();
      stack && stack.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(animationTarget), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!(!targetWithTransforms || !target || !layout2)) {
        if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
          target = this.target || createBox();
          const xLength = calcLength(this.layout.layoutBox.x);
          target.x.min = lead.target.x.min, target.x.max = target.x.min + xLength;
          const yLength = calcLength(this.layout.layoutBox.y);
          target.y.min = lead.target.y.min, target.y.max = target.y.min + yLength;
        }
        copyBoxInto(targetWithTransforms, target), transformBox(targetWithTransforms, latestValues), calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
      }
    }
    registerSharedNode(layoutId, node) {
      this.sharedNodes.has(layoutId) || this.sharedNodes.set(layoutId, new NodeStack()), this.sharedNodes.get(layoutId).add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : !0;
    }
    getLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      stack && stack.promote(this, preserveFollowOpacity), needsReset && (this.projectionDelta = void 0, this.needsReset = !0), transition && this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      return stack ? stack.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = !1;
      const { latestValues } = visualElement;
      if ((latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) && (hasDistortingTransform = !0), !hasDistortingTransform)
        return;
      const resetValues = {};
      latestValues.z && resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      for (let i = 0; i < transformAxes.length; i++)
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues), resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      visualElement.render();
      for (const key2 in resetValues)
        visualElement.setStaticValue(key2, resetValues[key2]), this.animationValues && (this.animationValues[key2] = resetValues[key2]);
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, targetStyle.visibility = "", targetStyle.opacity = "", targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "", targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        this.options.layoutId && (targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || ""), this.hasProjected && !hasTransform(this.latestValues) && (targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none", this.hasProjected = !1);
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      transformTemplate && (transform = transformTemplate(valuesToRender, transform)), targetStyle.transform = transform;
      const { x, y } = this.projectionDelta;
      targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`, lead.animationValues ? targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit : targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      for (const key2 in scaleCorrectors) {
        if (valuesToRender[key2] === void 0)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key2], corrected = transform === "none" ? valuesToRender[key2] : correct(valuesToRender[key2], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0; i < num; i++)
            targetStyle[applyTo[i]] = corrected;
        } else
          isCSSVariable ? this.options.visualElement.renderState.vars[key2] = corrected : targetStyle[key2] = corrected;
      }
      this.options.layoutId && (targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => node.currentAnimation?.stop()), this.root.nodes.forEach(clearMeasurements), this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  const snapshot = node.resumeFrom?.snapshot || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout, { animationType } = node.options, isShared = snapshot.source !== node.layout.source;
    animationType === "size" ? eachAxis((axis) => {
      const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis], length = calcLength(axisSnapshot);
      axisSnapshot.min = layout2[axis].min, axisSnapshot.max = axisSnapshot.min + length;
    }) : shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2) && eachAxis((axis) => {
      const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis], length = calcLength(layout2[axis]);
      axisSnapshot.max = axisSnapshot.min + length, node.relativeTarget && !node.currentAnimation && (node.isProjectionDirty = !0, node.relativeTarget[axis].max = node.relativeTarget[axis].min + length);
    });
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    isShared ? calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, !0), snapshot.measuredBox) : calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = !1;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox), boxEqualsRounded(relativeSnapshot, relativeLayout) || (hasRelativeLayoutChanged = !0), relativeParent.options.layoutRoot && (node.relativeTarget = relativeLayout, node.relativeTargetOrigin = relativeSnapshot, node.relativeParent = relativeParent);
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  node.parent && (node.isProjecting() || (node.isProjectionDirty = node.parent.isProjectionDirty), node.isSharedProjectionDirty || (node.isSharedProjectionDirty = !!(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty)), node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty));
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = !1;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = !1;
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  visualElement && visualElement.getProps().onBeforeLayoutMeasure && visualElement.notify("BeforeLayoutMeasure"), node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation(), node.targetDelta = node.relativeTarget = node.target = void 0, node.isProjectionDirty = !0;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber$1(delta.translate, 0, p), output.scale = mixNumber$1(delta.scale, 1, p), output.origin = delta.origin, output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber$1(from.min, to.min, p), output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p), mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, userAgentContains = (string) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string), roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop2;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min), axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x), roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  return node !== node.root && node.scroll?.wasRoot;
}
const DocumentProjectionNode = createProjectionNode({
  attachResizeListener: (ref, notify2) => addDomEvent(ref, "resize", notify2),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), rootProjectionNode = {
  current: void 0
}, HTMLProjectionNode = createProjectionNode({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window), documentNode.setOptions({ layoutScroll: !0 }), rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => window.getComputedStyle(instance).position === "fixed"
}), drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  node.animationState && props.whileHover && node.animationState.setActive("whileHover", lifecycle === "Start");
  const eventName = "onHover" + lifecycle, callback = props[eventName];
  callback && frame.postRender(() => callback(event, extractEventInfo(event)));
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    current && (this.unmount = hover(current, (_element, startEvent) => (handleHoverEvent(this.node, startEvent, "Start"), (endEvent) => handleHoverEvent(this.node, endEvent, "End"))));
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let isFocusVisible = !1;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch {
      isFocusVisible = !0;
    }
    !isFocusVisible || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.current instanceof HTMLButtonElement && node.current.disabled)
    return;
  node.animationState && props.whileTap && node.animationState.setActive("whileTap", lifecycle === "Start");
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle), callback = props[eventName];
  callback && frame.postRender(() => callback(event, extractEventInfo(event)));
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    current && (this.unmount = press(current, (_element, startEvent) => (handlePressEvent(this.node, startEvent, "Start"), (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap(), observers = /* @__PURE__ */ new WeakMap(), fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
}, fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  observers.has(lookupRoot) || observers.set(lookupRoot, {});
  const rootObservers = observers.get(lookupRoot), key2 = JSON.stringify(options);
  return rootObservers[key2] || (rootObservers[key2] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options })), rootObservers[key2];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  return observerCallbacks.set(element, callback), rootInteresectionObserver.observe(element), () => {
    observerCallbacks.delete(element), rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport = {} } = this.node.getProps(), { root, margin: rootMargin, amount = "some", once } = viewport, options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount == "number" ? amount : thresholdNames[amount]
    }, onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting || (this.isInView = isIntersecting, once && !isIntersecting && this.hasEnteredView))
        return;
      isIntersecting && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", isIntersecting);
      const { onViewportEnter, onViewportLeave } = this.node.getProps(), callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    return observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props, prevProps } = this.node;
    ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps)) && this.startObserver();
  }
  unmount() {
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
}, layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
}, featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
}, motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
var resizeObservers = [], hasActiveObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.activeTargets.length > 0;
  });
}, hasSkippedObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.skippedTargets.length > 0;
  });
}, msg = "ResizeObserver loop completed with undelivered notifications.", deliverResizeLoopError = function() {
  var event;
  typeof ErrorEvent == "function" ? event = new ErrorEvent("error", {
    message: msg
  }) : (event = document.createEvent("Event"), event.initEvent("error", !1, !1), event.message = msg), window.dispatchEvent(event);
}, ResizeObserverBoxOptions;
(function(ResizeObserverBoxOptions2) {
  ResizeObserverBoxOptions2.BORDER_BOX = "border-box", ResizeObserverBoxOptions2.CONTENT_BOX = "content-box", ResizeObserverBoxOptions2.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
var freeze = function(obj) {
  return Object.freeze(obj);
}, ResizeObserverSize = /* @__PURE__ */ (function() {
  function ResizeObserverSize2(inlineSize, blockSize) {
    this.inlineSize = inlineSize, this.blockSize = blockSize, freeze(this);
  }
  return ResizeObserverSize2;
})(), DOMRectReadOnly = (function() {
  function DOMRectReadOnly2(x, y, width, height) {
    return this.x = x, this.y = y, this.width = width, this.height = height, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, freeze(this);
  }
  return DOMRectReadOnly2.prototype.toJSON = function() {
    var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
    return { x, y, top, right, bottom, left, width, height };
  }, DOMRectReadOnly2.fromRect = function(rectangle) {
    return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }, DOMRectReadOnly2;
})(), isSVG = function(target) {
  return target instanceof SVGElement && "getBBox" in target;
}, isHidden = function(target) {
  if (isSVG(target)) {
    var _a = target.getBBox(), width = _a.width, height = _a.height;
    return !width && !height;
  }
  var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target.getClientRects().length);
}, isElement = function(obj) {
  var _a;
  if (obj instanceof Element)
    return !0;
  var scope = (_a = obj?.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
  return !!(scope && obj instanceof scope.Element);
}, isReplacedElement = function(target) {
  switch (target.tagName) {
    case "INPUT":
      if (target.type !== "image")
        break;
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return !0;
  }
  return !1;
}, global$1 = typeof window < "u" ? window : {}, cache = /* @__PURE__ */ new WeakMap(), scrollRegexp = /auto|scroll/, verticalRegexp = /^tb|vertical/, IE = /msie|trident/i.test(global$1.navigator && global$1.navigator.userAgent), parseDimension = function(pixel) {
  return parseFloat(pixel || "0");
}, size$1 = function(inlineSize, blockSize, switchSizes) {
  return inlineSize === void 0 && (inlineSize = 0), blockSize === void 0 && (blockSize = 0), switchSizes === void 0 && (switchSizes = !1), new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
}, zeroBoxes = freeze({
  devicePixelContentBoxSize: size$1(),
  borderBoxSize: size$1(),
  contentBoxSize: size$1(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
}), calculateBoxSizes = function(target, forceRecalculation) {
  if (forceRecalculation === void 0 && (forceRecalculation = !1), cache.has(target) && !forceRecalculation)
    return cache.get(target);
  if (isHidden(target))
    return cache.set(target, zeroBoxes), zeroBoxes;
  var cs = getComputedStyle(target), svg = isSVG(target) && target.ownerSVGElement && target.getBBox(), removePadding = !IE && cs.boxSizing === "border-box", switchSizes = verticalRegexp.test(cs.writingMode || ""), canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || ""), canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || ""), paddingTop = svg ? 0 : parseDimension(cs.paddingTop), paddingRight = svg ? 0 : parseDimension(cs.paddingRight), paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom), paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft), borderTop2 = svg ? 0 : parseDimension(cs.borderTopWidth), borderRight2 = svg ? 0 : parseDimension(cs.borderRightWidth), borderBottom2 = svg ? 0 : parseDimension(cs.borderBottomWidth), borderLeft2 = svg ? 0 : parseDimension(cs.borderLeftWidth), horizontalPadding = paddingLeft + paddingRight, verticalPadding = paddingTop + paddingBottom, horizontalBorderArea = borderLeft2 + borderRight2, verticalBorderArea = borderTop2 + borderBottom2, horizontalScrollbarThickness = canScrollHorizontally ? target.offsetHeight - verticalBorderArea - target.clientHeight : 0, verticalScrollbarThickness = canScrollVertically ? target.offsetWidth - horizontalBorderArea - target.clientWidth : 0, widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0, heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0, contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness, contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness, borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea, borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea, boxes = freeze({
    devicePixelContentBoxSize: size$1(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size$1(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size$1(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  return cache.set(target, boxes), boxes;
}, calculateBoxSize = function(target, observedBox, forceRecalculation) {
  var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
}, ResizeObserverEntry = /* @__PURE__ */ (function() {
  function ResizeObserverEntry2(target) {
    var boxes = calculateBoxSizes(target);
    this.target = target, this.contentRect = boxes.contentRect, this.borderBoxSize = freeze([boxes.borderBoxSize]), this.contentBoxSize = freeze([boxes.contentBoxSize]), this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
  }
  return ResizeObserverEntry2;
})(), calculateDepthForNode = function(node) {
  if (isHidden(node))
    return 1 / 0;
  for (var depth = 0, parent = node.parentNode; parent; )
    depth += 1, parent = parent.parentNode;
  return depth;
}, broadcastActiveObservations = function() {
  var shallowestDepth = 1 / 0, callbacks2 = [];
  resizeObservers.forEach(function(ro) {
    if (ro.activeTargets.length !== 0) {
      var entries = [];
      ro.activeTargets.forEach(function(ot) {
        var entry = new ResizeObserverEntry(ot.target), targetDepth = calculateDepthForNode(ot.target);
        entries.push(entry), ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox), targetDepth < shallowestDepth && (shallowestDepth = targetDepth);
      }), callbacks2.push(function() {
        ro.callback.call(ro.observer, entries, ro.observer);
      }), ro.activeTargets.splice(0, ro.activeTargets.length);
    }
  });
  for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }
  return shallowestDepth;
}, gatherActiveObservationsAtDepth = function(depth) {
  resizeObservers.forEach(function(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length), ro.skippedTargets.splice(0, ro.skippedTargets.length), ro.observationTargets.forEach(function(ot) {
      ot.isActive() && (calculateDepthForNode(ot.target) > depth ? ro.activeTargets.push(ot) : ro.skippedTargets.push(ot));
    });
  });
}, process$1 = function() {
  var depth = 0;
  for (gatherActiveObservationsAtDepth(depth); hasActiveObservations(); )
    depth = broadcastActiveObservations(), gatherActiveObservationsAtDepth(depth);
  return hasSkippedObservations() && deliverResizeLoopError(), depth > 0;
}, trigger, callbacks = [], notify = function() {
  return callbacks.splice(0).forEach(function(cb) {
    return cb();
  });
}, queueMicroTask = function(callback) {
  if (!trigger) {
    var toggle_1 = 0, el_1 = document.createTextNode(""), config = { characterData: !0 };
    new MutationObserver(function() {
      return notify();
    }).observe(el_1, config), trigger = function() {
      el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
    };
  }
  callbacks.push(callback), trigger();
}, queueResizeObserver = function(cb) {
  queueMicroTask(function() {
    requestAnimationFrame(cb);
  });
}, watching = 0, isWatching = function() {
  return !!watching;
}, CATCH_PERIOD = 250, observerConfig = { attributes: !0, characterData: !0, childList: !0, subtree: !0 }, events = [
  "resize",
  "load",
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus"
], time = function(timeout) {
  return timeout === void 0 && (timeout = 0), Date.now() + timeout;
}, scheduled = !1, Scheduler = (function() {
  function Scheduler2() {
    var _this = this;
    this.stopped = !0, this.listener = function() {
      return _this.schedule();
    };
  }
  return Scheduler2.prototype.run = function(timeout) {
    var _this = this;
    if (timeout === void 0 && (timeout = CATCH_PERIOD), !scheduled) {
      scheduled = !0;
      var until = time(timeout);
      queueResizeObserver(function() {
        var elementsHaveResized = !1;
        try {
          elementsHaveResized = process$1();
        } finally {
          if (scheduled = !1, timeout = until - time(), !isWatching())
            return;
          elementsHaveResized ? _this.run(1e3) : timeout > 0 ? _this.run(timeout) : _this.start();
        }
      });
    }
  }, Scheduler2.prototype.schedule = function() {
    this.stop(), this.run();
  }, Scheduler2.prototype.observe = function() {
    var _this = this, cb = function() {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };
    document.body ? cb() : global$1.addEventListener("DOMContentLoaded", cb);
  }, Scheduler2.prototype.start = function() {
    var _this = this;
    this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), events.forEach(function(name) {
      return global$1.addEventListener(name, _this.listener, !0);
    }));
  }, Scheduler2.prototype.stop = function() {
    var _this = this;
    this.stopped || (this.observer && this.observer.disconnect(), events.forEach(function(name) {
      return global$1.removeEventListener(name, _this.listener, !0);
    }), this.stopped = !0);
  }, Scheduler2;
})(), scheduler = new Scheduler(), updateCount = function(n) {
  !watching && n > 0 && scheduler.start(), watching += n, !watching && scheduler.stop();
}, skipNotifyOnElement = function(target) {
  return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
}, ResizeObservation = (function() {
  function ResizeObservation2(target, observedBox) {
    this.target = target, this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return ResizeObservation2.prototype.isActive = function() {
    var size2 = calculateBoxSize(this.target, this.observedBox, !0);
    return skipNotifyOnElement(this.target) && (this.lastReportedSize = size2), this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize;
  }, ResizeObservation2;
})(), ResizeObserverDetail = /* @__PURE__ */ (function() {
  function ResizeObserverDetail2(resizeObserver, callback) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = resizeObserver, this.callback = callback;
  }
  return ResizeObserverDetail2;
})(), observerMap = /* @__PURE__ */ new WeakMap(), getObservationIndex = function(observationTargets, target) {
  for (var i = 0; i < observationTargets.length; i += 1)
    if (observationTargets[i].target === target)
      return i;
  return -1;
}, ResizeObserverController = (function() {
  function ResizeObserverController2() {
  }
  return ResizeObserverController2.connect = function(resizeObserver, callback) {
    var detail = new ResizeObserverDetail(resizeObserver, callback);
    observerMap.set(resizeObserver, detail);
  }, ResizeObserverController2.observe = function(resizeObserver, target, options) {
    var detail = observerMap.get(resizeObserver), firstObservation = detail.observationTargets.length === 0;
    getObservationIndex(detail.observationTargets, target) < 0 && (firstObservation && resizeObservers.push(detail), detail.observationTargets.push(new ResizeObservation(target, options && options.box)), updateCount(1), scheduler.schedule());
  }, ResizeObserverController2.unobserve = function(resizeObserver, target) {
    var detail = observerMap.get(resizeObserver), index2 = getObservationIndex(detail.observationTargets, target), lastObservation = detail.observationTargets.length === 1;
    index2 >= 0 && (lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1), detail.observationTargets.splice(index2, 1), updateCount(-1));
  }, ResizeObserverController2.disconnect = function(resizeObserver) {
    var _this = this, detail = observerMap.get(resizeObserver);
    detail.observationTargets.slice().forEach(function(ot) {
      return _this.unobserve(resizeObserver, ot.target);
    }), detail.activeTargets.splice(0, detail.activeTargets.length);
  }, ResizeObserverController2;
})(), ResizeObserver$1 = (function() {
  function ResizeObserver2(callback) {
    if (arguments.length === 0)
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    if (typeof callback != "function")
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    ResizeObserverController.connect(this, callback);
  }
  return ResizeObserver2.prototype.observe = function(target, options) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!isElement(target))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    ResizeObserverController.observe(this, target, options);
  }, ResizeObserver2.prototype.unobserve = function(target) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!isElement(target))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    ResizeObserverController.unobserve(this, target);
  }, ResizeObserver2.prototype.disconnect = function() {
    ResizeObserverController.disconnect(this);
  }, ResizeObserver2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, ResizeObserver2;
})();
const context = React__default.createContext(!0);
function forbiddenInRender() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const isInvalidExecutionContextForEventFunction = "use" in React__default ? () => {
  try {
    return React__default.use(context);
  } catch {
    return !1;
  }
} : () => !1;
function useEffectEvent(fn) {
  const ref = React__default.useRef(forbiddenInRender);
  return React__default.useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]), (...args) => {
    isInvalidExecutionContextForEventFunction() && forbiddenInRender();
    const latestFn = ref.current;
    return latestFn(...args);
  };
}
buildTheme();
const EMPTY_ARRAY = [], EMPTY_RECORD = {}, POPOVER_MOTION_PROPS = {
  card: {
    initial: {
      scale: 0.97,
      willChange: "transform"
    },
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: 0.1
      }
    },
    scaleIn: {
      scale: 1
    },
    scaleOut: {
      scale: 0.97
    }
  },
  children: {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    }
  },
  transition: {
    type: "spring",
    visualDuration: 0.2,
    bounce: 0.25
  }
};
function _isEnterToClickElement(element) {
  return isHTMLAnchorElement(element) || isHTMLButtonElement(element);
}
function isHTMLElement(node) {
  return node instanceof Node && node.nodeType === Node.ELEMENT_NODE;
}
function isHTMLAnchorElement(element) {
  return isHTMLElement(element) && element.nodeName === "A";
}
function isHTMLInputElement(element) {
  return isHTMLElement(element) && element.nodeName === "INPUT";
}
function isHTMLButtonElement(element) {
  return isHTMLElement(element) && element.nodeName === "BUTTON";
}
function isHTMLSelectElement(element) {
  return isHTMLElement(element) && element.nodeName === "SELECT";
}
function isHTMLTextAreaElement(element) {
  return isHTMLElement(element) && element.nodeName === "TEXTAREA";
}
function containsOrEqualsElement(element, node) {
  return element.contains(node) || element === node;
}
function _isScrollable(el) {
  if (!(el instanceof Element)) return !1;
  const style = window.getComputedStyle(el);
  return style.overflowX.includes("auto") || style.overflowX.includes("scroll") || style.overflowY.includes("auto") || style.overflowY.includes("scroll");
}
function _fillCSSObject(keys, value) {
  return keys.reduce((style, key2) => (style[key2] = value, style), {});
}
function rem(pixelValue) {
  return pixelValue === 0 ? 0 : `${pixelValue / 16}rem`;
}
function _responsive(media, values, callback) {
  return (values?.map(callback) || []).map((statement, mediaIndex) => mediaIndex === 0 ? statement : {
    [`@media screen and (min-width: ${media[mediaIndex - 1]}px)`]: statement
  });
}
function _getArrayProp(val, defaultVal) {
  return val === void 0 ? defaultVal || EMPTY_ARRAY : Array.isArray(val) ? val : [val];
}
function _getResponsiveSpace(theme, props, spaceIndexes = EMPTY_ARRAY) {
  if (!Array.isArray(spaceIndexes))
    throw new Error("the property must be array of numbers");
  if (spaceIndexes.length === 0)
    return null;
  const {
    media,
    space
  } = getTheme_v2(theme);
  return _responsive(media, spaceIndexes, (spaceIndex) => _fillCSSObject(props, rem(space[spaceIndex])));
}
function responsiveFont(fontKey, props) {
  const {
    $size,
    $weight
  } = props, {
    font,
    media
  } = getTheme_v2(props.theme), {
    family,
    sizes,
    weights
  } = font[fontKey], fontWeight = $weight && weights[$weight] || weights.regular, defaultSize = sizes[2], base = {
    position: "relative",
    fontFamily: family,
    fontWeight: `${fontWeight}`,
    padding: "1px 0",
    margin: 0,
    "&:before": {
      content: '""',
      display: "block",
      height: 0
    },
    "&:after": {
      content: '""',
      display: "block",
      height: 0
    },
    "& > code, & > span": {
      display: "block"
    },
    "&:not([hidden])": {
      display: "block"
    }
  };
  if (!$size)
    return responsiveFont.warned || (console.warn("No size specified for responsive font", {
      fontKey,
      $size,
      props,
      base
    }), responsiveFont.warned = !0), [base];
  const resp = _responsive(media, $size, (sizeIndex) => fontSize(sizes[sizeIndex] || defaultSize));
  return [base, ...resp];
}
function fontSize(size2) {
  const {
    ascenderHeight,
    descenderHeight,
    fontSize: fontSize2,
    iconSize,
    letterSpacing,
    lineHeight
  } = size2, negHeight = ascenderHeight + descenderHeight, capHeight = lineHeight - negHeight, iconOffset = (capHeight - iconSize) / 2, customIconSize = Math.floor(fontSize2 * 1.125 / 2) * 2 + 1, customIconOffset = (capHeight - customIconSize) / 2;
  return {
    fontSize: rem(fontSize2),
    lineHeight: `calc(${lineHeight} / ${fontSize2})`,
    letterSpacing: rem(letterSpacing),
    transform: `translateY(${rem(descenderHeight)})`,
    "&:before": {
      marginTop: `calc(${rem(0 - negHeight)} - 1px)`
    },
    "&:after": {
      marginBottom: "-1px"
    },
    "& svg:not([data-sanity-icon])": {
      fontSize: `calc(${customIconSize} / 16 * 1rem)`,
      margin: rem(customIconOffset)
    },
    "& [data-sanity-icon]": {
      fontSize: `calc(${iconSize} / 16 * 1rem)`,
      margin: rem(iconOffset)
    }
  };
}
function responsiveCodeFontStyle(props) {
  return responsiveFont("code", props);
}
function responsiveHeadingFont(props) {
  return responsiveFont("heading", props);
}
function responsiveLabelFont(props) {
  return responsiveFont("label", props);
}
function responsiveTextAlignStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$align, (textAlign) => ({
    textAlign
  }));
}
function responsiveTextFont(props) {
  return responsiveFont("text", props);
}
function getGlobalScope() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof window < "u") return window;
  if (typeof self < "u") return self;
  if (typeof global < "u") return global;
  throw new Error("@sanity/ui: could not locate global scope");
}
const globalScope = getGlobalScope();
function createGlobalScopedContext(key2, defaultValue) {
  const symbol = Symbol.for(key2);
  if (typeof document > "u") {
    const context2 = createContext(defaultValue);
    return context2.displayName = key2, context2;
  }
  return globalScope[symbol] = globalScope[symbol] || createContext(defaultValue), globalScope[symbol];
}
const ThemeContext = createGlobalScopedContext("@sanity/ui/context/theme", null);
function ThemeProvider(props) {
  const $ = distExports.c(15), parentTheme = useContext(ThemeContext), {
    children
  } = props, scheme = props.scheme ?? (parentTheme?.scheme || "light"), rootTheme = props.theme ?? (parentTheme?.theme || null), tone = props.tone ?? (parentTheme?.tone || "default");
  let t0;
  bb0: {
    if (!rootTheme) {
      t0 = null;
      break bb0;
    }
    let t12;
    $[0] !== rootTheme || $[1] !== scheme || $[2] !== tone ? (t12 = {
      version: 0,
      theme: rootTheme,
      scheme,
      tone
    }, $[0] = rootTheme, $[1] = scheme, $[2] = tone, $[3] = t12) : t12 = $[3], t0 = t12;
  }
  const themeContext = t0;
  let t1;
  bb1: {
    if (!rootTheme) {
      t1 = null;
      break bb1;
    }
    let t22;
    $[4] !== rootTheme || $[5] !== scheme || $[6] !== tone ? (t22 = getScopedTheme(rootTheme, scheme, tone), $[4] = rootTheme, $[5] = scheme, $[6] = tone, $[7] = t22) : t22 = $[7], t1 = t22;
  }
  const theme = t1;
  if (!theme) {
    let t22;
    return $[8] === Symbol.for("react.memo_cache_sentinel") ? (t22 = /* @__PURE__ */ jsx("pre", { children: 'ThemeProvider: no "theme" property provided' }), $[8] = t22) : t22 = $[8], t22;
  }
  let t2;
  $[9] !== children || $[10] !== theme ? (t2 = /* @__PURE__ */ jsx(ThemeProvider$1, { theme, children }), $[9] = children, $[10] = theme, $[11] = t2) : t2 = $[11];
  let t3;
  return $[12] !== t2 || $[13] !== themeContext ? (t3 = /* @__PURE__ */ jsx(ThemeContext.Provider, { value: themeContext, children: t2 }), $[12] = t2, $[13] = themeContext, $[14] = t3) : t3 = $[14], t3;
}
ThemeProvider.displayName = "ThemeProvider";
function useRootTheme() {
  const value = useContext(ThemeContext);
  if (!value)
    throw new Error("useRootTheme(): missing context value");
  return value;
}
function ThemeColorProvider(props) {
  const $ = distExports.c(5), {
    children,
    scheme,
    tone
  } = props, root = useRootTheme(), t0 = scheme || root.scheme;
  let t1;
  return $[0] !== children || $[1] !== root.theme || $[2] !== t0 || $[3] !== tone ? (t1 = /* @__PURE__ */ jsx(ThemeProvider, { scheme: t0, theme: root.theme, tone, children }), $[0] = children, $[1] = root.theme, $[2] = t0, $[3] = tone, $[4] = t1) : t1 = $[4], t1;
}
ThemeColorProvider.displayName = "ThemeColorProvider";
function useTheme_v2() {
  const $ = distExports.c(2), t0 = useTheme();
  let t1;
  return $[0] !== t0 ? (t1 = getTheme_v2(t0), $[0] = t0, $[1] = t1) : t1 = $[1], t1;
}
function responsiveBorderStyle() {
  return [border, borderTop, borderRight, borderBottom, borderLeft];
}
function border(props) {
  const {
    card,
    media
  } = getTheme_v2(props.theme), borderStyle = `${card.border?.width ?? 1}px solid var(--card-border-color)`;
  return _responsive(media, props.$border, (value) => value ? {
    "&&": {
      border: borderStyle
    }
  } : {
    "&&": {
      border: 0
    }
  });
}
function borderTop(props) {
  const {
    card,
    media
  } = getTheme_v2(props.theme), borderStyle = `${card.border?.width ?? 1}px solid var(--card-border-color)`;
  return _responsive(media, props.$borderTop, (value) => value ? {
    "&&": {
      borderTop: borderStyle
    }
  } : {
    "&&": {
      borderTop: 0
    }
  });
}
function borderRight(props) {
  const {
    card,
    media
  } = getTheme_v2(props.theme), borderStyle = `${card.border?.width ?? 1}px solid var(--card-border-color)`;
  return _responsive(media, props.$borderRight, (value) => value ? {
    "&&": {
      borderRight: borderStyle
    }
  } : {
    "&&": {
      borderRight: 0
    }
  });
}
function borderBottom(props) {
  const {
    card,
    media
  } = getTheme_v2(props.theme), borderStyle = `${card.border?.width ?? 1}px solid var(--card-border-color)`;
  return _responsive(media, props.$borderBottom, (value) => value ? {
    "&&": {
      borderBottom: borderStyle
    }
  } : {
    "&&": {
      borderBottom: 0
    }
  });
}
function borderLeft(props) {
  const {
    card,
    media
  } = getTheme_v2(props.theme), borderStyle = `${card.border?.width ?? 1}px solid var(--card-border-color)`;
  return _responsive(media, props.$borderLeft, (value) => value ? {
    "&&": {
      borderLeft: borderStyle
    }
  } : {
    "&&": {
      borderLeft: 0
    }
  });
}
const BASE_STYLE$4 = {
  '&[data-as="ul"],&[data-as="ol"]': {
    listStyle: "none"
  }
}, BOX_SIZING = {
  content: "content-box",
  border: "border-box"
}, BOX_HEIGHT = {
  stretch: "stretch",
  fill: "100%"
};
function boxStyle() {
  return BASE_STYLE$4;
}
function responsiveBoxStyle() {
  return [responsiveBoxSizingStyle, responsiveBoxHeightStyle, responsiveBoxOverflowStyle, responsiveBoxDisplayStyle];
}
function responsiveBoxDisplayStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$display, (display) => ({
    "&:not([hidden])": {
      display
    }
  }));
}
function responsiveBoxSizingStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$sizing, (sizing) => ({
    boxSizing: BOX_SIZING[sizing]
  }));
}
function responsiveBoxHeightStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$height, (height) => ({
    height: BOX_HEIGHT[height]
  }));
}
function responsiveBoxOverflowStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$overflow, (overflow) => ({
    overflow
  }));
}
const BASE_STYLE$3 = {
  minWidth: 0,
  minHeight: 0
};
function flexItemStyle() {
  return [BASE_STYLE$3, responsiveFlexItemStyle];
}
function responsiveFlexItemStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return props.$flex ? _responsive(media, props.$flex, (flex) => ({
    flex: `${flex}`
  })) : EMPTY_ARRAY;
}
const BASE_STYLE$2 = {
  "&&:not([hidden])": {
    display: "flex"
  }
};
function responsiveFlexStyle() {
  return [BASE_STYLE$2, responsiveFlexAlignStyle, responsiveFlexGapStyle, responsiveFlexWrapStyle, responsiveFlexJustifyStyle, responsiveFlexDirectionStyle];
}
function responsiveFlexAlignStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$align, (align) => ({
    alignItems: align
  }));
}
function responsiveFlexGapStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$gap, (gap) => ({
    gap: gap ? rem(space[gap]) : void 0
  }));
}
function responsiveFlexWrapStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$wrap, (wrap) => ({
    flexWrap: wrap
  }));
}
function responsiveFlexJustifyStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$justify, (justify) => ({
    justifyContent: justify
  }));
}
function responsiveFlexDirectionStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$direction, (direction) => ({
    flexDirection: direction
  }));
}
function focusRingBorderStyle(border2) {
  return `inset 0 0 0 ${border2.width}px ${border2.color}`;
}
function focusRingStyle(opts) {
  const {
    base,
    border: border2,
    focusRing
  } = opts, focusRingOutsetWidth = focusRing.offset + focusRing.width, focusRingInsetWidth = 0 - focusRing.offset, bgColor = base ? base.bg : "var(--card-bg-color)";
  return [focusRingInsetWidth > 0 && `inset 0 0 0 ${focusRingInsetWidth}px var(--card-focus-ring-color)`, border2 && focusRingBorderStyle(border2), focusRingInsetWidth < 0 && `0 0 0 ${0 - focusRingInsetWidth}px ${bgColor}`, focusRingOutsetWidth > 0 && `0 0 0 ${focusRingOutsetWidth}px var(--card-focus-ring-color)`].filter(Boolean).join(",");
}
function responsiveGridItemStyle() {
  return [responsiveGridItemRowStyle, responsiveGridItemRowStartStyle, responsiveGridItemRowEndStyle, responsiveGridItemColumnStyle, responsiveGridItemColumnStartStyle, responsiveGridItemColumnEndStyle];
}
const GRID_ITEM_ROW = {
  auto: "auto",
  full: "1 / -1"
}, GRID_ITEM_COLUMN = {
  auto: "auto",
  full: "1 / -1"
};
function responsiveGridItemRowStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$row, (row) => typeof row == "number" ? {
    gridRow: `span ${row} / span ${row}`
  } : {
    gridRow: GRID_ITEM_ROW[row]
  });
}
function responsiveGridItemRowStartStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$rowStart, (rowStart) => ({
    gridRowStart: `${rowStart}`
  }));
}
function responsiveGridItemRowEndStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$rowEnd, (rowEnd) => ({
    gridRowEnd: `${rowEnd}`
  }));
}
function responsiveGridItemColumnStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$column, (column) => typeof column == "number" ? {
    gridColumn: `span ${column} / span ${column}`
  } : {
    gridColumn: GRID_ITEM_COLUMN[column]
  });
}
function responsiveGridItemColumnStartStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$columnStart, (columnStart) => ({
    gridColumnStart: `${columnStart}`
  }));
}
function responsiveGridItemColumnEndStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$columnEnd, (columnEnd) => ({
    gridColumnEnd: `${columnEnd}`
  }));
}
const GRID_CSS = {
  "&&:not([hidden])": {
    display: "grid"
  },
  '&[data-as="ul"],&[data-as="ol"]': {
    listStyle: "none"
  }
}, GRID_AUTO_COLUMS = {
  auto: "auto",
  min: "min-content",
  max: "max-content",
  fr: "minmax(0, 1fr)"
}, GRID_AUTO_ROWS = {
  auto: "auto",
  min: "min-content",
  max: "max-content",
  fr: "minmax(0, 1fr)"
};
function responsiveGridStyle() {
  return [GRID_CSS, responsiveGridAutoFlowStyle, responsiveGridAutoRowsStyle, responsiveGridAutoColsStyle, responsiveGridColumnsStyle, responsiveGridRowsStyle, responsiveGridGapStyle, responsiveGridGapXStyle, responsiveGridGapYStyle];
}
function responsiveGridAutoFlowStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$autoFlow, (autoFlow) => ({
    gridAutoFlow: autoFlow
  }));
}
function responsiveGridAutoRowsStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$autoRows, (autoRows) => ({
    gridAutoRows: autoRows && GRID_AUTO_ROWS[autoRows]
  }));
}
function responsiveGridAutoColsStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$autoCols, (autoCols) => ({
    gridAutoColumns: autoCols && GRID_AUTO_COLUMS[autoCols]
  }));
}
function responsiveGridColumnsStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$columns, (columns) => ({
    gridTemplateColumns: columns && `repeat(${columns},minmax(0,1fr));`
  }));
}
function responsiveGridRowsStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$rows, (rows) => ({
    gridTemplateRows: rows && `repeat(${rows},minmax(0,1fr));`
  }));
}
function responsiveGridGapStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$gap, (gap) => ({
    gridGap: gap ? rem(space[gap]) : void 0
  }));
}
function responsiveGridGapXStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$gapX, (gapX) => ({
    columnGap: gapX ? rem(space[gapX]) : void 0
  }));
}
function responsiveGridGapYStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$gapY, (gapY) => ({
    rowGap: gapY ? rem(space[gapY]) : void 0
  }));
}
function responsiveInputPaddingStyle(props) {
  const {
    $fontSize,
    $iconLeft,
    $iconRight,
    $padding,
    $space
  } = props, {
    font,
    media,
    space
  } = getTheme_v2(props.theme), len = Math.max($padding.length, $space.length, $fontSize.length), _padding = [], _space = [], _fontSize = [];
  for (let i = 0; i < len; i += 1)
    _fontSize[i] = $fontSize[i] === void 0 ? _fontSize[i - 1] : $fontSize[i], _padding[i] = $padding[i] === void 0 ? _padding[i - 1] : $padding[i], _space[i] = $space[i] === void 0 ? _space[i - 1] : $space[i];
  return _responsive(media, _padding, (_, i) => {
    const size2 = font.text.sizes[_fontSize[i]] || font.text.sizes[2], emSize = size2.lineHeight - size2.ascenderHeight - size2.descenderHeight, p = space[_padding[i]], s = space[_space[i]], styles = {
      paddingTop: rem(p - size2.ascenderHeight),
      paddingRight: rem(p),
      paddingBottom: rem(p - size2.descenderHeight),
      paddingLeft: rem(p)
    };
    return $iconRight && (styles.paddingRight = rem(p + emSize + s)), $iconLeft && (styles.paddingLeft = rem(p + emSize + s)), styles;
  });
}
function responsiveInputPaddingIconRightStyle(props) {
  return responsiveInputPaddingStyle({
    ...props,
    $iconRight: !0
  });
}
const ROOT_STYLE = css`
  &:not([hidden]) {
    display: flex;
  }

  align-items: center;
`;
function textInputRootStyle() {
  return ROOT_STYLE;
}
function textInputBaseStyle(props) {
  const {
    $scheme,
    $tone,
    $weight
  } = props, {
    color: color2,
    font
  } = getTheme_v2(props.theme);
  return css`
    appearance: none;
    background: none;
    border: 0;
    border-radius: 0;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-family: ${font.text.family};
    font-weight: ${$weight && font.text.weights[$weight] || font.text.weights.regular};
    margin: 0;
    position: relative;
    z-index: 1;
    display: block;

    /* NOTE: This is a hack to disable Chrome’s autofill styles */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-text-fill-color: var(--input-fg-color) !important;
      transition: background-color 5000s;
      transition-delay: 86400s /* 24h */;
    }

    /* &:is(textarea) */
    &[data-as='textarea'] {
      resize: none;
    }

    color: var(--input-fg-color);

    &::placeholder {
      color: var(--input-placeholder-color);
    }

    &[data-scheme='${$scheme}'][data-tone='${$tone}'] {
      --input-fg-color: ${color2.input.default.enabled.fg};
      --input-placeholder-color: ${color2.input.default.enabled.placeholder};

      /* enabled */
      &:not(:invalid):not(:disabled):not(:read-only) {
        --input-fg-color: ${color2.input.default.enabled.fg};
        --input-placeholder-color: ${color2.input.default.enabled.placeholder};
      }

      /* disabled */
      &:not(:invalid):disabled {
        --input-fg-color: ${color2.input.default.disabled.fg};
        --input-placeholder-color: ${color2.input.default.disabled.placeholder};
      }

      /* invalid */
      &:invalid {
        --input-fg-color: ${color2.input.invalid.enabled.fg};
        --input-placeholder-color: ${color2.input.invalid.enabled.placeholder};
      }

      /* readOnly */
      &:read-only {
        --input-fg-color: ${color2.input.default.readOnly.fg};
        --input-placeholder-color: ${color2.input.default.readOnly.placeholder};
      }
    }
  `;
}
function textInputFontSizeStyle(props) {
  const {
    font,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$fontSize, (sizeIndex) => {
    const size2 = font.text.sizes[sizeIndex] || font.text.sizes[2];
    return {
      fontSize: rem(size2.fontSize),
      lineHeight: `${size2.lineHeight / size2.fontSize}`
    };
  });
}
function textInputRepresentationStyle(props) {
  const {
    $hasPrefix,
    $hasSuffix,
    $scheme,
    $tone,
    $unstableDisableFocusRing
  } = props, {
    color: color2,
    input
  } = getTheme_v2(props.theme);
  return css`
    --input-box-shadow: none;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    pointer-events: none;
    z-index: 0;

    background-color: var(--card-bg-color);
    box-shadow: var(--input-box-shadow);

    border-top-left-radius: ${$hasPrefix ? 0 : void 0};
    border-bottom-left-radius: ${$hasPrefix ? 0 : void 0};
    border-top-right-radius: ${$hasSuffix ? 0 : void 0};
    border-bottom-right-radius: ${$hasSuffix ? 0 : void 0};

    &[data-scheme='${$scheme}'][data-tone='${$tone}'] {
      --card-bg-color: ${color2.input.default.enabled.bg};
      --card-fg-color: ${color2.input.default.enabled.fg};

      /* enabled */
      *:not(:disabled) + &[data-border] {
        --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.border,
    width: input.border.width
  })};
      }

      /* invalid */
      *:not(:disabled):invalid + & {
        --card-bg-color: ${color2.input.invalid.enabled.bg};
        --card-fg-color: ${color2.input.invalid.enabled.fg};

        &[data-border] {
          --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.invalid.enabled.border,
    width: input.border.width
  })};
        }
      }

      /* focused */
      *:not(:disabled):focus + & {
        &[data-border] {
          --input-box-shadow: ${$unstableDisableFocusRing ? void 0 : focusRingStyle({
    border: {
      color: color2.input.default.enabled.border,
      width: input.border.width
    },
    focusRing: input.text.focusRing
  })};
        }

        &:not([data-border]) {
          --input-box-shadow: ${$unstableDisableFocusRing ? void 0 : focusRingStyle({
    focusRing: input.text.focusRing
  })};
        }
      }

      /* disabled */
      *:not(:invalid):disabled + & {
        --card-bg-color: ${color2.input.default.disabled.bg} !important;
        --card-fg-color: ${color2.input.default.disabled.fg} !important;
        --card-icon-color: ${color2.input.default.disabled.fg} !important;

        &[data-border] {
          --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.disabled.border,
    width: input.border.width
  })};
        }
      }

      *:invalid:disabled + & {
        --card-bg-color: ${color2.input.invalid.disabled.bg} !important;
        --card-fg-color: ${color2.input.invalid.disabled.fg} !important;
        --card-icon-color: ${color2.input.invalid.disabled.fg} !important;

        &[data-border] {
          --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.invalid.disabled.border,
    width: input.border.width
  })};
        }
      }

      /* readOnly */
      *:not(:invalid):read-only + & {
        --card-bg-color: ${color2.input.default.readOnly.bg} !important;
        --card-fg-color: ${color2.input.default.readOnly.fg} !important;
      }

      *:invalid:read-only + & {
        --card-bg-color: ${color2.input.invalid.readOnly.bg} !important;
        --card-fg-color: ${color2.input.invalid.readOnly.fg} !important;
      }

      /* hovered */
      @media (hover: hover) {
        *:not(:disabled):not(:read-only):not(:invalid):hover + & {
          --card-bg-color: ${color2.input.default.hovered.bg};
          --card-fg-color: ${color2.input.default.hovered.fg};
        }

        *:invalid:not(:disabled):not(:read-only):hover + & {
          --card-bg-color: ${color2.input.invalid.hovered.bg};
          --card-fg-color: ${color2.input.invalid.hovered.fg};
        }

        *:not(:disabled):not(:read-only):not(:invalid):not(:focus):hover + &[data-border] {
          --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.hovered.border,
    width: input.border.width
  })};
        }

        *:invalid:not(:disabled):not(:read-only):not(:focus):hover + &[data-border] {
          --input-box-shadow: ${focusRingBorderStyle({
    color: color2.input.invalid.hovered.border,
    width: input.border.width
  })};
        }
      }
    }
  `;
}
function responsiveMarginStyle(props) {
  const {
    theme
  } = props;
  return [_getResponsiveSpace(theme, ["margin"], props.$margin), _getResponsiveSpace(theme, ["marginLeft", "marginRight"], props.$marginX), _getResponsiveSpace(theme, ["marginTop", "marginBottom"], props.$marginY), _getResponsiveSpace(theme, ["marginTop"], props.$marginTop), _getResponsiveSpace(theme, ["marginRight"], props.$marginRight), _getResponsiveSpace(theme, ["marginBottom"], props.$marginBottom), _getResponsiveSpace(theme, ["marginLeft"], props.$marginLeft)].filter(Boolean);
}
function responsivePaddingStyle(props) {
  const {
    theme
  } = props;
  return [_getResponsiveSpace(theme, ["padding"], props.$padding), _getResponsiveSpace(theme, ["paddingLeft", "paddingRight"], props.$paddingX), _getResponsiveSpace(theme, ["paddingTop", "paddingBottom"], props.$paddingY), _getResponsiveSpace(theme, ["paddingTop"], props.$paddingTop), _getResponsiveSpace(theme, ["paddingRight"], props.$paddingRight), _getResponsiveSpace(theme, ["paddingBottom"], props.$paddingBottom), _getResponsiveSpace(theme, ["paddingLeft"], props.$paddingLeft)].filter(Boolean);
}
function responsiveRadiusStyle(props) {
  const {
    media,
    radius
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$radius, (value) => {
    let borderRadius = 0;
    return typeof value == "number" && (borderRadius = rem(radius[value])), value === "full" && (borderRadius = "9999px"), {
      borderRadius
    };
  });
}
function toBoxShadow(shadow, color2) {
  return `${shadow.map(rem).join(" ")} ${color2}`;
}
function shadowStyle(shadow, outlineWidth = 1) {
  if (!shadow) return EMPTY_RECORD;
  const outline = `0 0 0 ${rem(outlineWidth)} var(--card-shadow-outline-color)`, umbra = toBoxShadow(shadow.umbra, "var(--card-shadow-umbra-color)"), penumbra = toBoxShadow(shadow.penumbra, "var(--card-shadow-penumbra-color)"), ambient = toBoxShadow(shadow.ambient, "var(--card-shadow-ambient-color)");
  return {
    boxShadow: `${outline}, ${umbra}, ${penumbra}, ${ambient}`
  };
}
function responsiveShadowStyle(props) {
  const {
    card,
    media,
    shadow
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$shadow, (index2) => shadowStyle(shadow[index2], card.shadow.outline));
}
const SpanWithTextOverflow = styled.span.withConfig({
  displayName: "SpanWithTextOverflow",
  componentId: "sc-ol2i3b-0"
})`display:block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;overflow:clip;`;
function labelBaseStyle(props) {
  const {
    $accent,
    $muted
  } = props, {
    font
  } = getTheme_v2(props.theme);
  return css`
    text-transform: uppercase;

    ${$accent && css`
      color: var(--card-accent-fg-color);
    `}

    ${$muted && css`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${font.code.family};
      border-radius: 1px;
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `;
}
const StyledLabel = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledLabel",
  componentId: "sc-1luap7z-0"
})(responsiveLabelFont, responsiveTextAlignStyle, labelBaseStyle), Label = forwardRef(function(props, ref) {
  const $ = distExports.c(26);
  let accent, align, childrenProp, restProps, t0, t1, textOverflow, weight;
  $[0] !== props ? ({
    accent,
    align,
    children: childrenProp,
    muted: t0,
    size: t1,
    textOverflow,
    weight,
    ...restProps
  } = props, $[0] = props, $[1] = accent, $[2] = align, $[3] = childrenProp, $[4] = restProps, $[5] = t0, $[6] = t1, $[7] = textOverflow, $[8] = weight) : (accent = $[1], align = $[2], childrenProp = $[3], restProps = $[4], t0 = $[5], t1 = $[6], textOverflow = $[7], weight = $[8]);
  const muted = t0 === void 0 ? !1 : t0, size2 = t1 === void 0 ? 2 : t1;
  let children = childrenProp;
  if (textOverflow === "ellipsis") {
    let t22;
    $[9] !== children ? (t22 = /* @__PURE__ */ jsx(SpanWithTextOverflow, { children }), $[9] = children, $[10] = t22) : t22 = $[10], children = t22;
  } else {
    let t22;
    $[11] !== children ? (t22 = /* @__PURE__ */ jsx("span", { children }), $[11] = children, $[12] = t22) : t22 = $[12], children = t22;
  }
  let t2;
  $[13] !== align ? (t2 = _getArrayProp(align), $[13] = align, $[14] = t2) : t2 = $[14];
  let t3;
  $[15] !== size2 ? (t3 = _getArrayProp(size2), $[15] = size2, $[16] = t3) : t3 = $[16];
  let t4;
  return $[17] !== accent || $[18] !== children || $[19] !== muted || $[20] !== ref || $[21] !== restProps || $[22] !== t2 || $[23] !== t3 || $[24] !== weight ? (t4 = /* @__PURE__ */ jsx(StyledLabel, { "data-ui": "Label", ...restProps, $accent: accent, $align: t2, $muted: muted, $size: t3, $weight: weight, ref, children }), $[17] = accent, $[18] = children, $[19] = muted, $[20] = ref, $[21] = restProps, $[22] = t2, $[23] = t3, $[24] = weight, $[25] = t4) : t4 = $[25], t4;
});
Label.displayName = "ForwardRef(Label)";
const avatarStyle = {
  root: avatarRootStyle,
  arrow: avatarArrowStyle,
  bgStroke: avatarBgStrokeStyle,
  stroke: avatarStrokeStyle,
  initials: avatarInitialsStyle,
  image: avatarImageStyle
};
function avatarArrowStyle() {
  return {
    position: "absolute",
    boxSizing: "border-box",
    zIndex: "0",
    opacity: "0",
    transition: "all 0.2s linear",
    transform: "rotate(-90deg) translate3d(0, 6px, 0)",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    "& > svg": {
      width: "11px",
      height: "7px",
      position: "absolute",
      top: "-5px",
      left: "50%",
      transform: "translateX(-6px)",
      "&:not([hidden])": {
        display: "block"
      }
    },
    "[data-arrow-position='inside'] > &": {
      transform: "rotate(-90deg) translate3d(0, 6px, 0)",
      opacity: "0"
    },
    "[data-arrow-position='top'] > &": {
      opacity: "1",
      transform: "rotate(0deg)"
    },
    "[data-arrow-position='bottom'] > &": {
      opacity: "1",
      transform: "rotate(-180deg)"
    }
  };
}
function avatarRootStyle(props) {
  const {
    $color
  } = props, {
    avatar
  } = getTheme_v2(props.theme);
  return {
    "--avatar-bg-color": `var(--card-avatar-${$color}-bg-color)`,
    "--avatar-fg-color": `var(--card-avatar-${$color}-fg-color)`,
    backgroundColor: "var(--avatar-bg-color)",
    position: "relative",
    boxSizing: "border-box",
    userSelect: "none",
    boxShadow: "0 0 0 1px var(--card-bg-color)",
    '&[data-status="inactive"]': {
      opacity: "0.5"
    },
    "&>svg": {
      "&:not([hidden])": {
        display: "block"
      }
    },
    /* &:is(button) */
    '&[data-as="button"]': {
      WebkitFontSmoothing: "inherit",
      appearance: "none",
      margin: 0,
      padding: 0,
      border: 0,
      font: "inherit",
      color: "inherit",
      outline: "none",
      "&:focus": {
        boxShadow: focusRingStyle({
          focusRing: avatar.focusRing
        })
      },
      "&:focus:not(:focus-visible)": {
        boxShadow: "none"
      }
    }
  };
}
function responsiveAvatarSizeStyle(props) {
  const {
    avatar,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$size, (size2) => {
    const avatarSize = avatar.sizes[size2] || avatar.sizes[0];
    return {
      width: rem(avatarSize.size),
      height: rem(avatarSize.size),
      borderRadius: rem(avatarSize.size / 2),
      "&>svg": {
        width: rem(avatarSize.size),
        height: rem(avatarSize.size),
        borderRadius: rem(avatarSize.size / 2)
      }
    };
  });
}
function avatarImageStyle() {
  return {
    position: "relative"
  };
}
function avatarInitialsStyle() {
  return {
    width: "100%",
    height: "100%",
    color: "var(--avatar-fg-color)",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    textAlign: "center",
    borderRadius: "50%",
    "&:not([hidden])": {
      display: "flex"
    }
  };
}
function avatarBgStrokeStyle() {
  return {
    strokeWidth: "4px",
    stroke: "var(--card-bg-color)"
  };
}
function avatarStrokeStyle() {
  return {
    strokeWidth: "2px",
    stroke: "var(--avatar-bg-color)",
    '[data-status="editing"] &': {
      strokeDasharray: "2 4",
      strokeLinecap: "round"
    }
  };
}
const StyledAvatar = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledAvatar",
  componentId: "sc-1rj7kl0-0"
})(responsiveAvatarSizeStyle, avatarStyle.root), Arrow$1 = /* @__PURE__ */ styled.div.withConfig({
  displayName: "Arrow",
  componentId: "sc-1rj7kl0-1"
})(avatarStyle.arrow), BgStroke = /* @__PURE__ */ styled.ellipse.withConfig({
  displayName: "BgStroke",
  componentId: "sc-1rj7kl0-2"
})(avatarStyle.bgStroke), Stroke = /* @__PURE__ */ styled.ellipse.withConfig({
  displayName: "Stroke",
  componentId: "sc-1rj7kl0-3"
})(avatarStyle.stroke), Initials = /* @__PURE__ */ styled.div.withConfig({
  displayName: "Initials",
  componentId: "sc-1rj7kl0-4"
})(avatarStyle.initials), InitialsLabel = /* @__PURE__ */ styled(Label).withConfig({
  displayName: "InitialsLabel",
  componentId: "sc-1rj7kl0-5"
})({
  color: "inherit"
}), AvatarImage = /* @__PURE__ */ styled.svg.withConfig({
  displayName: "AvatarImage",
  componentId: "sc-1rj7kl0-6"
})(avatarStyle.image), Avatar = forwardRef(function(props, ref) {
  const $ = distExports.c(46);
  let __unstable_hideInnerStroke, animateArrowFrom, arrowPositionProp, asProp, initials, onImageLoadError, restProps, src, t0, t1, t2, title;
  $[0] !== props ? ({
    __unstable_hideInnerStroke,
    as: asProp,
    color: t0,
    src,
    title,
    initials,
    onImageLoadError,
    arrowPosition: arrowPositionProp,
    animateArrowFrom,
    status: t1,
    size: t2,
    ...restProps
  } = props, $[0] = props, $[1] = __unstable_hideInnerStroke, $[2] = animateArrowFrom, $[3] = arrowPositionProp, $[4] = asProp, $[5] = initials, $[6] = onImageLoadError, $[7] = restProps, $[8] = src, $[9] = t0, $[10] = t1, $[11] = t2, $[12] = title) : (__unstable_hideInnerStroke = $[1], animateArrowFrom = $[2], arrowPositionProp = $[3], asProp = $[4], initials = $[5], onImageLoadError = $[6], restProps = $[7], src = $[8], t0 = $[9], t1 = $[10], t2 = $[11], title = $[12]);
  const color2 = t0 === void 0 ? "gray" : t0, status = t1 === void 0 ? "online" : t1, sizeProp = t2 === void 0 ? 1 : t2, {
    avatar
  } = useTheme_v2(), as = ReactIs.isValidElementType(asProp) ? asProp : "div", size2 = _getArrayProp(sizeProp), _sizeRem = (avatar.sizes[size2[0]] || avatar.sizes[0]).size, _radius = _sizeRem / 2, elementId = useId(), [arrowPosition, setArrowPosition] = useState(animateArrowFrom || arrowPositionProp || "inside"), [imageFailed, setImageFailed] = useState(!1), imageId = `avatar-image-${elementId}`;
  let t3, t4;
  $[13] !== arrowPosition || $[14] !== arrowPositionProp ? (t3 = () => {
    if (arrowPosition === arrowPositionProp)
      return;
    const raf = requestAnimationFrame(() => setArrowPosition(arrowPositionProp));
    return () => cancelAnimationFrame(raf);
  }, t4 = [arrowPosition, arrowPositionProp], $[13] = arrowPosition, $[14] = arrowPositionProp, $[15] = t3, $[16] = t4) : (t3 = $[15], t4 = $[16]), useEffect(t3, t4);
  let t5, t6;
  $[17] !== src ? (t5 = () => {
    src && setImageFailed(!1);
  }, t6 = [src], $[17] = src, $[18] = t5, $[19] = t6) : (t5 = $[18], t6 = $[19]), useEffect(t5, t6);
  let t7;
  $[20] !== onImageLoadError ? (t7 = () => {
    setImageFailed(!0), onImageLoadError && onImageLoadError(new Error("Avatar: the image failed to load"));
  }, $[20] = onImageLoadError, $[21] = t7) : t7 = $[21];
  const handleImageError = t7, T0 = StyledAvatar, t8 = typeof as == "string" ? as : void 0, t9 = "Avatar";
  let t10;
  $[22] !== color2 ? (t10 = /* @__PURE__ */ jsx(Arrow$1, { children: /* @__PURE__ */ jsx("svg", { width: "11", height: "7", viewBox: "0 0 11 7", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M6.67948 1.50115L11 7L0 7L4.32052 1.50115C4.92109 0.736796 6.07891 0.736795 6.67948 1.50115Z", fill: color2 }) }) }), $[22] = color2, $[23] = t10) : t10 = $[23];
  let t11;
  $[24] !== __unstable_hideInnerStroke || $[25] !== _radius || $[26] !== _sizeRem || $[27] !== handleImageError || $[28] !== imageFailed || $[29] !== imageId || $[30] !== src ? (t11 = !imageFailed && src && /* @__PURE__ */ jsxs(AvatarImage, { viewBox: `0 0 ${_sizeRem} ${_sizeRem}`, fill: "none", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", { id: imageId, patternContentUnits: "objectBoundingBox", width: "1", height: "1", children: /* @__PURE__ */ jsx("image", { href: src, width: "1", height: "1", onError: handleImageError }) }) }),
    /* @__PURE__ */ jsx("circle", { cx: _radius, cy: _radius, r: _radius, fill: `url(#${imageId})` }),
    !__unstable_hideInnerStroke && /* @__PURE__ */ jsx(BgStroke, { cx: _radius, cy: _radius, rx: _radius, ry: _radius, vectorEffect: "non-scaling-stroke" }),
    /* @__PURE__ */ jsx(Stroke, { cx: _radius, cy: _radius, rx: _radius, ry: _radius, vectorEffect: "non-scaling-stroke" })
  ] }), $[24] = __unstable_hideInnerStroke, $[25] = _radius, $[26] = _sizeRem, $[27] = handleImageError, $[28] = imageFailed, $[29] = imageId, $[30] = src, $[31] = t11) : t11 = $[31];
  const t12 = (imageFailed || !src) && initials && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Initials, { children: /* @__PURE__ */ jsx(InitialsLabel, { forwardedAs: "span", size: size2.map(_temp$a), weight: "medium", children: initials }) }) });
  let t13;
  return $[32] !== T0 || $[33] !== arrowPosition || $[34] !== as || $[35] !== color2 || $[36] !== ref || $[37] !== restProps || $[38] !== size2 || $[39] !== status || $[40] !== t10 || $[41] !== t11 || $[42] !== t12 || $[43] !== t8 || $[44] !== title ? (t13 = /* @__PURE__ */ jsxs(T0, { as, "data-as": t8, "data-ui": t9, ...restProps, $color: color2, $size: size2, "aria-label": title, "data-arrow-position": arrowPosition, "data-status": status, ref, title, children: [
    t10,
    t11,
    t12
  ] }), $[32] = T0, $[33] = arrowPosition, $[34] = as, $[35] = color2, $[36] = ref, $[37] = restProps, $[38] = size2, $[39] = status, $[40] = t10, $[41] = t11, $[42] = t12, $[43] = t8, $[44] = title, $[45] = t13) : t13 = $[45], t13;
});
Avatar.displayName = "ForwardRef(Avatar)";
function _temp$a(s) {
  return s === 1 ? 1 : s === 2 ? 3 : s === 3 ? 5 : 0;
}
function _responsiveAvatarCounterSizeStyle(props) {
  const {
    avatar,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$size, (size2) => {
    const avatarSize = avatar.sizes[size2];
    return avatarSize ? {
      borderRadius: rem(avatarSize.size / 2),
      minWidth: rem(avatarSize.size),
      height: rem(avatarSize.size)
    } : EMPTY_RECORD;
  });
}
function _avatarCounterBaseStyle(props) {
  const {
    space
  } = getTheme_v2(props.theme);
  return css`
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    user-select: none;
    color: inherit;
    color: var(--card-fg-color);
    background: var(--card-bg-color);
    box-shadow:
      0 0 0 1px var(--card-bg-color),
      inset 0 0 0 1px var(--card-hairline-hard-color);
    padding: 0 ${rem(space[2])};

    &:not([hidden]) {
      display: flex;
    }
  `;
}
const StyledAvatarCounter = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledAvatarCounter",
  componentId: "sc-1ydx86y-0"
})(_responsiveAvatarCounterSizeStyle, _avatarCounterBaseStyle), AvatarCounter = forwardRef(function(props, ref) {
  const $ = distExports.c(20), {
    count,
    size: t0
  } = props, sizeProp = t0 === void 0 ? 1 : t0;
  let T0, T1, t1, t2, t3, t4, t5;
  if ($[0] !== ref || $[1] !== sizeProp) {
    const size2 = _getArrayProp(sizeProp);
    T1 = StyledAvatarCounter, t3 = size2, t4 = "AvatarCounter", t5 = ref, T0 = Label, t1 = "span", t2 = size2.map(_temp$9), $[0] = ref, $[1] = sizeProp, $[2] = T0, $[3] = T1, $[4] = t1, $[5] = t2, $[6] = t3, $[7] = t4, $[8] = t5;
  } else
    T0 = $[2], T1 = $[3], t1 = $[4], t2 = $[5], t3 = $[6], t4 = $[7], t5 = $[8];
  let t6;
  $[9] !== T0 || $[10] !== count || $[11] !== t1 || $[12] !== t2 ? (t6 = /* @__PURE__ */ jsx(T0, { as: t1, size: t2, weight: "medium", children: count }), $[9] = T0, $[10] = count, $[11] = t1, $[12] = t2, $[13] = t6) : t6 = $[13];
  let t7;
  return $[14] !== T1 || $[15] !== t3 || $[16] !== t4 || $[17] !== t5 || $[18] !== t6 ? (t7 = /* @__PURE__ */ jsx(T1, { $size: t3, "data-ui": t4, ref: t5, children: t6 }), $[14] = T1, $[15] = t3, $[16] = t4, $[17] = t5, $[18] = t6, $[19] = t7) : t7 = $[19], t7;
});
AvatarCounter.displayName = "ForwardRef(AvatarCounter)";
function _temp$9(s) {
  return s === 1 ? 1 : s === 2 ? 3 : s === 3 ? 5 : 0;
}
const BASE_STYLES = css`
  white-space: nowrap;

  & > div {
    vertical-align: top;

    &:not([hidden]) {
      display: inline-block;
    }
  }
`;
function avatarStackStyle() {
  return BASE_STYLES;
}
function responsiveAvatarStackSizeStyle(props) {
  const {
    avatar,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$size, (size2) => {
    const avatarSize = avatar.sizes[size2];
    return avatarSize ? {
      "& > div + div": {
        marginLeft: rem(avatarSize.distance)
      }
    } : EMPTY_RECORD;
  });
}
const StyledAvatarStack = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledAvatarStack",
  componentId: "sc-cysmbb-0"
})(responsiveAvatarStackSizeStyle, avatarStackStyle), AvatarStack = forwardRef(function(props, ref) {
  const $ = distExports.c(38);
  let childrenProp, restProps, t0, t1;
  $[0] !== props ? ({
    children: childrenProp,
    maxLength: t0,
    size: t1,
    ...restProps
  } = props, $[0] = props, $[1] = childrenProp, $[2] = restProps, $[3] = t0, $[4] = t1) : (childrenProp = $[1], restProps = $[2], t0 = $[3], t1 = $[4]);
  const maxLengthProp = t0 === void 0 ? 4 : t0, sizeProp = t1 === void 0 ? 1 : t1;
  let T0, t2, t3, t4, t5, t6, t7, t8;
  if ($[5] !== childrenProp || $[6] !== maxLengthProp || $[7] !== ref || $[8] !== restProps || $[9] !== sizeProp) {
    const children = Children.toArray(childrenProp).filter(isValidElement), maxLength = Math.max(maxLengthProp, 0);
    let t92;
    $[18] !== sizeProp ? (t92 = _getArrayProp(sizeProp), $[18] = sizeProp, $[19] = t92) : t92 = $[19];
    const size2 = t92, len = children.length, visibleCount = maxLength - 1, extraCount = len - visibleCount, visibleChildren = extraCount > 1 ? children.slice(extraCount, len) : children;
    T0 = StyledAvatarStack, t2 = "AvatarStack", t3 = restProps, t4 = ref, t5 = size2, $[20] !== len || $[21] !== size2 ? (t6 = len === 0 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AvatarCounter, { count: len, size: size2 }) }), $[20] = len, $[21] = size2, $[22] = t6) : t6 = $[22], $[23] !== extraCount || $[24] !== len || $[25] !== size2 ? (t7 = len !== 0 && extraCount > 1 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AvatarCounter, { count: extraCount, size: size2 }) }), $[23] = extraCount, $[24] = len, $[25] = size2, $[26] = t7) : t7 = $[26];
    let t10;
    $[27] !== size2 ? (t10 = (child, childIndex) => /* @__PURE__ */ jsx("div", { children: cloneElement(child, {
      size: size2
    }) }, String(childIndex)), $[27] = size2, $[28] = t10) : t10 = $[28], t8 = visibleChildren.map(t10), $[5] = childrenProp, $[6] = maxLengthProp, $[7] = ref, $[8] = restProps, $[9] = sizeProp, $[10] = T0, $[11] = t2, $[12] = t3, $[13] = t4, $[14] = t5, $[15] = t6, $[16] = t7, $[17] = t8;
  } else
    T0 = $[10], t2 = $[11], t3 = $[12], t4 = $[13], t5 = $[14], t6 = $[15], t7 = $[16], t8 = $[17];
  let t9;
  return $[29] !== T0 || $[30] !== t2 || $[31] !== t3 || $[32] !== t4 || $[33] !== t5 || $[34] !== t6 || $[35] !== t7 || $[36] !== t8 ? (t9 = /* @__PURE__ */ jsxs(T0, { "data-ui": t2, ...t3, ref: t4, $size: t5, children: [
    t6,
    t7,
    t8
  ] }), $[29] = T0, $[30] = t2, $[31] = t3, $[32] = t4, $[33] = t5, $[34] = t6, $[35] = t7, $[36] = t8, $[37] = t9) : t9 = $[37], t9;
});
AvatarStack.displayName = "ForwardRef(AvatarStack)";
const StyledBox = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledBox",
  componentId: "sc-1hhky9f-0"
})(boxStyle, flexItemStyle, responsiveBoxStyle, responsiveGridItemStyle, responsiveMarginStyle, responsivePaddingStyle), Box = forwardRef(function(props, ref) {
  const $ = distExports.c(109);
  let column, columnEnd, columnStart, flex, height, marginBottom, marginLeft, marginRight, marginTop, marginX, marginY, overflow, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingX, paddingY, restProps, row, rowEnd, rowStart, sizing, t0, t1, t2, t3;
  $[0] !== props ? ({
    as: t0,
    column,
    columnStart,
    columnEnd,
    display: t1,
    flex,
    height,
    margin: t2,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    overflow,
    padding: t3,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    row,
    rowStart,
    rowEnd,
    sizing,
    ...restProps
  } = props, $[0] = props, $[1] = column, $[2] = columnEnd, $[3] = columnStart, $[4] = flex, $[5] = height, $[6] = marginBottom, $[7] = marginLeft, $[8] = marginRight, $[9] = marginTop, $[10] = marginX, $[11] = marginY, $[12] = overflow, $[13] = paddingBottom, $[14] = paddingLeft, $[15] = paddingRight, $[16] = paddingTop, $[17] = paddingX, $[18] = paddingY, $[19] = restProps, $[20] = row, $[21] = rowEnd, $[22] = rowStart, $[23] = sizing, $[24] = t0, $[25] = t1, $[26] = t2, $[27] = t3) : (column = $[1], columnEnd = $[2], columnStart = $[3], flex = $[4], height = $[5], marginBottom = $[6], marginLeft = $[7], marginRight = $[8], marginTop = $[9], marginX = $[10], marginY = $[11], overflow = $[12], paddingBottom = $[13], paddingLeft = $[14], paddingRight = $[15], paddingTop = $[16], paddingX = $[17], paddingY = $[18], restProps = $[19], row = $[20], rowEnd = $[21], rowStart = $[22], sizing = $[23], t0 = $[24], t1 = $[25], t2 = $[26], t3 = $[27]);
  const asProp = t0 === void 0 ? "div" : t0, display = t1 === void 0 ? "block" : t1, margin = t2 === void 0 ? 0 : t2, padding = t3 === void 0 ? 0 : t3, t4 = typeof asProp == "string" ? asProp : void 0;
  let t5;
  $[28] !== column ? (t5 = _getArrayProp(column), $[28] = column, $[29] = t5) : t5 = $[29];
  let t6;
  $[30] !== columnStart ? (t6 = _getArrayProp(columnStart), $[30] = columnStart, $[31] = t6) : t6 = $[31];
  let t7;
  $[32] !== columnEnd ? (t7 = _getArrayProp(columnEnd), $[32] = columnEnd, $[33] = t7) : t7 = $[33];
  let t8;
  $[34] !== display ? (t8 = _getArrayProp(display), $[34] = display, $[35] = t8) : t8 = $[35];
  let t9;
  $[36] !== flex ? (t9 = _getArrayProp(flex), $[36] = flex, $[37] = t9) : t9 = $[37];
  let t10;
  $[38] !== height ? (t10 = _getArrayProp(height), $[38] = height, $[39] = t10) : t10 = $[39];
  let t11;
  $[40] !== margin ? (t11 = _getArrayProp(margin), $[40] = margin, $[41] = t11) : t11 = $[41];
  let t12;
  $[42] !== marginX ? (t12 = _getArrayProp(marginX), $[42] = marginX, $[43] = t12) : t12 = $[43];
  let t13;
  $[44] !== marginY ? (t13 = _getArrayProp(marginY), $[44] = marginY, $[45] = t13) : t13 = $[45];
  let t14;
  $[46] !== marginTop ? (t14 = _getArrayProp(marginTop), $[46] = marginTop, $[47] = t14) : t14 = $[47];
  let t15;
  $[48] !== marginRight ? (t15 = _getArrayProp(marginRight), $[48] = marginRight, $[49] = t15) : t15 = $[49];
  let t16;
  $[50] !== marginBottom ? (t16 = _getArrayProp(marginBottom), $[50] = marginBottom, $[51] = t16) : t16 = $[51];
  let t17;
  $[52] !== marginLeft ? (t17 = _getArrayProp(marginLeft), $[52] = marginLeft, $[53] = t17) : t17 = $[53];
  let t18;
  $[54] !== overflow ? (t18 = _getArrayProp(overflow), $[54] = overflow, $[55] = t18) : t18 = $[55];
  let t19;
  $[56] !== padding ? (t19 = _getArrayProp(padding), $[56] = padding, $[57] = t19) : t19 = $[57];
  let t20;
  $[58] !== paddingX ? (t20 = _getArrayProp(paddingX), $[58] = paddingX, $[59] = t20) : t20 = $[59];
  let t21;
  $[60] !== paddingY ? (t21 = _getArrayProp(paddingY), $[60] = paddingY, $[61] = t21) : t21 = $[61];
  let t22;
  $[62] !== paddingTop ? (t22 = _getArrayProp(paddingTop), $[62] = paddingTop, $[63] = t22) : t22 = $[63];
  let t23;
  $[64] !== paddingRight ? (t23 = _getArrayProp(paddingRight), $[64] = paddingRight, $[65] = t23) : t23 = $[65];
  let t24;
  $[66] !== paddingBottom ? (t24 = _getArrayProp(paddingBottom), $[66] = paddingBottom, $[67] = t24) : t24 = $[67];
  let t25;
  $[68] !== paddingLeft ? (t25 = _getArrayProp(paddingLeft), $[68] = paddingLeft, $[69] = t25) : t25 = $[69];
  let t26;
  $[70] !== row ? (t26 = _getArrayProp(row), $[70] = row, $[71] = t26) : t26 = $[71];
  let t27;
  $[72] !== rowStart ? (t27 = _getArrayProp(rowStart), $[72] = rowStart, $[73] = t27) : t27 = $[73];
  let t28;
  $[74] !== rowEnd ? (t28 = _getArrayProp(rowEnd), $[74] = rowEnd, $[75] = t28) : t28 = $[75];
  let t29;
  $[76] !== sizing ? (t29 = _getArrayProp(sizing), $[76] = sizing, $[77] = t29) : t29 = $[77];
  let t30;
  return $[78] !== asProp || $[79] !== props.children || $[80] !== ref || $[81] !== restProps || $[82] !== t10 || $[83] !== t11 || $[84] !== t12 || $[85] !== t13 || $[86] !== t14 || $[87] !== t15 || $[88] !== t16 || $[89] !== t17 || $[90] !== t18 || $[91] !== t19 || $[92] !== t20 || $[93] !== t21 || $[94] !== t22 || $[95] !== t23 || $[96] !== t24 || $[97] !== t25 || $[98] !== t26 || $[99] !== t27 || $[100] !== t28 || $[101] !== t29 || $[102] !== t4 || $[103] !== t5 || $[104] !== t6 || $[105] !== t7 || $[106] !== t8 || $[107] !== t9 ? (t30 = /* @__PURE__ */ jsx(StyledBox, { "data-as": t4, "data-ui": "Box", ...restProps, $column: t5, $columnStart: t6, $columnEnd: t7, $display: t8, $flex: t9, $height: t10, $margin: t11, $marginX: t12, $marginY: t13, $marginTop: t14, $marginRight: t15, $marginBottom: t16, $marginLeft: t17, $overflow: t18, $padding: t19, $paddingX: t20, $paddingY: t21, $paddingTop: t22, $paddingRight: t23, $paddingBottom: t24, $paddingLeft: t25, $row: t26, $rowStart: t27, $rowEnd: t28, $sizing: t29, as: asProp, ref, children: props.children }), $[78] = asProp, $[79] = props.children, $[80] = ref, $[81] = restProps, $[82] = t10, $[83] = t11, $[84] = t12, $[85] = t13, $[86] = t14, $[87] = t15, $[88] = t16, $[89] = t17, $[90] = t18, $[91] = t19, $[92] = t20, $[93] = t21, $[94] = t22, $[95] = t23, $[96] = t24, $[97] = t25, $[98] = t26, $[99] = t27, $[100] = t28, $[101] = t29, $[102] = t4, $[103] = t5, $[104] = t6, $[105] = t7, $[106] = t8, $[107] = t9, $[108] = t30) : t30 = $[108], t30;
});
Box.displayName = "ForwardRef(Box)";
function textBaseStyle(props) {
  const {
    $accent,
    $muted
  } = props, {
    font
  } = getTheme_v2(props.theme);
  return css`
    color: var(--card-fg-color);

    ${$accent && css`
      color: var(--card-accent-fg-color);
    `}

    ${$muted && css`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${font.code.family};
      border-radius: 1px;
      background-color: var(--card-code-bg-color);
      color: var(--card-code-fg-color);
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
      color: var(--card-link-color);
      outline: none;

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }

      &:focus {
        box-shadow:
          0 0 0 1px var(--card-bg-color),
          0 0 0 3px var(--card-focus-ring-color);
      }

      &:focus:not(:focus-visible) {
        box-shadow: none;
      }
    }

    & strong {
      font-weight: ${font.text.weights.bold};
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
      color: var(--card-icon-color);

      & path {
        vector-effect: non-scaling-stroke !important;
      }
    }
  `;
}
const StyledText = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledText",
  componentId: "sc-11ov82j-0"
})(responsiveTextFont, responsiveTextAlignStyle, textBaseStyle), Text = forwardRef(function(props, ref) {
  const $ = distExports.c(26);
  let align, childrenProp, restProps, t0, t1, t2, textOverflow, weight;
  $[0] !== props ? ({
    accent: t0,
    align,
    children: childrenProp,
    muted: t1,
    size: t2,
    textOverflow,
    weight,
    ...restProps
  } = props, $[0] = props, $[1] = align, $[2] = childrenProp, $[3] = restProps, $[4] = t0, $[5] = t1, $[6] = t2, $[7] = textOverflow, $[8] = weight) : (align = $[1], childrenProp = $[2], restProps = $[3], t0 = $[4], t1 = $[5], t2 = $[6], textOverflow = $[7], weight = $[8]);
  const accent = t0 === void 0 ? !1 : t0, muted = t1 === void 0 ? !1 : t1, size2 = t2 === void 0 ? 2 : t2;
  let children = childrenProp;
  if (textOverflow === "ellipsis") {
    let t32;
    $[9] !== children ? (t32 = /* @__PURE__ */ jsx(SpanWithTextOverflow, { children }), $[9] = children, $[10] = t32) : t32 = $[10], children = t32;
  }
  let t3;
  $[11] !== align ? (t3 = _getArrayProp(align), $[11] = align, $[12] = t3) : t3 = $[12];
  let t4;
  $[13] !== size2 ? (t4 = _getArrayProp(size2), $[13] = size2, $[14] = t4) : t4 = $[14];
  let t5;
  $[15] !== children ? (t5 = /* @__PURE__ */ jsx("span", { children }), $[15] = children, $[16] = t5) : t5 = $[16];
  let t6;
  return $[17] !== accent || $[18] !== muted || $[19] !== ref || $[20] !== restProps || $[21] !== t3 || $[22] !== t4 || $[23] !== t5 || $[24] !== weight ? (t6 = /* @__PURE__ */ jsx(StyledText, { "data-ui": "Text", ...restProps, $accent: accent, $align: t3, $muted: muted, ref, $size: t4, $weight: weight, children: t5 }), $[17] = accent, $[18] = muted, $[19] = ref, $[20] = restProps, $[21] = t3, $[22] = t4, $[23] = t5, $[24] = weight, $[25] = t6) : t6 = $[25], t6;
});
Text.displayName = "ForwardRef(Text)";
function badgeStyle(props) {
  const {
    $tone
  } = props;
  return {
    "--card-bg-color": `var(--card-badge-${$tone}-bg-color)`,
    "--card-fg-color": `var(--card-badge-${$tone}-fg-color)`,
    backgroundColor: "var(--card-bg-color)",
    cursor: "default",
    "&:not([hidden])": {
      display: "inline-block",
      verticalAlign: "top"
    }
  };
}
const StyledBadge = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledBadge",
  componentId: "sc-5u140l-0"
})(responsiveRadiusStyle, badgeStyle), Badge = forwardRef(function(props, ref) {
  const $ = distExports.c(21);
  let children, restProps, t0, t1, t2, t3;
  if ($[0] !== props) {
    const {
      children: t42,
      fontSize: t52,
      mode: _deprecated_mode,
      padding: t62,
      radius: t72,
      tone: t8,
      ...t9
    } = props;
    children = t42, t0 = t52, t1 = t62, t2 = t72, t3 = t8, restProps = t9, $[0] = props, $[1] = children, $[2] = restProps, $[3] = t0, $[4] = t1, $[5] = t2, $[6] = t3;
  } else
    children = $[1], restProps = $[2], t0 = $[3], t1 = $[4], t2 = $[5], t3 = $[6];
  const fontSize2 = t0 === void 0 ? 1 : t0, padding = t1 === void 0 ? 1 : t1, radius = t2 === void 0 ? "full" : t2, tone = t3 === void 0 ? "default" : t3;
  let t4;
  $[7] !== radius ? (t4 = _getArrayProp(radius), $[7] = radius, $[8] = t4) : t4 = $[8];
  let t5;
  $[9] !== padding ? (t5 = _getArrayProp(padding), $[9] = padding, $[10] = t5) : t5 = $[10];
  let t6;
  $[11] !== children || $[12] !== fontSize2 ? (t6 = /* @__PURE__ */ jsx(Text, { size: fontSize2, children }), $[11] = children, $[12] = fontSize2, $[13] = t6) : t6 = $[13];
  let t7;
  return $[14] !== ref || $[15] !== restProps || $[16] !== t4 || $[17] !== t5 || $[18] !== t6 || $[19] !== tone ? (t7 = /* @__PURE__ */ jsx(StyledBadge, { "data-ui": "Badge", ...restProps, $tone: tone, $radius: t4, padding: t5, ref, children: t6 }), $[14] = ref, $[15] = restProps, $[16] = t4, $[17] = t5, $[18] = t6, $[19] = tone, $[20] = t7) : t7 = $[20], t7;
});
Badge.displayName = "ForwardRef(Badge)";
const StyledFlex = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledFlex",
  componentId: "sc-oxesg3-0"
})(flexItemStyle, responsiveFlexStyle), Flex = forwardRef(function(props, ref) {
  const $ = distExports.c(27);
  let align, as, gap, justify, restProps, t0, wrap;
  $[0] !== props ? ({
    align,
    as,
    direction: t0,
    gap,
    justify,
    wrap,
    ...restProps
  } = props, $[0] = props, $[1] = align, $[2] = as, $[3] = gap, $[4] = justify, $[5] = restProps, $[6] = t0, $[7] = wrap) : (align = $[1], as = $[2], gap = $[3], justify = $[4], restProps = $[5], t0 = $[6], wrap = $[7]);
  const direction = t0 === void 0 ? "row" : t0;
  let t1;
  $[8] !== align ? (t1 = _getArrayProp(align), $[8] = align, $[9] = t1) : t1 = $[9];
  let t2;
  $[10] !== direction ? (t2 = _getArrayProp(direction), $[10] = direction, $[11] = t2) : t2 = $[11];
  let t3;
  $[12] !== gap ? (t3 = _getArrayProp(gap), $[12] = gap, $[13] = t3) : t3 = $[13];
  let t4;
  $[14] !== justify ? (t4 = _getArrayProp(justify), $[14] = justify, $[15] = t4) : t4 = $[15];
  let t5;
  $[16] !== wrap ? (t5 = _getArrayProp(wrap), $[16] = wrap, $[17] = t5) : t5 = $[17];
  let t6;
  return $[18] !== as || $[19] !== ref || $[20] !== restProps || $[21] !== t1 || $[22] !== t2 || $[23] !== t3 || $[24] !== t4 || $[25] !== t5 ? (t6 = /* @__PURE__ */ jsx(StyledFlex, { "data-ui": "Flex", ...restProps, $align: t1, $direction: t2, $gap: t3, $justify: t4, $wrap: t5, forwardedAs: as, ref }), $[18] = as, $[19] = ref, $[20] = restProps, $[21] = t1, $[22] = t2, $[23] = t3, $[24] = t4, $[25] = t5, $[26] = t6) : t6 = $[26], t6;
});
Flex.displayName = "ForwardRef(Flex)";
const rotate$1 = keyframes$1`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`, StyledSpinner = styled(Text).withConfig({
  displayName: "StyledSpinner",
  componentId: "sc-124hnd0-0"
})`& > span > svg{animation:${rotate$1} 500ms linear infinite;}`, Spinner = forwardRef(function(props, ref) {
  const $ = distExports.c(4);
  let t0;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = /* @__PURE__ */ jsx(SpinnerIcon, {}), $[0] = t0) : t0 = $[0];
  let t1;
  return $[1] !== props || $[2] !== ref ? (t1 = /* @__PURE__ */ jsx(StyledSpinner, { "data-ui": "Spinner", ...props, ref, children: t0 }), $[1] = props, $[2] = ref, $[3] = t1) : t1 = $[3], t1;
});
Spinner.displayName = "ForwardRef(Spinner)";
function _cardColorStyle(base, color2, checkered = !1) {
  return {
    // from base
    "--card-backdrop-color": base.backdrop,
    "--card-focus-ring-color": base.focusRing,
    "--card-shadow-outline-color": base.shadow.outline,
    "--card-shadow-umbra-color": base.shadow.umbra,
    "--card-shadow-penumbra-color": base.shadow.penumbra,
    "--card-shadow-ambient-color": base.shadow.ambient,
    // from state
    "--card-accent-fg-color": color2.accent.fg,
    "--card-avatar-gray-bg-color": color2.avatar.gray.bg,
    "--card-avatar-gray-fg-color": color2.avatar.gray.fg,
    "--card-avatar-blue-bg-color": color2.avatar.blue.bg,
    "--card-avatar-blue-fg-color": color2.avatar.blue.fg,
    "--card-avatar-purple-bg-color": color2.avatar.purple.bg,
    "--card-avatar-purple-fg-color": color2.avatar.purple.fg,
    "--card-avatar-magenta-bg-color": color2.avatar.magenta.bg,
    "--card-avatar-magenta-fg-color": color2.avatar.magenta.fg,
    "--card-avatar-red-bg-color": color2.avatar.red.bg,
    "--card-avatar-red-fg-color": color2.avatar.red.fg,
    "--card-avatar-orange-bg-color": color2.avatar.orange.bg,
    "--card-avatar-orange-fg-color": color2.avatar.orange.fg,
    "--card-avatar-yellow-bg-color": color2.avatar.yellow.bg,
    "--card-avatar-yellow-fg-color": color2.avatar.yellow.fg,
    "--card-avatar-green-bg-color": color2.avatar.green.bg,
    "--card-avatar-green-fg-color": color2.avatar.green.fg,
    "--card-avatar-cyan-bg-color": color2.avatar.cyan.bg,
    "--card-avatar-cyan-fg-color": color2.avatar.cyan.fg,
    "--card-bg-color": color2.bg,
    "--card-bg-image": checkered ? `repeating-conic-gradient(${color2.bg} 0% 25%, ${color2.muted.bg} 0% 50%)` : void 0,
    "--card-border-color": color2.border,
    "--card-badge-default-bg-color": color2.badge.default.bg,
    "--card-badge-default-dot-color": color2.badge.default.dot,
    "--card-badge-default-fg-color": color2.badge.default.fg,
    "--card-badge-default-icon-color": color2.badge.default.icon,
    "--card-badge-neutral-bg-color": color2.badge.neutral?.bg,
    "--card-badge-neutral-dot-color": color2.badge.neutral?.dot,
    "--card-badge-neutral-fg-color": color2.badge.neutral?.fg,
    "--card-badge-neutral-icon-color": color2.badge.neutral?.icon,
    "--card-badge-primary-bg-color": color2.badge.primary.bg,
    "--card-badge-primary-dot-color": color2.badge.primary.dot,
    "--card-badge-primary-fg-color": color2.badge.primary.fg,
    "--card-badge-primary-icon-color": color2.badge.primary.icon,
    "--card-badge-suggest-bg-color": color2.badge.suggest?.bg,
    "--card-badge-suggest-dot-color": color2.badge.suggest?.dot,
    "--card-badge-suggest-fg-color": color2.badge.suggest?.fg,
    "--card-badge-suggest-icon-color": color2.badge.suggest?.icon,
    "--card-badge-positive-bg-color": color2.badge.positive.bg,
    "--card-badge-positive-dot-color": color2.badge.positive.dot,
    "--card-badge-positive-fg-color": color2.badge.positive.fg,
    "--card-badge-positive-icon-color": color2.badge.positive.icon,
    "--card-badge-caution-bg-color": color2.badge.caution.bg,
    "--card-badge-caution-dot-color": color2.badge.caution.dot,
    "--card-badge-caution-fg-color": color2.badge.caution.fg,
    "--card-badge-caution-icon-color": color2.badge.caution.icon,
    "--card-badge-critical-bg-color": color2.badge.critical.bg,
    "--card-badge-critical-dot-color": color2.badge.critical.dot,
    "--card-badge-critical-fg-color": color2.badge.critical.fg,
    "--card-badge-critical-icon-color": color2.badge.critical.icon,
    "--card-code-bg-color": color2.code.bg,
    "--card-code-fg-color": color2.code.fg,
    "--card-fg-color": color2.fg,
    "--card-icon-color": color2.icon,
    "--card-kbd-bg-color": color2.kbd.bg,
    "--card-kbd-border-color": color2.kbd.border,
    "--card-kbd-fg-color": color2.kbd.fg,
    "--card-link-fg-color": color2.link.fg,
    "--card-muted-bg-color": color2.muted.bg,
    "--card-muted-fg-color": color2.muted.fg,
    "--card-skeleton-color-from": color2.skeleton.from,
    "--card-skeleton-color-to": color2.skeleton.to,
    // deprecated variables (kept for legacy)
    "--card-bg2-color": color2.muted.bg,
    "--card-link-color": color2.link.fg,
    "--card-hairline-soft-color": color2.border,
    "--card-hairline-hard-color": color2.border
  };
}
function buttonBaseStyles(props) {
  const {
    $width
  } = props, {
    style
  } = getTheme_v2(props.theme);
  return css`
    ${style?.button};

    -webkit-font-smoothing: inherit;
    appearance: none;
    display: inline-flex;
    align-items: center;
    font: inherit;
    border: 0;
    outline: none;
    user-select: none;
    text-decoration: none;
    border: 0;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    white-space: nowrap;
    text-align: left;
    position: relative;
    vertical-align: top;

    ${$width === "fill" && css`
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    `}

    & > span {
      display: block;
      flex: 1;
      min-width: 0;
      border-radius: inherit;
    }

    &::-moz-focus-inner {
      border: 0;
      padding: 0;
    }
  `;
}
function combineBoxShadow(...boxShadows) {
  return boxShadows.filter(Boolean).join(",");
}
function buttonColorStyles(props) {
  const {
    $mode
  } = props, {
    button,
    color: baseColor,
    style
  } = getTheme_v2(props.theme), shadow = props.$mode === "ghost", mode = baseColor.button[$mode] || baseColor.button.default, color2 = mode[props.$tone] || mode.default, border2 = {
    width: button.border.width,
    color: "var(--card-border-color)"
  }, defaultBoxShadow = void 0;
  return [_cardColorStyle(baseColor, color2.enabled), {
    backgroundColor: "var(--card-bg-color)",
    color: "var(--card-fg-color)",
    boxShadow: focusRingBorderStyle(border2),
    '&:disabled, &[data-disabled="true"]': _cardColorStyle(baseColor, color2.disabled),
    "&:not([data-disabled='true'])": {
      boxShadow: combineBoxShadow(focusRingBorderStyle(border2), shadow ? defaultBoxShadow : void 0),
      "&:focus": {
        boxShadow: focusRingStyle({
          base: baseColor,
          border: {
            width: 2,
            color: baseColor.bg
          },
          focusRing: button.focusRing
        })
      },
      "&:focus:not(:focus-visible)": {
        boxShadow: combineBoxShadow(focusRingBorderStyle(border2), shadow ? defaultBoxShadow : void 0)
      },
      "@media (hover: hover)": {
        "&:hover": _cardColorStyle(baseColor, color2.hovered),
        "&:active": _cardColorStyle(baseColor, color2.pressed),
        "&[data-hovered]": _cardColorStyle(baseColor, color2.hovered)
      },
      "&[data-selected]": _cardColorStyle(baseColor, color2.pressed)
    }
  }, style?.button?.root].filter(Boolean);
}
const StyledButton = /* @__PURE__ */ styled.button.withConfig({
  displayName: "StyledButton",
  componentId: "sc-aaekt4-0"
})(responsiveRadiusStyle, buttonBaseStyles, buttonColorStyles), LoadingBox = styled.div.withConfig({
  displayName: "LoadingBox",
  componentId: "sc-aaekt4-1"
})`position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:var(--card-bg-color);border-radius:inherit;z-index:1;box-shadow:inherit;`, Button = forwardRef(function(props, ref) {
  const $ = distExports.c(86);
  let IconComponent, IconRightComponent, children, disabled, loading, paddingBottomProp, paddingLeftProp, paddingRightProp, paddingTopProp, paddingXProp, paddingYProp, restProps, selected, t0, t1, t2, t3, t4, t5, t6, t7, t8, text, textAlign, textWeight, width;
  $[0] !== props ? ({
    children,
    disabled,
    fontSize: t0,
    icon: IconComponent,
    iconRight: IconRightComponent,
    justify: t1,
    loading,
    mode: t2,
    padding: t3,
    paddingX: paddingXProp,
    paddingY: paddingYProp,
    paddingTop: paddingTopProp,
    paddingBottom: paddingBottomProp,
    paddingLeft: paddingLeftProp,
    paddingRight: paddingRightProp,
    radius: t4,
    selected,
    space: t5,
    text,
    textAlign,
    textWeight,
    tone: t6,
    type: t7,
    muted: t8,
    width,
    ...restProps
  } = props, $[0] = props, $[1] = IconComponent, $[2] = IconRightComponent, $[3] = children, $[4] = disabled, $[5] = loading, $[6] = paddingBottomProp, $[7] = paddingLeftProp, $[8] = paddingRightProp, $[9] = paddingTopProp, $[10] = paddingXProp, $[11] = paddingYProp, $[12] = restProps, $[13] = selected, $[14] = t0, $[15] = t1, $[16] = t2, $[17] = t3, $[18] = t4, $[19] = t5, $[20] = t6, $[21] = t7, $[22] = t8, $[23] = text, $[24] = textAlign, $[25] = textWeight, $[26] = width) : (IconComponent = $[1], IconRightComponent = $[2], children = $[3], disabled = $[4], loading = $[5], paddingBottomProp = $[6], paddingLeftProp = $[7], paddingRightProp = $[8], paddingTopProp = $[9], paddingXProp = $[10], paddingYProp = $[11], restProps = $[12], selected = $[13], t0 = $[14], t1 = $[15], t2 = $[16], t3 = $[17], t4 = $[18], t5 = $[19], t6 = $[20], t7 = $[21], t8 = $[22], text = $[23], textAlign = $[24], textWeight = $[25], width = $[26]);
  const fontSize2 = t0 === void 0 ? 1 : t0, justifyProp = t1 === void 0 ? "center" : t1, mode = t2 === void 0 ? "default" : t2, paddingProp = t3 === void 0 ? 3 : t3, radiusProp = t4 === void 0 ? 2 : t4, spaceProp = t5 === void 0 ? 3 : t5, tone = t6 === void 0 ? "default" : t6, type = t7 === void 0 ? "button" : t7, muted = t8 === void 0 ? !1 : t8, {
    button
  } = useTheme_v2();
  let t9;
  $[27] !== justifyProp ? (t9 = _getArrayProp(justifyProp), $[27] = justifyProp, $[28] = t9) : t9 = $[28];
  const justify = t9;
  let t10;
  $[29] !== paddingProp ? (t10 = _getArrayProp(paddingProp), $[29] = paddingProp, $[30] = t10) : t10 = $[30];
  const padding = t10;
  let t11;
  $[31] !== paddingXProp ? (t11 = _getArrayProp(paddingXProp), $[31] = paddingXProp, $[32] = t11) : t11 = $[32];
  const paddingX = t11;
  let t12;
  $[33] !== paddingYProp ? (t12 = _getArrayProp(paddingYProp), $[33] = paddingYProp, $[34] = t12) : t12 = $[34];
  const paddingY = t12;
  let t13;
  $[35] !== paddingTopProp ? (t13 = _getArrayProp(paddingTopProp), $[35] = paddingTopProp, $[36] = t13) : t13 = $[36];
  const paddingTop = t13;
  let t14;
  $[37] !== paddingBottomProp ? (t14 = _getArrayProp(paddingBottomProp), $[37] = paddingBottomProp, $[38] = t14) : t14 = $[38];
  const paddingBottom = t14;
  let t15;
  $[39] !== paddingLeftProp ? (t15 = _getArrayProp(paddingLeftProp), $[39] = paddingLeftProp, $[40] = t15) : t15 = $[40];
  const paddingLeft = t15;
  let t16;
  $[41] !== paddingRightProp ? (t16 = _getArrayProp(paddingRightProp), $[41] = paddingRightProp, $[42] = t16) : t16 = $[42];
  const paddingRight = t16;
  let t17;
  $[43] !== radiusProp ? (t17 = _getArrayProp(radiusProp), $[43] = radiusProp, $[44] = t17) : t17 = $[44];
  const radius = t17;
  let t18;
  $[45] !== spaceProp ? (t18 = _getArrayProp(spaceProp), $[45] = spaceProp, $[46] = t18) : t18 = $[46];
  const space = t18;
  let t19;
  $[47] !== padding || $[48] !== paddingBottom || $[49] !== paddingLeft || $[50] !== paddingRight || $[51] !== paddingTop || $[52] !== paddingX || $[53] !== paddingY ? (t19 = {
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight
  }, $[47] = padding, $[48] = paddingBottom, $[49] = paddingLeft, $[50] = paddingRight, $[51] = paddingTop, $[52] = paddingX, $[53] = paddingY, $[54] = t19) : t19 = $[54];
  const boxProps = t19, t20 = !!(loading || disabled), t21 = selected ? "" : void 0, t22 = !!(loading || disabled);
  let t23;
  $[55] !== loading ? (t23 = !!loading && /* @__PURE__ */ jsx(LoadingBox, { children: /* @__PURE__ */ jsx(Spinner, {}) }), $[55] = loading, $[56] = t23) : t23 = $[56];
  let t24;
  $[57] !== IconComponent || $[58] !== IconRightComponent || $[59] !== boxProps || $[60] !== button || $[61] !== fontSize2 || $[62] !== justify || $[63] !== muted || $[64] !== space || $[65] !== text || $[66] !== textAlign || $[67] !== textWeight ? (t24 = (IconComponent || text || IconRightComponent) && /* @__PURE__ */ jsx(Box, { as: "span", ...boxProps, children: /* @__PURE__ */ jsxs(Flex, { as: "span", justify, gap: space, children: [
    IconComponent && /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
      isValidElement(IconComponent) && IconComponent,
      reactIsExports.isValidElementType(IconComponent) && /* @__PURE__ */ jsx(IconComponent, {})
    ] }),
    text && /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(Text, { muted, align: textAlign, size: fontSize2, textOverflow: "ellipsis", weight: textWeight ?? button.textWeight, children: text }) }),
    IconRightComponent && /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
      isValidElement(IconRightComponent) && IconRightComponent,
      reactIsExports.isValidElementType(IconRightComponent) && /* @__PURE__ */ jsx(IconRightComponent, {})
    ] })
  ] }) }), $[57] = IconComponent, $[58] = IconRightComponent, $[59] = boxProps, $[60] = button, $[61] = fontSize2, $[62] = justify, $[63] = muted, $[64] = space, $[65] = text, $[66] = textAlign, $[67] = textWeight, $[68] = t24) : t24 = $[68];
  let t25;
  $[69] !== boxProps || $[70] !== children ? (t25 = children && /* @__PURE__ */ jsx(Box, { as: "span", ...boxProps, children }), $[69] = boxProps, $[70] = children, $[71] = t25) : t25 = $[71];
  let t26;
  return $[72] !== mode || $[73] !== radius || $[74] !== ref || $[75] !== restProps || $[76] !== t20 || $[77] !== t21 || $[78] !== t22 || $[79] !== t23 || $[80] !== t24 || $[81] !== t25 || $[82] !== tone || $[83] !== type || $[84] !== width ? (t26 = /* @__PURE__ */ jsxs(StyledButton, { "data-ui": "Button", ...restProps, $mode: mode, $radius: radius, $tone: tone, "data-disabled": t20, "data-selected": t21, disabled: t22, ref, type, $width: width, children: [
    t23,
    t24,
    t25
  ] }), $[72] = mode, $[73] = radius, $[74] = ref, $[75] = restProps, $[76] = t20, $[77] = t21, $[78] = t22, $[79] = t23, $[80] = t24, $[81] = t25, $[82] = tone, $[83] = type, $[84] = width, $[85] = t26) : t26 = $[85], t26;
});
Button.displayName = "ForwardRef(Button)";
function cardStyle(props) {
  return [cardBaseStyle(props), cardColorStyle(props)];
}
function cardBaseStyle(props) {
  const {
    $checkered
  } = props, {
    space
  } = getTheme_v2(props.theme);
  return css`
    ${$checkered && css`
      background-size: ${space[3]}px ${space[3]}px;
      background-position: 50% 50%;
      background-image: var(--card-bg-image);
    `}

    &[data-as='button'] {
      -webkit-font-smoothing: inherit;
      appearance: none;
      outline: none;
      font: inherit;
      text-align: inherit;
      border: 0;
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    }

    /* &:is(a) */
    &[data-as='a'] {
      outline: none;
      text-decoration: none;
    }

    /* &:is(pre) */
    &[data-as='pre'] {
      font: inherit;
    }
  `;
}
function cardColorStyle(props) {
  const {
    $checkered,
    $focusRing,
    $muted
  } = props, {
    card,
    color: color2,
    style
  } = getTheme_v2(props.theme), border2 = {
    width: card.border.width,
    color: "var(--card-border-color)"
  };
  return css`
    color-scheme: ${color2._dark ? "dark" : "light"};

    ${_cardColorStyle(color2, color2, $checkered)}

    background-color: ${$muted ? "var(--card-muted-bg-color)" : "var(--card-bg-color)"};
    color: var(--card-fg-color);

    /* &:is(button) */
    &[data-as='button'] {
      --card-focus-ring-box-shadow: none;

      cursor: default;
      box-shadow: var(--card-focus-ring-box-shadow);

      &:disabled {
        ${_cardColorStyle(color2, color2.selectable.default.disabled, $checkered)}
      }

      &:not(:disabled) {
        &[data-pressed] {
          ${_cardColorStyle(color2, color2.selectable.default.pressed, $checkered)}
        }

        &[data-selected] {
          ${_cardColorStyle(color2, color2.selectable.default.selected, $checkered)}
        }

        @media (hover: hover) {
          &:not([data-pressed]):not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${_cardColorStyle(color2, color2.selectable.default.hovered, $checkered)}
            }

            &:active {
              ${_cardColorStyle(color2, color2.selectable.default.pressed, $checkered)}
            }
          }
        }

        &:focus-visible {
          --card-focus-ring-box-shadow: ${$focusRing ? focusRingStyle({
    base: color2,
    border: border2,
    focusRing: card.focusRing
  }) : void 0};
        }
      }
    }

    /* &:is(a) */
    &[data-as='a'] {
      cursor: pointer;
      box-shadow: var(--card-focus-ring-box-shadow);

      &[data-disabled] {
        ${_cardColorStyle(color2, color2.selectable.default.disabled, $checkered)}
      }

      &:not([data-disabled]) {
        &[data-pressed] {
          ${_cardColorStyle(color2, color2.selectable.default.pressed, $checkered)}
        }

        &[data-selected] {
          ${_cardColorStyle(color2, color2.selectable.default.selected, $checkered)}
        }

        @media (hover: hover) {
          &:not([data-pressed]):not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${_cardColorStyle(color2, color2.selectable.default.hovered, $checkered)}
            }

            &:active {
              ${_cardColorStyle(color2, color2.selectable.default.pressed, $checkered)}
            }
          }
        }

        &:focus-visible {
          --card-focus-ring-box-shadow: ${$focusRing ? focusRingStyle({
    base: color2,
    border: border2,
    focusRing: card.focusRing
  }) : void 0};
        }
      }
    }

    ${style?.card?.root}
  `;
}
const StyledCard = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledCard",
  componentId: "sc-osnro2-0"
})(responsiveBorderStyle, responsiveRadiusStyle, responsiveShadowStyle, cardStyle), Card = forwardRef(function(props, ref) {
  const $ = distExports.c(56);
  let asProp, border2, borderBottom2, borderLeft2, borderRight2, borderTop2, muted, pressed, restProps, scheme, selected, shadow, t0, t1, t2, t3;
  $[0] !== props ? ({
    __unstable_checkered: t0,
    __unstable_focusRing: t1,
    as: asProp,
    border: border2,
    borderTop: borderTop2,
    borderRight: borderRight2,
    borderBottom: borderBottom2,
    borderLeft: borderLeft2,
    muted,
    pressed,
    radius: t2,
    scheme,
    selected,
    shadow,
    tone: t3,
    ...restProps
  } = props, $[0] = props, $[1] = asProp, $[2] = border2, $[3] = borderBottom2, $[4] = borderLeft2, $[5] = borderRight2, $[6] = borderTop2, $[7] = muted, $[8] = pressed, $[9] = restProps, $[10] = scheme, $[11] = selected, $[12] = shadow, $[13] = t0, $[14] = t1, $[15] = t2, $[16] = t3) : (asProp = $[1], border2 = $[2], borderBottom2 = $[3], borderLeft2 = $[4], borderRight2 = $[5], borderTop2 = $[6], muted = $[7], pressed = $[8], restProps = $[9], scheme = $[10], selected = $[11], shadow = $[12], t0 = $[13], t1 = $[14], t2 = $[15], t3 = $[16]);
  const checkered = t0 === void 0 ? !1 : t0, focusRing = t1 === void 0 ? !1 : t1, radius = t2 === void 0 ? 0 : t2, toneProp = t3 === void 0 ? "default" : t3, as = reactIsExports.isValidElementType(asProp) ? asProp : "div", rootTheme = useRootTheme(), tone = toneProp === "inherit" ? rootTheme.tone : toneProp, t4 = typeof as == "string" ? as : void 0, t5 = rootTheme.scheme;
  let t6;
  $[17] !== border2 ? (t6 = _getArrayProp(border2), $[17] = border2, $[18] = t6) : t6 = $[18];
  let t7;
  $[19] !== borderTop2 ? (t7 = _getArrayProp(borderTop2), $[19] = borderTop2, $[20] = t7) : t7 = $[20];
  let t8;
  $[21] !== borderRight2 ? (t8 = _getArrayProp(borderRight2), $[21] = borderRight2, $[22] = t8) : t8 = $[22];
  let t9;
  $[23] !== borderBottom2 ? (t9 = _getArrayProp(borderBottom2), $[23] = borderBottom2, $[24] = t9) : t9 = $[24];
  let t10;
  $[25] !== borderLeft2 ? (t10 = _getArrayProp(borderLeft2), $[25] = borderLeft2, $[26] = t10) : t10 = $[26];
  let t11;
  $[27] !== radius ? (t11 = _getArrayProp(radius), $[27] = radius, $[28] = t11) : t11 = $[28];
  let t12;
  $[29] !== shadow ? (t12 = _getArrayProp(shadow), $[29] = shadow, $[30] = t12) : t12 = $[30];
  const t13 = checkered ? "" : void 0, t14 = pressed ? "" : void 0, t15 = selected ? "" : void 0;
  let t16;
  $[31] !== as || $[32] !== checkered || $[33] !== focusRing || $[34] !== muted || $[35] !== ref || $[36] !== restProps || $[37] !== rootTheme.scheme || $[38] !== selected || $[39] !== t10 || $[40] !== t11 || $[41] !== t12 || $[42] !== t13 || $[43] !== t14 || $[44] !== t15 || $[45] !== t4 || $[46] !== t6 || $[47] !== t7 || $[48] !== t8 || $[49] !== t9 || $[50] !== tone ? (t16 = /* @__PURE__ */ jsx(StyledCard, { "data-as": t4, "data-scheme": t5, "data-ui": "Card", "data-tone": tone, ...restProps, $border: t6, $borderTop: t7, $borderRight: t8, $borderBottom: t9, $borderLeft: t10, $checkered: checkered, $focusRing: focusRing, $muted: muted, $radius: t11, $shadow: t12, $tone: tone, "data-checkered": t13, "data-pressed": t14, "data-selected": t15, forwardedAs: as, ref, selected }), $[31] = as, $[32] = checkered, $[33] = focusRing, $[34] = muted, $[35] = ref, $[36] = restProps, $[37] = rootTheme.scheme, $[38] = selected, $[39] = t10, $[40] = t11, $[41] = t12, $[42] = t13, $[43] = t14, $[44] = t15, $[45] = t4, $[46] = t6, $[47] = t7, $[48] = t8, $[49] = t9, $[50] = tone, $[51] = t16) : t16 = $[51];
  let t17;
  return $[52] !== scheme || $[53] !== t16 || $[54] !== tone ? (t17 = /* @__PURE__ */ jsx(ThemeColorProvider, { scheme, tone, children: t16 }), $[52] = scheme, $[53] = t16, $[54] = tone, $[55] = t17) : t17 = $[55], t17;
});
Card.displayName = "ForwardRef(Card)";
function useClickOutsideEvent(listener, t0, boundaryElement) {
  const $ = distExports.c(9), elementsArg = t0 === void 0 ? _temp$8 : t0;
  let t1;
  $[0] !== boundaryElement || $[1] !== elementsArg || $[2] !== listener ? (t1 = (evt) => {
    if (!listener)
      return;
    const target = evt.target;
    if (!(target instanceof Node))
      return;
    const elements = elementsArg().flat();
    for (const el of elements)
      if (el && (target === el || el.contains(target)))
        return;
    listener(evt);
  }, $[0] = boundaryElement, $[1] = elementsArg, $[2] = listener, $[3] = t1) : t1 = $[3];
  const onEvent = useEffectEvent(t1), hasListener = !!listener;
  let t2;
  $[4] !== hasListener || $[5] !== onEvent ? (t2 = () => {
    if (!hasListener)
      return;
    const handleEvent = (evt_0) => onEvent(evt_0);
    return document.addEventListener("mousedown", handleEvent), () => {
      document.removeEventListener("mousedown", handleEvent);
    };
  }, $[4] = hasListener, $[5] = onEvent, $[6] = t2) : t2 = $[6];
  let t3;
  $[7] !== hasListener ? (t3 = [hasListener], $[7] = hasListener, $[8] = t3) : t3 = $[8], useEffect(t2, t3), useDebugValue(listener ? "MouseDown On" : "MouseDown Off");
}
function _temp$8() {
  return EMPTY_ARRAY;
}
function useCustomValidity(ref, customValidity) {
  const $ = distExports.c(4);
  let t0, t1;
  $[0] !== customValidity || $[1] !== ref ? (t0 = () => {
    ref.current?.setCustomValidity(customValidity || "");
  }, t1 = [customValidity, ref], $[0] = customValidity, $[1] = ref, $[2] = t0, $[3] = t1) : (t0 = $[2], t1 = $[3]), useEffect(t0, t1);
}
const _ResizeObserver = typeof document < "u" && typeof window < "u" && window.ResizeObserver ? window.ResizeObserver : ResizeObserver$1, _elementSizeObserver = _createElementSizeObserver();
function _createElementRectValueListener() {
  return {
    subscribe(element, subscriber) {
      const resizeObserver = new _ResizeObserver(([entry]) => {
        subscriber({
          _contentRect: entry.contentRect,
          border: {
            width: entry.borderBoxSize[0].inlineSize,
            height: entry.borderBoxSize[0].blockSize
          },
          content: {
            width: entry.contentRect.width,
            height: entry.contentRect.height
          }
        });
      });
      return resizeObserver.observe(element), () => {
        resizeObserver.unobserve(element), resizeObserver.disconnect();
      };
    }
  };
}
function _createElementSizeObserver() {
  const disposeCache = /* @__PURE__ */ new WeakMap(), subscribersCache = /* @__PURE__ */ new WeakMap();
  return {
    subscribe(element, subscriber) {
      const subscribers = subscribersCache.get(element) || [];
      let dispose = disposeCache.get(element);
      return subscribersCache.has(element) || (subscribersCache.set(element, subscribers), dispose = _createElementRectValueListener().subscribe(element, (elementRect) => {
        for (const sub of subscribers)
          sub(elementRect);
      })), subscribers.push(subscriber), () => {
        const idx = subscribers.indexOf(subscriber);
        idx > -1 && subscribers.splice(idx, 1), subscribers.length === 0 && dispose && dispose();
      };
    }
  };
}
function useElementSize(element) {
  const $ = distExports.c(3), [size2, setSize] = useState(null);
  let t0, t1;
  return $[0] !== element ? (t0 = () => {
    if (element)
      return _elementSizeObserver.subscribe(element, setSize);
  }, t1 = [element], $[0] = element, $[1] = t0, $[2] = t1) : (t0 = $[1], t1 = $[2]), useEffect(t0, t1), size2;
}
function useGlobalKeyDown(onKeyDown, options) {
  const $ = distExports.c(7);
  let t0;
  $[0] !== onKeyDown ? (t0 = (event) => onKeyDown(event), $[0] = onKeyDown, $[1] = t0) : t0 = $[1];
  const handleKeyDown = useEffectEvent(t0);
  let t1;
  $[2] !== handleKeyDown || $[3] !== options ? (t1 = () => {
    const handler = (event_0) => handleKeyDown(event_0);
    return window.addEventListener("keydown", handler, options), () => window.removeEventListener("keydown", handler, options);
  }, $[2] = handleKeyDown, $[3] = options, $[4] = t1) : t1 = $[4];
  let t2;
  $[5] !== options ? (t2 = [options], $[5] = options, $[6] = t2) : t2 = $[6], useEffect(t1, t2);
}
function useMatchMedia(mediaQueryString, getServerSnapshot2) {
  const $ = distExports.c(4);
  useDebugValue(mediaQueryString);
  let t0;
  $[0] !== mediaQueryString ? (t0 = (onStoreChange) => {
    const media = window.matchMedia(mediaQueryString);
    return media.addEventListener("change", onStoreChange), () => media.removeEventListener("change", onStoreChange);
  }, $[0] = mediaQueryString, $[1] = t0) : t0 = $[1];
  let t1;
  return $[2] !== mediaQueryString ? (t1 = () => window.matchMedia(mediaQueryString).matches, $[2] = mediaQueryString, $[3] = t1) : t1 = $[3], useSyncExternalStore(t0, t1, getServerSnapshot2);
}
function _getMediaQuery(media, index2) {
  return index2 === 0 ? `screen and (max-width: ${media[index2] - 1}px)` : index2 === media.length ? `screen and (min-width: ${media[index2 - 1]}px)` : `screen and (min-width: ${media[index2 - 1]}px) and (max-width: ${media[index2] - 1}px)`;
}
function _createMediaStore(media) {
  const mediaLen = media.length;
  let sizes;
  const getSizes = () => {
    if (!sizes) {
      sizes = [];
      for (let index2 = mediaLen; index2 > -1; index2 -= 1) {
        const mediaQuery = _getMediaQuery(media, index2);
        sizes.push({
          index: index2,
          mq: window.matchMedia(mediaQuery)
        });
      }
    }
    return sizes;
  };
  return {
    getSnapshot: () => {
      for (const {
        index: index2,
        mq
      } of getSizes())
        if (mq.matches) return index2;
      return 0;
    },
    subscribe: (onStoreChange) => {
      const disposeFns = [];
      for (const {
        mq
      } of getSizes()) {
        const handleChange = () => {
          mq.matches && onStoreChange();
        };
        mq.addEventListener("change", handleChange), disposeFns.push(() => mq.removeEventListener("change", handleChange));
      }
      return () => {
        for (const disposeFn of disposeFns)
          disposeFn();
      };
    }
  };
}
function getServerSnapshot() {
  return 0;
}
function useMediaIndex() {
  const $ = distExports.c(2), {
    media
  } = useTheme_v2();
  let t0;
  $[0] !== media ? (t0 = _createMediaStore(media), $[0] = media, $[1] = t0) : t0 = $[1];
  const store = t0;
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
}
function usePrefersReducedMotion(t0) {
  return useMatchMedia("(prefers-reduced-motion: reduce)", _temp$6);
}
function _temp$6() {
  return !1;
}
function checkboxBaseStyles() {
  return css`
    position: relative;
    display: inline-block;
  `;
}
function inputElementStyles(props) {
  const {
    color: color2,
    input,
    radius
  } = getTheme_v2(props.theme), {
    focusRing
  } = input.checkbox;
  return css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
    z-index: 1;
    padding: 0;
    margin: 0;

    & + span {
      position: relative;
      display: block;
      height: ${rem(input.checkbox.size)};
      width: ${rem(input.checkbox.size)};
      box-sizing: border-box;
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.border,
    width: input.border.width
  })};
      border-radius: ${rem(radius[2])};
      line-height: 1;
      background-color: ${color2.input.default.enabled.bg};

      & > svg {
        display: block;
        position: absolute;
        opacity: 0;
        height: 100%;
        width: 100%;

        & > path {
          vector-effect: non-scaling-stroke;
          stroke-width: 1.5px !important;
        }
      }
    }

    &:checked + span {
      background: ${color2.input.default.enabled.fg};
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.fg,
    width: input.border.width
  })};
      color: ${color2.input.default.enabled.bg};
    }

    /* focus */
    &:not(:disabled):focus:focus-visible + span {
      box-shadow: ${focusRingStyle({
    focusRing
  })};
    }

    /* focus when checked - uses a different offset */
    &:not(:disabled):focus:focus-visible&:checked + span {
      box-shadow: ${focusRingStyle({
    focusRing: {
      width: 1,
      offset: 1
    }
  })};
    }

    &[data-error] + span {
      background-color: ${color2.input.invalid.enabled.border};
      box-shadow: ${focusRingBorderStyle({
    width: input.border.width,
    color: color2.input.invalid.enabled.muted.bg
  })};
      color: ${color2.input.default.disabled.fg};
    }
    &[data-error]&:checked + span {
      background-color: ${color2.input.invalid.enabled.muted.bg};
      color: ${color2.input.default.enabled.bg};
    }
    &[data-error]&:checked&:not(:disabled):focus:focus-visible + span {
      box-shadow: ${focusRingStyle({
    border: {
      width: input.border.width,
      color: color2.input.invalid.readOnly.muted.bg
    },
    focusRing: {
      width: 1,
      offset: 1
    }
  })};
    }

    &:disabled + span {
      background-color: ${color2.input.default.disabled.bg};
      box-shadow: ${focusRingBorderStyle({
    width: input.border.width,
    color: color2.input.default.disabled.border
  })};
      color: ${color2.input.default.disabled.fg};
    }
    &:disabled&:checked + span {
      background-color: ${color2.input.default.disabled.muted.bg};
    }

    &[data-read-only] + span {
      background-color: ${color2.input.default.readOnly.bg};
      box-shadow: ${focusRingBorderStyle({
    width: input.border.width,
    color: color2.input.default.readOnly.border
  })};
      color: ${color2.input.default.readOnly.fg};
    }

    &[data-read-only]&:checked + span {
      background-color: ${color2.input.default.readOnly.muted.bg};
    }

    &:checked + span > svg:first-child {
      opacity: 1;
    }
    &:indeterminate + span > svg:last-child {
      opacity: 1;
    }
  `;
}
const StyledCheckbox = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledCheckbox",
  componentId: "sc-1l5mt2l-0"
})(checkboxBaseStyles), Input$5 = /* @__PURE__ */ styled.input.withConfig({
  displayName: "Input",
  componentId: "sc-1l5mt2l-1"
})(inputElementStyles), Checkbox = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(25);
  let checked, className, customValidity, disabled, indeterminate, readOnly, restProps, style;
  $[0] !== props ? ({
    checked,
    className,
    disabled,
    indeterminate,
    customValidity,
    readOnly,
    style,
    ...restProps
  } = props, $[0] = props, $[1] = checked, $[2] = className, $[3] = customValidity, $[4] = disabled, $[5] = indeterminate, $[6] = readOnly, $[7] = restProps, $[8] = style) : (checked = $[1], className = $[2], customValidity = $[3], disabled = $[4], indeterminate = $[5], readOnly = $[6], restProps = $[7], style = $[8]);
  const ref = useRef(null);
  let t0;
  $[9] === Symbol.for("react.memo_cache_sentinel") ? (t0 = () => ref.current, $[9] = t0) : t0 = $[9], useImperativeHandle(forwardedRef, t0);
  let t1, t2;
  $[10] !== indeterminate ? (t1 = () => {
    ref.current && (ref.current.indeterminate = indeterminate || !1);
  }, t2 = [indeterminate], $[10] = indeterminate, $[11] = t1, $[12] = t2) : (t1 = $[11], t2 = $[12]), useEffect(t1, t2), useCustomValidity(ref, customValidity);
  const t3 = !disabled && readOnly ? "" : void 0, t4 = customValidity ? "" : void 0, t5 = disabled || readOnly;
  let t6;
  $[13] !== checked || $[14] !== readOnly || $[15] !== restProps || $[16] !== t3 || $[17] !== t4 || $[18] !== t5 ? (t6 = /* @__PURE__ */ jsx(Input$5, { "data-read-only": t3, "data-error": t4, ...restProps, checked, disabled: t5, type: "checkbox", readOnly, ref }), $[13] = checked, $[14] = readOnly, $[15] = restProps, $[16] = t3, $[17] = t4, $[18] = t5, $[19] = t6) : t6 = $[19];
  let t7;
  $[20] === Symbol.for("react.memo_cache_sentinel") ? (t7 = /* @__PURE__ */ jsxs("span", { children: [
    /* @__PURE__ */ jsx(CheckmarkIcon, {}),
    /* @__PURE__ */ jsx(RemoveIcon, {})
  ] }), $[20] = t7) : t7 = $[20];
  let t8;
  return $[21] !== className || $[22] !== style || $[23] !== t6 ? (t8 = /* @__PURE__ */ jsxs(StyledCheckbox, { className, "data-ui": "Checkbox", style, children: [
    t6,
    t7
  ] }), $[21] = className, $[22] = style, $[23] = t6, $[24] = t8) : t8 = $[24], t8;
});
Checkbox.displayName = "ForwardRef(Checkbox)";
function codeSyntaxHighlightingStyle({
  theme
}) {
  const {
    color: {
      syntax: color2
    }
  } = getTheme_v2(theme);
  return {
    "&.atrule": {
      color: color2.atrule
    },
    "&.attr-name": {
      color: color2.attrName
    },
    "&.attr-value": {
      color: color2.attrValue
    },
    "&.attribute": {
      color: color2.attribute
    },
    "&.boolean": {
      color: color2.boolean
    },
    "&.builtin": {
      color: color2.builtin
    },
    "&.cdata": {
      color: color2.cdata
    },
    "&.char": {
      color: color2.char
    },
    "&.class": {
      color: color2.class
    },
    "&.class-name": {
      color: color2.className
    },
    "&.comment": {
      color: color2.comment
    },
    "&.constant": {
      color: color2.constant
    },
    "&.deleted": {
      color: color2.deleted
    },
    "&.doctype": {
      color: color2.doctype
    },
    "&.entity": {
      color: color2.entity
    },
    "&.function": {
      color: color2.function
    },
    "&.hexcode": {
      color: color2.hexcode
    },
    "&.id": {
      color: color2.id
    },
    "&.important": {
      color: color2.important
    },
    "&.inserted": {
      color: color2.inserted
    },
    "&.keyword": {
      color: color2.keyword
    },
    "&.number": {
      color: color2.number
    },
    "&.operator": {
      color: color2.operator
    },
    "&.prolog": {
      color: color2.prolog
    },
    "&.property": {
      color: color2.property
    },
    "&.pseudo-class": {
      color: color2.pseudoClass
    },
    "&.pseudo-element": {
      color: color2.pseudoElement
    },
    "&.punctuation": {
      color: color2.punctuation
    },
    "&.regex": {
      color: color2.regex
    },
    "&.selector": {
      color: color2.selector
    },
    "&.string": {
      color: color2.string
    },
    "&.symbol": {
      color: color2.symbol
    },
    "&.tag": {
      color: color2.tag
    },
    "&.unit": {
      color: color2.unit
    },
    "&.url": {
      color: color2.url
    },
    "&.variable": {
      color: color2.variable
    }
  };
}
function codeBaseStyle() {
  return css`
    color: var(--card-code-fg-color);

    & code {
      font-family: inherit;

      &.refractor .token {
        ${codeSyntaxHighlightingStyle}
      }
    }

    & a {
      color: inherit;
      text-decoration: underline;
      border-radius: 1px;
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `;
}
const LazyRefractor = lazy(() => import("./refractor.mjs")), StyledCode = /* @__PURE__ */ styled.pre.withConfig({
  displayName: "StyledCode",
  componentId: "sc-4dymyn-0"
})(codeBaseStyle, responsiveCodeFontStyle), Code = forwardRef(function(props, ref) {
  const $ = distExports.c(22);
  let children, language, restProps, t0, weight;
  $[0] !== props ? ({
    children,
    language,
    size: t0,
    weight,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = language, $[3] = restProps, $[4] = t0, $[5] = weight) : (children = $[1], language = $[2], restProps = $[3], t0 = $[4], weight = $[5]);
  const size2 = t0 === void 0 ? 2 : t0;
  let t1;
  $[6] !== size2 ? (t1 = _getArrayProp(size2), $[6] = size2, $[7] = t1) : t1 = $[7];
  let t2;
  $[8] !== children ? (t2 = /* @__PURE__ */ jsx("code", { children }), $[8] = children, $[9] = t2) : t2 = $[9];
  let t3;
  $[10] !== children || $[11] !== language ? (t3 = /* @__PURE__ */ jsx(LazyRefractor, { language, value: children }), $[10] = children, $[11] = language, $[12] = t3) : t3 = $[12];
  let t4;
  $[13] !== t2 || $[14] !== t3 ? (t4 = /* @__PURE__ */ jsx(Suspense, { fallback: t2, children: t3 }), $[13] = t2, $[14] = t3, $[15] = t4) : t4 = $[15];
  let t5;
  return $[16] !== ref || $[17] !== restProps || $[18] !== t1 || $[19] !== t4 || $[20] !== weight ? (t5 = /* @__PURE__ */ jsx(StyledCode, { "data-ui": "Code", ...restProps, $size: t1, $weight: weight, ref, children: t4 }), $[16] = ref, $[17] = restProps, $[18] = t1, $[19] = t4, $[20] = weight, $[21] = t5) : t5 = $[21], t5;
});
Code.displayName = "ForwardRef(Code)";
const BASE_STYLE$1 = {
  width: "100%",
  margin: "0 auto"
};
function containerBaseStyle() {
  return BASE_STYLE$1;
}
function responsiveContainerWidthStyle(props) {
  const {
    container,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$width, (val) => ({
    maxWidth: val === "auto" ? "none" : rem(container[val])
  }));
}
const StyledContainer = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledContainer",
  componentId: "sc-wyroop-0"
})(containerBaseStyle, responsiveContainerWidthStyle), Container = forwardRef(function(props, ref) {
  const $ = distExports.c(11);
  let as, restProps, t0;
  $[0] !== props ? ({
    as,
    width: t0,
    ...restProps
  } = props, $[0] = props, $[1] = as, $[2] = restProps, $[3] = t0) : (as = $[1], restProps = $[2], t0 = $[3]);
  const width = t0 === void 0 ? 2 : t0;
  let t1;
  $[4] !== width ? (t1 = _getArrayProp(width), $[4] = width, $[5] = t1) : t1 = $[5];
  let t2;
  return $[6] !== as || $[7] !== ref || $[8] !== restProps || $[9] !== t1 ? (t2 = /* @__PURE__ */ jsx(StyledContainer, { "data-ui": "Container", ...restProps, $width: t1, forwardedAs: as, ref }), $[6] = as, $[7] = ref, $[8] = restProps, $[9] = t1, $[10] = t2) : t2 = $[10], t2;
});
Container.displayName = "ForwardRef(Container)";
const StyledGrid = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledGrid",
  componentId: "sc-v8t8oz-0"
})(responsiveGridStyle), Grid = forwardRef(function(props, ref) {
  const $ = distExports.c(42);
  let as, autoCols, autoFlow, autoRows, children, columns, gap, gapX, gapY, restProps, rows;
  $[0] !== props ? ({
    as,
    autoRows,
    autoCols,
    autoFlow,
    columns,
    gap,
    gapX,
    gapY,
    rows,
    children,
    ...restProps
  } = props, $[0] = props, $[1] = as, $[2] = autoCols, $[3] = autoFlow, $[4] = autoRows, $[5] = children, $[6] = columns, $[7] = gap, $[8] = gapX, $[9] = gapY, $[10] = restProps, $[11] = rows) : (as = $[1], autoCols = $[2], autoFlow = $[3], autoRows = $[4], children = $[5], columns = $[6], gap = $[7], gapX = $[8], gapY = $[9], restProps = $[10], rows = $[11]);
  const t0 = typeof as == "string" ? as : void 0;
  let t1;
  $[12] !== autoRows ? (t1 = _getArrayProp(autoRows), $[12] = autoRows, $[13] = t1) : t1 = $[13];
  let t2;
  $[14] !== autoCols ? (t2 = _getArrayProp(autoCols), $[14] = autoCols, $[15] = t2) : t2 = $[15];
  let t3;
  $[16] !== autoFlow ? (t3 = _getArrayProp(autoFlow), $[16] = autoFlow, $[17] = t3) : t3 = $[17];
  let t4;
  $[18] !== columns ? (t4 = _getArrayProp(columns), $[18] = columns, $[19] = t4) : t4 = $[19];
  let t5;
  $[20] !== gap ? (t5 = _getArrayProp(gap), $[20] = gap, $[21] = t5) : t5 = $[21];
  let t6;
  $[22] !== gapX ? (t6 = _getArrayProp(gapX), $[22] = gapX, $[23] = t6) : t6 = $[23];
  let t7;
  $[24] !== gapY ? (t7 = _getArrayProp(gapY), $[24] = gapY, $[25] = t7) : t7 = $[25];
  let t8;
  $[26] !== rows ? (t8 = _getArrayProp(rows), $[26] = rows, $[27] = t8) : t8 = $[27];
  let t9;
  return $[28] !== as || $[29] !== children || $[30] !== ref || $[31] !== restProps || $[32] !== t0 || $[33] !== t1 || $[34] !== t2 || $[35] !== t3 || $[36] !== t4 || $[37] !== t5 || $[38] !== t6 || $[39] !== t7 || $[40] !== t8 ? (t9 = /* @__PURE__ */ jsx(StyledGrid, { "data-as": t0, "data-ui": "Grid", ...restProps, $autoRows: t1, $autoCols: t2, $autoFlow: t3, $columns: t4, $gap: t5, $gapX: t6, $gapY: t7, $rows: t8, forwardedAs: as, ref, children }), $[28] = as, $[29] = children, $[30] = ref, $[31] = restProps, $[32] = t0, $[33] = t1, $[34] = t2, $[35] = t3, $[36] = t4, $[37] = t5, $[38] = t6, $[39] = t7, $[40] = t8, $[41] = t9) : t9 = $[41], t9;
});
Grid.displayName = "ForwardRef(Grid)";
function headingBaseStyle(props) {
  const {
    $accent,
    $muted
  } = props, {
    font
  } = getTheme_v2(props.theme);
  return css`
    ${$accent && css`
      color: var(--card-accent-fg-color);
    `}

    ${$muted && css`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${font.code.family};
      border-radius: 1px;
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
      color: var(--card-link-color);
      outline: none;

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }

      &:focus {
        box-shadow:
          0 0 0 1px var(--card-bg-color),
          0 0 0 3px var(--card-focus-ring-color);
      }

      &:focus:not(:focus-visible) {
        box-shadow: none;
      }
    }

    & strong {
      font-weight: ${font.heading.weights.bold};
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `;
}
const StyledHeading = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledHeading",
  componentId: "sc-137lwim-0"
})(headingBaseStyle, responsiveTextAlignStyle, responsiveHeadingFont), Heading = forwardRef(function(props, ref) {
  const $ = distExports.c(26);
  let align, childrenProp, restProps, t0, t1, t2, textOverflow, weight;
  $[0] !== props ? ({
    accent: t0,
    align,
    children: childrenProp,
    muted: t1,
    size: t2,
    textOverflow,
    weight,
    ...restProps
  } = props, $[0] = props, $[1] = align, $[2] = childrenProp, $[3] = restProps, $[4] = t0, $[5] = t1, $[6] = t2, $[7] = textOverflow, $[8] = weight) : (align = $[1], childrenProp = $[2], restProps = $[3], t0 = $[4], t1 = $[5], t2 = $[6], textOverflow = $[7], weight = $[8]);
  const accent = t0 === void 0 ? !1 : t0, muted = t1 === void 0 ? !1 : t1, size2 = t2 === void 0 ? 2 : t2;
  let children = childrenProp;
  if (textOverflow === "ellipsis") {
    let t32;
    $[9] !== children ? (t32 = /* @__PURE__ */ jsx(SpanWithTextOverflow, { children }), $[9] = children, $[10] = t32) : t32 = $[10], children = t32;
  }
  let t3;
  $[11] !== align ? (t3 = _getArrayProp(align), $[11] = align, $[12] = t3) : t3 = $[12];
  let t4;
  $[13] !== size2 ? (t4 = _getArrayProp(size2), $[13] = size2, $[14] = t4) : t4 = $[14];
  let t5;
  $[15] !== children ? (t5 = /* @__PURE__ */ jsx("span", { children }), $[15] = children, $[16] = t5) : t5 = $[16];
  let t6;
  return $[17] !== accent || $[18] !== muted || $[19] !== ref || $[20] !== restProps || $[21] !== t3 || $[22] !== t4 || $[23] !== t5 || $[24] !== weight ? (t6 = /* @__PURE__ */ jsx(StyledHeading, { "data-ui": "Heading", ...restProps, $accent: accent, $align: t3, $muted: muted, $size: t4, $weight: weight, ref, children: t5 }), $[17] = accent, $[18] = muted, $[19] = ref, $[20] = restProps, $[21] = t3, $[22] = t4, $[23] = t5, $[24] = weight, $[25] = t6) : t6 = $[25], t6;
});
Heading.displayName = "ForwardRef(Heading)";
function inlineBaseStyle() {
  return {
    lineHeight: "0",
    "&&:not([hidden])": {
      display: "block"
    },
    "& > div": {
      display: "inline-block",
      verticalAlign: "middle"
    }
  };
}
function inlineSpaceStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$space, (spaceIndex) => {
    const _space = rem(spaceIndex === 0.5 ? space[1] / 2 : space[spaceIndex]);
    return {
      margin: `-${_space} 0 0 -${_space}`,
      "& > div": {
        padding: `${_space} 0 0 ${_space}`
      }
    };
  });
}
const StyledInline = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledInline",
  componentId: "sc-1pkiy6j-0"
})(inlineBaseStyle, inlineSpaceStyle), Inline = forwardRef(function(props, ref) {
  const $ = distExports.c(15);
  let as, childrenProp, restProps, space;
  $[0] !== props ? ({
    as,
    children: childrenProp,
    space,
    ...restProps
  } = props, $[0] = props, $[1] = as, $[2] = childrenProp, $[3] = restProps, $[4] = space) : (as = $[1], childrenProp = $[2], restProps = $[3], space = $[4]);
  let t0;
  $[5] !== childrenProp ? (t0 = Children.map(childrenProp, _temp$5), $[5] = childrenProp, $[6] = t0) : t0 = $[6];
  const children = t0;
  let t1;
  $[7] !== space ? (t1 = _getArrayProp(space), $[7] = space, $[8] = t1) : t1 = $[8];
  const t2 = ref;
  let t3;
  return $[9] !== as || $[10] !== children || $[11] !== restProps || $[12] !== t1 || $[13] !== t2 ? (t3 = /* @__PURE__ */ jsx(StyledInline, { "data-ui": "Inline", ...restProps, $space: t1, forwardedAs: as, ref: t2, children }), $[9] = as, $[10] = children, $[11] = restProps, $[12] = t1, $[13] = t2, $[14] = t3) : t3 = $[14], t3;
});
Inline.displayName = "ForwardRef(Inline)";
function _temp$5(child) {
  return child && /* @__PURE__ */ jsx("div", { children: child });
}
function kbdStyle() {
  return css`
    --card-bg-color: var(--card-kbd-bg-color);
    --card-border-color: var(--card-kbd-border-color);
    --card-fg-color: var(--card-kbd-fg-color);

    box-shadow: inset 0 0 0 1px var(--card-border-color);
    background: var(--card-bg-color);
    font: inherit;

    vertical-align: top;

    &:not([hidden]) {
      display: inline-block;
    }
  `;
}
const StyledKBD = /* @__PURE__ */ styled.kbd.withConfig({
  displayName: "StyledKBD",
  componentId: "sc-1w7yd8w-0"
})(responsiveRadiusStyle, kbdStyle), KBD = forwardRef(function(props, ref) {
  const $ = distExports.c(19);
  let children, restProps, t0, t1, t2;
  $[0] !== props ? ({
    children,
    fontSize: t0,
    padding: t1,
    radius: t2,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = restProps, $[3] = t0, $[4] = t1, $[5] = t2) : (children = $[1], restProps = $[2], t0 = $[3], t1 = $[4], t2 = $[5]);
  const fontSize2 = t0 === void 0 ? 0 : t0, padding = t1 === void 0 ? 1 : t1, radius = t2 === void 0 ? 2 : t2;
  let t3;
  $[6] !== radius ? (t3 = _getArrayProp(radius), $[6] = radius, $[7] = t3) : t3 = $[7];
  let t4;
  $[8] !== children || $[9] !== fontSize2 ? (t4 = /* @__PURE__ */ jsx(Text, { as: "span", size: fontSize2, weight: "semibold", children }), $[8] = children, $[9] = fontSize2, $[10] = t4) : t4 = $[10];
  let t5;
  $[11] !== padding || $[12] !== t4 ? (t5 = /* @__PURE__ */ jsx(Box, { as: "span", padding, children: t4 }), $[11] = padding, $[12] = t4, $[13] = t5) : t5 = $[13];
  let t6;
  return $[14] !== ref || $[15] !== restProps || $[16] !== t3 || $[17] !== t5 ? (t6 = /* @__PURE__ */ jsx(StyledKBD, { "data-ui": "KBD", ...restProps, $radius: t3, ref, children: t5 }), $[14] = ref, $[15] = restProps, $[16] = t3, $[17] = t5, $[18] = t6) : t6 = $[18], t6;
});
KBD.displayName = "ForwardRef(KBD)";
const origin = {
  name: "@sanity/ui/origin",
  fn({
    middlewareData,
    placement,
    rects
  }) {
    const [side] = placement.split("-"), floatingWidth = rects.floating.width, floatingHeight = rects.floating.height, shiftX = middlewareData.shift?.x || 0, shiftY = middlewareData.shift?.y || 0;
    if (floatingWidth <= 0 || floatingHeight <= 0)
      return {};
    const isVerticalPlacement = ["bottom", "top"].includes(side), {
      originX,
      originY
    } = isVerticalPlacement ? {
      originX: clamp(0.5 - shiftX / floatingWidth, 0, 1),
      originY: side === "bottom" ? 0 : 1
    } : {
      originX: side === "left" ? 1 : 0,
      originY: clamp(0.5 - shiftY / floatingHeight, 0, 1)
    };
    return {
      data: {
        originX,
        originY
      }
    };
  }
};
function clamp(num, min2, max2) {
  return Math.min(Math.max(num, min2), max2);
}
function moveTowardsLength(movingPoint, targetPoint, amount) {
  const width = targetPoint.x - movingPoint.x, height = targetPoint.y - movingPoint.y, distance2 = Math.sqrt(width * width + height * height);
  return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance2));
}
function moveTowardsFractional(movingPoint, targetPoint, fraction) {
  return {
    x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
    y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
  };
}
function getRoundedCommands(points) {
  const len = points.length, cmds = [];
  for (let i = 0; i < len; i += 1) {
    const point = points[i], prevPoint = points[i - 1], nextPoint = points[i + 1];
    if (prevPoint && point.radius) {
      const curveStart = moveTowardsLength(point, prevPoint, point.radius), curveEnd = moveTowardsLength(point, nextPoint, point.radius), startControl = moveTowardsFractional(curveStart, point, 0.5), endControl = moveTowardsFractional(point, curveEnd, 0.5);
      cmds.push({
        type: "point",
        ...curveStart
      }), cmds.push({
        type: "curve",
        curveEnd,
        startControl,
        endControl
      });
    } else
      cmds.push({
        type: "point",
        ...point
      });
  }
  return cmds;
}
function compileCommands(cmds) {
  return cmds.map((n, idx) => n.type === "point" ? `${idx === 0 ? "M" : "L"} ${n.x} ${n.y}` : n.type === "curve" ? `C ${n.startControl.x} ${n.startControl.y} ${n.endControl.x} ${n.endControl.y} ${n.curveEnd.x} ${n.curveEnd.y}` : "").join(" ");
}
const StyledArrow = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledArrow",
  componentId: "sc-12vzy6c-0"
})(({
  $w: w
}) => css`
    position: absolute;
    width: ${w}px;
    height: ${w}px;

    :empty + & {
      display: none;
    }

    & > svg {
      display: block;
      line-height: 0;
      transform-origin: ${w / 2}px ${w / 2}px;
    }

    [data-placement^='top'] > & {
      bottom: -${w}px;

      & > svg {
        transform: rotate(0);
      }
    }

    [data-placement^='right'] > & {
      left: -${w}px;

      & > svg {
        transform: rotate(90deg);
      }
    }

    [data-placement^='left'] > & {
      right: -${w}px;

      & > svg {
        transform: rotate(-90deg);
      }
    }

    [data-placement^='bottom'] > & {
      top: -${w}px;

      & > svg {
        transform: rotate(180deg);
      }
    }
  `), StrokePath = styled.path.withConfig({
  displayName: "StrokePath",
  componentId: "sc-12vzy6c-1"
})`stroke:var(--card-shadow-outline-color);`, ShapePath = styled.path.withConfig({
  displayName: "ShapePath",
  componentId: "sc-12vzy6c-2"
})`fill:var(--card-bg-color);`, Arrow = forwardRef(function(props, ref) {
  const $ = distExports.c(29);
  let h, restProps, t0, w;
  $[0] !== props ? ({
    width: w,
    height: h,
    radius: t0,
    ...restProps
  } = props, $[0] = props, $[1] = h, $[2] = restProps, $[3] = t0, $[4] = w) : (h = $[1], restProps = $[2], t0 = $[3], w = $[4]);
  const radius = t0 === void 0 ? 0 : t0, {
    card
  } = useTheme_v2(), strokeWidth = card.shadow.outline, center = w / 2;
  let t1;
  if ($[5] !== center || $[6] !== h || $[7] !== radius || $[8] !== w) {
    const points = [{
      x: 0,
      y: 0
    }, {
      x: radius,
      y: 0,
      radius
    }, {
      x: center,
      y: h - 1,
      radius
    }, {
      x: w - radius,
      y: 0,
      radius
    }, {
      x: w,
      y: 0
    }], cmds = getRoundedCommands(points);
    t1 = compileCommands(cmds), $[5] = center, $[6] = h, $[7] = radius, $[8] = w, $[9] = t1;
  } else
    t1 = $[9];
  const path = t1, strokePath = `${path}`, fillPath = `${path} M ${w} -1 M 0 -1 Z`, t2 = `0 0 ${w} ${w}`;
  let t3;
  $[10] !== strokeWidth || $[11] !== w ? (t3 = /* @__PURE__ */ jsx("mask", { id: "stroke-mask", children: /* @__PURE__ */ jsx("rect", { x: 0, y: strokeWidth, width: w, height: w, fill: "white" }) }), $[10] = strokeWidth, $[11] = w, $[12] = t3) : t3 = $[12];
  const t4 = strokeWidth * 2;
  let t5;
  $[13] !== strokePath || $[14] !== t4 ? (t5 = /* @__PURE__ */ jsx(StrokePath, { d: strokePath, mask: "url(#stroke-mask)", strokeWidth: t4 }), $[13] = strokePath, $[14] = t4, $[15] = t5) : t5 = $[15];
  let t6;
  $[16] !== fillPath ? (t6 = /* @__PURE__ */ jsx(ShapePath, { d: fillPath }), $[16] = fillPath, $[17] = t6) : t6 = $[17];
  let t7;
  $[18] !== t2 || $[19] !== t3 || $[20] !== t5 || $[21] !== t6 || $[22] !== w ? (t7 = /* @__PURE__ */ jsxs("svg", { width: w, height: w, viewBox: t2, children: [
    t3,
    t5,
    t6
  ] }), $[18] = t2, $[19] = t3, $[20] = t5, $[21] = t6, $[22] = w, $[23] = t7) : t7 = $[23];
  let t8;
  return $[24] !== ref || $[25] !== restProps || $[26] !== t7 || $[27] !== w ? (t8 = /* @__PURE__ */ jsx(StyledArrow, { ...restProps, $w: w, ref, children: t7 }), $[24] = ref, $[25] = restProps, $[26] = t7, $[27] = w, $[28] = t8) : t8 = $[28], t8;
});
Arrow.displayName = "ForwardRef(Arrow)";
const BoundaryElementContext = createGlobalScopedContext("@sanity/ui/context/boundaryElement", null);
function isRecord(value) {
  return !!(value && typeof value == "object" && !Array.isArray(value));
}
const DEFAULT_VALUE = {
  version: 0,
  element: null
};
function useBoundaryElement() {
  const value = useContext(BoundaryElementContext);
  if (value && (!isRecord(value) || value.version !== 0))
    throw new Error("useBoundaryElement(): the context value is not compatible");
  return value || DEFAULT_VALUE;
}
function findMaxBreakpoints(media, width) {
  const ret = [];
  for (let i = 0; i < media.length; i += 1)
    media[i] > width && ret.push(i);
  return ret;
}
function findMinBreakpoints(media, width) {
  const ret = [];
  for (let i = 0; i < media.length; i += 1)
    media[i] <= width && ret.push(i);
  return ret;
}
const ElementQuery = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(18), theme = useTheme_v2();
  let _media, children, restProps;
  $[0] !== props ? ({
    children,
    media: _media,
    ...restProps
  } = props, $[0] = props, $[1] = _media, $[2] = children, $[3] = restProps) : (_media = $[1], children = $[2], restProps = $[3]);
  const media = _media ?? theme.media, [element, setElement] = useState(null), width = useElementSize(element)?.border.width ?? window.innerWidth;
  let t0;
  if ($[4] !== media || $[5] !== width) {
    const eq = findMaxBreakpoints(media, width);
    t0 = eq.length ? eq.join(" ") : void 0, $[4] = media, $[5] = width, $[6] = t0;
  } else
    t0 = $[6];
  const max2 = t0;
  let t1;
  if ($[7] !== media || $[8] !== width) {
    const eq_0 = findMinBreakpoints(media, width);
    t1 = eq_0.length ? eq_0.join(" ") : void 0, $[7] = media, $[8] = width, $[9] = t1;
  } else
    t1 = $[9];
  const min2 = t1;
  let t2, t3;
  $[10] !== element ? (t2 = () => element, t3 = [element], $[10] = element, $[11] = t2, $[12] = t3) : (t2 = $[11], t3 = $[12]), useImperativeHandle(forwardedRef, t2, t3);
  let t4;
  return $[13] !== children || $[14] !== max2 || $[15] !== min2 || $[16] !== restProps ? (t4 = /* @__PURE__ */ jsx("div", { "data-ui": "ElementQuery", ...restProps, "data-eq-max": max2, "data-eq-min": min2, ref: setElement, children }), $[13] = children, $[14] = max2, $[15] = min2, $[16] = restProps, $[17] = t4) : t4 = $[17], t4;
});
ElementQuery.displayName = "ForwardRef(ElementQuery)";
function getLayerContext(contextValue) {
  if (!isRecord(contextValue) || contextValue.version !== 0)
    throw new Error("the context value is not compatible");
  if (!contextValue)
    throw new Error("components using `useLayer()` should be wrapped in a <LayerProvider>.");
  if (contextValue.version === 0)
    return contextValue;
  throw new Error("could not get layer context");
}
const LayerContext = createGlobalScopedContext("@sanity/ui/context/layer", null);
function LayerProvider(props) {
  const $ = distExports.c(21), {
    children,
    zOffset: t0
  } = props, zOffsetProp = t0 === void 0 ? 0 : t0, parentContextValue = useContext(LayerContext);
  let t1;
  $[0] !== parentContextValue ? (t1 = parentContextValue && getLayerContext(parentContextValue), $[0] = parentContextValue, $[1] = t1) : t1 = $[1];
  const parent = t1, parentRegisterChild = parent?.registerChild, level = (parent?.level ?? 0) + 1;
  let t2;
  $[2] !== zOffsetProp ? (t2 = _getArrayProp(zOffsetProp), $[2] = zOffsetProp, $[3] = t2) : t2 = $[3];
  const zOffset = t2, maxMediaIndex = zOffset.length - 1, mediaIndex = Math.min(useMediaIndex(), maxMediaIndex), zIndex = parent ? parent.zIndex + zOffset[mediaIndex] : zOffset[mediaIndex];
  let t3;
  $[4] === Symbol.for("react.memo_cache_sentinel") ? (t3 = {}, $[4] = t3) : t3 = $[4];
  const [, setChildLayers] = useState(t3), [size2, setSize] = useState(0), isTopLayer2 = size2 === 0;
  let t4;
  $[5] !== parentRegisterChild || $[6] !== setChildLayers ? (t4 = (childLevel) => {
    const parentDispose = parentRegisterChild?.(childLevel);
    return childLevel !== void 0 ? setChildLayers((state) => {
      const prevLen = state[childLevel] ?? 0, nextState = {
        ...state,
        [childLevel]: prevLen + 1
      };
      return setSize(Object.keys(nextState).length), nextState;
    }) : setSize(_temp$4), () => {
      childLevel !== void 0 ? setChildLayers((state_0) => {
        const nextState_0 = {
          ...state_0
        };
        return nextState_0[childLevel] === 1 ? (delete nextState_0[childLevel], setSize(Object.keys(nextState_0).length)) : nextState_0[childLevel] = nextState_0[childLevel] - 1, nextState_0;
      }) : setSize(_temp2$2), parentDispose?.();
    };
  }, $[5] = parentRegisterChild, $[6] = setChildLayers, $[7] = t4) : t4 = $[7];
  const registerChild = t4;
  let t5, t6;
  $[8] !== level || $[9] !== parentRegisterChild ? (t5 = () => parentRegisterChild?.(level), t6 = [level, parentRegisterChild], $[8] = level, $[9] = parentRegisterChild, $[10] = t5, $[11] = t6) : (t5 = $[10], t6 = $[11]), useEffect(t5, t6);
  let t7;
  $[12] !== isTopLayer2 || $[13] !== level || $[14] !== registerChild || $[15] !== size2 || $[16] !== zIndex ? (t7 = {
    version: 0,
    isTopLayer: isTopLayer2,
    level,
    registerChild,
    size: size2,
    zIndex
  }, $[12] = isTopLayer2, $[13] = level, $[14] = registerChild, $[15] = size2, $[16] = zIndex, $[17] = t7) : t7 = $[17];
  const value = t7;
  let t8;
  return $[18] !== children || $[19] !== value ? (t8 = /* @__PURE__ */ jsx(LayerContext.Provider, { value, children }), $[18] = children, $[19] = value, $[20] = t8) : t8 = $[20], t8;
}
function _temp2$2(v_0) {
  return v_0 - 1;
}
function _temp$4(v) {
  return v + 1;
}
LayerProvider.displayName = "LayerProvider";
function useLayer() {
  const $ = distExports.c(2), value = useContext(LayerContext);
  if (!value)
    throw new Error("useLayer(): missing context value");
  try {
    let t1;
    return $[0] !== value ? (t1 = getLayerContext(value), $[0] = value, $[1] = t1) : t1 = $[1], t1;
  } catch (t0) {
    const err = t0;
    throw err instanceof Error ? new Error(`useLayer(): ${err.message}`) : new Error(`useLayer(): ${err}`);
  }
}
const StyledLayer = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledLayer",
  componentId: "sc-16kojrv-0"
})({
  position: "relative"
}), LayerChildren = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(22);
  let children, onActivate, onFocus, restProps, t0;
  $[0] !== props ? ({
    children,
    onActivate,
    onFocus,
    style: t0,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = onActivate, $[3] = onFocus, $[4] = restProps, $[5] = t0) : (children = $[1], onActivate = $[2], onFocus = $[3], restProps = $[4], t0 = $[5]);
  const style = t0 === void 0 ? EMPTY_RECORD : t0, {
    zIndex,
    isTopLayer: isTopLayer2
  } = useLayer(), lastFocusedRef = useRef(null), ref = useRef(null), isTopLayerRef = useRef(isTopLayer2);
  let t1;
  $[6] === Symbol.for("react.memo_cache_sentinel") ? (t1 = () => ref.current, $[6] = t1) : t1 = $[6], useImperativeHandle(forwardedRef, t1);
  let t2, t3;
  $[7] !== isTopLayer2 || $[8] !== onActivate ? (t2 = () => {
    isTopLayerRef.current !== isTopLayer2 && isTopLayer2 && onActivate?.({
      activeElement: lastFocusedRef.current
    }), isTopLayerRef.current = isTopLayer2;
  }, t3 = [isTopLayer2, onActivate], $[7] = isTopLayer2, $[8] = onActivate, $[9] = t2, $[10] = t3) : (t2 = $[9], t3 = $[10]), useEffect(t2, t3);
  let t4;
  $[11] !== isTopLayer2 || $[12] !== onFocus ? (t4 = (event) => {
    onFocus?.(event);
    const rootElement = ref.current, target = document.activeElement;
    !isTopLayer2 || !rootElement || !target || isHTMLElement(target) && containsOrEqualsElement(rootElement, target) && (lastFocusedRef.current = target);
  }, $[11] = isTopLayer2, $[12] = onFocus, $[13] = t4) : t4 = $[13];
  const handleFocus = t4;
  let t5;
  $[14] !== style || $[15] !== zIndex ? (t5 = {
    ...style,
    zIndex
  }, $[14] = style, $[15] = zIndex, $[16] = t5) : t5 = $[16];
  let t6;
  return $[17] !== children || $[18] !== handleFocus || $[19] !== restProps || $[20] !== t5 ? (t6 = /* @__PURE__ */ jsx(StyledLayer, { ...restProps, "data-ui": "Layer", onFocus: handleFocus, ref, style: t5, children }), $[17] = children, $[18] = handleFocus, $[19] = restProps, $[20] = t5, $[21] = t6) : t6 = $[21], t6;
}), Layer = forwardRef(function(props, ref) {
  const $ = distExports.c(11);
  let children, restProps, t0;
  $[0] !== props ? ({
    children,
    zOffset: t0,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = restProps, $[3] = t0) : (children = $[1], restProps = $[2], t0 = $[3]);
  const zOffset = t0 === void 0 ? 1 : t0;
  let t1;
  $[4] !== children || $[5] !== ref || $[6] !== restProps ? (t1 = /* @__PURE__ */ jsx(LayerChildren, { ...restProps, ref, children }), $[4] = children, $[5] = ref, $[6] = restProps, $[7] = t1) : t1 = $[7];
  let t2;
  return $[8] !== t1 || $[9] !== zOffset ? (t2 = /* @__PURE__ */ jsx(LayerProvider, { zOffset, children: t1 }), $[8] = t1, $[9] = zOffset, $[10] = t2) : t2 = $[10], t2;
});
Layer.displayName = "ForwardRef(Layer)";
const key = "@sanity/ui/context/portal", elementKey = Symbol.for(`${key}/element`);
globalScope[elementKey] = null;
const defaultContextValue = {
  version: 0,
  boundaryElement: null,
  get element() {
    return typeof document > "u" ? null : (globalScope[elementKey] || (globalScope[elementKey] = document.createElement("div"), globalScope[elementKey].setAttribute("data-portal", ""), document.body.appendChild(globalScope[elementKey])), globalScope[elementKey]);
  }
}, PortalContext = createGlobalScopedContext(key, defaultContextValue);
function usePortal() {
  const value = useContext(PortalContext);
  if (!value)
    throw new Error("usePortal(): missing context value");
  if (!isRecord(value) || value.version !== 0)
    throw new Error("usePortal(): the context value is not compatible");
  return value;
}
function Portal(props) {
  const $ = distExports.c(3), {
    children,
    __unstable_name: name
  } = props, portal = usePortal(), portalElement = (name ? portal.elements && portal.elements[name] : portal.element) || portal.elements?.default;
  if (!portalElement)
    return null;
  let t0;
  return $[0] !== children || $[1] !== portalElement ? (t0 = reactDomExports.createPortal(children, portalElement), $[0] = children, $[1] = portalElement, $[2] = t0) : t0 = $[2], t0;
}
Portal.displayName = "Portal";
const StyledSrOnly = styled.div.withConfig({
  displayName: "StyledSrOnly",
  componentId: "sc-mubr0c-0"
})`display:block;width:0;height:0;position:absolute;overflow:hidden;overflow:clip;`, SrOnly = forwardRef(function(props, ref) {
  const $ = distExports.c(4), {
    as,
    children
  } = props;
  let t0;
  return $[0] !== as || $[1] !== children || $[2] !== ref ? (t0 = /* @__PURE__ */ jsx(StyledSrOnly, { "aria-hidden": !0, as, "data-ui": "SrOnly", ref, children }), $[0] = as, $[1] = children, $[2] = ref, $[3] = t0) : t0 = $[3], t0;
});
SrOnly.displayName = "ForwardRef(SrOnly)";
const StyledVirtualList = styled.div.withConfig({
  displayName: "StyledVirtualList",
  componentId: "sc-dlqsj4-0"
})`position:relative;`, ItemWrapper = styled.div.withConfig({
  displayName: "ItemWrapper",
  componentId: "sc-dlqsj4-1"
})`position:absolute;left:0;right:0;`, VirtualList = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(44);
  let getItemKey, onChange, renderItem, restProps, t0, t1, t2;
  $[0] !== props ? ({
    as: t0,
    gap: t1,
    getItemKey,
    items: t2,
    onChange,
    renderItem,
    ...restProps
  } = props, $[0] = props, $[1] = getItemKey, $[2] = onChange, $[3] = renderItem, $[4] = restProps, $[5] = t0, $[6] = t1, $[7] = t2) : (getItemKey = $[1], onChange = $[2], renderItem = $[3], restProps = $[4], t0 = $[5], t1 = $[6], t2 = $[7]);
  const as = t0 === void 0 ? "div" : t0, gap = t1 === void 0 ? 0 : t1;
  let t3;
  $[8] !== t2 ? (t3 = t2 === void 0 ? [] : t2, $[8] = t2, $[9] = t3) : t3 = $[9];
  const items = t3, {
    space
  } = useTheme_v2(), ref = useRef(null), wrapperRef = useRef(null), [scrollTop, setScrollTop] = useState(0), [scrollHeight, setScrollHeight] = useState(0), [itemHeight, setItemHeight] = useState(-1);
  let t4;
  $[10] === Symbol.for("react.memo_cache_sentinel") ? (t4 = () => ref.current, $[10] = t4) : t4 = $[10], useImperativeHandle(forwardedRef, t4);
  let t5;
  $[11] === Symbol.for("react.memo_cache_sentinel") ? (t5 = () => {
    if (!wrapperRef.current)
      return;
    const firstElement = wrapperRef.current.firstChild;
    firstElement instanceof HTMLElement && setItemHeight(firstElement.offsetHeight);
  }, $[11] = t5) : t5 = $[11];
  let t6;
  $[12] !== renderItem ? (t6 = [renderItem], $[12] = renderItem, $[13] = t6) : t6 = $[13], useEffect(t5, t6);
  let t7, t8;
  $[14] === Symbol.for("react.memo_cache_sentinel") ? (t7 = () => {
    if (!ref.current)
      return;
    const scrollEl = findScrollable(ref.current.parentNode);
    if (scrollEl) {
      if (!(scrollEl instanceof HTMLElement))
        return;
      const handleScroll = () => {
        setScrollTop(scrollEl.scrollTop);
      };
      scrollEl.addEventListener("scroll", handleScroll, {
        passive: !0
      });
      const ro = new _ResizeObserver((entries) => {
        setScrollHeight(entries[0].contentRect.height);
      });
      return ro.observe(scrollEl), handleScroll(), () => {
        scrollEl.removeEventListener("scroll", handleScroll), ro.unobserve(scrollEl), ro.disconnect();
      };
    }
    const handleScroll_0 = () => {
      setScrollTop(window.scrollY);
    }, handleResize = () => {
      setScrollHeight(window.innerHeight);
    };
    return window.addEventListener("scroll", handleScroll_0, {
      passive: !0
    }), window.addEventListener("resize", handleResize), setScrollHeight(window.innerHeight), handleScroll_0(), () => {
      window.removeEventListener("scroll", handleScroll_0), window.removeEventListener("resize", handleResize);
    };
  }, t8 = [], $[14] = t7, $[15] = t8) : (t7 = $[14], t8 = $[15]), useEffect(t7, t8);
  const len = items.length, height = itemHeight ? len * (itemHeight + space[gap]) - space[gap] : 0, fromIndex = height ? Math.max(Math.floor(scrollTop / height * len) - 2, 0) : 0, toIndex = height ? Math.ceil((scrollTop + scrollHeight) / height * len) + 1 : 0;
  let t10, t9;
  $[16] !== fromIndex || $[17] !== gap || $[18] !== itemHeight || $[19] !== onChange || $[20] !== scrollHeight || $[21] !== scrollTop || $[22] !== space || $[23] !== toIndex ? (t9 = () => {
    onChange && onChange({
      fromIndex,
      gap: space[gap],
      itemHeight,
      scrollHeight,
      scrollTop,
      toIndex
    });
  }, t10 = [fromIndex, gap, itemHeight, onChange, scrollHeight, scrollTop, space, toIndex], $[16] = fromIndex, $[17] = gap, $[18] = itemHeight, $[19] = onChange, $[20] = scrollHeight, $[21] = scrollTop, $[22] = space, $[23] = toIndex, $[24] = t10, $[25] = t9) : (t10 = $[24], t9 = $[25]), useEffect(t9, t10);
  let t11;
  $[26] !== fromIndex || $[27] !== gap || $[28] !== getItemKey || $[29] !== itemHeight || $[30] !== items || $[31] !== renderItem || $[32] !== space || $[33] !== toIndex ? (t11 = {
    fromIndex,
    gap,
    itemHeight,
    space,
    toIndex,
    getItemKey,
    items,
    renderItem
  }, $[26] = fromIndex, $[27] = gap, $[28] = getItemKey, $[29] = itemHeight, $[30] = items, $[31] = renderItem, $[32] = space, $[33] = toIndex, $[34] = t11) : t11 = $[34];
  const children = useChildren(t11);
  let t12;
  $[35] !== height ? (t12 = {
    height
  }, $[35] = height, $[36] = t12) : t12 = $[36];
  let t13;
  $[37] !== children || $[38] !== t12 ? (t13 = /* @__PURE__ */ jsx("div", { ref: wrapperRef, style: t12, children }), $[37] = children, $[38] = t12, $[39] = t13) : t13 = $[39];
  let t14;
  return $[40] !== as || $[41] !== restProps || $[42] !== t13 ? (t14 = /* @__PURE__ */ jsx(StyledVirtualList, { as, "data-ui": "VirtualList", ...restProps, ref, children: t13 }), $[40] = as, $[41] = restProps, $[42] = t13, $[43] = t14) : t14 = $[43], t14;
});
VirtualList.displayName = "ForwardRef(VirtualList)";
function useChildren(t0) {
  const $ = distExports.c(21), {
    fromIndex,
    gap,
    getItemKey,
    itemHeight,
    items,
    renderItem,
    space,
    toIndex
  } = t0;
  if (!renderItem || items.length === 0)
    return null;
  if (itemHeight === -1) {
    let t12;
    $[0] !== items[0] || $[1] !== renderItem ? (t12 = renderItem(items[0]), $[0] = items[0], $[1] = renderItem, $[2] = t12) : t12 = $[2];
    let t2;
    return $[3] !== t12 ? (t2 = [/* @__PURE__ */ jsx(ItemWrapper, { children: t12 }, 0)], $[3] = t12, $[4] = t2) : t2 = $[4], t2;
  }
  let t1;
  if ($[5] !== fromIndex || $[6] !== gap || $[7] !== getItemKey || $[8] !== itemHeight || $[9] !== items || $[10] !== renderItem || $[11] !== space || $[12] !== toIndex) {
    let t2;
    $[14] !== fromIndex || $[15] !== gap || $[16] !== getItemKey || $[17] !== itemHeight || $[18] !== renderItem || $[19] !== space ? (t2 = (item, _itemIndex) => {
      const itemIndex = fromIndex + _itemIndex, node = renderItem(item), key2 = getItemKey ? getItemKey(item, itemIndex) : itemIndex;
      return /* @__PURE__ */ jsx(ItemWrapper, { style: {
        top: itemIndex * (itemHeight + space[gap])
      }, children: node }, key2);
    }, $[14] = fromIndex, $[15] = gap, $[16] = getItemKey, $[17] = itemHeight, $[18] = renderItem, $[19] = space, $[20] = t2) : t2 = $[20], t1 = items.slice(fromIndex, toIndex).map(t2), $[5] = fromIndex, $[6] = gap, $[7] = getItemKey, $[8] = itemHeight, $[9] = items, $[10] = renderItem, $[11] = space, $[12] = toIndex, $[13] = t1;
  } else
    t1 = $[13];
  return t1;
}
function findScrollable(parentNode) {
  let _scrollEl = parentNode;
  for (; _scrollEl && !_isScrollable(_scrollEl); )
    _scrollEl = _scrollEl.parentNode;
  return _scrollEl;
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get, mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  return mayWarn ? element.ref : (getter = Object.getOwnPropertyDescriptor(element, "ref")?.get, mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning, mayWarn ? element.props.ref : element.props.ref || element.ref);
}
const DEFAULT_POPOVER_DISTANCE = 4, DEFAULT_POPOVER_PADDING = 4, DEFAULT_POPOVER_ARROW_WIDTH = 19, DEFAULT_POPOVER_ARROW_HEIGHT = 8, DEFAULT_POPOVER_ARROW_RADIUS = 2, DEFAULT_POPOVER_MARGINS = [0, 0, 0, 0], DEFAULT_FALLBACK_PLACEMENTS$1 = {
  top: ["bottom", "left", "right"],
  "top-start": ["bottom-start", "left-start", "right-start"],
  "top-end": ["bottom-end", "left-end", "right-end"],
  bottom: ["top", "left", "right"],
  "bottom-start": ["top-start", "left-start", "right-start"],
  "bottom-end": ["top-end", "left-end", "right-end"],
  left: ["right", "top", "bottom"],
  "left-start": ["right-start", "top-start", "bottom-start"],
  "left-end": ["right-end", "top-end", "bottom-end"],
  right: ["left", "top", "bottom"],
  "right-start": ["left-start", "top-start", "bottom-start"],
  "right-end": ["left-end", "top-end", "bottom-end"]
};
function size(options) {
  const {
    constrainSize,
    margins,
    matchReferenceWidth,
    maxWidthRef,
    padding = 0,
    referenceWidthRef,
    setReferenceWidth,
    widthRef
  } = options;
  return {
    name: "@sanity/ui/size",
    async fn(args) {
      const {
        elements,
        placement,
        platform: platform2,
        rects
      } = args, {
        floating,
        reference
      } = rects, overflow = await detectOverflow(args, {
        altBoundary: !0,
        boundary: options.boundaryElement || void 0,
        elementContext: "floating",
        padding,
        rootBoundary: "viewport"
      });
      let maxWidth = 1 / 0, maxHeight = 1 / 0;
      const floatingW = floating.width, floatingH = floating.height;
      placement.includes("top") && (maxWidth = floatingW - (overflow.left + overflow.right), maxHeight = floatingH - overflow.top), placement.includes("right") && (maxWidth = floatingW - overflow.right, maxHeight = floatingH - (overflow.top + overflow.bottom)), placement.includes("bottom") && (maxWidth = floatingW - (overflow.left + overflow.right), maxHeight = floatingH - overflow.bottom), placement.includes("left") && (maxWidth = floatingW - overflow.left, maxHeight = floatingH - (overflow.top + overflow.bottom));
      const availableWidth = maxWidth - margins[1] - margins[3], availableHeight = maxHeight - margins[0] - margins[2], referenceWidth = reference.width - margins[1] - margins[3];
      referenceWidthRef.current = referenceWidth, setReferenceWidth(referenceWidth), matchReferenceWidth ? elements.floating.style.width = `${referenceWidth}px` : widthRef.current !== void 0 && (elements.floating.style.width = `${widthRef.current}px`), constrainSize && (elements.floating.style.maxWidth = `${Math.min(availableWidth, maxWidthRef.current ?? 1 / 0)}px`, elements.floating.style.maxHeight = `${availableHeight}px`);
      const nextDimensions = await platform2.getDimensions(elements.floating), targetH = nextDimensions.height, targetW = nextDimensions.width;
      return floatingW !== targetW || floatingH !== targetH ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
}
function calcCurrentWidth(params) {
  const {
    container,
    mediaIndex,
    width
  } = params, w = width[mediaIndex], currentWidth = w === void 0 ? width[width.length - 1] : w;
  return typeof currentWidth == "number" ? container[currentWidth] : void 0;
}
function calcMaxWidth(params) {
  const {
    boundaryWidth,
    currentWidth
  } = params;
  if (!(currentWidth === void 0 && boundaryWidth === void 0))
    return Math.min(currentWidth ?? 1 / 0, (boundaryWidth || 1 / 0) - DEFAULT_POPOVER_PADDING * 2);
}
const MotionCard$1 = styled(motion.create(Card)).withConfig({
  displayName: "MotionCard",
  componentId: "sc-ihg31s-0"
})`&:not([hidden]){display:flex;}flex-direction:column;width:max-content;min-width:min-content;will-change:transform;`, MotionFlex = styled(motion.create(Flex)).withConfig({
  displayName: "MotionFlex",
  componentId: "sc-ihg31s-1"
})`will-change:opacity;`, PopoverCard = forwardRef(function(props, ref) {
  const $ = distExports.c(66);
  let animate, arrow2, arrowRef, arrowX, arrowY, children, marginsProp, originX, originY, overflow, padding, placement, radius, restProps, scheme, shadow, strategy, style, tone, width, xProp, yProp;
  $[0] !== props ? ({
    __unstable_margins: marginsProp,
    animate,
    arrow: arrow2,
    arrowRef,
    arrowX,
    arrowY,
    children,
    padding,
    placement,
    originX,
    originY,
    overflow,
    radius,
    scheme,
    shadow,
    strategy,
    style,
    tone,
    width,
    x: xProp,
    y: yProp,
    ...restProps
  } = props, $[0] = props, $[1] = animate, $[2] = arrow2, $[3] = arrowRef, $[4] = arrowX, $[5] = arrowY, $[6] = children, $[7] = marginsProp, $[8] = originX, $[9] = originY, $[10] = overflow, $[11] = padding, $[12] = placement, $[13] = radius, $[14] = restProps, $[15] = scheme, $[16] = shadow, $[17] = strategy, $[18] = style, $[19] = tone, $[20] = width, $[21] = xProp, $[22] = yProp) : (animate = $[1], arrow2 = $[2], arrowRef = $[3], arrowX = $[4], arrowY = $[5], children = $[6], marginsProp = $[7], originX = $[8], originY = $[9], overflow = $[10], padding = $[11], placement = $[12], radius = $[13], restProps = $[14], scheme = $[15], shadow = $[16], strategy = $[17], style = $[18], tone = $[19], width = $[20], xProp = $[21], yProp = $[22]);
  const {
    zIndex
  } = useLayer(), margins = marginsProp || DEFAULT_POPOVER_MARGINS, x = (xProp ?? 0) + margins[3], y = (yProp ?? 0) + margins[0], t0 = animate ? "transform" : void 0;
  let t1;
  $[23] !== originX || $[24] !== originY || $[25] !== strategy || $[26] !== style || $[27] !== t0 || $[28] !== width || $[29] !== x || $[30] !== y || $[31] !== zIndex ? (t1 = {
    left: x,
    originX,
    originY,
    position: strategy,
    top: y,
    width,
    zIndex,
    willChange: t0,
    ...style
  }, $[23] = originX, $[24] = originY, $[25] = strategy, $[26] = style, $[27] = t0, $[28] = width, $[29] = x, $[30] = y, $[31] = zIndex, $[32] = t1) : t1 = $[32];
  const rootStyle2 = t1, t2 = arrowX !== null ? arrowX : void 0, t3 = arrowY !== null ? arrowY : void 0;
  let t4;
  $[33] !== t2 || $[34] !== t3 ? (t4 = {
    left: t2,
    top: t3,
    right: void 0,
    bottom: void 0
  }, $[33] = t2, $[34] = t3, $[35] = t4) : t4 = $[35];
  const arrowStyle = t4, t5 = restProps;
  let t6;
  $[36] !== animate ? (t6 = animate ? ["hidden", "initial"] : void 0, $[36] = animate, $[37] = t6) : t6 = $[37];
  let t7;
  $[38] !== animate ? (t7 = animate ? ["visible", "scaleIn"] : void 0, $[38] = animate, $[39] = t7) : t7 = $[39];
  let t8;
  $[40] !== animate ? (t8 = animate ? ["hidden", "scaleOut"] : void 0, $[40] = animate, $[41] = t8) : t8 = $[41];
  let t9;
  $[42] !== children || $[43] !== padding ? (t9 = /* @__PURE__ */ jsx(Flex, { direction: "column", flex: 1, padding, children }), $[42] = children, $[43] = padding, $[44] = t9) : t9 = $[44];
  let t10;
  $[45] !== overflow || $[46] !== t9 ? (t10 = /* @__PURE__ */ jsx(MotionFlex, { "data-ui": "Popover__wrapper", direction: "column", flex: 1, overflow, variants: POPOVER_MOTION_PROPS.children, transition: POPOVER_MOTION_PROPS.transition, children: t9 }), $[45] = overflow, $[46] = t9, $[47] = t10) : t10 = $[47];
  let t11;
  $[48] !== arrow2 || $[49] !== arrowRef || $[50] !== arrowStyle ? (t11 = arrow2 && /* @__PURE__ */ jsx(Arrow, { ref: arrowRef, style: arrowStyle, width: DEFAULT_POPOVER_ARROW_WIDTH, height: DEFAULT_POPOVER_ARROW_HEIGHT, radius: DEFAULT_POPOVER_ARROW_RADIUS }), $[48] = arrow2, $[49] = arrowRef, $[50] = arrowStyle, $[51] = t11) : t11 = $[51];
  let t12;
  return $[52] !== placement || $[53] !== radius || $[54] !== ref || $[55] !== rootStyle2 || $[56] !== scheme || $[57] !== shadow || $[58] !== t10 || $[59] !== t11 || $[60] !== t5 || $[61] !== t6 || $[62] !== t7 || $[63] !== t8 || $[64] !== tone ? (t12 = /* @__PURE__ */ jsxs(MotionCard$1, { "data-ui": "Popover", ...t5, "data-placement": placement, radius, ref, scheme, shadow, sizing: "border", style: rootStyle2, tone, variants: POPOVER_MOTION_PROPS.card, transition: POPOVER_MOTION_PROPS.transition, initial: t6, animate: t7, exit: t8, children: [
    t10,
    t11
  ] }), $[52] = placement, $[53] = radius, $[54] = ref, $[55] = rootStyle2, $[56] = scheme, $[57] = shadow, $[58] = t10, $[59] = t11, $[60] = t5, $[61] = t6, $[62] = t7, $[63] = t8, $[64] = tone, $[65] = t12) : t12 = $[65], t12;
});
PopoverCard.displayName = "ForwardRef(PopoverCard)";
const ViewportOverlay = () => {
  const $ = distExports.c(2), {
    zIndex
  } = useLayer();
  let t0;
  return $[0] !== zIndex ? (t0 = /* @__PURE__ */ jsx("div", { style: {
    height: "100vh",
    inset: 0,
    position: "fixed",
    width: "100vw",
    zIndex
  } }), $[0] = zIndex, $[1] = t0) : t0 = $[1], t0;
}, Popover = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(126), {
    container,
    layer
  } = useTheme_v2(), boundaryElementContext = useBoundaryElement();
  let _boundaryElement, _fallbackPlacements, _floatingBoundary, _referenceBoundary, _zOffsetProp, childProp, content, disabled, matchReferenceWidth, modal, open, paddingProp, portal, referenceElement, restProps, scheme, t0, t1, t10, t11, t2, t3, t4, t5, t6, t7, t8, t9, updateRef;
  if ($[0] !== props) {
    const {
      __unstable_margins: t122,
      animate: t132,
      arrow: t142,
      boundaryElement: t152,
      children: t162,
      constrainSize: t172,
      content: t182,
      disabled: t192,
      fallbackPlacements: t202,
      matchReferenceWidth: t212,
      floatingBoundary: t222,
      modal: t232,
      onActivate,
      open: t242,
      overflow: t252,
      padding: t262,
      placement: t272,
      placementStrategy: t282,
      portal: t292,
      preventOverflow: t302,
      radius: t312,
      referenceBoundary: t322,
      referenceElement: t332,
      scheme: t342,
      shadow: t352,
      tone: t362,
      width: t372,
      zOffset: t382,
      updateRef: t392,
      ...t402
    } = props;
    t0 = t122, t1 = t132, t2 = t142, _boundaryElement = t152, childProp = t162, t3 = t172, content = t182, disabled = t192, _fallbackPlacements = t202, matchReferenceWidth = t212, _floatingBoundary = t222, modal = t232, open = t242, t4 = t252, paddingProp = t262, t5 = t272, t6 = t282, portal = t292, t7 = t302, t8 = t312, _referenceBoundary = t322, referenceElement = t332, scheme = t342, t9 = t352, t10 = t362, t11 = t372, _zOffsetProp = t382, updateRef = t392, restProps = t402, $[0] = props, $[1] = _boundaryElement, $[2] = _fallbackPlacements, $[3] = _floatingBoundary, $[4] = _referenceBoundary, $[5] = _zOffsetProp, $[6] = childProp, $[7] = content, $[8] = disabled, $[9] = matchReferenceWidth, $[10] = modal, $[11] = open, $[12] = paddingProp, $[13] = portal, $[14] = referenceElement, $[15] = restProps, $[16] = scheme, $[17] = t0, $[18] = t1, $[19] = t10, $[20] = t11, $[21] = t2, $[22] = t3, $[23] = t4, $[24] = t5, $[25] = t6, $[26] = t7, $[27] = t8, $[28] = t9, $[29] = updateRef;
  } else
    _boundaryElement = $[1], _fallbackPlacements = $[2], _floatingBoundary = $[3], _referenceBoundary = $[4], _zOffsetProp = $[5], childProp = $[6], content = $[7], disabled = $[8], matchReferenceWidth = $[9], modal = $[10], open = $[11], paddingProp = $[12], portal = $[13], referenceElement = $[14], restProps = $[15], scheme = $[16], t0 = $[17], t1 = $[18], t10 = $[19], t11 = $[20], t2 = $[21], t3 = $[22], t4 = $[23], t5 = $[24], t6 = $[25], t7 = $[26], t8 = $[27], t9 = $[28], updateRef = $[29];
  const margins = t0 === void 0 ? DEFAULT_POPOVER_MARGINS : t0, _animate = t1 === void 0 ? !1 : t1, arrowProp = t2 === void 0 ? !1 : t2, constrainSize = t3 === void 0 ? !1 : t3, overflow = t4 === void 0 ? "hidden" : t4, placementProp = t5 === void 0 ? "bottom" : t5, placementStrategy = t6 === void 0 ? "flip" : t6, preventOverflow = t7 === void 0 ? !0 : t7, radiusProp = t8 === void 0 ? 3 : t8, shadowProp = t9 === void 0 ? 3 : t9, tone = t10 === void 0 ? "inherit" : t10, widthProp = t11 === void 0 ? "auto" : t11, boundaryElement = _boundaryElement ?? boundaryElementContext?.element, fallbackPlacements = _fallbackPlacements ?? DEFAULT_FALLBACK_PLACEMENTS$1[props.placement ?? "bottom"], floatingBoundary = _floatingBoundary ?? props.boundaryElement ?? boundaryElementContext.element, referenceBoundary = _referenceBoundary ?? props.boundaryElement ?? boundaryElementContext.element, zOffsetProp = _zOffsetProp ?? layer.popover.zOffset, animate = usePrefersReducedMotion() ? !1 : _animate, boundarySize = useElementSize(boundaryElement)?.border;
  let t12;
  $[30] !== paddingProp ? (t12 = _getArrayProp(paddingProp), $[30] = paddingProp, $[31] = t12) : t12 = $[31];
  const padding = t12;
  let t13;
  $[32] !== radiusProp ? (t13 = _getArrayProp(radiusProp), $[32] = radiusProp, $[33] = t13) : t13 = $[33];
  const radius = t13;
  let t14;
  $[34] !== shadowProp ? (t14 = _getArrayProp(shadowProp), $[34] = shadowProp, $[35] = t14) : t14 = $[35];
  const shadow = t14, widthArrayProp = _getArrayProp(widthProp);
  let t15;
  $[36] !== zOffsetProp ? (t15 = _getArrayProp(zOffsetProp), $[36] = zOffsetProp, $[37] = t15) : t15 = $[37];
  const zOffset = t15, ref = useRef(null), arrowRef = useRef(null);
  let t16;
  $[38] === Symbol.for("react.memo_cache_sentinel") ? (t16 = () => ref.current, $[38] = t16) : t16 = $[38], useImperativeHandle(forwardedRef, t16);
  const mediaIndex = useMediaIndex(), boundaryWidth = constrainSize || preventOverflow ? boundarySize?.width : void 0, width = calcCurrentWidth({
    container,
    mediaIndex,
    width: widthArrayProp
  }), widthRef = useRef(width);
  let t17, t18;
  $[39] !== width ? (t17 = () => {
    widthRef.current = width;
  }, t18 = [width], $[39] = width, $[40] = t17, $[41] = t18) : (t17 = $[40], t18 = $[41]), useEffect(t17, t18);
  let t19;
  $[42] !== boundaryWidth || $[43] !== width ? (t19 = calcMaxWidth({
    boundaryWidth,
    currentWidth: width
  }), $[42] = boundaryWidth, $[43] = width, $[44] = t19) : t19 = $[44];
  const maxWidth = t19, maxWidthRef = useRef(maxWidth);
  let t20, t21;
  $[45] !== maxWidth ? (t20 = () => {
    maxWidthRef.current = maxWidth;
  }, t21 = [maxWidth], $[45] = maxWidth, $[46] = t20, $[47] = t21) : (t20 = $[46], t21 = $[47]), useEffect(t20, t21);
  const referenceWidthRef = useRef(void 0);
  let t22, t23;
  $[48] !== matchReferenceWidth || $[49] !== maxWidth || $[50] !== open || $[51] !== width ? (t22 = () => {
    const floatingElement = ref.current;
    if (!open || !floatingElement)
      return;
    const referenceWidth = referenceWidthRef.current;
    matchReferenceWidth ? referenceWidth !== void 0 && (floatingElement.style.width = `${referenceWidth}px`) : width !== void 0 && (floatingElement.style.width = `${width}px`), typeof maxWidth == "number" && (floatingElement.style.maxWidth = `${maxWidth}px`);
  }, t23 = [width, matchReferenceWidth, maxWidth, open], $[48] = matchReferenceWidth, $[49] = maxWidth, $[50] = open, $[51] = width, $[52] = t22, $[53] = t23) : (t22 = $[52], t23 = $[53]), useEffect(t22, t23);
  const [referenceWidth_0, setReferenceWidth] = useState(void 0);
  let t24;
  $[54] !== animate || $[55] !== arrowProp || $[56] !== constrainSize || $[57] !== fallbackPlacements || $[58] !== floatingBoundary || $[59] !== margins || $[60] !== matchReferenceWidth || $[61] !== placementProp || $[62] !== placementStrategy || $[63] !== preventOverflow || $[64] !== referenceBoundary ? (t24 = {
    animate,
    arrowProp,
    arrowRef,
    constrainSize,
    fallbackPlacements,
    floatingBoundary,
    margins,
    matchReferenceWidth,
    maxWidthRef,
    placementProp,
    placementStrategy,
    preventOverflow,
    referenceBoundary,
    referenceWidthRef,
    rootBoundary: "viewport",
    setReferenceWidth,
    widthRef
  }, $[54] = animate, $[55] = arrowProp, $[56] = constrainSize, $[57] = fallbackPlacements, $[58] = floatingBoundary, $[59] = margins, $[60] = matchReferenceWidth, $[61] = placementProp, $[62] = placementStrategy, $[63] = preventOverflow, $[64] = referenceBoundary, $[65] = t24) : t24 = $[65];
  const middleware = useMiddleware$1(t24);
  let t25;
  $[66] !== referenceElement ? (t25 = referenceElement ? {
    reference: referenceElement
  } : void 0, $[66] = referenceElement, $[67] = t25) : t25 = $[67];
  let t26;
  $[68] !== middleware || $[69] !== placementProp || $[70] !== t25 ? (t26 = {
    middleware,
    placement: placementProp,
    whileElementsMounted: autoUpdate,
    elements: t25
  }, $[68] = middleware, $[69] = placementProp, $[70] = t25, $[71] = t26) : t26 = $[71];
  const {
    x,
    y,
    middlewareData,
    placement,
    refs,
    strategy,
    update
  } = useFloating(t26), referenceHidden = middlewareData.hide?.referenceHidden, arrowX = middlewareData.arrow?.x, arrowY = middlewareData.arrow?.y, originX = middlewareData["@sanity/ui/origin"]?.originX, originY = middlewareData["@sanity/ui/origin"]?.originY;
  let t27;
  $[72] === Symbol.for("react.memo_cache_sentinel") ? (t27 = (arrowEl) => {
    arrowRef.current = arrowEl;
  }, $[72] = t27) : t27 = $[72];
  const setArrow = t27;
  let t28;
  $[73] !== refs ? (t28 = (node) => {
    ref.current = node, refs.setFloating(node);
  }, $[73] = refs, $[74] = t28) : t28 = $[74];
  const setFloating = t28;
  let t29;
  $[75] !== childProp ? (t29 = childProp ? getElementRef(childProp) : null, $[75] = childProp, $[76] = t29) : t29 = $[76];
  let t30;
  $[77] !== refs.reference.current ? (t30 = () => refs.reference.current, $[77] = refs.reference.current, $[78] = t30) : t30 = $[78], useImperativeHandle(t29, t30);
  let t31;
  bb0: {
    if (referenceElement) {
      t31 = childProp;
      break bb0;
    }
    if (!childProp) {
      t31 = null;
      break bb0;
    }
    let t322;
    $[79] !== childProp || $[80] !== refs.setReference ? (t322 = cloneElement(childProp, {
      ref: refs.setReference
    }), $[79] = childProp, $[80] = refs.setReference, $[81] = t322) : t322 = $[81], t31 = t322;
  }
  const child = t31;
  let t32, t33;
  if ($[82] !== update ? (t32 = () => update, t33 = [update], $[82] = update, $[83] = t32, $[84] = t33) : (t32 = $[83], t33 = $[84]), useImperativeHandle(updateRef, t32, t33), disabled) {
    let t342;
    return $[85] !== childProp ? (t342 = childProp || /* @__PURE__ */ jsx(Fragment, {}), $[85] = childProp, $[86] = t342) : t342 = $[86], t342;
  }
  let t34;
  $[87] !== modal ? (t34 = modal && /* @__PURE__ */ jsx(ViewportOverlay, {}), $[87] = modal, $[88] = t34) : t34 = $[88];
  const t35 = matchReferenceWidth ? referenceWidth_0 : width;
  let t36;
  $[89] !== animate || $[90] !== arrowProp || $[91] !== arrowX || $[92] !== arrowY || $[93] !== content || $[94] !== margins || $[95] !== originX || $[96] !== originY || $[97] !== overflow || $[98] !== padding || $[99] !== placement || $[100] !== radius || $[101] !== referenceHidden || $[102] !== restProps || $[103] !== scheme || $[104] !== setFloating || $[105] !== shadow || $[106] !== strategy || $[107] !== t35 || $[108] !== tone || $[109] !== x || $[110] !== y ? (t36 = /* @__PURE__ */ jsx(PopoverCard, { ...restProps, __unstable_margins: margins, animate, arrow: arrowProp, arrowRef: setArrow, arrowX, arrowY, hidden: referenceHidden, overflow, padding, placement, radius, ref: setFloating, scheme, shadow, originX, originY, strategy, tone, width: t35, x, y, children: content }), $[89] = animate, $[90] = arrowProp, $[91] = arrowX, $[92] = arrowY, $[93] = content, $[94] = margins, $[95] = originX, $[96] = originY, $[97] = overflow, $[98] = padding, $[99] = placement, $[100] = radius, $[101] = referenceHidden, $[102] = restProps, $[103] = scheme, $[104] = setFloating, $[105] = shadow, $[106] = strategy, $[107] = t35, $[108] = tone, $[109] = x, $[110] = y, $[111] = t36) : t36 = $[111];
  let t37;
  $[112] !== t34 || $[113] !== t36 || $[114] !== zOffset ? (t37 = /* @__PURE__ */ jsxs(LayerProvider, { zOffset, children: [
    t34,
    t36
  ] }), $[112] = t34, $[113] = t36, $[114] = zOffset, $[115] = t37) : t37 = $[115];
  const popover = t37;
  let t38;
  $[116] !== open || $[117] !== popover || $[118] !== portal ? (t38 = open && (portal ? /* @__PURE__ */ jsx(Portal, { __unstable_name: typeof portal == "string" ? portal : void 0, children: popover }) : popover), $[116] = open, $[117] = popover, $[118] = portal, $[119] = t38) : t38 = $[119];
  const children = t38;
  let t39;
  $[120] !== animate || $[121] !== children ? (t39 = animate ? /* @__PURE__ */ jsx(AnimatePresence, { children }) : children, $[120] = animate, $[121] = children, $[122] = t39) : t39 = $[122];
  let t40;
  return $[123] !== child || $[124] !== t39 ? (t40 = /* @__PURE__ */ jsxs(Fragment, { children: [
    t39,
    child
  ] }), $[123] = child, $[124] = t39, $[125] = t40) : t40 = $[125], t40;
});
Popover.displayName = "ForwardRef(Popover)";
function useMiddleware$1(t0) {
  const $ = distExports.c(42), {
    animate,
    arrowProp,
    arrowRef,
    constrainSize,
    fallbackPlacements,
    floatingBoundary,
    margins,
    matchReferenceWidth,
    maxWidthRef,
    placementProp,
    placementStrategy,
    preventOverflow,
    referenceBoundary,
    referenceWidthRef,
    rootBoundary,
    setReferenceWidth,
    widthRef
  } = t0;
  let ret;
  if ($[0] !== animate || $[1] !== arrowProp || $[2] !== arrowRef || $[3] !== constrainSize || $[4] !== fallbackPlacements || $[5] !== floatingBoundary || $[6] !== margins || $[7] !== matchReferenceWidth || $[8] !== maxWidthRef || $[9] !== placementProp || $[10] !== placementStrategy || $[11] !== preventOverflow || $[12] !== referenceBoundary || $[13] !== referenceWidthRef || $[14] !== rootBoundary || $[15] !== setReferenceWidth || $[16] !== widthRef) {
    if (ret = [], constrainSize || preventOverflow)
      if (placementStrategy === "autoPlacement") {
        let t12;
        $[18] !== fallbackPlacements || $[19] !== placementProp ? (t12 = autoPlacement({
          allowedPlacements: [placementProp].concat(fallbackPlacements)
        }), $[18] = fallbackPlacements, $[19] = placementProp, $[20] = t12) : t12 = $[20], ret.push(t12);
      } else {
        const t12 = floatingBoundary || void 0;
        let t22;
        $[21] !== fallbackPlacements || $[22] !== rootBoundary || $[23] !== t12 ? (t22 = flip({
          boundary: t12,
          fallbackPlacements,
          padding: DEFAULT_POPOVER_PADDING,
          rootBoundary
        }), $[21] = fallbackPlacements, $[22] = rootBoundary, $[23] = t12, $[24] = t22) : t22 = $[24], ret.push(t22);
      }
    let t1;
    if ($[25] === Symbol.for("react.memo_cache_sentinel") ? (t1 = offset({
      mainAxis: DEFAULT_POPOVER_DISTANCE
    }), $[25] = t1) : t1 = $[25], ret.push(t1), constrainSize || matchReferenceWidth) {
      const t22 = floatingBoundary || void 0;
      let t32;
      $[26] !== constrainSize || $[27] !== margins || $[28] !== matchReferenceWidth || $[29] !== maxWidthRef || $[30] !== referenceWidthRef || $[31] !== setReferenceWidth || $[32] !== t22 || $[33] !== widthRef ? (t32 = size({
        boundaryElement: t22,
        constrainSize,
        margins,
        matchReferenceWidth,
        maxWidthRef,
        padding: DEFAULT_POPOVER_PADDING,
        referenceWidthRef,
        setReferenceWidth,
        widthRef
      }), $[26] = constrainSize, $[27] = margins, $[28] = matchReferenceWidth, $[29] = maxWidthRef, $[30] = referenceWidthRef, $[31] = setReferenceWidth, $[32] = t22, $[33] = widthRef, $[34] = t32) : t32 = $[34], ret.push(t32);
    }
    if (preventOverflow) {
      const t22 = floatingBoundary || void 0;
      let t32;
      $[35] !== rootBoundary || $[36] !== t22 ? (t32 = shift({
        boundary: t22,
        rootBoundary,
        padding: DEFAULT_POPOVER_PADDING
      }), $[35] = rootBoundary, $[36] = t22, $[37] = t32) : t32 = $[37], ret.push(t32);
    }
    if (arrowProp) {
      let t22;
      $[38] !== arrowRef ? (t22 = arrow({
        element: arrowRef,
        padding: DEFAULT_POPOVER_PADDING
      }), $[38] = arrowRef, $[39] = t22) : t22 = $[39], ret.push(t22);
    }
    animate && ret.push(origin);
    const t2 = referenceBoundary || void 0;
    let t3;
    $[40] !== t2 ? (t3 = hide({
      boundary: t2,
      padding: DEFAULT_POPOVER_PADDING,
      strategy: "referenceHidden"
    }), $[40] = t2, $[41] = t3) : t3 = $[41], ret.push(t3), $[0] = animate, $[1] = arrowProp, $[2] = arrowRef, $[3] = constrainSize, $[4] = fallbackPlacements, $[5] = floatingBoundary, $[6] = margins, $[7] = matchReferenceWidth, $[8] = maxWidthRef, $[9] = placementProp, $[10] = placementStrategy, $[11] = preventOverflow, $[12] = referenceBoundary, $[13] = referenceWidthRef, $[14] = rootBoundary, $[15] = setReferenceWidth, $[16] = widthRef, $[17] = ret;
  } else
    ret = $[17];
  return ret;
}
function radioBaseStyle() {
  return css`
    position: relative;

    &:not([hidden]) {
      display: inline-block;
    }

    &[data-read-only] {
      outline: 1px solid red;
    }
  `;
}
function inputElementStyle(props) {
  const {
    color: color2,
    input
  } = getTheme_v2(props.theme), dist2 = (input.radio.size - input.radio.markSize) / 2;
  return css`
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    outline: none;
    z-index: 1;
    padding: 0;
    margin: 0;
    border-radius: ${rem(input.radio.size / 2)};
    border: none;

    /* enabled */
    & + span {
      display: block;
      position: relative;
      height: ${rem(input.radio.size)};
      width: ${rem(input.radio.size)};
      border-radius: ${rem(input.radio.size / 2)};
      background: ${color2.input.default.enabled.bg};
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.border,
    width: input.border.width
  })};

      &::after {
        content: '';
        position: absolute;
        top: ${rem(dist2)};
        left: ${rem(dist2)};
        height: ${rem(input.radio.markSize)};
        width: ${rem(input.radio.markSize)};
        border-radius: ${rem(input.radio.markSize / 2)};
        background: ${color2.input.default.enabled.fg};
        opacity: 0;
      }
    }

    /* focused */
    &:not(:disabled):focus + span {
      box-shadow: ${focusRingStyle({
    border: {
      width: input.border.width,
      color: color2.input.default.enabled.border
    },
    focusRing: input.radio.focusRing
  })};
    }

    &:not(:disabled):focus:not(:focus-visible) + span {
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.border,
    width: input.border.width
  })};
    }

    &:checked + span::after {
      opacity: 1;
    }

    /* customValidity */
    &[data-error] + span {
      background-color: ${color2.input.invalid.enabled.border};
      box-shadow: ${focusRingBorderStyle({
    width: input.border.width,
    color: color2.input.invalid.enabled.muted.bg
  })};
      &::after {
        background: ${color2.input.invalid.enabled.muted.bg};
      }
    }

    /* read only */
    &[data-read-only] + span {
      box-shadow: 0 0 0 1px ${color2.input.default.readOnly.border};
      background: ${color2.input.default.readOnly.bg};

      &::after {
        background: ${color2.input.default.readOnly.border};
      }
    }

    /* disabled */
    &:not([data-read-only]):disabled + span {
      box-shadow: 0 0 0 1px ${color2.input.default.disabled.border};
      background: ${color2.input.default.disabled.bg};

      &::after {
        background: ${color2.input.default.disabled.border};
      }
    }
  `;
}
const StyledRadio = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledRadio",
  componentId: "sc-ccrwkf-0"
})(radioBaseStyle), Input$4 = /* @__PURE__ */ styled.input.withConfig({
  displayName: "Input",
  componentId: "sc-ccrwkf-1"
})(inputElementStyle), Radio = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(19);
  let className, customValidity, disabled, readOnly, restProps, style;
  $[0] !== props ? ({
    className,
    disabled,
    style,
    customValidity,
    readOnly,
    ...restProps
  } = props, $[0] = props, $[1] = className, $[2] = customValidity, $[3] = disabled, $[4] = readOnly, $[5] = restProps, $[6] = style) : (className = $[1], customValidity = $[2], disabled = $[3], readOnly = $[4], restProps = $[5], style = $[6]);
  const ref = useRef(null);
  let t0;
  $[7] === Symbol.for("react.memo_cache_sentinel") ? (t0 = () => ref.current, $[7] = t0) : t0 = $[7], useImperativeHandle(forwardedRef, t0), useCustomValidity(ref, customValidity);
  const t1 = !disabled && readOnly ? "" : void 0, t2 = customValidity ? "" : void 0, t3 = disabled || readOnly;
  let t4;
  $[8] !== readOnly || $[9] !== restProps || $[10] !== t1 || $[11] !== t2 || $[12] !== t3 ? (t4 = /* @__PURE__ */ jsx(Input$4, { "data-read-only": t1, "data-error": t2, ...restProps, disabled: t3, readOnly, ref, type: "radio" }), $[8] = readOnly, $[9] = restProps, $[10] = t1, $[11] = t2, $[12] = t3, $[13] = t4) : t4 = $[13];
  let t5;
  $[14] === Symbol.for("react.memo_cache_sentinel") ? (t5 = /* @__PURE__ */ jsx("span", {}), $[14] = t5) : t5 = $[14];
  let t6;
  return $[15] !== className || $[16] !== style || $[17] !== t4 ? (t6 = /* @__PURE__ */ jsxs(StyledRadio, { className, "data-ui": "Radio", style, children: [
    t4,
    t5
  ] }), $[15] = className, $[16] = style, $[17] = t4, $[18] = t6) : t6 = $[18], t6;
});
Radio.displayName = "ForwardRef(Radio)";
function rootStyle() {
  return css`
    position: relative;
    width: -moz-available;
    width: -webkit-fill-available;
    width: stretch;

    &:not([hidden]) {
      display: inline-block;
    }
  `;
}
function inputBaseStyle(props) {
  const {
    font
  } = getTheme_v2(props.theme);
  return css`
    -webkit-font-smoothing: antialiased;
    appearance: none;
    border: 0;
    font-family: ${font.text.family};
    color: inherit;
    width: 100%;
    outline: none;
    margin: 0;

    &:disabled {
      opacity: 1;
    }
  `;
}
function inputColorStyle(props) {
  const {
    color: color2,
    input
  } = getTheme_v2(props.theme);
  return css`
    /* enabled */
    background-color: ${color2.input.default.enabled.bg};
    color: ${color2.input.default.enabled.fg};
    box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.enabled.border,
    width: input.border.width
  })};

    /* hovered */
    @media (hover: hover) {
      &:not(:disabled):hover {
        background-color: ${color2.input.default.hovered.bg};
        color: ${color2.input.default.hovered.fg};
        box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.hovered.border,
    width: input.border.width
  })};
      }
    }

    /* focused */
    &:not(:disabled):focus {
      box-shadow: ${focusRingStyle({
    border: {
      width: input.border.width,
      color: color2.input.default.enabled.border
    },
    focusRing: input.select.focusRing
  })};
    }

    /* read-only */
    &[data-read-only] {
      background-color: ${color2.input.default.readOnly.bg};
      color: ${color2.input.default.readOnly.fg};
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.readOnly.border,
    width: input.border.width
  })};
    }

    /* disabled */
    &:not([data-read-only]):disabled {
      background-color: ${color2.input.default.disabled.bg};
      color: ${color2.input.default.disabled.fg};
      box-shadow: ${focusRingBorderStyle({
    color: color2.input.default.disabled.border,
    width: input.border.width
  })};
    }
  `;
}
function textSize(size2) {
  return {
    fontSize: rem(size2.fontSize),
    lineHeight: `${rem(size2.lineHeight)}`
  };
}
function inputTextSizeStyle(props) {
  const {
    $fontSize
  } = props, {
    font,
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, $fontSize, (sizeIndex) => textSize(font.text.sizes[sizeIndex] || font.text.sizes[2]));
}
function inputStyle() {
  return [responsiveRadiusStyle, inputBaseStyle, inputColorStyle, inputTextSizeStyle, responsiveInputPaddingIconRightStyle];
}
function iconBoxStyle(props) {
  const {
    color: color2
  } = getTheme_v2(props.theme);
  return css`
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;

    /* enabled */
    --card-fg-color: ${color2.input.default.enabled.fg};

    /* hover */
    @media (hover: hover) {
      select:not(disabled):not(:read-only):hover + && {
        --card-fg-color: ${color2.input.default.hovered.fg};
      }
    }

    /* disabled */
    select:disabled + && {
      --card-fg-color: ${color2.input.default.disabled.fg};
    }

    /* read-only */
    select[data-read-only] + && {
      --card-fg-color: ${color2.input.default.readOnly.fg};
    }
  `;
}
const selectStyle = {
  root: rootStyle,
  input: inputStyle,
  iconBox: iconBoxStyle
}, StyledSelect = /* @__PURE__ */ styled.div.withConfig({
  displayName: "StyledSelect",
  componentId: "sc-5mxno7-0"
})(selectStyle.root), Input$3 = /* @__PURE__ */ styled.select.withConfig({
  displayName: "Input",
  componentId: "sc-5mxno7-1"
})(selectStyle.input), IconBox = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "IconBox",
  componentId: "sc-5mxno7-2"
})(selectStyle.iconBox), Select = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(37);
  let children, customValidity, disabled, readOnly, restProps, t0, t1, t2, t3;
  $[0] !== props ? ({
    children,
    customValidity,
    disabled,
    fontSize: t0,
    padding: t1,
    radius: t2,
    readOnly,
    space: t3,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = customValidity, $[3] = disabled, $[4] = readOnly, $[5] = restProps, $[6] = t0, $[7] = t1, $[8] = t2, $[9] = t3) : (children = $[1], customValidity = $[2], disabled = $[3], readOnly = $[4], restProps = $[5], t0 = $[6], t1 = $[7], t2 = $[8], t3 = $[9]);
  const fontSize2 = t0 === void 0 ? 2 : t0, padding = t1 === void 0 ? 3 : t1, radius = t2 === void 0 ? 2 : t2, space = t3 === void 0 ? 3 : t3, ref = useRef(null);
  let t4;
  $[10] === Symbol.for("react.memo_cache_sentinel") ? (t4 = () => ref.current, $[10] = t4) : t4 = $[10], useImperativeHandle(forwardedRef, t4), useCustomValidity(ref, customValidity);
  const t5 = !disabled && readOnly ? "" : void 0;
  let t6;
  $[11] !== fontSize2 ? (t6 = _getArrayProp(fontSize2), $[11] = fontSize2, $[12] = t6) : t6 = $[12];
  let t7;
  $[13] !== padding ? (t7 = _getArrayProp(padding), $[13] = padding, $[14] = t7) : t7 = $[14];
  let t8;
  $[15] !== radius ? (t8 = _getArrayProp(radius), $[15] = radius, $[16] = t8) : t8 = $[16];
  let t9;
  $[17] !== space ? (t9 = _getArrayProp(space), $[17] = space, $[18] = t9) : t9 = $[18];
  const t10 = disabled || readOnly;
  let t11;
  $[19] !== children || $[20] !== restProps || $[21] !== t10 || $[22] !== t5 || $[23] !== t6 || $[24] !== t7 || $[25] !== t8 || $[26] !== t9 ? (t11 = /* @__PURE__ */ jsx(Input$3, { "data-read-only": t5, "data-ui": "Select", ...restProps, $fontSize: t6, $padding: t7, $radius: t8, $space: t9, disabled: t10, ref, children }), $[19] = children, $[20] = restProps, $[21] = t10, $[22] = t5, $[23] = t6, $[24] = t7, $[25] = t8, $[26] = t9, $[27] = t11) : t11 = $[27];
  let t12;
  $[28] === Symbol.for("react.memo_cache_sentinel") ? (t12 = /* @__PURE__ */ jsx(ChevronDownIcon, {}), $[28] = t12) : t12 = $[28];
  let t13;
  $[29] !== fontSize2 ? (t13 = /* @__PURE__ */ jsx(Text, { size: fontSize2, children: t12 }), $[29] = fontSize2, $[30] = t13) : t13 = $[30];
  let t14;
  $[31] !== padding || $[32] !== t13 ? (t14 = /* @__PURE__ */ jsx(IconBox, { padding, children: t13 }), $[31] = padding, $[32] = t13, $[33] = t14) : t14 = $[33];
  let t15;
  return $[34] !== t11 || $[35] !== t14 ? (t15 = /* @__PURE__ */ jsxs(StyledSelect, { "data-ui": "Select", children: [
    t11,
    t14
  ] }), $[34] = t11, $[35] = t14, $[36] = t15) : t15 = $[36], t15;
});
Select.displayName = "ForwardRef(Select)";
const BASE_STYLE = {
  "&&:not([hidden])": {
    display: "grid"
  },
  '&[data-as="ul"],&[data-as="ol"]': {
    listStyle: "none"
  },
  gridTemplateColumns: "minmax(0, 1fr)",
  gridAutoRows: "min-content"
};
function stackBaseStyle() {
  return BASE_STYLE;
}
function responsiveStackSpaceStyle(props) {
  const {
    media,
    space
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$space, (spaceIndex) => ({
    gridGap: rem(space[spaceIndex])
  }));
}
const StyledStack = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledStack",
  componentId: "sc-8dpfq2-0"
})(stackBaseStyle, responsiveStackSpaceStyle), Stack = forwardRef(function(props, ref) {
  const $ = distExports.c(12);
  let as, restProps, space;
  $[0] !== props ? ({
    as,
    space,
    ...restProps
  } = props, $[0] = props, $[1] = as, $[2] = restProps, $[3] = space) : (as = $[1], restProps = $[2], space = $[3]);
  const t0 = typeof as == "string" ? as : void 0;
  let t1;
  $[4] !== space ? (t1 = _getArrayProp(space), $[4] = space, $[5] = t1) : t1 = $[5];
  let t2;
  return $[6] !== as || $[7] !== ref || $[8] !== restProps || $[9] !== t0 || $[10] !== t1 ? (t2 = /* @__PURE__ */ jsx(StyledStack, { "data-as": t0, "data-ui": "Stack", ...restProps, $space: t1, forwardedAs: as, ref }), $[6] = as, $[7] = ref, $[8] = restProps, $[9] = t0, $[10] = t1, $[11] = t2) : t2 = $[11], t2;
});
Stack.displayName = "ForwardRef(Stack)";
function switchBaseStyles() {
  return css`
    position: relative;
    &:not([hidden]) {
      display: inline-block;
    }
  `;
}
function switchInputStyles() {
  return css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    outline: none;
    padding: 0;
    margin: 0;

    /* Place the input element above the representation element */
    z-index: 1;
  `;
}
function switchRepresentationStyles(props) {
  const {
    color: color2,
    input
  } = getTheme_v2(props.theme);
  return css`
    --switch-bg-color: ${color2.input.default.enabled.border};
    --switch-fg-color: ${color2.input.default.enabled.bg};
    --switch-box-shadow: none;

    &:not([hidden]) {
      display: block;
    }
    position: relative;
    width: ${rem(input.switch.width)};
    height: ${rem(input.switch.height)};
    border-radius: ${rem(input.switch.height / 2)};

    /* Make sure it’s not possible to interact with the wrapper element */
    pointer-events: none;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      box-shadow: var(--switch-box-shadow);
      border-radius: inherit;
    }

    /* Focus styles */
    input:focus + && {
      --switch-box-shadow: ${focusRingStyle({
    focusRing: input.switch.focusRing
  })};
    }

    input:focus:not(:focus-visible) + && {
      --switch-box-shadow: none;
    }

    input:checked + && {
      --switch-bg-color: ${color2.input.default.enabled.fg};
      --switch-fg-color: ${color2.input.default.enabled.bg};
    }

    @media (hover: hover) {
      input:not(:disabled):hover + && {
        --switch-bg-color: ${color2.input.default.hovered.border};
        --switch-fg-color: ${color2.input.default.hovered.bg};
      }

      input:not(:disabled):checked:hover + && {
        --switch-bg-color: ${color2.input.default.enabled.fg};
        --switch-fg-color: ${color2.input.default.enabled.bg};
      }
    }

    input:not([data-read-only]):disabled + && {
      --switch-bg-color: ${color2.input.default.disabled.border};
      --switch-fg-color: ${color2.input.default.disabled.bg};
    }

    input[data-read-only]:disabled + && {
      --switch-bg-color: ${color2.input.default.readOnly.border};
      --switch-fg-color: ${color2.input.default.readOnly.bg};
    }

    input:checked[data-read-only]:disabled + && {
      --switch-bg-color: ${color2.input.default.readOnly.fg};
      --switch-fg-color: ${color2.input.default.readOnly.bg};
    }
  `;
}
function switchTrackStyles(props) {
  const {
    input
  } = getTheme_v2(props.theme);
  return css`
    &:not([hidden]) {
      display: block;
    }
    background-color: var(--switch-bg-color);
    position: absolute;
    left: 0;
    top: 0;
    width: ${rem(input.switch.width)};
    height: ${rem(input.switch.height)};
    border-radius: ${rem(input.switch.height / 2)};
  `;
}
function switchThumbStyles(props) {
  const {
    $indeterminate
  } = props, {
    input
  } = getTheme_v2(props.theme), trackWidth = input.switch.width, trackHeight = input.switch.height, trackPadding = input.switch.padding, size2 = trackHeight - input.switch.padding * 2, checkedOffset = trackWidth - trackPadding * 2 - size2, indeterminateOffset = trackWidth / 2 - size2 / 2 - trackPadding, checked = $indeterminate !== !0 && props.$checked === !0;
  return css`
    &:not([hidden]) {
      display: block;
    }
    position: absolute;
    left: ${rem(trackPadding)};
    top: ${rem(trackPadding)};
    height: ${rem(size2)};
    width: ${rem(size2)};
    border-radius: ${rem(size2 / 2)};
    transition-property: transform;
    transition-duration: ${input.switch.transitionDurationMs}ms;
    transition-timing-function: ${input.switch.transitionTimingFunction};
    background: var(--switch-fg-color);
    transform: translate3d(0, 0, 0);
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);

    ${checked && css`
      transform: translate3d(${checkedOffset}px, 0, 0);
    `}

    ${$indeterminate && css`
      transform: translate3d(${indeterminateOffset}px, 0, 0);
    `}
  `;
}
const StyledSwitch = /* @__PURE__ */ styled.span.withConfig({
  displayName: "StyledSwitch",
  componentId: "sc-dw1foe-0"
})(switchBaseStyles), Input$2 = /* @__PURE__ */ styled.input.withConfig({
  displayName: "Input",
  componentId: "sc-dw1foe-1"
})(switchInputStyles), Representation = /* @__PURE__ */ styled.span.withConfig({
  displayName: "Representation",
  componentId: "sc-dw1foe-2"
})(switchRepresentationStyles), Track = /* @__PURE__ */ styled.span.withConfig({
  displayName: "Track",
  componentId: "sc-dw1foe-3"
})(switchTrackStyles), Thumb = /* @__PURE__ */ styled.span.withConfig({
  displayName: "Thumb",
  componentId: "sc-dw1foe-4"
})(switchThumbStyles), Switch = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(26);
  let checked, className, disabled, indeterminate, readOnly, restProps, style;
  $[0] !== props ? ({
    checked,
    className,
    disabled,
    indeterminate,
    readOnly,
    style,
    ...restProps
  } = props, $[0] = props, $[1] = checked, $[2] = className, $[3] = disabled, $[4] = indeterminate, $[5] = readOnly, $[6] = restProps, $[7] = style) : (checked = $[1], className = $[2], disabled = $[3], indeterminate = $[4], readOnly = $[5], restProps = $[6], style = $[7]);
  const ref = useRef(null);
  let t0;
  $[8] === Symbol.for("react.memo_cache_sentinel") ? (t0 = () => ref.current, $[8] = t0) : t0 = $[8], useImperativeHandle(forwardedRef, t0);
  let t1, t2;
  $[9] !== indeterminate ? (t1 = () => {
    ref.current && (ref.current.indeterminate = indeterminate || !1);
  }, t2 = [indeterminate], $[9] = indeterminate, $[10] = t1, $[11] = t2) : (t1 = $[10], t2 = $[11]), useEffect(t1, t2);
  const t3 = !disabled && readOnly ? "" : void 0, t4 = indeterminate !== !0 && checked, t5 = disabled || readOnly;
  let t6;
  $[12] !== restProps || $[13] !== t3 || $[14] !== t4 || $[15] !== t5 ? (t6 = /* @__PURE__ */ jsx(Input$2, { "data-read-only": t3, ...restProps, checked: t4, disabled: t5, type: "checkbox", ref }), $[12] = restProps, $[13] = t3, $[14] = t4, $[15] = t5, $[16] = t6) : t6 = $[16];
  let t7;
  $[17] === Symbol.for("react.memo_cache_sentinel") ? (t7 = /* @__PURE__ */ jsx(Track, {}), $[17] = t7) : t7 = $[17];
  let t8;
  $[18] !== checked || $[19] !== indeterminate ? (t8 = /* @__PURE__ */ jsxs(Representation, { "aria-hidden": !0, "data-name": "representation", children: [
    t7,
    /* @__PURE__ */ jsx(Thumb, { $checked: checked, $indeterminate: indeterminate })
  ] }), $[18] = checked, $[19] = indeterminate, $[20] = t8) : t8 = $[20];
  let t9;
  return $[21] !== className || $[22] !== style || $[23] !== t6 || $[24] !== t8 ? (t9 = /* @__PURE__ */ jsxs(StyledSwitch, { className, "data-ui": "Switch", style, children: [
    t6,
    t8
  ] }), $[21] = className, $[22] = style, $[23] = t6, $[24] = t8, $[25] = t9) : t9 = $[25], t9;
});
Switch.displayName = "ForwardRef(Switch)";
const StyledTextArea = /* @__PURE__ */ styled.span.withConfig({
  displayName: "StyledTextArea",
  componentId: "sc-1d6h1o8-0"
})(textInputRootStyle), InputRoot$1 = styled.span.withConfig({
  displayName: "InputRoot",
  componentId: "sc-1d6h1o8-1"
})`flex:1;min-width:0;display:block;position:relative;`, Input$1 = /* @__PURE__ */ styled.textarea.withConfig({
  displayName: "Input",
  componentId: "sc-1d6h1o8-2"
})(responsiveInputPaddingStyle, textInputBaseStyle, textInputFontSizeStyle), Presentation$1 = /* @__PURE__ */ styled.div.withConfig({
  displayName: "Presentation",
  componentId: "sc-1d6h1o8-3"
})(responsiveRadiusStyle, textInputRepresentationStyle), TextArea = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(35);
  let __unstable_disableFocusRing, customValidity, restProps, t0, t1, t2, t3, t4, weight;
  $[0] !== props ? ({
    border: t0,
    customValidity,
    disabled: t1,
    fontSize: t2,
    padding: t3,
    radius: t4,
    weight,
    __unstable_disableFocusRing,
    ...restProps
  } = props, $[0] = props, $[1] = __unstable_disableFocusRing, $[2] = customValidity, $[3] = restProps, $[4] = t0, $[5] = t1, $[6] = t2, $[7] = t3, $[8] = t4, $[9] = weight) : (__unstable_disableFocusRing = $[1], customValidity = $[2], restProps = $[3], t0 = $[4], t1 = $[5], t2 = $[6], t3 = $[7], t4 = $[8], weight = $[9]);
  const border2 = t0 === void 0 ? !0 : t0, disabled = t1 === void 0 ? !1 : t1, fontSize2 = t2 === void 0 ? 2 : t2, padding = t3 === void 0 ? 3 : t3, radius = t4 === void 0 ? 2 : t4, ref = useRef(null), rootTheme = useRootTheme();
  let t5;
  $[10] === Symbol.for("react.memo_cache_sentinel") ? (t5 = () => ref.current, $[10] = t5) : t5 = $[10], useImperativeHandle(forwardedRef, t5), useCustomValidity(ref, customValidity);
  const t6 = rootTheme.scheme, t7 = rootTheme.tone;
  let t8;
  $[11] !== fontSize2 ? (t8 = _getArrayProp(fontSize2), $[11] = fontSize2, $[12] = t8) : t8 = $[12];
  let t9;
  $[13] !== padding ? (t9 = _getArrayProp(padding), $[13] = padding, $[14] = t9) : t9 = $[14];
  const t10 = rootTheme.scheme;
  let t11;
  $[15] === Symbol.for("react.memo_cache_sentinel") ? (t11 = _getArrayProp(0), $[15] = t11) : t11 = $[15];
  let t12;
  $[16] !== disabled || $[17] !== restProps || $[18] !== rootTheme.scheme || $[19] !== rootTheme.tone || $[20] !== t8 || $[21] !== t9 || $[22] !== weight ? (t12 = /* @__PURE__ */ jsx(Input$1, { "data-as": "textarea", "data-scheme": t6, "data-tone": t7, ...restProps, $fontSize: t8, $padding: t9, $scheme: t10, $space: t11, $tone: rootTheme.tone, $weight: weight, disabled, ref }), $[16] = disabled, $[17] = restProps, $[18] = rootTheme.scheme, $[19] = rootTheme.tone, $[20] = t8, $[21] = t9, $[22] = weight, $[23] = t12) : t12 = $[23];
  let t13;
  $[24] !== radius ? (t13 = _getArrayProp(radius), $[24] = radius, $[25] = t13) : t13 = $[25];
  const t14 = border2 ? "" : void 0;
  let t15;
  $[26] !== __unstable_disableFocusRing || $[27] !== rootTheme.scheme || $[28] !== rootTheme.tone || $[29] !== t13 || $[30] !== t14 ? (t15 = /* @__PURE__ */ jsx(Presentation$1, { $radius: t13, $unstableDisableFocusRing: __unstable_disableFocusRing, $scheme: rootTheme.scheme, $tone: rootTheme.tone, "data-border": t14, "data-scheme": rootTheme.scheme, "data-tone": rootTheme.tone }), $[26] = __unstable_disableFocusRing, $[27] = rootTheme.scheme, $[28] = rootTheme.tone, $[29] = t13, $[30] = t14, $[31] = t15) : t15 = $[31];
  let t16;
  return $[32] !== t12 || $[33] !== t15 ? (t16 = /* @__PURE__ */ jsx(StyledTextArea, { "data-ui": "TextArea", children: /* @__PURE__ */ jsxs(InputRoot$1, { children: [
    t12,
    t15
  ] }) }), $[32] = t12, $[33] = t15, $[34] = t16) : t16 = $[34], t16;
});
TextArea.displayName = "ForwardRef(TextArea)";
const CLEAR_BUTTON_BOX_STYLE = {
  zIndex: 2
}, StyledTextInput = /* @__PURE__ */ styled(Card).attrs({
  forwardedAs: "span"
}).withConfig({
  displayName: "StyledTextInput",
  componentId: "sc-h62wco-0"
})(textInputRootStyle), InputRoot = styled.span.withConfig({
  displayName: "InputRoot",
  componentId: "sc-h62wco-1"
})`flex:1;min-width:0;display:block;position:relative;`, Prefix = styled(Card).attrs({
  forwardedAs: "span"
}).withConfig({
  displayName: "Prefix",
  componentId: "sc-h62wco-2"
})`border-top-right-radius:0;border-bottom-right-radius:0;& > span{display:block;margin:-1px;}`, Suffix = styled(Card).attrs({
  forwardedAs: "span"
}).withConfig({
  displayName: "Suffix",
  componentId: "sc-h62wco-3"
})`border-top-left-radius:0;border-bottom-left-radius:0;& > span{display:block;margin:-1px;}`, Input = /* @__PURE__ */ styled.input.withConfig({
  displayName: "Input",
  componentId: "sc-h62wco-4"
})(responsiveInputPaddingStyle, textInputBaseStyle, textInputFontSizeStyle), Presentation = /* @__PURE__ */ styled.span.withConfig({
  displayName: "Presentation",
  componentId: "sc-h62wco-5"
})(responsiveRadiusStyle, textInputRepresentationStyle), LeftBox = styled(Box).withConfig({
  displayName: "LeftBox",
  componentId: "sc-h62wco-6"
})`position:absolute;top:0;left:0;`, RightBox = styled(Box).withConfig({
  displayName: "RightBox",
  componentId: "sc-h62wco-7"
})`position:absolute;top:0;right:0;`, RightCard = styled(Card).withConfig({
  displayName: "RightCard",
  componentId: "sc-h62wco-8"
})`background-color:transparent;position:absolute;top:0;right:0;`, TextInputClearButton = /* @__PURE__ */ styled(Button).withConfig({
  displayName: "TextInputClearButton",
  componentId: "sc-h62wco-9"
})({
  "&:not([hidden])": {
    display: "block"
  }
}), TextInput = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(92);
  let IconComponent, IconRightComponent, __unstable_disableFocusRing, clearButton, customValidity, onClear, prefix, readOnly, restProps, suffix, t0, t1, t2, t3, t4, t5, t6, weight;
  $[0] !== props ? ({
    __unstable_disableFocusRing,
    border: t0,
    clearButton,
    disabled: t1,
    fontSize: t2,
    icon: IconComponent,
    iconRight: IconRightComponent,
    onClear,
    padding: t3,
    prefix,
    radius: t4,
    readOnly,
    space: t5,
    suffix,
    customValidity,
    type: t6,
    weight,
    ...restProps
  } = props, $[0] = props, $[1] = IconComponent, $[2] = IconRightComponent, $[3] = __unstable_disableFocusRing, $[4] = clearButton, $[5] = customValidity, $[6] = onClear, $[7] = prefix, $[8] = readOnly, $[9] = restProps, $[10] = suffix, $[11] = t0, $[12] = t1, $[13] = t2, $[14] = t3, $[15] = t4, $[16] = t5, $[17] = t6, $[18] = weight) : (IconComponent = $[1], IconRightComponent = $[2], __unstable_disableFocusRing = $[3], clearButton = $[4], customValidity = $[5], onClear = $[6], prefix = $[7], readOnly = $[8], restProps = $[9], suffix = $[10], t0 = $[11], t1 = $[12], t2 = $[13], t3 = $[14], t4 = $[15], t5 = $[16], t6 = $[17], weight = $[18]);
  const border2 = t0 === void 0 ? !0 : t0, disabled = t1 === void 0 ? !1 : t1, fontSizeProp = t2 === void 0 ? 2 : t2, paddingProp = t3 === void 0 ? 3 : t3, radiusProp = t4 === void 0 ? 2 : t4, spaceProp = t5 === void 0 ? 3 : t5, type = t6 === void 0 ? "text" : t6, ref = useRef(null), rootTheme = useRootTheme();
  let t7;
  $[19] !== fontSizeProp ? (t7 = _getArrayProp(fontSizeProp), $[19] = fontSizeProp, $[20] = t7) : t7 = $[20];
  const fontSize2 = t7;
  let t8;
  $[21] !== paddingProp ? (t8 = _getArrayProp(paddingProp), $[21] = paddingProp, $[22] = t8) : t8 = $[22];
  const padding = t8;
  let t9;
  $[23] !== radiusProp ? (t9 = _getArrayProp(radiusProp), $[23] = radiusProp, $[24] = t9) : t9 = $[24];
  const radius = t9;
  let t10;
  $[25] !== spaceProp ? (t10 = _getArrayProp(spaceProp), $[25] = spaceProp, $[26] = t10) : t10 = $[26];
  const space = t10, $hasClearButton = !!clearButton, $hasIcon = !!IconComponent, $hasIconRight = !!IconRightComponent, $hasSuffix = !!suffix, $hasPrefix = !!prefix;
  let t11;
  $[27] === Symbol.for("react.memo_cache_sentinel") ? (t11 = () => ref.current, $[27] = t11) : t11 = $[27], useImperativeHandle(forwardedRef, t11), useCustomValidity(ref, customValidity);
  const handleClearMouseDown = _temp$2$1;
  let t12;
  $[28] !== onClear ? (t12 = (event_0) => {
    event_0.preventDefault(), event_0.stopPropagation(), onClear && onClear(), ref.current?.focus();
  }, $[28] = onClear, $[29] = t12) : t12 = $[29];
  const handleClearClick = t12;
  let t13;
  $[30] !== prefix || $[31] !== radius ? (t13 = prefix && /* @__PURE__ */ jsx(Prefix, { borderTop: !0, borderLeft: !0, borderBottom: !0, radius, sizing: "border", tone: "inherit", children: /* @__PURE__ */ jsx("span", { children: prefix }) }), $[30] = prefix, $[31] = radius, $[32] = t13) : t13 = $[32];
  const prefixNode = t13, t14 = border2 ? "" : void 0;
  let t15;
  $[33] !== IconComponent || $[34] !== fontSize2 || $[35] !== padding ? (t15 = IconComponent && /* @__PURE__ */ jsx(LeftBox, { padding, children: /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
    isValidElement(IconComponent) && IconComponent,
    reactIsExports.isValidElementType(IconComponent) && /* @__PURE__ */ jsx(IconComponent, {})
  ] }) }), $[33] = IconComponent, $[34] = fontSize2, $[35] = padding, $[36] = t15) : t15 = $[36];
  let t16;
  $[37] !== $hasClearButton || $[38] !== IconRightComponent || $[39] !== fontSize2 || $[40] !== padding ? (t16 = !$hasClearButton && IconRightComponent && /* @__PURE__ */ jsx(RightBox, { padding, children: /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
    isValidElement(IconRightComponent) && IconRightComponent,
    reactIsExports.isValidElementType(IconRightComponent) && /* @__PURE__ */ jsx(IconRightComponent, {})
  ] }) }), $[37] = $hasClearButton, $[38] = IconRightComponent, $[39] = fontSize2, $[40] = padding, $[41] = t16) : t16 = $[41];
  let t17;
  $[42] !== $hasPrefix || $[43] !== $hasSuffix || $[44] !== __unstable_disableFocusRing || $[45] !== radius || $[46] !== rootTheme.scheme || $[47] !== rootTheme.tone || $[48] !== t14 || $[49] !== t15 || $[50] !== t16 ? (t17 = /* @__PURE__ */ jsxs(Presentation, { $hasPrefix, $unstableDisableFocusRing: __unstable_disableFocusRing, $hasSuffix, $radius: radius, $scheme: rootTheme.scheme, $tone: rootTheme.tone, "data-border": t14, "data-scheme": rootTheme.scheme, "data-tone": rootTheme.tone, children: [
    t15,
    t16
  ] }), $[42] = $hasPrefix, $[43] = $hasSuffix, $[44] = __unstable_disableFocusRing, $[45] = radius, $[46] = rootTheme.scheme, $[47] = rootTheme.tone, $[48] = t14, $[49] = t15, $[50] = t16, $[51] = t17) : t17 = $[51];
  const presentationNode = t17;
  let t18;
  $[52] !== padding ? (t18 = padding.map(_temp2), $[52] = padding, $[53] = t18) : t18 = $[53];
  const clearButtonBoxPadding = t18;
  let t19;
  $[54] !== padding ? (t19 = padding.map(_temp3), $[54] = padding, $[55] = t19) : t19 = $[55];
  const clearButtonPadding = t19, clearButtonProps = typeof clearButton == "object" ? clearButton : EMPTY_RECORD;
  let t20;
  $[56] !== clearButton || $[57] !== clearButtonBoxPadding || $[58] !== clearButtonPadding || $[59] !== clearButtonProps || $[60] !== customValidity || $[61] !== disabled || $[62] !== fontSize2 || $[63] !== handleClearClick || $[64] !== radius || $[65] !== readOnly ? (t20 = !disabled && !readOnly && clearButton && /* @__PURE__ */ jsx(RightCard, { forwardedAs: "span", padding: clearButtonBoxPadding, style: CLEAR_BUTTON_BOX_STYLE, tone: customValidity ? "critical" : "inherit", children: /* @__PURE__ */ jsx(TextInputClearButton, { "aria-label": "Clear", "data-qa": "clear-button", fontSize: fontSize2, icon: CloseIcon, mode: "bleed", padding: clearButtonPadding, radius, ...clearButtonProps, onClick: handleClearClick, onMouseDown: handleClearMouseDown }) }), $[56] = clearButton, $[57] = clearButtonBoxPadding, $[58] = clearButtonPadding, $[59] = clearButtonProps, $[60] = customValidity, $[61] = disabled, $[62] = fontSize2, $[63] = handleClearClick, $[64] = radius, $[65] = readOnly, $[66] = t20) : t20 = $[66];
  const clearButtonNode = t20;
  let t21;
  $[67] !== radius || $[68] !== suffix ? (t21 = suffix && /* @__PURE__ */ jsx(Suffix, { borderTop: !0, borderRight: !0, borderBottom: !0, radius, sizing: "border", tone: "inherit", children: /* @__PURE__ */ jsx("span", { children: suffix }) }), $[67] = radius, $[68] = suffix, $[69] = t21) : t21 = $[69];
  const suffixNode = t21, t22 = $hasIconRight || $hasClearButton;
  let t23;
  $[70] !== $hasIcon || $[71] !== disabled || $[72] !== fontSize2 || $[73] !== padding || $[74] !== readOnly || $[75] !== restProps || $[76] !== rootTheme.scheme || $[77] !== rootTheme.tone || $[78] !== space || $[79] !== t22 || $[80] !== type || $[81] !== weight ? (t23 = /* @__PURE__ */ jsx(Input, { "data-as": "input", "data-scheme": rootTheme.scheme, "data-tone": rootTheme.tone, ...restProps, $fontSize: fontSize2, $iconLeft: $hasIcon, $iconRight: t22, $padding: padding, $scheme: rootTheme.scheme, $space: space, $tone: rootTheme.tone, $weight: weight, disabled, readOnly, ref, type }), $[70] = $hasIcon, $[71] = disabled, $[72] = fontSize2, $[73] = padding, $[74] = readOnly, $[75] = restProps, $[76] = rootTheme.scheme, $[77] = rootTheme.tone, $[78] = space, $[79] = t22, $[80] = type, $[81] = weight, $[82] = t23) : t23 = $[82];
  let t24;
  $[83] !== clearButtonNode || $[84] !== presentationNode || $[85] !== t23 ? (t24 = /* @__PURE__ */ jsxs(InputRoot, { children: [
    t23,
    presentationNode,
    clearButtonNode
  ] }), $[83] = clearButtonNode, $[84] = presentationNode, $[85] = t23, $[86] = t24) : t24 = $[86];
  let t25;
  return $[87] !== prefixNode || $[88] !== rootTheme.tone || $[89] !== suffixNode || $[90] !== t24 ? (t25 = /* @__PURE__ */ jsxs(StyledTextInput, { "data-ui": "TextInput", tone: rootTheme.tone, children: [
    prefixNode,
    t24,
    suffixNode
  ] }), $[87] = prefixNode, $[88] = rootTheme.tone, $[89] = suffixNode, $[90] = t24, $[91] = t25) : t25 = $[91], t25;
});
TextInput.displayName = "ForwardRef(TextInput)";
function _temp$2$1(event) {
  event.preventDefault(), event.stopPropagation();
}
function _temp2(v) {
  return v === 0 ? 0 : v === 1 || v === 2 ? 1 : v - 2;
}
function _temp3(v_0) {
  return v_0 === 0 || v_0 === 1 ? 0 : v_0 === 2 ? 1 : v_0 - 1;
}
function useDelayedState(initialState) {
  const $ = distExports.c(3), [state, setState] = useState(initialState), delayedAction = useRef(void 0);
  let t0;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = (nextState, delay2) => {
    const action = () => {
      setState(nextState);
    };
    if (delayedAction.current && (clearTimeout(delayedAction.current), delayedAction.current = void 0), !delay2)
      return action();
    delayedAction.current = setTimeout(action, delay2);
  }, $[0] = t0) : t0 = $[0];
  const onStateChange = t0;
  let t1;
  return $[1] !== state ? (t1 = [state, onStateChange], $[1] = state, $[2] = t1) : t1 = $[2], t1;
}
const DEFAULT_TOOLTIP_ARROW_WIDTH = 15, DEFAULT_TOOLTIP_ARROW_HEIGHT = 6, DEFAULT_TOOLTIP_ARROW_RADIUS = 2, DEFAULT_TOOLTIP_DISTANCE = 4, DEFAULT_TOOLTIP_PADDING = 4, DEFAULT_FALLBACK_PLACEMENTS = {
  top: ["top-end", "top-start", "bottom", "left", "right"],
  "top-start": ["top", "top-end", "bottom-start", "left-start", "right-start"],
  "top-end": ["top", "top-start", "bottom-end", "left-end", "right-end"],
  bottom: ["bottom-end", "bottom-start", "top", "left", "right"],
  "bottom-start": ["bottom", "bottom-end", "top-start", "left-start", "right-start"],
  "bottom-end": ["bottom", "bottom-start", "top-end", "left-end", "right-end"],
  left: ["left-end", "left-start", "right", "top", "bottom"],
  "left-start": ["left", "left-end", "right-start", "top-start", "bottom-start"],
  "left-end": ["left", "left-start", "right-end", "top-end", "bottom-end"],
  right: ["right-end", "right-start", "left", "top", "bottom"],
  "right-start": ["right", "right-end", "left-start", "top-start", "bottom-start"],
  "right-end": ["right", "right-start", "left-end", "top-end", "bottom-end"]
}, MotionCard = styled(motion.create(Card)).withConfig({
  displayName: "MotionCard",
  componentId: "sc-1xn138w-0"
})`will-change:transform;`, TooltipCard = forwardRef(function(props, ref) {
  const $ = distExports.c(48);
  let animate, arrow2, arrowRef, arrowX, arrowY, children, originX, originY, padding, placement, radius, restProps, scheme, shadow, style;
  $[0] !== props ? ({
    animate,
    arrow: arrow2,
    arrowRef,
    arrowX,
    arrowY,
    children,
    originX,
    originY,
    padding,
    placement,
    radius,
    scheme,
    shadow,
    style,
    ...restProps
  } = props, $[0] = props, $[1] = animate, $[2] = arrow2, $[3] = arrowRef, $[4] = arrowX, $[5] = arrowY, $[6] = children, $[7] = originX, $[8] = originY, $[9] = padding, $[10] = placement, $[11] = radius, $[12] = restProps, $[13] = scheme, $[14] = shadow, $[15] = style) : (animate = $[1], arrow2 = $[2], arrowRef = $[3], arrowX = $[4], arrowY = $[5], children = $[6], originX = $[7], originY = $[8], padding = $[9], placement = $[10], radius = $[11], restProps = $[12], scheme = $[13], shadow = $[14], style = $[15]);
  const t0 = animate ? "transform" : void 0;
  let t1;
  $[16] !== originX || $[17] !== originY || $[18] !== style || $[19] !== t0 ? (t1 = {
    originX,
    originY,
    willChange: t0,
    ...style
  }, $[16] = originX, $[17] = originY, $[18] = style, $[19] = t0, $[20] = t1) : t1 = $[20];
  const rootStyle2 = t1, t2 = arrowX !== null ? arrowX : void 0, t3 = arrowY !== null ? arrowY : void 0;
  let t4;
  $[21] !== t2 || $[22] !== t3 ? (t4 = {
    left: t2,
    top: t3,
    right: void 0,
    bottom: void 0
  }, $[21] = t2, $[22] = t3, $[23] = t4) : t4 = $[23];
  const arrowStyle = t4, t5 = restProps;
  let t6;
  $[24] !== animate ? (t6 = animate ? ["hidden", "initial"] : void 0, $[24] = animate, $[25] = t6) : t6 = $[25];
  let t7;
  $[26] !== animate ? (t7 = animate ? ["visible", "scaleIn"] : void 0, $[26] = animate, $[27] = t7) : t7 = $[27];
  let t8;
  $[28] !== animate ? (t8 = animate ? ["hidden", "scaleOut"] : void 0, $[28] = animate, $[29] = t8) : t8 = $[29];
  let t9;
  $[30] !== arrow2 || $[31] !== arrowRef || $[32] !== arrowStyle ? (t9 = arrow2 && /* @__PURE__ */ jsx(Arrow, { ref: arrowRef, style: arrowStyle, width: DEFAULT_TOOLTIP_ARROW_WIDTH, height: DEFAULT_TOOLTIP_ARROW_HEIGHT, radius: DEFAULT_TOOLTIP_ARROW_RADIUS }), $[30] = arrow2, $[31] = arrowRef, $[32] = arrowStyle, $[33] = t9) : t9 = $[33];
  let t10;
  return $[34] !== children || $[35] !== padding || $[36] !== placement || $[37] !== radius || $[38] !== ref || $[39] !== rootStyle2 || $[40] !== scheme || $[41] !== shadow || $[42] !== t5 || $[43] !== t6 || $[44] !== t7 || $[45] !== t8 || $[46] !== t9 ? (t10 = /* @__PURE__ */ jsxs(MotionCard, { "data-ui": "Tooltip__card", ...t5, "data-placement": placement, padding, radius, ref, scheme, shadow, style: rootStyle2, variants: POPOVER_MOTION_PROPS.card, transition: POPOVER_MOTION_PROPS.transition, initial: t6, animate: t7, exit: t8, children: [
    children,
    t9
  ] }), $[34] = children, $[35] = padding, $[36] = placement, $[37] = radius, $[38] = ref, $[39] = rootStyle2, $[40] = scheme, $[41] = shadow, $[42] = t5, $[43] = t6, $[44] = t7, $[45] = t8, $[46] = t9, $[47] = t10) : t10 = $[47], t10;
});
TooltipCard.displayName = "ForwardRef(TooltipCard)";
const TooltipDelayGroupContext = createGlobalScopedContext("@sanity/ui/context/tooltipDelayGroup", null);
function useTooltipDelayGroup() {
  return useContext(TooltipDelayGroupContext);
}
const StyledTooltip = styled(Layer).withConfig({
  displayName: "StyledTooltip",
  componentId: "sc-13f2zvh-0"
})`pointer-events:none;`, Tooltip = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(137), boundaryElementContext = useBoundaryElement(), {
    layer
  } = useTheme_v2();
  let _boundaryElement, _fallbackPlacementsProp, _zOffset, childProp, content, delay2, disabled, portalProp, restProps, scheme, t0, t1, t2, t3, t4, t5;
  $[0] !== props ? ({
    animate: t0,
    arrow: t1,
    boundaryElement: _boundaryElement,
    children: childProp,
    content,
    disabled,
    fallbackPlacements: _fallbackPlacementsProp,
    padding: t2,
    placement: t3,
    portal: portalProp,
    radius: t4,
    scheme,
    shadow: t5,
    zOffset: _zOffset,
    delay: delay2,
    ...restProps
  } = props, $[0] = props, $[1] = _boundaryElement, $[2] = _fallbackPlacementsProp, $[3] = _zOffset, $[4] = childProp, $[5] = content, $[6] = delay2, $[7] = disabled, $[8] = portalProp, $[9] = restProps, $[10] = scheme, $[11] = t0, $[12] = t1, $[13] = t2, $[14] = t3, $[15] = t4, $[16] = t5) : (_boundaryElement = $[1], _fallbackPlacementsProp = $[2], _zOffset = $[3], childProp = $[4], content = $[5], delay2 = $[6], disabled = $[7], portalProp = $[8], restProps = $[9], scheme = $[10], t0 = $[11], t1 = $[12], t2 = $[13], t3 = $[14], t4 = $[15], t5 = $[16]);
  const _animate = t0 === void 0 ? !1 : t0, arrowProp = t1 === void 0 ? !1 : t1, padding = t2 === void 0 ? 2 : t2, placementProp = t3 === void 0 ? "bottom" : t3, radius = t4 === void 0 ? 2 : t4, shadow = t5 === void 0 ? 2 : t5, boundaryElement = _boundaryElement ?? boundaryElementContext?.element, fallbackPlacementsProp = _fallbackPlacementsProp ?? DEFAULT_FALLBACK_PLACEMENTS[props.placement ?? "bottom"], zOffset = _zOffset ?? layer.tooltip.zOffset, animate = usePrefersReducedMotion() ? !1 : _animate;
  let t6;
  $[17] !== fallbackPlacementsProp ? (t6 = _getArrayProp(fallbackPlacementsProp), $[17] = fallbackPlacementsProp, $[18] = t6) : t6 = $[18];
  const fallbackPlacements = t6, ref = useRef(null), [referenceElement, setReferenceElement] = useState(null), arrowRef = useRef(null), [tooltipMaxWidth, setTooltipMaxWidth] = useState(0);
  let t7;
  $[19] === Symbol.for("react.memo_cache_sentinel") ? (t7 = () => ref.current, $[19] = t7) : t7 = $[19], useImperativeHandle(forwardedRef, t7);
  const portal = usePortal(), portalElement = typeof portalProp == "string" ? portal.elements?.[portalProp] || null : portal.element;
  let t8;
  $[20] !== animate || $[21] !== arrowProp || $[22] !== boundaryElement || $[23] !== fallbackPlacements ? (t8 = {
    animate,
    arrowProp,
    arrowRef,
    boundaryElement,
    fallbackPlacements,
    rootBoundary: "viewport"
  }, $[20] = animate, $[21] = arrowProp, $[22] = boundaryElement, $[23] = fallbackPlacements, $[24] = t8) : t8 = $[24];
  const middleware = useMiddleware(t8);
  let t9;
  $[25] !== referenceElement ? (t9 = {
    reference: referenceElement
  }, $[25] = referenceElement, $[26] = t9) : t9 = $[26];
  let t10;
  $[27] !== middleware || $[28] !== placementProp || $[29] !== t9 ? (t10 = {
    middleware,
    placement: placementProp,
    whileElementsMounted: autoUpdate,
    elements: t9
  }, $[27] = middleware, $[28] = placementProp, $[29] = t9, $[30] = t10) : t10 = $[30];
  const {
    floatingStyles,
    placement,
    middlewareData,
    refs,
    update
  } = useFloating(t10), arrowX = middlewareData.arrow?.x, arrowY = middlewareData.arrow?.y, originX = middlewareData["@sanity/ui/origin"]?.originX, originY = middlewareData["@sanity/ui/origin"]?.originY, tooltipId = useId(), [isOpen, setIsOpen] = useDelayedState(!1), delayGroupContext = useTooltipDelayGroup();
  let t11;
  $[31] !== delayGroupContext ? (t11 = delayGroupContext || {}, $[31] = delayGroupContext, $[32] = t11) : t11 = $[32];
  const {
    setIsGroupActive,
    setOpenTooltipId
  } = t11, showTooltip = isOpen || delayGroupContext?.openTooltipId === tooltipId, isInsideGroup = delayGroupContext !== null, openDelayProp = typeof delay2 == "number" ? delay2 : delay2?.open || 0, closeDelayProp = typeof delay2 == "number" ? delay2 : delay2?.close || 0, openDelay = isInsideGroup ? delayGroupContext.openDelay : openDelayProp, closeDelay = isInsideGroup ? delayGroupContext.closeDelay : closeDelayProp;
  let t12;
  $[33] !== closeDelay || $[34] !== isInsideGroup || $[35] !== openDelay || $[36] !== setIsGroupActive || $[37] !== setIsOpen || $[38] !== setOpenTooltipId || $[39] !== tooltipId ? (t12 = (open, immediate) => {
    if (isInsideGroup)
      if (open) {
        const groupedOpenDelay = immediate ? 0 : openDelay;
        setIsGroupActive?.(open, groupedOpenDelay), setOpenTooltipId?.(tooltipId, groupedOpenDelay);
      } else {
        const groupDeactivateDelay = closeDelay > 200 ? closeDelay : 200;
        setIsGroupActive?.(open, groupDeactivateDelay), setOpenTooltipId?.(null, immediate ? 0 : closeDelay);
      }
    else
      setIsOpen(open, immediate ? 0 : open ? openDelay : closeDelay);
  }, $[33] = closeDelay, $[34] = isInsideGroup, $[35] = openDelay, $[36] = setIsGroupActive, $[37] = setIsOpen, $[38] = setOpenTooltipId, $[39] = tooltipId, $[40] = t12) : t12 = $[40];
  const handleIsOpenChange = t12;
  let t13;
  $[41] !== childProp?.props || $[42] !== handleIsOpenChange ? (t13 = (e) => {
    handleIsOpenChange(!1), childProp?.props?.onBlur?.(e);
  }, $[41] = childProp?.props, $[42] = handleIsOpenChange, $[43] = t13) : t13 = $[43];
  const handleBlur = t13;
  let t14;
  $[44] !== childProp?.props || $[45] !== handleIsOpenChange ? (t14 = (e_0) => {
    handleIsOpenChange(!1, !0), childProp?.props.onClick?.(e_0);
  }, $[44] = childProp?.props, $[45] = handleIsOpenChange, $[46] = t14) : t14 = $[46];
  const handleClick = t14;
  let t15;
  $[47] !== childProp?.props || $[48] !== handleIsOpenChange ? (t15 = (e_1) => {
    handleIsOpenChange(!1, !0), childProp?.props.onContextMenu?.(e_1);
  }, $[47] = childProp?.props, $[48] = handleIsOpenChange, $[49] = t15) : t15 = $[49];
  const handleContextMenu = t15;
  let t16;
  $[50] !== childProp?.props || $[51] !== handleIsOpenChange ? (t16 = (e_2) => {
    handleIsOpenChange(!0), childProp?.props?.onFocus?.(e_2);
  }, $[50] = childProp?.props, $[51] = handleIsOpenChange, $[52] = t16) : t16 = $[52];
  const handleFocus = t16;
  let t17;
  $[53] !== childProp?.props || $[54] !== handleIsOpenChange ? (t17 = (e_3) => {
    handleIsOpenChange(!0), childProp?.props?.onMouseEnter?.(e_3);
  }, $[53] = childProp?.props, $[54] = handleIsOpenChange, $[55] = t17) : t17 = $[55];
  const handleMouseEnter = t17;
  let t18;
  $[56] !== childProp?.props || $[57] !== handleIsOpenChange ? (t18 = (e_4) => {
    handleIsOpenChange(!1), childProp?.props?.onMouseLeave?.(e_4);
  }, $[56] = childProp?.props, $[57] = handleIsOpenChange, $[58] = t18) : t18 = $[58];
  const handleMouseLeave = t18;
  let t19;
  $[59] !== handleIsOpenChange || $[60] !== isInsideGroup || $[61] !== referenceElement || $[62] !== showTooltip ? (t19 = {
    handleIsOpenChange,
    referenceElement,
    showTooltip,
    isInsideGroup
  }, $[59] = handleIsOpenChange, $[60] = isInsideGroup, $[61] = referenceElement, $[62] = showTooltip, $[63] = t19) : t19 = $[63], useCloseOnMouseLeave(t19);
  let t20, t21;
  $[64] !== disabled || $[65] !== handleIsOpenChange || $[66] !== showTooltip ? (t20 = () => {
    disabled && showTooltip && handleIsOpenChange(!1);
  }, t21 = [disabled, handleIsOpenChange, showTooltip], $[64] = disabled, $[65] = handleIsOpenChange, $[66] = showTooltip, $[67] = t20, $[68] = t21) : (t20 = $[67], t21 = $[68]), useEffect(t20, t21);
  let t22, t23;
  $[69] !== content || $[70] !== handleIsOpenChange || $[71] !== showTooltip ? (t22 = () => {
    !content && showTooltip && handleIsOpenChange(!1);
  }, t23 = [content, handleIsOpenChange, showTooltip], $[69] = content, $[70] = handleIsOpenChange, $[71] = showTooltip, $[72] = t22, $[73] = t23) : (t22 = $[72], t23 = $[73]), useEffect(t22, t23);
  let t24, t25;
  $[74] !== handleIsOpenChange || $[75] !== showTooltip ? (t24 = () => {
    if (!showTooltip)
      return;
    const handleWindowKeyDown = function(event) {
      event.key === "Escape" && handleIsOpenChange(!1, !0);
    };
    return window.addEventListener("keydown", handleWindowKeyDown), () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, t25 = [handleIsOpenChange, showTooltip], $[74] = handleIsOpenChange, $[75] = showTooltip, $[76] = t24, $[77] = t25) : (t24 = $[76], t25 = $[77]), useEffect(t24, t25);
  let t26;
  $[78] !== boundaryElement || $[79] !== portalElement?.offsetWidth ? (t26 = () => {
    const availableWidths = [...boundaryElement ? [boundaryElement.offsetWidth] : [], portalElement?.offsetWidth || document.body.offsetWidth];
    setTooltipMaxWidth(Math.min(...availableWidths) - DEFAULT_TOOLTIP_PADDING * 2);
  }, $[78] = boundaryElement, $[79] = portalElement?.offsetWidth, $[80] = t26) : t26 = $[80];
  let t27;
  $[81] !== boundaryElement || $[82] !== portalElement ? (t27 = [boundaryElement, portalElement], $[81] = boundaryElement, $[82] = portalElement, $[83] = t27) : t27 = $[83], useLayoutEffect(t26, t27);
  let t28;
  $[84] !== update ? (t28 = (arrowEl) => {
    arrowRef.current = arrowEl, update();
  }, $[84] = update, $[85] = t28) : t28 = $[85];
  const setArrow = t28;
  let t29;
  $[86] !== refs ? (t29 = (node) => {
    ref.current = node, refs.setFloating(node);
  }, $[86] = refs, $[87] = t29) : t29 = $[87];
  const setFloating = t29;
  let t30;
  bb0: {
    if (!childProp) {
      t30 = null;
      break bb0;
    }
    let t312;
    $[88] !== childProp || $[89] !== handleBlur || $[90] !== handleClick || $[91] !== handleContextMenu || $[92] !== handleFocus || $[93] !== handleMouseEnter || $[94] !== handleMouseLeave ? (t312 = cloneElement(childProp, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onContextMenu: handleContextMenu,
      ref: setReferenceElement
    }), $[88] = childProp, $[89] = handleBlur, $[90] = handleClick, $[91] = handleContextMenu, $[92] = handleFocus, $[93] = handleMouseEnter, $[94] = handleMouseLeave, $[95] = t312) : t312 = $[95], t30 = t312;
  }
  const child = t30;
  let t31;
  $[96] !== childProp ? (t31 = childProp ? getElementRef(childProp) : null, $[96] = childProp, $[97] = t31) : t31 = $[97];
  let t32, t33;
  if ($[98] !== referenceElement ? (t32 = () => referenceElement, t33 = [referenceElement], $[98] = referenceElement, $[99] = t32, $[100] = t33) : (t32 = $[99], t33 = $[100]), useImperativeHandle(t31, t32, t33), !child) {
    let t342;
    return $[101] === Symbol.for("react.memo_cache_sentinel") ? (t342 = /* @__PURE__ */ jsx(Fragment, {}), $[101] = t342) : t342 = $[101], t342;
  }
  if (disabled)
    return child;
  const t34 = tooltipMaxWidth > 0 ? `${tooltipMaxWidth}px` : void 0;
  let t35;
  $[102] !== floatingStyles || $[103] !== t34 ? (t35 = {
    ...floatingStyles,
    maxWidth: t34
  }, $[102] = floatingStyles, $[103] = t34, $[104] = t35) : t35 = $[104];
  let t36;
  $[105] !== animate || $[106] !== arrowProp || $[107] !== arrowX || $[108] !== arrowY || $[109] !== content || $[110] !== originX || $[111] !== originY || $[112] !== padding || $[113] !== placement || $[114] !== radius || $[115] !== restProps || $[116] !== scheme || $[117] !== setArrow || $[118] !== setFloating || $[119] !== shadow ? (t36 = /* @__PURE__ */ jsx(TooltipCard, { ...restProps, animate, arrow: arrowProp, arrowRef: setArrow, arrowX, arrowY, originX, originY, padding, placement, radius, ref: setFloating, scheme, shadow, children: content }), $[105] = animate, $[106] = arrowProp, $[107] = arrowX, $[108] = arrowY, $[109] = content, $[110] = originX, $[111] = originY, $[112] = padding, $[113] = placement, $[114] = radius, $[115] = restProps, $[116] = scheme, $[117] = setArrow, $[118] = setFloating, $[119] = shadow, $[120] = t36) : t36 = $[120];
  let t37;
  $[121] !== restProps || $[122] !== setFloating || $[123] !== t35 || $[124] !== t36 || $[125] !== zOffset ? (t37 = /* @__PURE__ */ jsx(StyledTooltip, { "data-ui": "Tooltip", ...restProps, ref: setFloating, style: t35, zOffset, children: t36 }), $[121] = restProps, $[122] = setFloating, $[123] = t35, $[124] = t36, $[125] = zOffset, $[126] = t37) : t37 = $[126];
  const tooltip = t37;
  let t38;
  $[127] !== portalProp || $[128] !== showTooltip || $[129] !== tooltip ? (t38 = showTooltip && (portalProp ? /* @__PURE__ */ jsx(Portal, { __unstable_name: typeof portalProp == "string" ? portalProp : void 0, children: tooltip }) : tooltip), $[127] = portalProp, $[128] = showTooltip, $[129] = tooltip, $[130] = t38) : t38 = $[130];
  const children = t38;
  let t39;
  $[131] !== animate || $[132] !== children ? (t39 = animate ? /* @__PURE__ */ jsx(AnimatePresence, { children }) : children, $[131] = animate, $[132] = children, $[133] = t39) : t39 = $[133];
  let t40;
  return $[134] !== child || $[135] !== t39 ? (t40 = /* @__PURE__ */ jsxs(Fragment, { children: [
    t39,
    child
  ] }), $[134] = child, $[135] = t39, $[136] = t40) : t40 = $[136], t40;
});
Tooltip.displayName = "ForwardRef(Tooltip)";
function useMiddleware(t0) {
  const $ = distExports.c(17), {
    animate,
    arrowProp,
    arrowRef,
    boundaryElement,
    fallbackPlacements,
    rootBoundary
  } = t0;
  let ret;
  if ($[0] !== animate || $[1] !== arrowProp || $[2] !== arrowRef || $[3] !== boundaryElement || $[4] !== fallbackPlacements || $[5] !== rootBoundary) {
    ret = [];
    const t1 = boundaryElement || void 0;
    let t2;
    $[7] !== fallbackPlacements || $[8] !== rootBoundary || $[9] !== t1 ? (t2 = flip({
      boundary: t1,
      fallbackPlacements,
      padding: DEFAULT_TOOLTIP_PADDING,
      rootBoundary
    }), $[7] = fallbackPlacements, $[8] = rootBoundary, $[9] = t1, $[10] = t2) : t2 = $[10], ret.push(t2);
    let t3;
    $[11] === Symbol.for("react.memo_cache_sentinel") ? (t3 = offset({
      mainAxis: DEFAULT_TOOLTIP_DISTANCE
    }), $[11] = t3) : t3 = $[11], ret.push(t3);
    const t4 = boundaryElement || void 0;
    let t5;
    if ($[12] !== rootBoundary || $[13] !== t4 ? (t5 = shift({
      boundary: t4,
      rootBoundary,
      padding: DEFAULT_TOOLTIP_PADDING
    }), $[12] = rootBoundary, $[13] = t4, $[14] = t5) : t5 = $[14], ret.push(t5), arrowProp) {
      let t6;
      $[15] !== arrowRef ? (t6 = arrow({
        element: arrowRef,
        padding: DEFAULT_TOOLTIP_PADDING
      }), $[15] = arrowRef, $[16] = t6) : t6 = $[16], ret.push(t6);
    }
    animate && ret.push(origin), $[0] = animate, $[1] = arrowProp, $[2] = arrowRef, $[3] = boundaryElement, $[4] = fallbackPlacements, $[5] = rootBoundary, $[6] = ret;
  } else
    ret = $[6];
  return ret;
}
function useCloseOnMouseLeave(t0) {
  const $ = distExports.c(10), {
    handleIsOpenChange,
    referenceElement,
    showTooltip,
    isInsideGroup
  } = t0;
  let t1;
  $[0] !== handleIsOpenChange || $[1] !== referenceElement ? (t1 = (target, teardown) => {
    referenceElement && (referenceElement === target || target instanceof Node && referenceElement.contains(target) || (handleIsOpenChange(!1), teardown()));
  }, $[0] = handleIsOpenChange, $[1] = referenceElement, $[2] = t1) : t1 = $[2];
  const onMouseMove = useEffectEvent(t1);
  let t2;
  $[3] !== isInsideGroup || $[4] !== onMouseMove || $[5] !== showTooltip ? (t2 = () => {
    if (!showTooltip || isInsideGroup)
      return;
    const handleMouseMove = (event) => {
      onMouseMove(event.target, () => window.removeEventListener("mousemove", handleMouseMove));
    };
    return window.addEventListener("mousemove", handleMouseMove), () => window.removeEventListener("mousemove", handleMouseMove);
  }, $[3] = isInsideGroup, $[4] = onMouseMove, $[5] = showTooltip, $[6] = t2) : t2 = $[6];
  let t3;
  $[7] !== isInsideGroup || $[8] !== showTooltip ? (t3 = [isInsideGroup, showTooltip], $[7] = isInsideGroup, $[8] = showTooltip, $[9] = t3) : t3 = $[9], useEffect(t2, t3);
}
const StyledHotkeys = styled.kbd.withConfig({
  displayName: "StyledHotkeys",
  componentId: "sc-b37mge-0"
})`font:inherit;padding:1px;&:not([hidden]){display:block;}`, Key = styled(KBD).withConfig({
  displayName: "Key",
  componentId: "sc-b37mge-1"
})`&:not([hidden]){display:block;}`, Hotkeys = forwardRef(function(props, ref) {
  const $ = distExports.c(26);
  let fontSize2, keys, padding, radius, restProps, t0;
  $[0] !== props ? ({
    fontSize: fontSize2,
    keys,
    padding,
    radius,
    space: t0,
    ...restProps
  } = props, $[0] = props, $[1] = fontSize2, $[2] = keys, $[3] = padding, $[4] = radius, $[5] = restProps, $[6] = t0) : (fontSize2 = $[1], keys = $[2], padding = $[3], radius = $[4], restProps = $[5], t0 = $[6]);
  const spaceProp = t0 === void 0 ? 0.5 : t0;
  let t1;
  $[7] !== spaceProp ? (t1 = _getArrayProp(spaceProp), $[7] = spaceProp, $[8] = t1) : t1 = $[8];
  const space = t1;
  if (!keys || keys.length === 0) {
    let t22;
    return $[9] === Symbol.for("react.memo_cache_sentinel") ? (t22 = /* @__PURE__ */ jsx(Fragment, {}), $[9] = t22) : t22 = $[9], t22;
  }
  let t2;
  if ($[10] !== fontSize2 || $[11] !== keys || $[12] !== padding || $[13] !== radius) {
    let t32;
    $[15] !== fontSize2 || $[16] !== padding || $[17] !== radius ? (t32 = (key2, i) => /* @__PURE__ */ jsx(Key, { fontSize: fontSize2, padding, radius, children: key2 }, i), $[15] = fontSize2, $[16] = padding, $[17] = radius, $[18] = t32) : t32 = $[18], t2 = keys.map(t32), $[10] = fontSize2, $[11] = keys, $[12] = padding, $[13] = radius, $[14] = t2;
  } else
    t2 = $[14];
  let t3;
  $[19] !== space || $[20] !== t2 ? (t3 = /* @__PURE__ */ jsx(Inline, { as: "span", space, children: t2 }), $[19] = space, $[20] = t2, $[21] = t3) : t3 = $[21];
  let t4;
  return $[22] !== ref || $[23] !== restProps || $[24] !== t3 ? (t4 = /* @__PURE__ */ jsx(StyledHotkeys, { "data-ui": "Hotkeys", ...restProps, ref, children: t3 }), $[22] = ref, $[23] = restProps, $[24] = t3, $[25] = t4) : t4 = $[25], t4;
});
Hotkeys.displayName = "ForwardRef(Hotkeys)";
const MenuContext = createGlobalScopedContext("@sanity/ui/context/menu", null);
function _isFocusable(element) {
  return isHTMLAnchorElement(element) && element.getAttribute("data-disabled") !== "true" || isHTMLButtonElement(element) && !element.disabled;
}
function _getFocusableElements(elements) {
  return elements.filter(_isFocusable);
}
function _getDOMPath(rootElement, el) {
  const path = [];
  let e = el;
  for (; e !== rootElement; ) {
    const parentElement = e.parentElement;
    if (!parentElement) return path;
    const index2 = Array.from(parentElement.childNodes).indexOf(e);
    if (path.unshift(index2), parentElement === rootElement)
      return path;
    e = parentElement;
  }
  return path;
}
const EMPTY_PATH = [];
function _sortElements(rootElement, elements) {
  if (!rootElement) return;
  const map = /* @__PURE__ */ new WeakMap();
  for (const el of elements)
    map.set(el, _getDOMPath(rootElement, el));
  const _sort = (a, b) => {
    const _a = map.get(a) || EMPTY_PATH, _b = map.get(b) || EMPTY_PATH, len = Math.max(_a.length, _b.length);
    for (let i = 0; i < len; i += 1) {
      const aIndex = _a[i] || -1, bIndex = _b[i] || -1;
      if (aIndex !== bIndex)
        return aIndex - bIndex;
    }
    return 0;
  };
  elements.sort(_sort);
}
function useMenuController(props) {
  const $ = distExports.c(21), {
    onKeyDown,
    originElement,
    shouldFocus,
    rootElementRef
  } = props;
  let t0;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t0 = [], $[0] = t0) : t0 = $[0];
  const elementsRef = useRef(t0), [activeIndex, _setActiveIndex] = useState(-1), activeIndexRef = useRef(activeIndex), [activeElement, setActiveElement] = useState(null);
  let t1;
  $[1] === Symbol.for("react.memo_cache_sentinel") ? (t1 = (nextActiveIndex) => {
    _setActiveIndex(nextActiveIndex), activeIndexRef.current = nextActiveIndex, setActiveElement(elementsRef.current[nextActiveIndex] || null);
  }, $[1] = t1) : t1 = $[1];
  const setActiveIndex = t1;
  let t2;
  $[2] !== rootElementRef ? (t2 = (element, selected) => {
    if (!element)
      return _temp$1;
    if (elementsRef.current.indexOf(element) === -1 && (elementsRef.current.push(element), _sortElements(rootElementRef.current, elementsRef.current)), selected) {
      const selectedIndex = elementsRef.current.indexOf(element);
      setActiveIndex(selectedIndex);
    }
    return () => {
      const idx = elementsRef.current.indexOf(element);
      idx > -1 && elementsRef.current.splice(idx, 1);
    };
  }, $[2] = rootElementRef, $[3] = t2) : t2 = $[3];
  const mount = t2;
  let t3;
  $[4] !== onKeyDown || $[5] !== originElement ? (t3 = (event) => {
    if (event.key === "Tab") {
      originElement && originElement.focus();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault(), event.stopPropagation();
      const el = _getFocusableElements(elementsRef.current)[0];
      if (!el)
        return;
      const currentIndex = elementsRef.current.indexOf(el);
      setActiveIndex(currentIndex);
      return;
    }
    if (event.key === "End") {
      event.preventDefault(), event.stopPropagation();
      const focusableElements_0 = _getFocusableElements(elementsRef.current), el_0 = focusableElements_0[focusableElements_0.length - 1];
      if (!el_0)
        return;
      const currentIndex_0 = elementsRef.current.indexOf(el_0);
      setActiveIndex(currentIndex_0);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault(), event.stopPropagation();
      const focusableElements_1 = _getFocusableElements(elementsRef.current), focusableLen = focusableElements_1.length;
      if (focusableLen === 0)
        return;
      const focusedElement = elementsRef.current[activeIndexRef.current];
      let focusedIndex = focusableElements_1.indexOf(focusedElement);
      focusedIndex = (focusedIndex - 1 + focusableLen) % focusableLen;
      const el_1 = focusableElements_1[focusedIndex], currentIndex_1 = elementsRef.current.indexOf(el_1);
      setActiveIndex(currentIndex_1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault(), event.stopPropagation();
      const focusableElements_2 = _getFocusableElements(elementsRef.current), focusableLen_0 = focusableElements_2.length;
      if (focusableLen_0 === 0)
        return;
      const focusedElement_0 = elementsRef.current[activeIndexRef.current];
      let focusedIndex_0 = focusableElements_2.indexOf(focusedElement_0);
      focusedIndex_0 = (focusedIndex_0 + 1) % focusableLen_0;
      const el_2 = focusableElements_2[focusedIndex_0], currentIndex_2 = elementsRef.current.indexOf(el_2);
      setActiveIndex(currentIndex_2);
      return;
    }
    onKeyDown && onKeyDown(event);
  }, $[4] = onKeyDown, $[5] = originElement, $[6] = t3) : t3 = $[6];
  const handleKeyDown = t3;
  let t4;
  $[7] === Symbol.for("react.memo_cache_sentinel") ? (t4 = (event_0) => {
    const element_0 = event_0.currentTarget, currentIndex_3 = elementsRef.current.indexOf(element_0);
    setActiveIndex(currentIndex_3);
  }, $[7] = t4) : t4 = $[7];
  const handleItemMouseEnter = t4;
  let t5;
  $[8] !== rootElementRef ? (t5 = () => {
    setActiveIndex(-2), rootElementRef.current?.focus();
  }, $[8] = rootElementRef, $[9] = t5) : t5 = $[9];
  const handleItemMouseLeave = t5;
  let t6, t7;
  $[10] !== activeIndex || $[11] !== rootElementRef || $[12] !== shouldFocus ? (t6 = () => {
    if (!rootElementRef.current)
      return;
    const rafId = requestAnimationFrame(() => {
      if (activeIndex === -1) {
        if (shouldFocus === "first") {
          const el_3 = _getFocusableElements(elementsRef.current)[0];
          if (el_3) {
            const currentIndex_4 = elementsRef.current.indexOf(el_3);
            setActiveIndex(currentIndex_4);
          }
        }
        if (shouldFocus === "last") {
          const focusableElements_4 = _getFocusableElements(elementsRef.current), el_4 = focusableElements_4[focusableElements_4.length - 1];
          if (el_4) {
            const currentIndex_5 = elementsRef.current.indexOf(el_4);
            setActiveIndex(currentIndex_5);
          }
        }
        return;
      }
      (elementsRef.current[activeIndex] || null)?.focus();
    });
    return () => cancelAnimationFrame(rafId);
  }, t7 = [activeIndex, rootElementRef, setActiveIndex, shouldFocus], $[10] = activeIndex, $[11] = rootElementRef, $[12] = shouldFocus, $[13] = t6, $[14] = t7) : (t6 = $[13], t7 = $[14]), useEffect(t6, t7);
  let t8;
  return $[15] !== activeElement || $[16] !== activeIndex || $[17] !== handleItemMouseLeave || $[18] !== handleKeyDown || $[19] !== mount ? (t8 = {
    activeElement,
    activeIndex,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handleKeyDown,
    mount
  }, $[15] = activeElement, $[16] = activeIndex, $[17] = handleItemMouseLeave, $[18] = handleKeyDown, $[19] = mount, $[20] = t8) : t8 = $[20], t8;
}
function _temp$1() {
}
const StyledMenu = styled(Box).withConfig({
  displayName: "StyledMenu",
  componentId: "sc-xt0tnv-0"
})`outline:none;overflow:auto;`, Menu = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(49);
  let _shouldFocus, children, onClickOutside, onEscape, onItemClick, onItemSelect, onKeyDown, originElement, registerElement, restProps, t0, t1;
  if ($[0] !== props) {
    const {
      children: t22,
      focusFirst,
      focusLast,
      onClickOutside: t32,
      onEscape: t42,
      onItemClick: t52,
      onItemSelect: t62,
      onKeyDown: t72,
      originElement: t82,
      padding: t92,
      registerElement: t102,
      shouldFocus: t112,
      space: t122,
      ...t13
    } = props;
    children = t22, onClickOutside = t32, onEscape = t42, onItemClick = t52, onItemSelect = t62, onKeyDown = t72, originElement = t82, t0 = t92, registerElement = t102, _shouldFocus = t112, t1 = t122, restProps = t13, $[0] = props, $[1] = _shouldFocus, $[2] = children, $[3] = onClickOutside, $[4] = onEscape, $[5] = onItemClick, $[6] = onItemSelect, $[7] = onKeyDown, $[8] = originElement, $[9] = registerElement, $[10] = restProps, $[11] = t0, $[12] = t1;
  } else
    _shouldFocus = $[1], children = $[2], onClickOutside = $[3], onEscape = $[4], onItemClick = $[5], onItemSelect = $[6], onKeyDown = $[7], originElement = $[8], registerElement = $[9], restProps = $[10], t0 = $[11], t1 = $[12];
  const padding = t0 === void 0 ? 1 : t0, space = t1 === void 0 ? 1 : t1, shouldFocus = _shouldFocus ?? (props.focusFirst && "first" || props.focusLast && "last" || null), ref = useRef(null);
  let t2;
  $[13] === Symbol.for("react.memo_cache_sentinel") ? (t2 = () => ref.current, $[13] = t2) : t2 = $[13], useImperativeHandle(forwardedRef, t2);
  const {
    isTopLayer: isTopLayer2
  } = useLayer();
  let t3;
  $[14] !== onKeyDown || $[15] !== originElement || $[16] !== shouldFocus ? (t3 = {
    onKeyDown,
    originElement,
    shouldFocus,
    rootElementRef: ref
  }, $[14] = onKeyDown, $[15] = originElement, $[16] = shouldFocus, $[17] = t3) : t3 = $[17];
  const {
    activeElement,
    activeIndex,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handleKeyDown,
    mount
  } = useMenuController(t3), unregisterElementRef = useRef(null);
  let t4;
  $[18] !== registerElement ? (t4 = (el) => {
    unregisterElementRef.current && (unregisterElementRef.current(), unregisterElementRef.current = null), ref.current = el, ref.current && registerElement && (unregisterElementRef.current = registerElement(ref.current));
  }, $[18] = registerElement, $[19] = t4) : t4 = $[19];
  const handleRefChange = t4;
  let t5, t6;
  $[20] !== activeIndex || $[21] !== onItemSelect ? (t5 = () => {
    onItemSelect && onItemSelect(activeIndex);
  }, t6 = [activeIndex, onItemSelect], $[20] = activeIndex, $[21] = onItemSelect, $[22] = t5, $[23] = t6) : (t5 = $[22], t6 = $[23]), useEffect(t5, t6);
  let t7;
  $[24] === Symbol.for("react.memo_cache_sentinel") ? (t7 = () => [ref.current], $[24] = t7) : t7 = $[24], useClickOutsideEvent(isTopLayer2 && onClickOutside, t7);
  let t8;
  $[25] !== isTopLayer2 || $[26] !== onEscape ? (t8 = (event) => {
    isTopLayer2 && event.key === "Escape" && (event.stopPropagation(), onEscape && onEscape());
  }, $[25] = isTopLayer2, $[26] = onEscape, $[27] = t8) : t8 = $[27], useGlobalKeyDown(t8);
  let t9;
  $[28] !== activeElement || $[29] !== handleItemMouseEnter || $[30] !== handleItemMouseLeave || $[31] !== mount || $[32] !== onClickOutside || $[33] !== onEscape || $[34] !== onItemClick || $[35] !== registerElement ? (t9 = {
    version: 2,
    activeElement,
    mount,
    onClickOutside,
    onEscape,
    onItemClick,
    onItemMouseEnter: handleItemMouseEnter,
    onItemMouseLeave: handleItemMouseLeave,
    registerElement
  }, $[28] = activeElement, $[29] = handleItemMouseEnter, $[30] = handleItemMouseLeave, $[31] = mount, $[32] = onClickOutside, $[33] = onEscape, $[34] = onItemClick, $[35] = registerElement, $[36] = t9) : t9 = $[36];
  const value = t9;
  let t10;
  $[37] !== children || $[38] !== space ? (t10 = /* @__PURE__ */ jsx(Stack, { space, children }), $[37] = children, $[38] = space, $[39] = t10) : t10 = $[39];
  let t11;
  $[40] !== handleKeyDown || $[41] !== handleRefChange || $[42] !== padding || $[43] !== restProps || $[44] !== t10 ? (t11 = /* @__PURE__ */ jsx(StyledMenu, { "data-ui": "Menu", ...restProps, onKeyDown: handleKeyDown, padding, ref: handleRefChange, role: "menu", tabIndex: -1, children: t10 }), $[40] = handleKeyDown, $[41] = handleRefChange, $[42] = padding, $[43] = restProps, $[44] = t10, $[45] = t11) : t11 = $[45];
  let t12;
  return $[46] !== t11 || $[47] !== value ? (t12 = /* @__PURE__ */ jsx(MenuContext.Provider, { value, children: t11 }), $[46] = t11, $[47] = value, $[48] = t12) : t12 = $[48], t12;
});
Menu.displayName = "ForwardRef(Menu)";
const MenuDivider = styled.hr.withConfig({
  displayName: "MenuDivider",
  componentId: "sc-uhoxwu-0"
})`height:1px;border:0;background:var(--card-hairline-soft-color);margin:0;`;
MenuDivider.displayName = "MenuDivider";
function selectableBaseStyle() {
  return css`
    background-color: inherit;
    color: inherit;

    &[data-as='button'] {
      -webkit-font-smoothing: inherit;
      appearance: none;
      outline: none;
      font: inherit;
      text-align: inherit;
      border: 0;
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    }

    /* &:is(a) */
    &[data-as='a'] {
      text-decoration: none;
    }
  `;
}
function selectableColorStyle(props) {
  const {
    $tone
  } = props, {
    color: color2,
    style
  } = getTheme_v2(props.theme), tone = color2.selectable[$tone];
  return css`
    ${_cardColorStyle(color2, tone.enabled)}

    background-color: var(--card-bg-color);
    color: var(--card-fg-color);
    outline: none;

    /* &:is(button) */
    &[data-as='button'] {
      &:disabled {
        ${_cardColorStyle(color2, tone.disabled)}
      }

      &:not(:disabled) {
        &[aria-pressed='true'] {
          ${_cardColorStyle(color2, tone.pressed)}
        }

        &[data-selected],
        &[aria-selected='true'] > & {
          ${_cardColorStyle(color2, tone.selected)}
        }

        @media (hover: hover) {
          &:not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${_cardColorStyle(color2, tone.hovered)}
            }

            &:active {
              ${_cardColorStyle(color2, tone.pressed)}
            }
          }
        }
      }
    }

    /* &:is(a) */
    &[data-as='a'] {
      &[data-disabled] {
        ${_cardColorStyle(color2, tone.disabled)}
      }

      &:not([data-disabled]) {
        &[data-pressed] {
          ${_cardColorStyle(color2, tone.pressed)}
        }

        &[data-selected] {
          ${_cardColorStyle(color2, tone.selected)}
        }

        @media (hover: hover) {
          &:not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${_cardColorStyle(color2, tone.hovered)}
            }
            &:active {
              ${_cardColorStyle(color2, tone.pressed)}
            }
          }
        }
      }
    }

    ${style?.card?.root}
  `;
}
const Selectable = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "Selectable",
  componentId: "sc-1w01ang-0"
})(responsiveRadiusStyle, selectableBaseStyle, selectableColorStyle);
Selectable.displayName = "Selectable";
function useMenu() {
  const value = useContext(MenuContext);
  if (!value)
    throw new Error("useMenu(): missing context value");
  if (!isRecord(value) || value.version !== 2)
    throw new Error("useMenu(): the context value is not compatible");
  return value;
}
const MenuItem = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(75);
  let IconComponent, IconRightComponent, children, disabled, hotkeys, onClick, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingX, paddingY, pressed, restProps, selectedProp, t0, t1, t2, t3, t4, t5, text;
  $[0] !== props ? ({
    as: t0,
    children,
    disabled,
    fontSize: t1,
    hotkeys,
    icon: IconComponent,
    iconRight: IconRightComponent,
    onClick,
    padding: t2,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    pressed,
    radius: t3,
    selected: selectedProp,
    space: t4,
    text,
    tone: t5,
    ...restProps
  } = props, $[0] = props, $[1] = IconComponent, $[2] = IconRightComponent, $[3] = children, $[4] = disabled, $[5] = hotkeys, $[6] = onClick, $[7] = paddingBottom, $[8] = paddingLeft, $[9] = paddingRight, $[10] = paddingTop, $[11] = paddingX, $[12] = paddingY, $[13] = pressed, $[14] = restProps, $[15] = selectedProp, $[16] = t0, $[17] = t1, $[18] = t2, $[19] = t3, $[20] = t4, $[21] = t5, $[22] = text) : (IconComponent = $[1], IconRightComponent = $[2], children = $[3], disabled = $[4], hotkeys = $[5], onClick = $[6], paddingBottom = $[7], paddingLeft = $[8], paddingRight = $[9], paddingTop = $[10], paddingX = $[11], paddingY = $[12], pressed = $[13], restProps = $[14], selectedProp = $[15], t0 = $[16], t1 = $[17], t2 = $[18], t3 = $[19], t4 = $[20], t5 = $[21], text = $[22]);
  const as = t0 === void 0 ? "button" : t0, fontSize2 = t1 === void 0 ? 1 : t1, padding = t2 === void 0 ? 3 : t2, radius = t3 === void 0 ? 2 : t3, space = t4 === void 0 ? 3 : t4, tone = t5 === void 0 ? "default" : t5, {
    scheme
  } = useRootTheme(), menu = useMenu(), {
    activeElement,
    mount,
    onItemClick,
    onItemMouseEnter: _onItemMouseEnter,
    onItemMouseLeave: _onItemMouseLeave
  } = menu, onItemMouseEnter = _onItemMouseEnter ?? menu.onItemMouseEnter, onItemMouseLeave = _onItemMouseLeave ?? menu.onItemMouseLeave, [rootElement, setRootElement] = useState(null), active = !!activeElement && activeElement === rootElement, ref = useRef(null);
  let t6;
  $[23] === Symbol.for("react.memo_cache_sentinel") ? (t6 = () => ref.current, $[23] = t6) : t6 = $[23], useImperativeHandle(forwardedRef, t6);
  let t7, t8;
  $[24] !== mount || $[25] !== rootElement || $[26] !== selectedProp ? (t7 = () => mount(rootElement, selectedProp), t8 = [mount, rootElement, selectedProp], $[24] = mount, $[25] = rootElement, $[26] = selectedProp, $[27] = t7, $[28] = t8) : (t7 = $[27], t8 = $[28]), useEffect(t7, t8);
  let t9;
  $[29] !== disabled || $[30] !== onClick || $[31] !== onItemClick ? (t9 = (event) => {
    disabled || (onClick && onClick(event), onItemClick && onItemClick());
  }, $[29] = disabled, $[30] = onClick, $[31] = onItemClick, $[32] = t9) : t9 = $[32];
  const handleClick = t9;
  let t10;
  $[33] !== padding || $[34] !== paddingBottom || $[35] !== paddingLeft || $[36] !== paddingRight || $[37] !== paddingTop || $[38] !== paddingX || $[39] !== paddingY ? (t10 = {
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  }, $[33] = padding, $[34] = paddingBottom, $[35] = paddingLeft, $[36] = paddingRight, $[37] = paddingTop, $[38] = paddingX, $[39] = paddingY, $[40] = t10) : t10 = $[40];
  const paddingProps = t10;
  let t11;
  $[41] !== fontSize2 ? (t11 = _getArrayProp(fontSize2).map(_temp), $[41] = fontSize2, $[42] = t11) : t11 = $[42];
  const hotkeysFontSize = t11;
  let t12;
  $[43] === Symbol.for("react.memo_cache_sentinel") ? (t12 = (el) => {
    ref.current = el, setRootElement(el);
  }, $[43] = t12) : t12 = $[43];
  const setRef2 = t12, t13 = as !== "button" && pressed ? "" : void 0, t14 = active ? "" : void 0, t15 = disabled ? "" : void 0;
  let t16;
  $[44] !== radius ? (t16 = _getArrayProp(radius), $[44] = radius, $[45] = t16) : t16 = $[45];
  let t17;
  $[46] === Symbol.for("react.memo_cache_sentinel") ? (t17 = _getArrayProp(0), $[46] = t17) : t17 = $[46];
  const t18 = disabled ? "default" : tone, t19 = as === "button" ? "button" : void 0;
  let t20;
  $[47] !== IconComponent || $[48] !== IconRightComponent || $[49] !== fontSize2 || $[50] !== hotkeys || $[51] !== hotkeysFontSize || $[52] !== paddingProps || $[53] !== space || $[54] !== text ? (t20 = (IconComponent || text || IconRightComponent) && /* @__PURE__ */ jsxs(Flex, { as: "span", gap: space, align: "center", ...paddingProps, children: [
    IconComponent && /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
      isValidElement(IconComponent) && IconComponent,
      reactIsExports.isValidElementType(IconComponent) && /* @__PURE__ */ jsx(IconComponent, {})
    ] }),
    text && /* @__PURE__ */ jsx(Box, { flex: 1, children: /* @__PURE__ */ jsx(Text, { size: fontSize2, textOverflow: "ellipsis", weight: "medium", children: text }) }),
    hotkeys && /* @__PURE__ */ jsx(Hotkeys, { fontSize: hotkeysFontSize, keys: hotkeys, style: {
      marginTop: -4,
      marginBottom: -4
    } }),
    IconRightComponent && /* @__PURE__ */ jsxs(Text, { size: fontSize2, children: [
      isValidElement(IconRightComponent) && IconRightComponent,
      reactIsExports.isValidElementType(IconRightComponent) && /* @__PURE__ */ jsx(IconRightComponent, {})
    ] })
  ] }), $[47] = IconComponent, $[48] = IconRightComponent, $[49] = fontSize2, $[50] = hotkeys, $[51] = hotkeysFontSize, $[52] = paddingProps, $[53] = space, $[54] = text, $[55] = t20) : t20 = $[55];
  let t21;
  $[56] !== children || $[57] !== paddingProps ? (t21 = children && /* @__PURE__ */ jsx(Box, { as: "span", ...paddingProps, children }), $[56] = children, $[57] = paddingProps, $[58] = t21) : t21 = $[58];
  let t22;
  return $[59] !== as || $[60] !== disabled || $[61] !== handleClick || $[62] !== onItemMouseEnter || $[63] !== onItemMouseLeave || $[64] !== restProps || $[65] !== scheme || $[66] !== t13 || $[67] !== t14 || $[68] !== t15 || $[69] !== t16 || $[70] !== t18 || $[71] !== t19 || $[72] !== t20 || $[73] !== t21 ? (t22 = /* @__PURE__ */ jsxs(Selectable, { "data-ui": "MenuItem", role: "menuitem", ...restProps, "data-pressed": t13, "data-selected": t14, "data-disabled": t15, forwardedAs: as, $radius: t16, $padding: t17, $tone: t18, $scheme: scheme, disabled, onClick: handleClick, onMouseEnter: onItemMouseEnter, onMouseLeave: onItemMouseLeave, ref: setRef2, tabIndex: -1, type: t19, children: [
    t20,
    t21
  ] }), $[59] = as, $[60] = disabled, $[61] = handleClick, $[62] = onItemMouseEnter, $[63] = onItemMouseLeave, $[64] = restProps, $[65] = scheme, $[66] = t13, $[67] = t14, $[68] = t15, $[69] = t16, $[70] = t18, $[71] = t19, $[72] = t20, $[73] = t21, $[74] = t22) : t22 = $[74], t22;
});
MenuItem.displayName = "ForwardRef(MenuItem)";
function _temp(s) {
  return s - 1;
}
const CustomButton = styled(Button).withConfig({
  displayName: "CustomButton",
  componentId: "sc-1kns779-0"
})`max-width:100%;`, Tab = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(30);
  let focused, icon, id2, label, onClick, onFocus, restProps, selected, t0, t1;
  $[0] !== props ? ({
    icon,
    id: id2,
    focused,
    fontSize: t0,
    label,
    onClick,
    onFocus,
    padding: t1,
    selected,
    ...restProps
  } = props, $[0] = props, $[1] = focused, $[2] = icon, $[3] = id2, $[4] = label, $[5] = onClick, $[6] = onFocus, $[7] = restProps, $[8] = selected, $[9] = t0, $[10] = t1) : (focused = $[1], icon = $[2], id2 = $[3], label = $[4], onClick = $[5], onFocus = $[6], restProps = $[7], selected = $[8], t0 = $[9], t1 = $[10]);
  const fontSize2 = t0 === void 0 ? 1 : t0, padding = t1 === void 0 ? 2 : t1, ref = useRef(null), focusedRef = useRef(!1);
  let t2;
  $[11] === Symbol.for("react.memo_cache_sentinel") ? (t2 = () => ref.current, $[11] = t2) : t2 = $[11], useImperativeHandle(forwardedRef, t2);
  let t3;
  $[12] === Symbol.for("react.memo_cache_sentinel") ? (t3 = () => {
    focusedRef.current = !1;
  }, $[12] = t3) : t3 = $[12];
  const handleBlur = t3;
  let t4;
  $[13] !== onFocus ? (t4 = (event) => {
    focusedRef.current = !0, onFocus && onFocus(event);
  }, $[13] = onFocus, $[14] = t4) : t4 = $[14];
  const handleFocus = t4;
  let t5, t6;
  $[15] !== focused ? (t5 = () => {
    focused && !focusedRef.current && (ref.current && ref.current.focus(), focusedRef.current = !0);
  }, t6 = [focused], $[15] = focused, $[16] = t5, $[17] = t6) : (t5 = $[16], t6 = $[17]), useEffect(t5, t6);
  const t7 = selected ? "true" : "false", t8 = selected ? 0 : -1;
  let t9;
  return $[18] !== fontSize2 || $[19] !== handleFocus || $[20] !== icon || $[21] !== id2 || $[22] !== label || $[23] !== onClick || $[24] !== padding || $[25] !== restProps || $[26] !== selected || $[27] !== t7 || $[28] !== t8 ? (t9 = /* @__PURE__ */ jsx(CustomButton, { "data-ui": "Tab", ...restProps, "aria-selected": t7, fontSize: fontSize2, icon, id: id2, mode: "bleed", onClick, onBlur: handleBlur, onFocus: handleFocus, padding, ref, role: "tab", selected, tabIndex: t8, text: label, type: "button" }), $[18] = fontSize2, $[19] = handleFocus, $[20] = icon, $[21] = id2, $[22] = label, $[23] = onClick, $[24] = padding, $[25] = restProps, $[26] = selected, $[27] = t7, $[28] = t8, $[29] = t9) : t9 = $[29], t9;
});
Tab.displayName = "ForwardRef(Tab)";
const CustomInline = styled(Inline).withConfig({
  displayName: "CustomInline",
  componentId: "sc-5cm04m-0"
})`& > div{display:inline-block;vertical-align:middle;max-width:100%;box-sizing:border-box;}`, TabList = forwardRef(function(props, ref) {
  const $ = distExports.c(15);
  let childrenProp, restProps;
  $[0] !== props ? ({
    children: childrenProp,
    ...restProps
  } = props, $[0] = props, $[1] = childrenProp, $[2] = restProps) : (childrenProp = $[1], restProps = $[2]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  let t0;
  if ($[3] !== childrenProp || $[4] !== focusedIndex) {
    const children = Children.toArray(childrenProp).filter(isValidElement);
    let t12;
    $[6] !== focusedIndex ? (t12 = (child, childIndex) => cloneElement(child, {
      focused: focusedIndex === childIndex,
      key: childIndex,
      onFocus: () => setFocusedIndex(childIndex)
    }), $[6] = focusedIndex, $[7] = t12) : t12 = $[7], t0 = children.map(t12), $[3] = childrenProp, $[4] = focusedIndex, $[5] = t0;
  } else
    t0 = $[5];
  const tabs = t0, numTabs = tabs.length;
  let t1;
  $[8] !== numTabs ? (t1 = (event) => {
    event.key === "ArrowLeft" && setFocusedIndex((prevIndex) => (prevIndex + numTabs - 1) % numTabs), event.key === "ArrowRight" && setFocusedIndex((prevIndex_0) => (prevIndex_0 + 1) % numTabs);
  }, $[8] = numTabs, $[9] = t1) : t1 = $[9];
  const handleKeyDown = t1;
  let t2;
  return $[10] !== handleKeyDown || $[11] !== ref || $[12] !== restProps || $[13] !== tabs ? (t2 = /* @__PURE__ */ jsx(CustomInline, { "data-ui": "TabList", ...restProps, onKeyDown: handleKeyDown, ref, role: "tablist", children: tabs }), $[10] = handleKeyDown, $[11] = ref, $[12] = restProps, $[13] = tabs, $[14] = t2) : t2 = $[14], t2;
});
TabList.displayName = "ForwardRef(TabList)";
function _raf(fn) {
  const frameId = requestAnimationFrame(fn);
  return () => {
    cancelAnimationFrame(frameId);
  };
}
function _hasFocus(element) {
  return !!document.activeElement && element.contains(document.activeElement);
}
function isFocusable(element) {
  return element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null ? !0 : isHTMLAnchorElement(element) ? !!element.href && element.rel !== "ignore" : isHTMLInputElement(element) ? element.type !== "hidden" && element.type !== "file" && !element.disabled : isHTMLButtonElement(element) || isHTMLSelectElement(element) || isHTMLTextAreaElement(element) ? !element.disabled : !1;
}
function attemptFocus(element) {
  if (!isFocusable(element))
    return !1;
  try {
    element.focus();
  } catch {
  }
  return document.activeElement === element;
}
function focusFirstDescendant(element) {
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (isHTMLElement(child) && (attemptFocus(child) || focusFirstDescendant(child)))
      return !0;
  }
  return !1;
}
function focusLastDescendant(element) {
  for (let i = element.childNodes.length - 1; i >= 0; i--) {
    const child = element.childNodes[i];
    if (isHTMLElement(child) && (attemptFocus(child) || focusLastDescendant(child)))
      return !0;
  }
  return !1;
}
const StyledAutocomplete = styled.div.withConfig({
  displayName: "StyledAutocomplete",
  componentId: "sc-1igauft-0"
})`line-height:0;`, ListBox = styled(Box).withConfig({
  displayName: "ListBox",
  componentId: "sc-1igauft-1"
})`& > ul{list-style:none;padding:0;margin:0;}`, rotate = keyframes$1`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`, AnimatedSpinnerIcon = styled(SpinnerIcon).withConfig({
  displayName: "AnimatedSpinnerIcon",
  componentId: "sc-1igauft-2"
})`animation:${rotate} 500ms linear infinite;`;
function AutocompleteOption(props) {
  const $ = distExports.c(11), {
    children,
    id: id2,
    onSelect,
    selected,
    value
  } = props;
  let t0;
  $[0] !== onSelect || $[1] !== value ? (t0 = () => {
    setTimeout(() => {
      onSelect(value);
    }, 0);
  }, $[0] = onSelect, $[1] = value, $[2] = t0) : t0 = $[2];
  const handleClick = t0;
  let t1;
  $[3] !== handleClick ? (t1 = (event) => {
    event.key === "Enter" && !_isEnterToClickElement(event.currentTarget) && handleClick();
  }, $[3] = handleClick, $[4] = t1) : t1 = $[4];
  const handleKeyDown = t1;
  let t2;
  return $[5] !== children || $[6] !== handleClick || $[7] !== handleKeyDown || $[8] !== id2 || $[9] !== selected ? (t2 = /* @__PURE__ */ jsx("li", { "aria-selected": selected, "data-ui": "AutocompleteOption", id: id2, role: "option", onClick: handleClick, onKeyDown: handleKeyDown, children }), $[5] = children, $[6] = handleClick, $[7] = handleKeyDown, $[8] = id2, $[9] = selected, $[10] = t2) : t2 = $[10], t2;
}
function autocompleteReducer(state, msg2) {
  return msg2.type === "input/change" ? {
    ...state,
    activeValue: null,
    focused: !0,
    query: msg2.query
  } : msg2.type === "input/focus" ? {
    ...state,
    focused: !0
  } : msg2.type === "root/blur" ? {
    ...state,
    focused: !1,
    query: null
  } : msg2.type === "root/clear" ? {
    ...state,
    activeValue: null,
    query: null,
    value: null
  } : msg2.type === "root/escape" ? {
    ...state,
    focused: !1,
    query: null
  } : msg2.type === "root/open" ? {
    ...state,
    query: state.query || msg2.query
  } : msg2.type === "root/setActiveValue" ? {
    ...state,
    activeValue: msg2.value,
    listFocused: msg2.listFocused || state.listFocused
  } : msg2.type === "root/setListFocused" ? {
    ...state,
    listFocused: msg2.listFocused
  } : msg2.type === "value/change" ? {
    ...state,
    activeValue: msg2.value,
    query: null,
    value: msg2.value
  } : state;
}
const AUTOCOMPLETE_LISTBOX_IGNORE_KEYS = ["Control", "Shift", "Alt", "Enter", "Home", "End", "PageUp", "PageDown", "Meta", "Tab", "CapsLock"], AUTOCOMPLETE_POPOVER_PLACEMENT = "bottom-start", AUTOCOMPLETE_POPOVER_FALLBACK_PLACEMENTS = ["bottom-start", "top-start"], DEFAULT_RENDER_VALUE = (value, option) => option ? option.value : value, DEFAULT_FILTER_OPTION = (query, option) => option.value.toLowerCase().indexOf(query.toLowerCase()) > -1, InnerAutocomplete = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(181);
  let customValidity, disabled, filterOptionProp, icon, id2, loading, onBlur, onChange, onFocus, onQueryChange, onSelect, openButton, openOnFocus, optionsProp, prefix, readOnly, relatedElements, renderOptionProp, renderPopover, restProps, suffix, t0, t1, t2, t3, t4, t5, t6, valueProp;
  $[0] !== props ? ({
    border: t0,
    customValidity,
    disabled,
    filterOption: filterOptionProp,
    fontSize: t1,
    icon,
    id: id2,
    listBox: t2,
    loading,
    onBlur,
    onChange,
    onFocus,
    onQueryChange,
    onSelect,
    openButton,
    openOnFocus,
    options: optionsProp,
    padding: t3,
    popover: t4,
    prefix,
    radius: t5,
    readOnly,
    relatedElements,
    renderOption: renderOptionProp,
    renderPopover,
    renderValue: t6,
    suffix,
    value: valueProp,
    ...restProps
  } = props, $[0] = props, $[1] = customValidity, $[2] = disabled, $[3] = filterOptionProp, $[4] = icon, $[5] = id2, $[6] = loading, $[7] = onBlur, $[8] = onChange, $[9] = onFocus, $[10] = onQueryChange, $[11] = onSelect, $[12] = openButton, $[13] = openOnFocus, $[14] = optionsProp, $[15] = prefix, $[16] = readOnly, $[17] = relatedElements, $[18] = renderOptionProp, $[19] = renderPopover, $[20] = restProps, $[21] = suffix, $[22] = t0, $[23] = t1, $[24] = t2, $[25] = t3, $[26] = t4, $[27] = t5, $[28] = t6, $[29] = valueProp) : (customValidity = $[1], disabled = $[2], filterOptionProp = $[3], icon = $[4], id2 = $[5], loading = $[6], onBlur = $[7], onChange = $[8], onFocus = $[9], onQueryChange = $[10], onSelect = $[11], openButton = $[12], openOnFocus = $[13], optionsProp = $[14], prefix = $[15], readOnly = $[16], relatedElements = $[17], renderOptionProp = $[18], renderPopover = $[19], restProps = $[20], suffix = $[21], t0 = $[22], t1 = $[23], t2 = $[24], t3 = $[25], t4 = $[26], t5 = $[27], t6 = $[28], valueProp = $[29]);
  const border2 = t0 === void 0 ? !0 : t0, fontSize2 = t1 === void 0 ? 2 : t1, listBox = t2 === void 0 ? EMPTY_RECORD : t2, paddingProp = t3 === void 0 ? 3 : t3, popover = t4 === void 0 ? EMPTY_RECORD : t4, radius = t5 === void 0 ? 2 : t5, renderValue = t6 === void 0 ? DEFAULT_RENDER_VALUE : t6, t7 = valueProp || null, t8 = valueProp || null;
  let t9;
  $[30] !== t7 || $[31] !== t8 ? (t9 = {
    activeValue: t7,
    focused: !1,
    listFocused: !1,
    query: null,
    value: t8
  }, $[30] = t7, $[31] = t8, $[32] = t9) : t9 = $[32];
  const [state, dispatch] = useReducer(autocompleteReducer, t9), {
    activeValue,
    focused,
    listFocused,
    query,
    value
  } = state;
  let t10;
  $[33] !== fontSize2 || $[34] !== paddingProp ? (t10 = (t112) => {
    const {
      value: value_0
    } = t112;
    return /* @__PURE__ */ jsx(Card, { "data-as": "button", padding: paddingProp, radius: 2, tone: "inherit", children: /* @__PURE__ */ jsx(Text, { size: fontSize2, textOverflow: "ellipsis", children: value_0 }) });
  }, $[33] = fontSize2, $[34] = paddingProp, $[35] = t10) : t10 = $[35];
  const renderOption = typeof renderOptionProp == "function" ? renderOptionProp : t10, filterOption = typeof filterOptionProp == "function" ? filterOptionProp : DEFAULT_FILTER_OPTION, rootElementRef = useRef(null), resultsPopoverElementRef = useRef(null), inputElementRef = useRef(null), listBoxElementRef = useRef(null), [inputElement, _setInputElement] = useState(null);
  let t11;
  $[36] === Symbol.for("react.memo_cache_sentinel") ? (t11 = (node) => {
    startTransition(() => _setInputElement(node));
  }, $[36] = t11) : t11 = $[36];
  const setInputElement = t11, listFocusedRef = useRef(!1), valueRef = useRef(value), valuePropRef = useRef(valueProp), popoverMouseWithinRef = useRef(!1);
  let t12, t13;
  $[37] !== inputElement ? (t12 = () => inputElement, t13 = [inputElement], $[37] = inputElement, $[38] = t12, $[39] = t13) : (t12 = $[38], t13 = $[39]), useImperativeHandle(inputElementRef, t12, t13);
  let t14, t15;
  $[40] !== inputElement ? (t14 = () => inputElement, t15 = [inputElement], $[40] = inputElement, $[41] = t14, $[42] = t15) : (t14 = $[41], t15 = $[42]), useImperativeHandle(forwardedRef, t14, t15);
  const listBoxId = `${id2}-listbox`, options = Array.isArray(optionsProp) ? optionsProp : EMPTY_ARRAY, padding = _getArrayProp(paddingProp);
  let t16;
  $[43] !== options || $[44] !== value ? (t16 = value !== null ? options.find((o) => o.value === value) : void 0, $[43] = options, $[44] = value, $[45] = t16) : t16 = $[45];
  const currentOption = t16;
  let t17;
  if ($[46] !== filterOption || $[47] !== options || $[48] !== query) {
    let t182;
    $[50] !== filterOption || $[51] !== query ? (t182 = (option) => query ? filterOption(query, option) : !0, $[50] = filterOption, $[51] = query, $[52] = t182) : t182 = $[52], t17 = options.filter(t182), $[46] = filterOption, $[47] = options, $[48] = query, $[49] = t17;
  } else
    t17 = $[49];
  const filteredOptions = t17, filteredOptionsLen = filteredOptions.length, activeItemId = activeValue ? `${id2}-option-${activeValue}` : void 0, expanded = query !== null && loading || focused && query !== null;
  let t18;
  $[53] !== onBlur || $[54] !== onQueryChange || $[55] !== relatedElements ? (t18 = (event) => {
    setTimeout(() => {
      if (popoverMouseWithinRef.current)
        return;
      const elements = (relatedElements || []).concat(rootElementRef.current ? [rootElementRef.current] : [], resultsPopoverElementRef.current ? [resultsPopoverElementRef.current] : []);
      let focusInside = !1;
      if (document.activeElement) {
        for (const e of elements)
          if (e === document.activeElement || e.contains(document.activeElement)) {
            focusInside = !0;
            break;
          }
      }
      focusInside === !1 && (dispatch({
        type: "root/blur"
      }), popoverMouseWithinRef.current = !1, onQueryChange && onQueryChange(null), onBlur && onBlur(event));
    }, 0);
  }, $[53] = onBlur, $[54] = onQueryChange, $[55] = relatedElements, $[56] = t18) : t18 = $[56];
  const handleRootBlur = t18;
  let t19;
  $[57] === Symbol.for("react.memo_cache_sentinel") ? (t19 = (event_0) => {
    const listBoxElement = listBoxElementRef.current, focusedElement = event_0.target instanceof HTMLElement ? event_0.target : null, listFocused_0 = listBoxElement?.contains(focusedElement) || !1;
    listFocused_0 !== listFocusedRef.current && (listFocusedRef.current = listFocused_0, dispatch({
      type: "root/setListFocused",
      listFocused: listFocused_0
    }));
  }, $[57] = t19) : t19 = $[57];
  const handleRootFocus = t19;
  let t20;
  $[58] !== onChange || $[59] !== onQueryChange || $[60] !== onSelect ? (t20 = (v) => {
    dispatch({
      type: "value/change",
      value: v
    }), popoverMouseWithinRef.current = !1, onSelect && onSelect(v), valueRef.current = v, onChange && onChange(v), onQueryChange && onQueryChange(null), inputElementRef.current?.focus();
  }, $[58] = onChange, $[59] = onQueryChange, $[60] = onSelect, $[61] = t20) : t20 = $[61];
  const handleOptionSelect = t20;
  let t21;
  $[62] !== activeValue || $[63] !== filteredOptions || $[64] !== filteredOptionsLen || $[65] !== onQueryChange ? (t21 = (event_1) => {
    if (event_1.key === "ArrowDown") {
      if (event_1.preventDefault(), !filteredOptionsLen)
        return;
      const activeOption = filteredOptions.find((o_0) => o_0.value === activeValue), activeIndex = activeOption ? filteredOptions.indexOf(activeOption) : -1, nextActiveOption = filteredOptions[(activeIndex + 1) % filteredOptionsLen];
      nextActiveOption && dispatch({
        type: "root/setActiveValue",
        value: nextActiveOption.value,
        listFocused: !0
      });
      return;
    }
    if (event_1.key === "ArrowUp") {
      if (event_1.preventDefault(), !filteredOptionsLen)
        return;
      const activeOption_0 = filteredOptions.find((o_1) => o_1.value === activeValue), activeIndex_0 = activeOption_0 ? filteredOptions.indexOf(activeOption_0) : -1, nextActiveOption_0 = filteredOptions[activeIndex_0 === -1 ? filteredOptionsLen - 1 : (filteredOptionsLen + activeIndex_0 - 1) % filteredOptionsLen];
      nextActiveOption_0 && dispatch({
        type: "root/setActiveValue",
        value: nextActiveOption_0.value,
        listFocused: !0
      });
      return;
    }
    if (event_1.key === "Escape") {
      dispatch({
        type: "root/escape"
      }), popoverMouseWithinRef.current = !1, onQueryChange && onQueryChange(null), inputElementRef.current?.focus();
      return;
    }
    const target = event_1.target, listEl = listBoxElementRef.current;
    if ((listEl === target || listEl?.contains(target)) && !AUTOCOMPLETE_LISTBOX_IGNORE_KEYS.includes(event_1.key)) {
      inputElementRef.current?.focus();
      return;
    }
  }, $[62] = activeValue, $[63] = filteredOptions, $[64] = filteredOptionsLen, $[65] = onQueryChange, $[66] = t21) : t21 = $[66];
  const handleRootKeyDown = t21;
  let t22;
  $[67] !== onQueryChange ? (t22 = (event_2) => {
    const nextQuery = event_2.currentTarget.value;
    dispatch({
      type: "input/change",
      query: nextQuery
    }), onQueryChange && onQueryChange(nextQuery);
  }, $[67] = onQueryChange, $[68] = t22) : t22 = $[68];
  const handleInputChange = t22;
  let t23;
  $[69] !== currentOption || $[70] !== renderValue || $[71] !== value ? (t23 = () => {
    dispatch({
      type: "root/open",
      query: value ? renderValue(value, currentOption) : ""
    });
  }, $[69] = currentOption, $[70] = renderValue, $[71] = value, $[72] = t23) : t23 = $[72];
  const dispatchOpen = t23;
  let t24;
  $[73] !== dispatchOpen || $[74] !== focused || $[75] !== onFocus || $[76] !== openOnFocus ? (t24 = (event_3) => {
    focused || (dispatch({
      type: "input/focus"
    }), onFocus && onFocus(event_3), openOnFocus && dispatchOpen());
  }, $[73] = dispatchOpen, $[74] = focused, $[75] = onFocus, $[76] = openOnFocus, $[77] = t24) : t24 = $[77];
  const handleInputFocus = t24;
  let t25;
  $[78] === Symbol.for("react.memo_cache_sentinel") ? (t25 = () => {
    popoverMouseWithinRef.current = !0;
  }, $[78] = t25) : t25 = $[78];
  const handlePopoverMouseEnter = t25;
  let t26;
  $[79] === Symbol.for("react.memo_cache_sentinel") ? (t26 = () => {
    popoverMouseWithinRef.current = !1;
  }, $[79] = t26) : t26 = $[79];
  const handlePopoverMouseLeave = t26;
  let t27;
  $[80] !== onChange || $[81] !== onQueryChange ? (t27 = () => {
    dispatch({
      type: "root/clear"
    }), valueRef.current = "", onChange && onChange(""), onQueryChange && onQueryChange(null), inputElementRef.current?.focus();
  }, $[80] = onChange, $[81] = onQueryChange, $[82] = t27) : t27 = $[82];
  const handleClearButtonClick = t27;
  let t28;
  $[83] === Symbol.for("react.memo_cache_sentinel") ? (t28 = () => {
    dispatch({
      type: "input/focus"
    });
  }, $[83] = t28) : t28 = $[83];
  const handleClearButtonFocus = t28;
  let t29, t30;
  $[84] !== valueProp ? (t29 = () => {
    if (valueProp !== valuePropRef.current) {
      valuePropRef.current = valueProp, valueProp !== void 0 && (dispatch({
        type: "value/change",
        value: valueProp
      }), valueRef.current = valueProp);
      return;
    }
    valueProp !== valueRef.current && (valueRef.current = valueProp || null, dispatch({
      type: "value/change",
      value: valueProp || null
    }));
  }, t30 = [valueProp], $[84] = valueProp, $[85] = t29, $[86] = t30) : (t29 = $[85], t30 = $[86]), useEffect(t29, t30);
  let t31, t32;
  $[87] !== focused ? (t31 = () => {
    !focused && valueRef.current && dispatch({
      type: "root/setActiveValue",
      value: valueRef.current
    });
  }, t32 = [focused], $[87] = focused, $[88] = t31, $[89] = t32) : (t31 = $[88], t32 = $[89]), useEffect(t31, t32);
  let t33, t34;
  $[90] !== activeValue || $[91] !== filteredOptions ? (t33 = () => {
    const listElement = listBoxElementRef.current;
    if (!listElement)
      return;
    const activeOption_1 = filteredOptions.find((o_2) => o_2.value === activeValue);
    if (activeOption_1) {
      const activeIndex_1 = filteredOptions.indexOf(activeOption_1), activeItemElement = listElement.childNodes[activeIndex_1];
      if (activeItemElement) {
        if (_hasFocus(activeItemElement))
          return;
        focusFirstDescendant(activeItemElement);
      }
    }
  }, t34 = [activeValue, filteredOptions], $[90] = activeValue, $[91] = filteredOptions, $[92] = t33, $[93] = t34) : (t33 = $[92], t34 = $[93]), useEffect(t33, t34);
  let t35;
  bb0: {
    if (!loading && !disabled && value) {
      let t362;
      $[94] === Symbol.for("react.memo_cache_sentinel") ? (t362 = {
        "aria-label": "Clear",
        onFocus: handleClearButtonFocus
      }, $[94] = t362) : t362 = $[94], t35 = t362;
      break bb0;
    }
    t35 = void 0;
  }
  const clearButton = t35, openButtonBoxPadding = padding.map(_temp$3), openButtonPadding = padding.map(_temp2$1), openButtonProps = typeof openButton == "object" ? openButton : EMPTY_RECORD;
  let t36;
  $[95] !== dispatchOpen || $[96] !== openButtonProps ? (t36 = (event_4) => {
    dispatchOpen(), openButtonProps.onClick && openButtonProps.onClick(event_4), _raf(() => inputElementRef.current?.focus());
  }, $[95] = dispatchOpen, $[96] = openButtonProps, $[97] = t36) : t36 = $[97];
  const handleOpenClick = t36;
  let t37;
  $[98] !== disabled || $[99] !== expanded || $[100] !== fontSize2 || $[101] !== handleOpenClick || $[102] !== openButton || $[103] !== openButtonBoxPadding || $[104] !== openButtonPadding || $[105] !== openButtonProps || $[106] !== readOnly ? (t37 = !disabled && !readOnly && openButton ? /* @__PURE__ */ jsx(Box, { "aria-hidden": expanded, padding: openButtonBoxPadding, children: /* @__PURE__ */ jsx(Button, { "aria-label": "Open", disabled: expanded, fontSize: fontSize2, icon: ChevronDownIcon, mode: "bleed", padding: openButtonPadding, ...openButtonProps, onClick: handleOpenClick }) }) : void 0, $[98] = disabled, $[99] = expanded, $[100] = fontSize2, $[101] = handleOpenClick, $[102] = openButton, $[103] = openButtonBoxPadding, $[104] = openButtonPadding, $[105] = openButtonProps, $[106] = readOnly, $[107] = t37) : t37 = $[107];
  const openButtonNode = t37;
  let t38;
  bb1: {
    if (query === null) {
      if (value !== null) {
        let t392;
        $[108] !== currentOption || $[109] !== renderValue || $[110] !== value ? (t392 = renderValue(value, currentOption), $[108] = currentOption, $[109] = renderValue, $[110] = value, $[111] = t392) : t392 = $[111], t38 = t392;
        break bb1;
      }
      t38 = "";
      break bb1;
    }
    t38 = query;
  }
  const inputValue = t38;
  let t39;
  $[112] !== listFocused ? (t39 = (event_5) => {
    event_5.key === "Tab" && listFocused && inputElementRef.current?.focus();
  }, $[112] = listFocused, $[113] = t39) : t39 = $[113];
  const handleListBoxKeyDown = t39;
  let t40;
  bb2: {
    if (filteredOptions.length === 0) {
      t40 = null;
      break bb2;
    }
    let t412;
    if ($[114] !== activeValue || $[115] !== currentOption || $[116] !== filteredOptions || $[117] !== handleOptionSelect || $[118] !== id2 || $[119] !== listFocused || $[120] !== loading || $[121] !== renderOption) {
      let t423;
      $[123] !== activeValue || $[124] !== currentOption || $[125] !== handleOptionSelect || $[126] !== id2 || $[127] !== listFocused || $[128] !== loading || $[129] !== renderOption ? (t423 = (option_0) => {
        const active = activeValue !== null ? option_0.value === activeValue : currentOption === option_0;
        return /* @__PURE__ */ jsx(AutocompleteOption, { id: `${id2}-option-${option_0.value}`, onSelect: handleOptionSelect, selected: active, value: option_0.value, children: cloneElement(renderOption(option_0), {
          disabled: loading,
          selected: active,
          tabIndex: listFocused && active ? 0 : -1
        }) }, option_0.value);
      }, $[123] = activeValue, $[124] = currentOption, $[125] = handleOptionSelect, $[126] = id2, $[127] = listFocused, $[128] = loading, $[129] = renderOption, $[130] = t423) : t423 = $[130], t412 = filteredOptions.map(t423), $[114] = activeValue, $[115] = currentOption, $[116] = filteredOptions, $[117] = handleOptionSelect, $[118] = id2, $[119] = listFocused, $[120] = loading, $[121] = renderOption, $[122] = t412;
    } else
      t412 = $[122];
    let t422;
    $[131] !== listBoxId || $[132] !== t412 ? (t422 = /* @__PURE__ */ jsx(Stack, { as: "ul", "aria-multiselectable": !1, "data-ui": "AutoComplete__resultsList", id: listBoxId, ref: listBoxElementRef, role: "listbox", space: 1, children: t412 }), $[131] = listBoxId, $[132] = t412, $[133] = t422) : t422 = $[133];
    let t432;
    $[134] !== handleListBoxKeyDown || $[135] !== listBox || $[136] !== t422 ? (t432 = /* @__PURE__ */ jsx(ListBox, { "data-ui": "AutoComplete__results", onKeyDown: handleListBoxKeyDown, padding: 1, ...listBox, tabIndex: -1, children: t422 }), $[134] = handleListBoxKeyDown, $[135] = listBox, $[136] = t422, $[137] = t432) : t432 = $[137], t40 = t432;
  }
  const content2 = t40;
  let t41;
  bb3: {
    if (renderPopover) {
      const t423 = !expanded;
      let t432;
      $[138] !== content2 || $[139] !== handlePopoverMouseEnter || $[140] !== handlePopoverMouseLeave || $[141] !== inputElement || $[142] !== renderPopover || $[143] !== t423 ? (t432 = /* @__PURE__ */ jsx(RenderPopover, { content: content2, hidden: t423, inputElement, onMouseEnter: handlePopoverMouseEnter, onMouseLeave: handlePopoverMouseLeave, resultsPopoverElementRef, renderPopover }), $[138] = content2, $[139] = handlePopoverMouseEnter, $[140] = handlePopoverMouseLeave, $[141] = inputElement, $[142] = renderPopover, $[143] = t423, $[144] = t432) : t432 = $[144], t41 = t432;
      break bb3;
    }
    if (filteredOptionsLen === 0) {
      t41 = null;
      break bb3;
    }
    let t422;
    $[145] !== content2 || $[146] !== expanded || $[147] !== handlePopoverMouseEnter || $[148] !== handlePopoverMouseLeave || $[149] !== inputElement || $[150] !== popover || $[151] !== radius ? (t422 = /* @__PURE__ */ jsx(Popover, { arrow: !1, constrainSize: !0, content: content2, fallbackPlacements: AUTOCOMPLETE_POPOVER_FALLBACK_PLACEMENTS, matchReferenceWidth: !0, onMouseEnter: handlePopoverMouseEnter, onMouseLeave: handlePopoverMouseLeave, open: expanded, overflow: "auto", placement: AUTOCOMPLETE_POPOVER_PLACEMENT, portal: !0, radius, ref: resultsPopoverElementRef, referenceElement: inputElement, ...popover }), $[145] = content2, $[146] = expanded, $[147] = handlePopoverMouseEnter, $[148] = handlePopoverMouseLeave, $[149] = inputElement, $[150] = popover, $[151] = radius, $[152] = t422) : t422 = $[152], t41 = t422;
  }
  const results = t41, t42 = loading && AnimatedSpinnerIcon, t43 = suffix || openButtonNode;
  let t44;
  $[153] !== activeItemId || $[154] !== border2 || $[155] !== clearButton || $[156] !== customValidity || $[157] !== disabled || $[158] !== expanded || $[159] !== fontSize2 || $[160] !== handleClearButtonClick || $[161] !== handleInputChange || $[162] !== handleInputFocus || $[163] !== icon || $[164] !== id2 || $[165] !== inputValue || $[166] !== listBoxId || $[167] !== padding || $[168] !== prefix || $[169] !== radius || $[170] !== readOnly || $[171] !== restProps || $[172] !== t42 || $[173] !== t43 ? (t44 = /* @__PURE__ */ jsx(TextInput, { ...restProps, "aria-activedescendant": activeItemId, "aria-autocomplete": "list", "aria-expanded": expanded, "aria-owns": listBoxId, autoCapitalize: "off", autoComplete: "off", autoCorrect: "off", border: border2, clearButton, customValidity, disabled, fontSize: fontSize2, icon, iconRight: t42, id: id2, inputMode: "search", onChange: handleInputChange, onClear: handleClearButtonClick, onFocus: handleInputFocus, padding, prefix, radius, readOnly, ref: setInputElement, role: "combobox", spellCheck: !1, suffix: t43, value: inputValue }), $[153] = activeItemId, $[154] = border2, $[155] = clearButton, $[156] = customValidity, $[157] = disabled, $[158] = expanded, $[159] = fontSize2, $[160] = handleClearButtonClick, $[161] = handleInputChange, $[162] = handleInputFocus, $[163] = icon, $[164] = id2, $[165] = inputValue, $[166] = listBoxId, $[167] = padding, $[168] = prefix, $[169] = radius, $[170] = readOnly, $[171] = restProps, $[172] = t42, $[173] = t43, $[174] = t44) : t44 = $[174];
  let t45;
  return $[175] !== handleRootBlur || $[176] !== handleRootFocus || $[177] !== handleRootKeyDown || $[178] !== results || $[179] !== t44 ? (t45 = /* @__PURE__ */ jsxs(StyledAutocomplete, { "data-ui": "Autocomplete", onBlur: handleRootBlur, onFocus: handleRootFocus, onKeyDown: handleRootKeyDown, ref: rootElementRef, children: [
    t44,
    results
  ] }), $[175] = handleRootBlur, $[176] = handleRootFocus, $[177] = handleRootKeyDown, $[178] = results, $[179] = t44, $[180] = t45) : t45 = $[180], t45;
});
function RenderPopover({
  renderPopover,
  content: content2,
  hidden,
  inputElement,
  onMouseEnter,
  onMouseLeave,
  resultsPopoverElementRef
}) {
  return renderPopover({
    content: content2,
    hidden,
    inputElement,
    onMouseEnter,
    onMouseLeave
  }, resultsPopoverElementRef);
}
InnerAutocomplete.displayName = "ForwardRef(Autocomplete)";
function _temp$3(v_0) {
  return v_0 === 0 ? 0 : v_0 === 1 || v_0 === 2 ? 1 : v_0 - 2;
}
function _temp2$1(v_1) {
  return Math.max(v_1 - 1, 0);
}
const StyledBreadcrumbs = styled.ol.withConfig({
  displayName: "StyledBreadcrumbs",
  componentId: "sc-1es8h8q-0"
})`margin:0;padding:0;display:flex;list-style:none;align-items:center;white-space:nowrap;line-height:0;`, ExpandButton = styled(Button).withConfig({
  displayName: "ExpandButton",
  componentId: "sc-1es8h8q-1"
})`appearance:none;margin:-4px;`, Breadcrumbs = forwardRef(function(props, ref) {
  const $ = distExports.c(29);
  let children, maxLength, restProps, separator, t0;
  $[0] !== props ? ({
    children,
    maxLength,
    separator,
    space: t0,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = maxLength, $[3] = restProps, $[4] = separator, $[5] = t0) : (children = $[1], maxLength = $[2], restProps = $[3], separator = $[4], t0 = $[5]);
  const spaceRaw = t0 === void 0 ? 2 : t0;
  let t1;
  $[6] !== spaceRaw ? (t1 = _getArrayProp(spaceRaw), $[6] = spaceRaw, $[7] = t1) : t1 = $[7];
  const space = t1, [open, setOpen] = useState(!1), expandElementRef = useRef(null), popoverElementRef = useRef(null);
  let t2;
  $[8] === Symbol.for("react.memo_cache_sentinel") ? (t2 = () => setOpen(!1), $[8] = t2) : t2 = $[8];
  const collapse = t2;
  let t3;
  $[9] === Symbol.for("react.memo_cache_sentinel") ? (t3 = () => setOpen(!0), $[9] = t3) : t3 = $[9];
  const expand = t3;
  let t4;
  $[10] === Symbol.for("react.memo_cache_sentinel") ? (t4 = () => [expandElementRef.current, popoverElementRef.current], $[10] = t4) : t4 = $[10], useClickOutsideEvent(collapse, t4);
  let t5;
  $[11] !== children ? (t5 = Children.toArray(children).filter(isValidElement), $[11] = children, $[12] = t5) : t5 = $[12];
  const rawItems = t5;
  let t6;
  $[13] !== maxLength || $[14] !== open || $[15] !== rawItems || $[16] !== space ? (t6 = {
    collapse,
    expand,
    expandElementRef,
    maxLength,
    open,
    popoverElementRef,
    rawItems,
    space
  }, $[13] = maxLength, $[14] = open, $[15] = rawItems, $[16] = space, $[17] = t6) : t6 = $[17];
  const items = useItems(t6);
  let t7;
  if ($[18] !== items || $[19] !== separator || $[20] !== space) {
    let t82;
    $[22] !== separator || $[23] !== space ? (t82 = (item, itemIndex) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
      itemIndex > 0 && /* @__PURE__ */ jsx(Box, { "aria-hidden": !0, as: "li", paddingX: space, children: separator || /* @__PURE__ */ jsx(Text, { muted: !0, children: "/" }) }),
      /* @__PURE__ */ jsx(Box, { as: "li", children: item })
    ] }, itemIndex), $[22] = separator, $[23] = space, $[24] = t82) : t82 = $[24], t7 = items.map(t82), $[18] = items, $[19] = separator, $[20] = space, $[21] = t7;
  } else
    t7 = $[21];
  let t8;
  return $[25] !== ref || $[26] !== restProps || $[27] !== t7 ? (t8 = /* @__PURE__ */ jsx(StyledBreadcrumbs, { "data-ui": "Breadcrumbs", ...restProps, ref, children: t7 }), $[25] = ref, $[26] = restProps, $[27] = t7, $[28] = t8) : t8 = $[28], t8;
});
Breadcrumbs.displayName = "ForwardRef(Breadcrumbs)";
function useItems(t0) {
  const $ = distExports.c(28), {
    collapse,
    expand,
    expandElementRef,
    maxLength,
    open,
    popoverElementRef,
    rawItems,
    space
  } = t0, len = rawItems.length;
  if (maxLength && len > maxLength) {
    const beforeLength = Math.ceil(maxLength / 2), afterLength = Math.floor(maxLength / 2);
    let t1;
    if ($[0] !== afterLength || $[1] !== beforeLength || $[2] !== collapse || $[3] !== expand || $[4] !== expandElementRef || $[5] !== len || $[6] !== open || $[7] !== popoverElementRef || $[8] !== rawItems || $[9] !== space) {
      const t2 = rawItems.slice(0, beforeLength - 1);
      let t3;
      $[11] !== afterLength || $[12] !== beforeLength || $[13] !== len || $[14] !== rawItems ? (t3 = rawItems.slice(beforeLength - 1, len - afterLength), $[11] = afterLength, $[12] = beforeLength, $[13] = len, $[14] = rawItems, $[15] = t3) : t3 = $[15];
      let t4;
      $[16] !== space || $[17] !== t3 ? (t4 = /* @__PURE__ */ jsx(Stack, { as: "ol", overflow: "auto", padding: space, space, children: t3 }), $[16] = space, $[17] = t3, $[18] = t4) : t4 = $[18];
      const t5 = open ? collapse : expand;
      let t6;
      $[19] !== expandElementRef || $[20] !== open || $[21] !== t5 ? (t6 = /* @__PURE__ */ jsx(ExpandButton, { fontSize: 1, mode: "bleed", onClick: t5, padding: 1, ref: expandElementRef, selected: open, text: "\u2026" }), $[19] = expandElementRef, $[20] = open, $[21] = t5, $[22] = t6) : t6 = $[22];
      let t7;
      $[23] !== open || $[24] !== popoverElementRef || $[25] !== t4 || $[26] !== t6 ? (t7 = /* @__PURE__ */ jsx(Popover, { constrainSize: !0, content: t4, open, placement: "top", portal: !0, ref: popoverElementRef, children: t6 }, "button"), $[23] = open, $[24] = popoverElementRef, $[25] = t4, $[26] = t6, $[27] = t7) : t7 = $[27], t1 = [...t2, t7, ...rawItems.slice(len - afterLength)], $[0] = afterLength, $[1] = beforeLength, $[2] = collapse, $[3] = expand, $[4] = expandElementRef, $[5] = len, $[6] = open, $[7] = popoverElementRef, $[8] = rawItems, $[9] = space, $[10] = t1;
    } else
      t1 = $[10];
    return t1;
  }
  return rawItems;
}
function dialogStyle({
  theme
}) {
  const {
    color: color2
  } = getTheme_v2(theme);
  return {
    "&:not([hidden])": {
      display: "flex"
    },
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    background: color2.backdrop
  };
}
function responsiveDialogPositionStyle(props) {
  const {
    media
  } = getTheme_v2(props.theme);
  return _responsive(media, props.$position, (position) => ({
    "&&": {
      position
    }
  }));
}
function animationDialogStyle(props) {
  return props.$animate ? css`
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    animation: fadeIn 200ms ease-out;
    // Animates the dialog card.
    & > [data-ui='DialogCard'] {
      animation: zoomIn 200ms ease-out;
    }
  ` : css``;
}
const DialogContext = createGlobalScopedContext("@sanity/ui/context/dialog", {
  version: 0
});
function useDialog() {
  return useContext(DialogContext);
}
function isTargetWithinScope(boundaryElement, portalElement, target) {
  return !boundaryElement || !portalElement ? !0 : containsOrEqualsElement(boundaryElement, target) || containsOrEqualsElement(portalElement, target);
}
const StyledDialog = /* @__PURE__ */ styled(Layer).withConfig({
  displayName: "StyledDialog",
  componentId: "sc-4n4xb3-0"
})(responsivePaddingStyle, dialogStyle, responsiveDialogPositionStyle, animationDialogStyle), DialogContainer = styled(Container).withConfig({
  displayName: "DialogContainer",
  componentId: "sc-4n4xb3-1"
})`&:not([hidden]){display:flex;}width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;`, DialogCardRoot = styled(Card).withConfig({
  displayName: "DialogCardRoot",
  componentId: "sc-4n4xb3-2"
})`&:not([hidden]){display:flex;}width:100%;min-height:0;max-height:100%;overflow:hidden;overflow:clip;`, DialogLayout = styled(Flex).withConfig({
  displayName: "DialogLayout",
  componentId: "sc-4n4xb3-3"
})`flex:1;min-height:0;width:100%;`, DialogHeader = styled(Box).withConfig({
  displayName: "DialogHeader",
  componentId: "sc-4n4xb3-4"
})`position:relative;z-index:2;`, DialogContent = styled(Box).withConfig({
  displayName: "DialogContent",
  componentId: "sc-4n4xb3-5"
})`position:relative;z-index:1;overflow:auto;outline:none;`, DialogFooter = styled(Box).withConfig({
  displayName: "DialogFooter",
  componentId: "sc-4n4xb3-6"
})`position:relative;z-index:3;`, DialogCard = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(44), {
    __unstable_autoFocus: autoFocus,
    __unstable_hideCloseButton: hideCloseButton,
    children,
    contentRef: forwardedContentRef,
    footer,
    header,
    id: id2,
    onClickOutside,
    onClose,
    portal: portalProp,
    radius: radiusProp,
    scheme,
    shadow: shadowProp,
    width: widthProp
  } = props, portal = usePortal(), portalElement = portalProp ? portal.elements?.[portalProp] || null : portal.element, boundaryElement = useBoundaryElement().element;
  let t0;
  $[0] !== radiusProp ? (t0 = _getArrayProp(radiusProp), $[0] = radiusProp, $[1] = t0) : t0 = $[1];
  const radius = t0;
  let t1;
  $[2] !== shadowProp ? (t1 = _getArrayProp(shadowProp), $[2] = shadowProp, $[3] = t1) : t1 = $[3];
  const shadow = t1;
  let t2;
  $[4] !== widthProp ? (t2 = _getArrayProp(widthProp), $[4] = widthProp, $[5] = t2) : t2 = $[5];
  const width = t2, ref = useRef(null), contentRef = useRef(null), layer = useLayer(), {
    isTopLayer: isTopLayer2
  } = layer, labelId = `${id2}_label`, showCloseButton = !!onClose && hideCloseButton === !1, showHeader = !!header || showCloseButton;
  let t3;
  $[6] === Symbol.for("react.memo_cache_sentinel") ? (t3 = () => ref.current, $[6] = t3) : t3 = $[6], useImperativeHandle(forwardedRef, t3);
  let t4;
  $[7] === Symbol.for("react.memo_cache_sentinel") ? (t4 = () => contentRef.current, $[7] = t4) : t4 = $[7], useImperativeHandle(forwardedContentRef, t4);
  let t5, t6;
  $[8] !== autoFocus ? (t5 = () => {
    autoFocus && ref.current && focusFirstDescendant(ref.current);
  }, t6 = [autoFocus, ref], $[8] = autoFocus, $[9] = t5, $[10] = t6) : (t5 = $[9], t6 = $[10]), useEffect(t5, t6);
  let t7;
  $[11] !== boundaryElement || $[12] !== isTopLayer2 || $[13] !== onClose || $[14] !== portalElement ? (t7 = (event) => {
    if (!isTopLayer2 || !onClose)
      return;
    const target = document.activeElement;
    target && !isTargetWithinScope(boundaryElement, portalElement, target) || event.key === "Escape" && (event.preventDefault(), event.stopPropagation(), onClose());
  }, $[11] = boundaryElement, $[12] = isTopLayer2, $[13] = onClose, $[14] = portalElement, $[15] = t7) : t7 = $[15], useGlobalKeyDown(t7);
  let t8;
  $[16] !== boundaryElement || $[17] !== isTopLayer2 || $[18] !== onClickOutside || $[19] !== portalElement ? (t8 = isTopLayer2 && onClickOutside && ((event_0) => {
    const target_0 = event_0.target;
    target_0 && !isTargetWithinScope(boundaryElement, portalElement, target_0) || onClickOutside();
  }), $[16] = boundaryElement, $[17] = isTopLayer2, $[18] = onClickOutside, $[19] = portalElement, $[20] = t8) : t8 = $[20];
  let t9;
  $[21] === Symbol.for("react.memo_cache_sentinel") ? (t9 = () => [ref.current], $[21] = t9) : t9 = $[21], useClickOutsideEvent(t8, t9);
  let t10;
  $[22] !== header || $[23] !== labelId || $[24] !== onClose || $[25] !== showCloseButton || $[26] !== showHeader ? (t10 = showHeader && /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(Flex, { align: "flex-start", padding: 3, children: [
    /* @__PURE__ */ jsx(Box, { flex: 1, padding: 2, children: header && /* @__PURE__ */ jsx(Text, { id: labelId, size: 1, weight: "semibold", children: header }) }),
    showCloseButton && /* @__PURE__ */ jsx(Box, { flex: "none", children: /* @__PURE__ */ jsx(Button, { "aria-label": "Close dialog", disabled: !onClose, icon: CloseIcon, mode: "bleed", onClick: onClose, padding: 2 }) })
  ] }) }), $[22] = header, $[23] = labelId, $[24] = onClose, $[25] = showCloseButton, $[26] = showHeader, $[27] = t10) : t10 = $[27];
  let t11;
  $[28] !== children ? (t11 = /* @__PURE__ */ jsx(DialogContent, { flex: 1, ref: contentRef, tabIndex: -1, children }), $[28] = children, $[29] = t11) : t11 = $[29];
  let t12;
  $[30] !== footer ? (t12 = footer && /* @__PURE__ */ jsx(DialogFooter, { children: footer }), $[30] = footer, $[31] = t12) : t12 = $[31];
  let t13;
  $[32] !== t10 || $[33] !== t11 || $[34] !== t12 ? (t13 = /* @__PURE__ */ jsxs(DialogLayout, { direction: "column", children: [
    t10,
    t11,
    t12
  ] }), $[32] = t10, $[33] = t11, $[34] = t12, $[35] = t13) : t13 = $[35];
  let t14;
  $[36] !== radius || $[37] !== scheme || $[38] !== shadow || $[39] !== t13 ? (t14 = /* @__PURE__ */ jsx(DialogCardRoot, { radius, ref, scheme, shadow, children: t13 }), $[36] = radius, $[37] = scheme, $[38] = shadow, $[39] = t13, $[40] = t14) : t14 = $[40];
  let t15;
  return $[41] !== t14 || $[42] !== width ? (t15 = /* @__PURE__ */ jsx(DialogContainer, { "data-ui": "DialogCard", width, children: t14 }), $[41] = t14, $[42] = width, $[43] = t15) : t15 = $[43], t15;
});
DialogCard.displayName = "ForwardRef(DialogCard)";
const Dialog = forwardRef(function(props, ref) {
  const $ = distExports.c(70), dialog = useDialog(), {
    layer
  } = useTheme_v2();
  let _positionProp, _zOffsetProp, children, contentRef, footer, header, id2, onActivate, onClickOutside, onClose, onFocus, portalProp, restProps, scheme, t0, t1, t2, t3, t4, t5, t6;
  $[0] !== props ? ({
    __unstable_autoFocus: t0,
    __unstable_hideCloseButton: t1,
    cardRadius: t2,
    cardShadow: t3,
    children,
    contentRef,
    footer,
    header,
    id: id2,
    onActivate,
    onClickOutside,
    onClose,
    onFocus,
    padding: t4,
    portal: portalProp,
    position: _positionProp,
    scheme,
    width: t5,
    zOffset: _zOffsetProp,
    animate: t6,
    ...restProps
  } = props, $[0] = props, $[1] = _positionProp, $[2] = _zOffsetProp, $[3] = children, $[4] = contentRef, $[5] = footer, $[6] = header, $[7] = id2, $[8] = onActivate, $[9] = onClickOutside, $[10] = onClose, $[11] = onFocus, $[12] = portalProp, $[13] = restProps, $[14] = scheme, $[15] = t0, $[16] = t1, $[17] = t2, $[18] = t3, $[19] = t4, $[20] = t5, $[21] = t6) : (_positionProp = $[1], _zOffsetProp = $[2], children = $[3], contentRef = $[4], footer = $[5], header = $[6], id2 = $[7], onActivate = $[8], onClickOutside = $[9], onClose = $[10], onFocus = $[11], portalProp = $[12], restProps = $[13], scheme = $[14], t0 = $[15], t1 = $[16], t2 = $[17], t3 = $[18], t4 = $[19], t5 = $[20], t6 = $[21]);
  const autoFocus = t0 === void 0 ? !0 : t0, hideCloseButton = t1 === void 0 ? !1 : t1, cardRadiusProp = t2 === void 0 ? 4 : t2, cardShadow = t3 === void 0 ? 3 : t3, paddingProp = t4 === void 0 ? 3 : t4, widthProp = t5 === void 0 ? 0 : t5, _animate = t6 === void 0 ? !1 : t6, positionProp = _positionProp ?? (dialog.position || "fixed"), zOffsetProp = _zOffsetProp ?? (dialog.zOffset || layer.dialog.zOffset), animate = usePrefersReducedMotion() ? !1 : _animate, portal = usePortal(), portalElement = portalProp ? portal.elements?.[portalProp] || null : portal.element, boundaryElement = useBoundaryElement().element;
  let t7;
  $[22] !== cardRadiusProp ? (t7 = _getArrayProp(cardRadiusProp), $[22] = cardRadiusProp, $[23] = t7) : t7 = $[23];
  const cardRadius = t7;
  let t8;
  $[24] !== paddingProp ? (t8 = _getArrayProp(paddingProp), $[24] = paddingProp, $[25] = t8) : t8 = $[25];
  const padding = t8;
  let t9;
  $[26] !== positionProp ? (t9 = _getArrayProp(positionProp), $[26] = positionProp, $[27] = t9) : t9 = $[27];
  const position = t9;
  let t10;
  $[28] !== widthProp ? (t10 = _getArrayProp(widthProp), $[28] = widthProp, $[29] = t10) : t10 = $[29];
  const width = t10;
  let t11;
  $[30] !== zOffsetProp ? (t11 = _getArrayProp(zOffsetProp), $[30] = zOffsetProp, $[31] = t11) : t11 = $[31];
  const zOffset = t11, preDivRef = useRef(null), postDivRef = useRef(null), cardRef = useRef(null), focusedElementRef = useRef(null);
  let t12;
  $[32] !== onFocus ? (t12 = (event) => {
    onFocus?.(event);
    const target = event.target, cardElement = cardRef.current;
    if (cardElement && target === preDivRef.current) {
      focusLastDescendant(cardElement);
      return;
    }
    if (cardElement && target === postDivRef.current) {
      focusFirstDescendant(cardElement);
      return;
    }
    isHTMLElement(event.target) && (focusedElementRef.current = event.target);
  }, $[32] = onFocus, $[33] = t12) : t12 = $[33];
  const handleFocus = t12, labelId = `${id2}_label`, rootClickTimeoutRef = useRef(void 0);
  let t13;
  $[34] !== boundaryElement || $[35] !== portalElement ? (t13 = () => {
    rootClickTimeoutRef.current && clearTimeout(rootClickTimeoutRef.current), rootClickTimeoutRef.current = setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && !isTargetWithinScope(boundaryElement, portalElement, activeElement)) {
        const target_0 = focusedElementRef.current;
        if (!target_0 || !document.body.contains(target_0)) {
          const cardElement_0 = cardRef.current;
          cardElement_0 && focusFirstDescendant(cardElement_0);
          return;
        }
        target_0.focus();
      }
    }, 0);
  }, $[34] = boundaryElement, $[35] = portalElement, $[36] = t13) : t13 = $[36];
  const handleRootClick = t13;
  let t14;
  $[37] === Symbol.for("react.memo_cache_sentinel") ? (t14 = /* @__PURE__ */ jsx("div", { ref: preDivRef, tabIndex: 0 }), $[37] = t14) : t14 = $[37];
  let t15;
  $[38] !== autoFocus || $[39] !== cardRadius || $[40] !== cardShadow || $[41] !== children || $[42] !== contentRef || $[43] !== footer || $[44] !== header || $[45] !== hideCloseButton || $[46] !== id2 || $[47] !== onClickOutside || $[48] !== onClose || $[49] !== portalProp || $[50] !== scheme || $[51] !== width ? (t15 = /* @__PURE__ */ jsx(DialogCard, { __unstable_autoFocus: autoFocus, __unstable_hideCloseButton: hideCloseButton, contentRef, footer, header, id: id2, onClickOutside, onClose, portal: portalProp, radius: cardRadius, ref: cardRef, scheme, shadow: cardShadow, width, children }), $[38] = autoFocus, $[39] = cardRadius, $[40] = cardShadow, $[41] = children, $[42] = contentRef, $[43] = footer, $[44] = header, $[45] = hideCloseButton, $[46] = id2, $[47] = onClickOutside, $[48] = onClose, $[49] = portalProp, $[50] = scheme, $[51] = width, $[52] = t15) : t15 = $[52];
  let t16;
  $[53] === Symbol.for("react.memo_cache_sentinel") ? (t16 = /* @__PURE__ */ jsx("div", { ref: postDivRef, tabIndex: 0 }), $[53] = t16) : t16 = $[53];
  let t17;
  $[54] !== animate || $[55] !== handleFocus || $[56] !== handleRootClick || $[57] !== id2 || $[58] !== labelId || $[59] !== onActivate || $[60] !== padding || $[61] !== position || $[62] !== ref || $[63] !== restProps || $[64] !== t15 || $[65] !== zOffset ? (t17 = /* @__PURE__ */ jsxs(StyledDialog, { ...restProps, $animate: animate, $padding: padding, $position: position, "aria-labelledby": labelId, "aria-modal": !0, "data-ui": "Dialog", id: id2, onActivate, onClick: handleRootClick, onFocus: handleFocus, ref, role: "dialog", zOffset, children: [
    t14,
    t15,
    t16
  ] }), $[54] = animate, $[55] = handleFocus, $[56] = handleRootClick, $[57] = id2, $[58] = labelId, $[59] = onActivate, $[60] = padding, $[61] = position, $[62] = ref, $[63] = restProps, $[64] = t15, $[65] = zOffset, $[66] = t17) : t17 = $[66];
  let t18;
  return $[67] !== portalProp || $[68] !== t17 ? (t18 = /* @__PURE__ */ jsx(Portal, { __unstable_name: portalProp, children: t17 }), $[67] = portalProp, $[68] = t17, $[69] = t18) : t18 = $[69], t18;
});
Dialog.displayName = "ForwardRef(Dialog)";
const MenuButton = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(62), {
    __unstable_disableRestoreFocusOnClose: t0,
    boundaryElement: deprecated_boundaryElement,
    button: buttonProp,
    id: id2,
    menu: menuProp,
    onClose,
    onOpen,
    placement: deprecated_placement,
    popoverScheme: deprecated_popoverScheme,
    portal: t1,
    popover,
    popoverRadius: deprecated_popoverRadius,
    preventOverflow: deprecated_preventOverflow
  } = props, disableRestoreFocusOnClose = t0 === void 0 ? !1 : t0, deprecated_portal = t1 === void 0 ? !0 : t1, [open, setOpen] = useState(!1), [shouldFocus, setShouldFocus] = useState(null), [buttonElement, setButtonElement] = useState(null);
  let t2;
  $[0] === Symbol.for("react.memo_cache_sentinel") ? (t2 = [], $[0] = t2) : t2 = $[0];
  const [menuElements, setChildMenuElements] = useState(t2), openRef = useRef(open);
  let t3, t4;
  $[1] !== onOpen || $[2] !== open ? (t3 = () => {
    onOpen && open && !openRef.current && onOpen();
  }, t4 = [onOpen, open], $[1] = onOpen, $[2] = open, $[3] = t3, $[4] = t4) : (t3 = $[3], t4 = $[4]), useEffect(t3, t4);
  let t5, t6;
  $[5] !== onClose || $[6] !== open ? (t5 = () => {
    onClose && !open && openRef.current && onClose();
  }, t6 = [onClose, open], $[5] = onClose, $[6] = open, $[7] = t5, $[8] = t6) : (t5 = $[7], t6 = $[8]), useEffect(t5, t6);
  let t7, t8;
  $[9] !== open ? (t7 = () => {
    openRef.current = open;
  }, t8 = [open], $[9] = open, $[10] = t7, $[11] = t8) : (t7 = $[10], t8 = $[11]), useEffect(t7, t8);
  let t9;
  $[12] === Symbol.for("react.memo_cache_sentinel") ? (t9 = () => {
    setOpen(_temp$2), setShouldFocus(null);
  }, $[12] = t9) : t9 = $[12];
  const handleButtonClick = t9;
  let t10;
  $[13] !== open ? (t10 = (event) => {
    open && event.preventDefault();
  }, $[13] = open, $[14] = t10) : t10 = $[14];
  const handleMouseDown = t10;
  let t11;
  $[15] === Symbol.for("react.memo_cache_sentinel") ? (t11 = (event_0) => {
    if (event_0.key === "ArrowDown" || event_0.key === "Enter" || event_0.key === " ") {
      event_0.preventDefault(), setOpen(!0), setShouldFocus("first");
      return;
    }
    if (event_0.key === "ArrowUp") {
      event_0.preventDefault(), setOpen(!0), setShouldFocus("last");
      return;
    }
  }, $[15] = t11) : t11 = $[15];
  const handleButtonKeyDown = t11;
  let t12;
  $[16] !== buttonElement || $[17] !== menuElements ? (t12 = (event_1) => {
    const target = event_1.target;
    if (target instanceof Node && !(buttonElement && (target === buttonElement || buttonElement.contains(target)))) {
      for (const el of menuElements)
        if (target === el || el.contains(target))
          return;
      setOpen(!1);
    }
  }, $[16] = buttonElement, $[17] = menuElements, $[18] = t12) : t12 = $[18];
  const handleMenuClickOutside = t12;
  let t13;
  $[19] !== buttonElement || $[20] !== disableRestoreFocusOnClose ? (t13 = () => {
    setOpen(!1), !disableRestoreFocusOnClose && buttonElement && buttonElement.focus();
  }, $[19] = buttonElement, $[20] = disableRestoreFocusOnClose, $[21] = t13) : t13 = $[21];
  const handleMenuEscape = t13;
  let t14;
  $[22] !== menuElements ? (t14 = (event_2) => {
    const target_0 = event_2.relatedTarget;
    if (target_0 instanceof Node) {
      for (const el_0 of menuElements)
        if (el_0 === target_0 || el_0.contains(target_0))
          return;
      setOpen(!1);
    }
  }, $[22] = menuElements, $[23] = t14) : t14 = $[23];
  const handleBlur = t14;
  let t15;
  $[24] !== buttonElement || $[25] !== disableRestoreFocusOnClose ? (t15 = () => {
    setOpen(!1), !disableRestoreFocusOnClose && buttonElement && buttonElement.focus();
  }, $[24] = buttonElement, $[25] = disableRestoreFocusOnClose, $[26] = t15) : t15 = $[26];
  const handleItemClick = t15;
  let t16;
  $[27] === Symbol.for("react.memo_cache_sentinel") ? (t16 = (el_1) => (setChildMenuElements((els) => els.concat([el_1])), () => setChildMenuElements((els_0) => els_0.filter((_el) => _el !== el_1))), $[27] = t16) : t16 = $[27];
  const registerElement = t16;
  let t17;
  $[28] !== buttonElement || $[29] !== handleBlur || $[30] !== handleItemClick || $[31] !== handleMenuClickOutside || $[32] !== handleMenuEscape || $[33] !== id2 || $[34] !== menuProp || $[35] !== shouldFocus ? (t17 = menuProp && cloneElement(menuProp, {
    "aria-labelledby": id2,
    onBlurCapture: handleBlur,
    onClickOutside: handleMenuClickOutside,
    onEscape: handleMenuEscape,
    onItemClick: handleItemClick,
    originElement: buttonElement,
    registerElement,
    shouldFocus
  }), $[28] = buttonElement, $[29] = handleBlur, $[30] = handleItemClick, $[31] = handleMenuClickOutside, $[32] = handleMenuEscape, $[33] = id2, $[34] = menuProp, $[35] = shouldFocus, $[36] = t17) : t17 = $[36];
  const menu = t17;
  let t18;
  $[37] !== buttonProp || $[38] !== handleMouseDown || $[39] !== id2 || $[40] !== open ? (t18 = buttonProp && cloneElement(buttonProp, {
    "data-ui": "MenuButton",
    id: id2,
    onClick: handleButtonClick,
    onKeyDown: handleButtonKeyDown,
    onMouseDown: handleMouseDown,
    "aria-haspopup": !0,
    "aria-expanded": open,
    ref: setButtonElement,
    selected: buttonProp.props.selected ?? open
  }), $[37] = buttonProp, $[38] = handleMouseDown, $[39] = id2, $[40] = open, $[41] = t18) : t18 = $[41];
  const button = t18;
  let t19, t20;
  $[42] !== buttonElement ? (t19 = () => buttonElement, t20 = [buttonElement], $[42] = buttonElement, $[43] = t19, $[44] = t20) : (t19 = $[43], t20 = $[44]), useImperativeHandle(forwardedRef, t19, t20);
  let t21;
  $[45] !== popover ? (t21 = popover || {}, $[45] = popover, $[46] = t21) : t21 = $[46];
  let t22;
  $[47] !== deprecated_boundaryElement || $[48] !== deprecated_placement || $[49] !== deprecated_popoverRadius || $[50] !== deprecated_popoverScheme || $[51] !== deprecated_portal || $[52] !== deprecated_preventOverflow || $[53] !== t21 ? (t22 = {
    boundaryElement: deprecated_boundaryElement,
    overflow: "auto",
    placement: deprecated_placement,
    portal: deprecated_portal,
    preventOverflow: deprecated_preventOverflow,
    radius: deprecated_popoverRadius,
    scheme: deprecated_popoverScheme,
    ...t21
  }, $[47] = deprecated_boundaryElement, $[48] = deprecated_placement, $[49] = deprecated_popoverRadius, $[50] = deprecated_popoverScheme, $[51] = deprecated_portal, $[52] = deprecated_preventOverflow, $[53] = t21, $[54] = t22) : t22 = $[54];
  const popoverProps = t22;
  let t23;
  $[55] !== button ? (t23 = button || /* @__PURE__ */ jsx(Fragment, {}), $[55] = button, $[56] = t23) : t23 = $[56];
  let t24;
  return $[57] !== menu || $[58] !== open || $[59] !== popoverProps || $[60] !== t23 ? (t24 = /* @__PURE__ */ jsx(Popover, { "data-ui": "MenuButton__popover", ...popoverProps, content: menu, open, children: t23 }), $[57] = menu, $[58] = open, $[59] = popoverProps, $[60] = t23, $[61] = t24) : t24 = $[61], t24;
});
MenuButton.displayName = "ForwardRef(MenuButton)";
function _temp$2(v) {
  return !v;
}
const keyframe = keyframes$1`
  0% {
    background-position: 100%;
  }
  100% {
    background-position: -100%;
  }
`, animation = css`
  background-image: linear-gradient(
    to right,
    var(--card-skeleton-color-from),
    var(--card-skeleton-color-to),
    var(--card-skeleton-color-from),
    var(--card-skeleton-color-from),
    var(--card-skeleton-color-from)
  );
  background-position: 100%;
  background-size: 200% 100%;
  background-attachment: fixed;
  animation-name: ${keyframe};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 2000ms;
`, skeletonStyle = css`
  opacity: ${({
  $visible
}) => $visible ? 1 : 0};
  transition: opacity 200ms ease-in;

  @media screen and (prefers-reduced-motion: no-preference) {
    ${({
  $animated
}) => $animated ? animation : css`
            background-color: var(--card-skeleton-color-from);
          `}
  }

  @media screen and (prefers-reduced-motion: reduce) {
    background-color: var(--card-skeleton-color-from);
  }
`, StyledSkeleton$1 = /* @__PURE__ */ styled(Box).withConfig({
  displayName: "StyledSkeleton",
  componentId: "sc-ebtpni-0"
})(responsiveRadiusStyle, skeletonStyle), Skeleton = forwardRef(function(props, ref) {
  const $ = distExports.c(16);
  let delay2, radius, restProps, t0;
  $[0] !== props ? ({
    animated: t0,
    delay: delay2,
    radius,
    ...restProps
  } = props, $[0] = props, $[1] = delay2, $[2] = radius, $[3] = restProps, $[4] = t0) : (delay2 = $[1], radius = $[2], restProps = $[3], t0 = $[4]);
  const animated = t0 === void 0 ? !1 : t0, [visible, setVisible] = useState(!delay2);
  let t1, t2;
  $[5] !== delay2 ? (t1 = () => {
    if (!delay2)
      return;
    const timeout = setTimeout(() => {
      setVisible(!0);
    }, delay2);
    return () => {
      clearTimeout(timeout);
    };
  }, t2 = [delay2], $[5] = delay2, $[6] = t1, $[7] = t2) : (t1 = $[6], t2 = $[7]), useEffect(t1, t2);
  let t3;
  $[8] !== radius ? (t3 = _getArrayProp(radius), $[8] = radius, $[9] = t3) : t3 = $[9];
  const t4 = delay2 ? visible : !0;
  let t5;
  return $[10] !== animated || $[11] !== ref || $[12] !== restProps || $[13] !== t3 || $[14] !== t4 ? (t5 = /* @__PURE__ */ jsx(StyledSkeleton$1, { ...restProps, $animated: animated, $radius: t3, $visible: t4, ref }), $[10] = animated, $[11] = ref, $[12] = restProps, $[13] = t3, $[14] = t4, $[15] = t5) : t5 = $[15], t5;
});
Skeleton.displayName = "ForwardRef(Skeleton)";
const StyledSkeleton = /* @__PURE__ */ styled(Skeleton).withConfig({
  displayName: "StyledSkeleton",
  componentId: "sc-2p7a1v-0"
})((props) => {
  const {
    $size,
    $style
  } = props, {
    font,
    media
  } = getTheme_v2(props.theme), fontStyle = font[$style];
  return _responsive(media, $size, (sizeIndex) => {
    const fontSize2 = fontStyle.sizes[sizeIndex];
    return {
      height: fontSize2.lineHeight - fontSize2.ascenderHeight - fontSize2.descenderHeight
    };
  });
}), TextSkeleton = forwardRef(function(props, ref) {
  const $ = distExports.c(9);
  let restProps, t0;
  $[0] !== props ? ({
    size: t0,
    ...restProps
  } = props, $[0] = props, $[1] = restProps, $[2] = t0) : (restProps = $[1], t0 = $[2]);
  const size2 = t0 === void 0 ? 2 : t0;
  let t1;
  $[3] !== size2 ? (t1 = _getArrayProp(size2), $[3] = size2, $[4] = t1) : t1 = $[4];
  const $size = t1;
  let t2;
  return $[5] !== $size || $[6] !== ref || $[7] !== restProps ? (t2 = /* @__PURE__ */ jsx(StyledSkeleton, { ...restProps, $size, ref, $style: "text" }), $[5] = $size, $[6] = ref, $[7] = restProps, $[8] = t2) : t2 = $[8], t2;
});
TextSkeleton.displayName = "ForwardRef(TextSkeleton)";
const LabelSkeleton = forwardRef(function(props, ref) {
  const $ = distExports.c(9);
  let restProps, t0;
  $[0] !== props ? ({
    size: t0,
    ...restProps
  } = props, $[0] = props, $[1] = restProps, $[2] = t0) : (restProps = $[1], t0 = $[2]);
  const size2 = t0 === void 0 ? 2 : t0;
  let t1;
  $[3] !== size2 ? (t1 = _getArrayProp(size2), $[3] = size2, $[4] = t1) : t1 = $[4];
  const $size = t1;
  let t2;
  return $[5] !== $size || $[6] !== ref || $[7] !== restProps ? (t2 = /* @__PURE__ */ jsx(StyledSkeleton, { ...restProps, $size, ref, $style: "label" }), $[5] = $size, $[6] = ref, $[7] = restProps, $[8] = t2) : t2 = $[8], t2;
});
LabelSkeleton.displayName = "ForwardRef(LabelSkeleton)";
const HeadingSkeleton = forwardRef(function(props, ref) {
  const $ = distExports.c(9);
  let restProps, t0;
  $[0] !== props ? ({
    size: t0,
    ...restProps
  } = props, $[0] = props, $[1] = restProps, $[2] = t0) : (restProps = $[1], t0 = $[2]);
  const size2 = t0 === void 0 ? 2 : t0;
  let t1;
  $[3] !== size2 ? (t1 = _getArrayProp(size2), $[3] = size2, $[4] = t1) : t1 = $[4];
  const $size = t1;
  let t2;
  return $[5] !== $size || $[6] !== ref || $[7] !== restProps ? (t2 = /* @__PURE__ */ jsx(StyledSkeleton, { ...restProps, $size, ref, $style: "heading" }), $[5] = $size, $[6] = ref, $[7] = restProps, $[8] = t2) : t2 = $[8], t2;
});
HeadingSkeleton.displayName = "ForwardRef(HeadingSkeleton)";
const CodeSkeleton = forwardRef(function(props, ref) {
  const $ = distExports.c(9);
  let restProps, t0;
  $[0] !== props ? ({
    size: t0,
    ...restProps
  } = props, $[0] = props, $[1] = restProps, $[2] = t0) : (restProps = $[1], t0 = $[2]);
  const size2 = t0 === void 0 ? 2 : t0;
  let t1;
  $[3] !== size2 ? (t1 = _getArrayProp(size2), $[3] = size2, $[4] = t1) : t1 = $[4];
  const $size = t1;
  let t2;
  return $[5] !== $size || $[6] !== ref || $[7] !== restProps ? (t2 = /* @__PURE__ */ jsx(StyledSkeleton, { ...restProps, $size, ref, $style: "code" }), $[5] = $size, $[6] = ref, $[7] = restProps, $[8] = t2) : t2 = $[8], t2;
});
CodeSkeleton.displayName = "ForwardRef(CodeSkeleton)";
const TabPanel = forwardRef(function(props, ref) {
  const $ = distExports.c(9);
  let flex, restProps;
  $[0] !== props ? ({
    flex,
    ...restProps
  } = props, $[0] = props, $[1] = flex, $[2] = restProps) : (flex = $[1], restProps = $[2]);
  const t0 = props.tabIndex === void 0 ? 0 : props.tabIndex;
  let t1;
  return $[3] !== flex || $[4] !== props.children || $[5] !== ref || $[6] !== restProps || $[7] !== t0 ? (t1 = /* @__PURE__ */ jsx(Box, { "data-ui": "TabPanel", ...restProps, flex, ref, role: "tabpanel", tabIndex: t0, children: props.children }), $[3] = flex, $[4] = props.children, $[5] = ref, $[6] = restProps, $[7] = t0, $[8] = t1) : t1 = $[8], t1;
});
TabPanel.displayName = "ForwardRef(TabPanel)";
const LOADING_BAR_HEIGHT = 2;
styled(Flex).withConfig({
  displayName: "TextBox",
  componentId: "sc-1rr7rxo-0"
})`overflow-x:auto;`;
const StyledToast = styled(Card).withConfig({
  displayName: "StyledToast",
  componentId: "sc-1rr7rxo-1"
})`pointer-events:all;width:100%;position:relative;overflow:hidden;overflow:clip;&[data-has-duration]{padding-bottom:calc(${LOADING_BAR_HEIGHT}px / 2);}`, LoadingBar = styled.div.withConfig({
  displayName: "LoadingBar",
  componentId: "sc-1rr7rxo-2"
})`display:flex;position:absolute;bottom:0px;top:0px;left:0px;right:0px;pointer-events:none;z-index:-1;overflow:hidden;overflow:clip;background:transparent;align-items:flex-end;will-change:opacity;`;
styled(Card).withConfig({
  displayName: "LoadingBarMask",
  componentId: "sc-1rr7rxo-3"
})`position:absolute;top:0;left:-${LOADING_BAR_HEIGHT}px;right:-${LOADING_BAR_HEIGHT}px;bottom:${LOADING_BAR_HEIGHT}px;z-index:1;`;
const LoadingBarProgress = styled(Card).withConfig({
  displayName: "LoadingBarProgress",
  componentId: "sc-1rr7rxo-4"
})`display:block;height:100%;width:100%;transform-origin:0% 50%;background-color:${(props) => {
  const {
    color: color2
  } = getTheme_v2(props.theme);
  return color2.button.default[props.tone].enabled.bg;
}};`;
motion.create(StyledToast);
motion.create(Flex);
motion.create(Text);
motion.create(LoadingBar);
motion.create(LoadingBarProgress);
createGlobalScopedContext("@sanity/ui/context/toast", null);
styled(Grid).withConfig({
  displayName: "StyledLayer",
  componentId: "sc-1tbwn58-0"
})`box-sizing:border-box;position:fixed;right:0;bottom:0;list-style:none;pointer-events:none;max-width:420px;width:100%;`;
function _findPrevItemElement(state, itemElements, focusedElement) {
  const idx = itemElements.indexOf(focusedElement), els = itemElements.slice(0, idx), len = els.length;
  for (let i = len - 1; i >= 0; i -= 1) {
    const itemKey = els[i].getAttribute("data-tree-key");
    if (!itemKey)
      continue;
    const segments = itemKey.split("/");
    segments.pop();
    const p = [];
    let expanded = !0;
    for (let j = 0; j < segments.length; j += 1) {
      p.push(segments[j]);
      const k = p.join("/");
      if (!state[k]?.expanded) {
        expanded = !1;
        break;
      }
    }
    if (expanded)
      return els[i];
  }
  return null;
}
function _findNextItemElement(state, itemElements, focusedElement) {
  const idx = itemElements.indexOf(focusedElement), els = itemElements.slice(idx), len = itemElements.length;
  for (let i = 1; i < len; i += 1) {
    if (!els[i])
      continue;
    const itemKey = els[i].getAttribute("data-tree-key");
    if (!itemKey)
      continue;
    const segments = itemKey.split("/");
    segments.pop();
    const p = [];
    let expanded = !0;
    for (let j = 0; j < segments.length; j += 1) {
      p.push(segments[j]);
      const k = p.join("/");
      if (!state[k]?.expanded) {
        expanded = !1;
        break;
      }
    }
    if (expanded)
      return els[i];
  }
  return null;
}
function _focusItemElement(el) {
  if (el.getAttribute("role") === "treeitem" && el.focus(), el.getAttribute("role") === "none") {
    const firstChild = el.firstChild;
    firstChild && firstChild instanceof HTMLElement && firstChild.focus();
  }
}
const TreeContext = createGlobalScopedContext("@sanity/ui/context/tree", null), Tree = forwardRef(function(props, forwardedRef) {
  const $ = distExports.c(37);
  let children, onFocus, restProps, t0;
  $[0] !== props ? ({
    children,
    space: t0,
    onFocus,
    ...restProps
  } = props, $[0] = props, $[1] = children, $[2] = onFocus, $[3] = restProps, $[4] = t0) : (children = $[1], onFocus = $[2], restProps = $[3], t0 = $[4]);
  const space = t0 === void 0 ? 1 : t0, ref = useRef(null), [focusedElement, setFocusedElement] = useState(null), focusedElementRef = useRef(focusedElement);
  let t1;
  $[5] === Symbol.for("react.memo_cache_sentinel") ? (t1 = [], $[5] = t1) : t1 = $[5];
  const path = t1;
  let t2;
  $[6] === Symbol.for("react.memo_cache_sentinel") ? (t2 = [], $[6] = t2) : t2 = $[6];
  const [itemElements, setItemElements] = useState(t2);
  let t3;
  $[7] === Symbol.for("react.memo_cache_sentinel") ? (t3 = {}, $[7] = t3) : t3 = $[7];
  const [state, setState] = useState(t3), stateRef = useRef(state);
  let t4;
  $[8] === Symbol.for("react.memo_cache_sentinel") ? (t4 = () => ref.current, $[8] = t4) : t4 = $[8], useImperativeHandle(forwardedRef, t4);
  let t5, t6;
  $[9] !== focusedElement ? (t5 = () => {
    focusedElementRef.current = focusedElement;
  }, t6 = [focusedElement], $[9] = focusedElement, $[10] = t5, $[11] = t6) : (t5 = $[10], t6 = $[11]), useEffect(t5, t6);
  let t7, t8;
  $[12] !== state ? (t7 = () => {
    stateRef.current = state;
  }, t8 = [state], $[12] = state, $[13] = t7, $[14] = t8) : (t7 = $[13], t8 = $[14]), useEffect(t7, t8);
  let t9;
  $[15] === Symbol.for("react.memo_cache_sentinel") ? (t9 = (element, path_0, expanded, selected) => (setState((s) => ({
    ...s,
    [path_0]: {
      element,
      expanded
    }
  })), selected && setFocusedElement(element), () => {
    setState((s_0) => {
      const newState = {
        ...s_0
      };
      return delete newState[path_0], newState;
    });
  }), $[15] = t9) : t9 = $[15];
  const registerItem = t9;
  let t10;
  $[16] === Symbol.for("react.memo_cache_sentinel") ? (t10 = (path_1, expanded_0) => {
    setState((s_1) => {
      const itemState = s_1[path_1];
      return itemState ? {
        ...s_1,
        [path_1]: {
          ...itemState,
          expanded: expanded_0
        }
      } : s_1;
    });
  }, $[16] = t10) : t10 = $[16];
  const setExpanded = t10, t11 = focusedElement || itemElements[0] || null;
  let t12;
  $[17] !== space || $[18] !== state || $[19] !== t11 ? (t12 = {
    version: 0,
    focusedElement: t11,
    level: 0,
    path,
    registerItem,
    setExpanded,
    setFocusedElement,
    space,
    state
  }, $[17] = space, $[18] = state, $[19] = t11, $[20] = t12) : t12 = $[20];
  const contextValue = t12;
  let t13;
  $[21] !== itemElements ? (t13 = (event) => {
    if (focusedElementRef.current) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextEl = _findNextItemElement(stateRef.current, itemElements, focusedElementRef.current);
        nextEl && (_focusItemElement(nextEl), setFocusedElement(nextEl));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevEl = _findPrevItemElement(stateRef.current, itemElements, focusedElementRef.current);
        prevEl && (_focusItemElement(prevEl), setFocusedElement(prevEl));
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const itemKey = focusedElementRef.current.getAttribute("data-tree-key");
        if (!itemKey)
          return;
        const itemState_0 = stateRef.current[itemKey];
        if (!itemState_0)
          return;
        if (itemState_0.expanded)
          setState((s_2) => {
            const itemState_1 = s_2[itemKey];
            return itemState_1 ? {
              ...s_2,
              [itemKey]: {
                ...itemState_1,
                expanded: !1
              }
            } : s_2;
          });
        else {
          const itemPath = itemKey.split("/");
          itemPath.pop();
          const parentKey = itemPath.join("/"), parentState = parentKey && stateRef.current[parentKey];
          parentState && (parentState.element.focus(), setFocusedElement(parentState.element));
        }
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const focusedKey = focusedElementRef.current.getAttribute("data-tree-key");
        if (!focusedKey)
          return;
        stateRef.current[focusedKey]?.expanded || setState((s_3) => {
          const itemState_2 = s_3[focusedKey];
          return itemState_2 ? {
            ...s_3,
            [focusedKey]: {
              ...itemState_2,
              expanded: !0
            }
          } : s_3;
        });
        return;
      }
    }
  }, $[21] = itemElements, $[22] = t13) : t13 = $[22];
  const handleKeyDown = t13;
  let t14;
  $[23] !== onFocus ? (t14 = (event_0) => {
    setFocusedElement(event_0.target), onFocus?.(event_0);
  }, $[23] = onFocus, $[24] = t14) : t14 = $[24];
  const handleFocus = t14;
  let t15;
  $[25] === Symbol.for("react.memo_cache_sentinel") ? (t15 = () => {
    if (!ref.current)
      return;
    const _itemElements = Array.from(ref.current.querySelectorAll('[data-ui="TreeItem"]'));
    setItemElements(_itemElements);
  }, $[25] = t15) : t15 = $[25];
  let t16;
  $[26] !== children ? (t16 = [children], $[26] = children, $[27] = t16) : t16 = $[27], useEffect(t15, t16);
  let t17;
  $[28] !== children || $[29] !== handleFocus || $[30] !== handleKeyDown || $[31] !== restProps || $[32] !== space ? (t17 = /* @__PURE__ */ jsx(Stack, { as: "ul", "data-ui": "Tree", ...restProps, onFocus: handleFocus, onKeyDown: handleKeyDown, ref, role: "tree", space, children }), $[28] = children, $[29] = handleFocus, $[30] = handleKeyDown, $[31] = restProps, $[32] = space, $[33] = t17) : t17 = $[33];
  let t18;
  return $[34] !== contextValue || $[35] !== t17 ? (t18 = /* @__PURE__ */ jsx(TreeContext.Provider, { value: contextValue, children: t17 }), $[34] = contextValue, $[35] = t17, $[36] = t18) : t18 = $[36], t18;
});
Tree.displayName = "ForwardRef(Tree)";
styled(Text).withConfig({
  displayName: "ToggleArrowText",
  componentId: "sc-iiskig-2"
})`& > svg{transition:transform 100ms;}`;
function getRootPages(structure) {
  return Array.isArray(structure) ? structure.reduce((acc, node) => node._type === "jsxPage" || node._type === "markdownPage" || node._type === "multiPage" ? [...acc, node] : acc, []) : [];
}
function getContentPages(structure) {
  return Array.isArray(structure) ? structure.reduce((acc, node) => node._type === "jsxPage" || node._type === "markdownPage" ? [...acc, node] : node._type === "multiPage" ? [...acc, ...node.pages] : acc, []) : [];
}
function getHref(node) {
  return "parentSlug" in node ? `/guide/${node.parentSlug}/${node.slug}` : `/guide/${node.slug}`;
}
const MarkdownStyle = createGlobalStyle`
  .markdown {
    padding-bottom: 1.5rem;
  }

  .markdown table {
    border-collapse: collapse;
  }

  .markdown th {
    background-color: var(--card-code-bg-color);
  }

  .markdown th,
  .markdown td {
    padding: 6px 13px;
    border: 1px solid var(--card-border-color);
  }

  .markdown h2 {
    margin-top: 2.25rem;
  }

  .markdown h3 {
    margin-top: 1.75rem;
  }

  .markdown p {
    line-height: 1.5;
  }

  .markdown blockquote {
    margin: 0 0 2rem;
    padding: 0 1em;
    border-left: 2px solid var(--card-border-color);
  }

  .markdown code {
    display: inline-block;
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
    background-color: var(--card-badge-default-bg-color);
  }

  .markdown img {
    margin-top: 1.5rem;
    max-width: 100%;
    border: 1px solid var(--card-border-color);
  }

  .markdown li {
    margin-bottom: 0.5em;
  }`, Page = ({ page: page2 }) => "component" in page2 ? /* @__PURE__ */ jsx(page2.component, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(MarkdownStyle, {}),
  /* @__PURE__ */ jsx(Markdown, { className: "markdown", remarkPlugins: [remarkGfm], children: page2.markdown })
] }), Inspector = ({
  pages,
  documentType,
  documentId,
  onClose
}) => {
  const activePage = useMemo(
    () => getDocumentPage(documentId, documentType, pages),
    [documentId, documentType, pages]
  );
  return activePage ? /* @__PURE__ */ jsxs(Flex, { height: "fill", padding: 4, overflow: "auto", direction: "column", children: [
    /* @__PURE__ */ jsxs(Flex, { align: "center", paddingY: 2, children: [
      /* @__PURE__ */ jsx(Card, { flex: 1, children: /* @__PURE__ */ jsx(Text, { size: 2, weight: "bold", muted: !0, children: "User guide" }) }),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, children: "Open in guide" }) }),
          placement: "bottom",
          children: /* @__PURE__ */ jsx(
            Button,
            {
              icon: LaunchIcon,
              as: "a",
              mode: "bleed",
              padding: 2,
              href: getHref(activePage),
              style: { cursor: "pointer" }
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, children: "Close pane" }) }),
          placement: "bottom",
          fallbackPlacements: ["bottom-end", "bottom-start"],
          children: /* @__PURE__ */ jsx(
            Button,
            {
              icon: CloseIcon,
              mode: "bleed",
              padding: 2,
              onClick: onClose,
              style: { cursor: "pointer" }
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Page, { page: activePage })
  ] }) : /* @__PURE__ */ jsx(Fragment, {});
}, documentInspector = (pages) => defineDocumentInspector({
  name: "userGuide",
  useMenuItem: ({ documentId, documentType }) => ({
    icon: HelpCircleIcon,
    title: "User Guide",
    hidden: !getDocumentPage(documentId, documentType, pages),
    hotkeys: ["ctrl+shift+h"]
  }),
  component: (props) => createElement(Inspector, { pages, ...props })
});
function getDocumentPage(documentId, documentType, pages) {
  return pages.find((page2) => !!(page2.documentId === documentId || Array.isArray(page2.documentId) && page2.documentId.some((id2) => id2 === documentId) || page2.documentType === documentType || Array.isArray(page2.documentType) && page2.documentType.some((type) => type === documentType)));
}
const Error$1 = ({ error }) => /* @__PURE__ */ jsx(Card, { height: "fill", tone: "critical", padding: 4, children: /* @__PURE__ */ jsx(Flex, { height: "fill", align: "center", children: /* @__PURE__ */ jsxs(Container, { height: "fill", width: 2, children: [
  /* @__PURE__ */ jsx(Text, { size: 4, weight: "bold", children: "Encountered an error while reading the user guide structure" }),
  /* @__PURE__ */ jsx(Card, { marginTop: 4, padding: [3, 3, 4], tone: "critical", radius: 2, shadow: 2, children: /* @__PURE__ */ jsxs(Stack, { space: 5, children: [
    /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
      /* @__PURE__ */ jsx(Text, { size: 2, children: "Error:" }),
      /* @__PURE__ */ jsx(Text, { size: 2, style: { color: "var(--card-badge-critical-fg-color)" }, children: error.message })
    ] }),
    error.url && /* @__PURE__ */ jsx("a", { href: error.url, children: /* @__PURE__ */ jsx(Text, { size: 2, weight: "bold", style: { color: "var(--card-link-color)" }, children: "View documentation" }) })
  ] }) })
] }) }) }), MultiPage = ({
  slug,
  currentPage,
  previousPage,
  nextPage
}) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Page, { page: currentPage }),
  /* @__PURE__ */ jsxs(Flex, { paddingY: 4, justify: "space-between", wrap: "wrap-reverse", gap: 4, children: [
    previousPage ? /* @__PURE__ */ jsx(
      StateLink,
      {
        state: {
          page: slug,
          subPage: previousPage.slug
        },
        children: /* @__PURE__ */ jsx(
          Button,
          {
            text: previousPage.title,
            fontSize: 2,
            paddingY: 3,
            paddingX: 5,
            mode: "ghost",
            icon: ChevronLeftIcon,
            style: { cursor: "pointer" }
          }
        )
      }
    ) : /* @__PURE__ */ jsx(Card, {}),
    nextPage && /* @__PURE__ */ jsx(
      StateLink,
      {
        state: {
          page: slug,
          subPage: nextPage.slug
        },
        children: /* @__PURE__ */ jsx(
          Button,
          {
            text: nextPage.title,
            fontSize: 2,
            paddingY: 3,
            paddingX: 5,
            iconRight: ChevronRightIcon,
            style: { cursor: "pointer" }
          }
        )
      }
    )
  ] })
] }), PageLink = ({
  page: page2,
  subPage,
  title,
  selected,
  icon
}) => {
  const { onClick, href } = useStateLink({
    state: { page: page2, subPage }
  });
  return /* @__PURE__ */ jsx(PreviewCard, { as: "a", href, onClick, radius: 2, selected, children: /* @__PURE__ */ jsx(SanityDefaultPreview, { title, icon }) });
}, PageTree = ({ structure, basePage, activeSlug }) => /* @__PURE__ */ jsx(Stack, { as: "ul", space: 1, children: structure.map((node) => {
  switch (node._type) {
    case "jsxPage":
    case "markdownPage":
    case "multiPage":
      return /* @__PURE__ */ jsx(
        PageLink,
        {
          page: basePage ?? node.slug,
          subPage: basePage ? node.slug : void 0,
          title: node.title,
          selected: node.slug === activeSlug,
          icon: node.icon
        },
        node._key
      );
    case "divider":
      return /* @__PURE__ */ jsx(Card, { borderBottom: !0 }, node._key);
    default:
      return /* @__PURE__ */ jsx(Fragment, {});
  }
}) }), Tool = ({ userGuideStructure }) => {
  const pages = useMemo(() => getRootPages(userGuideStructure), [userGuideStructure]), { page: page2, subPage } = useRouterState((state) => state), currentPage = useMemo(() => pages.find((p) => p.slug === page2), [page2, pages]), currentSubPageIndex = useMemo(
    () => currentPage && "pages" in currentPage ? currentPage.pages.findIndex((p) => p.slug === subPage) : -1,
    [currentPage, subPage]
  );
  return Array.isArray(userGuideStructure) ? /* @__PURE__ */ jsxs(Flex, { height: "fill", align: "flex-start", children: [
    /* @__PURE__ */ jsx(Container, { height: "fill", width: 0, overflow: "auto", children: /* @__PURE__ */ jsxs(Card, { height: "fill", paddingX: 3, borderRight: !0, children: [
      /* @__PURE__ */ jsx(Box, { padding: 2, paddingTop: 5, marginBottom: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, weight: "bold", muted: !0, children: "Guide" }) }),
      /* @__PURE__ */ jsx(PageTree, { structure: userGuideStructure, activeSlug: page2 })
    ] }) }),
    currentPage && currentPage._type === "multiPage" && /* @__PURE__ */ jsx(Container, { height: "fill", width: 0, overflow: "auto", children: /* @__PURE__ */ jsxs(Card, { height: "fill", paddingX: 3, borderRight: !0, children: [
      /* @__PURE__ */ jsx(Box, { padding: 2, paddingTop: 5, marginBottom: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, weight: "bold", muted: !0, children: currentPage.title }) }),
      /* @__PURE__ */ jsx(PageTree, { structure: currentPage.pages, basePage: page2, activeSlug: subPage })
    ] }) }),
    /* @__PURE__ */ jsx(Container, { height: "fill", width: 20, overflow: "auto", children: /* @__PURE__ */ jsx(Flex, { padding: 4, direction: "column", align: "center", children: /* @__PURE__ */ jsxs(Container, { width: 2, children: [
      currentPage && currentPage._type !== "multiPage" && /* @__PURE__ */ jsx(Page, { page: currentPage }),
      currentPage && currentPage._type === "multiPage" && currentSubPageIndex >= 0 && /* @__PURE__ */ jsx(
        MultiPage,
        {
          slug: currentPage.slug,
          currentPage: currentPage.pages[currentSubPageIndex],
          previousPage: currentPage.pages[currentSubPageIndex - 1],
          nextPage: currentPage.pages[currentSubPageIndex + 1]
        }
      )
    ] }) }) })
  ] }) : /* @__PURE__ */ jsx(Error$1, { error: userGuideStructure });
}, router = route.create("/", [
  route.create({
    path: "/:page"
  }),
  route.create({
    path: "/:page/:subPage"
  })
]), userGuidePlugin = definePlugin((options) => ({
  name: "sanity-plugin-user-guide",
  tools: [
    {
      title: "Guide",
      name: "guide",
      component: () => Tool(options),
      router
    }
  ],
  document: {
    inspectors: (prev) => [
      ...prev,
      documentInspector(getContentPages(options.userGuideStructure))
    ]
  }
}));
export {
  UserGuideError,
  defineUserGuide,
  distExports,
  divider,
  documentInspector,
  getDocumentPage,
  multiPage,
  page,
  router,
  userGuidePlugin
};
//# sourceMappingURL=index.mjs.map
