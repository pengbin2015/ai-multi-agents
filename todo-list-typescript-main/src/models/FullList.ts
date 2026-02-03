import LitsItem from "./ListItem";

const STORAGE_KEY = "myList";

interface List {
  list: LitsItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: LitsItem): void;
  removeItem(id: string): void;
  subscribeToStorageEvents(onStorageChange: () => void): void;
}
export default class FullList implements List {
  // ? we use this cuz only we have one list in out app
  static instance: FullList = new FullList();

  private _isSubscribed: boolean = false;

  private constructor(private _list: LitsItem[] = []) {}

  get list(): LitsItem[] {
    return this._list;
  }
  load(): void {
    // Clear existing items to avoid duplicates on reload
    this._list = [];

    const storedList: string | null = localStorage.getItem(STORAGE_KEY);
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

  subscribeToStorageEvents(onStorageChange: () => void): void {
    // Prevent multiple subscriptions
    if (this._isSubscribed) return;
    this._isSubscribed = true;

    window.addEventListener("storage", (event: StorageEvent): void => {
      // Only react to changes in our storage key
      if (event.key === STORAGE_KEY) {
        this.load();
        onStorageChange();
      }
    });
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._list));
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
