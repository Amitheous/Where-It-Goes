import { Store, registerInDevtools, useStoreState } from "pullstate";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth/react-native";
import { app, auth, getUserExpenses, addExpense, getUserCategories, deleteExpense } from "./firebaseConfig";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
  expenses: [],
  categories: []
});

const unsub = onAuthStateChanged(auth, async (user) => {
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
  if (user) {
    try {
      const expenses = await getUserExpenses(user.uid);
      AuthStore.update((store) => {
        store.expenses = expenses;
      });
    } catch (e) {
      console.log("Error getting user expenses: ", e);
    }
    try {
      const categories = await getUserCategories(user.uid);
      AuthStore.update((store) => {
        store.categories = categories;
      });
    } catch (e) {
      console.log("Error getting user categories: ", e);
    }
  }
});

export const updateNewExpenses = async (user) => {
  try {
    const expenses = await getUserExpenses(user.uid);
    AuthStore.update((store) => {
      store.expenses = expenses;
    });
  } catch (e) {
    console.log("Error getting user expenses: ", e);
  }
};

export const appSignIn = async (email, password) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    AuthStore.update((store) => {
      store.user = resp.user;
      store.isLoggedIn = resp.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (email, password, name) => {
  try {
    // this will trigger onAuthStateChange to update the store..
    const resp = await createUserWithEmailAndPassword(auth, email, password);

    // add the displayName
    await updateProfile(resp.user, { displayName: name });

    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appAddExpense = async (expense) => {
  try {
    const id = await addExpense(expense);
    AuthStore.update((store) => {
      store.expenses.push({ userId: store.user.uid, ...expense });
    });
    return { id };
  } catch (e) {
    return { error: e };
  }
};

export const appDeleteExpense = async (expenseId) => {
  try {
    const success = await deleteExpense(expenseId);
    if (success) {
      const newExpenses = AuthStore.useState((s) => s.expenses.filter((expense) => expense.id !== expenseId));
      AuthStore.update((s) => {
        s.expenses = newExpenses;
      });
    }
    return { success };
  } catch (e) {
    return { error: e };
  }
}


registerInDevtools({ AuthStore });