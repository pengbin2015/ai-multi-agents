Use Context7 to fetch the latest official docs for the StorageEvent API.
Then update this todo-list app so that when items change in one browser tab,
all other open tabs automatically refresh the list.

Touchpoints:

- src/main.ts

- src/models/FullList.ts

Constraints:

- The model owns persistence (no direct localStorage in UI).

- Avoid duplicate items on reload.