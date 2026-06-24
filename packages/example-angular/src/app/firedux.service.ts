import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FireduxStorage, initializeFiredux, executeQueries, z } from "firedux-storage";
import { environment } from "../environments/environment";

@Injectable({ providedIn: "root" })
export class FireduxService implements OnDestroy {
  private store = this.init();

  todos$ = new BehaviorSubject<any[]>([]);
  user$ = new BehaviorSubject<any>(null);

  private unsubscribe: () => void;

  private init() {
    initializeFiredux(environment.firebaseConfig, {
      schemas: {
        todos: z.object({
          title: z.string().min(1),
          status: z.enum(["pending", "completed"]),
        }),
      },
    });

    const store = FireduxStorage.store;

    // Sync Redux state → RxJS observables
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.todos$.next(state.firestore.collection["todos"]?.docs ?? []);
      this.user$.next(state.auth.user);
    });

    // Start real-time listener
    executeQueries([{ queryType: "obtainRealTime", collectionName: "todos", storeAs: "todos" }]);

    return store;
  }

  async addTodo(title: string) {
    return executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title, status: "pending" } },
    ]);
  }

  async deleteTodo(id: string) {
    return executeQueries([
      { queryType: "removeDocument", collectionName: "todos", documentId: id },
    ]);
  }

  signInGoogle() {
    return executeQueries([{ queryType: "signInGoogle" }]);
  }

  signOut() {
    return executeQueries([{ queryType: "signOut" }]);
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }
}
