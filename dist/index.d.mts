import {DocumentInspector} from 'sanity'
import {ElementType} from 'react'
import {Plugin as Plugin_2} from 'sanity'
import {Router} from 'sanity/router'

declare type BasePage = UserGuideBaseNode & {
  slug: string
  title: string
  documentType?: string | string[]
  documentId?: string | string[]
  parentSlug?: string
  icon?: ElementType
}

export declare function defineUserGuide(structure: UserGuideStructureBuilder): UserGuideStructure

declare type Divider = UserGuideBaseNode & {
  _type: 'divider'
}

export declare const divider: () => DividerBuilder

declare class DividerBuilder extends UserGuideNodeBuilder<Divider> {
  constructor()
  build(): Divider
}

export declare const documentInspector: (pages: UserGuidePage[]) => DocumentInspector

export declare function getDocumentPage(
  documentId: string,
  documentType: string,
  pages: UserGuidePage[],
): UserGuidePage | undefined

declare type JsxPage = BasePage & {
  _type: 'jsxPage'
  component: ElementType
}

declare type MarkdownPage = BasePage & {
  _type: 'markdownPage'
  markdown: string
}

declare type MultiPage = UserGuideBaseNode & {
  _type: 'multiPage'
  pages: UserGuidePage[]
  slug: string
  title: string
  icon?: ElementType
}

export declare const multiPage: () => MultiPageBuilder

declare class MultiPageBuilder extends UserGuideNodeBuilder<MultiPage> {
  private pageBuilders
  constructor()
  title(title: string): MultiPageBuilder
  pages(pages: PageBuilder[]): MultiPageBuilder
  slug(slug: string): MultiPageBuilder
  icon(icon: ElementType): MultiPageBuilder
  build(): MultiPage
}

export declare const page: () => PageBuilder

declare class PageBuilder extends UserGuideNodeBuilder<JsxPage | MarkdownPage> {
  constructor()
  slug(slug: string): PageBuilder
  title(title: string): PageBuilder
  markdown(markdown: string): PageBuilder
  component(component: ElementType): PageBuilder
  icon(icon: ElementType): PageBuilder
  documentType(documentType: string | string[]): PageBuilder
  documentId(documentId: string | string[]): PageBuilder
  build(parentSlug?: string): UserGuidePage
}

declare type PartialNodeWithType<Node extends UserGuideNode> = Partial<Node> & {
  _type: Node['_type']
}

declare type PartialNodeWithTypeAndKey<Node extends UserGuideNode> = Partial<Node> & {
  _type: Node['_type']
  _key: string
}

export declare const router: Router

export declare type UserGuideBaseNode = {
  _type: string
  _key: string
}

export declare class UserGuideError extends Error {
  url?: string
  constructor(msg: string, url?: string)
}

export declare type UserGuideNode = Divider | UserGuidePage | MultiPage

declare abstract class UserGuideNodeBuilder<Node extends UserGuideNode = UserGuideNode> {
  protected node: PartialNodeWithTypeAndKey<Node>
  constructor(node: PartialNodeWithType<Node>)
  abstract build(): Node
}

export declare type UserGuideOptions = {
  userGuideStructure: UserGuideStructure
}

declare type UserGuidePage = JsxPage | MarkdownPage

export declare const userGuidePlugin: Plugin_2<UserGuideOptions>

export declare type UserGuideState = {
  page?: string
  subPage?: string
}

export declare type UserGuideStructure = UserGuideNode[] | UserGuideError

export declare type UserGuideStructureBuilder = UserGuideNodeBuilder[]

export {}
