import { useSQLiteContext } from "expo-sqlite";
import type { SQLiteDatabase } from "expo-sqlite";
import { createContext, use, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppState } from "react-native";

import {
  deleteAllData,
  deleteSchedule,
  deleteTransaction,
  insertSchedule,
  insertTransactions,
  selectSchedules,
  selectTransactions,
  settleSchedule,
  skipSchedule,
  updateSchedule,
  updateTransaction,
} from "./db";
import type {
  Schedule,
  ScheduleInput,
  Transaction,
  TransactionInput,
} from "./types";

interface Data {
  transactions: Transaction[];
  schedules: Schedule[];
}

type TransactionsState =
  | ({ status: "loading" } & Data)
  | ({ status: "ready" } & Data)
  | ({ status: "error"; error: Error } & Data);

interface TransactionsActions {
  reload: () => Promise<void>;
  add: (input: TransactionInput) => Promise<void>;
  addMany: (inputs: TransactionInput[]) => Promise<void>;
  update: (id: number, input: TransactionInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
  addSchedule: (input: ScheduleInput) => Promise<void>;
  updateSchedule: (schedule: Schedule, input: ScheduleInput) => Promise<void>;
  removeSchedule: (id: number) => Promise<void>;
  /** Records the payment/receipt for the schedule's next due date and moves it a month ahead. */
  settle: (schedule: Schedule, input: TransactionInput) => Promise<void>;
  /** Moves the schedule a month ahead without recording anything. */
  skip: (schedule: Schedule) => Promise<void>;
  removeAll: () => Promise<void>;
}

type TransactionsContextValue = TransactionsState & TransactionsActions;

const TransactionsContext = createContext<TransactionsContextValue | null>(
  null
);

const loadData = async (db: SQLiteDatabase): Promise<Data> => {
  const [transactions, schedules] = await Promise.all([
    selectTransactions(db),
    selectSchedules(db),
  ]);
  return { schedules, transactions };
};

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error(String(error));

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const [state, setState] = useState<TransactionsState>({
    schedules: [],
    status: "loading",
    transactions: [],
  });

  const actions = useMemo<TransactionsActions>(() => {
    const reload = async () => {
      try {
        setState({ status: "ready", ...(await loadData(db)) });
      } catch (error) {
        setState((previous) => ({
          ...previous,
          error: toError(error),
          status: "error",
        }));
      }
    };
    // Each write reloads, and throws on failure so callers can keep the user's draft and show the error.
    const thenReload = async (operation: Promise<void>) => {
      await operation;
      await reload();
    };
    return {
      add: (input) => thenReload(insertTransactions(db, [input])),
      addMany: (inputs) => thenReload(insertTransactions(db, inputs)),
      addSchedule: (input) => thenReload(insertSchedule(db, input)),
      reload,
      remove: (id) => thenReload(deleteTransaction(db, id)),
      removeAll: () => thenReload(deleteAllData(db)),
      removeSchedule: (id) => thenReload(deleteSchedule(db, id)),
      settle: (schedule, input) =>
        thenReload(settleSchedule(db, schedule, input)),
      skip: (schedule) => thenReload(skipSchedule(db, schedule)),
      update: (id, input) => thenReload(updateTransaction(db, id, input)),
      updateSchedule: (schedule, input) =>
        thenReload(updateSchedule(db, schedule, input)),
    };
  }, [db]);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const data = await loadData(db);
        if (!cancelled) {
          setState({ status: "ready", ...data });
        }
      } catch (error) {
        if (!cancelled) {
          setState((previous) => ({
            ...previous,
            error: toError(error),
            status: "error",
          }));
        }
      }
    };
    refresh();
    // Re-render on return so "due in N days" labels and the current month stay right after midnight.
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        refresh();
      }
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [db]);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <TransactionsContext value={value}>{children}</TransactionsContext>;
};

export const useTransactions = () => {
  const context = use(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used inside <TransactionsProvider>"
    );
  }
  return context;
};
