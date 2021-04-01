export default class Accordion {
    constructor(element: string, options?: AccordionOptions);
    evtCallbacks: {};
    $accordions: NodeListOf<Element>;
    settings: {
        onCreate: any;
        onOpen: any;
        onClose: any;
        onToggle: any;
    };
    destroy(): void;
    getAccordionLinksAndContent(accordionArea: Element): Array<HTMLElement[]>;
    addEventListener(element: Element, evtName: string, callback: EventListenerOrEventListenerObject): void;
    removeAllEventListeners(): void;
    setupAccordion(accordionArea: Element, accordionAreaIndex: number): void;
    openAccordionItem(accordionLink: Element, accordionContent: Element): void;
    closeAccordionItem(accordionLink: Element, accordionContent: Element): void;
    toggleAccordionItem(event: object): void;
    accessKeyBindings(accordionLinks: HTMLElement[], selectedElement: Element, key: number, event: object): void;
}
export type AccordionOptions = {
    onCreate?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    onToggle?: () => void;
};
