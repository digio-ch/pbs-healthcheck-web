export abstract class Adapter<T> {
  abstract adapt(item: any): T;

  adaptArray(items: any[]): T[] {
    const concreteItems: T[] = [];
    for (const item of items) {
      concreteItems.push(this.adapt(item));
    }
    return concreteItems;
  }
}
