import LitsItem from "./ListItem";

interface List {
  list: LitsItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: LitsItem): void;
  removeItem(id: string): void;
  subscribeToStorageEvents(callback: () => void): void;
}
export default class FullList implements List {
  // ? we use this cuz only we have one list in out app
  static instance: FullList = new FullList();

  private constructor(private _list: LitsItem[] = []) {}

  get list(): LitsItem[] {
    return this._list;
  }
  load(): void {
    // Clear existing items to avoid duplicates on reload
    this._list = [];

    const storedList: string | null = localStorage.getItem("myList");
    if (typeof storedList !== "string") return;

    const parsedList: { _id: string; _item: string; _checked: boolean }[] =
      JSON.parse(storedList);

    parsedList.forEach((itemObj) => {
      const newListItem = new LitsItem(
        itemObj._id,
        itemObj._item,
        itemObj._checked
      );
      // Push directly to avoid triggering save() during load
      this._list.push(newListItem);
    });
  }

  subscribeToStorageEvents(callback: () => void): void {
    window.addEventListener("storage", (event: StorageEvent): void => {
      // Only react to changes in our "myList" key
      if (event.key === "myList") {
        this.load();
        callback();
      }
    });
  }

  save(): void {
    localStorage.setItem("myList", JSON.stringify(this._list));
  }

  clearList(): void {
    this._list = [];
    this.save();
  }

  addItem(itemObj: LitsItem): void {
    this._list.push(itemObj);
    this.save();
  }

  removeItem(id: string): void {
    this._list = this._list.filter((item) => item.id !== id);
    this.save();
  }
}
