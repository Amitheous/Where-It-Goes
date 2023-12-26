import { Store, registerInDevtools, useStoreState } from "pullstate";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth/react-native";
import { app, auth, getUserExpenses, addExpense, getUserCategories, deleteExpense, addCategory, updateExpense, addBudget, getUserBudgets } from "./firebaseConfig";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
  expenses: [],
  categories: [],
  budgets: [],
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
    try {
      const budgets = await getUserBudgets(user.uid);
      AuthStore.update((store) => {
        store.budgets = budgets;
      });
    } catch (e) {
      console.log("Error getting user budgets: ", e);
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
    const resp = await createUserWithEmailAndPassword(auth, email, password);

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
      store.expenses.push({ userId: store.user.uid, ...expense, id });
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

export const appUpdateExpense = async (expenseId, expense) => {
  try {
    const success = await updateExpense(expenseId, expense);
    if (success) {
      const newExpenses = AuthStore.useState((s) => s.expenses.map((e) => {
        if (e.id === expenseId) {
          return { ...e, ...expense };
        }
        return e;
      }));
      AuthStore.update((s) => {
        s.expenses = newExpenses;
      });
    }
    return { success };
  } catch (e) {
    return { error: e };
  }
}

export const appAddCategory = async (category) => {
  try {
    const id = await addCategory(category);
    AuthStore.update((store) => {
      store.categories.push({ userId: store.user.uid, id: id, ...category });
    });
    return { id };
  } catch (e) {
    return { error: e };
  }
};

export const appAddBudget = async (budget) => {
  try {
    const id = await addBudget(budget);
    AuthStore.update((store) => {
      store.categories.push({ userId: store.user.uid, id: id, ...budget });
    });
    return { id };
  } catch (e) {
    return { error: e };
  }
};

registerInDevtools({ AuthStore });