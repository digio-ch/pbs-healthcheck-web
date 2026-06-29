import { effect, ElementRef, signal, Signal } from '@angular/core';

/**
 * Tracks the client size of the given element
 * @param targetElement - The element that will be observed
 */
export function useElementSize(
    targetElement: Signal<ElementRef>,
): Signal<[number, number]> {
    const size = signal<[number, number]>([0, 0]);
    
    effect((onCleanup) => {
        const elementRef = targetElement();
        if (!elementRef) {
            return;
        }

        const nativeElement = elementRef.nativeElement;

        if (!nativeElement) {
            return;
        }

        // Create observer and update the width signal when the target element resizes
        const observer = new ResizeObserver(() => {
            size.set([nativeElement.clientWidth, nativeElement.clientHeight]);
        });

        // Start observing the target element for resizing
        observer.observe(nativeElement);

        onCleanup(() => {
            observer.disconnect();
        });
    });

    return size.asReadonly();
}