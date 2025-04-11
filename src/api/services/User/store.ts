import { makeAutoObservable, runInAction } from "mobx";
import {
  ActionError,
  ActionResultStatus,
  ActionSuccess,
} from "../../../types/global";
import { resultOrError, ResultOrErrorResponse } from "../../../utils/global";

export interface User {
  firstName?: string;
  lastName?: string;
  eMail?: string;
}

export default class UserStore {
  user: User | null = null;

  // init function
  constructor() {
    makeAutoObservable(this, {
      getOwnUser: true, // Explicitly mark getOwnUser as an action to make sure makeAutoObservable detects method if MobX is in strict mode (enforceActions: "always")
    });
  }

  // actions
  async getOwnUser() {
    try {
      const [result, error] = (await resultOrError(
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                firstName: "Aria",
                lastName: "Test",
                eMail: "linda.bolt@osapiens.com",
              }),
            500
          )
        )
      )) as ResultOrErrorResponse<User>;

      if (error) {
        return {
          status: ActionResultStatus.ERROR,
          error,
        } as ActionError;
      }

      if (result) {
        runInAction(() => {
          this.user = result;
        });

        return {
          status: ActionResultStatus.SUCCESS,
          result: result,
        } as ActionSuccess<User>;
      }
    } catch (e) {
      return {
        status: ActionResultStatus.ERROR,
        error: "Something went wrong.",
      } as ActionError;
    }
  }
}
